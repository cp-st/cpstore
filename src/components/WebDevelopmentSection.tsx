import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import WebDevOrderModal from './WebDevOrderModal';

const WebDevelopmentSection = () => {
  const { t, isRtl } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
    <div id="web-development" className="relative py-8 bg-[#050505] text-white overflow-hidden scroll-mt-32" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mb-3 tracking-tight"
          >
            {t('webTitle')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]">{t('webTitleHighlight')}</span>
          </motion.h2>
          <p className="text-gray-400 text-base md:text-lg font-medium">To Become A Brand — Control P</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:auto-rows-[160px]">
          
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="md:col-span-8 md:row-span-2 bg-gradient-to-br from-[#111] to-[#050505] border border-[#BF953F]/30 rounded-[32px] p-6 sm:p-8 md:p-8 flex flex-col justify-between relative overflow-hidden group min-h-[400px] md:min-h-0"
          >
            <div className={`absolute -top-10 ${isRtl ? '-left-10' : '-right-10'} text-[15rem] font-black text-white/[0.02] select-none pointer-events-none`}>OFFER</div>
            
            <div className={`relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-3 mb-5 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                <span className="bg-[#BF953F] text-black text-[10px] font-black px-4 py-1 rounded-full uppercase">{t('limitedTime')}</span>
                <span className="text-gray-500 text-xs line-through">{t('originalPriceLabel')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{t('launchProject')}</h3>
              <div className={`flex items-baseline gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                <span className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">7,000</span>
                <span className="text-base sm:text-lg font-bold text-[#BF953F]">{t('priceSuffix')}</span>
              </div>
            </div>

            <div className={`relative z-10 flex flex-wrap items-center gap-6 mt-8 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-black font-black px-12 py-5 rounded-2xl hover:scale-105 transition-all shadow-[0_8px_30px_rgba(191,149,63,0.3)] whitespace-nowrap text-sm sm:text-base"
              >
                {t('orderWebAction')}
              </button>
              <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                 <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                 {t('instantBooking')}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-4 md:row-span-1 bg-[#111] border border-white/5 rounded-[32px] p-6 flex flex-col items-center text-center justify-center group"
          >
            <div className="mb-4 transition-transform group-hover:scale-110">
              <svg className="w-10 h-10 text-[#BF953F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{t('dynamicWebTitle')}</h4>
            <p className="text-gray-500 text-xs">{t('dynamicWebDesc')}</p>
          </motion.div>

          <motion.div 
            className="md:col-span-4 md:row-span-1 bg-[#111] border border-white/5 rounded-[32px] p-6 flex flex-col items-center text-center justify-center group"
          >
            <div className="mb-4 transition-transform group-hover:scale-110">
              <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{t('controlPanelTitle')}</h4>
            <p className="text-gray-500 text-xs">{t('controlPanelDesc')}</p>
          </motion.div>

          <div className="md:col-span-12 md:row-span-1 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border border-white/5 rounded-[32px] p-5 flex flex-wrap items-center justify-around gap-6">
             <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50">🏥</span>
                <span className="text-sm font-bold text-gray-300">{t('medicalClinics')}</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50">🛒</span>
                <span className="text-sm font-bold text-gray-300">{t('onlineStores')}</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50">🍽️</span>
                <span className="text-sm font-bold text-gray-300">{t('restaurantsCafes')}</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-2xl opacity-50">🏢</span>
                <span className="text-sm font-bold text-gray-300">{t('realEstateCompany')}</span>
             </div>
          </div>

        </div>
      </div>
    </div>
    <WebDevOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default WebDevelopmentSection;
