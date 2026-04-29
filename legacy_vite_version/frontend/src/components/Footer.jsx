import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">
              BoardSolutionTech
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/ideas" className="hover:text-[var(--color-primary)] transition-colors">Ideas</Link>
            <Link to="/submit" className="hover:text-[var(--color-primary)] transition-colors">Submit Request</Link>
            <Link to="/dashboard" className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} BSt · Academic Guidance Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
