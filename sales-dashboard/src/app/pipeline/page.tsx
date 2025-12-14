import { getAllLeads } from '@/lib/google';
import { calculateQualityMetrics } from '@/lib/qualityScore';
import PipelineNav from '@/components/pipeline/PipelineNav';
import StageCard from '@/components/pipeline/StageCard';

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const leads = await getAllLeads();
  const metrics = calculateQualityMetrics(leads);

  // Calculate pipeline stats
  const totalLeads = leads.length;
  const unenrichedLeads = leads.filter(l =>
    !l.aiSubjectLine || !l.aiOpeningHook || l.firstName === 'Partner' || !l.firstName
  ).length;
  const pendingReview = leads.filter(l =>
    l.aiSubjectLine && l.aiOpeningHook && l.status === 'Lead' && !l.contactDate
  ).length;
  const emailableLeads = leads.filter(l =>
    l.email && l.aiSubjectLine && l.aiOpeningHook && !l.emailed
  ).length;
  const criticalIssues = metrics.issues.filter(i => i.severity === 'critical').length;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Lead Pipeline</h1>
        <p className="text-neutral-400 text-sm md:text-base mt-1">
          Manage your lead generation workflow from scraping to outreach
        </p>
      </div>

      {/* Pipeline Navigation */}
      <PipelineNav />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-3 md:p-4">
          <div className="text-xl md:text-2xl font-bold text-white">{totalLeads}</div>
          <div className="text-neutral-500 text-xs md:text-sm">Total Leads</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-3 md:p-4">
          <div className="text-xl md:text-2xl font-bold text-orange-400">{unenrichedLeads}</div>
          <div className="text-neutral-500 text-xs md:text-sm">Need Enrichment</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-3 md:p-4">
          <div className="text-xl md:text-2xl font-bold text-blue-400">{pendingReview}</div>
          <div className="text-neutral-500 text-xs md:text-sm">Pending Review</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-3 md:p-4">
          <div className="text-xl md:text-2xl font-bold text-green-400">{metrics.overallScore}%</div>
          <div className="text-neutral-500 text-xs md:text-sm">Quality Score</div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Pipeline Stages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StageCard
          title="Import Leads"
          description="Upload scraped leads from JSON files, preview and filter out aggregator sites, then import to CRM."
          href="/pipeline/scrape"
          iconName="Search"
          stats={[
            { label: 'Total Leads', value: totalLeads },
          ]}
          status="ready"
          statusLabel="Ready"
        />

        <StageCard
          title="Enrich Leads"
          description="Research decision makers, find contact info, and write personalized subject lines and opening hooks."
          href="/pipeline/enrich"
          iconName="UserPlus"
          stats={[
            { label: 'Need Research', value: unenrichedLeads },
          ]}
          status={unenrichedLeads > 0 ? 'action-needed' : 'complete'}
          statusLabel={unenrichedLeads > 0 ? `${unenrichedLeads} to enrich` : 'All enriched'}
        />

        <StageCard
          title="Review Quality"
          description="Final quality gate - verify all leads meet quality standards before activating for outreach."
          href="/pipeline/review"
          iconName="ClipboardCheck"
          stats={[
            { label: 'Critical Issues', value: criticalIssues },
            { label: 'Pending Review', value: pendingReview },
          ]}
          status={criticalIssues > 0 ? 'action-needed' : 'ready'}
          statusLabel={criticalIssues > 0 ? `${criticalIssues} issues` : 'Looking good'}
        />

        <StageCard
          title="Generate Outreach"
          description="Preview email sequences, export for Instantly.ai, and mark leads as emailed."
          href="/pipeline/outreach"
          iconName="Mail"
          stats={[
            { label: 'Ready to Email', value: emailableLeads },
          ]}
          status={emailableLeads > 0 ? 'ready' : 'complete'}
          statusLabel={emailableLeads > 0 ? `${emailableLeads} leads` : 'All sent'}
        />
      </div>

      {/* Pipeline Flow Diagram */}
      <div className="mt-6 md:mt-8 bg-neutral-900 rounded-xl border border-neutral-800 p-4 md:p-6 overflow-x-auto">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">Pipeline Flow</h3>
        <div className="flex items-center justify-between min-w-[500px]">
          {[
            { label: 'Scrape', desc: 'Run locally', color: 'bg-purple-600' },
            { label: 'Import', desc: 'Upload JSON', color: 'bg-blue-600' },
            { label: 'Enrich', desc: 'Deep research', color: 'bg-orange-600' },
            { label: 'Review', desc: 'Quality gate', color: 'bg-yellow-600' },
            { label: 'Outreach', desc: 'Send emails', color: 'bg-green-600' },
          ].map((step, index, arr) => (
            <div key={step.label} className="flex items-center">
              <div className="text-center">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold mb-2`}>
                  {index + 1}
                </div>
                <div className="text-white text-xs md:text-sm font-medium">{step.label}</div>
                <div className="text-neutral-500 text-[10px] md:text-xs">{step.desc}</div>
              </div>
              {index < arr.length - 1 && (
                <div className="w-8 md:w-16 h-0.5 bg-neutral-700 mx-1 md:mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Command Reference */}
      <div className="mt-6 md:mt-8 bg-neutral-900 rounded-xl border border-neutral-800 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">Local Scraping Commands</h3>
        <p className="text-neutral-400 text-sm mb-4">
          Run these commands locally, then upload the resulting JSON to Import Leads.
        </p>
        <div className="space-y-3 overflow-x-auto">
          <div className="bg-neutral-800 rounded-lg p-3 font-mono text-xs md:text-sm whitespace-nowrap">
            <span className="text-green-400">$</span>
            <span className="text-white ml-2">python execution/scrape_maps.py --city &quot;Louisville&quot; --state &quot;KY&quot;</span>
          </div>
          <div className="bg-neutral-800 rounded-lg p-3 font-mono text-xs md:text-sm">
            <span className="text-green-400">$</span>
            <span className="text-white ml-2">python execution/filter_leads.py</span>
          </div>
          <p className="text-neutral-500 text-xs mt-2">
            Output: <code className="bg-neutral-800 px-1 py-0.5 rounded">.tmp/clean_leads.json</code>
          </p>
        </div>
      </div>
    </>
  );
}
