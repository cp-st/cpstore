import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Check, X, MessageCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

interface Package {
  id: string;
  nameKey: string;
  typeKey: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  color: string;
  neonClass: string;
}

const CampaignManagement = () => {
  const { t, isRtl, lang } = useTranslation();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [senderDetails, setSenderDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const packages: Package[] = [
    {
      id: 'standard',
      nameKey: 'pageManagementPackage',
      typeKey: 'packageStandard',
      price: 4500,
      features: [
        'followersCount1',
        'designsCount1',
        'fundedAd4Days'
      ],
      color: 'text-blue-400',
      neonClass: 'shadow-[0_0_15px_rgba(14,165,233,0.25)] border-blue-500/50'
    },
    {
      id: 'advanced',
      nameKey: 'pageManagementPackage',
      typeKey: 'packageAdvanced',
      price: 6000,
      isPopular: true,
      features: [
        'followersCount1',
        'designsCount2',
        'fundedAd4Days'
      ],
      color: 'text-[#BF953F]',
      neonClass: 'shadow-[0_0_20px_rgba(245,158,11,0.4)] border-[#BF953F]/80'
    },
    {
      id: 'pro',
      nameKey: 'pageManagementPackage',
      typeKey: 'packagePro',
      price: 15000,
      features: [
        'followersCount2',
        'designsCount3',
        'videoAds7',
        'fundedAd7Days'
      ],
      color: 'text-purple-400',
      neonClass: 'shadow-[0_0_20px_rgba(168,85,247,0.4)] border-purple-500/80'
    }
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    if (!user) {
      toast.error(isRtl ? 'يرجى تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Firestore
      const campaignData = {
        userId: user.uid,
        userEmail: user.email,
        packageId: selectedPackage.id,
        packageName: t(selectedPackage.nameKey),
        packageType: t(selectedPackage.typeKey),
        price: selectedPackage.price,
        customerName,
        targetUrl: pageUrl,
        paymentMethod,
        senderDetails,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'campaigns'), campaignData);
      console.log("Campaign booking saved to Firestore");

      // 2. Open WhatsApp
      const whatsappNumber = "201032314117";
      const paymentMethodText = paymentMethod === 'Etisalat Cash' ? (isRtl ? 'اتصالات كاش 📱' : 'Etisalat Cash 📱') : (isRtl ? 'منصة بيهانس 🎨' : 'Behance Platform 🎨');
      
      const message = isRtl ? `مرحباً فريق Control P، لقد قمت بحجز الخدمة وتأكيد تحويل قيمة الباقة كالتالي:
              
  *📋 تفاصيل الحجز المطلوبة:*
  - *الباقة المحجوزة:* ${t(selectedPackage.nameKey)} (${t(selectedPackage.typeKey)})
  - *قيمة الاشتراك:* ${selectedPackage.price} جنيه مصرى
  - *اسم العميل:* ${customerName}
  - *رابط الصفحة المستهدفة للعمل:* ${pageUrl}
  
  *💳 تفاصيل تأكيد الدفع والتحويل مسبقاً:*
  - *وسيلة التحويل المستخدمة:* ${paymentMethodText}
  - *بيانات الحساب / المحفظة المحول منها:* ${senderDetails}
  
  _لقد قمت بالتحويل بنجاح. برجاء مراجعة الإيداع وتفعيل الباقة لبدء العمل في أقرب وقت._` : `Hello Control P Team, I have booked a service and confirmed the package value transfer as follows:
              
  *📋 Booking Details:*
  - *Selected Package:* ${t(selectedPackage.nameKey)} (${t(selectedPackage.typeKey)})
  - *Subscription Value:* ${selectedPackage.price} EGP
  - *Customer Name:* ${customerName}
  - *Target Page Link:* ${pageUrl}
  
  *💳 Payment Confirmation Details:*
  - *Payment Method Used:* ${paymentMethodText}
  - *Transfer Account/Wallet Details:* ${senderDetails}
  
  _I have successfully transferred the amount. Please review the deposit and activate the package to start work as soon as possible._`;
  
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      
      toast.success(isRtl ? 'تم استلام طلبك بنجاح! سيتم تحويلك للواتساب.' : 'Booking received! Redirecting to WhatsApp...');
      
      setSelectedPackage(null);
      setCustomerName('');
      setPageUrl('');
      setPaymentMethod('');
      setSenderDetails('');
    } catch (error: any) {
      console.error("Campaign booking error:", error);
      toast.error(isRtl ? 'حدث خطأ أثناء الإرسال' : 'Error saving booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="campaign-management" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#03060B] scroll-mt-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-blue-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight px-4">
            {t('campaignManagementTitle')}
          </h2>
          <h3 className="text-xl md:text-3xl font-bold text-[#BF953F] drop-shadow-md px-4">
            {t('campaignManagementSub')}
          </h3>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "bg-[#0A0C14] rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between relative",
                pkg.neonClass,
                pkg.isPopular && "bg-[#0F121C] scale-105 z-20"
              )}
            >
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 bg-[#BF953F] text-black font-black px-4 py-1.5 rounded-bl-xl rounded-tr-xl text-[10px] uppercase tracking-widest">
                  {t('mostRequested')}
                </div>
              )}
              
              <div>
                <div className="text-center border-b border-white/5 pb-6 mb-6">
                  <h4 className="text-xl font-bold text-white mb-2">{t(pkg.nameKey)}</h4>
                  <span className={cn(
                    "inline-block font-black px-4 py-1 rounded-full text-[10px] mb-4 uppercase tracking-widest",
                    pkg.id === 'standard' ? "bg-blue-500/10 text-blue-400" : 
                    pkg.id === 'advanced' ? "bg-[#BF953F]/10 text-[#BF953F]" : 
                    "bg-purple-500/10 text-purple-400"
                  )}>
                    {t(pkg.typeKey)}
                  </span>
                  <div className={cn("text-4xl font-black flex items-center justify-center gap-2", pkg.color)}>
                    {pkg.price} <span className="text-sm font-bold text-gray-500">{t('priceSuffix')}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((featureKey, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-medium text-gray-400 text-sm">
                      <div className={cn("shrink-0 p-0.5 rounded-full", pkg.neonClass.split(' ')[1].replace('border-', 'bg-').split('/')[0])}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      {t(featureKey)}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => setSelectedPackage(pkg)}
                className={cn(
                  "w-full font-black text-sm py-4 rounded-xl transition-all uppercase tracking-widest border",
                  pkg.isPopular 
                    ? "bg-[#BF953F] text-black hover:bg-yellow-400 border-transparent shadow-[0_0_15px_rgba(191,149,63,0.3)]" 
                    : "bg-transparent text-white hover:bg-white/5 border-white/10"
                )}
              >
                {pkg.isPopular ? t('bookNowWhatsApp') : t('bookNow')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPackage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0C14] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 sm:p-3 transition-all z-50 shadow-xl"
              >
                <X className="w-5 h-5 sm:w-6 h-6" />
              </button>

              <div className="overflow-y-auto p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 pr-10">{t('confirmationTitle')}</h3>
                <p className="text-gray-500 text-[13px] mb-6 leading-relaxed">
                  {t('confirmationSub')}
                </p>

                <form onSubmit={handleBooking} className="space-y-5">
                <div className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-500">{t('selectedPackageLabel')}</span>
                    <span className="font-bold text-white text-right">{t(selectedPackage.nameKey)} ({t(selectedPackage.typeKey)})</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm border-t border-white/5 pt-3">
                    <span className="text-gray-500">{t('totalAmountLabel')}</span>
                    <span className="font-black text-[#BF953F] text-base sm:text-lg">{selectedPackage.price} {t('priceSuffix')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-1.5 px-1">
                        {t('customerNameLabel')}
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-[13px] font-medium"
                        placeholder={t('customerNamePlaceholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-1.5 px-1">
                        {t('pageUrlLabel')}
                      </label>
                      <input 
                        type="url" 
                        required 
                        value={pageUrl}
                        onChange={(e) => setPageUrl(e.target.value)}
                        className={cn(
                          "w-full bg-white/[0.02] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-[13px] font-medium",
                          isRtl ? "text-right" : "text-left"
                        )} 
                        dir="ltr"
                        placeholder={t('pageUrlPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-4">
                    <div>
                      <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-2 px-1">
                        {t('paymentMethodLabel')}
                      </label>
                      <select 
                        required 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-[#0A0C14] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-[13px] font-bold"
                      >
                        <option value="" disabled>{t('paymentMethodSelect')}</option>
                        <option value="Etisalat Cash">{t('paymentMethodEtisalat')}</option>
                        <option value="Behance">{t('paymentMethodBehance')}</option>
                      </select>
                    </div>

                    {paymentMethod && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white/[0.01] border border-[#BF953F]/20 p-4 rounded-xl text-[10px] text-gray-400 space-y-2 overflow-hidden"
                      >
                        {paymentMethod === 'Etisalat Cash' ? (
                          <div className="flex items-start gap-2">
                            <span className="text-blue-400 text-sm">📱</span>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-[#BF953F] text-xs mb-1">{t('etisalatInstructionsTitle')}</p>
                                <p className="leading-relaxed">{t('etisalatInstructionsText').replace('{price}', selectedPackage.price.toString())}</p>
                                <p className="my-3 bg-black/50 p-3 rounded-xl text-center text-sm xs:text-base sm:text-lg font-black text-white select-all border border-white/10 tracking-widest overflow-x-auto">{t('etisalatWalletNumber')}</p>
                                <p className="text-[9px] text-gray-500 leading-tight">{t('etisalatNote')}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <span className="text-blue-400 text-sm">🎨</span>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-[#BF953F] text-xs mb-1">{t('behanceInstructionsTitle')}</p>
                                <p className="leading-relaxed">{t('behanceInstructionsText').replace('{price}', selectedPackage.price.toString())}</p>
                                <p className="my-3 bg-black/50 p-3 rounded-xl text-center text-sm xs:text-base sm:text-lg font-black text-white select-all border border-white/10 overflow-x-auto">{t('behanceUrl')}</p>
                                <p className="text-[9px] text-gray-500 leading-tight">{t('behanceNote')}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {paymentMethod && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="block text-gray-300 text-[10px] font-black uppercase tracking-widest mb-1.5 px-1">
                          {t('confirmationDetailsLabel')}
                        </label>
                        <input 
                          type="text" 
                          required 
                          value={senderDetails}
                          onChange={(e) => setSenderDetails(e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all text-[13px] font-medium"
                          placeholder={paymentMethod === 'Etisalat Cash' ? t('senderDetailsPlaceholderEtisalat') : t('senderDetailsPlaceholderBehance')}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-sm py-4 sm:py-5 rounded-2xl shadow-[0_0_25px_rgba(37,211,102,0.2)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest mt-4 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <MessageCircle className="w-5 h-5 sm:w-6 h-6" />
                      {t('confirmAndWhatsApp')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CampaignManagement;
