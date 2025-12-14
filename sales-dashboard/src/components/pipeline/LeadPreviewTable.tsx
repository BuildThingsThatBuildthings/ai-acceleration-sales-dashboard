'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { FilteredLead } from '@/lib/filterLeads';

interface LeadPreviewTableProps {
  leads: FilteredLead[];
  filtered?: Array<{ lead: unknown; reason: string }>;
  onSelect?: (leads: FilteredLead[]) => void;
  showFiltered?: boolean;
}

export default function LeadPreviewTable({
  leads,
  filtered = [],
  onSelect,
  showFiltered = true,
}: LeadPreviewTableProps) {
  const [selectedAll, setSelectedAll] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(
    new Set(leads.map((_, i) => i))
  );
  const [showFilteredList, setShowFilteredList] = useState(false);

  const toggleSelectAll = () => {
    if (selectedAll) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map((_, i) => i)));
    }
    setSelectedAll(!selectedAll);
  };

  const toggleSelect = (index: number) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLeads(newSelected);
    setSelectedAll(newSelected.size === leads.length);
  };

  const handleImport = () => {
    if (onSelect) {
      const selected = leads.filter((_, i) => selectedLeads.has(i));
      onSelect(selected);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center justify-between bg-neutral-900 rounded-lg p-4 border border-neutral-800">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">{leads.length}</span>
            <span className="text-neutral-400">clean leads</span>
          </div>
          {filtered.length > 0 && (
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">{filtered.length}</span>
              <span className="text-neutral-400">filtered out</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-sm">
            {selectedLeads.size} selected
          </span>
          {onSelect && (
            <button
              onClick={handleImport}
              disabled={selectedLeads.size === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Import Selected
            </button>
          )}
        </div>
      </div>

      {/* Clean Leads Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAll}
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-600 bg-neutral-700 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-neutral-400 text-sm font-medium">Business Name</th>
                <th className="px-4 py-3 text-left text-neutral-400 text-sm font-medium">Location</th>
                <th className="px-4 py-3 text-left text-neutral-400 text-sm font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-neutral-400 text-sm font-medium">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {leads.map((lead, index) => (
                <tr
                  key={index}
                  className={`hover:bg-neutral-800/50 transition-colors ${
                    selectedLeads.has(index) ? 'bg-blue-900/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(index)}
                      onChange={() => toggleSelect(index)}
                      className="rounded border-neutral-600 bg-neutral-700 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{lead.businessName || '(No name)'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-neutral-400">
                      {[lead.city, lead.state].filter(Boolean).join(', ') || lead.address || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-neutral-400 font-mono text-sm">
                      {lead.phone || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {lead.website ? (
                      <a
                        href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                      >
                        {new URL(lead.website.startsWith('http') ? lead.website : `https://${lead.website}`).hostname.replace('www.', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length === 0 && (
          <div className="p-8 text-center text-neutral-500">
            No clean leads to display
          </div>
        )}
      </div>

      {/* Filtered Leads Section */}
      {showFiltered && filtered.length > 0 && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <button
            onClick={() => setShowFilteredList(!showFilteredList)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Filtered Out ({filtered.length})</span>
            </div>
            {showFilteredList ? (
              <ChevronUp className="w-5 h-5 text-neutral-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400" />
            )}
          </button>

          {showFilteredList && (
            <div className="border-t border-neutral-800 max-h-64 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-neutral-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-neutral-400 text-sm font-medium">Name/URL</th>
                    <th className="px-4 py-2 text-left text-neutral-400 text-sm font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filtered.map((item, index) => {
                    const lead = item.lead as Record<string, string>;
                    return (
                      <tr key={index} className="text-sm">
                        <td className="px-4 py-2 text-neutral-400">
                          {lead.name || lead.business_name || lead.url || '(unknown)'}
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-red-400 text-xs bg-red-900/20 px-2 py-0.5 rounded">
                            {item.reason}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
