'use client';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export default function SoftwareHouseButton() {
  return (
    <motion.a
      href="https://broadsolutiontech.com"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[9999] hidden sm:flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 bg-gray-900 text-white rounded-2xl shadow-2xl border border-white/10 group overflow-hidden"
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-purple-600 transition-colors">
          <Terminal size={20} className="text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-400 leading-none mb-1">Official</span>
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Software House</span>
        </div>
      </div>
      
      {/* Animated Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity -z-10"></div>
    </motion.a>
  );
}
