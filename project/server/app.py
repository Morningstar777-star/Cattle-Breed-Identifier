import io
import json
import os
import logging
from typing import List, Dict, Any
import asyncio

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms, models
from default_api import google_web_search

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Cattle Breed Classifier")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SERVER_DIR.parent
WORKSPACE_DIR = PROJECT_DIR.parent

# Default paths checked in order
DEFAULT_MODEL_PATHS: List[str] = [
    str(WORKSPACE_DIR / "best_cattle_breed_model.pth"),
    str(WORKSPACE_DIR / "final_cattle_breed_model.pth"),
    str(PROJECT_DIR / "best_cattle_breed_model.pth"),
    str(PROJECT_DIR / "final_cattle_breed_model.pth"),
    str(SERVER_DIR / "best_cattle_breed_model.pth"),
    str(SERVER_DIR / "final_cattle_breed_model.pth"),
    r"C:\Users\Yash\Desktop\Other Pojects\Breed\best_cattle_breed_model.pth",
    r"C:\Users\Yash\Desktop\Other Pojects\Breed\final_cattle_breed_model.pth",
    r"C:\Users\Yash\Desktop\Breed\best_cattle_breed_model.pth",
    r"C:\Users\Yash\Desktop\Breed\final_cattle_breed_model.pth",
]

DEFAULT_CLASS_NAMES_PATHS: List[str] = [
    str(WORKSPACE_DIR / "class_names.json"),
    str(PROJECT_DIR / "class_names.json"),
    str(SERVER_DIR / "class_names.json"),
    r"C:\Users\Yash\Desktop\Other Pojects\Breed\class_names.json",
    r"C:\Users\Yash\Desktop\Breed\class_names.json",
]

MODEL_PATH = os.getenv("CATTLE_MODEL_PATH") or next((p for p in DEFAULT_MODEL_PATHS if os.path.exists(p)), None)
CLASS_NAMES_PATH = os.getenv("CATTLE_CLASS_NAMES") or next((p for p in DEFAULT_CLASS_NAMES_PATHS if os.path.exists(p)), None)

model = None
class_names: List[str] = []
device = torch.device("cpu")

# Preprocessing - adjust if your training used different transforms
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


class CattleClassifierModel(torch.nn.Module):
    def __init__(self, num_classes: int = 41):
        super().__init__()
        self.backbone = models.resnet18(weights=None)
        self.backbone.fc = torch.nn.Sequential(
            torch.nn.Dropout(0.2),
            torch.nn.Linear(512, 512),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.2),
            torch.nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)


def _strip_module_prefix(state_dict: dict) -> dict:
    # Some checkpoints are saved from DDP and have 'module.' prefixes
    new_sd = {}
    for k, v in state_dict.items():
        nk = k
        if k.startswith('module.'):
            nk = k[len('module.'):]
        new_sd[nk] = v
    return new_sd


