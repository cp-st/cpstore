import React, { useState, useEffect } from 'react';
import { 
  Settings, RefreshCcw, Search, Edit2, Trash2, 
  Eye, EyeOff, Plus, CheckCircle2, AlertCircle, Loader2, Save
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const AdminServices = () => {
  const { lang } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState({ profit_margin: 0.15, provider_url: '', vodafone_cash_number: '', etisalat_cash_number: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/admin/settings');
      setSettings(res.data);
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await api.post('/api/admin/settings', settings);
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    const q = query(collection(db, 'services'));
    const snapshot = await getDocs(q);
    setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleToggleStatus = async (service: any) => {
    try {
      await updateDoc(doc(db, 'services', service.id), {
        enabled: !service.enabled
      });
      toast.success("Status updated");
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const syncFromProvider = async () => {
    const key = prompt("Enter Provider API Key (Required for security verification)");
    if (!key) return;

    setSyncing(true);
    try {
      const response = await api.post('/api/admin/sync-services', { 
        providerUrl: settings.provider_url, 
        providerKey: key 
      });
      
      toast.success(response.data.message);
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const filtered = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Global Settings Section */}
      <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
           <Settings className="w-5 h-5 text-blue-500" />
           <h2 className="text-xl font-bold">{lang === 'en' ? 'Global Platform Settings' : 'إعدادات المنصة العامة'}</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Profit Margin (Multiplier, e.g. 0.15 = 15%)</label>
              <input 
                type="number" 
                step="0.01"
                value={settings.profit_margin}
                onChange={(e) => setSettings({ ...settings, profit_margin: parseFloat(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="0.15"
              />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Provider API URL</label>
              <input 
                type="text" 
                value={settings.provider_url}
                onChange={(e) => setSettings({ ...settings, provider_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="https://smmprovider.com/api/v2"
              />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Vodafone Cash Number</label>
              <input 
                type="text" 
                value={settings.vodafone_cash_number}
                onChange={(e) => setSettings({ ...settings, vodafone_cash_number: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="010XXXXXXXX"
              />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Etisalat Cash Number</label>
              <input 
                type="text" 
                value={settings.etisalat_cash_number}
                onChange={(e) => setSettings({ ...settings, etisalat_cash_number: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="011XXXXXXXX"
              />
           </div>
        </div>

        <div className="flex justify-end">
           <button
             onClick={handleSaveSettings}
             disabled={savingSettings}
             className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
           >
             {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {lang === 'en' ? 'Save Settings' : 'حفظ الإعدادات'}
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Settings className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-black">{lang === 'en' ? 'Manage Services' : 'إدارة الخدمات'}</h1>
                <p className="text-white/40 text-sm">{lang === 'en' ? 'Sync, edit, and toggle platform services.' : 'مزامنة وتعديل وتبديل خدمات المنصة.'}</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
           <button
            onClick={syncFromProvider}
            disabled={syncing}
            className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            {lang === 'en' ? 'Sync Services' : 'مزامنة الخدمات'}
          </button>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-[#0F0F12] border border-white/5 rounded-2xl px-6 py-4">
        <Search className="w-5 h-5 text-white/20" />
        <input 
          type="text" 
          placeholder="Search by name or category..."
          className="bg-transparent border-none focus:outline-none w-full text-sm text-white/80 placeholder:text-white/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[#0F0F12] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/30 font-black">
                <tr>
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Name & Category</th>
                  <th className="px-8 py-5">Provider Rate</th>
                  <th className="px-8 py-5">Final Rate</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                    <tr><td colSpan={6} className="px-8 py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500" /></td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6 font-mono text-white/20">#{s.id}</td>
                    <td className="px-8 py-6">
                       <div className="font-bold text-white/90">{s.name}</div>
                       <div className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest mt-0.5">{s.category}</div>
                    </td>
                    <td className="px-8 py-6 text-white/40">{formatCurrency(s.rate)}</td>
                    <td className="px-8 py-6 font-bold text-green-400">{formatCurrency(s.finalRate)}</td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleStatus(s)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                          s.enabled ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        )}
                      >
                        {s.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {s.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all">
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400 transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
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

export default AdminServices;
