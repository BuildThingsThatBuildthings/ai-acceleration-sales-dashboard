import { getAllLeads } from '@/lib/google';
import { calculateQualityMetrics } from '@/lib/qualityScore';
import QualityScoreGauge from '@/components/quality/QualityScoreGauge';
import MetricCard from '@/components/quality/MetricCard';
import IssueList from '@/components/quality/IssueList';
import { RefreshCw, TrendingUp, Users, Mail, FileText, Phone, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QualityPage() {
  const leads = await getAllLeads();
  const metrics = calculateQualityMetrics(leads);

  // Calculate state distribution
  const stateDistribution = leads.reduce((acc, lead) => {
    const state = lead.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedStates = Object.entries(stateDistribution)
    .sort((a, b) => b[1] - a[1]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Data Quality Dashboard</h1>
          <p className="text-neutral-400 text-sm md:text-base mt-1">
            Real-time visibility into CRM data health
          </p>
        </div>
        <form action="/quality">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </form>
      </div>

      {/* Top Section: Score + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Quality Score Gauge */}
        <div className="lg:col-span-1">
          <QualityScoreGauge score={metrics.overallScore} />
        </div>

        {/* Key Metrics Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <MetricCard
            title="Total Leads"
            value={metrics.totalLeads}
            description="Leads in CRM"
          />
          <MetricCard
            title="Name Completeness"
            value={metrics.nameCompleteness}
            suffix="%"
            target={100}
            description="Valid first + last names"
          />
          <MetricCard
            title="Personal Email Rate"
            value={metrics.personalEmailRate}
            suffix="%"
            target={100}
            description="Non-generic emails"
          />
          <MetricCard
            title="Duplicate Subjects"
            value={metrics.duplicateSubjectCount}
            target={0}
            inverted={true}
            description="Identical subject lines"
          />
          <MetricCard
            title="Duplicate Hooks"
            value={metrics.duplicateHookCount}
            target={0}
            inverted={true}
            description="Identical opening hooks"
          />
          <MetricCard
            title="Phone Completeness"
            value={metrics.phoneCompleteness}
            suffix="%"
            target={80}
            description="Leads with phone numbers"
          />
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <MetricCard
          title="Generic Content"
          value={metrics.genericContentCount}
          target={0}
          inverted={true}
          description="Templated subjects/hooks"
        />
        <MetricCard
          title="Aggregator Sites"
          value={metrics.aggregatorCount}
          target={0}
          inverted={true}
          description="Leads from zillow, etc."
        />
        <div className="sm:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <h4 className="text-neutral-400 text-sm font-medium mb-3">Leads by State</h4>
          <div className="flex flex-wrap gap-2">
            {sortedStates.slice(0, 8).map(([state, count]) => (
              <div
                key={state}
                className="px-3 py-1.5 bg-neutral-800 rounded-lg text-sm"
              >
                <span className="text-white font-medium">{state}</span>
                <span className="text-neutral-500 ml-1">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Score Breakdown */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 md:p-6 mb-6 md:mb-8">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4">Score Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { label: 'Valid Names', max: 25, value: Math.round((metrics.nameCompleteness / 100) * 25), icon: Users },
            { label: 'Personal Emails', max: 25, value: Math.round((metrics.personalEmailRate / 100) * 25), icon: Mail },
            { label: 'Unique Subjects', max: 20, value: Math.max(0, 20 - Math.round((metrics.duplicateSubjectCount / Math.max(1, metrics.totalLeads)) * 20)), icon: FileText },
            { label: 'Unique Hooks', max: 20, value: Math.max(0, 20 - Math.round((metrics.duplicateHookCount / Math.max(1, metrics.totalLeads)) * 20)), icon: TrendingUp },
            { label: 'Phone Numbers', max: 10, value: Math.round((metrics.phoneCompleteness / 100) * 10), icon: Phone },
          ].map((item) => {
            const percentage = (item.value / item.max) * 100;
            return (
              <div key={item.label} className="text-center">
                <item.icon className="w-5 h-5 text-neutral-500 mx-auto mb-2" />
                <div className="text-xl md:text-2xl font-bold text-white">{item.value}</div>
                <div className="text-neutral-500 text-xs">/ {item.max} pts</div>
                <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      percentage >= 80 ? 'bg-green-500' :
                      percentage >= 60 ? 'bg-yellow-500' :
                      percentage >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-neutral-400 text-xs mt-2">{item.label}</div>
              </div>
            );
          })}
        </div>

        {/* Deductions */}
        {(metrics.aggregatorCount > 0 || metrics.genericContentCount > 0) && (
          <div className="mt-4 md:mt-6 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Score Deductions</span>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4 text-neutral-400 text-sm">
              {metrics.aggregatorCount > 0 && (
                <span>-{Math.min(10, metrics.aggregatorCount * 2)} pts (aggregators)</span>
              )}
              {metrics.genericContentCount > 0 && (
                <span>-{Math.min(10, Math.round((metrics.genericContentCount / 2) * 0.5))} pts (generic content)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Issues List */}
      <IssueList issues={metrics.issues} />
    </>
  );
}
