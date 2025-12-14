'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, UserPlus, ClipboardCheck, Mail, LayoutGrid } from 'lucide-react';

const pipelineStages = [
  { name: 'Overview', href: '/pipeline', icon: LayoutGrid },
  { name: 'Import', href: '/pipeline/scrape', icon: Search },
  { name: 'Enrich', href: '/pipeline/enrich', icon: UserPlus },
  { name: 'Review', href: '/pipeline/review', icon: ClipboardCheck },
  { name: 'Outreach', href: '/pipeline/outreach', icon: Mail },
];

export default function PipelineNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 mb-6">
      {pipelineStages.map((stage) => {
        const isActive = pathname === stage.href;

        return (
          <Link
            key={stage.href}
            href={stage.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <stage.icon className="w-4 h-4" />
            {stage.name}
          </Link>
        );
      })}
    </nav>
  );
}
