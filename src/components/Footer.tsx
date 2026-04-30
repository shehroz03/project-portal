import Link from 'next/link';
import { BookOpen, Globe, ShieldCheck, Mail, MessageSquare, Share2, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#020617] border-t border-gray-100 dark:border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                BST HUB
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Your comprehensive hub for assignments, final year projects, thesis documentation, and academic research guidance at all educational levels.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                  <Globe size={12} /> Global Support
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                  <ShieldCheck size={12} /> Verified
               </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Ideas', 'Order Now', 'Dashboard', 'Login'].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(' ', '')}`} className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Specializations</h4>
            <ul className="space-y-4">
              {['Assignment Help', 'FYP & Projects', 'Thesis Support', 'Research Papers', 'Custom Solutions'].map((service) => (
                <li key={service} className="text-sm font-bold text-gray-600 dark:text-gray-400">
                   {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Contact Node</h4>
              <a href="mailto:info@broadsolutiontech.com" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-black tracking-tight text-gray-700 dark:text-gray-200">info@broadsolutiontech.com</span>
              </a>
            </div>
            <div className="flex gap-4">
              {[Globe, MessageSquare, Share2].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-purple-600 transition-all">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
            © {new Date().getFullYear()} BST HUB · ACADEMIC SUPREMACY
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-purple-600">Privacy Policy</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-purple-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
