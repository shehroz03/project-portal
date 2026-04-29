import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Lightbulb, PlusCircle, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">
              BSt
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/ideas" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors">
              <Lightbulb size={16} /> Ideas
            </Link>
            {user && (
              <>
                <Link to="/submit" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors">
                  <PlusCircle size={16} /> Submit Request
                </Link>
                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">
                    <ShieldCheck size={16} /> Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg shadow hover:opacity-90 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
