import React from 'react';
import { GeminiAnalysis } from '../services/geminiService';
import { Activity } from 'lucide-react';

interface AnalysisCardProps {
  analysis: GeminiAnalysis;
  imageUrl: string;
  onViewDetails: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, imageUrl, onViewDetails }) => {
  const getHealthColor = (status: string) => {
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

  const formatConfidence = (c?: number) => {
    if (c === undefined || c === null || Number.isNaN(c)) return 'N/A';
    const pct = c <= 1 ? c * 100 : c;
    const str = pct.toFixed(2);
    return str.endsWith('.00') ? str.slice(0, -3) : str;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col min-h-[23rem]">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Cattle analysis" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white truncate">{analysis.breed}</h3>
          <div className="flex items-center mt-1">
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
              {formatConfidence(analysis.confidence)}% Confidence
            </span>
          </div>
          {/* Quick glance chips (desktop only) */}
          <div className="hidden md:flex gap-2 mt-2">
            {analysis.estimatedAge && (
              <span className="px-2 py-0.5 rounded-full text-xs text-white/90 bg-white/10 border border-white/20 backdrop-blur-sm">
                {analysis.estimatedAge}
              </span>
            )}
            {analysis.weightEstimate && (
              <span className="px-2 py-0.5 rounded-full text-xs text-white/90 bg-white/10 border border-white/20 backdrop-blur-sm">
                {analysis.weightEstimate.split('(')[0].trim()}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Species / origin quick line */}
        <div className="text-xs text-gray-500 mb-3">
          {analysis.species}
          {analysis.origin ? ` • ${analysis.origin}` : ''}
        </div>

        {/* Top traits chips (no duplication of age/weight here) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {analysis.traits.slice(0, 3).map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthColor(analysis.healthAssessment.status)}`}>
              {analysis.healthAssessment.status}
            </span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <div className="w-20 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div className="h-1.5 bg-emerald-500" style={{ width: `${(analysis.bodyConditionScore || 0) * 20}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-700">{analysis.bodyConditionScore ? `${analysis.bodyConditionScore}/5` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Mobile-only view details button (desktop shows inline panel) */}
        <div className="flex justify-between items-center lg:hidden mt-3">
          <button 
            onClick={onViewDetails}
            className="text-sm font-semibold px-3 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-md transition-all"
          >
            View Full Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
