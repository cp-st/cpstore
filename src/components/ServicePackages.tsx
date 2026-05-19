import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, ArrowRight, Loader2, Phone, Sparkles, Video, Layout, TrendingUp, Shield, Facebook, Rocket, Link as LinkIcon } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

import VideoPortfolio from './VideoPortfolio';

const ServicePackages = () => {
  const { t, lang, isRtl } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('growth');

  // Handle URL hash to switch tabs
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      let tabToSet = '';
      if (hash === 'video-services' || hash === 'video-production' || hash === 'video-portfolio-grid') tabToSet = 'video';
      else if (hash === 'design-services' || hash === 'visual-identity' || hash === 'branding-packages') tabToSet = 'design';
      else if (hash === 'growth-services' || hash === 'growth-management' || hash === 'campaign-management' || hash === 'social-media-management') tabToSet = 'growth';
      
      if (tabToSet) {
        setActiveTab(tabToSet);
        // Explicitly scroll after a small delay to allow React to render the new tab content
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    };

    handleHashChange();
    
    // Explicitly scroll after a small delay to allow React to render the new tab content
    const timeout = setTimeout(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearTimeout(timeout);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderStep, setOrderStep] = useState<string>('details');
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // States for Custom Video Flow
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCustomPkg, setSelectedCustomPkg] = useState<any>(null);

  // States for form data
  const [orderDetails, setOrderDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'etisalat' | 'binance'>('etisalat');
  const [transferNumber, setTransferNumber] = useState('');
  const [binanceTxId, setBinanceTxId] = useState('');
  const [facebookLink, setFacebookLink] = useState('');

  // States for Calculator (referenced in user-provided submitOrder)
  const [calcQuantity, setCalcQuantity] = useState(1000);
  const [calcPlatform, setCalcPlatform] = useState('instagram');
  const [calcService, setCalcService] = useState('followers');

  const tabs = [
    { id: 'growth', label: lang === 'ar' ? 'تكبير وإدارة الصفحات' : 'Growth & Management', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'design', label: lang === 'ar' ? 'تصميم الهوية البصرية' : 'Visual Identity Design', icon: <Layout className="w-5 h-5" /> },
    { id: 'video', label: lang === 'ar' ? 'صناعة الفيديو' : 'Video Production', icon: <Video className="w-5 h-5" /> },
  ];

  const packages: any = {
    growth: [
      { 
        id: 'foundation', 
        name: lang === 'ar' ? 'باقة التميز (فيس بوك)' : 'Foundation (Facebook)', 
        price: '850', 
        features: lang === 'ar' ? ['10,000 متابع', '10,000 لايك وتفاعل'] : ['10,000 Followers', '10,000 Likes & Engagement'], 
        highlight: false,
        icon: (
          <svg className="w-8 h-8 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l0.532 3.47h-2.86v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      },
      { 
        id: 'star', 
        name: lang === 'ar' ? 'باقة المشاهير (انستجرام)' : 'The Star (Instagram)', 
        price: '950', 
        features: lang === 'ar' ? ['10,000 متابع', '5,000 لايك', '50,000 مشاهدة'] : ['10,000 Followers', '5,000 Likes', '50,000 Views'], 
        highlight: false,
        icon: (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="url(#insta-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.5 6.51L17.51 6.49889" stroke="url(#insta-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#insta-grad)" strokeWidth="2"/>
            <defs>
              <linearGradient id="insta-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#405DE6"/><stop offset="0.25" stopColor="#5851DB"/><stop offset="0.5" stopColor="#833AB4"/><stop offset="0.75" stopColor="#E1306C"/><stop offset="1" stopColor="#F77737"/>
              </linearGradient>
            </defs>
          </svg>
        )
      },
      { 
        id: 'trend', 
        name: lang === 'ar' ? 'باقة البلوجر (تيك توك)' : 'The Trend (TikTok)', 
        price: '1000', 
        features: lang === 'ar' ? ['5,000 متابع', '5,000 لايك', '25,000 دعم اكسبلور'] : ['5,000 Followers', '5,000 Likes', '25,000 Explore Support'], 
        highlight: true,
        icon: (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.227-1.178 4.793 4.793 0 0 1-1.321-2.908L15.04 2h-3.44v14.471a3.074 3.074 0 0 1-2.225 3.044 3.081 3.081 0 0 1-3.197-1.07 3.076 3.076 0 0 1-.502-3.163 3.073 3.073 0 0 1 2.87-2.023c.18 0 .36.015.539.043v-3.48a6.554 6.554 0 0 0-.539-.022 6.558 6.558 0 0 0-6.115 4.312 6.57 6.57 0 0 0 1.07 6.745 6.568 6.568 0 0 0 6.816 2.22 6.557 6.557 0 0 0 4.757-6.27V9.03a8.181 8.181 0 0 0 5.425 2.05V7.64a4.75 4.75 0 0 1-3.04-1.174l-.001.22z" fill="white"/>
          </svg>
        )
      },
      { 
        id: 'giant', 
        name: lang === 'ar' ? 'The Giant (شامل المنصات)' : 'The Giant (All Platforms)', 
        price: '2500', 
        features: lang === 'ar' ? ['فيسبوك: 25,000 متابع', 'تيك توك: 15K متابع + 50K مشاهدة', 'انستجرام: 5K متابع + 50K مشاهدة ستوري'] : ['Facebook: 25,000 Followers', 'TikTok: 15K Followers + 50K Views', 'Instagram: 5K Followers + 50K Story Views'], 
        highlight: true,
        icon: <Rocket className="w-12 h-12 text-blue-500" />
      },
      { 
        id: 'custom_smm', 
        name: lang === 'ar' ? 'طلب مخصص' : 'Custom Order', 
        price: '', 
        features: lang === 'ar' ? ['اختر الكمية المناسبة', 'دعم فني مخصص', 'تنفيذ فوري'] : ['Choose your quantity', 'Custom support', 'Instant execution'], 
        highlight: false,
        icon: <TrendingUp className="w-12 h-12 text-purple-500" />
      }
    ],
    design: [
      { 
        id: 'design_10', 
        name: lang === 'ar' ? 'عرض الـ 10 تصميمات' : '10-Design Bundle', 
        price: '999', 
        oldPrice: '3000', 
        features: lang === 'ar' ? [
          '10 تصميمات بوسترات سوشيال ميديا', 
          'تصميمات كفرات احترافية',
          'تصميم عبوات ومنتجات', 
          'تصميم لوجو مميز'
        ] : [
          '10 Social Media Posters',
          'Professional Cover Designs',
          'Product Packaging',
          'Unique Logo Design'
        ], 
        highlight: false, 
        badge: lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular',
        icon: <Layout className="w-12 h-12 text-yellow-500" />
      },
      { 
        id: 'design_50', 
        name: lang === 'ar' ? 'عرض الـ 50 (تصميم وفيديو)' : 'Big 50 Bundle (Design & Video)', 
        price: '5000', 
        oldPrice: '9000', 
        features: lang === 'ar' ? [
          '25 تصميم بوستر', 
          '25 فيديو إعلاني',
          'تصميمات كفرات', 
          'تصميم عبوات ومنتجات'
        ] : [
          '25 Poster Designs',
          '25 Video Ads',
          'Cover Designs',
          'Product Packaging'
        ], 
        highlight: true, 
        badge: lang === 'ar' ? 'لفترة محدودة' : 'Limited Time',
        icon: <Sparkles className="w-12 h-12 text-blue-400" />
      }
    ],
    video: [
      {
        id: 'v1',
        name: lang === 'ar' ? 'باقة الإنتاج السينمائي' : 'Cinematic Production',
        price: '1500',
        features: lang === 'ar' ? ['صناعة 4 فيديوهات إعلانية احترافية', 'فيديو يخطف العين (سينمائي)', 'تصميم الفكرة والسكريبت', 'مونتاج احترافي'] : ['4 Professional Ad Videos', 'Eye-catching Visuals', 'Concept & Scripting', 'Pro Video Editing'],
        highlight: true,
        icon: <Video className="w-12 h-12 text-red-500" />
      },
      {
        id: 'custom_video',
        name: lang === 'ar' ? 'فيديو مخصص' : 'Custom Video',
        price: lang === 'ar' ? 'حسب المتطلبات' : 'Custom Quote',
        features: lang === 'ar' ? ['فيديو 30 ثانية أو دقيقة', 'استهداف ماكس للعميل الصح', 'زيادة المبيعات وتحويل المشاهدات لعملاء'] : ['30s or 60s Video', 'Targeted Marketing', 'Sales Conversion Focus'],
        highlight: false,
        icon: <Shield className="w-12 h-12 text-blue-500" />
      }
    ]
  };

  const customCategories = [
    { id: 'tech', name: 'Tech & Gaming', icon: '🎮' },
    { id: 'auto', name: 'Automotive', icon: '🏎️' },
    { id: 'realestate', name: 'Real Estate & Hospitality', icon: '🏢' },
    { id: 'food', name: 'Food & Beverage', icon: '🍔' },
  ];

  const customSubPackages = [
    { 
      id: 'pkg_10', 
      name: lang === 'ar' ? 'الباقة الأساسية' : 'Basic Package', 
      price: '10$', 
      features: lang === 'ar' ? ['فيديو احترافي مخصص لمجالك'] : ['Custom professional video for your niche'],
      highlight: false
    },
    { 
      id: 'pkg_25', 
      name: lang === 'ar' ? 'الباقة الإعلانية المتكاملة' : 'Pro Ads Bundle', 
      price: '25$', 
      features: lang === 'ar' ? ['إنتاج هوية متكاملة من لوجو', 'عدد 6 فيديوهات لليوتيوب والفيس بوك', 'تجهيز احترافي للإعلانات'] : ['Full brand identity & logo', '6 Videos for YT/FB', 'Professional ad setup'],
      highlight: true
    }
  ];

  const handleOrderClick = (pkg: any) => {
    if (!user) {
      toast.error(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    setSelectedPkg(pkg);
    if (pkg.id === 'custom_video') {
      setOrderStep('categories');
    } else {
      setOrderStep('details');
    }
    setIsModalOpen(true);
  };

  const handleServiceClick = (tabId: string) => {
    setActiveTab(tabId);
    
    // Determine the section ID based on the tab ID
    const sectionId = tabId === 'growth' ? 'growth-services' : 
                     tabId === 'design' ? 'design-services' : 
                     tabId === 'video' ? 'video-services' : tabId;
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 150); // Delay slightly more to ensure tab content is rendered
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setOrderStep('details');
    setOrderDetails('');
    setPaymentMethod('etisalat');
    setTransferNumber('');
    setBinanceTxId('');
    setFacebookLink('');
    setSelectedCategory('');
    setSelectedCustomPkg(null);
  };

  const submitOrder = async () => {
    if (!user) {
      toast.error(lang === 'ar' ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    setLoading(true);
    try {
      // 1. Prepare data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
        targetLink: facebookLink,
        orderDetails: orderDetails,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'etisalat' ? transferNumber : binanceTxId,
        price: selectedPkg.id === 'custom_video' && selectedCustomPkg ? selectedCustomPkg.price : selectedPkg.price,
        currency: lang === 'ar' ? 'EGP' : 'EGP',
        status: 'pending',
        category: activeTab,
        createdAt: serverTimestamp(),
      };

      // 2. Save to Firestore (Primary Record)
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log("Order saved to Firestore with ID:", docRef.id);

      // 3. Optional: SMM API Integration if applicable
      const serviceMap: Record<string, number> = {
        'foundation': 101,
        'star': 102,
        'trend': 103,
        'giant': 104
      };

      const smmServiceId = selectedPkg.id === 'custom_smm' ? getServiceIdForCustom() : serviceMap[selectedPkg.id];

      if (smmServiceId) {
        try {
          const response = await fetch('/api/smm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceId: smmServiceId,
              link: facebookLink || orderDetails,
              quantity: selectedPkg.id === 'custom_smm' ? calcQuantity : 10000,
              packagePrice: orderData.price,
              internalOrderId: docRef.id
            })
          });
          const result = await response.json();
          if (result.success) {
            console.log("SMM Provider accepted order:", result.orderId);
          }
        } catch (smmErr) {
          console.error("SMM API Error (Non-blocking):", smmErr);
        }
      }

      // 4. Success handling
      toast.success(lang === 'ar' ? 'تم استلام طلبك بنجاح! سنتواصل معك قريباً.' : 'Order received successfully! We will contact you soon.');
      closeAndResetModal();
    } catch (error: any) {
      console.error("Firestore submission error:", error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء إرسال البيانات، يرجى المحاولة مرة أخرى.' : 'Error sending data, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // دالة مساعدة لتحديد رقم خدمة الـ SMM للحاسبة التفاعلية
  const getServiceIdForCustom = () => {
     // مثال: إذا اختار انستجرام + متابعين، نرسل ID الخدمة المخصصة لذلك
     if (calcPlatform === 'instagram' && calcService === 'followers') return 201;
     if (calcPlatform === 'tiktok' && calcService === 'views') return 302;
     return 100; // ID افتراضي
  };

  const displayPrice = selectedPkg?.id === 'custom_video' && selectedCustomPkg 
    ? selectedCustomPkg.price 
    : (selectedPkg?.price + (lang === 'ar' ? ' ج.م' : ' EGP'));

  const getBackgroundImage = (category: string) => {
    switch (category) {
      case 'video': return 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800';
      case 'design': return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800';
      case 'growth': return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';
      default: return '';
    }
  };

  return (
    <div className="py-8 bg-[#050505] text-white relative overflow-hidden scroll-mt-32" id="service-packages">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('professionalServices')}
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent px-4">
            {activeTab === 'growth' ? t('growthAutomationTitle') : activeTab === 'design' ? t('visualIdentityTitle') : t('cinemaProductionTitle')}
          </h2>
          <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto px-6">
            {activeTab === 'growth' ? t('growthAutomationDesc') : activeTab === 'design' ? t('visualIdentityDesc') : t('cinemaProductionDesc')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-16 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleServiceClick(tab.id)}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest transition-all border shrink-0 sm:shrink",
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
              )}
            >
              {React.cloneElement(tab.icon as React.ReactElement, { className: "w-4 h-4 sm:w-5 h-5" })}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Portfolio */}
        {activeTab === 'video' && (
          <div id="video-services" className="space-y-16 scroll-mt-32">
            {/* Embedded Premium Video Hero */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative py-4 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#BF953F]/10 blur-[100px] pointer-events-none"></div>

              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className={`flex items-center gap-3 mb-6 ${isRtl ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                      <span className="w-12 h-0.5 bg-[#BF953F]"></span>
                      <span className="text-[#BF953F] font-black uppercase tracking-widest text-sm">{t('videoSectionTag')}</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1]">
                      {t('videoSectionTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">4K</span>
                    </h2>
                    
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                      {t('videoSectionDesc')}
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                      <div className={isRtl ? 'text-right' : 'text-left'}>
                        <div className="text-3xl font-black text-white mb-1">100%</div>
                        <div className="text-gray-500 text-sm font-bold">{t('creativeScripting')}</div>
                      </div>
                      <div className={isRtl ? 'text-right' : 'text-left'}>
                        <div className="text-3xl font-black text-white mb-1">24h</div>
                        <div className="text-gray-500 text-sm font-bold">{t('fastDelivery')}</div>
                      </div>
                    </div>

                    <div className={`flex flex-wrap gap-4 ${isRtl ? 'justify-start' : 'justify-start'}`}>
                      <button 
                        onClick={() => handleOrderClick(packages.video[0])}
                        className="group relative px-10 py-4 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(255,255,255,0.1)]"
                      >
                        <span className="relative z-10">{t('orderVideoAction')}</span>
                        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                      <button 
                        onClick={() => {
                          const el = document.getElementById('video-portfolio-grid');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-10 py-4 border-2 border-white/10 text-white font-black rounded-full hover:bg-white/5 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        {t('ourWorks')}
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="flex-1 w-full relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 group shadow-2xl"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200" 
                      alt="Video Production"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-24 h-24 bg-[#BF953F] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(191,149,63,0.5)] group/play"
                      >
                        <Video className="w-10 h-10 text-black translate-x-0.5" />
                      </motion.button>
                    </div>

                    <div className={`absolute bottom-8 ${isRtl ? 'right-8' : 'left-8'} flex items-center gap-3`}>
                      <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Client" />
                          </div>
                        ))}
                      </div>
                      <div className="text-white text-xs font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                        +150 {t('clientTrust')}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
        </div>
      )}

        {/* Packages */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            id={activeTab === 'growth' ? 'growth-services' : activeTab === 'design' ? 'design-services' : undefined}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className={cn(
              "grid gap-8 scroll-mt-32",
              activeTab === 'growth' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {packages[activeTab].map((pkg: any, index: number) => (
              <motion.div 
                key={`${activeTab}-${pkg.id}`}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                className={cn(
                  "relative floating-island rounded-[2.5rem] p-10 border transition-all hover:scale-[1.02] active:scale-[0.98] group overflow-hidden",
                  activeTab === 'growth' ? "border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:border-blue-400/60 hover:shadow-[0_15px_60px_-15px_rgba(59,130,246,0.3)]" :
                  activeTab === 'design' ? "border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.1)] hover:border-yellow-400/60 hover:shadow-[0_15px_60px_-15px_rgba(234,179,8,0.3)]" :
                  "border-blue-400/30 shadow-[0_0_40px_rgba(96,165,250,0.1)] hover:border-blue-300/60 hover:shadow-[0_15px_60px_-15px_rgba(96,165,250,0.3)]"
                )}
              >
                {/* Visual Glow Effect */}
                <div 
                  className={cn(
                    "absolute -inset-2 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -z-10",
                    activeTab === 'growth' ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30" :
                    activeTab === 'design' ? "bg-yellow-500/20" :
                    "bg-blue-400/20"
                  )}
                />
                {/* Background Image with Professional Technical Overlay */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-10">
                   <img 
                     src={getBackgroundImage(activeTab)} 
                     alt="" 
                     className="w-full h-full object-cover grayscale brightness-50"
                   />
                   {/* Technical Grid Pattern */}
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/95 to-[#0F0F12]/60" />
                </div>

                {pkg.badge && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full animate-pulse z-20">
                    {pkg.badge}
                  </div>
                )}

                <div className="relative z-10">
                  {pkg.highlight && !pkg.badge && (
                    <div className="absolute -top-10 -right-10 py-2 px-6 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                      {lang === 'ar' ? 'الأفضل قيمة' : 'Best Value'}
                    </div>
                  )}
                  
                  <div className="mb-10 text-center">
                    {pkg.icon && (
                      <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                          <div className="relative z-10">{pkg.icon}</div>
                          <div className={cn(
                            "absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full",
                            activeTab === 'growth' ? "bg-blue-500" : activeTab === 'design' ? "bg-yellow-500" : "bg-red-500"
                          )} />
                        </div>
                      </div>
                    )}
                    <h3 className="text-2xl font-black mb-4">{pkg.name}</h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-black text-white">{pkg.price}</span>
                      {pkg.price && pkg.price !== 'حسب المتطلبات' && pkg.price !== 'Custom Quote' && (
                        <span className="text-white/30 font-bold">{lang === 'ar' ? 'ج.م' : 'EGP'}</span>
                      )}
                    </div>
                    {pkg.oldPrice && (
                      <div className="mt-2 text-white/20 line-through font-bold text-sm">
                        {pkg.oldPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {pkg.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-white/60 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleOrderClick(pkg)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]",
                      pkg.highlight 
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                  >
                    {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Video Portfolio Sections - positioned under the packages for the video tab */}
        {activeTab === 'video' && (
          <div className="mt-24">
            <VideoPortfolio />
          </div>
        )}

        {/* Trust Indicators for Growth Tab */}
        {activeTab === 'growth' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white/5 border border-white/5 rounded-[2.5rem] p-10 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
             <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                 <Shield className="w-8 h-8 text-blue-400" />
               </div>
               <div>
                 <p className="font-black uppercase tracking-widest text-sm text-white mb-1">{lang === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee'}</p>
                 <p className="text-white/40 text-xs font-medium">{lang === 'ar' ? 'خدمة آمنة وموثوقة' : 'Safe and reliable service'}</p>
               </div>
             </div>
             <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                 <TrendingUp className="w-8 h-8 text-blue-400" />
               </div>
               <div>
                 <p className="font-black uppercase tracking-widest text-sm text-white mb-1">{lang === 'ar' ? 'نتائج مضمونة' : 'Guaranteed Results'}</p>
                 <p className="text-white/40 text-xs font-medium">{lang === 'ar' ? 'تطور مستمر لحسابك' : 'Continuous account growth'}</p>
               </div>
             </div>
             <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                 <Loader2 className="w-8 h-8 text-blue-400" />
               </div>
               <div>
                 <p className="font-black uppercase tracking-widest text-sm text-white mb-1">{lang === 'ar' ? 'سرعة في التنفيذ' : 'Fast Execution'}</p>
                 <p className="text-white/40 text-xs font-medium">{lang === 'ar' ? 'في وقت قياسي' : 'In record time'}</p>
               </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPkg && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[100] p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  damping: 25,
                  stiffness: 300
                }
              }}
              exit={{ opacity: 0, scale: 0.8, y: 40, transition: { duration: 0.2 } }}
              className="bg-[#0F0F12] border border-white/10 rounded-[2rem] sm:rounded-[3rem] w-full max-w-xl relative shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Decorative glows */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[60px] rounded-full" />
              
              <button 
                onClick={closeAndResetModal} 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 h-6" />
              </button>
              
              <div className="overflow-y-auto p-5 sm:p-10">
                {/* Step: Categories */}
              {orderStep === 'categories' && (
                <div className="relative">
                  <h3 className="text-3xl font-black mb-2 text-center">
                    {lang === 'ar' ? 'حدد مجال عملك (Niche)' : 'Choose your Niche'}
                  </h3>
                  <p className="text-white/40 mb-10 text-center font-medium">
                    {lang === 'ar' ? 'اختر التصنيف الأقرب لعلامتك التجارية لتقديم محتوى مخصص لك.' : 'Select the closest category for your brand to get custom content.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {customCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setOrderStep('sub_packages');
                        }}
                        className="bg-white/5 border border-white/10 hover:border-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white/10 group"
                      >
                       <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                       <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white" dir="ltr">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step: Sub Packages */}
              {orderStep === 'sub_packages' && (
                <div className="relative">
                   <h3 className="text-3xl font-black mb-2 text-center">
                    {lang === 'ar' ? 'اختر الباقة المناسبة' : 'Choose Your Package'}
                  </h3>
                  <p className="text-white/40 mb-10 text-center font-medium">
                    {lang === 'ar' ? `لمجال: ` : `Niche: `}
                    <span className="text-blue-400 font-black tracking-widest uppercase" dir="ltr">{selectedCategory}</span>
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {customSubPackages.map((subPkg) => (
                      <div 
                        key={subPkg.id} 
                        className={cn(
                          "bg-white/5 rounded-[2rem] p-8 border flex flex-col relative group transition-all",
                          subPkg.highlight ? "border-blue-500/50 shadow-2xl shadow-blue-500/10" : "border-white/10"
                        )}
                      >
                        {subPkg.highlight && (
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                              {lang === 'ar' ? 'الأفضل قيمة' : 'Best Value'}
                           </div>
                        )}
                        <h4 className="text-lg font-black mb-2 text-center">{subPkg.name}</h4>
                        <p className="text-3xl font-black text-white text-center mb-6" dir="ltr">{subPkg.price}</p>
                        <ul className="space-y-3 mb-6 flex-grow">
                          {subPkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[10px] font-bold text-white/40">
                              <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => {
                            setSelectedCustomPkg(subPkg);
                            setOrderStep('payment');
                          }}
                          className={cn(
                            "w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                            subPkg.highlight ? "bg-blue-600 text-white" : "bg-white/10 text-white"
                          )}
                        >
                          {lang === 'ar' ? 'اختيار ومتابعة' : 'Select & Continue'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setOrderStep('categories')} 
                    className="mt-8 text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center w-full gap-2 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" />
                    {lang === 'ar' ? 'العودة لتغيير المجال' : 'Back to Niche selection'}
                  </button>
                </div>
              )}

              {/* Step 1: Details (Standard Flow) */}
              {orderStep === 'details' && (
                <div className="relative">
                  <h3 className="text-3xl font-black mb-2 flex items-center gap-3">
                    {lang === 'ar' ? 'إتمام الطلب:' : 'Order:'} {selectedPkg.name}
                  </h3>
                  <p className="text-white/40 mb-10 font-medium">
                    {lang === 'ar' ? 'يرجى تزويدنا برابط الحساب أو تفاصيل طلبك للبدء.' : 'Please provide account link or details to start.'}
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-3 ml-1">
                        {lang === 'ar' ? 'رابط الحساب / التفاصيل' : 'Account Link / Details'}
                      </label>
                      <textarea 
                        rows={3} 
                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                        placeholder={lang === 'ar' ? 'ضع رابط حسابك هنا أو اكتب ملاحظاتك...' : 'Place your account link here or write notes...'}
                        value={orderDetails}
                        onChange={(e) => setOrderDetails(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    onClick={() => setOrderStep('payment')}
                    className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {lang === 'ar' ? 'المتابعة للدفع' : 'Continue to Payment'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {orderStep === 'payment' && (
                <div className="relative">
                  <h3 className="text-3xl font-black mb-6 text-center">
                    {lang === 'ar' ? 'اختر طريقة الدفع' : 'Choose Payment Method'}
                  </h3>

                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => setPaymentMethod('etisalat')}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border",
                        paymentMethod === 'etisalat' 
                          ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20" 
                          : "bg-white/5 border-white/5 text-white/40"
                      )}
                    >
                      {lang === 'ar' ? 'اتصالات كاش' : 'Etisalat Cash'}
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('binance')}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border",
                        paymentMethod === 'binance' 
                          ? "bg-[#FCD535] border-[#FCD535] text-black shadow-lg shadow-yellow-500/20" 
                          : "bg-white/5 border-white/5 text-white/40"
                      )}
                    >
                      {lang === 'ar' ? 'بينانس (Crypto)' : 'Binance (Crypto)'}
                    </button>
                  </div>
                  
                  {paymentMethod === 'etisalat' ? (
                    <motion.div 
                      key="etisalat-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-green-600/5 border border-green-500/20 rounded-[2rem] p-10 text-center mb-8"
                    >
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">{lang === 'ar' ? 'المبلغ المطلوب' : 'Amount Due'}</p>
                      <p className="text-5xl font-black text-white mb-6">
                        {displayPrice}
                      </p>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">{lang === 'ar' ? 'حول إلى رقم' : 'Transfer to Account'}</p>
                      <div className="inline-flex items-center gap-2 sm:gap-4 bg-black/40 px-3 sm:px-8 py-2.5 sm:py-4 rounded-2xl border border-white/5 mb-2 overflow-hidden">
                         <Phone className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-400 shrink-0" />
                         <span className="text-sm xs:text-lg sm:text-2xl font-black tracking-widest text-green-400 select-all whitespace-nowrap">01153339499</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="binance-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-yellow-500/5 border border-yellow-500/20 rounded-[2rem] p-10 text-center mb-8"
                    >
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">{lang === 'ar' ? 'المبلغ المطلوب (ما يعادل)' : 'Amount Due (Eqv.)'}</p>
                      <p className="text-5xl font-black text-[#FCD535] mb-6">
                        {displayPrice}
                      </p>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-3">{lang === 'ar' ? 'حساب Binance Pay ID' : 'Binance Pay ID'}</p>
                      <div className="inline-flex items-center gap-3 sm:gap-4 bg-black/40 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/5 mb-2 overflow-hidden">
                         <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#FCD535] rounded-full flex items-center justify-center font-black text-[8px] sm:text-[10px] text-black shrink-0">B</div>
                         <span className="text-base sm:text-2xl font-black tracking-widest text-[#FCD535] select-all whitespace-nowrap">724199355</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-3 ml-1">
                        {lang === 'ar' ? 'رابط الهدف (فيسبوك، يوتيوب، تيك توك...)' : 'Target Link (Facebook, YouTube, TikTok, Instagram...)'}
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input 
                          type="url" 
                          placeholder="https://platform.com/your-profile-or-video"
                          className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-14 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all text-left"
                          dir="ltr"
                          value={facebookLink}
                          onChange={(e) => setFacebookLink(e.target.value)}
                        />
                      </div>
                    </div>

                    {paymentMethod === 'etisalat' ? (
                      <div>
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-3 ml-1">
                          {lang === 'ar' ? 'الرقم المحول منه (للتأكيد)' : 'Sender Phone Number'}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input 
                            type="text" 
                            placeholder="01XXXXXXXXX"
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-14 text-white text-lg font-bold focus:outline-none focus:border-green-500/50 transition-all text-left"
                            dir="ltr"
                            value={transferNumber}
                            onChange={(e) => setTransferNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/30 mb-3 ml-1">
                          {lang === 'ar' ? 'رقم العملية (TxID)' : 'Transaction ID (TxID)'}
                        </label>
                        <div className="relative">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#FCD535]/10 rounded-full flex items-center justify-center font-bold text-[8px] text-[#FCD535]">Tx</div>
                          <input 
                            type="text" 
                            placeholder={lang === 'ar' ? "الصق معرف العملية هنا" : "Paste TxID here"}
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-14 text-white text-lg font-bold focus:outline-none focus:border-[#FCD535]/50 transition-all text-left"
                            dir="ltr"
                            value={binanceTxId}
                            onChange={(e) => setBinanceTxId(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <div className="flex gap-3 flex-1">
                      <button 
                        onClick={() => {
                          if (selectedPkg.id === 'custom_video') setOrderStep('sub_packages');
                          else setOrderStep('details');
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl transition-all border border-white/5 active:scale-[0.98] text-xs uppercase tracking-widest"
                      >
                        {lang === 'ar' ? 'رجوع' : 'Back'}
                      </button>
                      <button 
                        onClick={closeAndResetModal}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black py-5 rounded-2xl transition-all border border-red-500/10 active:scale-[0.98] text-xs uppercase tracking-widest"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                    <button 
                      onClick={submitOrder}
                      disabled={loading}
                      className={cn(
                        "sm:w-2/3 font-black py-5 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm uppercase tracking-widest",
                        paymentMethod === 'etisalat' 
                          ? "bg-green-600 hover:bg-green-500 text-white shadow-green-600/20" 
                          : "bg-[#FCD535] hover:bg-yellow-500 text-black shadow-yellow-500/20"
                      )}
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          {lang === 'ar' ? 'تأكيد الدفع والطلب' : 'Confirm & Submit'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicePackages;
