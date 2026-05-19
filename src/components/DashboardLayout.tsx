import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, ShoppingCart, List, CreditCard, Code, LifeBuoy, 
  Settings, LogOut, Menu, X, Rocket, Bell, Search, Globe, Shield,
  TrendingUp, ArrowLeft
} from 'lucide-react';
import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { auth } from '../lib/firebase';
import { cn, formatCurrency } from '../lib/utils';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const { profile, isAdmin } = useAuth();
  const { t, lang, setLang, isRtl } = useTranslation();
  const location = useLocation();

  // Auto-close sidebar on route change on mobile and handle scroll lock
  React.useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const menuItems = [
    { icon: <Home />, label: t('home'), path: '/' },
    { icon: <TrendingUp />, label: t('dashboard'), path: '/dashboard' },
    { icon: <ShoppingCart />, label: t('newOrder'), path: '/dashboard/new-order' },
    { icon: <List />, label: t('orders'), path: '/dashboard/orders' },
    { icon: <CreditCard />, label: t('addFunds'), path: '/dashboard/add-funds' },
    { icon: <Settings />, label: t('services'), path: '/dashboard/services' },
    { icon: <Code />, label: t('api'), path: '/dashboard/api' },
    { icon: <LifeBuoy />, label: t('tickets'), path: '/dashboard/tickets' },
  ];

  if (isAdmin) {
    menuItems.push({ icon: <Shield />, label: t('admin'), path: '/admin' });
    menuItems.push({ icon: <CreditCard />, label: lang === 'en' ? 'Deposits' : 'الإيداعات', path: '/admin/deposits' });
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth <= 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={window.innerWidth > 1024}
        animate={{ 
          width: window.innerWidth > 1024 ? (isSidebarOpen ? 280 : 0) : '80%',
          x: isSidebarOpen ? 0 : (isRtl ? '100%' : '-100%'),
          opacity: isSidebarOpen ? 1 : (window.innerWidth > 1024 ? 0 : 1)
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
        className={cn(
          "bg-gray-950 border-r border-white/10 flex flex-col h-screen shrink-0 overflow-y-auto scrollbar-thin",
          "fixed lg:relative z-50",
          isRtl ? "right-0" : "left-0",
          !isSidebarOpen && window.innerWidth > 1024 && "lg:border-none"
        )}
      >
        <Link to="/" className="p-6 block shrink-0">
          <Logo />
        </Link>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group font-medium text-sm",
                location.pathname === item.path 
                  ? "bg-blue-600/10 text-blue-500 shadow-sm" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                location.pathname === item.path ? "text-blue-500" : "text-white/20 group-hover:text-white/40"
              )}>
                {item.icon}
              </span>
              <span className="whitespace-nowrap">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto shrink-0">
           <button
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500/70 hover:text-white hover:bg-red-500 transition-all group font-bold text-sm bg-red-500/5 border border-red-500/10 shadow-lg shadow-red-500/5 hover:shadow-red-500/20"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            <span className="whitespace-nowrap">{t('logout')}</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-[#0F0F12]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8 relative z-30 shrink-0">
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all active:scale-90 relative z-10"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-white/50 pointer-events-none" /> : <Menu className="w-5 h-5 text-white/50 pointer-events-none" />}
            </button>

            <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl w-80">
              <Search className="w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder={lang === 'en' ? 'Search services...' : 'بحث عن الخدمات...'}
                className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Balance Badge */}
            <div className="hidden sm:flex flex-col items-end mr-4">
               <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('balance')}</span>
               <span className="text-lg font-black text-blue-400">{formatCurrency(profile?.balance || 0)}</span>
            </div>

            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-white/50 border border-transparent hover:border-white/10"
            >
              <Globe className="w-5 h-5" />
            </button>

            <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-white/50 relative border border-transparent hover:border-white/10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0F0F12]" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-black shadow-lg shadow-amber-500/10">
              {profile?.displayName?.[0] || profile?.email?.[0]}
            </div>
          </div>
        </header>

        {/* Viewport for Pages */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0A0A0B]">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