def load_model():
    global model, class_names
    logger.info(f"Attempting to load model from: {MODEL_PATH}")
    if MODEL_PATH is None or not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found. Checked: {DEFAULT_MODEL_PATHS}")

    # Load class names from file if exists
    if CLASS_NAMES_PATH and os.path.exists(CLASS_NAMES_PATH):
        with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict) and "classes" in data:
                class_names = data["classes"]
            elif isinstance(data, list):
                class_names = data
            else:
                raise RuntimeError("class_names.json should be a list or an object with 'classes'")
        logger.info(f"Loaded {len(class_names)} class names from {CLASS_NAMES_PATH}.")

    # Try eager torch.load first
    mdl = None
    ckpt = None
    try:
        obj = torch.load(MODEL_PATH, map_location=device)
        if isinstance(obj, torch.nn.Module):
            mdl = obj
            logger.info("Model loaded successfully via torch.load (eager).")
        elif isinstance(obj, dict):
            ckpt = obj
            logger.info("Checkpoint loaded successfully via torch.load.")
            if not class_names and "class_names" in ckpt:
                class_names = ckpt["class_names"]
                logger.info(f"Loaded {len(class_names)} class names from checkpoint.")
    except Exception as e:
        logger.warning(f"Eager torch.load failed: {e}")
        mdl = None

    # If it's a plain checkpoint dict, try to reconstruct a model
    if mdl is None and ckpt is not None:
        sd = ckpt.get('state_dict') or ckpt.get('model_state_dict') or ckpt
        sd = _strip_module_prefix(sd)
        num_classes = len(class_names) if class_names else ckpt.get('num_classes', 41)

        # Check if model has backbone prefix
        has_backbone = any(k.startswith('backbone.') for k in sd.keys())
        if has_backbone:
            logger.info("Detected backbone-based model architecture. Reconstructing CattleClassifierModel.")
            try:
                base = CattleClassifierModel(num_classes)
                base.load_state_dict(sd, strict=True)
                logger.info("CattleClassifierModel loaded successfully with strict=True.")
                mdl = base
            except Exception as e:
                logger.warning(f"Strict loading for CattleClassifierModel failed: {e}. Trying strict=False.")
                base = CattleClassifierModel(num_classes)
                base.load_state_dict(sd, strict=False)
                mdl = base

        if mdl is None:
            arch = (ckpt.get('arch') or ckpt.get('model_name') or 'resnet18').lower()
            logger.info(f"Attempting to reconstruct model from checkpoint with architecture: {arch}")
            try:
                if arch.startswith('resnet') and hasattr(models, arch):
                    base = getattr(models, arch)(weights=None)
                    in_features = base.fc.in_features
                    base.fc = torch.nn.Linear(in_features, num_classes)
                else:
                    logger.warning(f"Unknown or unsupported architecture '{arch}'. Falling back to resnet18.")
                    base = models.resnet18(weights=None)
                    in_features = base.fc.in_features
                    base.fc = torch.nn.Linear(in_features, num_classes)
                
                try:
                    base.load_state_dict(sd, strict=True)
                    logger.info("State dict loaded successfully with strict=True.")
                except RuntimeError as e:
                    logger.warning(f"Strict loading failed: {e}. Attempting non-strict loading.")
                    base.load_state_dict(sd, strict=False)
                    logger.info("State dict loaded with strict=False.")
                mdl = base

            except Exception as e:
                logger.error(f"Failed to reconstruct model from checkpoint: {e}")
                mdl = None

    # Final fallback: TorchScript
    if mdl is None:
        try:
            logger.info("Attempting to load model as a TorchScript object.")
            mdl = torch.jit.load(MODEL_PATH, map_location=device)
            logger.info("Model loaded successfully as TorchScript.")
        except Exception as e:
            raise RuntimeError(f"Failed to load model (tried eager, checkpoint, and scripted): {e}")

    mdl.eval()
    return mdl


