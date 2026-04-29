'use client';
import { useState } from 'react';
import { Lightbulb, Code2, Globe, Smartphone, Brain, Database, Tag, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'all', label: 'All Ideas', icon: Lightbulb },
  { id: 'web', label: 'Web Dev', icon: Globe },
  { id: 'app', label: 'Mobile Apps', icon: Smartphone },
  { id: 'ai', label: 'AI/ML', icon: Brain },
  { id: 'data', label: 'Data Science', icon: Database },
];

const DEMO_PROJECTS = [
  { id: 1, title: 'Smart Agriculture IoT System', category: 'ai', desc: 'A system to monitor soil moisture and automate irrigation using sensors.', tags: ['IoT', 'Arduino', 'Python'] },
  { id: 2, title: 'Blockchain Based Voting App', category: 'web', desc: 'Secure and transparent voting platform using Ethereum smart contracts.', tags: ['Solidity', 'Next.js', 'Web3'] },
  { id: 3, title: 'AI Health Diagnostic Assistant', category: 'ai', desc: 'Deep learning model to predict diseases based on user symptoms.', tags: ['Python', 'TensorFlow', 'React Native'] },
  { id: 4, title: 'E-Commerce with AR Features', category: 'app', desc: 'Shop app where users can visualize products in their room using AR.', tags: ['Flutter', 'Firebase', 'ARCore'] },
  { id: 5, title: 'Real-time Traffic Management', category: 'data', desc: 'Analyzing city traffic patterns to optimize signal timings.', tags: ['Data Mining', 'Java', 'OpenCV'] },
  { id: 6, title: 'Personal Finance Dashboard', category: 'web', desc: 'AI-powered expense tracker with automated budgeting tips.', tags: ['React', 'Node.js', 'MongoDB'] },
];

export default function IdeasPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = DEMO_PROJECTS.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Project Ideas Marketplace</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Browse through our curated list of innovative Final Year Project (FYP) ideas to kickstart your academic success.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search ideas..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap font-bold transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                }`}
              >
                <cat.icon size={18} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:shadow-purple-500/5 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                  <Tag size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{project.category}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors leading-tight">
                {project.title}
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-500">{tag}</span>
                ))}
              </div>

              <Link 
                href="/submit" 
                className="w-full py-4 bg-gray-50 dark:bg-gray-800 group-hover:bg-purple-600 group-hover:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                Order This Project <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <Lightbulb size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No matching ideas found.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
