'use client';

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  target?: number;
  suffix?: string;
  description?: string;
  inverted?: boolean; // true if lower is better (e.g., duplicate count)
}

export default function MetricCard({
  title,
  value,
  target,
  suffix = '',
  description,
  inverted = false,
}: MetricCardProps) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  // Determine status
  const getStatus = () => {
    if (target === undefined) return 'neutral';
    if (inverted) {
      // Lower is better (e.g., 0 duplicates is best)
      if (numValue <= target) return 'pass';
      if (numValue <= target * 2) return 'warning';
      return 'fail';
    } else {
      // Higher is better (e.g., 100% completeness)
      if (numValue >= target) return 'pass';
      if (numValue >= target * 0.7) return 'warning';
      return 'fail';
    }
  };

  const status = getStatus();

  const statusStyles = {
    pass: {
      bg: 'bg-green-900/20',
      border: 'border-green-800/30',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-800/30',
      text: 'text-yellow-400',
      icon: AlertTriangle,
    },
    fail: {
      bg: 'bg-red-900/20',
      border: 'border-red-800/30',
      text: 'text-red-400',
      icon: XCircle,
    },
    neutral: {
      bg: 'bg-neutral-900',
      border: 'border-neutral-800',
      text: 'text-neutral-400',
      icon: null,
    },
  };

  const style = statusStyles[status];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} rounded-xl p-4 border ${style.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-400 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-bold ${style.text}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {suffix && <span className="text-neutral-500 text-sm">{suffix}</span>}
          </div>
          {description && (
            <p className="text-neutral-500 text-xs mt-1">{description}</p>
          )}
          {target !== undefined && (
            <p className="text-neutral-600 text-xs mt-1">
              Target: {inverted ? `< ${target}` : `${target}${suffix}`}
            </p>
          )}
        </div>
        {Icon && (
          <Icon className={`w-5 h-5 ${style.text}`} />
        )}
      </div>
    </div>
  );
}
