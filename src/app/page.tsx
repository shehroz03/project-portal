'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Lightbulb, FileText, 
  Code2, CheckCircle, Clock, Users, Globe, 
  ShieldCheck, Star, GraduationCap, Laptop 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const stats = [
    { label: 'Orders Completed', value: '5k+', icon: CheckCircle },
    { label: 'Global Students', value: '12k+', icon: Users },
    { label: 'Expert Tutors', value: '150+', icon: BookOpen },
    { label: 'Success Rate', value: '99.9%', icon: Star },
  ];

  const services = [
    { title: 'Assignment Help', desc: 'Custom solved assignments for all international boards and university curricula.', icon: FileText, color: 'bg-blue-500/10 text-blue-500' },
    { title: 'FYP & Thesis', desc: 'End-to-end support for Final Year Projects and research thesis with documentation.', icon: Code2, color: 'bg-purple-500/10 text-purple-500' },
    { title: 'Essay & Research', desc: 'Professional academic writing, research papers, and case studies for global standards.', icon: GraduationCap, color: 'bg-green-500/10 text-green-500' },
    { title: 'Project Ideas', desc: 'Unique, innovative project ideas tailored to your degree and specialization.', icon: Lightbulb, color: 'bg-yellow-500/10 text-yellow-500' },
  ];

  const testimonials = [
    { name: 'Sarah J.', uni: 'University of Manchester', content: 'The FYP support was incredible. From documentation to code, everything was top-notch!', avatar: 'SJ' },
    { name: 'Ahmed K.', uni: 'NUST', content: 'Fastest turnaround I have ever seen. My assignments were perfect and I scored an A.', avatar: 'AK' },
    { name: 'Elena R.', uni: 'Stanford Student', content: 'Professional and reliable. The research paper assistance was exactly what I needed.', avatar: 'ER' },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="space-y-32 pb-32 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-600/10 via-blue-500/5 to-transparent dark:from-purple-900/20 -z-10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-purple-600 dark:text-purple-400 text-sm font-black mb-10 shadow-xl shadow-purple-500/5"
          >
            <Globe size={16} className="animate-spin-slow" />
            {t.hero.badge}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            {t.hero.title.split(' ')[0]} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
              {t.hero.title.split(' ').slice(1).join(' ')}.
            </span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            {t.hero.subtitle}
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              href="/submit" 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-[2rem] font-black text-lg hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              {t.hero.ctaPrimary} <ArrowRight size={22} />
            </Link>
            <Link 
              href="/ideas" 
              className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-[2rem] font-black text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
            >
              {t.hero.ctaSecondary}
            </Link>
          </motion.div>

          {/* Trusted By (Global Universities) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1 }}
            className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800"
          >
            <p className="text-xs font-black uppercase tracking-[0.5em] mb-8 text-gray-400">Supporting Students From</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 grayscale opacity-70">
              {['OXFORD', 'STANFORD', 'NUST', 'UET', 'MONASH', 'LUMS'].map(uni => (
                <span key={uni} className="font-black text-2xl tracking-tighter">{uni}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-10 bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/20 dark:shadow-none text-center group hover:border-purple-500/30 transition-all"
            >
              <stat.icon size={32} className="mx-auto mb-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">How It Works</h2>
          <p className="text-gray-500 font-medium">Simple. Transparent. Professional.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900/50 to-transparent -z-10"></div>
          {[
            { step: '01', title: 'Request', desc: 'Submit your requirements and files securely.' },
            { step: '02', title: 'Analyze', desc: 'Experts review and provide a custom quote.' },
            { step: '03', title: 'Execute', desc: 'Specialized experts work on your task.' },
            { step: '04', title: 'Deliver', desc: 'Receive high-quality work with full support.' },
          ].map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative"
            >
              <div className="text-5xl font-black text-purple-600/10 absolute top-4 right-6">{item.step}</div>
              <h3 className="text-xl font-black mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Our Expertise</h2>
          <p className="text-gray-500 font-medium">Standardized support for all academic levels.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-10 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:shadow-3xl hover:shadow-purple-500/10 transition-all relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${service.color} flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{service.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                <Link href="/submit" className="text-xs font-black uppercase tracking-widest text-purple-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Request Support <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-900 py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">Global Student Stories</h2>
            <p className="text-gray-400 font-medium">Real feedback from students at top institutions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black">{t.avatar}</div>
                  <div>
                    <h4 className="font-black text-white">{t.name}</h4>
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{t.uni}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic leading-relaxed">"{t.content}"</p>
                <div className="flex gap-1 mt-6">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-yellow-500 text-yellow-500" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-3xl shadow-purple-500/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -ml-48 -mb-48"></div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 relative tracking-tighter leading-[0.9]">{t.cta.title}</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 relative font-medium">
            {t.cta.subtitle}
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/submit" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-gray-900 rounded-[2rem] font-black text-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
            >
              {t.cta.button} <ArrowRight size={24} />
            </Link>
            <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-gray-400">
              <ShieldCheck className="text-green-500" /> Secure Payments
              <Laptop className="text-blue-500" /> Expert Quality
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
