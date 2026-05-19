import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, Info, AlertCircle, CheckCircle2, 
  Search, Filter, Package, Hash, Link as LinkIcon, 
  Plus, Loader2, Sparkles, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const NewOrder = () => {
  const { profile } = useAuth();
  const { t, lang } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const q = query(collection(db, 'services'), where('enabled', '==', true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      const cats = Array.from(new Set(data.map((s: any) => s.category)));
      setCategories(cats as string[]);
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = services.filter(s => s.category === selectedCategory);
      setFilteredServices(filtered);
      setSelectedService(null);
    }
  }, [selectedCategory, services]);

  const charge = selectedService ? (quantity * selectedService.finalRate) / 1000 : 0;
  const canAfford = (profile?.balance || 0) >= charge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !link || quantity < selectedService.min || quantity > selectedService.max) {
        toast.error("Please fill all fields correctly");
        return;
    }
    if (!canAfford) {
        toast.error("Insufficient balance. Please add funds.");
        return;
    }

    setSubmitting(true);
    try {
      // Call secure server-side API
      const response = await api.post('/api/orders', {
        serviceId: selectedService.id,
        link,
        quantity
      });

      if (response.data.success) {
        toast.success(lang === 'en' ? "Order placed successfully!" : "تم تقديم الطلب بنجاح!");
        setLink('');
        setQuantity(0);
        setSelectedService(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const translateCategory = (cat: string) => {
    if (lang !== 'ar') return cat;
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('social') || lowerCat.includes('design') || lowerCat.includes('manage')) return t('cat_social');
    if (lowerCat.includes('video') || lowerCat.includes('ads')) return t('cat_video');
    if (lowerCat.includes('growth') || lowerCat.includes('scale') || lowerCat.includes('follow')) return t('cat_growth');
    return cat;
  };

  if (loading) {
     return <div className="flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
             <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black">{t('newOrder')}</h1>
            <p className="text-white/40 text-sm">{lang === 'en' ? 'Select a service and boost your growth.' : 'اختر خدمة وعزز نموك.'}</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#0F0F12] border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative">
            <div className="grid gap-6">
              {/* Category Selection */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-2 flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  {lang === 'en' ? 'Select Category' : 'اختر القسم'}
                </label>
                <select
                  required
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>{lang === 'en' ? 'Choose a category...' : 'اختر قسماً...'}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-[#0F0F12]">{translateCategory(cat)}</option>
                  ))}
                </select>
              </div>

              {/* Service Selection */}
              <AnimatePresence mode="wait">
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-2 flex items-center gap-2">
                      <Package className="w-3 h-3" />
                      {lang === 'en' ? 'Select Service' : 'اختر الخدمة'}
                    </label>
                    <select
                        required
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                        value={selectedService?.id || ''}
                        onChange={(e) => {
                           const s = services.find(x => x.id === e.target.value);
                           setSelectedService(s);
                        }}
                    >
                        <option value="" disabled>{lang === 'en' ? 'Choose a service...' : 'اختر خدمة...'}</option>
                        {filteredServices.map(s => (
                            <option key={s.id} value={s.id} className="bg-[#0F0F12]">
                                {s.name} - {formatCurrency(s.finalRate)}
                            </option>
                        ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Link Input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 ml-2 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" />
                  {lang === 'en' ? 'Target Link' : 'رابط الهدف'}
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://instagram.com/account"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* Quantity Input */}
              <div>
                <div className="flex items-center justify-between mb-3 px-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                        <Hash className="w-3 h-3" />
                        {lang === 'en' ? 'Quantity' : 'الكمية'}
                    </label>
                    {selectedService && (
                        <span className="text-[10px] font-bold text-white/20">
                            Min: {selectedService.min} • Max: {selectedService.max}
                        </span>
                    )}
                </div>
                <input
                  type="number"
                  required
                  min={selectedService?.min || 0}
                  max={selectedService?.max || 0}
                  placeholder="1000"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Price Preview & Submit */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="text-center md:text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{lang === 'en' ? 'Total Charge' : 'التكلفة الإجمالية'}</div>
                  <div className="text-4xl font-black text-blue-500">{formatCurrency(charge)}</div>
                  {!canAfford && quantity > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        Insufficient balance
                    </div>
                  )}
               </div>

               <button
                  type="submit"
                  disabled={submitting || !canAfford || !selectedService || quantity <= 0}
                  className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/40 shadow-xl rounded-2.5xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
               >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Send className="w-5 h-5" />
                        {lang === 'en' ? 'Place Order' : 'تنفيذ الطلب'}
                      </>
                  )}
               </button>
            </div>
          </form>
        </div>

        {/* Sidebar info */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Info className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold">{lang === 'en' ? 'Service Info' : 'معلومات عن الخدمة'}</h3>
              </div>
              
              <AnimatePresence mode="wait">
                {selectedService ? (
                  <motion.div
                    key={selectedService.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                       <div className="text-sm text-white/60 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                         {selectedService.description || "No description provided for this service."}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Average Time</div>
                          <div className="font-bold">2.5 hours</div>
                       </div>
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Refill</div>
                          <div className="font-bold text-green-400">Lifetime</div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-400 rounded-xl text-xs font-bold">
                       <CheckCircle2 className="w-4 h-4" />
                       Service currently in high availability
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-20 text-center space-y-4 opacity-30"
                  >
                    <Sparkles className="w-12 h-12 mx-auto" />
                    <p className="text-sm font-bold tracking-widest uppercase">Select a service to see details</p>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <div className="bg-[#0F0F12] border border-white/5 p-6 rounded-[2.5rem]">
              <h3 className="font-bold mb-4 ml-2">{lang === 'en' ? 'Your Balance' : 'رصيدك'}</h3>
              <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/5">
                 <span className="text-3xl font-black">{formatCurrency(profile?.balance || 0)}</span>
                 <a href="/dashboard/add-funds" className="p-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                    <Plus className="w-6 h-6" />
                 </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
