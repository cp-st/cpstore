import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

const HeroServiceSlider = () => {
  const { t, isRtl } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo(() => [
    {
      id: 1,
      tag: t('cinemaProduction'),
      title: t('cinemaProductionTitle'),
      desc: t('cinemaProductionDesc'),
      price: "1500",
      color: "from-[#BF953F] via-[#FCF6BA] to-[#B38728]",
      targetId: "video-services", 
      icon: (
        <svg className="w-8 h-8 text-[#BF953F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      id: 2,
      tag: t('visualIdentity'),
      title: t('visualIdentityTitle'),
      desc: t('visualIdentityDesc'),
      price: "999",
      color: "from-blue-500 via-purple-400 to-indigo-600",
      targetId: "design-services", 
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      tag: t('growthAutomation'),
      title: t('growthAutomationTitle'),
      desc: t('growthAutomationDesc'),
      price: t('customPrice'),
      color: "from-red-600 via-pink-500 to-rose-700",
      targetId: "campaign-management", 
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ], [t]);

  const scrollToSection = (id: string) => {
    // Set hash to trigger tab change in ServicePackages
    window.location.hash = id;
    
    // Direct scroll to the packages container
    const element = document.getElementById('service-packages');
    if (element) {
      // Use a faster scroll or instant if preferred, but smooth is usually nicer
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full pt-28 pb-6 px-4 md:px-8 max-w-[1200px] mx-auto relative z-10" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <div className="relative bg-[#08080a] border border-white/[0.08] rounded-[28px] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] min-h-[340px] flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`glow-${currentIndex}`}
            initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
            className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} w-[70%] h-full bg-gradient-to-l ${slides[currentIndex].color} blur-[120px] pointer-events-none`}
          />
        </AnimatePresence>

        <div className="relative z-10 w-full p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className={`flex-1 w-full ${isRtl ? 'text-right' : 'text-left'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className={`flex items-center gap-3 mb-4 sm:mb-6 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                   <div className="p-2 sm:p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-inner">
                      {slides[currentIndex].icon}
                   </div>
                   <span className="bg-white/10 text-gray-300 text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {slides[currentIndex].tag}
                   </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight font-['Times_New_Roman']">
                   {slides[currentIndex].title}
                </h1>
                
                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mb-6 sm:mb-8 opacity-80">
                  {slides[currentIndex].desc}
                </p>

                <div className={`flex flex-wrap items-center gap-4 sm:gap-6 ${isRtl ? 'justify-start' : 'justify-start'}`}>
                   <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white">{slides[currentIndex].price}</span>
                      {slides[currentIndex].id !== 3 && <span className="text-[10px] font-bold text-gray-500">{t('priceSuffix')}</span>}
                   </div>
                   
                   <button 
                     onClick={() => scrollToSection(slides[currentIndex].targetId)}
                     className="bg-white text-black font-black px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.15)] flex-1 sm:flex-none text-center"
                   >
                     {t('exploreDetails')}
                   </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-20 px-8">
           {slides.map((_, idx) => (
             <button 
               key={idx} onClick={() => setCurrentIndex(idx)}
               className="relative h-1 flex-1 max-w-[80px] bg-white/20 rounded-full overflow-hidden cursor-pointer"
             >
               <motion.div 
                 initial={{ width: "0%" }}
                 animate={{ width: currentIndex === idx ? "100%" : currentIndex > idx ? "100%" : "0%" }}
                 transition={{ duration: currentIndex === idx ? 3 : 0, ease: "linear" }}
                 className="absolute top-0 left-0 h-full bg-white rounded-full"
               />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default HeroServiceSlider;
