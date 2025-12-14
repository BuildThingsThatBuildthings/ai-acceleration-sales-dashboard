'use client';

import { Menu, Zap } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-neutral-300" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-5 h-5 text-blue-500 fill-current" />
          <span className="font-bold text-sm text-white">
            Acceleration<span className="text-blue-500">AI</span>
          </span>
        </div>

        {/* Spacer for centering */}
        <div className="w-10" />
      </div>
    </header>
  );
}
