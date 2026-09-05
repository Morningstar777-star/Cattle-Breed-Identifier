import { classifyCattleImage } from './classifierService';
import { generateCattleDetails, GeminiAnalysis, GeminiDetails, analyzeCattleImage } from './geminiService';

// Hybrid analysis: local classifier provides breed + confidence; Gemini enriches details only.
export async function analyzeImageHybrid(file: File): Promise<GeminiAnalysis> {
  try {
    // 1) Local classifier
    const cls = await classifyCattleImage(file);
    // 2) Gemini details (graceful degradation)
    let details: GeminiDetails | null = null;
    try {
      details = await generateCattleDetails(file, cls.breed);
    } catch (e) {
      console.warn('Gemini details failed, returning classifier-only result.', e);
    }
    // 3) Merge into unified GeminiAnalysis shape
    const merged: GeminiAnalysis = {
      breed: cls.breed,
      confidence: Math.round(cls.confidence * 100) / 100,
      species: details?.species || 'Bos taurus',
      origin: details?.origin || '',
      traits: details?.traits || [],
      healthAssessment: details?.healthAssessment || {
        status: 'Good',
        notes: 'Detailed health notes unavailable right now.',
        recommendations: []
      },
      estimatedAge: details?.estimatedAge,
      weightEstimate: details?.weightEstimate,
      bodyConditionScore: details?.bodyConditionScore,
    };
    return merged;
  } catch (err) {
    console.warn('Hybrid analysis failed, falling back to Gemini only.', err);
    return analyzeCattleImage(file);
  }
}
