import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, AlertTriangle } from 'lucide-react';

interface AnalysisResult {
  id: string;
  image: string;
  breed: string;
  confidence: number;
  species: string;
  origin: string;
  traits: string[];
  diseases: Array<{
    name: string;
    risk: 'Low' | 'Medium' | 'High';
    prevention: string;
  }>;
  care: {
    feeding: string;
    housing: string;
    veterinary: string;
  };
  marketValue: {
    milkYield: string;
    price: string;
    demand: string;
  };
}

interface ResultCardProps {
  result: AnalysisResult;
  onClick: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onClick }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600 bg-emerald-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const highRiskDiseases = result.diseases.filter(d => d.risk === 'High').length;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={result.image} 
          alt={result.breed}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Confidence badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(result.confidence)}`}>
          {result.confidence}% confident
        </div>

        {/* High risk warning */}
        {highRiskDiseases > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            {highRiskDiseases} high risk
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{result.breed}</h3>
            <p className="text-sm text-gray-600">{result.species} • {result.origin}</p>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" />
        </div>

        {/* Key traits */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {result.traits.slice(0, 2).map((trait, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
              >
                {trait}
              </span>
            ))}
            {result.traits.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{result.traits.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500 mb-1">Milk Yield</p>
            <p className="text-sm font-semibold text-gray-800">{result.marketValue.milkYield}</p>
          </div>
          <div className="text-center">
            <div className="text-emerald-600 mb-1">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">Market Price</p>
            <p className="text-sm font-semibold text-gray-800">{result.marketValue.price}</p>
          </div>
        </div>

        {/* Disease risks */}
        {result.diseases.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Health Risks</p>
            <div className="flex flex-wrap gap-1">
              {result.diseases.slice(0, 3).map((disease, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${getRiskColor(disease.risk)}`}
                >
                  {disease.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="text-sm text-emerald-600 font-medium group-hover:text-emerald-700">
            View detailed report →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;