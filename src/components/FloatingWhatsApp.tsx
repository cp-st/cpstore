import React from 'react';
import { motion } from 'framer-motion';

const FloatingWhatsApp = () => {
  const phoneNumber = "201032314117";
  // رسالة افتراضية تظهر لك عندما يضغط العميل على الزر
  const defaultMessage = "مرحباً، أود الاستفسار عن خدمات وكالة Control P.";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-8 left-8 z-[100]"
      dir="rtl"
    >
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:shadow-[0_0_35px_rgba(37,211,102,0.8)] transition-all duration-300"
      >
        {/* تأثير النبض (Pulse) لجذب الانتباه المستمر */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 group-hover:animate-ping"></span>

        {/* أيقونة واتساب الأصلية (SVG) */}
        <svg className="w-9 h-9 relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.128.552 4.195 1.603 6.012L.031 24l6.143-1.602c1.758.966 3.743 1.478 5.857 1.478 6.645 0 12.03-5.385 12.03-12.03S18.676 0 12.031 0zm0 21.895c-1.802 0-3.567-.48-5.116-1.39l-.367-.217-3.8.995.996-3.8-.238-.38c-1.002-1.597-1.53-3.46-1.53-5.372 0-5.545 4.512-10.058 10.056-10.058 5.545 0 10.057 4.513 10.057 10.058s-4.512 10.057-10.057 10.057zm5.518-7.533c-.302-.15-1.792-.885-2.072-.986-.28-.1-.484-.15-.688.15s-.786.986-.964 1.186c-.178.201-.356.226-.658.075-2.01-.76-3.54-1.92-4.734-3.66-.18-.26-.02-.4.13-.55.13-.14.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.688-1.66-.942-2.27-.247-.59-.5-.51-.688-.52-.178-.01-.382-.01-.586-.01-.204 0-.536.075-.816.376-.28.301-1.07 1.045-1.07 2.545s1.096 2.95 1.25 3.15c.15.201 2.15 3.28 5.21 4.6 2.05.88 2.85.94 3.92.79 1.13-.16 2.37-.97 2.7-1.91.33-.94.33-1.74.23-1.91-.1-.17-.3-.27-.6-.42z"/>
        </svg>

        {/* رسالة توضيحية تظهر عند تمرير الماوس (Tooltip) */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#1F2937] border border-gray-700 text-white text-sm font-bold py-2 px-5 rounded-2xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          تواصل معنا الآن!
          {/* مثلث المؤشر الصغير للمربع */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-[#1F2937] border-t border-r border-gray-700 transform rotate-45"></div>
        </div>
      </a>
    </motion.div>
  );
};

export default FloatingWhatsApp;