async def get_breed_info(breed_name: str) -> Dict[str, Any]:
    """Gets detailed information about a cattle breed using Google Search and returns a structured dictionary."""
    prompt = f"""Provide a JSON object with details for the cattle breed '{breed_name}'. The JSON should have these keys:
- species (e.g., "Bos taurus", "Bos indicus")
- origin (e.g., "Scotland, UK")
- traits (a list of 3-5 key characteristics, e.g., ["Hardy", "Good maternal instincts"])
- description (a 2-3 sentence overview)
- diseases (a list of 2-3 common diseases with 'name' and 'risk' [Low, Medium, High])
- care (a dictionary with 'feeding', 'housing', and 'veterinary' recommendations)
- marketValue (a dictionary with 'milkYield', 'price', and 'demand')

Example for 'Angus':
{{
  "species": "Bos taurus",
  "origin": "Scotland, UK",
  "traits": ["Excellent beef quality", "Black or red color", "Good mothering ability"],
  "description": "Angus are renowned for their high-quality marbled beef...",
  "diseases": [ {{\"name\": "Pinkeye", \"risk\": "Medium"}}, {{\"name\": "Blackleg", \"risk\": "Low"}} ],
  "care": {{ "feeding": "...", "housing": "...", "veterinary": "..." }},
  "marketValue": {{ "milkYield": "Low", "price": "High (for beef)", "demand": "High" }}
}}
"""
    try:
        logger.info(f"Searching for structured information on: {breed_name}")
        import inspect
        if inspect.iscoroutinefunction(google_web_search):
            search_results = await google_web_search(query=prompt)
        else:
            loop = asyncio.get_event_loop()
            search_results = await loop.run_in_executor(
                None,
                lambda: google_web_search(query=prompt)
            )

        items = []
        if search_results and isinstance(search_results, dict):
            if isinstance(search_results.get('items'), list):
                items = search_results['items']
            elif search_results.get('google_web_search_response') and isinstance(search_results['google_web_search_response'].get('results'), list):
                items = search_results['google_web_search_response']['results']

        # Find the most likely JSON object in the snippets
        for result in items:
            snippet = result.get('snippet', '')
            try:
                # The model might return JSON within a larger string, so we find the first '{' and last '}'
                start = snippet.find('{')
                end = snippet.rfind('}')
                if start != -1 and end != -1:
                    json_str = snippet[start:end+1]
                    data = json.loads(json_str)
                    # Basic validation
                    if 'species' in data and 'origin' in data:
                        logger.info(f"Successfully parsed structured data for {breed_name}")
                        return data
            except json.JSONDecodeError:
                continue  # Try the next snippet

        logger.warning(f"Could not parse structured JSON for {breed_name}. Returning default.")
        return get_default_breed_info()

    except Exception as e:
        logger.error(f"Error fetching breed info for {breed_name}: {e}")
        return get_default_breed_info()

def get_default_breed_info() -> Dict[str, Any]:
    """Returns a default structure for breed information when the API fails."""
    return {
        "species": "Not available",
        "origin": "Not available",
        "traits": [],
        "description": "No detailed information could be retrieved at this time.",
        "diseases": [],
        "care": {
            "feeding": "Not available",
            "housing": "Not available",
            "veterinary": "Not available"
        },
        "marketValue": {
            "milkYield": "Not available",
            "price": "Not available",
            "demand": "Not available"
        }
    }

@app.on_event("startup")
async def _startup():
    global model
    model = load_model()


@app.get("/health")
async def health():
    return {"status": "ok", "model": os.path.basename(MODEL_PATH) if MODEL_PATH else None}


@app.post("/classify")
async def classify(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    with torch.no_grad():
        tensor = preprocess(image).unsqueeze(0)
        logits = model(tensor)
        if isinstance(logits, (list, tuple)):
            logits = logits[0]
        probs = F.softmax(logits, dim=1).cpu().numpy()[0]
        top_idx = int(probs.argmax())
        top_conf = float(probs[top_idx])
        
        breed_name = class_names[top_idx] if top_idx < len(class_names) else str(top_idx)

        # Get detailed breed info
        breed_info = await get_breed_info(breed_name)

        # Top-3
        top3_idx = probs.argsort()[-3:][::-1]
        top3 = [
            {
                "label": class_names[i] if i < len(class_names) else str(i),
                "confidence": round(float(probs[i]) * 100, 2),
            }
            for i in top3_idx
        ]

    return {
        "breed": breed_name,
        "confidence": round(top_conf * 100, 2),
        "top3": top3,
        **breed_info,
    }


# Serve the React frontend build at root if available
from fastapi.staticfiles import StaticFiles

DIST_DIR = PROJECT_DIR / "dist"
if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    logger.info(f"Mounting static frontend build from {DIST_DIR}")
    app.mount("/", StaticFiles(directory=str(DIST_DIR), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
