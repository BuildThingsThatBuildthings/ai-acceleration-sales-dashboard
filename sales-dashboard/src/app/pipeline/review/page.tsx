import { getAllLeads } from '@/lib/google';
import { calculateQualityMetrics } from '@/lib/qualityScore';
import Sidebar from '@/components/Sidebar';
import PipelineNav from '@/components/pipeline/PipelineNav';
import IssueList from '@/components/quality/IssueList';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  const leads = await getAllLeads();
  const metrics = calculateQualityMetrics(leads);

  // Group leads by quality status
  const criticalIssues = metrics.issues.filter(i => i.severity === 'critical');
  const highIssues = metrics.issues.filter(i => i.severity === 'high');
  const mediumIssues = metrics.issues.filter(i => i.severity === 'medium');

  // Calculate ready leads (no issues)
  const leadsWithIssues = new Set(metrics.issues.map(i => i.rowNumber));
  const readyLeads = leads.filter(l =>
    !leadsWithIssues.has(l.rowNumber) &&
    l.aiSubjectLine &&
    l.aiOpeningHook &&
    l.firstName &&
    l.firstName.toLowerCase() !== 'partner'
  );

  const passRate = leads.length > 0 ? Math.round((readyLeads.length / leads.length) * 100) : 0;

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Quality Review</h1>
            <p className="text-neutral-400 mt-1">
              Final quality gate before leads go active for outreach
            </p>
          </div>

          {/* Pipeline Navigation */}
          <PipelineNav />

          {/* Summary Cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
              <div className="text-3xl font-bold text-white">{leads.length}</div>
              <div className="text-neutral-500 text-sm">Total Leads</div>
            </div>
            <div className={`rounded-xl border p-4 ${
              metrics.overallScore >= 80
                ? 'bg-green-900/20 border-green-800/30'
                : metrics.overallScore >= 60
                ? 'bg-yellow-900/20 border-yellow-800/30'
                : 'bg-red-900/20 border-red-800/30'
            }`}>
              <div className={`text-3xl font-bold ${
                metrics.overallScore >= 80 ? 'text-green-400' :
                metrics.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {metrics.overallScore}%
              </div>
              <div className="text-neutral-500 text-sm">Quality Score</div>
            </div>
            <div className="bg-green-900/20 rounded-xl border border-green-800/30 p-4">
              <div className="text-3xl font-bold text-green-400">{readyLeads.length}</div>
              <div className="text-neutral-500 text-sm">Ready for Outreach</div>
            </div>
            <div className="bg-red-900/20 rounded-xl border border-red-800/30 p-4">
              <div className="text-3xl font-bold text-red-400">{criticalIssues.length}</div>
              <div className="text-neutral-500 text-sm">Critical Issues</div>
            </div>
            <div className="bg-orange-900/20 rounded-xl border border-orange-800/30 p-4">
              <div className="text-3xl font-bold text-orange-400">{highIssues.length}</div>
              <div className="text-neutral-500 text-sm">High Priority</div>
            </div>
          </div>

          {/* Quality Status */}
          {metrics.overallScore >= 80 ? (
            <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Quality Approved</h2>
                  <p className="text-neutral-400 mt-1">
                    {readyLeads.length} leads are ready for outreach. Quality score is above threshold.
                  </p>
                </div>
                <Link
                  href="/pipeline/outreach"
                  className="ml-auto px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Generate Outreach
                  <TrendingUp className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-orange-900/20 border border-orange-800/30 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-10 h-10 text-orange-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Quality Issues Detected</h2>
                  <p className="text-neutral-400 mt-1">
                    Fix {criticalIssues.length + highIssues.length} critical/high issues to improve quality score.
                  </p>
                </div>
                <Link
                  href="/pipeline/enrich"
                  className="ml-auto px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
                >
                  Fix Issues
                </Link>
              </div>
            </div>
          )}

          {/* Ready Leads Preview */}
          {readyLeads.length > 0 && (
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 mb-8 overflow-hidden">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Ready for Outreach ({readyLeads.length})
                </h3>
                <span className="text-neutral-500 text-sm">{passRate}% pass rate</span>
              </div>
              <div className="divide-y divide-neutral-800 max-h-64 overflow-y-auto">
                {readyLeads.slice(0, 10).map(lead => (
                  <div key={lead.rowNumber} className="p-3 hover:bg-neutral-800/50 flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{lead.name}</span>
                      <span className="text-neutral-500 mx-2">•</span>
                      <span className="text-neutral-400">{lead.company}</span>
                    </div>
                    <Link
                      href={`/leads/${lead.rowNumber}`}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
                {readyLeads.length > 10 && (
                  <div className="p-3 text-center text-neutral-500 text-sm">
                    +{readyLeads.length - 10} more ready leads
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Issues List */}
          <IssueList issues={metrics.issues} maxDisplay={30} />

          {/* Quality Checklist */}
          <div className="mt-8 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quality Checklist</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'All names are real people', pass: metrics.nameCompleteness >= 95 },
                { label: 'All emails are personal', pass: metrics.personalEmailRate >= 95 },
                { label: 'No duplicate subject lines', pass: metrics.duplicateSubjectCount === 0 },
                { label: 'No duplicate opening hooks', pass: metrics.duplicateHookCount === 0 },
                { label: 'No aggregator websites', pass: metrics.aggregatorCount === 0 },
                { label: 'No generic content', pass: metrics.genericContentCount === 0 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.pass ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {item.pass ? '✓' : '✗'}
                  </div>
                  <span className={item.pass ? 'text-white' : 'text-red-400'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
