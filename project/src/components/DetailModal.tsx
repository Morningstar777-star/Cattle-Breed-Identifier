import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, AlertTriangle, Heart, DollarSign, Calendar, Shield, MapPin, Info } from 'lucide-react';

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

interface DetailModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'breed' | 'diseases' | 'care' | 'market'>('breed');

  const tabs = [
    { id: 'breed', label: 'Breed Info', icon: Award },
    { id: 'diseases', label: 'Health Risks', icon: AlertTriangle },
    { id: 'care', label: 'Care Guide', icon: Heart },
    { id: 'market', label: 'Market Value', icon: DollarSign }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <div className="h-64 overflow-hidden">
            <img 
              src={result.image} 
              alt={result.breed}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{result.breed}</h2>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {result.origin}
                  </span>
                  <span className="flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    {result.species}
                  </span>
                </div>
              </div>
              <div className={`px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full ${getConfidenceColor(result.confidence)}`}>
                <span className="text-white font-bold">{result.confidence}% confident</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-colors relative ${
                  activeTab === id
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'breed' && (
              <motion.div
                key="breed"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Breed Characteristics</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-medium text-emerald-800 mb-2">Origin</h4>
                      <p className="text-emerald-700">{result.origin}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Species</h4>
                      <p className="text-blue-700">{result.species}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Traits</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {result.traits.map((trait, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Award className="w-5 h-5 text-emerald-500" />
                        <span className="text-gray-700">{trait}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'diseases' && (
              <motion.div
                key="diseases"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Health Risks</h3>
                {result.diseases.map((disease, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getRiskColor(disease.risk)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{disease.name}</h4>
                      <span className="text-xs font-medium px-2 py-1 rounded">
                        {disease.risk} Risk
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{disease.prevention}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'care' && (
              <motion.div
                key="care"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🌾</span>
                      <h4 className="font-semibold text-green-800">Feeding</h4>
                    </div>
                    <p className="text-green-700">{result.care.feeding}</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🏠</span>
                      <h4 className="font-semibold text-blue-800">Housing</h4>
                    </div>
                    <p className="text-blue-700">{result.care.housing}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Veterinary Care</h4>
                    </div>
                    <p className="text-purple-700">{result.care.veterinary}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'market' && (
              <motion.div
                key="market"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">🥛</div>
                    <h4 className="font-semibold text-emerald-800 mb-1">Daily Milk Yield</h4>
                    <p className="text-lg font-bold text-emerald-600">{result.marketValue.milkYield}</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <h4 className="font-semibold text-blue-800 mb-1">Market Price</h4>
                    <p className="text-lg font-bold text-blue-600">{result.marketValue.price}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <h4 className="font-semibold text-purple-800 mb-1">Market Demand</h4>
                    <p className="text-lg font-bold text-purple-600">{result.marketValue.demand}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Investment Insights</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      High-producing breed with consistent milk yield
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Strong market demand in dairy regions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Good return on investment for dairy operations
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailModal;