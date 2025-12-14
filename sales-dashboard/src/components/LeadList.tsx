'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Phone, User, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import LeadFilters, { filterLeads, getAvailableStates, FilterState } from './LeadFilters';
import { Lead } from '@/lib/google';

const LEADS_PER_PAGE = 25;

interface LeadListProps {
  leads: Lead[];
}

export default function LeadList({ leads }: LeadListProps) {
  // Default to showing "New to Call" (status = Lead) leads
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'Lead',  // Default to new leads
    state: '',
    pipelineStage: '',
    sort: 'row',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const availableStates = useMemo(() => getAvailableStates(leads), [leads]);
  const filteredLeads = useMemo(() => filterLeads(leads, filters), [leads, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / LEADS_PER_PAGE);
  const startIndex = (currentPage - 1) * LEADS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + LEADS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <>
      <LeadFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
        availableStates={availableStates}
      />

      <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-surface-800/60 flex justify-between items-center">
          <h2 className="font-semibold flex items-center gap-2.5 text-white tracking-tight">
            <div className="p-1.5 bg-brand-500/10 rounded-lg">
              <User className="w-4 h-4 text-brand-400" />
            </div>
            {filters.status === 'Lead' ? 'New Leads to Call' : filters.status || 'All Leads'}
          </h2>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-surface-500 text-xs font-medium">
                {startIndex + 1}–{Math.min(startIndex + LEADS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-surface-800/60">
          {paginatedLeads.map((lead: Lead) => (
            <LeadRow key={lead.rowNumber} lead={lead} searchTerm={filters.search} />
          ))}

          {filteredLeads.length === 0 && leads.length > 0 && (
            <div className="p-8 md:p-12 text-center">
              <p className="text-base font-medium text-surface-400 mb-1">No leads match your filters</p>
              <p className="text-sm text-surface-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {leads.length === 0 && (
            <div className="p-8 md:p-16 text-center flex flex-col items-center">
              <div className="bg-surface-800 p-4 rounded-xl mb-4">
                <User className="w-8 h-8 text-surface-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Leads Found</h3>
              <p className="max-w-md mx-auto text-sm text-surface-500">
                Check your Google Sheets connection and make sure the CRM has data.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="p-3 md:p-4 border-t border-surface-800/60 flex justify-center items-center gap-1 md:gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="hidden sm:block px-3 py-2 rounded-lg text-sm bg-surface-800 hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] transition-colors"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 rounded-lg text-sm bg-surface-800 hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 sm:hidden" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="px-3 py-2 text-sm text-surface-500 font-medium whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 md:px-4 py-2 rounded-lg text-sm bg-surface-800 hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] transition-colors"
            >
              <ChevronRight className="w-5 h-5 sm:hidden" />
              <span className="hidden sm:inline">Next</span>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="hidden sm:block px-3 py-2 rounded-lg text-sm bg-surface-800 hover:bg-surface-700 disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] transition-colors"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function LeadRow({ lead, searchTerm }: { lead: Lead; searchTerm: string }) {
  // Highlight search matches
  const highlightMatch = (text: string | undefined) => {
    if (!text || !searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent-500/20 text-accent-300 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-3 md:p-4 hover:bg-surface-800/40 transition-colors flex items-center justify-between group">
      <Link
        href={`/leads/${lead.rowNumber}`}
        className="flex items-center gap-3 md:gap-4 flex-1 cursor-pointer min-w-0"
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-surface-800 border border-surface-700/50 flex items-center justify-center font-semibold text-surface-400 group-hover:text-white group-hover:border-brand-500/40 group-hover:bg-surface-700 transition-all shrink-0">
          {lead.name?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <h3 className="font-medium text-white group-hover:text-brand-400 transition-colors truncate max-w-[180px] sm:max-w-none">
              {highlightMatch(lead.name)}
            </h3>
            {(lead.city || lead.state) && (
              <span className="text-xs text-surface-500 hidden sm:flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {highlightMatch(lead.city)}
                {lead.city && lead.state ? ', ' : ''}
                {lead.state}
              </span>
            )}
          </div>
          <span className="text-sm text-surface-400 block truncate">{highlightMatch(lead.company)}</span>
          {lead.aiOpeningHook && (
            <div className="text-xs text-accent-500/80 mt-1 max-w-md truncate hidden md:block italic">
              "{lead.aiOpeningHook}"
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-4 lg:gap-6 shrink-0">
        <div className="hidden sm:flex flex-col items-end gap-1">
          <StatusBadge status={lead.status} />
          <PipelineBadge stage={lead.pipelineStage} />
        </div>
        <span className="text-sm text-surface-500 hidden xl:block w-40 text-right truncate font-mono text-xs">
          {highlightMatch(lead.email)}
        </span>

        <Link href={`/leads/${lead.rowNumber}`}>
          <button className="bg-brand-500 hover:bg-brand-400 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-glow-sm hover:shadow-glow group-hover:scale-[1.02] flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center">
            <Phone className="w-4 h-4" />
            <span className="hidden md:inline">Call</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Lead: 'bg-brand-900/20 text-brand-400 border-brand-800/40',
    New: 'bg-brand-900/20 text-brand-400 border-brand-800/40',
    Contacted: 'bg-purple-900/20 text-purple-400 border-purple-800/40',
    Booked: 'bg-green-900/20 text-green-400 border-green-800/40',
    'Not Interested': 'bg-surface-800 text-surface-500 border-surface-700',
    'Bad Data': 'bg-red-900/20 text-red-400 border-red-800/40',
  };

  const displayStatus = status || 'Lead';

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[displayStatus] || styles['Lead']}`}
    >
      {displayStatus}
    </span>
  );
}

function PipelineBadge({ stage }: { stage: string }) {
  const styles: Record<string, string> = {
    'First Contact': 'bg-surface-800 text-surface-400 border-surface-700',
    'Interested': 'bg-brand-900/20 text-brand-400 border-brand-800/40',
    'Demo Scheduled': 'bg-purple-900/20 text-purple-400 border-purple-800/40',
    'Negotiating': 'bg-accent-900/20 text-accent-400 border-accent-800/40',
    'Closed Won': 'bg-green-900/20 text-green-400 border-green-800/40',
    'Closed Lost': 'bg-red-900/20 text-red-400 border-red-800/40',
  };

  const displayStage = stage || 'First Contact';

  // Don't show badge for default stage to reduce visual noise
  if (!stage || stage === 'First Contact') {
    return null;
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${styles[displayStage] || styles['First Contact']}`}
    >
      {displayStage}
    </span>
  );
}
