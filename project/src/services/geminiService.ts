// Ensure this environment variable is set in your .env file
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Please set VITE_GEMINI_API_KEY in your .env file');
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiAnalysis {
  breed: string;
  confidence: number;
  species: string;
  origin: string;
  traits: string[];
  healthAssessment: {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    notes: string;
    recommendations: string[];
  };
  estimatedAge?: string;
  weightEstimate?: string;
  bodyConditionScore?: number;
}

export interface GeminiDetails {
  species: string;
  origin: string;
  traits: string[];
  healthAssessment: {
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    notes: string;
    recommendations: string[];
  };
  estimatedAge?: string;
  weightEstimate?: string;
  bodyConditionScore?: number;
}

export const generateCattleDetails = async (imageFile: File, breedHint: string): Promise<GeminiDetails> => {
  const base64Image = await fileToBase64(imageFile);

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `An external classifier has identified the cattle breed as: "${breedHint}".
            Do NOT re-classify the breed. Generate only the following fields as valid JSON:
            {
              "species": "string",
              "origin": "string",
              "traits": string[],
              "healthAssessment": { "status": "Excellent|Good|Fair|Poor", "notes": "string", "recommendations": string[] },
              "estimatedAge": "string",
              "weightEstimate": "string",
              "bodyConditionScore": number
            }
            Keep results concise, practical, and realistic.`
          },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image.split(',')[1]
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topK: 32,
      topP: 1,
      maxOutputTokens: 1000,
    }
  };

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data); // Debug log

    let responseText = '';
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.text) {
      responseText = data.text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }

    // Try to extract JSON from markdown code blocks or parse directly
    let jsonString = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/) || 
                     responseText.match(/({[\s\S]*})/);
    
    if (jsonMatch) {
      jsonString = jsonMatch[1] || jsonMatch[0];
    }

    // Clean up the JSON string
    jsonString = jsonString.trim()
      .replace(/^```(?:json)?/, '')
      .replace(/```$/, '')
      .trim();

    const result = JSON.parse(jsonString);
    return result as GeminiDetails;
  } catch (error) {
    console.error('Error generating details with Gemini:', error);
    throw error;
  }
};

export const analyzeCattleImage = async (imageFile: File): Promise<GeminiAnalysis> => {
  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Analyze this cattle image and provide detailed information including:
            1. Breed identification with confidence percentage
            2. Species and origin
            3. Key physical traits
            4. Health assessment (status, notes, recommendations)
            5. Estimated age and weight
            6. Body condition score (1-5)
            
            Format the response as a valid JSON object with the following structure:
            {
              "breed": "string",
              "confidence": number,
              "species": "string",
              "origin": "string",
              "traits": string[],
              "healthAssessment": {
                "status": "string",
                "notes": "string",
                "recommendations": string[]
              },
              "estimatedAge": "string",
              "weightEstimate": "string",
              "bodyConditionScore": number
            }`
          },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image.split(',')[1] // Remove the data URL prefix
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    }
  };

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data); // Debug log

    let responseText = '';
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.text) {
      responseText = data.text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }

    // Try to extract JSON from markdown code blocks or parse directly
    let jsonString = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/) || 
                     responseText.match(/({[\s\S]*})/);
    
    if (jsonMatch) {
      jsonString = jsonMatch[1] || jsonMatch[0];
    }

    // Clean up the JSON string
    jsonString = jsonString.trim()
      .replace(/^```(?:json)?/, '')
      .replace(/```$/, '')
      .trim();

    console.log('Parsed JSON:', jsonString); // Debug log
    const result = JSON.parse(jsonString);
    return result as GeminiAnalysis;
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
