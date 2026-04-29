import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb, Code2, Globe, Smartphone, Brain, Database, Tag } from 'lucide-react';

const categoryIcons = {
  'Web Development': Globe,
  'AI / Machine Learning': Brain,
  'Mobile App': Smartphone,
  'Database': Database,
  'Other': Code2,
};

const categoryColors = {
  'Web Development': 'from-blue-500 to-cyan-500',
  'AI / Machine Learning': 'from-purple-500 to-pink-500',
  'Mobile App': 'from-green-500 to-teal-500',
  'Database': 'from-orange-500 to-amber-500',
  'Other': 'from-gray-500 to-slate-500',
};

const DEMO_PROJECTS = [
  { _id: '1', title: 'E-Commerce Website with React & Node.js', category: 'Web Development', description: 'A full-stack ecommerce platform with product management, cart, and user authentication.', price: 3500, isFree: false, features: ['React Frontend', 'Node.js Backend', 'MongoDB Database', 'Admin Panel'] },
  { _id: '2', title: 'Student Result Management System', category: 'Web Development', description: 'A complete system to manage student results, grades, and report cards for institutions.', price: 2500, isFree: false, features: ['Role-based Access', 'PDF Reports', 'Excel Export', 'Dashboard'] },
  { _id: '3', title: 'AI Chatbot using Python & OpenAI', category: 'AI / Machine Learning', description: 'An intelligent chatbot built using Python and OpenAI API for customer support use cases.', price: 0, isFree: true, features: ['NLP Processing', 'Context Memory', 'REST API', 'Web Interface'] },
  { _id: '4', title: 'Hospital Management System', category: 'Database', description: 'Comprehensive hospital management covering patient records, appointments, and billing.', price: 4000, isFree: false, features: ['Patient Management', 'Doctor Portal', 'Billing System', 'Reports'] },
  { _id: '5', title: 'Flutter Expense Tracker App', category: 'Mobile App', description: 'A beautiful Flutter app to track daily expenses, budgets, and financial goals.', price: 2000, isFree: false, features: ['Charts & Graphs', 'Categories', 'Monthly Reports', 'Cloud Sync'] },
  { _id: '6', title: 'Image Classification with CNN', category: 'AI / Machine Learning', description: 'Deep learning model using Convolutional Neural Networks to classify images with high accuracy.', price: 0, isFree: true, features: ['TensorFlow', 'Dataset Training', 'REST API', 'Web Demo'] },
];

export default function Ideas() {
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Web Development', 'AI / Machine Learning', 'Mobile App', 'Database', 'Other'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/projects');
        if (data.length > 0) setProjects(data);
      } catch {
        // Use demo data if backend not available
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
            <Lightbulb size={14} /> Project Ideas Marketplace
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Browse FYP Ideas</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Explore ready-made project ideas across multiple domains. Free and premium options available.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(project => {
              const Icon = categoryIcons[project.category] || Code2;
              const gradient = categoryColors[project.category] || 'from-gray-500 to-slate-500';
              return (
                <div key={project._id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      {project.isFree ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">FREE</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 flex items-center gap-1">
                          <Tag size={10} /> PKR {project.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">{project.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.features?.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{f}</span>
                      ))}
                    </div>
                    <button className={`w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity shadow-md`}>
                      {project.isFree ? 'View Details' : 'Order This Project'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
