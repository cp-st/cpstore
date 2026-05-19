import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- أيقونات SVG مدمجة وعالية الدقة لتجنب أخطاء الاستيراد ---
const PlayIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CinematicHero = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const cardsData = [
    { id: 1, title: 'تصميم فوري', desc: 'بوسترات حصرية ومونتاج يخطف العين فوراً.', color: 'from-blue-600 to-cyan-500', glow: 'shadow-[0_0_30px_rgba(37,99,235,0.4)]' },
    { id: 2, title: 'منتجات حصرية', desc: 'هوية بصرية وتعبئة وتغليف بمستوى عالمي.', color: 'from-red-600 to-pink-500', glow: 'shadow-[0_0_30px_rgba(220,38,38,0.4)]' },
    { id: 3, title: 'باقات متدرجة', desc: 'خدمات SMM مخصصة ومحسوبة الهامش.', color: 'from-yellow-500 to-amber-600', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]' },
    { id: 4, title: 'إشراف كامل', desc: 'دعم فني وإدارة حملات متواصلة 24/7.', color: 'from-purple-600 to-indigo-500', glow: 'shadow-[0_0_30px_rgba(147,51,234,0.4)]' }
  ];

  return (
    <div className="relative pt-32 pb-24 overflow-hidden" dir="rtl">
      {/* Background Cinematic effects */}
      <div className="absolute top-[-10%] inset-x-0 h-[600px] bg-gradient-to-b from-red-950/10 via-transparent to-transparent pointer-events-none blur-[140px]"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* الجزء الأيمن: العرض المميز (Netflix Main Feature Banner Style) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-7/12 relative bg-gradient-to-br from-[#0c0c10] to-[#060608] border border-white/[0.05] rounded-3xl p-8 lg:p-12 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[480px]"
        >
          {/* تأثير الإضاءة الحواف المتوهجة للبانر الرئيسي */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/20 animate-pulse">
                عرض حصري
              </span>
              <span className="text-gray-500 text-xs font-bold">لفترة محدودة جداً</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              عرض الـ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-400 to-purple-500">10 تصميمات</span> المتكامل
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl mb-8">
              احصل على نقلة بصرية شاملة لهوية مشروعك وبوسترات السوشيال ميديا مع مونتاج سينمائي وتصميم عبوات احترافي يضمن لك الظهور كبراند موثوق ونخبوي.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/[0.05] pt-6 mt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-white shadow-sm">999</span>
              <span className="text-sm font-bold text-gray-400">ج.م / السعر الإجمالي</span>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05, shadow: "0_0_25px_rgba(229,9,20,0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.hash = 'design-services';
                document.getElementById('service-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center gap-3 bg-white text-black font-black px-8 py-4 rounded-xl text-sm transition-all"
            >
              <PlayIcon />
              ابدأ حملتك الآن
            </motion.button>
          </div>
        </motion.div>

        {/* الجزء الأيسر: شبكة الكروت المجسمة التفاعلية (3D Textured Grid) */}
        <div className="w-full lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cardsData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative bg-[#0c0c10] border rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[230px] transition-all duration-300 ${
                hoveredCard === card.id ? `border-transparent ${card.glow}` : 'border-white/[0.04]'
              }`}
            >
              {/* التوهج اللوني الداخلي عند الهوفر */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-0 rounded-full blur-[40px] transition-opacity duration-500 ${hoveredCard === card.id ? 'opacity-20' : ''}`}></div>

              <div className="relative z-10">
                {/* الدائرة الدليلة الصغيرة المتوهجة */}
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color} mb-4 shadow-md`}></div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
              </div>

              {/* خط أسفل الكارت يضيء تدريجياً */}
              <div className="w-full h-[1px] bg-white/[0.03] relative mt-4 overflow-hidden">
                <motion.div 
                  animate={{ x: hoveredCard === card.id ? "100%" : "-100%" }}
                  transition={{ duration: 0.6 }}
                  className={`absolute inset-0 bg-gradient-to-r ${card.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CinematicHero;
