'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, LogOut, LayoutDashboard, Lightbulb, 
  PlusCircle, ShieldCheck, User, Globe, Menu, X 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const isMaster = user.email === 'miansabmi7@gmail.com';
        const hasAdminRole = user.user_metadata?.role === 'admin';
        setIsAdmin(isMaster || hasAdminRole);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const isMaster = u.email === 'miansabmi7@gmail.com';
        const hasAdminRole = u.user_metadata?.role === 'admin';
        setIsAdmin(isMaster || hasAdminRole);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { name: 'Global Ideas', href: '/ideas', icon: Lightbulb },
    { name: 'Submit Project', href: '/submit', icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/70 dark:bg-[#020617]/70 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/20 transition-all"
            >
              <BookOpen size={22} className="text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 leading-none">
                BSt Studio
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 mt-1">Academic Supremacy</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group ${
                  pathname === link.href ? 'text-purple-600' : 'text-gray-500 dark:text-gray-400 hover:text-purple-600'
                }`}
              >
                <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/10 text-purple-600 border border-purple-600/20 hover:bg-purple-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <ShieldCheck size={16} /> {t.nav.admin}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-600/10 transition-all"
                >
                  <LayoutDashboard size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-purple-600 px-4 py-2 transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/signup"
                  className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-xl shadow-purple-500/20"
                >
                  {t.nav.signup}
                </Link>
              </div>
            )}
            
            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#020617] overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400"
                >
                  <link.icon size={18} />
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-purple-600"
                >
                  <ShieldCheck size={18} /> Admin Control
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
