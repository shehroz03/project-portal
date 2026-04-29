'use client';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const phoneNumber = '923144219130'; // International format
  const message = 'Hello BSt Studio, I need assistance with my project.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl shadow-[#25D366]/40 group"
    >
      <svg 
        viewBox="0 0 24 24" 
        width="32" 
        height="32" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="group-hover:rotate-12 transition-transform"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      <span className="absolute right-full mr-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl border border-gray-100 dark:border-gray-800">
        Chat with Us
      </span>
    </motion.a>
  );
}
