'use client';
import { useEffect, useState, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Send, Clock, CheckCircle, XCircle, AlertCircle, 
  ArrowLeft, MessageSquare, Activity, Loader2, PlusCircle, Paperclip, Download, ClipboardList 
} from 'lucide-react';

const statusConfig: any = {
  pending:      { label: 'Pending',     icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  'in-progress':{ label: 'In Progress', icon: Clock,       color: 'text-blue-500',   bg: 'bg-blue-50' },
  completed:    { label: 'Completed',   icon: CheckCircle, color: 'text-green-500',  bg: 'bg-green-50' },
  cancelled:    { label: 'Cancelled',   icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50' },
};

export default function OrderClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const { data: orderData } = await supabase.from('orders').select('*').eq('id', id).single();
      setOrder(orderData);

      const { data: updateData } = await supabase.from('order_updates').select('*').eq('order_id', id).order('created_at', { ascending: false });
      setUpdates(updateData || []);

      const { data: msgData } = await supabase.from('messages').select('*').eq('order_id', id).order('created_at', { ascending: true });
      setMessages(msgData || []);

      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel('order_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `order_id=eq.${id}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, supabase, router]);

  const handleSendMessage = async (e?: React.FormEvent, fileUrl?: string) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() && !fileUrl) return;

    await supabase.from('messages').insert([
      { order_id: id, sender_id: user.id, message: newMessage, file_url: fileUrl || null, user_id: order.user_id }
    ]);
    setNewMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `chat_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('project-files').upload(fileName, file);
    
    if (data) {
      const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(data.path);
      handleSendMessage(undefined, publicUrl);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40} /></div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  const config = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 font-bold mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Order Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-600">
               <ClipboardList size={24} /> Order Information
             </h2>
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-50 dark:border-gray-800">
                <div>
                  <h1 className="text-3xl font-black">{order.title}</h1>
                  <p className="text-gray-400 text-sm mt-1">ID: {order.id.slice(0, 8)} | Type: {order.type}</p>
                </div>
                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border ${config.bg} ${config.color} font-black text-xs uppercase`}>
                  <config.icon size={16} /> {config.label}
                </div>
             </div>
             <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{order.description}</p>
             {order.file_url && (
               <a href={order.file_url} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                 <Download size={18} /> Download Assignment File
               </a>
             )}
          </div>

          {/* Work Progress Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-blue-600">
              <Activity size={24} /> Live Work Progress
            </h2>
            {updates.length === 0 ? (
              <p className="text-gray-400 italic">Work will start after payment verification.</p>
            ) : (
              <div className="space-y-6">
                {updates.map((u) => (
                  <div key={u.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-l-4 border-blue-500">
                    <div className="text-[10px] font-bold text-gray-400 mb-1">{new Date(u.created_at).toLocaleString()}</div>
                    <p className="font-medium">{u.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
             <div className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border-b border-gray-100 dark:border-gray-800">
               <h2 className="font-bold flex items-center gap-2 text-purple-600">
                 <MessageSquare size={20} /> Client-Admin Chat
               </h2>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender_id === user.id ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {msg.message}
                      {msg.file_url && (
                        <a href={msg.file_url} target="_blank" className="mt-2 flex items-center gap-2 p-2 bg-black/10 rounded-lg font-bold text-xs">
                          <Paperclip size={14} /> View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                   <label className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl cursor-pointer hover:bg-gray-200">
                     <Paperclip size={20} />
                     <input type="file" className="hidden" onChange={handleFileUpload} />
                   </label>
                   <input 
                     value={newMessage}
                     onChange={e => setNewMessage(e.target.value)}
                     placeholder="Type a message..."
                     className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 outline-none"
                   />
                   <button type="submit" className="p-3 bg-purple-600 text-white rounded-xl"><Send size={20} /></button>
                </form>
             </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-green-600">
               <CheckCircle size={24} /> Payment & Billing
             </h2>
             {!order.price ? (
               <p className="text-gray-400 italic text-center py-10 border-2 border-dashed rounded-3xl">Waiting for Admin to set price.</p>
             ) : (
               <div className="grid md:grid-cols-2 gap-8">
                 <div className="p-6 bg-purple-600 text-white rounded-3xl">
                   <div className="text-xs uppercase font-bold opacity-60">Total Price</div>
                   <div className="text-3xl font-black">Rs. {order.price}</div>
                 </div>
                 {order.payment_status === 'paid' ? (
                   <div className="p-6 bg-green-50 text-green-600 rounded-3xl font-bold flex items-center gap-2">
                     <CheckCircle /> Verified
                   </div>
                 ) : (
                   <div className="space-y-4">
                     <p className="text-sm font-bold text-gray-500 uppercase">Upload Proof (Screenshot)</p>
                     <label className="block p-8 border-2 border-dashed border-purple-200 rounded-3xl text-center cursor-pointer hover:bg-purple-50">
                        <PlusCircle className="mx-auto mb-2 text-purple-600" />
                        <span className="text-xs font-bold text-gray-400">Select Image</span>
                        <input type="file" className="hidden" onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if(file) {
                             const { data } = await supabase.storage.from('project-files').upload(`ss_${Date.now()}`, file);
                             if(data) {
                               const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(data.path);
                               await supabase.from('orders').update({ payment_ss_url: publicUrl }).eq('id', order.id);
                               window.location.reload();
                             }
                           }
                        }} />
                     </label>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
