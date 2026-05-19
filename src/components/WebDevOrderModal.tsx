import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// استيراد خدمات Firebase المباشرة
import { db, storage } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const WebDevOrderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'crypto'>('wallet');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    projectName: '',
    businessType: 'متجر إلكتروني',
    description: '',
    senderPhone: ''
  });

  if (!isOpen) return null;

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleNextStep = () => {
    if (!formData.projectName || !formData.description) {
      alert('يرجى إدخال اسم المشروع ووصف المتطلبات أولاً.');
      return;
    }
    setStep(2);
  };

  // دالة حفظ البيانات ورفع الملفات مباشرة إلى Firebase
  const handleSubmitFinalOrder = async () => {
    if (!formData.senderPhone) {
      alert('يرجى إدخال رقم الهاتف الذي قمت بالتحويل منه.');
      return;
    }

    setIsUploading(true);

    try {
      let fileUrl = 'لا يوجد مرفقات';

      // 1. رفع الملف إلى Firebase Storage أولاً إذا كان موجوداً
      if (selectedFile) {
        const fileRef = ref(storage, `web_orders/${Date.now()}_${selectedFile.name}`);
        const uploadResult = await uploadBytes(fileRef, selectedFile);
        fileUrl = await getDownloadURL(uploadResult.ref); // الحصول على رابط الملف المباشر
      }

      // 2. حفظ البيانات بالكامل في Firebase Firestore
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      await addDoc(collection(db, 'web_orders'), {
        orderId: orderId,
        projectName: formData.projectName,
        businessType: formData.businessType,
        description: formData.description,
        senderPhone: formData.senderPhone,
        paymentMethod: paymentMethod,
        amount: '7000 EGP',
        fileUrl: fileUrl, // رابط الصورة المرفوعة على الدرايف الخاص بـ Firebase
        status: 'قيد المراجعة',
        createdAt: new Date().toISOString()
      });

      alert(`تم تأكيد الدفع وإرسال طلبك بنجاح! رقم الطلب: ${orderId}. سيتم التواصل معك قريباً.`);
      
      // إعادة تعيين النموذج وإغلاقه
      setFormData({ projectName: '', businessType: 'متجر إلكتروني', description: '', senderPhone: '' });
      setSelectedFile(null);
      setStep(1);
      onClose();

    } catch (error) {
      console.error("Firebase Error:", error);
      alert('حدث خطأ أثناء الاتصال بـ Firebase، تم حفظ نسخة احتياطية من البيانات محلياً.');
      
      // حل احتياطي في حال وجود مشكلة في الاتصال
      const localBackup = { 
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData, 
        paymentMethod, 
        amount: '7000', 
        fileName: selectedFile?.name 
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Backup_Order_${localBackup.orderId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" dir="rtl">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#0a0a0c] border border-[#BF953F]/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(191,149,63,0.15)] flex flex-col max-h-[90vh] mx-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-white z-50 bg-white/5 hover:bg-white/10 p-2 sm:p-2.5 rounded-full transition-all">
          <svg className="w-5 h-5 sm:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="w-full h-1 bg-gray-800"><div className={`h-full bg-[#BF953F] transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div></div>

        <div className="p-6 sm:p-8 md:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-2xl font-black text-white mb-6">تفاصيل الموقع المطلوب</h2>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">اسم المشروع / الشركة</label>
                      <input type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} placeholder="مثال: مطعم الأكابر" className="w-full bg-[#111] border border-gray-800 focus:border-[#BF953F] text-white rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">مجال العمل</label>
                      <select value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} className="w-full bg-[#111] border border-gray-800 focus:border-[#BF953F] text-white rounded-xl px-4 py-3 outline-none cursor-pointer">
                        <option>متجر إلكتروني</option><option>عيادة / طبيب</option><option>مطعم / كافيه</option><option>شركة عقارية</option><option>أخرى</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">وصف الفكرة والصفحات المطلوبة</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} placeholder="اكتب نبذة عن الموقع..." className="w-full bg-[#111] border border-gray-800 focus:border-[#BF953F] text-white rounded-xl px-4 py-3 outline-none resize-none"></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">إرفاق اللوجو أو الملفات</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.zip" />
                    <div onClick={handleUploadClick} className={`w-full border-2 border-dashed ${selectedFile ? 'border-[#BF953F] bg-[#BF953F]/10' : 'border-gray-700 hover:border-[#BF953F]/50 bg-[#111]'} rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all`}>
                      <svg className={`w-8 h-8 ${selectedFile ? 'text-[#BF953F]' : 'text-gray-500'} mb-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <span className="text-sm font-bold text-gray-300">{selectedFile ? selectedFile.name : 'اضغط هنا لاختيار الملفات'}</span>
                    </div>
                  </div>

                  <button onClick={handleNextStep} className="w-full mt-4 bg-[#BF953F] hover:bg-[#FCF6BA] text-black font-black py-4 rounded-xl transition-colors">
                    متابعة للدفع (7,000 ج.م)
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white"><svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                  <h2 className="text-2xl font-black text-white">إتمام الدفع</h2>
                </div>

                <div className="bg-[#111] border border-[#BF953F]/30 rounded-2xl p-6 text-center mb-6">
                  <p className="text-xs text-[#BF953F] font-bold mb-1">إجمالي المطلوب</p>
                  <div className="flex items-center justify-center gap-2"><span className="text-5xl font-black text-white">7,000</span><span className="text-gray-400 font-bold">EGP</span></div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button onClick={() => setPaymentMethod('wallet')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${paymentMethod === 'wallet' ? 'bg-[#BF953F]/10 border-[#BF953F] text-white' : 'bg-[#111] border-gray-800 text-gray-500'}`}>محافظ إلكترونية</button>
                  <button onClick={() => setPaymentMethod('crypto')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${paymentMethod === 'crypto' ? 'bg-[#BF953F]/10 border-[#BF953F] text-white' : 'bg-[#111] border-gray-800 text-gray-500'}`}>Binance Pay</button>
                </div>

                <div className="space-y-5">
                  <div className="bg-[#0a0a0c] border border-gray-800 rounded-xl p-3 sm:p-5 text-center overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-2">يرجى تحويل المبلغ إلى الحساب التالي:</p>
                    <p className="text-sm xs:text-lg sm:text-2xl font-mono text-white tracking-widest whitespace-nowrap overflow-x-auto select-all">{paymentMethod === 'wallet' ? '01153339499' : 'BINANCE_ID'}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">رقم الهاتف المحول منه</label>
                    <input type="tel" value={formData.senderPhone} onChange={(e) => setFormData({...formData, senderPhone: e.target.value})} placeholder="01XXXXXXXXX" className="w-full bg-[#111] border border-gray-800 focus:border-[#BF953F] text-white rounded-xl px-4 py-3 outline-none" dir="ltr" />
                  </div>

                  <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-xl border border-red-500/10 transition-all">إلغاء</button>
                    <button onClick={handleSubmitFinalOrder} disabled={isUploading} className="flex-[2] bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-black font-black py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isUploading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WebDevOrderModal;
