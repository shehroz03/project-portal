import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Send, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, MessageSquare, Activity } from 'lucide-react';

const statusConfig = {
  pending:      { label: 'Pending',     icon: AlertCircle, color: 'text-yellow-500', badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200' },
  'in-progress':{ label: 'In Progress', icon: Clock,       color: 'text-blue-500',   badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200' },
  completed:    { label: 'Completed',   icon: CheckCircle, color: 'text-green-500',  badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200' },
  cancelled:    { label: 'Cancelled',   icon: XCircle,     color: 'text-red-500',    badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${user.token}` };
    const load = async () => {
      try {
        const [ordRes, updRes, msgRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/orders/myorders`, { headers }),
          axios.get(`http://localhost:5000/api/orders/${id}/updates`, { headers }),
          axios.get(`http://localhost:5000/api/messages/${id}`, { headers }),
        ]);
        const found = ordRes.data.find(o => o._id === id);
        setOrder(found || null);
        setUpdates(updRes.data);
        setMessages(msgRes.data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async e => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/messages/${id}`,
        { content: msgInput },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages(prev => [...prev, data]);
      setMsgInput('');
    } catch { /* silent */ }
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Order Not Found</h2>
      <button onClick={() => navigate('/dashboard')} className="text-[var(--color-primary)] underline">Back to Dashboard</button>
    </div>
  );

  const cfg = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Order Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{order.type}</p>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{order.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{order.description}</p>
              {order.instructions && (
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">Instructions: {order.instructions}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${cfg.badge}`}>
                <StatusIcon size={14} className={cfg.color} /> {cfg.label}
              </span>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Deadline: {new Date(order.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {order.price && (
                <p className="text-sm font-bold text-[var(--color-primary)]">PKR {order.price.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Updates */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[var(--color-primary)]" /> Progress Updates
            </h2>
            {updates.length === 0 ? (
              <div className="text-center py-10">
                <Activity className="mx-auto text-gray-200 dark:text-gray-700 mb-3" size={36} />
                <p className="text-sm text-gray-400 dark:text-gray-500">No updates yet. We'll post progress here daily.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map(u => (
                  <div key={u._id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] mt-1 flex-shrink-0"></div>
                      <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-200">{u.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(u.createdAt).toLocaleString('en-PK')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-[var(--color-primary)]" /> Chat with Team
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 max-h-72 min-h-40 pr-1 mb-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto text-gray-200 dark:text-gray-700 mb-3" size={36} />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No messages yet. Ask a question!</p>
                </div>
              ) : messages.map(m => {
                const isMe = m.senderId?._id === user._id || m.senderId === user._id;
                return (
                  <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'}`}>
                      {!isMe && <p className="text-xs font-semibold opacity-70 mb-0.5">{m.senderId?.name || 'Team'}</p>}
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={sending || !msgInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
