'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PipelineNav from '@/components/pipeline/PipelineNav';
import EmailPreview from '@/components/pipeline/EmailPreview';
import { getEmailableLeads, markAsEmailed } from '@/app/actions';
import { generateEmailSequence, generateInstantlyCSV, EmailSequence } from '@/lib/emailTemplates';
import { Lead } from '@/lib/google';
import { Download, Mail, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function OutreachPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    async function loadLeads() {
      const emailable = await getEmailableLeads();
      setLeads(emailable);
      setSequences(emailable.map(lead => generateEmailSequence(lead)));
      setSelectedRows(new Set(emailable.map(l => l.rowNumber)));
      setLoading(false);
    }
    loadLeads();
  }, []);

  const toggleSelect = (rowNumber: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowNumber)) {
      newSelected.delete(rowNumber);
    } else {
      newSelected.add(rowNumber);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === leads.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(leads.map(l => l.rowNumber)));
    }
  };

  const handleExport = () => {
    const selectedSequences = sequences.filter(s => selectedRows.has(s.lead.rowNumber));
    const csv = generateInstantlyCSV(selectedSequences);

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instantly-sequences-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
  };

  const handleMarkEmailed = async () => {
    setMarking(true);
    try {
      const rowNumbers = Array.from(selectedRows);
      await markAsEmailed(rowNumbers);

      // Remove marked leads from list
      setLeads(leads.filter(l => !selectedRows.has(l.rowNumber)));
      setSequences(sequences.filter(s => !selectedRows.has(s.lead.rowNumber)));
      setSelectedRows(new Set());
      setExported(false);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Generate Outreach</h1>
            <p className="text-neutral-400 mt-1">
              Preview email sequences and export for Instantly.ai
            </p>
          </div>

          {/* Pipeline Navigation */}
          <PipelineNav />

          {leads.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
              <Mail className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No leads ready for outreach</h2>
              <p className="text-neutral-400 mb-6">
                All leads have either been emailed or need enrichment first.
              </p>
              <a
                href="/pipeline/enrich"
                className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Enrich More Leads
              </a>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="flex items-center justify-between bg-neutral-900 rounded-xl border border-neutral-800 p-4 mb-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === leads.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-neutral-600 bg-neutral-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-white">
                      {selectedRows.size} of {leads.length} selected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExport}
                    disabled={selectedRows.size === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  {exported && (
                    <button
                      onClick={handleMarkEmailed}
                      disabled={marking}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                    >
                      {marking ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Mark as Emailed
                    </button>
                  )}
                </div>
              </div>

              {/* Export Notice */}
              {exported && (
                <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">CSV exported successfully!</p>
                    <p className="text-neutral-400 text-sm">
                      Import the file into Instantly.ai, then click &quot;Mark as Emailed&quot; to update the CRM.
                    </p>
                  </div>
                </div>
              )}

              {/* Quality Warning */}
              {sequences.some(s =>
                !s.email1.subject || s.email1.subject.includes('[') ||
                !s.lead.aiOpeningHook || s.lead.aiOpeningHook.includes('help you')
              ) && (
                <div className="bg-orange-900/20 border border-orange-800/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-orange-400 font-medium">Some leads have generic content</p>
                    <p className="text-neutral-400 text-sm">
                      Review the email previews below. Consider enriching leads with templated subject lines or hooks.
                    </p>
                  </div>
                </div>
              )}

              {/* Email Previews */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sequences.map(sequence => (
                  <EmailPreview
                    key={sequence.lead.rowNumber}
                    sequence={sequence}
                    selected={selectedRows.has(sequence.lead.rowNumber)}
                    onToggle={() => toggleSelect(sequence.lead.rowNumber)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
