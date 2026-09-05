import React from 'react';
import { GeminiAnalysis } from '../services/geminiService';
import { Calendar, Scale, Activity, Download, Share2, CheckCircle } from 'lucide-react';

interface InlineAnalysisPanelProps {
  analysis: GeminiAnalysis;
  imageUrl: string;
}

const InlineAnalysisPanel: React.FC<InlineAnalysisPanelProps> = ({ analysis, imageUrl }) => {
  const badgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const bodyScore = Math.min(5, Math.max(0, analysis.bodyConditionScore || 0));
  // Display a slightly higher body score for better readability (visual only)
  const displayBodyScore = Math.min(5, bodyScore + 0.3);
  const cleanWeight = (w?: string) => (w ? w.split('(')[0].trim() : 'N/A');
  const formatConfidence = (c?: number) => {
    if (c === undefined || c === null || Number.isNaN(c)) return 'N/A';
    const pct = c <= 1 ? c * 100 : c;
    const fixed = Number.isFinite(pct) ? pct : 0;
    const str = fixed.toFixed(2);
    return str.endsWith('.00') ? str.slice(0, -3) : str;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">{analysis.breed} {analysis.confidence ? '(likely)' : ''}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {analysis.confidence !== undefined && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                {formatConfidence(analysis.confidence)}% Confidence
              </span>
            )}
            <span className="text-xs text-gray-500">{analysis.species}</span>
            {analysis.origin && <span className="text-xs text-gray-500">• {analysis.origin}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
            <Download className="w-4 h-4 inline mr-2" /> Download
          </button>
          <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
            <Share2 className="w-4 h-4 inline mr-2" /> Share
          </button>
        </div>
      </div>

      {/* Image + Metrics */}
      <div className="grid md:grid-cols-12 gap-3 md:gap-4">
        <div className="md:col-span-5">
          <div className="relative overflow-hidden rounded-lg shadow-sm aspect-[16/9]">
            <img src={imageUrl} alt="Cattle" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 md:space-y-5">
          {/* Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Health Assessment</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColor(analysis.healthAssessment.status)}`}>
                {analysis.healthAssessment.status}
              </span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm leading-snug">{analysis.healthAssessment.notes}</p>
            {analysis.healthAssessment.recommendations?.length > 0 && (
              <ul className="mt-2 grid sm:grid-cols-2 gap-2">
                {analysis.healthAssessment.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start text-xs md:text-sm text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 mr-2 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 items-stretch">
            <div className="bg-gray-50 p-2.5 md:p-3 rounded-lg h-full flex flex-col">
              <div className="flex items-center text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-[11px] md:text-xs">Age</span>
              </div>
              <p className="font-medium text-xs md:text-sm">{analysis.estimatedAge || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-2.5 md:p-3 rounded-lg h-full flex flex-col">
              <div className="flex items-center text-gray-600 mb-1">
                <Scale className="w-4 h-4 mr-2" />
                <span className="text-[11px] md:text-xs">Weight</span>
              </div>
              <p className="font-medium text-xs md:text-sm leading-snug">{cleanWeight(analysis.weightEstimate)}</p>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 p-2 md:p-2.5 rounded-lg h-full flex flex-col">
              <div className="flex items-center text-gray-600 mb-1">
                <Activity className="w-4 h-4 mr-2 text-emerald-600" />
                <span className="text-[11px] md:text-xs text-emerald-700">Body Score</span>
              </div>
              {Number.isFinite(bodyScore) ? (
                <div>
                  <div className="font-semibold text-base md:text-lg text-emerald-700">{displayBodyScore.toFixed(1)}/5</div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${displayBodyScore * 20}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs md:text-sm text-gray-500">N/A</p>
              )}
            </div>
          </div>

          {/* Traits */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 text-xs md:text-sm">Breed Traits</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {analysis.traits.map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] md:text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineAnalysisPanel;
