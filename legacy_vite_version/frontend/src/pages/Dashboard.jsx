import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { ClipboardList, Clock, CheckCircle, XCircle, AlertCircle, PlusCircle, ChevronRight } from 'lucide-react';

const statusConfig = {
  pending:     { label: 'Pending',     icon: AlertCircle,    color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  'in-progress':{ label: 'In Progress', icon: Clock,          color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  completed:   { label: 'Completed',   icon: CheckCircle,    color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  cancelled:   { label: 'Cancelled',   icon: XCircle,        color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
};

const typeLabel = { assignment: 'Assignment', fyp: 'Final Year Project', thesis: 'Thesis / Research' };

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const counts = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => o.status === 'in-progress').length,
    done: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, <span className="font-semibold text-[var(--color-primary)]">{user?.name}</span></p>
          </div>
          <Link to="/submit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold rounded-xl shadow hover:opacity-90 transition-all">
            <PlusCircle size={18} /> New Request
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: counts.total, color: 'text-gray-900 dark:text-white' },
            { label: 'Pending', value: counts.pending, color: 'text-yellow-600' },
            { label: 'In Progress', value: counts.active, color: 'text-blue-600' },
            { label: 'Completed', value: counts.done, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center">
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ClipboardList size={20} className="text-[var(--color-primary)]" /> My Requests
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
              <ClipboardList className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't submitted any requests yet.</p>
              <Link to="/submit" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold rounded-xl shadow hover:opacity-90 transition-all">
                <PlusCircle size={18} /> Submit Your First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center ${cfg.bg}`}>
                      <Icon size={20} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          {typeLabel[order.type] || order.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{order.title}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        Deadline: {new Date(order.deadline).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-[var(--color-primary)] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
