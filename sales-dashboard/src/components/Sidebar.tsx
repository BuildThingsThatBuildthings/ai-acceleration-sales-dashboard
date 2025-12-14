'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileText, Zap, Radio, Clock, LogOut, ShieldCheck, Workflow, CreditCard, ExternalLink } from 'lucide-react';
import { logout } from '@/app/actions';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Quality', href: '/quality', icon: ShieldCheck },
  { name: 'Pipeline', href: '/pipeline', icon: Workflow },
  { name: 'Follow-Ups', href: '/follow-ups', icon: Clock },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Guide', href: '/guide', icon: FileText },
];

export default function Sidebar({ followUpCount = 0 }: { followUpCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-surface-900 border-r border-surface-800/60 flex-col h-full shrink-0 z-50">
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Zap className="w-7 h-7 text-brand-500 fill-brand-500" />
            <div className="absolute inset-0 blur-md bg-brand-500/30" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">
              Acceleration<span className="text-brand-400">AI</span>
            </span>
            <p className="text-surface-500 text-[11px] font-mono tracking-wide">Northeast Tour</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const showBadge = item.href === '/follow-ups' && followUpCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-500 text-white shadow-glow-sm'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800/70'
              }`}
            >
              <item.icon
                className={`w-[18px] h-[18px] transition-colors ${
                  isActive ? 'text-white' : 'text-surface-500 group-hover:text-surface-300'
                }`}
              />
              <span className="tracking-tight">{item.name}</span>
              {showBadge && (
                <span className="ml-auto bg-emphasis-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-glow-red">
                  {followUpCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Payment Links */}
      <div className="px-3 pb-2">
        <div className="text-[10px] text-surface-500 uppercase tracking-wider font-medium mb-2 px-3">Checkout</div>
        <a
          href="https://buy.stripe.com/00w00k5wS1L1dEtamgbwk0F"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-surface-400 hover:text-white hover:bg-surface-800/70 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-green-500" />
            <span>6-Hour · $5,000</span>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <a
          href="https://buy.stripe.com/3cIeVe1gC3T97g5bqkbwk0G"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-surface-400 hover:text-white hover:bg-surface-800/70 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <span>3-Hour · $3,000</span>
          </div>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-3">
        {/* Live Status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-950/40 rounded-lg border border-green-900/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-green-400/90 font-medium tracking-wide">Live Data</span>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </form>

        {/* Version */}
        <div className="text-[10px] text-surface-600 text-center font-mono tracking-wider pt-1 border-t border-surface-800/50">
          v2.0.0 · Sheets API
        </div>
      </div>
    </aside>
  );
}
