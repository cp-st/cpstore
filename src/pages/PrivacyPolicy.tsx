import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import FloatingParticles from '../components/FloatingParticles';

const PrivacyPolicy = () => {
  const { lang, isRtl } = useTranslation();

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: May 2024',
      sections: [
        {
          title: '1. Introduction',
          text: 'Welcome to Control P. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.'
        },
        {
          title: '2. Information We Collect',
          text: 'We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.'
        },
        {
          title: '3. How We Use Your Information',
          text: 'We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.'
        },
        {
          title: '4. Sharing Your Information',
          text: 'We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.'
        },
        {
          title: '5. Data Security',
          text: 'We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.'
        }
      ]
    },
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: مايو 2024',
      sections: [
        {
          title: '1. مقدمة',
          text: 'مرحبًا بكم في Control P. نحن ملتزمون بحماية معلوماتكم الشخصية وحقكم في الخصوصية. إذا كان لديكم أي أسئلة أو استفسارات حول سياستنا أو ممارساتنا فيما يتعلق بمعلوماتكم الشخصية، يرجى الاتصال بنا.'
        },
        {
          title: '2. المعلومات التي نجمعها',
          text: 'نحن نجمع المعلومات الشخصية التي تقدمونها لنا طواعية عندما تعبرون عن اهتمامكم بالحصول على معلومات عنا أو عن منتجاتنا وخدماتنا، أو عند مشاركتكم في أنشطة على الموقع الإلكتروني أو عند الاتصال بنا بأي طريقة أخرى.'
        },
        {
          title: '3. كيف نستخدم معلوماتكم',
          text: 'نستخدم المعلومات الشخصية التي نجمعها عبر موقعنا الإلكتروني لأغراض تجارية متنوعة موضحة أدناه. نقوم بمعالجة معلوماتكم الشخصية لهذه الأغراض استنادًا إلى مصالحنا التجارية المشروعة، من أجل الدخول في عقد معكم أو تنفيذه، بموافقتكم، و/أو للامتثال لالتزاماتنا القانونية.'
        },
        {
          title: '4. مشاركة معلوماتكم',
          text: 'نحن نشارك المعلومات فقط بموافقتكم، أو للامتثال للقوانين، أو لتزويدكم بالخدمات، أو لحماية حقوقكم، أو للوفاء بالالتزامات التجارية.'
        },
        {
          title: '5. أمن البيانات',
          text: 'لقد قمنا بتنفيذ إجراءات أمنية تقنية وتنظيمية مناسبة مصممة لحماية أمن أي معلومات شخصية نعالجها. ومع ذلك، يرجى تذكر أنه لا يمكننا ضمان أن الإنترنت نفسه آمن بنسبة 100٪.'
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
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[160px] rounded-full" />
      </div>

      <nav className="w-full px-6 md:px-16 py-8 relative z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
        >
          {isRtl ? <ArrowRight className="w-4 h-4 text-blue-500" /> : <ArrowLeft className="w-4 h-4 text-blue-500" />}
          {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-8">
            <Shield className="w-8 h-8 text-blue-500" />
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
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all"
            >
              <h2 className="text-xl md:text-2xl font-black mb-6 text-blue-400 tracking-tight">
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

export default PrivacyPolicy;
