import React, { useState, useEffect } from 'react';
import { 
  Check, X, Clock, User, Phone, Hash, DollarSign, Loader2
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { collection, query, getDocs, doc, updateDoc, orderBy, where, increment, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';

const AdminDeposits = () => {
  const { lang } = useTranslation();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'deposits'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setDeposits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Failed to fetch deposits", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (deposit: any, action: 'approve' | 'reject') => {
    setProcessingId(deposit.id);
    try {
      const batch = writeBatch(db);
      
      // 1. Update Deposit Status
      const depositRef = doc(db, 'deposits', deposit.id);
      batch.update(depositRef, { 
        status: action === 'approve' ? 'approved' : 'rejected',
        updatedAt: new Date().toISOString()
      });

      if (action === 'approve') {
        // 2. Add to User Balance
        const userRef = doc(db, 'users', deposit.userId);
        batch.update(userRef, {
          balance: increment(deposit.amount)
        });

        // 3. Log Transaction
        const transRef = doc(collection(db, 'transactions'));
        batch.set(transRef, {
          userId: deposit.userId,
          amount: deposit.amount,
          type: 'deposit',
          method: deposit.method,
          status: 'success',
          createdAt: new Date()
        });
      }

      await batch.commit();
      toast.success(`Deposit ${action === 'approve' ? 'approved' : 'rejected'}`);
      fetchDeposits();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
              <DollarSign className="w-8 h-8" />
          </div>
          <div>
              <h1 className="text-3xl font-black">{lang === 'en' ? 'Deposit Requests' : 'طلبات الإيداع'}</h1>
              <p className="text-white/40 text-sm">{lang === 'en' ? 'Verify and approve manual payments.' : 'التحقق من المدفوعات اليدوية والموافقة عليها.'}</p>
          </div>
      </div>

      <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left font-sans">
              <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/30 font-black">
                <tr>
                  <th className="px-8 py-5">User ID</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Details</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                    <tr><td colSpan={6} className="px-8 py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500" /></td></tr>
                ) : deposits.length === 0 ? (
                    <tr><td colSpan={6} className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest text-[10px]">No deposit requests found</td></tr>
                ) : deposits.map(d => (
                  <tr key={d.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-white/20" />
                          <span className="font-mono text-white/40">#{d.userId.slice(0, 8)}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="font-black text-green-400">{formatCurrency(d.amount)}</div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40">
                             <Phone className="w-3 h-3" /> {d.phoneNumber}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400">
                             <Hash className="w-3 h-3" /> {d.transactionId}
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-white/30 text-[10px]">
                       {d.createdAt?.toDate?.() ? d.createdAt.toDate().toLocaleString() : new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                       <div className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit",
                         d.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                         d.status === 'approved' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                       )}>
                         {d.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       {d.status === 'pending' && (
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleAction(d, 'approve')}
                              disabled={!!processingId}
                              className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                               {processingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleAction(d, 'reject')}
                              disabled={!!processingId}
                              className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                               <X className="w-4 h-4" />
                            </button>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDeposits;
