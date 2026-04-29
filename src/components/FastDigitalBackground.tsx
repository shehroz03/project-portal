'use client';
import { GraduationCap, Book, Code2, Globe, FileText, BrainCircuit, School } from 'lucide-react';

export default function FastDigitalBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#000205]">
      {/* 1. SHARP BINARY RAIN (Visible 0101) */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute top-0 text-[10px] font-mono text-purple-600/60 whitespace-nowrap animate-matrix-rain select-none"
            style={{
              left: `${i * 2}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              writingMode: 'vertical-rl',
            }}
          >
            {Array(100).fill(0).map(() => (Math.random() > 0.5 ? '1' : '0')).join('')}
          </div>
        ))}
      </div>

      {/* 2. PROMINENT ACADEMIC NODES (Graduation Caps, Books, Brains) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
         {[
           { icon: GraduationCap, color: 'text-purple-400' },
           { icon: Book, color: 'text-blue-400' },
           { icon: Code2, color: 'text-cyan-400' },
           { icon: Globe, color: 'text-purple-500' },
           { icon: FileText, color: 'text-blue-500' },
           { icon: BrainCircuit, color: 'text-purple-300' },
           { icon: School, color: 'text-cyan-300' },
           { icon: GraduationCap, color: 'text-purple-400' },
           { icon: Book, color: 'text-blue-400' },
         ].map((item, i) => (
           <div
             key={i}
             className={`absolute ${item.color} animate-float-icon drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]`}
             style={{
               top: `${15 + (i * 10) % 70}%`,
               left: `${10 + (i * 15) % 80}%`,
               animationDuration: `${12 + Math.random() * 8}s`,
               animationDelay: `${i * 1.5}s`,
             }}
           >
             <item.icon size={35 + Math.random() * 20} strokeWidth={1.2} />
           </div>
         ))}
      </div>

      {/* 3. ATMOSPHERIC SCAN & GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-scan-line"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_70%)]"></div>
      
      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes float-icon {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(60px, -100px) rotate(20deg); opacity: 0; }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-matrix-rain {
          animation: matrix-rain linear infinite;
        }
        .animate-float-icon {
          animation: float-icon linear infinite;
        }
        .animate-scan-line {
          animation: scan-line 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
