'use client';

import { Search, X, ChevronDown } from 'lucide-react';
import { PIPELINE_STAGES } from '@/lib/constants';

export interface FilterState {
  search: string;
  status: string;
  state: string;
  pipelineStage: string;
  sort: string;
}

interface LeadFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
  availableStates: string[];
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Leads' },
  { value: 'Lead', label: 'New to Call' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Booked', label: 'Booked' },
  { value: 'Not Interested', label: 'Not Interested' },
  { value: 'Bad Data', label: 'Bad Data' },
];

const SORT_OPTIONS = [
  { value: 'row', label: 'Recent First' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'company', label: 'Company' },
];

export default function LeadFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  availableStates,
}: LeadFiltersProps) {
  const hasFilters = filters.search || filters.status || filters.state || filters.pipelineStage;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      state: '',
      pipelineStage: '',
      sort: 'row',
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          type="text"
          placeholder="Search leads by name, company, or email..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        />
        {filters.search && (
          <button
            onClick={() => onFiltersChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="appearance-none bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>

        {/* State Filter */}
        <div className="relative">
          <select
            value={filters.state}
            onChange={(e) => onFiltersChange({ ...filters, state: e.target.value })}
            className="appearance-none bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="">All States</option>
            {availableStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>

        {/* Pipeline Stage Filter */}
        <div className="relative">
          <select
            value={filters.pipelineStage}
            onChange={(e) => onFiltersChange({ ...filters, pipelineStage: e.target.value })}
            className="appearance-none bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="">All Pipeline</option>
            {PIPELINE_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value })}
            className="appearance-none bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-neutral-400 hover:text-white px-3 py-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-neutral-500">
          {filteredCount === totalCount ? (
            <span>{totalCount} leads</span>
          ) : (
            <span>
              <span className="text-white font-medium">{filteredCount}</span> of {totalCount} leads
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Export filter logic for use in parent
export function filterLeads(leads: any[], filters: FilterState) {
  let filtered = [...leads];

  // Search filter
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(search) ||
        lead.company?.toLowerCase().includes(search) ||
        lead.email?.toLowerCase().includes(search) ||
        lead.city?.toLowerCase().includes(search)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((lead) => {
      const leadStatus = lead.status || 'Lead';
      return leadStatus === filters.status;
    });
  }

  // State filter
  if (filters.state) {
    filtered = filtered.filter((lead) => lead.state === filters.state);
  }

  // Pipeline stage filter
  if (filters.pipelineStage) {
    filtered = filtered.filter((lead) => {
      const leadStage = lead.pipelineStage || 'First Contact';
      return leadStage === filters.pipelineStage;
    });
  }

  // Sort
  switch (filters.sort) {
    case 'name-asc':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'name-desc':
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'company':
      filtered.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
      break;
    case 'status':
      const statusOrder = ['Lead', 'Contacted', 'Booked', 'Not Interested', 'Bad Data'];
      filtered.sort((a, b) => {
        const aStatus = a.status || 'Lead';
        const bStatus = b.status || 'Lead';
        return statusOrder.indexOf(aStatus) - statusOrder.indexOf(bStatus);
      });
      break;
    case 'row':
    default:
      // Keep original row order
      break;
  }

  return filtered;
}

export function getAvailableStates(leads: any[]): string[] {
  const states = new Set<string>();
  leads.forEach((lead) => {
    if (lead.state) {
      states.add(lead.state);
    }
  });
  return Array.from(states).sort();
}
