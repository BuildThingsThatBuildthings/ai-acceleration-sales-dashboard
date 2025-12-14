'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface QualityIssue {
  rowNumber: number;
  company: string;
  type: 'name' | 'email' | 'subject' | 'hook' | 'aggregator' | 'phone';
  severity: 'critical' | 'high' | 'medium';
  message: string;
  field: string;
  value: string;
}

interface IssueListProps {
  issues: QualityIssue[];
  maxDisplay?: number;
}

export default function IssueList({ issues, maxDisplay = 50 }: IssueListProps) {
  const [expanded, setExpanded] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const severityConfig = {
    critical: {
      bg: 'bg-red-900/20',
      border: 'border-red-800/30',
      text: 'text-red-400',
      icon: AlertCircle,
      label: 'Critical',
    },
    high: {
      bg: 'bg-orange-900/20',
      border: 'border-orange-800/30',
      text: 'text-orange-400',
      icon: AlertTriangle,
      label: 'High',
    },
    medium: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-800/30',
      text: 'text-yellow-400',
      icon: Info,
      label: 'Medium',
    },
  };

  // Count by severity
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const highCount = issues.filter(i => i.severity === 'high').length;
  const mediumCount = issues.filter(i => i.severity === 'medium').length;

  // Filter issues
  let filteredIssues = issues;
  if (filterSeverity) {
    filteredIssues = filteredIssues.filter(i => i.severity === filterSeverity);
  }
  if (filterType) {
    filteredIssues = filteredIssues.filter(i => i.type === filterType);
  }

  const displayIssues = expanded ? filteredIssues : filteredIssues.slice(0, maxDisplay);
  const hasMore = filteredIssues.length > maxDisplay;

  // Get unique types for filter
  const types = [...new Set(issues.map(i => i.type))];

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Data Quality Issues
            <span className="text-neutral-500 text-sm font-normal ml-2">
              ({issues.length} total)
            </span>
          </h3>

          {/* Severity summary pills */}
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <button
                onClick={() => setFilterSeverity(filterSeverity === 'critical' ? null : 'critical')}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  filterSeverity === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                }`}
              >
                {criticalCount} Critical
              </button>
            )}
            {highCount > 0 && (
              <button
                onClick={() => setFilterSeverity(filterSeverity === 'high' ? null : 'high')}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  filterSeverity === 'high'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-900/30 text-orange-400 hover:bg-orange-900/50'
                }`}
              >
                {highCount} High
              </button>
            )}
            {mediumCount > 0 && (
              <button
                onClick={() => setFilterSeverity(filterSeverity === 'medium' ? null : 'medium')}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  filterSeverity === 'medium'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50'
                }`}
              >
                {mediumCount} Medium
              </button>
            )}
          </div>
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-neutral-500 text-sm">Filter:</span>
          <button
            onClick={() => setFilterType(null)}
            className={`px-2 py-1 rounded text-xs ${
              filterType === null
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
            }`}
          >
            All
          </button>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={`px-2 py-1 rounded text-xs capitalize ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Issue list */}
      <div className="divide-y divide-neutral-800 max-h-96 overflow-y-auto">
        {displayIssues.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            {issues.length === 0 ? 'No issues found - data quality is excellent!' : 'No issues match the current filter'}
          </div>
        ) : (
          displayIssues.map((issue, index) => {
            const config = severityConfig[issue.severity];
            const Icon = config.icon;

            return (
              <div
                key={`${issue.rowNumber}-${issue.type}-${index}`}
                className="p-3 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                      <span className="text-neutral-400 text-sm font-medium truncate">
                        {issue.company}
                      </span>
                      <Link
                        href={`/leads/${issue.rowNumber}`}
                        className="text-blue-500 hover:text-blue-400 text-xs flex items-center gap-1"
                      >
                        Row {issue.rowNumber}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <p className="text-white text-sm mt-1">{issue.message}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-neutral-500 text-xs">{issue.field}:</span>
                      <span className="text-neutral-400 text-xs font-mono truncate max-w-md">
                        {issue.value || '(empty)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show more button */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-3 text-center text-blue-400 hover:text-blue-300 hover:bg-neutral-800/50 transition-colors flex items-center justify-center gap-2 border-t border-neutral-800"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show {filteredIssues.length - maxDisplay} More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
