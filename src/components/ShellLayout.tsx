'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Globe, Activity, ChevronRight } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/country/India', label: 'India', icon: Globe, flag: '🇮🇳' },
  { href: '/country/USA', label: 'USA', icon: Globe, flag: '🇺🇸' },
  { href: '/country/China', label: 'China', icon: Globe, flag: '🇨🇳' },
  { href: '/country/Russia', label: 'Russia', icon: Globe, flag: '🇷🇺' },
  { href: '/simulation', label: 'Simulation Lab', icon: Activity },
];

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1117] text-[#f0f6fc]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col border-r border-white/8 bg-[#0d1117]/90 backdrop-blur-md">
        <div className="p-6 pb-4 border-b border-white/8">
          <div className="text-xs font-mono text-accentBlue mb-1 tracking-widest">INDIA INTEL GRAPH</div>
          <h1 className="text-base font-bold leading-tight">
            Mini Global<br />
            <span className="bg-[linear-gradient(90deg,#58a6ff,#a371f7)] bg-clip-text text-transparent">
              Intelligence Graph
            </span>
          </h1>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-statusSuccess animate-pulse" />
            <span className="text-[10px] text-[#8b949e]">System Active</span>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          <div className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-widest px-3 py-2">Navigation</div>
          {NAV.slice(0, 1).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accentBlue/15 text-accentBlue border border-accentBlue/30'
                    : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/5'
                }`}>
                  <Icon size={15} />
                  {item.label}
                  {isActive && <ChevronRight size={12} className="ml-auto" />}
                </div>
              </Link>
            );
          })}

          <div className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-widest px-3 py-2 mt-2">Countries</div>
          {NAV.slice(1, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accentBlue/15 text-accentBlue border border-accentBlue/30'
                    : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/5'
                }`}>
                  <span className="text-base">{item.flag}</span>
                  {item.label}
                  {isActive && <ChevronRight size={12} className="ml-auto" />}
                </div>
              </Link>
            );
          })}

          <div className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-widest px-3 py-2 mt-2">Analysis</div>
          {NAV.slice(5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accentBlue/15 text-accentBlue border border-accentBlue/30'
                    : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/5'
                }`}>
                  <Icon size={15} />
                  {item.label}
                  {isActive && <ChevronRight size={12} className="ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/8">
          <div className="text-[10px] text-[#8b949e] text-center">India Innovates 2026 · Hackathon MVP</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">

        {/* Page content */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className=""
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
