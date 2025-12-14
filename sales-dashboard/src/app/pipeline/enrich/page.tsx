import { getUnenrichedLeads, saveEnrichment } from '@/app/actions';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PipelineNav from '@/components/pipeline/PipelineNav';
import EnrichmentClient from './EnrichmentClient';

export const dynamic = 'force-dynamic';

export default async function EnrichPage() {
  const leads = await getUnenrichedLeads();

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Enrich Leads</h1>
            <p className="text-neutral-400 mt-1">
              Research decision makers and write personalized outreach
            </p>
          </div>

          {/* Pipeline Navigation */}
          <PipelineNav />

          {leads.length === 0 ? (
            <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">All leads enriched!</h2>
              <p className="text-neutral-400 mb-6">
                Every lead in your CRM has been researched and personalized.
              </p>
              <a
                href="/pipeline/review"
                className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Review Quality
              </a>
            </div>
          ) : (
            <EnrichmentClient initialLeads={leads} />
          )}
        </div>
      </main>
    </div>
  );
}
