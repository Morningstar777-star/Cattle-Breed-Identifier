import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Camera, Brain } from 'lucide-react';

interface AnalysisProgressProps {
  fileCount: number;
  progress?: number; // 0-100, optional external control
  currentStep?: number; // 0: Processing, 1: AI Analysis, 2: Report
  dark?: boolean; // dark theme toggle
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ fileCount, progress: externalProgress, currentStep: externalStep, dark = false }) => {
  const [internalStep, setInternalStep] = useState(0);
  const [internalProgress, setInternalProgress] = useState(0);

  const steps = [
    {
      icon: Camera,
      title: 'Processing Images',
      description: 'Optimizing image quality and extracting features',
      duration: 1000
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Identifying breed characteristics and patterns',
      duration: 1500
    },
    {
      icon: Zap,
      title: 'Generating Report',
      description: 'Compiling breed information and health insights',
      duration: 500
    }
  ];

  // Fallback animation if no external progress provided
  useEffect(() => {
    if (externalProgress !== undefined) return; // controlled by parent

    let timeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) return;

      setInternalStep(stepIndex);
      setInternalProgress(0);

      const stepDuration = steps[stepIndex].duration;
      const progressIncrement = 100 / (stepDuration / 50);

      progressInterval = setInterval(() => {
        setInternalProgress(prev => {
          const next = prev + progressIncrement;
          if (next >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return next;
        });
      }, 50);

      timeout = setTimeout(() => {
        runStep(stepIndex + 1);
      }, stepDuration);
    };

    runStep(0);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [externalProgress]);

  const activeStep = externalStep !== undefined ? externalStep : internalStep;
  const pct = externalProgress !== undefined ? externalProgress : internalProgress;
  const displayPct = Math.min(100, Math.max(1, Math.round(pct)));

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-6">
        {[Camera, Brain, Zap].map((Icon, idx) => {
          const state = idx < activeStep ? 'done' : idx === activeStep ? 'current' : 'upcoming';
          return (
            <div key={idx} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  state === 'done' ? 'bg-emerald-500 text-white border-emerald-500' :
                  state === 'current' ? 'bg-white text-emerald-600 border-emerald-300' :
                  'bg-white text-gray-400 border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {idx < 2 && (
                <div className="w-16 h-1 mx-3 rounded-full bg-gray-200">
                  <div
                    className={`h-1 rounded-full ${idx < activeStep ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div>
        <div className={`flex items-center justify-between text-sm ${dark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
          <span>Analyzing {fileCount} image{fileCount > 1 ? 's' : ''}</span>
          <span>{displayPct}%</span>
        </div>
        <div className={`relative w-full ${dark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
          <motion.div
            className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
          {pct < 5 && (
            <motion.div
              className="absolute top-0 left-0 h-3 w-1/3 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300 opacity-60"
              initial={{ x: '-33%' }}
              animate={{ x: '133%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            />
          )}
        </div>
        <div className={`mt-2 text-center ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          {activeStep === 0 && 'Processing images'}
          {activeStep === 1 && 'Analyzing with AI'}
          {activeStep === 2 && 'Generating report'}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;