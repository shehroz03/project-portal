import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Send, BookOpen, Code2, FileText, Calendar, AlignLeft, Info } from 'lucide-react';

const types = [
  { value: 'assignment', label: 'Assignment', icon: BookOpen, color: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
  { value: 'fyp', label: 'Final Year Project', icon: Code2, color: 'border-pink-400 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300' },
  { value: 'thesis', label: 'Thesis / Research', icon: FileText, color: 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' },
];

export default function SubmitRequest() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ type: 'assignment', title: '', description: '', instructions: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        form,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Submit a Request</h1>
          <p className="text-gray-500 dark:text-gray-400">Fill in the details below and our team will get back to you shortly.</p>
        </div>

        {success ? (
          <div className="text-center py-16 px-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Request Submitted!</h2>
            <p className="text-green-600 dark:text-green-500">Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 space-y-6">

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>
            )}

            {/* Service Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Service Type</label>
              <div className="grid grid-cols-3 gap-3">
                {types.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, type: value })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      form.type === value ? color + ' shadow-md scale-[1.02]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-semibold text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5"><Info size={14} /> Project / Assignment Title</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. E-commerce Website using MERN Stack"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5"><AlignLeft size={14} /> Description</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what you need in detail..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Special Instructions <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                name="instructions"
                rows={3}
                value={form.instructions}
                onChange={handleChange}
                placeholder="Any specific requirements, references, or notes..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Deadline</span>
              </label>
              <input
                type="date"
                name="deadline"
                required
                value={form.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
