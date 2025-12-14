'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertCircle, Clock, Search, UserPlus, ClipboardCheck, Mail } from 'lucide-react';

// Map of icon names to components (for Server → Client serialization)
const iconMap = {
  Search,
  UserPlus,
  ClipboardCheck,
  Mail,
} as const;

type IconName = keyof typeof iconMap;

interface StageCardProps {
  title: string;
  description: string;
  href: string;
  iconName: IconName;
  stats?: {
    label: string;
    value: number | string;
  }[];
  status?: 'ready' | 'action-needed' | 'complete';
  statusLabel?: string;
}

export default function StageCard({
  title,
  description,
  href,
  iconName,
  stats = [],
  status = 'ready',
  statusLabel,
}: StageCardProps) {
  const Icon = iconMap[iconName];
  const statusConfig = {
    ready: {
      bg: 'bg-neutral-900',
      border: 'border-neutral-800',
      badge: 'bg-neutral-800 text-neutral-400',
      icon: Clock,
    },
    'action-needed': {
      bg: 'bg-orange-900/10',
      border: 'border-orange-800/30',
      badge: 'bg-orange-900/30 text-orange-400',
      icon: AlertCircle,
    },
    complete: {
      bg: 'bg-green-900/10',
      border: 'border-green-800/30',
      badge: 'bg-green-900/30 text-green-400',
      icon: CheckCircle,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Link
      href={href}
      className={`block ${config.bg} rounded-xl border ${config.border} p-6 hover:border-blue-600/50 transition-all group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-blue-600/20`}>
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        {statusLabel && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.badge}`}>
            <StatusIcon className="w-3 h-3" />
            {statusLabel}
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm mb-4">{description}</p>

      {stats.length > 0 && (
        <div className="flex items-center gap-4 mb-4 pt-4 border-t border-neutral-800">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
        Open Tool
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
