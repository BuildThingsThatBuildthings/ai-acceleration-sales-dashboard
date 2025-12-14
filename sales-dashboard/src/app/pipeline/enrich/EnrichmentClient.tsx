'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lead } from '@/lib/google';
import { saveEnrichment } from '@/app/actions';
import EnrichmentForm from '@/components/pipeline/EnrichmentForm';
import SearchHelpers from '@/components/pipeline/SearchHelpers';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface EnrichmentClientProps {
  initialLeads: Lead[];
}

export default function EnrichmentClient({ initialLeads }: EnrichmentClientProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const currentLead = leads[currentIndex];
  const totalLeads = leads.length;
  const progress = totalLeads > 0 ? ((completedCount / totalLeads) * 100).toFixed(0) : 0;

  const handleSave = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    aiSubjectLine: string;
    aiOpeningHook: string;
  }) => {
    await saveEnrichment(currentLead.rowNumber, data);

    // Remove this lead from the list and move to next
    const newLeads = leads.filter((_, i) => i !== currentIndex);
    setLeads(newLeads);
    setCompletedCount(c => c + 1);

    if (newLeads.length === 0) {
      // All done!
      router.push('/pipeline/review');
    } else if (currentIndex >= newLeads.length) {
      // Was at last item, go to new last
      setCurrentIndex(newLeads.length - 1);
    }
    // Otherwise stay at same index (next lead slides in)
  };

  const handleSkip = () => {
    if (currentIndex < leads.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (leads.length > 1) {
      setCurrentIndex(0); // Wrap around
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < leads.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentLead) {
    return (
      <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">All done!</h2>
        <p className="text-neutral-400 mb-6">
          You&apos;ve enriched all the leads in your queue.
        </p>
        <a
          href="/pipeline/review"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          Review Quality
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6 bg-neutral-900 rounded-xl border border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">
              {leads.length} leads need enrichment
            </span>
          </div>
          <span className="text-neutral-400 text-sm">
            {completedCount} completed this session
          </span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-neutral-400">
          Lead {currentIndex + 1} of {leads.length}
        </span>
        <button
          onClick={goToNext}
          disabled={currentIndex === leads.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content: Form + Search Helpers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form - 2/3 width */}
        <div className="lg:col-span-2">
          <EnrichmentForm
            key={currentLead.rowNumber}
            lead={currentLead}
            onSave={handleSave}
            onSkip={handleSkip}
          />
        </div>

        {/* Search Helpers - 1/3 width */}
        <div className="space-y-4">
          <SearchHelpers
            company={currentLead.company}
            city={currentLead.city}
            state={currentLead.state}
            website={currentLead.website}
          />

          {/* Quick Stats */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <h4 className="text-white font-medium mb-3">Lead Details</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Company</dt>
                <dd className="text-white">{currentLead.officialCompany || currentLead.company}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Current Name</dt>
                <dd className="text-white">{currentLead.name || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Current Email</dt>
                <dd className="text-white font-mono text-xs">{currentLead.email || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Current Phone</dt>
                <dd className="text-white font-mono text-xs">{currentLead.phone || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Status</dt>
                <dd className="text-white">{currentLead.status}</dd>
              </div>
            </dl>
          </div>

          {/* Tips */}
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-medium mb-2">Research Tips</h4>
            <ul className="text-neutral-400 text-sm space-y-2">
              <li>• Check About/Team pages for decision makers</li>
              <li>• Look for recent news, awards, or milestones</li>
              <li>• Find specific facts: sales volume, agent count, years</li>
              <li>• Personal email &gt; generic (info@)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
