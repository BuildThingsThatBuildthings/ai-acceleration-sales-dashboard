'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PipelineNav from '@/components/pipeline/PipelineNav';
import JsonUploader from '@/components/pipeline/JsonUploader';
import LeadPreviewTable from '@/components/pipeline/LeadPreviewTable';
import { filterLeads, parseLeadsJson, FilteredLead, FilterResult } from '@/lib/filterLeads';
import { importLeads } from '@/app/actions';
import { CheckCircle, AlertCircle, Loader2, FileJson } from 'lucide-react';

export default function ScrapePage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload');
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; duplicates: number } | null>(null);

  const handleUpload = (jsonString: string, fileName: string) => {
    try {
      const rawLeads = parseLeadsJson(jsonString);
      const result = filterLeads(rawLeads);
      setFilterResult(result);
      setStep('preview');
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse JSON');
    }
  };

  const handleImport = async (leads: FilteredLead[]) => {
    setStep('importing');
    setError(null);

    try {
      // Convert FilteredLead to NewLead format
      const newLeads = leads.map(lead => ({
        officialCompany: lead.businessName,
        website: lead.website,
        city: lead.city,
        state: lead.state,
        phone: lead.phone,
      }));

      const result = await importLeads(newLeads);

      if (result.errors.length > 0) {
        setError(result.errors.join(', '));
      }

      setImportResult({
        success: result.success,
        duplicates: result.duplicates,
      });
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
      setStep('preview');
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFilterResult(null);
    setImportResult(null);
    setError(null);
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Import Leads</h1>
            <p className="text-neutral-400 mt-1">
              Upload scraped leads from JSON, filter aggregators, and import to CRM
            </p>
          </div>

          {/* Pipeline Navigation */}
          <PipelineNav />

          {/* Step Indicator */}
          <div className="flex items-center gap-4 mb-8">
            {['Upload', 'Preview & Filter', 'Import'].map((label, index) => {
              const stepIndex = ['upload', 'preview', 'importing', 'done'].indexOf(step);
              const isActive = index <= stepIndex;
              const isCurrent = (index === 0 && step === 'upload') ||
                               (index === 1 && step === 'preview') ||
                               (index === 2 && (step === 'importing' || step === 'done'));

              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCurrent ? 'bg-blue-600 text-white' :
                    isActive ? 'bg-green-600 text-white' :
                    'bg-neutral-800 text-neutral-500'
                  }`}>
                    {isActive && index < stepIndex ? '✓' : index + 1}
                  </div>
                  <span className={isCurrent ? 'text-white' : 'text-neutral-500'}>{label}</span>
                  {index < 2 && <div className="w-8 h-0.5 bg-neutral-800" />}
                </div>
              );
            })}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-800/30 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Step: Upload */}
          {step === 'upload' && (
            <div className="max-w-2xl">
              <JsonUploader onUpload={handleUpload} />

              <div className="mt-8 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">How to get leads</h3>
                <ol className="space-y-3 text-neutral-400">
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">1</span>
                    <div>
                      <p>Run the scraper locally:</p>
                      <code className="block bg-neutral-800 rounded px-2 py-1 mt-1 text-sm font-mono text-green-400">
                        python execution/scrape_maps.py --city &quot;Louisville&quot; --state &quot;KY&quot;
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">2</span>
                    <div>
                      <p>Filter out aggregators:</p>
                      <code className="block bg-neutral-800 rounded px-2 py-1 mt-1 text-sm font-mono text-green-400">
                        python execution/filter_leads.py
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">3</span>
                    <div>
                      <p>Upload the output file:</p>
                      <code className="block bg-neutral-800 rounded px-2 py-1 mt-1 text-sm font-mono text-neutral-400">
                        .tmp/clean_leads.json
                      </code>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Step: Preview */}
          {step === 'preview' && filterResult && (
            <div>
              {/* Filter Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
                  <div className="text-2xl font-bold text-white">{filterResult.stats.total}</div>
                  <div className="text-neutral-500 text-sm">Total in file</div>
                </div>
                <div className="bg-green-900/20 rounded-xl border border-green-800/30 p-4">
                  <div className="text-2xl font-bold text-green-400">{filterResult.stats.kept}</div>
                  <div className="text-neutral-500 text-sm">Clean leads</div>
                </div>
                <div className="bg-red-900/20 rounded-xl border border-red-800/30 p-4">
                  <div className="text-2xl font-bold text-red-400">{filterResult.stats.aggregators}</div>
                  <div className="text-neutral-500 text-sm">Aggregators removed</div>
                </div>
                <div className="bg-orange-900/20 rounded-xl border border-orange-800/30 p-4">
                  <div className="text-2xl font-bold text-orange-400">{filterResult.stats.duplicates}</div>
                  <div className="text-neutral-500 text-sm">Duplicates removed</div>
                </div>
              </div>

              {/* Preview Table */}
              <LeadPreviewTable
                leads={filterResult.clean}
                filtered={filterResult.filtered}
                onSelect={handleImport}
              />

              {/* Actions */}
              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                >
                  Upload Different File
                </button>
              </div>
            </div>
          )}

          {/* Step: Importing */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-white text-lg">Importing leads to CRM...</p>
              <p className="text-neutral-500 text-sm mt-2">This may take a moment</p>
            </div>
          )}

          {/* Step: Done */}
          {step === 'done' && importResult && (
            <div className="max-w-lg mx-auto">
              <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Import Complete!</h2>
                <p className="text-neutral-400 mb-6">
                  Successfully imported {importResult.success} leads to CRM.
                  {importResult.duplicates > 0 && (
                    <span className="block text-orange-400 mt-1">
                      {importResult.duplicates} duplicates were skipped.
                    </span>
                  )}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                  >
                    Import More
                  </button>
                  <button
                    onClick={() => router.push('/pipeline/enrich')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Enrich Leads
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
