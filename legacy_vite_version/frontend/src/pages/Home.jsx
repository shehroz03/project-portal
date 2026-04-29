import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, BookOpen, Lightbulb, FileText, Code2, CheckCircle, Clock, Users } from 'lucide-react';

const services = [
  { icon: BookOpen, title: 'Assignments', desc: 'Get expert guidance on any subject, any level.', color: 'from-purple-500 to-indigo-500' },
  { icon: Code2, title: 'Final Year Projects', desc: 'Complete FYP assistance — AI, Web, Mobile & more.', color: 'from-pink-500 to-rose-500' },
  { icon: FileText, title: 'Thesis & Research', desc: 'Professional thesis writing and research paper formatting.', color: 'from-orange-500 to-amber-500' },
  { icon: Lightbulb, title: 'Project Ideas', desc: 'Browse free and paid FYP ideas across all domains.', color: 'from-teal-500 to-cyan-500' },
];

const stats = [
  { icon: Users, value: '500+', label: 'Students Helped' },
  { icon: CheckCircle, value: '300+', label: 'Projects Delivered' },
  { icon: Clock, value: '24h', label: 'Avg Response Time' },
];

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute top-[-20%] left-[-5%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-5%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay:'1.5s'}}></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            Pakistan's #1 Academic Guidance Platform
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Your Academic{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">
              Success Partner
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Get expert guidance on Assignments, Final Year Projects, Thesis, and Research Documentation.
            Track your progress daily — all from one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/submit" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-1">
                Submit a Request <ArrowRight size={20} />
              </Link>
            ) : (
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-1">
                Get Started Free <ArrowRight size={20} />
              </Link>
            )}
            <Link to="/ideas" className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl shadow hover:shadow-md transition-all transform hover:-translate-y-1">
              <Lightbulb size={20} /> Browse Ideas
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
              <Icon className="mx-auto mb-3 text-[var(--color-primary)]" size={28} />
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What We Offer</h2>
            <p className="text-gray-500 dark:text-gray-400">Comprehensive academic assistance at every step</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center rounded-3xl p-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-purple-100 mb-8">Join hundreds of students who trust BSt for their academic journey.</p>
          <Link to={user ? '/submit' : '/signup'} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--color-primary)] font-bold rounded-xl hover:bg-purple-50 transition-all transform hover:-translate-y-1 shadow-lg">
            {user ? 'Submit a Request' : 'Create Free Account'} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
