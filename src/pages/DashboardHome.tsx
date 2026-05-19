import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, TrendingUp, ShoppingBag, Clock, ArrowUpRight, 
  CheckCircle, PlusCircle, CreditCard, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { formatCurrency, cn } from '../lib/utils';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { profile } = useAuth();
  const { t, lang, isRtl } = useTranslation();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    spent: 0
  });

  useEffect(() => {
    if (profile) {
      const fetchStats = async () => {
        const q = query(
          collection(db, 'orders'), 
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentOrders(orders);
        
        // Sum total spent and count
        const allQ = query(collection(db, 'orders'), where('userId', '==', profile.uid));
        const allSnap = await getDocs(allQ);
        let spent = 0;
        let active = 0;
        allSnap.forEach(d => {
            const data = d.data();
            spent += data.charge || 0;
            if (['pending', 'processing'].includes(data.status)) active++;
        });
        setStats({ totalOrders: allSnap.size, activeOrders: active, spent });
      };
      
      fetchStats();
    }
  }, [profile]);

  const cards = [
    { 
      label: lang === 'en' ? 'Total Orders' : 'إجمالي الطلبات', 
      value: stats.totalOrders, 
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'blue'
    },
    { 
      label: lang === 'en' ? 'Total Spent' : 'إجمالي الإنفاق', 
      value: formatCurrency(stats.spent), 
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'green'
    },
    { 
      label: lang === 'en' ? 'Active Orders' : 'الطلبات النشطة', 
      value: stats.activeOrders, 
      icon: <Clock className="w-6 h-6" />,
      color: 'purple'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 p-8 rounded-[2rem] text-black shadow-2xl shadow-amber-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2">
              {lang === 'en' ? `Welcome back, ${profile?.displayName}` : `مرحباً بك مجدداً، ${profile?.displayName}`}
            </h1>
            <p className="text-white/70 text-sm max-w-lg mb-6">
              {lang === 'en' ? "Get the best engagement for your social media accounts today. High quality, best prices." : "احصل على أفضل تفاعل لحسابات التواصل الاجتماعي الخاصة بك اليوم. جودة عالية وأفضل الأسعار."}
            </p>
            <div className="flex gap-3">
               <Link to="/dashboard/new-order" className="px-5 py-2.5 bg-white text-blue-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/90 transition-all shadow-lg active:scale-95">
                 <PlusCircle className="w-4 h-4" />
                 {t('newOrder')}
               </Link>
               <Link to="/dashboard/add-funds" className="px-5 py-2.5 bg-blue-500/20 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                 <CreditCard className="w-4 h-4" />
                 {t('addFunds')}
               </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <Rocket className="w-40 h-40 text-white/20 rotate-12" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full translate-x-32 -translate-y-32" />
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                  "p-3 rounded-2xl",
                  card.color === 'blue' ? "bg-blue-500/10 text-blue-400" : 
                  card.color === 'green' ? "bg-green-500/10 text-green-400" :
                  "bg-purple-500/10 text-purple-400"
              )}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                12%
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-widest font-black text-white/30 mb-1">{card.label}</div>
            <div className="text-3xl font-black">{card.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders & Quick Order Preview */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                {lang === 'en' ? 'Recent Orders' : 'الطلبات الأخيرة'}
              </h2>
              <Link to="/dashboard/orders" className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:underline">
                 {lang === 'en' ? 'View All' : 'شاهد الكل'}
                 <ChevronRight className="w-4 h-4" />
              </Link>
           </div>

           <div className="bg-[#0F0F12] border border-white/5 rounded-[2rem] overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/30 font-black">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Charge</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                      <tr key={order.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-5 font-mono text-white/40">#{order.id.slice(0, 6)}</td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            order.status === 'completed' ? "bg-green-500/10 text-green-400" :
                            order.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                            order.status === 'cancelled' ? "bg-red-500/10 text-red-400" :
                            "bg-blue-500/10 text-blue-400"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-white/50">{order.createdAt?.toDate().toLocaleDateString()}</td>
                        <td className="px-6 py-5 text-right font-black text-white/90">{formatCurrency(order.charge)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-white/20 font-bold">No orders found yet</td>
                      </tr>
                    )}
                  </tbody>
               </table>
             </div>
           </div>
        </div>

        {/* Quick Tips / Support */}
        <div className="space-y-6">
           <h2 className="text-xl font-black">{lang === 'en' ? 'Quick Support' : 'دعم سريع'}</h2>
           <div className="bg-gradient-to-br from-white/10 to-transparent border border-white/5 p-8 rounded-[2rem] space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-sm mb-1">{lang === 'en' ? 'Quality Guaranteed' : 'جودة مضمونة'}</h3>
                   <p className="text-xs text-white/40 leading-relaxed">
                     {lang === 'en' ? "We only use high-retention services to ensure long-lasting results for your profiles." : "نحن نستخدم فقط خدمات الاحتفاظ العالي لضمان نتائج طويلة الأمد لملفاتك الشخصية."}
                   </p>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                 <p className="text-xs text-white/50 mb-3 italic">
                   {lang === 'en' ? '"Amazing service! My Instagram has never looked better. Highly recommend their high-quality followers."' : '"خدمة مذهلة! لم يبدُ حسابي على إنستغرام أفضل من قبل. أوصي بشدة بمتابعيهم ذوي الجودة العالية."'}
                 </p>
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20" />
                    <span className="text-[10px] font-black uppercase text-white/30">John S. • Entrepreneur</span>
                 </div>
              </div>

              <Link to="/dashboard/tickets" className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm block text-center transition-all border border-white/10">
                {lang === 'en' ? 'Open Support Ticket' : 'افتح تذكرة دعم'}
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
