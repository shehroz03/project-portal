'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  ClipboardList, Clock, CheckCircle, MessageSquare, 
  PlusCircle, Loader2, TrendingUp, LayoutDashboard, CreditCard, 
  LogOut, Send, Paperclip, ShieldCheck, X, Copy, Download, 
  History, Globe, GraduationCap, Building2, AlertCircle, Laptop, Calendar, FileText, Bell, Check, Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import FastDigitalBackground from '@/components/FastDigitalBackground';
import NotificationCenter from '@/components/NotificationCenter';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const fetchNotifications = async (uid: string) => {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', uid).order('created_at', { ascending: false });
    if (data) setNotificationsList(data);
  };

  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (error) {
      console.error('Profile fetch error:', error);
    }
    if (data) {
      setProfile(data);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (user) fetchNotifications(user.id);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
    fetchNotifications(user.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      await fetchOrders();
      await fetchProfile(user.id);
      await fetchNotifications(user.id);

      // Auto-sync email if missing in profile
      if (user.email) {
        const { data: currentProfile } = await supabase.from('profiles').select('email').eq('id', user.id).maybeSingle();
        if (!currentProfile?.email) {
          await supabase.from('profiles').update({ email: user.email }).eq('id', user.id);
          console.log('Email synced to profile');
        }
      }

      // Proper Realtime Subscription logic
      const channelId = `notifications-${user.id}-${Math.random().toString(36).substr(2, 9)}`;
      const channel = supabase.channel(channelId)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
           console.log('New notification received:', payload);
           setNotification(payload.new.message);
           setNotificationsList(prev => [payload.new, ...prev]);
           fetchOrders(); 
           setTimeout(() => setNotification(null), 8000);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to notifications');
          }
        });

      return () => { 
        console.log('Cleaning up notification channel');
        supabase.removeChannel(channel); 
      };
    };
    fetchData();
  }, [supabase, router]);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;

  return (
    <div className="flex h-screen bg-[#000510] text-white font-sans selection:bg-purple-500 overflow-hidden">
      <FastDigitalBackground />
      <div className="fixed inset-0 bg-black/80 -z-40 pointer-events-none"></div>
      
      <AnimatePresence>
         {notification && (
           <motion.div 
             initial={{ y: -100, opacity: 0 }}
             animate={{ y: 20, opacity: 1 }}
             exit={{ y: -100, opacity: 0 }}
             className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
           >
              <div className="mx-4 bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-[2rem] shadow-2xl border border-white/20 flex items-start gap-4">
                 <div className="p-3 bg-white/20 rounded-xl">
                    <Bell className="text-white animate-bounce" size={20} />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-white/80 mb-1">New Notification</h4>
                    <p className="text-xs font-bold leading-relaxed">{notification}</p>
                 </div>
                 <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg transition-all">
                    <X size={18} />
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 md:w-72 bg-black/90 backdrop-blur-3xl border-r border-white/5 flex flex-col p-4 md:p-6 h-screen z-50 shrink-0"
      >
        <div className="mb-12 flex items-center gap-3 px-2">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-purple-500/40">B</div>
           <span className="hidden md:block font-black text-xl tracking-tighter text-white">BSt <span className="text-purple-500">STUDIO</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: t.nav.dashboard, icon: LayoutDashboard },
            { id: 'submit_link', label: t.nav.submit, icon: PlusCircle, isLink: true, href: '/submit' },
            { id: 'global_ideas', label: t.nav.ideas, icon: Lightbulb, isLink: true, href: '/submit?type=idea' },
          ].map(item => (
            item.isLink ? (
              <Link
                key={item.id}
                href={item.href!}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-purple-400 hover:bg-purple-600/10 border border-purple-500/10 ${item.id === 'global_ideas' ? 'text-yellow-400 border-yellow-500/10 hover:bg-yellow-600/5' : 'bg-purple-600/5'}`}
              >
                <item.icon size={20} />
                <span className="hidden md:block font-black text-[9px] uppercase tracking-[0.2em]">{item.label}</span>
              </Link>
            ) : (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); setShowNotifPanel(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id && !showNotifPanel ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon size={20} />
                <span className="hidden md:block font-black text-[9px] uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            )
          ))}

          <button 
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative ${showNotifPanel ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-blue-500/10'}`}
          >
             <Bell size={20} className={unreadCount > 0 ? 'animate-pulse text-blue-400' : ''} />
             <span className="hidden md:block font-black text-[9px] uppercase tracking-[0.2em]">{t.dashboard.notifications}</span>
             {unreadCount > 0 && (
               <span className="absolute top-3 right-3 md:right-6 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black">
                 {unreadCount}
               </span>
             )}
          </button>

          {[
            { id: 'history', label: 'Order History', icon: History },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'chat', label: 'Support', icon: MessageSquare },
          ].map(item => (
              <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setShowNotifPanel(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id && !showNotifPanel ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="hidden md:block font-black text-[9px] uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl font-black transition-all mt-auto border border-red-500/20 uppercase text-[9px] tracking-widest">
          <LogOut size={18} />
          <span className="hidden md:block">{t.nav.logout}</span>
        </button>
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar flex flex-col">
        <div className="max-w-7xl mx-auto w-full p-6 md:p-10 flex-1">
          <AnimatePresence mode="wait">
            {showNotifPanel ? (
               <NotificationCenter 
                  key="notifs" 
                  list={notificationsList} 
                  onClose={() => setShowNotifPanel(false)} 
                  onRead={markAsRead} 
                  onReadAll={markAllAsRead}
               />
            ) : (
               <>
                {activeTab === 'overview' && <OverviewTab key="overview" orders={orders} user={user} profile={profile} fetchProfile={() => fetchProfile(user.id)} />}
                {activeTab === 'history' && <HistoryTab key="history" orders={orders} />}
                {activeTab === 'payments' && <PaymentsTab key="payments" orders={orders} refresh={fetchOrders} />}
                {activeTab === 'chat' && <ChatTab key="chat" user={user} />}
               </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


function OverviewTab({ orders, user, profile, fetchProfile }: { orders: any[], user: any, profile: any, fetchProfile: () => void }) {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const activeOrders = orders.filter(o => o.status !== 'completed');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (profile && !profile.university) {
      setShowProfileModal(true);
    }
  }, [profile]);
  const [saving, setSaving] = useState(false);
  
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const formattedName = displayName.split(' ')[0];

  const handleProfileSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      id: user.id,
      email: user.email,
      full_name: formData.get('full_name') as string,
      university: formData.get('university') as string,
      country: formData.get('country') as string,
      degree_level: formData.get('degree_level') as string,
    };
    const { error } = await supabase.from('profiles').upsert(data);
    if (!error) {
      fetchProfile();
      setShowProfileModal(false);
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Status: Online</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{t.dashboard.welcome}, <span className="text-purple-500">{formattedName}</span></h1>
          <p className="text-gray-200 font-bold max-w-xl drop-shadow-sm">{t.hero.subtitle}</p>
        </div>
        <Link href="/submit" className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black shadow-lg shadow-purple-500/20 hover:scale-105 transition-all uppercase text-[10px] tracking-[0.2em] border border-white/10 group h-fit">
          <PlusCircle size={18} /> {t.dashboard.submitButton}
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-3 bg-gradient-to-r from-purple-600/25 to-blue-600/15 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-black/40 -z-10"></div>
         <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
            <Building2 size={32} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black mb-1 text-white drop-shadow-md">{profile?.university || 'University Not Linked'}</h3>
            <p className="text-sm text-gray-200 font-bold drop-shadow-sm">{profile?.country || 'Location Unknown'} | {profile?.degree_level || 'Student'}</p>
         </div>
         <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button onClick={() => setShowProfileModal(true)} className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 text-[10px] font-black uppercase tracking-widest transition-all text-white">Edit Profile</button>
            <Link href="/submit" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl border border-purple-500/30 text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-xl shadow-purple-500/20 flex items-center gap-2">
               <PlusCircle size={16} /> Place Order
            </Link>
            <Link href="/submit?type=assignment" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl border border-blue-500/30 text-[10px] font-black uppercase tracking-widest transition-all text-white shadow-xl shadow-blue-500/20 flex items-center gap-2">
               <FileText size={16} /> Submit Project
            </Link>
         </div>
      </div>

        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeOrders.slice(0, 2).map((o, idx) => (
            <motion.div 
              key={o.id} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/40 transition-all group relative shadow-lg flex flex-col justify-between"
            >
               <div className="flex items-center justify-between mb-6">
                  <span className="text-[8px] font-black uppercase bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/20">{o.type}</span>
                  <div className="text-sm font-black text-white">Rs. {o.price || '...'}</div>
               </div>
               <h4 className="font-black text-xl mb-6 line-clamp-2 leading-tight">{o.title}</h4>
               
               <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-300">
                     <span>Project Progress</span>
                     <span>{o.status === 'pending' ? '25%' : o.status === 'in-progress' ? '75%' : '100%'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: o.status === 'pending' ? '25%' : o.status === 'in-progress' ? '75%' : '100%' }}
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                     />
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-300 font-bold">
                     <Clock size={12} />
                     <span className="text-[8px] font-black uppercase">Due: {new Date(o.deadline).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => router.push(`/orders/${o.id}`)} className="text-[8px] font-black uppercase tracking-widest text-purple-400 hover:text-white transition-colors">View Details</button>
               </div>
            </motion.div>
          ))}
          {activeOrders.length === 0 && (
            <div className="md:col-span-2 h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/5 p-10 text-center">
               <AlertCircle className="text-gray-600 mb-4" size={32} />
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.dashboard.noProjects}</p>
            </div>
          )}
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 w-full max-w-lg p-10 rounded-[3rem] border border-white/10 shadow-3xl">
             <h2 className="text-3xl font-black mb-8 tracking-tighter text-center text-white">{t.dashboard.profileUpdate}</h2>
             <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t.dashboard.fullName}</label>
                   <input name="full_name" required defaultValue={profile?.full_name || ''} className="w-full bg-white/15 border border-white/30 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white text-sm font-black placeholder:text-gray-400" placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t.dashboard.university}</label>
                   <input name="university" required defaultValue={profile?.university || ''} className="w-full bg-white/15 border border-white/30 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white text-sm font-black placeholder:text-gray-400" placeholder="e.g. Oxford University" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Country</label>
                     <input name="country" required defaultValue={profile?.country || ''} className="w-full bg-white/15 border border-white/30 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 text-white text-sm font-black placeholder:text-gray-400" placeholder="e.g. United Kingdom" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Education Level</label>
                     <select name="degree_level" defaultValue={profile?.degree_level || 'undergraduate'} className="w-full bg-white/15 border border-white/30 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 appearance-none text-white text-sm font-black">
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate (Master)</option>
                        <option value="phd">PhD / Research</option>
                        <option value="high-school">High School</option>
                     </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 py-4 bg-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest border border-white/10 text-white">{t.common.cancel}</button>
                   <button type="submit" disabled={saving} className="flex-2 py-4 bg-purple-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-purple-500/20 text-white">
                      {saving ? t.common.loading : t.dashboard.updateBtn}
                   </button>
                </div>
             </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function HistoryTab({ orders }: { orders: any[] }) {
  const { t } = useLanguage();
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 pb-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
           <History size={24} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-white">{t.dashboard.history}</h2>
      </div>
      <div className="space-y-4">
        {orders.map((o, idx) => (
          <motion.div 
            key={o.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-black/40 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-purple-500/30 transition-all shadow-xl"
          >
             <div className="flex items-center gap-6 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${o.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                   {o.status === 'completed' ? <CheckCircle size={24}/> : <Clock size={24}/>}
                </div>
                <div className="text-left flex-1">
                   <h4 className="text-lg font-black text-white line-clamp-1">{o.title}</h4>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 mt-1">
                      <Calendar size={10}/> {new Date(o.created_at).toLocaleDateString()} 
                      <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                      <Laptop size={10}/> {o.type}
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
                {o.result_file_url && (
                  <a href={o.result_file_url} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-600/20 hover:scale-105 transition-all">
                    <Download size={14} /> {t.dashboard.download}
                  </a>
                )}
                <div className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border ${o.status === 'completed' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                   {t.common[o.status as keyof typeof t.common] || o.status}
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PaymentsTab({ orders, refresh }: { orders: any[], refresh: () => void }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useLanguage();
  const supabase = createClient();

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !selectedOrder) return;
    setIsUploading(true);
    const fileName = `ss_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { data, error: uploadError } = await supabase.storage.from('studentwork').upload(fileName, file);
    if (uploadError) {
      alert(`Upload Failed: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('studentwork').getPublicUrl(data.path);
      await supabase.from('orders').update({ payment_ss_url: publicUrl }).eq('id', selectedOrder.id);
      await supabase.from('order_updates').insert([{ order_id: selectedOrder.id, message: `Payment proof uploaded for "${selectedOrder.title}". Awaiting verification.` }]);
      alert('Payment proof submitted successfully. Awaiting admin verification.');
      setIsUploading(false);
      setSelectedOrder(null);
      refresh();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Account number copied to clipboard.');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400">
               <CreditCard size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white">{t.dashboard.payments}</h2>
         </div>

         {/* Official Bank Details Card */}
         <div className="w-full md:w-auto bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-3xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
               <Building2 size={20} className="text-purple-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white">{t.dashboard.bankDetails}</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between gap-8">
                  <span className="text-[8px] font-black uppercase text-gray-400">{t.dashboard.accHolder}</span>
                  <span className="text-[10px] font-black text-white uppercase">attaullah</span>
               </div>
               <div className="flex justify-between gap-8 items-center">
                  <span className="text-[8px] font-black uppercase text-gray-400">{t.dashboard.accNumber}</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-white">1635940381009310</span>
                     <button onClick={() => copyToClipboard('1635940381009310')} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-purple-400">
                        <Copy size={12} />
                     </button>
                  </div>
               </div>
               <div className="flex justify-between gap-8">
                  <span className="text-[8px] font-black uppercase text-gray-400">IBAN</span>
                  <span className="text-[10px] font-black text-white">PK20MUCB1635940381009310</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.filter(o => o.price > 0 && o.payment_status !== 'paid').map(o => (
          <div key={o.id} className="bg-black/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/5 group shadow-xl transition-all hover:border-purple-500/40 relative flex flex-col justify-between min-h-[300px]">
             <div className="absolute top-0 right-0 p-6">
                <AlertCircle className="text-red-500 animate-pulse" size={24} />
             </div>
             <div className="mb-8">
               <h4 className="font-black text-lg mb-2 text-white line-clamp-1">{o.title}</h4>
               <div className="text-4xl font-black text-white">Rs. {o.price}</div>
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Currency: PKR</p>
             </div>
             <button onClick={() => setSelectedOrder(o)} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all border border-white/10">
                {t.dashboard.uploadProof}
             </button>
          </div>
        ))}
      </div>

      {/* Payment Upload Modal */}
      {selectedOrder && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-3xl text-center">
               <h3 className="text-2xl font-black mb-2 tracking-tighter text-white">Submit Payment Proof</h3>
               <p className="text-gray-400 text-xs mb-8">Amount Due: Rs. {selectedOrder.price}</p>
               
               <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all mb-8">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                     <Paperclip className="w-8 h-8 mb-3" />
                     <p className="text-[9px] font-black uppercase tracking-widest text-white">{isUploading ? 'Uploading...' : 'Click to Upload Screenshot'}</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
               </label>
               
               <button onClick={() => setSelectedOrder(null)} className="w-full py-4 bg-white/5 rounded-xl font-black text-[9px] uppercase tracking-widest border border-white/10 text-white">Cancel</button>
            </motion.div>
         </div>
      )}

      {orders.filter(o => o.payment_status === 'paid').length > 0 && (
        <div className="mt-16">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 ml-2">{t.dashboard.paidInvoices}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {orders.filter(o => o.payment_status === 'paid').map(o => (
               <div key={o.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={18} />
                     </div>
                     <span className="font-bold text-sm text-white line-clamp-1">{o.title}</span>
                  </div>
                  <span className="text-green-500 font-black text-[8px] uppercase bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/10">Rs. {o.price} - Payment Verified</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ChatTab({ user }: { user: any }) {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { t } = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      const fetch = async () => {
        const { data } = await supabase.from('messages').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
        if (data) setChat(data);
      };
      fetch();
      const channel = supabase.channel('dashboard_chat_v7').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${user.id}` }, (payload) => {
        setChat(prev => [...prev, payload.new]);
      }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const send = async (fileUrl?: string) => {
    if (!msg.trim() && !fileUrl) return;
    await supabase.from('messages').insert([{ sender_id: user.id, user_id: user.id, message: msg, is_admin_reply: false, file_url: fileUrl || null }]);
    setMsg('');
  };

  const upload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data } = await supabase.storage.from('studentwork').upload(`chat_${Date.now()}_${file.name}`, file);
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('studentwork').getPublicUrl(data.path);
      send(publicUrl);
    }
    setUploading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-[700px] bg-black/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden mb-10">
      <div className="p-8 bg-purple-600/5 border-b border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
               <ShieldCheck size={20} />
            </div>
            <div>
               <h3 className="font-black text-[10px] uppercase tracking-widest text-white">{t.dashboard.chat}</h3>
               <p className="text-[7px] font-black text-purple-400 uppercase tracking-widest mt-1">{t.dashboard.statusOnline}</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[8px] font-black uppercase text-gray-500">Admins are Online</span>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
         {chat.map((m, i) => (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.is_admin_reply ? 'justify-start' : 'justify-end'}`}>
             <div className={`max-w-[85%] p-5 rounded-2xl text-[13px] font-medium shadow-xl relative ${m.is_admin_reply ? 'bg-white/5 text-white rounded-tl-none border border-white/5' : 'bg-purple-600 text-white rounded-br-none shadow-purple-500/10'}`}>
                {m.message}
                {m.file_url && (
                   <a href={m.file_url} target="_blank" className="mt-4 flex items-center gap-3 p-3 bg-black/20 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-black/40 transition-all border border-white/5 text-white">
                      <Download size={14} /> Download File
                   </a>
                )}
                <div className="text-[7px] font-black opacity-30 mt-2 uppercase tracking-widest">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
             </div>
           </motion.div>
         ))}
      </div>
      <div className="p-6 bg-black/20 border-t border-white/5 flex gap-4 items-center">
         <label className="p-4 bg-white/5 text-white rounded-xl cursor-pointer hover:bg-white/10 transition-all border border-white/5 shadow-md">
           <Paperclip size={20} className={uploading ? 'animate-bounce' : ''} />
           <input type="file" className="hidden" onChange={upload} disabled={uploading} />
         </label>
         <div className="flex-1">
            <input 
               value={msg} 
               onChange={e => setMsg(e.target.value)} 
               onKeyDown={e => e.key === 'Enter' && send()} 
               className="w-full bg-white/15 border border-white/30 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-purple-500 transition-all shadow-inner placeholder:text-gray-400" 
               placeholder={t.dashboard.typeMessage} 
            />
         </div>
         <button onClick={() => send()} className="p-4 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:scale-110 active:scale-95 transition-all">
            <Send size={20} />
         </button>
      </div>
    </motion.div>
  );
}
