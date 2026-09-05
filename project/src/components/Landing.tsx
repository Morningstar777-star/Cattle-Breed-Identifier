import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, Shield, Award, Users, TrendingUp, ChevronRight, ChevronLeft, PlayCircle, Star, Wheat, Heart, Activity, Cpu, ShieldCheck, BarChart3, Sparkles, HelpCircle, BadgeCheck } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import AnimatedCounter from './AnimatedCounter';

interface LandingProps {
  onNavigateToResults: () => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigateToResults }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  
  const heroImages = [
    {
      url: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg',
      breed: 'Holstein Friesian',
      info: {
        origin: 'Netherlands & Germany',
        milkYield: '25-30 L/day',
        weight: '580-650 kg',
        characteristics: ['High milk production', 'Black & white pattern', 'Docile temperament']
      }
    },
    {
      url: 'https://images.pexels.com/photos/1202209/pexels-photo-1202209.jpeg',
      breed: 'Jersey',
      info: {
        origin: 'Jersey Island, UK',
        milkYield: '15-20 L/day',
        weight: '350-450 kg',
        characteristics: ['Rich milk quality', 'Light brown color', 'Hardy breed']
      }
    },
    {
      url: 'https://images.pexels.com/photos/162240/bull-cows-cattle-agriculture-162240.jpeg',
      breed: 'Angus',
      info: {
        origin: 'Scotland',
        milkYield: '12-18 L/day',
        weight: '500-650 kg',
        characteristics: ['Excellent beef quality', 'Black or red color', 'Good mothering ability']
      }
    }
  ];

  const recentlyIdentified = ['Holstein Friesian', 'Jersey', 'Angus', 'Hereford', 'Brahman', 'Charolais'];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    let slideInterval: NodeJS.Timeout | undefined;
    if (!isHeroHovered) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 6000);
    }

    const tickerInterval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentlyIdentified.length);
    }, 2000);

    return () => {
      if (slideInterval) clearInterval(slideInterval);
      clearInterval(tickerInterval);
    };
  }, [isHeroHovered, heroImages.length, recentlyIdentified.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      if (e.key === 'ArrowLeft') setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [heroImages.length]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      {/* Top Navigation */}
      <header className="fixed top-2 md:top-4 left-0 right-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2">
            <a href="#" className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">SmartLivestock</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-white/80">
              <a href="#how-it-works" className="hover:text-white transition">How it works</a>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
            </nav>
            <button onClick={onNavigateToResults} className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow hover:shadow-lg transition">
              <Upload className="w-4 h-4" /> Start Free
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.url})` }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentSlide === index ? 0.3 : 0,
              }}
              transition={{ duration: 1.5 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Hero Controls */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4 md:px-6">
          <button
            aria-label="Previous slide"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
            className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
            className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="relative z-10 px-4 pt-24 md:pt-32 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Content */}
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                Smart Cattle
                <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                  Breed Identification
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0"
                {...fadeInUp}
                transition={{ delay: 0.3 }}
              >
                Advanced AI technology for instant cattle breed identification, health assessment, and agricultural insights. Empowering farmers with precision livestock management.
              </motion.p>

              {/* Floating badges */}
              <div className="hidden md:flex items-center gap-3 mb-6">
                <motion.span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm border border-white/20" animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 3 }}>
                  Real-time analysis
                </motion.span>
                <motion.span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm border border-white/20" animate={{ y: [0,-6,0] }} transition={{ repeat: Infinity, duration: 3.6 }}>
                  Vet insights
                </motion.span>
                <motion.span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm border border-white/20" animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 3.2 }}>
                  Cloud secure
                </motion.span>
              </div>

              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  { icon: Shield, text: "98.7% Accuracy", color: "bg-green-500/20 border-green-400/30 text-green-400" },
                  { icon: Users, text: "5,000+ Farmers", color: "bg-amber-500/20 border-amber-400/30 text-amber-400" },
                  { icon: Award, text: "Vet Approved", color: "bg-orange-500/20 border-orange-400/30 text-orange-400" }
                ].map(({ icon: Icon, text, color }, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border ${color}`}
                    variants={fadeInUp}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-white font-medium">{text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                onClick={onNavigateToResults}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full text-white font-bold text-lg shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  Start Analysis - FREE
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-800 rounded-full"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Shimmer */}
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/3 bg-white/20 blur-lg rounded-full"
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '150%' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                onClick={onNavigateToResults}
                className="ml-0 lg:ml-4 mt-4 lg:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white/90 hover:text-white hover:border-white/50 backdrop-blur-sm transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <PlayCircle className="w-6 h-6" />
                Watch Demo
              </motion.button>

              <motion.div
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center lg:text-left">
                  <AnimatedCounter end={20000} suffix="+" className="text-3xl font-bold text-amber-400" />
                  <p className="text-gray-300">Images Analyzed</p>
                </div>
                <div className="text-center lg:text-left">
                  <AnimatedCounter end={150} suffix="+" className="text-3xl font-bold text-green-400" />
                  <p className="text-gray-300">Cattle Breeds</p>
                </div>
                <div className="text-center lg:text-left">
                  <AnimatedCounter end={98.7} suffix="%" className="text-3xl font-bold text-orange-400" />
                  <p className="text-gray-300">Accuracy Rate</p>
                </div>
              </motion.div>

              {/* Live Ticker */}
              <motion.div
                className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm">Recently identified:</span>
                <motion.span 
                  key={tickerIndex}
                  className="font-semibold text-green-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {recentlyIdentified[tickerIndex]}
                </motion.span>
              </motion.div>
            </div>

            {/* Right Side - Cattle Info Box */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Wheat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{heroImages[currentSlide].breed}</h3>
                      <p className="text-amber-200 text-sm">Featured Breed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-gray-300">Origin</span>
                      </div>
                      <p className="text-white font-medium text-sm">{heroImages[currentSlide].info.origin}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-300">Milk Yield</span>
                      </div>
                      <p className="text-white font-medium text-sm">{heroImages[currentSlide].info.milkYield}</p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-300">Key Characteristics</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {heroImages[currentSlide].info.characteristics.map((trait, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-400/30"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">⚖️</span>
                      <span className="text-xs text-gray-300">Average Weight</span>
                    </div>
                    <p className="text-white font-medium text-sm">{heroImages[currentSlide].info.weight}</p>
                  </div>
                </motion.div>

                {/* Slide indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index ? 'bg-amber-400 w-6' : 'bg-white/30'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Cue */}
        <a href="#how-it-works" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition">
          <div className="flex flex-col items-center text-sm">
            <span>Scroll</span>
            <ChevronRight className="w-5 h-5 rotate-90 animate-bounce" />
          </div>
        </a>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Advanced Livestock Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade AI technology for comprehensive cattle breed identification and health assessment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Image', description: 'Upload high-quality photos of your cattle from multiple angles for optimal analysis', icon: Upload },
              { step: '02', title: 'AI Analyzes', description: 'Advanced machine learning algorithms analyze breed characteristics, body structure, and health indicators', icon: Zap },
              { step: '03', title: 'View Report', description: 'Get comprehensive breed identification, health assessment, and agricultural management recommendations', icon: Award }
            ].map(({ step, title, description, icon: Icon }, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -6, rotate: -0.2 }}
              >
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  {step}
                </div>
                <div className="bg-white p-8 pt-12 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200/80 hover:bg-emerald-50/20">
                  <Icon className="w-12 h-12 text-emerald-600 mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Choose Our Platform</h2>
            <p className="text-gray-600 mt-2">Beautifully designed, reliable, and built for real-world farming needs</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Cpu, title: 'Gemini-powered', desc: 'Latest AI model for accurate breed detection and insights' },
              { icon: ShieldCheck, title: 'Secure & Private', desc: 'Your images are processed securely with best practices' },
              { icon: BarChart3, title: 'Actionable Metrics', desc: 'Clear KPIs and recommendations for better decisions' },
              { icon: Sparkles, title: 'Delightful UX', desc: 'Fast, responsive, and engaging experience' }
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="group rounded-2xl p-5 bg-white/70 backdrop-blur-md border border-emerald-100 shadow hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
                <div className="mt-3 inline-flex items-center gap-1 text-emerald-700 text-sm opacity-0 group-hover:opacity-100 transition">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-green-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Trusted by Agricultural Professionals</h2>
            <p className="text-xl text-gray-600">Join thousands of farmers, veterinarians, and researchers worldwide</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Dairy Farmer, Texas",
                content: "This technology revolutionized our farm operations. Accurate breed identification helped us optimize our breeding program and improve milk production by 25%.",
                rating: 5
              },
              {
                name: "Dr. Michael Chen",
                role: "Veterinarian, California",
                content: "As a livestock veterinarian, I'm impressed by the accuracy of breed identification and health risk assessment. It's become an essential tool in my practice.",
                rating: 5
              },
              {
                name: "Robert Martinez",
                role: "Ranch Owner, Montana",
                content: "Managing 500+ head of cattle became much easier with this AI system. The detailed breed analysis helps us make informed decisions about nutrition and breeding.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Smart Livestock Management System. Empowering agriculture through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;