import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import { MessageSquare, ArrowLeftRight } from 'lucide-react';

const PromoSlider = () => {
  const { t, isRtl } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'PREMIUM VIDEO',
      title: isRtl ? 'التميز في صناعة ' : 'Excellence in ',
      titleHighlight: isRtl ? 'المحتوى البصري' : 'Visual Content',
      description: isRtl ? 'إنتاج سينمائي وتصميم فيديوهات احترافية تروي قصة علامتك التجارية وتصنع تأثيراً لا ينسى في عالم الرقمنة.' : 'Professional cinematic production and video design that tell your brand story and make an unforgettable impact.',
      color: 'blue',
      actionText: isRtl ? 'استعرض أعمالنا' : 'View Our Work',
      targetId: 'video-portfolio-grid'
    },
    {
      badge: t('promoBadge1') || 'DIGITAL GROWTH',
      title: isRtl ? 'إدارة الصفحات ' : 'Page Management ',
      titleHighlight: isRtl ? 'والحملات الإعلانية' : 'Advertising Campaigns',
      description: isRtl ? 'حقق نمو حقيقي لصفحتك الآن، نمنحك السيطرة الكاملة لتكتسح منافسيك بأدوات وحملات تسويقية مبتكرة.' : 'Achieve real growth for your page now, we give you full control to dominate your competitors with innovative marketing tools.',
      color: 'red',
      actionText: isRtl ? 'استعرض باقات إدارة الصفحات' : 'View Page Management Packages',
      targetId: 'campaign-management'
    },
    {
      badge: t('promoBadge2') || 'عرض لفترة محدودة ⚡',
      title: isRtl ? 'باقات مدمجة بخصومات تصل إلى ' : 'Bundled packages with up to ',
      titleHighlight: isRtl ? '60%' : '60%',
      description: isRtl ? 'عروض وباقات استثنائية مخصصة تضمن لمشروعك ووكالتك أعلى العوائد الممكنة والريادة في السوق وبأفضل تكلفة استثمارية.' : 'Special offers and custom packages that guarantee your business or agency the highest possible returns and market leadership.',
      color: 'yellow',
      actionText: isRtl ? 'استعرض باقات الـ 999 ج.م' : 'View 999 EGP Packages',
      targetId: 'design-services'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleContactClick = () => {
    const whatsappNumber = "201032314117";
    const message = "مرحباً Control P، أريد التواصل معكم مباشرة للاستفسار والاتفاق على خدمات التسويق وإدارة الصفحات.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePromoClick = () => {
    const targetId = slides[currentSlide].targetId;
    // Set hash to trigger tab change in ServicePackages
    window.location.hash = targetId;
    
    document.getElementById('service-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-[400px] flex flex-col items-center justify-center py-12 px-6 overflow-hidden bg-[#03060B]">
      {/* Dynamic Glow background */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${
        currentSlide === 0 ? "bg-blue-600/10" : 
        currentSlide === 1 ? "bg-red-600/10" : "bg-yellow-600/10"
      }`} />
      
      <div className="max-w-5xl w-full text-center relative z-10 min-h-[220px] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <span className={`inline-block px-4 py-1.5 rounded-full border mb-6 text-xs md:text-sm font-black tracking-widest uppercase transition-colors duration-500 ${
              currentSlide === 0 
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                : currentSlide === 1
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            }`}>
              {slides[currentSlide].badge}
            </span>
            
            <h2 className={`font-black mb-6 leading-tight tracking-tight transition-all duration-500 mx-auto ${
              currentSlide === 2 
                ? "text-2xl sm:text-4xl md:text-5xl lg:text-6xl" 
                : "text-3xl sm:text-4xl md:text-6xl lg:text-7xl"
            }`}>
              {slides[currentSlide].title}
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                currentSlide === 0 
                  ? "from-blue-600 via-blue-500 to-indigo-600 drop-shadow-[0_2px_10px_rgba(37,99,235,0.3)]"
                : currentSlide === 1
                  ? "from-red-600 via-red-500 to-orange-600 drop-shadow-[0_2px_10px_rgba(220,38,38,0.3)]" 
                  : "from-yellow-400 to-yellow-200 drop-shadow-[0_2px_10px_rgba(234,179,8,0.3)]"
              }`}>
                {slides[currentSlide].titleHighlight}
              </span>
            </h2>
            
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl leading-relaxed font-medium">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-5 relative z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePromoClick}
          className={`font-black px-10 py-5 rounded-2xl transition-all flex items-center gap-2 text-sm sm:text-base border ${
            currentSlide === 0 
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] border-blue-400/20" 
            : currentSlide === 1
              ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] border-red-400/20" 
              : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_30px_rgba(234,179,8,0.4)] border-yellow-300/20"
          }`}
        >
          {slides[currentSlide].actionText}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContactClick}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl transition-colors flex items-center gap-2 text-sm sm:text-base shadow-lg"
        >
          <MessageSquare className={`w-5 h-5 ${currentSlide === 0 ? 'text-blue-500' : currentSlide === 1 ? 'text-red-500' : 'text-yellow-500'}`} />
          {t('promoAction2') || 'اتصل بنا مباشرة'}
        </motion.button>
      </div>

      {/* Slide Indicators/Switchers */}
      <div className="mt-8 flex items-center gap-4 relative z-20">
        <button
          onClick={() => setCurrentSlide(0)}
          className={`h-2.5 rounded-full transition-all duration-500 ${
            currentSlide === 0 ? "w-8 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "w-2.5 bg-gray-700"
          }`}
        />
        <button
          onClick={() => setCurrentSlide(1)}
          className={`h-2.5 rounded-full transition-all duration-500 ${
            currentSlide === 1 ? "w-8 bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "w-2.5 bg-gray-700"
          }`}
        />
        <button
          onClick={() => setCurrentSlide(2)}
          className={`h-2.5 rounded-full transition-all duration-500 ${
            currentSlide === 2 ? "w-8 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "w-2.5 bg-gray-700"
          }`}
        />
        
        {/* Force Switch Button */}
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className="ml-4 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/40 hover:text-white transition-all group"
          title="Switch Slide"
        >
          <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </section>
  );
};

export default PromoSlider;
