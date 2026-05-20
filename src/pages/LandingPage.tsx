import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Globe, ArrowRight, Menu, X, Home, ShoppingBag, Layout } from 'lucide-react';
import Logo from '../components/Logo';
import ServicePackages from '../components/ServicePackages';
import FloatingParticles from '../components/FloatingParticles';
import WhyChooseUsBento from '../components/WhyChooseUsBento';
import MainServicesGrid from '../components/MainServicesGrid';
import HeroServiceSlider from '../components/HeroServiceSlider';
import CampaignManagement from '../components/CampaignManagement';
import WebDevelopmentSection from '../components/WebDevelopmentSection';
import PromoSlider from '../components/PromoSlider';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const LandingPage = () => {
  const { t, lang, setLang, isRtl } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const targetY = element 
      ? element.getBoundingClientRect().top + window.pageYOffset - 100 
      : (id === 'top' ? 0 : null);

    if (targetY === null) return;
    
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();
    const duration = 400; // Faster than native smooth scroll

    const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      
      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  };

  // Handle body scroll lock
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#03060B] text-white overflow-x-hidden relative" dir={isRtl ? 'rtl' : 'ltr'}>
      <FloatingParticles />
      
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[160px] rounded-full" />
      </div>

      {/* Mobile Menu Drawer - Moved outside NAV for clean stacking */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
            />
            
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                "fixed top-0 bottom-0 w-full sm:w-[400px] bg-[#0A0A0B] z-[210] flex flex-col shadow-2xl transition-all",
                isRtl ? "right-0 border-l border-white/10" : "left-0 border-r border-white/10"
              )}
            >
              <div className="p-8 pt-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-12">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-white/30">{lang === 'ar' ? 'القائمة' : 'Menu'}</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white active:scale-95 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                  <div className="flex flex-col gap-4">
                    {[
                      { to: "/", id: "top", icon: <Home className="w-5 h-5 text-blue-500" />, label: t('home'), color: "blue" },
                      { href: "#service-packages", id: "service-packages", icon: <ShoppingBag className="w-5 h-5 text-red-500" />, label: t('services'), color: "red" },
                      { 
                        to: user ? "/dashboard" : "/login", 
                        icon: <Layout className="w-5 h-5" />, 
                        label: user ? t('dashboard') : t('login'), 
                        color: "blue", 
                        variant: "dashboard" 
                      }
                    ].map((item, idx) => {
                      const Component = item.to ? Link : 'a';
                      const props = item.to ? { to: item.to } : { href: item.href };
                      
                      return (
                        <Component
                          key={idx}
                          {...(props as any)}
                          onClick={(e: any) => { 
                            if (item.id) scrollToSection(e, item.id);
                            setIsMobileMenuOpen(false); 
                          }}
                          className={cn(
                            "flex items-center justify-between p-5 border rounded-[2rem] group transition-all",
                            item.variant === 'dashboard' 
                              ? "bg-blue-600/5 border-blue-500/10 hover:bg-blue-600/10" 
                              : "bg-gradient-to-br from-white/[0.03] to-transparent border-white/[0.05] hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="flex items-center gap-4 pointer-events-none">
                            <div className={cn(
                              "w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                              item.color === 'blue' ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500",
                              item.variant === 'dashboard' && "bg-blue-500/20 text-blue-400"
                            )}>
                              {item.icon}
                            </div>
                            <span className={cn(
                              "text-lg font-black uppercase tracking-widest",
                              item.variant === 'dashboard' ? "text-blue-400" : "text-white"
                            )}>
                              {item.label}
                            </span>
                          </div>
                          <ArrowRight className={cn(
                            "w-5 h-5 transition-all pointer-events-none",
                            item.variant === 'dashboard' ? "text-blue-500/30 group-hover:text-blue-500" : "text-white/10 group-hover:text-white",
                            "group-hover:translate-x-1",
                            isRtl && "rotate-180 group-hover:-translate-x-1"
                          )} />
                        </Component>
                      );
                    })}
                  </div>

                <div className="mt-auto pt-10 border-t border-white/5 space-y-4">
                  <button 
                    onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-3 p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <Globe className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" />
                    <span className="text-sm font-black uppercase tracking-widest">{lang === 'en' ? 'Switch to Arabic' : 'التحويل للعربية'}</span>
                  </button>

                  {user && (
                    <button 
                      onClick={() => { auth.signOut(); setIsMobileMenuOpen(false); }}
                      className="w-full p-5 bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all"
                    >
                      {t('logout')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-16 py-5 bg-[#03060B]/80 backdrop-blur-xl border-b border-white/[0.05]">
        
        <div className="flex-1 flex items-center min-w-max">
           <Link to="/" onClick={(e) => scrollToSection(e, 'top')} className="z-[110]">
              <Logo iconSize={24} textSize="text-xl md:text-2xl" />
           </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-[2] items-center justify-center gap-8 text-[11px] font-black tracking-[0.15em] text-white">
           <Link to="/" onClick={(e) => scrollToSection(e, 'top')} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all uppercase flex items-center gap-2 group">
              <Home className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
              {t('home')}
           </Link>
           <a href="#service-packages" onClick={(e) => scrollToSection(e, 'service-packages')} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all uppercase flex items-center gap-2 group">
              <ShoppingBag className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
              {t('services')}
           </a>
        </div>

        <div className="flex-1 flex items-center justify-end gap-3 z-[110]">
           <button 
             onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
             className="hidden sm:flex items-center gap-2 font-black text-white bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest group relative z-10"
           >
              <Globe className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform pointer-events-none" />
              <span className="pointer-events-none">{lang === 'en' ? 'Arabic' : 'English'}</span>
           </button>
           
            <Link 
              to={user ? "/dashboard" : "/login"}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              {user ? t('dashboard') : t('login')}
            </Link>


           {/* Mobile Menu Toggle */}
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="lg:hidden p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white transition-all active:scale-95 hover:bg-white/[0.08] relative group overflow-hidden z-[110]"
           >
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             {isMobileMenuOpen ? (
               <X className="w-6 h-6 relative z-10 pointer-events-none" />
             ) : (
               <Menu className="w-6 h-6 relative z-10 pointer-events-none" />
             )}
           </button>
        </div>
      </nav>

      <div className="pt-20">
        <HeroServiceSlider />
      </div>

      <PromoSlider />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <MainServicesGrid />
      </div>

      <div id="video-services-intro" className="scroll-mt-32">
        <WhyChooseUsBento />
      </div>

      <WebDevelopmentSection />

      <CampaignManagement />

      <ServicePackages />

      <section id="how-it-works" className="relative z-10 py-16 px-6 max-w-7xl mx-auto scroll-mt-32" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-8">
            {t('howItWorks')}
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg font-medium">To Become A Brand — Control P</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {[
            { 
              step: "01", 
              title: t('step1Title'), 
              sub: t('step1Sub') 
            },
            { 
              step: "02", 
              title: t('step2Title'), 
              sub: t('step2Sub'),
              action: () => document.getElementById('service-packages')?.scrollIntoView({ behavior: 'smooth' })
            },
            { 
              step: "03", 
              title: t('step3Title'), 
              sub: t('step3Sub'),
              action: () => document.getElementById('service-packages')?.scrollIntoView({ behavior: 'smooth' })
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              onClick={item.action}
              className={cn(
                "relative p-12 bg-[#0A0F1A]/50 border border-white/5 rounded-[3rem] text-center group transition-all hover:border-blue-500/30 hover:bg-[#0A0F1A]/80 shadow-2xl",
                item.action && "cursor-pointer"
              )}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-8 mx-auto shadow-2xl shadow-blue-600/30 group-hover:scale-110 transition-all">
                {item.step}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">{item.sub}</p>
              {item.action && (
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all`}>
                  {t('viewPackages')}
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
          <Link to="/refund-policy" className="hover:text-white transition-colors">{lang === 'ar' ? 'سياسة الاسترجاع' : 'Refund Policy'}</Link>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 text-center md:text-right">
          {t('copyright')}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage ;
