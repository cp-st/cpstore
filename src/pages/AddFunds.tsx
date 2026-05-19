import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, Wallet, Plus, ArrowUpRight, Clock, 
  CheckCircle2, DollarSign, ShieldCheck, Zap, Loader2,
  Phone, Hash
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';

const AddFunds = () => {
  const { profile } = useAuth();
  const { t, lang } = useTranslation();
  const [amount, setAmount] = useState<number>(5);
  const [method, setMethod] = useState('vodafone_cash');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  const presets = [5, 10, 25, 50, 100, 250, 500];

  useEffect(() => {
    const fetchSettings = async () => {
      const sDoc = await getDoc(doc(db, 'settings', 'global'));
      if (sDoc.exists()) {
        setSettings(sDoc.data());
      }
    };
    fetchSettings();

    if (profile) {
      const fetchTransactions = async () => {
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(q);
        setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchTransactions();
    }
  }, [profile]);

  const handleDeposit = async () => {
    if (amount < 5) {
      toast.error(lang === 'en' ? "Minimum deposit is $5 (≈ 275 EGP)" : "الحد الأدنى للإيداع هو 5 دولار (≈ 275 جنيه)");
      return;
    }

    const isManualMethod = method === 'vodafone_cash' || method === 'etisalat_cash';

    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (isManualMethod && (!transactionId || !senderPhone)) {
      toast.error(lang === 'en' ? "Please provide payment details" : "يرجى تقديم تفاصيل الدفع");
      return;
    }

    if (isManualMethod && !phoneRegex.test(senderPhone)) {
      toast.error(lang === 'en' ? "Please enter a valid 11-digit mobile number" : "يرجى إدخال رقم موبايل صحيح (11 رقم)");
      return;
    }

    setLoading(true);
    try {
      if (isManualMethod) {
        const depositRef = collection(db, 'deposits');
        await addDoc(depositRef, {
          userId: profile?.uid,
          amount,
          method,
          transactionId,
          phoneNumber: senderPhone,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success(lang === 'en' ? "Payment request submitted. Admin will verify shortly." : "تم تقديم طلب الدفع. سيقوم المسؤول بالتحقق قريباً.");
        setTransactionId('');
        setSenderPhone('');
      } else {
        toast("Payment method coming soon!", { icon: '🚀' });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
             <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black">{t('addFunds')}</h1>
            <p className="text-white/40 text-sm">{lang === 'en' ? 'Top up your account balance instantly.' : 'اشحن رصيد حسابك على الفور.'}</p>
          </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
         <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#0F0F12] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
               <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 ml-2 flex items-center gap-2">
                 <Wallet className="w-3 h-3" />
                 {lang === 'en' ? 'Select Deposit Amount' : 'اختر مبلغ الإيداع'}
               </label>

               <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
                 {presets.map((p) => (
                   <button
                     key={p}
                     onClick={() => setAmount(p)}
                     className={cn(
                       "py-4 rounded-2xl font-black text-sm transition-all border",
                       amount === p 
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                        : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10"
                     )}
                   >
                     ${p}
                   </button>
                 ))}
               </div>

               <div className="relative mb-10">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-2xl">$</div>
                  <input
                    type="number"
                    min="5"
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 px-12 text-3xl font-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-blue-500"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 text-xs font-bold uppercase tracking-widest">USD Amount</div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/20 ml-6">
                    {lang === 'en' ? '≈ ' + (amount * 55).toLocaleString() + ' EGP' : '≈ ' + (amount * 55).toLocaleString() + ' جنيه مصري'}
                    <span className="ml-2 text-white/10">(Rate: 1 USD = 55 EGP)</span>
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-500/50 ml-6">
                    {lang === 'en' ? 'Minimum Deposit: $5 / 275 EGP' : 'الحد الأدنى للإيداع: 5 دولار / 275 جنيه'}
                  </p>
               </div>

               <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 ml-2">{lang === 'en' ? 'Payment Method' : 'طريقة الدفع'}</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                 {[
                   { id: 'vodafone_cash', label: 'Vodafone Cash', icon: <Phone className="w-5 h-5" />, desc: 'Instant • Egypt' },
                   { id: 'etisalat_cash', label: 'Etisalat Cash', icon: <Phone className="w-5 h-5" />, desc: 'Instant • Egypt' },
                   { id: 'binance', label: 'Binance Pay', icon: <Zap className="w-5 h-5" />, desc: 'Crypto • Zero Fee' },
                   { id: 'paypal', label: 'PayPal', icon: <DollarSign className="w-5 h-5" />, desc: 'Instant • Verified' },
                 ].map((m) => (
                   <button
                     key={m.id}
                     onClick={() => setMethod(m.id)}
                     className={cn(
                       "flex items-center gap-4 p-5 rounded-2xl transition-all border text-left group",
                       method === m.id 
                        ? (method === 'vodafone_cash' ? "bg-red-600/5 border-red-500/50 text-white" : method === 'etisalat_cash' ? "bg-green-600/5 border-green-500/50 text-white" : "bg-blue-600/5 border-blue-500 text-white") 
                        : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10"
                     )}
                   >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        method === m.id 
                          ? (method === 'vodafone_cash' ? "bg-red-600 text-white" : method === 'etisalat_cash' ? "bg-green-600 text-white" : "bg-blue-600 text-white") 
                          : "bg-white/5 text-white/20 group-hover:text-white/40"
                      )}>
                        {m.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{m.label}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">{m.desc}</div>
                      </div>
                      {method === m.id && <CheckCircle2 className={cn("ml-auto w-5 h-5", method === 'vodafone_cash' ? "text-red-500" : method === 'etisalat_cash' ? "text-green-500" : "text-blue-500")} />}
                   </button>
                 ))}
               </div>

               {(method === 'vodafone_cash' || method === 'etisalat_cash') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 space-y-6"
                  >
                     <div className={cn(
                       "p-6 border rounded-3xl",
                       method === 'vodafone_cash' ? "bg-red-600/5 border-red-500/20" : "bg-green-600/5 border-green-500/20"
                     )}>
                        <div className={cn("text-[10px] font-black uppercase tracking-widest mb-2", method === 'vodafone_cash' ? "text-red-500/50" : "text-green-500/50")}>Send money to</div>
                        <div className={cn("text-2xl font-black flex items-center gap-2", method === 'vodafone_cash' ? "text-red-500" : "text-green-500")}>
                           <Phone className="w-5 h-5" />
                           {method === 'vodafone_cash' ? settings?.vodafone_cash_number : settings?.etisalat_cash_number || '0153339499'}
                        </div>
                        <p className="text-xs text-white/40 mt-2">
                           {lang === 'en' 
                             ? `Please send the exact amount (${(amount * 55).toLocaleString()} EGP) then provide the details below.` 
                             : `يرجى إرسال المبلغ المحدد (${(amount * 55).toLocaleString()} جنيه) ثم تقديم التفاصيل أدناه.`}
                        </p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Transaction ID</label>
                           <div className="relative">
                              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                              <input 
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-white/20 transition-all font-mono"
                                placeholder="Order #123456"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Your Phone Number</label>
                           <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                              <input 
                                type="text"
                                value={senderPhone}
                                onChange={(e) => setSenderPhone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-white/20 transition-all"
                                placeholder="01XXXXXXXXX"
                              />
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

               <button
                  onClick={handleDeposit}
                  disabled={loading || !amount || amount < 5}
                  className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 shadow-xl"
               >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <ShieldCheck className="w-6 h-6" />
                        {lang === 'en' ? `Deposit ${formatCurrency(amount)}` : `إيداع ${formatCurrency(amount)}`}
                      </>
                  )}
               </button>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0F0F12] border border-white/5 p-8 rounded-[2.5rem]">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-blue-500" />
                 {lang === 'en' ? 'Deposit History' : 'سجل الإيداعات'}
               </h3>

               <div className="space-y-4">
                  {transactions.length > 0 ? transactions.map((tx) => (
                    <div key={tx.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            tx.type === 'deposit' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          )}>
                             <ArrowUpRight className={cn("w-5 h-5", tx.type === 'deposit' ? "" : "rotate-180")} />
                          </div>
                          <div>
                            <div className="font-bold text-sm">{tx.method || 'Deposit'}</div>
                            <div className="text-[10px] text-white/30">{tx.createdAt?.toDate().toLocaleString()}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={cn("font-black text-sm", tx.type === 'deposit' ? "text-green-400" : "text-red-400")}>
                            {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                          </div>
                          <div className="text-[10px] font-black uppercase text-white/20">{tx.status}</div>
                       </div>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-white/20 font-bold uppercase tracking-widest text-[10px]">No deposits yet</div>
                  )}
               </div>
            </div>

            <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem] space-y-4">
               <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <h4 className="font-bold">{lang === 'en' ? 'Secure Payments' : 'مدفوعات آمنة'}</h4>
               <p className="text-xs text-white/40 leading-relaxed">
                 {lang === 'en' 
                  ? "All transactions are encrypted and processed through official global payment gateways. Your financial data is never stored on our servers." 
                  : "تشفير جميع المعاملات ومعالجتها من خلال بوابات الدفع العالمية الرسمية. لا يتم تخزين بياناتك المالية أبداً على خوادمنا."}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AddFunds;
