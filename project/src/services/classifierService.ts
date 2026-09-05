export interface ClassifierTop {
  label: string;
  confidence: number; // 0..1 or percent? Backend returns 0..1 in top3, but we convert main to percent
}

export interface ClassifierResult {
  breed: string;
  confidence: number; // percent 0..100 from backend
  top3: ClassifierTop[];
}

const DEFAULT_API_BASE = (import.meta as any)?.env?.VITE_CLASSIFIER_API || 'http://127.0.0.1:8000';

export async function classifyCattleImage(file: File, apiBase: string = DEFAULT_API_BASE): Promise<ClassifierResult> {
  const url = `${apiBase.replace(/\/$/, '')}/classify`;
  const form = new FormData();
  form.append('file', file, file.name);

  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    throw new Error(`Classifier error: ${res.status}`);
  }
  const data = await res.json();
  // Normalize top3 confidence to percent if backend returns 0..1
  const top3 = (data.top3 || []).map((t: any) => ({ label: t.label, confidence: t.confidence }));
  return {
    breed: data.breed,
    confidence: typeof data.confidence === 'number' && data.confidence <= 1 ? data.confidence * 100 : data.confidence,
    top3,
  };
}
