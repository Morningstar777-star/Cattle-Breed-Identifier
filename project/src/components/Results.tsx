import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Camera } from 'lucide-react';
import { GeminiAnalysis } from '../services/geminiService';
import { analyzeImageHybrid } from '../services/analyzeOrchestrator';
import UploadZone from './UploadZone';
import AnalysisProgress from './AnalysisProgress';
import AnalysisCard from './AnalysisCard';
import AnalysisDetailModal from './AnalysisDetailModal';
import InlineAnalysisPanel from './InlineAnalysisPanel';
import ShootingStars from './ShootingStars';

interface ResultsProps {
  onNavigateToLanding: () => void;
}

interface AnalysisResult extends GeminiAnalysis {
  id: string;
  image: string;
  timestamp: number;
}

const Results: React.FC<ResultsProps> = ({ onNavigateToLanding }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  // Analyze images using Gemini API
  const analyzeImages = useCallback(async (files: File[]) => {
    setIsAnalyzing(true);
    setAnalysisProgress(8); // show immediate progress
    setCurrentStep(0);
    
    try {
      const newResults: AnalysisResult[] = [];
      const total = files.length || 1;
      const chunk = 100 / total;
      
      for (let i = 0; i < files.length; i++) {
        // Step 0: processing
        setCurrentStep(0);
        setAnalysisProgress(Math.min(i * chunk + 15, 99));
        
        let aiInterval: any;
        try {
          const file = files[i];
          const imageUrl = URL.createObjectURL(file);
          
          // Step 1: AI analysis (show smooth progress while awaiting)
          setCurrentStep(1);
          const targetDuringAI = i * chunk + chunk * 0.8;
          aiInterval = setInterval(() => {
            setAnalysisProgress(prev => {
              const next = Math.min(prev + 0.8, targetDuringAI);
              return next;
            });
          }, 150);

          const analysis = await analyzeImageHybrid(file);
          
          // Step 2: report
          setCurrentStep(2);
          setAnalysisProgress(i * chunk + chunk * 0.95);
          
          const result: AnalysisResult = {
            id: `result-${Date.now()}-${i}`,
            image: imageUrl,
            timestamp: Date.now(),
            ...analysis
          };
          
          newResults.push(result);
          setResults(prev => [...prev, result]);
          
          setAnalysisProgress((i + 1) * chunk);
        } catch (error) {
          console.error(`Error analyzing image ${i + 1}:`, error);
          // Continue with next image even if one fails
        } finally {
          if (aiInterval) clearInterval(aiInterval);
        }
      }
      
      return newResults;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  }, []);

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    setResults([]);
    analyzeImages(files);
  };

  const handleRetry = () => {
    setUploadedFiles([]);
    setResults([]);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentStep(0);
    setSelectedResult(null);
  };

  return (
    <div className={`min-h-screen p-3 md:p-5 ${isAnalyzing ? 'bg-[#0b1626]' : 'bg-gradient-to-br from-emerald-50 to-blue-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 md:mb-6 ${isAnalyzing ? 'text-white' : 'text-gray-800'}`}>
          <button
            onClick={onNavigateToLanding}
            className={`flex items-center transition-colors ${isAnalyzing ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'}`}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Home</span>
          </button>
          <h1 className={`text-2xl md:text-3xl font-bold ${isAnalyzing ? 'text-white' : 'text-gray-800'}`}>Livestock Analysis</h1>
          <div className="w-24"></div> {/* For alignment */}
        </div>

        {isAnalyzing ? (
          <div className="relative rounded-2xl overflow-visible min-h-[60vh] md:min-h-[65vh]">
            <ShootingStars className="z-0" fixed style={{ ['--primary-color' as any]: '#9ecbff' }} />
            <div className="relative z-10 max-w-4xl mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 md:p-8 mt-8 text-white">
              <AnalysisProgress dark fileCount={uploadedFiles.length} progress={analysisProgress} currentStep={currentStep} />
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                <p className="text-gray-600">Found {results.length} {results.length === 1 ? 'animal' : 'animals'} in the images</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow hover:shadow-lg transition-colors flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Analyze More
              </button>
            </div>

            {/* Two-pane layout */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-5">
                <div className="sticky top-6 max-h-[calc(100vh-220px)] overflow-auto pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 auto-rows-fr items-stretch">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => setSelectedResult(result)}
                        className={`block h-full w-full text-left focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-xl ${selectedResult?.id === result.id ? 'ring-2 ring-emerald-400' : ''}`}
                      >
                        <AnalysisCard
                          analysis={result}
                          imageUrl={result.image}
                          onViewDetails={() => setSelectedResult(result)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-7">
                <div className="sticky top-6 max-h-[calc(100vh-220px)] overflow-auto">
                  <InlineAnalysisPanel
                    analysis={(selectedResult || results[0])}
                    imageUrl={(selectedResult || results[0]).image}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[80vh] grid place-items-center">
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 text-center max-w-xl mx-auto w-full">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-5 text-emerald-500">
                <Camera className="w-full h-full" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Analyze Your Livestock</h2>
              <p className="text-gray-600 mb-3 md:mb-4 max-w-md mx-auto">
                Upload clear photos of your cattle to get detailed analysis including breed identification, health assessment, and care recommendations.
              </p>
              <div className="max-w-xl mx-auto">
                <UploadZone compact onFilesUploaded={handleFilesUploaded} />
                <p className="text-xs text-gray-500 mt-3">Supports JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal (mobile only) */}
      <AnimatePresence>
        {isMobile && selectedResult && (
          <AnalysisDetailModal
            analysis={selectedResult}
            imageUrl={selectedResult.image}
            onClose={() => setSelectedResult(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Results;