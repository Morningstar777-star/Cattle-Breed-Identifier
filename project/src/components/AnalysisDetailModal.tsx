import React from 'react';
import { X, Download, Share2, Activity, Calendar, Scale } from 'lucide-react';
import { GeminiAnalysis } from '../services/geminiService';

interface AnalysisDetailModalProps {
  analysis: GeminiAnalysis | null;
  imageUrl: string;
  onClose: () => void;
}

const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({ analysis, imageUrl, onClose }) => {
  if (!analysis) return null;

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

  const cleanWeight = (w?: string) => (w ? w.split('(')[0].trim() : 'N/A');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/90 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-12 h-[80vh] overflow-hidden">
            {/* Image Section */}
            <div className="md:col-span-5 bg-gray-100 relative">
              <img 
                src={imageUrl} 
                alt="Cattle analysis" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-2xl font-bold text-white">{analysis.breed}</h2>
                <p className="text-emerald-300">{analysis.species} • {analysis.origin}</p>
                <div className="mt-2 flex items-center">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                    {analysis.confidence}% Confidence
                  </span>
                </div>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:col-span-7 p-6 overflow-y-auto">
              {/* Health Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Health Assessment</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getHealthColor(analysis.healthAssessment.status)}`}>
                    {analysis.healthAssessment.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{analysis.healthAssessment.notes}</p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysis.healthAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-sm text-blue-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Physical Traits */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Traits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Age</span>
                    </div>
                    <p className="font-medium">{analysis.estimatedAge || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Scale className="w-4 h-4 mr-2" />
                      <span className="text-sm">Weight</span>
                    </div>
                    <p className="font-medium">{cleanWeight(analysis.weightEstimate)}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Activity className="w-4 h-4 mr-2" />
                      <span className="text-sm">Body Condition</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${(analysis.bodyConditionScore || 0) * 20}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{analysis.bodyConditionScore}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Breed Characteristics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Breed Characteristics</h3>
                <div className="space-y-2">
                  {analysis.traits.map((trait, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-emerald-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex space-x-3">
                <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Report</span>
                </button>
                <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetailModal;
