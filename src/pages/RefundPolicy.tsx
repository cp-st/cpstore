import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import FloatingParticles from '../components/FloatingParticles';

const RefundPolicy = () => {
  const { lang, isRtl } = useTranslation();

  const content = {
    en: {
      title: 'Refund Policy',
      lastUpdated: 'Last Updated: May 2024',
      sections: [
        {
          title: '1. Service Excellence',
          text: 'At Control P, we strive for excellence in every project. Our goal is to provide high-quality media, social media, product design, and video design services that meet and exceed your expectations.'
        },
        {
          title: '2. Refund Eligibility',
          text: 'Due to the creative nature of our work and the extensive resources allocated at the start of each project, we generally do not offer full refunds once work has commenced. However, partial refunds may be considered if a cancellation request is received within 24 hours of booking and prior to any production work.'
        },
        {
          title: '3. Satisfaction Guarantee',
          text: 'We offer multiple revision rounds (as specified in each package) to ensure you are completely satisfied with the final result. We are committed to refining our designs until they align perfectly with your brand vision.'
        },
        {
          title: '4. Non-Refundable Items',
          text: 'Certain services such as completed video production, web development deployments, and digital advertising spend are non-refundable once they have been executed.'
        },
        {
          title: '5. Contact Us',
          text: 'If you have any questions regarding our refund policy or if you are unsatisfied with a service provided, please contact our support team immediately so we can resolve the issue.'
        }
      ]
    },
    ar: {
      title: 'سياسة الاسترجاع',
      lastUpdated: 'آخر تحديث: مايو 2024',
      sections: [
        {
          title: '1. التميز في الخدمة',
          text: 'في Control P، نسعى للتميز في كل مشروع. هدفنا هو تقديم ميديا عالية الجودة، وإدارة وسائل التواصل الاجتماعي، وتصميم المنتجات، وخدمات تصميم الفيديو التي تلبي وتتجاوز توقعاتك.'
        },
        {
          title: '2. أهلية الاسترجاع',
          text: 'نظرًا للطبيعة الإبداعية لعملنا والموارد الكبيرة التي يتم تخصيصها في بداية كل مشروع، فإننا لا نقدم عادةً استردادًا كاملاً للأموال بمجرد بدء العمل. ومع ذلك، قد يتم النظر في استرداد جزئي إذا تم استلام طلب الإلغاء في غضون 24 ساعة من الحجز وقبل أي أعمال إنتاج.'
        },
        {
          title: '3. ضمان الرضا',
          text: 'نقدم عدة جولات من المراجعات (كما هو محدد في كل باقة) لضمان رضاك التام عن النتيجة النهائية. نحن ملتزمون بتطوير تصاميمنا حتى تتماشى تمامًا مع رؤية علامتك التجارية.'
        },
        {
          title: '4. العناصر غير القابلة للاسترداد',
          text: 'بعض الخدمات مثل إنتاج الفيديو المكتمل، ونشر تطوير الويب، والإنفاق على الإعلانات الرقمية غير قابلة للاسترداد بمجرد تنفيذها.'
        },
        {
          title: '5. اتصل بنا',
          text: 'إذا كان لديك أي أسئلة بخصوص سياسة الاسترجاع الخاصة بنا أو إذا كنت غير راضٍ عن الخدمة المقدمة، يرجى الاتصال بفريق الدعم لدينا على الفور حتى نتمكن من حل المشكلة.'
        }
      ]
    }
  };

  const currentContent = lang === 'ar' ? content.ar : content.en;

  return (
    <div className="min-h-screen bg-[#03060B] text-white overflow-hidden relative font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <FloatingParticles />
      
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-900/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[160px] rounded-full" />
      </div>

      <nav className="w-full px-6 md:px-16 py-8 relative z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
        >
          {isRtl ? <ArrowRight className="w-4 h-4 text-red-500" /> : <ArrowLeft className="w-4 h-4 text-red-500" />}
          {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="w-16 h-16 bg-red-600/20 border border-red-500/20 rounded-2xl flex items-center justify-center mb-8">
            <RefreshCcw className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            {currentContent.title}
          </h1>
          <p className="text-white/40 font-medium tracking-widest uppercase text-xs">
            {currentContent.lastUpdated}
          </p>
        </motion.div>

        <div className="space-y-12">
          {currentContent.sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-red-500/10 transition-all"
            >
              <h2 className="text-xl md:text-2xl font-black mb-6 text-red-400 tracking-tight">
                {section.title}
              </h2>
              <p className="text-white/60 leading-relaxed text-lg font-medium opacity-80">
                {section.text}
              </p>
            </motion.section>
          ))}
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-white/20 text-xs font-black uppercase tracking-widest">
                © {new Date().getFullYear()} Control P - To Become A Brand
            </p>
        </footer>
      </div>
    </div>
  );
};

export default RefundPolicy;
