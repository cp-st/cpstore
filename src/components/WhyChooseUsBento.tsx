import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

// المكون الذكي المسؤول عن محاكاة التأثير ثلاثي الأبعاد (True 3D Tilt Effect)
const TiltCard = ({ children, className, glowColor }: { children: React.ReactNode, className: string, glowColor: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // إعداد قيم تتبع الماوس
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // استخدام نوابض حركية (Springs) لجعل الدوران انسيابي ومريح للعين
  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 120 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 120 });

  // تحويل إحداثيات الماوس إلى درجات دوران حقيقية على محاور X و Y
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // حساب موقع الماوس بالنسبة لمركز البطاقة بدقة
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl transition-all duration-500 will-change-transform ${className} ${glowColor}`}
    >
      {children}
    </motion.div>
  );
};

const WhyChooseUsBento = () => {
  const { t, isRtl } = useTranslation();

  return (
    <div className="relative py-16 bg-[#04060a] text-white overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#BF953F]/10 to-transparent rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-[#B38728]/10 to-transparent rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-wide"
          >
            {t('bentoSectionTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_2px_15px_rgba(212,175,55,0.25)]">Control P</span> {t('bentoSectionTitleSuffix')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {t('bentoSectionSub')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[160px]">
          
          <TiltCard 
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-[#0e121a] to-[#05070b] border border-[#BF953F]/20 p-6 lg:p-8 flex flex-col justify-between group overflow-hidden"
            glowColor="hover:shadow-[0_0_50px_rgba(191,149,63,0.15)] hover:border-[#BF953F]/40"
          >
            <div className={`absolute -bottom-10 ${isRtl ? '-left-10' : '-right-10'} text-[20rem] font-black text-white/[0.01] group-hover:text-[#BF953F]/[0.02] transition-colors duration-700 select-none pointer-events-none`}>4K</div>
            
            <div style={{ transform: "translateZ(50px)" }} className={`transition-transform duration-300 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#BF953F]/10 to-[#B38728]/20 border border-[#BF953F]/30 flex items-center justify-center mb-6 shadow-inner`}>
                <svg className="w-6 h-6 text-[#FCF6BA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-[#FCF6BA] transition-colors">{t('bentoTitle1')}</h3>
              <p className="text-gray-400 text-base leading-relaxed max-w-xl">
                {t('bentoDesc1')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 border-t border-gray-800/60 pt-4 mt-2 text-xs text-[#BF953F] font-bold">
               <span className="flex items-center gap-2">{t('bentoFeature1')}</span>
               <span className="flex items-center gap-2">{t('bentoFeature2')}</span>
            </div>
          </TiltCard>

          <TiltCard 
            className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-[#0b0e14] to-[#040609] border border-gray-800/80 p-5 flex flex-col justify-center group relative overflow-hidden"
            glowColor="hover:shadow-[0_0_40px_rgba(59,130,246,0.12)] hover:border-blue-500/30"
          >
            <div className={`absolute -bottom-6 ${isRtl ? '-left-6' : '-right-6'} text-6xl font-black text-white/[0.008] select-none pointer-events-none`}>FAST</div>
            <div style={{ transform: "translateZ(40px)" }} className={isRtl ? 'text-right' : 'text-left'}>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{t('bentoTitle2')}</h3>
              <p className="text-gray-400 text-[13px] leading-snug">
                {t('bentoDesc2')}
              </p>
            </div>
          </TiltCard>

          <TiltCard 
            className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-[#1c150e] to-[#080604] border border-[#BF953F]/30 p-5 flex flex-col justify-center group relative overflow-hidden"
            glowColor="hover:shadow-[0_0_50px_rgba(191,149,63,0.22)] hover:border-[#BF953F]/60"
          >
            <div className={`absolute -top-3 ${isRtl ? 'left-4' : 'right-4'} bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black font-black text-[8px] px-2.5 py-0.5 rounded-full shadow-lg tracking-wider`}>{t('limitedTime')}</div>
            <div style={{ transform: "translateZ(45px)" }} className={isRtl ? 'text-right' : 'text-left'}>
              <div className="w-10 h-10 rounded-lg bg-[#BF953F]/10 border border-[#BF953F]/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#FCF6BA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#FCF6BA] mb-1">{t('bentoTitle3')}</h3>
            </div>
          </TiltCard>

          <TiltCard 
            className="md:col-span-3 md:row-span-1 bg-gradient-to-r from-[#05070b] via-[#0e121a] to-[#05070b] border border-gray-800 p-6 flex flex-col md:flex-row items-center justify-between group relative overflow-hidden gap-6"
            glowColor="hover:shadow-[0_0_50px_rgba(168,85,247,0.1)] hover:border-purple-500/30"
          >
            <div className={`absolute -bottom-10 ${isRtl ? '-right-10' : '-left-10'} text-9xl font-black text-white/[0.003] select-none pointer-events-none`}>SUPPORT 24/7</div>
            
            <div className={`flex items-start gap-4 max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`} style={{ transform: "translateZ(40px)" }}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{t('bentoTitle4')}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('bentoDesc4')}
                </p>
              </div>
            </div>


            <div className="shrink-0 w-full md:w-auto relative z-10">
               <a 
                 href="https://wa.me/201032314117" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="block text-center w-full md:w-auto bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#FCF6BA] hover:to-[#BF953F] text-black font-black px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(191,149,63,0.3)] transition-all duration-300 transform active:scale-95 text-sm tracking-wide"
               >
                  {t('talkCreativeAdvisor')}
               </a>
            </div>
          </TiltCard>

        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsBento;
