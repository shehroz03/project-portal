'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Send, BookOpen, Code2, FileText, Calendar, 
  AlignLeft, Info, Loader2, CheckCircle2, PlusCircle, 
  Globe, ShieldCheck, GraduationCap 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SubmitRequestPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    type: 'assignment',
    description: '',
    deadline: '',
    instructions: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?next=/submit');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection (Honeypot)
    const formElement = e.currentTarget as HTMLFormElement;
    const honeyPot = new FormData(formElement).get('website');
    if (honeyPot) return; // Silent discard for bots

    setLoading(true);

    let fileUrl = '';

    if (file) {
      const fileName = `${user.id}/file_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('studentwork')
        .upload(fileName, file);
      
      if (uploadError) {
        alert('Material upload failed');
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('studentwork').getPublicUrl(uploadData.path);
      fileUrl = publicUrl;
    }

    const { error } = await supabase
      .from('orders')
      .insert([
        {
          ...formData,
          user_id: user.id,
          status: 'pending',
          file_url: fileUrl,
          payment_status: 'pending',
        },
      ]);

    if (error) {
      alert('Transmission Error: ' + error.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white dark:bg-gray-900 p-16 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-3xl max-w-xl">
          <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter">Transmission Successful!</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">Your academic requirements have been safely transmitted to our global expert node. We will analyze and provide a quote shortly.</p>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-purple-600" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-24 px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-50 bg-gray-50 dark:bg-[#020617]"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] -z-40"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] -z-40"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center gap-10 mb-16 bg-white/50 dark:bg-white/5 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/20 shadow-2xl">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-purple-500/30">
            <GraduationCap size={40} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tighter mb-2">{t.submit.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">{t.submit.subtitle}</p>
          </div>
          <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-green-500/10 text-green-500 rounded-2xl border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
             <ShieldCheck size={16} /> 256-bit Encrypted
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12 bg-white dark:bg-gray-900 p-10 md:p-20 rounded-[4rem] shadow-3xl border border-gray-100 dark:border-white/5">
          {/* Security Honeypot */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          
          {/* Project Type Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'assignment', label: 'Assignment', icon: FileText, desc: 'Solved Tasks' },
              { id: 'fyp', label: 'FYP', icon: Code2, desc: 'Final Projects' },
              { id: 'thesis', label: 'Thesis', icon: BookOpen, desc: 'Research Hub' },
              { id: 'idea', label: 'Idea', icon: Info, desc: 'Consultation' },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({...formData, type: type.id})}
                className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group ${
                  formData.type === type.id 
                  ? 'border-purple-600 bg-purple-600/5 text-purple-600 shadow-xl' 
                  : 'border-gray-100 dark:border-white/5 text-gray-400 hover:border-purple-200 dark:hover:border-purple-900/50'
                }`}
              >
                <type.icon size={28} className={formData.type === type.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase tracking-widest block mb-1">{type.label}</span>
                   <span className="text-[8px] font-bold opacity-60 uppercase">{type.desc}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.submit.formTitle}</label>
                <div className="relative">
                  <AlignLeft size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500" />
                  <input
                    required
                    className="w-full pl-16 pr-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-sm"
                    placeholder="e.g. Adv. Algorithms Assignment 4"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.common.deadline}</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500" />
                  <input
                    type="date"
                    required
                    className="w-full pl-16 pr-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-sm"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Special Constraints</label>
                <input
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-sm"
                  placeholder="e.g. Use IEEE citation format..."
                  value={formData.instructions}
                  onChange={e => setFormData({...formData, instructions: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.submit.formDesc}</label>
                <textarea
                  required
                  rows={8}
                  className="w-full px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none font-medium text-sm leading-relaxed"
                  placeholder="Elaborate on your project requirements, goals, and technical stack..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* File Upload Zone */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t.submit.formFile}</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] cursor-pointer bg-gray-50 dark:bg-gray-800/20 hover:bg-purple-600/5 transition-all group/file">
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-600/10 text-purple-600 flex items-center justify-center mb-4 group-hover/file:scale-110 transition-all shadow-xl">
                    <PlusCircle size={32} />
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    {file ? file.name : 'Ingest Project Data'}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 mt-2">Maximum payload: 50MB</p>
                </div>
                <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 animate-gradient-x text-white rounded-[2rem] font-black text-xl hover:shadow-3xl hover:shadow-purple-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 mt-10 shadow-2xl"
          >
            {loading ? <Loader2 className="animate-spin" size={28} /> : <>{t.submit.submitBtn} <Send size={24} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
