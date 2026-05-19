import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

const MainServicesGrid = () => {
  const { t, isRtl } = useTranslation();

  const servicesData = [
    {
      id: 1,
      title: t('gridTitle1'),
      desc: t('gridDesc1'),
      glowColor: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:border-blue-500/50',
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      targetId: 'video-services',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: t('gridTitle2'),
      desc: t('gridDesc2'),
      glowColor: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:border-purple-500/50',
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      targetId: 'design-services',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: t('gridTitle3'),
      desc: t('gridDesc3'),
      glowColor: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:border-red-500/50',
      iconColor: 'text-red-400 bg-red-500/10 border-red-500/30',
      targetId: 'campaign-management',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      id: 4,
      title: t('gridTitle4'),
      desc: t('gridDesc4'),
      glowColor: 'hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:border-green-500/50',
      iconColor: 'text-green-400 bg-green-500/10 border-green-500/30',
      targetId: 'growth-services',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full flex justify-center py-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
        {servicesData.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* استخدام علامة التوجيه (<a>) لتفعيل النقر على الكارت بالكامل */}
            <button
              onClick={() => {
                // Set hash first to trigger tab change in ServicePackages
                window.location.hash = service.targetId;
                
                // Then scroll to the main packages section
                const container = document.getElementById('service-packages');
                if (container) {
                  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`group relative bg-[#0a0a0c] border border-gray-800 rounded-2xl p-6 sm:p-8 cursor-pointer flex flex-col min-h-[160px] sm:min-h-[180px] transition-all duration-300 w-full text-right ${service.glowColor} overflow-hidden`}
            >
              <div className={`flex items-center gap-4 mb-4 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border ${service.iconColor} transition-colors duration-300`}>
                  {React.cloneElement(service.icon as React.ReactElement, { className: "w-5 h-5 sm:w-6 h-6" })}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {service.title}
                </h3>
              </div>
              
              <p className={`text-gray-400 text-[13px] sm:text-sm leading-relaxed ${isRtl ? 'pr-2 md:pr-16' : 'pl-2 md:pl-16'}`}>
                {service.desc}
              </p>

              {/* السهم التفاعلي */}
              <div className={`absolute ${isRtl ? 'left-6' : 'right-6'} bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform ${isRtl ? 'translate-x-4 group-hover:translate-x-0' : '-translate-x-4 group-hover:translate-x-0'}`}>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className={`w-5 h-5 text-white ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MainServicesGrid;
