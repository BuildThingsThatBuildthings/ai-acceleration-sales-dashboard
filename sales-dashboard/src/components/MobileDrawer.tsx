'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LayoutDashboard, BookOpen, FileText, Zap, Radio, Clock, LogOut, ShieldCheck, Workflow } from 'lucide-react';
import { logout } from '@/app/actions';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Quality', href: '/quality', icon: ShieldCheck },
  { name: 'Pipeline', href: '/pipeline', icon: Workflow },
  { name: 'Follow-Ups', href: '/follow-ups', icon: Clock },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Guide', href: '/guide', icon: FileText },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  followUpCount?: number;
}

export default function MobileDrawer({ isOpen, onClose, followUpCount = 0 }: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute left-0 top-0 bottom-0 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col animate-in slide-in-from-left duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500 fill-current" />
            <span className="font-bold text-lg text-white">
              Acceleration<span className="text-blue-500">AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-lg hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const showBadge = item.href === '/follow-ups' && followUpCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800 active:bg-neutral-700'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                {item.name}
                {showBadge && (
                  <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {followUpCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-900/20 rounded-xl border border-green-800/30">
            <Radio className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Live Data</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
          <div className="text-xs text-neutral-600 text-center pt-2">
            v2.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
