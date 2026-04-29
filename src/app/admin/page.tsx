'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Package, CreditCard, MessageSquare, 
  CheckCircle, Clock, AlertCircle, ExternalLink, Loader2, Send, 
  XCircle, Paperclip, PlusCircle, Globe, Search, Filter, 
  User as UserIcon, GraduationCap, Building2, Download
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const fetchData = async () => {
    const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: profileData } = await supabase.from('profiles').select('*');
    if (orderData) setOrders(orderData);
    if (profileData) setProfiles(profileData);
    setLoading(false);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const isMasterEmail = user?.email === 'miansabmi7@gmail.com';
      const hasAdminRole = user?.user_metadata?.role === 'admin';
      if (!user || (!hasAdminRole && !isMasterEmail)) {
        router.push('/dashboard');
        return;
      }
      setIsAdmin(true);
      fetchData();
    };
    checkAdmin();
  }, [supabase, router]);

  if (!isAdmin || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200 dark:border-gray-800 px-8 py-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white shadow-2xl shadow-purple-500/20">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">Command Center</h1>
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.5em] mt-1">miansabmi7@gmail.com</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search projects or students..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold w-64 md:w-80 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
             </div>
             <div className="flex bg-gray-200/50 dark:bg-gray-800/50 p-1.5 rounded-2xl">
                {['orders', 'payments', 'support'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-xl' : 'text-gray-500'}`}>
                    {tab}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && <OrdersTab key="orders" orders={orders} profiles={profiles} refresh={fetchData} searchQuery={searchQuery} />}
          {activeTab === 'payments' && <PaymentsTab key="payments" orders={orders} profiles={profiles} refresh={fetchData} />}
          {activeTab === 'support' && <SupportTab key="support" profiles={profiles} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrdersTab({ orders, profiles, refresh, searchQuery }: { orders: any[], profiles: any[], refresh: () => void, searchQuery: string }) {
  const supabase = createClient();
  const [localPrices, setLocalPrices] = useState<any>({});

  const sendEmail = async (to: string, subject: string, html: string) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
      });
    } catch (err) {
      console.error('Email failed:', err);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatus = async (id: string, status: string) => { 
    await supabase.from('orders').update({ status }).eq('id', id); 
    refresh(); 
  };
  
  const handlePriceSend = async (order: any) => {
    const price = localPrices[order.id];
    if (!price) return;
    
    const { error } = await supabase.from('orders').update({ price: parseFloat(price) }).eq('id', order.id);
    if (!error) {
      await supabase.from('order_updates').insert([{
        order_id: order.id,
        message: `💰 Admin has set the project price to Rs. ${price}. Please proceed to the Payments section.`
      }]);
      // Persistent Notification
      await supabase.from('notifications').insert([{
        user_id: order.user_id,
        title: 'Price Updated',
        message: `Admin has set the price for "${order.title}" to Rs. ${price}.`,
        type: 'price'
      }]);

      // Email Notification
      const student = profiles.find(p => p.id === order.user_id);
      if (student?.email) {
        await sendEmail(
          student.email,
          `Price Set: ${order.title}`,
          `<h1>Price Update</h1><p>Admin has set the price for your project "<strong>${order.title}</strong>" to <strong>Rs. ${price}</strong>.</p><p>Please login to your dashboard to proceed with the payment.</p>`
        );
      } else {
        alert("Warning: Student email not found in database. Email notification could not be sent.");
      }

      alert(`Success: Rs. ${price} saved and sent to student!`);
      refresh();
    } else {
      alert(`Database Error: ${error.message}`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {filteredOrders.map(order => {
        const student = profiles.find(p => p.id === order.user_id);
        return (
          <div key={order.id} className="bg-white dark:bg-gray-900 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-2xl flex flex-col md:flex-row gap-12 hover:border-purple-500/30 transition-all group">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black bg-purple-600 text-white px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">{order.type}</span>
                   {order.deadline && (
                     <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                       <Clock size={14} /> Deadline: {new Date(order.deadline).toLocaleDateString()}
                     </div>
                   )}
                 </div>
                 {order.price > 0 && (
                   <div className="text-right">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Assigned Price</div>
                      <div className="text-3xl font-black text-purple-600">Rs. {order.price}</div>
                   </div>
                 )}
              </div>
              
              <h3 className="text-3xl font-black mb-4 tracking-tighter group-hover:text-purple-600 transition-colors">{order.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">{order.description}</p>
              
              {/* Student Academic Info Card */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl mb-10 flex flex-wrap gap-10 border border-gray-100 dark:border-gray-700/50">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-purple-500 shadow-sm">
                       <Building2 size={20} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Institution</p>
                       <p className="text-sm font-bold">{student?.university || 'Unknown'}</p>
                       <p className="text-[10px] font-black text-purple-500 mt-1">{student?.email || '⚠️ Email Missing (Notification will fail)'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-blue-500 shadow-sm">
                       <Globe size={20} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Country</p>
                       <p className="text-sm font-bold">{student?.country || 'Global'}</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-wrap gap-8 items-end">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Workflow Status</label>
                   <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="block w-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 text-sm font-bold outline-none border-none focus:ring-2 focus:ring-purple-500 appearance-none min-w-[200px]">
                     <option value="pending">🟡 Pending Analysis</option>
                     <option value="in-progress">🔵 Expert Working</option>
                     <option value="completed">🟢 Quality Approved</option>
                     <option value="cancelled">🔴 Cancelled</option>
                   </select>
                </div>
                <div className="space-y-3 flex-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Pricing (Rs.)</label>
                   <div className="flex gap-4">
                     <input 
                       type="number" 
                       placeholder="0.00"
                       value={localPrices[order.id] || ''} 
                       onChange={(e) => setLocalPrices({...localPrices, [order.id]: e.target.value})}
                       className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 text-sm font-bold outline-none flex-1 border-none focus:ring-2 focus:ring-purple-500" 
                     />
                     <button onClick={() => handlePriceSend(order)} className="px-8 bg-purple-600 text-white rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                       <Send size={18} /> Update
                     </button>
                   </div>
                </div>
              </div>
            </div>

            {/* Delivery Sidebar */}
            <div className="w-full md:w-80 flex flex-col justify-between border-l border-gray-100 dark:border-gray-800 pl-0 md:pl-12">
               <div className="space-y-8">
                  <div className="p-8 bg-purple-500/5 dark:bg-purple-900/10 rounded-[2.5rem] border border-purple-100 dark:border-purple-800">
                     <div className="text-[10px] font-black text-purple-600 uppercase mb-4 tracking-[0.2em] text-center">Quality Assurance Delivery</div>
                     <label className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-purple-200 dark:border-purple-700 rounded-[2rem] cursor-pointer hover:bg-purple-500/10 transition-all group/upload">
                        <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center mb-3 group-hover/upload:scale-110 transition-all">
                           <PlusCircle size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase text-purple-600">Ship Final Work</span>
                        <input type="file" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const { data } = await supabase.storage.from('studentwork').upload(`result_${Date.now()}_${file.name}`, file);
                          if (data) {
                            const { data: { publicUrl } } = supabase.storage.from('studentwork').getPublicUrl(data.path);
                            await supabase.from('orders').update({ result_file_url: publicUrl, status: 'completed' }).eq('id', order.id);
                            await supabase.from('order_updates').insert([{ order_id: order.id, message: '🎉 Your final academic work has been delivered! Standardized quality check complete.' }]);
                            
                            // Persistent Notification
                            await supabase.from('notifications').insert([{
                              user_id: order.user_id,
                              title: 'Project Delivered',
                              message: `Great news! Final work for "${order.title}" is now available for download.`,
                              type: 'delivery'
                            }]);

                            // Email Notification
                            const student = profiles.find(p => p.id === order.user_id);
                            if (student?.email) {
                              await sendEmail(
                                student.email,
                                `Work Delivered: ${order.title}`,
                                `<h1>Great News!</h1><p>Your final academic work for "<strong>${order.title}</strong>" has been delivered.</p><p>You can now download it from your dashboard.</p>`
                              );
                            }

                            alert('Shipment Successful!');
                            refresh();
                          }
                        }} />
                     </label>
                     {order.result_file_url && (
                       <div className="mt-4 flex items-center justify-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest">
                          <CheckCircle size={14} /> Delivered Successfully
                       </div>
                     )}
                  </div>
                  
                  {order.file_url && (
                    <a href={order.file_url} target="_blank" className="flex items-center justify-center gap-3 py-5 bg-blue-500/10 text-blue-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500/20 transition-all">
                      <Download size={18} /> Initial Materials
                    </a>
                  )}
               </div>
               
               <button onClick={async () => { if(confirm('Delete Project Trace?')){ await supabase.from('orders').delete().eq('id', order.id); refresh(); }}} className="w-full py-5 bg-red-500/10 text-red-500 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/20 mt-10 transition-all">
                  Terminate Order
               </button>
            </div>
          </div>
        );
      })}
      {filteredOrders.length === 0 && (
        <div className="py-20 text-center text-gray-400 font-black uppercase tracking-widest bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800">
           No matching projects found.
        </div>
      )}
    </motion.div>
  );
}

function PaymentsTab({ orders, profiles, refresh }: { orders: any[], profiles: any[], refresh: () => void }) {
  const supabase = createClient();
  const pending = orders.filter(o => o.payment_ss_url && o.payment_status !== 'paid');

  const sendEmail = async (to: string, subject: string, html: string) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
      });
    } catch (err) {
      console.error('Email failed:', err);
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {pending.map(order => (
        <div key={order.id} className="bg-white dark:bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <h4 className="font-black text-2xl tracking-tighter leading-tight pr-4">{order.title}</h4>
            <div className="text-xl font-black text-purple-600">Rs. {order.price}</div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-[2.5rem] border-4 border-gray-50 dark:border-gray-800 mb-8 shadow-inner bg-gray-100 dark:bg-gray-800">
             <img src={order.payment_ss_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <button onClick={async () => { 
            await supabase.from('orders').update({ payment_status: 'paid', status: 'in-progress' }).eq('id', order.id); 
            
            // Notification
            await supabase.from('notifications').insert([{
              user_id: order.user_id,
              title: 'Payment Verified',
              message: `Your payment for "${order.title}" has been verified. Our experts are now working on it!`,
              type: 'price'
            }]);

            // Email
            const student = profiles.find(p => p.id === order.user_id);
            if (student?.email) {
              await sendEmail(
                student.email,
                `Payment Verified: ${order.title}`,
                `<h1>Payment Success</h1><p>Your payment for "<strong>${order.title}</strong>" has been verified.</p><p>Our experts have started working on your project. You will be notified once it's delivered.</p>`
              );
            } else {
              alert("Warning: Student email not found. Payment verified but email notification failed.");
            }

            refresh(); 
          }} className="w-full py-6 bg-green-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-green-600/20 hover:scale-[1.02] transition-all">
             Verify & Unlock
          </button>
        </div>
      ))}
      {pending.length === 0 && (
        <div className="col-span-full py-20 text-center text-gray-400 font-black uppercase tracking-widest bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800">
           No pending payments for verification.
        </div>
      )}
    </motion.div>
  );
}

function SupportTab({ profiles }: { profiles: any[] }) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('messages').select('user_id').order('created_at', { ascending: false });
      if (data) setUsers(Array.from(new Set(data.map(d => d.user_id))));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMsgs = async () => {
        const { data } = await supabase.from('messages').select('*').eq('user_id', selectedUser).order('created_at', { ascending: true });
        if (data) setMessages(data);
      };
      fetchMsgs();
      const channel = supabase.channel('admin_chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `user_id=eq.${selectedUser}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }).subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedUser]);

  const sendReply = async (fileUrl?: string) => {
    if (!reply.trim() && !fileUrl) return;
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('messages').insert([{ 
      sender_id: user?.id, 
      user_id: selectedUser, 
      message: reply, 
      is_admin_reply: true, 
      file_url: fileUrl || null 
    }]);

    // Persistent Notification for Chat
    await supabase.from('notifications').insert([{
      user_id: selectedUser,
      title: 'New Message',
      message: 'Admin has sent you a new message in Expert Support.',
      type: 'message'
    }]);

    setReply('');
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;
    setUploading(true);
    const { data } = await supabase.storage.from('studentwork').upload(`chat_admin_${Date.now()}_${file.name}`, file);
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('studentwork').getPublicUrl(data.path);
      sendReply(publicUrl);
    }
    setUploading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-4 h-[800px] border border-gray-100 dark:border-gray-800 rounded-[4rem] overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl shadow-3xl">
      <div className="p-8 border-r border-gray-100 dark:border-gray-800 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
         <h4 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-[0.4em]">Active Academic Nodes</h4>
         {users.map(uid => {
            const prof = profiles.find(p => p.id === uid);
            return (
              <button 
                key={uid} 
                onClick={() => setSelectedUser(uid)} 
                className={`w-full text-left p-6 rounded-[1.5rem] transition-all ${selectedUser === uid ? 'bg-purple-600 text-white shadow-2xl' : 'bg-white dark:bg-gray-800 shadow-sm hover:translate-x-2'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                   <UserIcon size={14} />
                   <span className="text-xs font-black tracking-tight">{prof?.full_name || uid.slice(0,8)}</span>
                </div>
                <div className="text-[8px] font-black uppercase opacity-60 flex items-center gap-2">
                   <Building2 size={10} /> {prof?.university?.slice(0,15) || 'Unknown Uni'}
                </div>
              </button>
            );
         })}
      </div>
      
      <div className="md:col-span-3 flex flex-col relative">
         {selectedUser ? (
           <>
             <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-500 flex items-center justify-center">
                      <GraduationCap size={20} />
                   </div>
                   <h4 className="font-black text-sm tracking-tight">{profiles.find(p => p.id === selectedUser)?.full_name || 'Student Details'}</h4>
                </div>
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   <span className="text-[8px] font-black uppercase text-gray-400">Direct Link Active</span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.is_admin_reply ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-6 rounded-[2rem] text-sm relative ${m.is_admin_reply ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                      {m.message}
                      {m.file_url && <a href={m.file_url} target="_blank" className="block mt-4 font-black uppercase text-[9px] tracking-widest underline flex items-center gap-2 opacity-80"><Download size={14}/> Attachment Delivered</a>}
                      <div className="text-[8px] font-black opacity-30 mt-3 uppercase tracking-widest">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-white/10 flex gap-6">
                <label className="p-5 bg-gray-200/50 dark:bg-gray-800 rounded-2xl cursor-pointer hover:bg-purple-500/10 transition-all">
                   <Paperclip size={24} className={uploading ? 'animate-bounce' : ''} />
                   <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
                <input 
                  value={reply} 
                  onChange={e => setReply(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && sendReply()} 
                  className="flex-1 px-8 py-5 bg-gray-100 dark:bg-gray-800 rounded-[2rem] text-sm font-bold outline-none border-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Draft encrypted reply..." 
                />
                <button onClick={() => sendReply()} className="px-12 bg-purple-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20">Transmit</button>
             </div>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-300 italic opacity-40">
              <MessageSquare size={64} className="mb-6" />
              <p className="font-black uppercase tracking-[0.5em] text-[10px]">Select student node to begin communication</p>
           </div>
         )}
      </div>
    </motion.div>
  );
}
