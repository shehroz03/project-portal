'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, CreditCard, CheckCircle, 
  MessageSquare, Trash2, Clock, BellRing, Info
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price' | 'delivery' | 'message' | 'assignment' | string;
  read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  list: Notification[];
  onClose: () => void;
  onRead: (id: string) => void;
  onReadAll: () => void;
  onDelete?: (id: string) => void;
}

export default function NotificationCenter({ 
  list, 
  onClose, 
  onRead, 
  onReadAll,
  onDelete 
}: NotificationCenterProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 10 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.98, y: 10 }} 
      className="space-y-8 pb-10"
    >
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <BellRing size={32} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase">Intel Feed</h2>
            <div className="flex items-center gap-3 mt-1">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
               <p className="text-[9px] font-black text-blue-400/80 uppercase tracking-[0.4em]">Real-time Updates Active</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 md:mt-0 relative z-10 w-full md:w-auto">
          {list.some(n => !n.read) && (
            <button 
              onClick={onReadAll} 
              className="flex-1 md:flex-none px-6 py-4 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20 transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Mark All as Read
            </button>
          )}
          <button 
            onClick={onClose} 
            className="p-4 bg-white/5 text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 border border-white/10 transition-all group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {list.map((n, idx) => (
            <motion.div 
              key={n.id} 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
              className={`p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group ${
                n.read 
                  ? 'bg-black/20 border-white/5 opacity-60' 
                  : 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 shadow-lg shadow-blue-500/5'
              }`}
            >
              <div className="flex items-center gap-6 flex-1">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  n.type === 'price' ? 'bg-purple-600/20 text-purple-400' : 
                  n.type === 'delivery' ? 'bg-green-600/20 text-green-400' : 
                  n.type === 'message' ? 'bg-blue-600/20 text-blue-400' :
                  'bg-white/5 text-gray-400'
                }`}>
                  {n.type === 'price' ? <CreditCard size={24}/> : 
                   n.type === 'delivery' ? <CheckCircle size={24}/> : 
                   n.type === 'message' ? <MessageSquare size={24}/> : 
                   <Info size={24}/>}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`text-lg font-black truncate ${n.read ? 'text-gray-400' : 'text-white'}`}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-400 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-gray-600 tracking-widest">
                      <Clock size={10} />
                      {new Date(n.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    {n.type && (
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-white/5 rounded text-gray-500 border border-white/5">
                        {n.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-center">
                {!n.read && (
                  <button 
                    onClick={() => onRead(n.id)} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/30"
                  >
                    <Check size={16} /> Mark Read
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => onDelete(n.id)}
                    className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {list.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-32 text-center bg-white/5 rounded-[3rem] border border-white/5 border-dashed flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
               <Bell size={32} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">No new alerts in your feed.</p>
               <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest mt-2">We'll notify you when your project status changes.</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
