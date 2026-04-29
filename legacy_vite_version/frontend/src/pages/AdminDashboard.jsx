import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  ShieldCheck, Users, ClipboardList, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, Plus, Activity
} from 'lucide-react';

const statusConfig = {
  pending:      { label: 'Pending',     icon: AlertCircle, color: 'text-yellow-500', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'in-progress':{ label: 'In Progress', icon: Clock,       color: 'text-blue-500',   badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed:    { label: 'Completed',   icon: CheckCircle, color: 'text-green-500',  badge: 'bg-green-100 text-green-700 border-green-200' },
  cancelled:    { label: 'Cancelled',   icon: XCircle,     color: 'text-red-500',    badge: 'bg-red-100 text-red-700 border-red-200' },
};

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [updateMsg, setUpdateMsg] = useState('');
  const [statusChange, setStatusChange] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = statusChange[orderId];
    if (!newStatus) return;
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch { alert('Failed to update status'); }
  };

  const handleAddUpdate = async (orderId) => {
    if (!updateMsg.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/orders/${orderId}/updates`,
        { message: updateMsg },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUpdateMsg('');
      alert('Update posted! Client will see it.');
    } catch { alert('Failed to post update'); }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => o.status === 'in-progress').length,
    done: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <ShieldCheck size={22} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage all orders and client communications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Orders',  value: stats.total,   icon: ClipboardList,  color: 'text-gray-700 dark:text-gray-200' },
            { label: 'Pending',       value: stats.pending, icon: AlertCircle,    color: 'text-yellow-600' },
            { label: 'In Progress',   value: stats.active,  icon: TrendingUp,     color: 'text-blue-600' },
            { label: 'Completed',     value: stats.done,    icon: CheckCircle,    color: 'text-green-600' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center">
                <Icon className={`mx-auto mb-2 ${s.color}`} size={24} />
                <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardList size={20} className="text-orange-500" /> All Orders
            </h2>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">No orders yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                const isExpanded = expandedId === order._id;
                return (
                  <div key={order._id}>
                    <div
                      className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 capitalize">{order.type}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            by {order.userId?.name || 'Unknown'} ({order.userId?.email || ''})
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{order.title}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          Deadline: {new Date(order.deadline).toLocaleDateString('en-PK')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                          <StatusIcon size={12} /> {cfg.label}
                        </span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-gray-50 dark:bg-gray-800/40 px-5 pb-5 pt-3 space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.description}</p>
                        {order.instructions && <p className="text-sm text-gray-500 dark:text-gray-400 italic">Instructions: {order.instructions}</p>}

                        {/* Status Update */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            defaultValue={order.status}
                            onChange={e => setStatusChange(prev => ({ ...prev, [order._id]: e.target.value }))}
                            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleStatusUpdate(order._id)}
                            className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                          >
                            Update Status
                          </button>
                        </div>

                        {/* Daily Update */}
                        <div className="flex gap-3">
                          <input
                            value={expandedId === order._id ? updateMsg : ''}
                            onChange={e => setUpdateMsg(e.target.value)}
                            placeholder="Post a daily progress update to client..."
                            className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                          />
                          <button
                            onClick={() => handleAddUpdate(order._id)}
                            className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5"
                          >
                            <Activity size={14} /> Post Update
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
