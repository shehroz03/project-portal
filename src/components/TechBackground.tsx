'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const CODE_LINES = [
  'import { studentData } from "./academic";',
  'const assignment = new Assignment("CS504");',
  'assignment.addDocumentation(thesis);',
  'if (deadline.approaching()) {',
  '  prioritize(task);',
  '  optimizeResources();',
  '}',
  '// Starting Final Year Project build...',
  'buildProject({ type: "Web App", tech: "Next.js" });',
  'deployToCloud("bst-platform-v2");',
];

export default function TechBackground() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const removeDevBadge = () => {
      // Direct DOM
      const badges = document.querySelectorAll('next-js-internal-feedback-indicator');
      badges.forEach(b => (b as HTMLElement).style.setProperty('display', 'none', 'important'));

      // Shadow DOM search
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.shadowRoot) {
          const indicator = el.shadowRoot.querySelector('.nextjs-static-indicator, [data-nextjs-toast]');
          if (indicator) (indicator as HTMLElement).style.setProperty('display', 'none', 'important');
        }
      });
    };

    const interval = setInterval(removeDevBadge, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // For Dashboard and Orders, we want a very subtle dark theme
  const isDashboard = pathname === '/dashboard' || pathname?.startsWith('/orders');

  if (isDashboard) {
    return (
      <div className="fixed inset-0 -z-50 bg-[#010409] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
        
        {/* Very subtle floating papers */}
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white dark:bg-slate-900 border border-slate-800 p-4 rounded-lg animate-float-paper"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${10 + Math.random() * 80}%`,
                width: '120px',
                height: '160px',
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                animationDuration: `${20 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * -20}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Home Page
  if (pathname === '/') {
    return (
      <div className="fixed inset-0 -z-50 bg-[#020617] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:64px_64px] opacity-10"></div>
        <div className="absolute inset-0 flex justify-around gap-4 opacity-[0.08] px-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 font-mono text-[9px] overflow-hidden border border-slate-800/30 bg-slate-900/40 p-3 rounded-2xl ${i > 0 ? 'hidden md:block' : ''}`}
            >
              <div className="space-y-1 animate-terminal-scroll" style={{ animationDuration: `${25 + i * 5}s` }}>
                {[...Array(30)].map((_, idx) => (
                  <div key={idx} className="flex gap-2 text-slate-600">
                    <span className="text-slate-800 w-3">{idx + 1}</span>
                    <span>{CODE_LINES[idx % CODE_LINES.length]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default for Auth pages and others
  return (
    <div className="fixed inset-0 -z-50 bg-[#020617] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]"></div>
    </div>
  );
}
