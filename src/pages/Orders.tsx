import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  List, Search, Clock, CheckCircle2, XCircle, 
  RotateCcw, ExternalLink, Filter, Loader2, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatCurrency } from '../lib/utils';

const Orders = () => {
  const { profile } = useAuth();
  const { t, lang } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (profile) {
      fetchOrders();
    }
  }, [profile]);

  const fetchOrders = async () => {
    setLoading(true);
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', profile!.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const statuses = [
    { id: 'all', label: 'All', icon: <List className="w-3 h-3" /> },
    { id: 'pending', label: 'Pending', icon: <Clock className="w-3 h-3" /> },
    { id: 'processing', label: 'Processing', icon: <RotateCcw className="w-3 h-3" /> },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" /> },
    { id: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-3 h-3" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <List className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black">{t('orders')}</h1>
                <p className="text-white/40 text-sm">{lang === 'en' ? 'Track all your service orders here.' : 'تتبع جميع طلبات الخدمة الخاصة بك هنا.'}</p>
            </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
         {statuses.map((s) => (
           <button
             key={s.id}
             onClick={() => setFilter(s.id)}
             className={cn(
               "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all border",
               filter === s.id 
                 ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                 : "bg-[#0F0F12] border-white/5 text-white/40 hover:text-white hover:border-white/10"
             )}
           >
             {s.icon}
             {s.label}
           </button>
         ))}
      </div>

      <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/30 font-black">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Charge</th>
                <th className="px-8 py-5">Quantity</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></td></tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6 font-mono text-white/20">#{order.id.slice(0, 8)}</td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-white max-w-xs truncate">{order.serviceName || 'Unknown Service'}</div>
                      <div className="text-[10px] text-white/30 truncate">ID: {order.serviceId}</div>
                    </td>
                    <td className="px-8 py-6 font-black text-white/90">{formatCurrency(order.charge)}</td>
                    <td className="px-8 py-6 font-bold text-white/60">{order.quantity.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        order.status === 'completed' ? "bg-green-500/10 text-green-400" :
                        order.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                        order.status === 'cancelled' ? "bg-red-500/10 text-red-400" :
                        "bg-blue-500/10 text-blue-400"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-white/30">{order.createdAt?.toDate().toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                       <a 
                        href={order.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 p-2.5 bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-white/40"
                       >
                         <ExternalLink className="w-4 h-4" />
                       </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest text-xs">No orders found for this filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-2xl flex items-start gap-4">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-white/60 leading-relaxed">
            {lang === 'en' 
              ? "If you have any issues with your orders, please take note of the Order ID and open a support ticket. Our team is available 24/7." 
              : "إذا كان لديك أي مشاكل في طلباتك، يرجى تدوين رقم الطلب وفتح تذكرة دعم. فريقنا متاح على مدار الساعة طوال أيام الأسبوع."}
          </div>
      </div>
    </div>
  );
};

export default Orders;
