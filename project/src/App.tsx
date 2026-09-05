import React, { useState } from 'react';
import Landing from './components/Landing';
import Results from './components/Results';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'results'>('landing');

  const navigateToResults = () => {
    setCurrentPage('results');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {currentPage === 'landing' && (
        <Landing onNavigateToResults={navigateToResults} />
      )}
      {currentPage === 'results' && (
        <Results onNavigateToLanding={navigateToLanding} />
      )}
    </div>
  );
}

export default App;