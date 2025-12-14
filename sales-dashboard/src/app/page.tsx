import { getLeads } from './actions';
import { Lead } from '@/lib/google';
import LeadList from '@/components/LeadList';
import Link from 'next/link';
import { Phone, CheckCircle, Users, Clock, ExternalLink } from 'lucide-react';
import { isToday, parseISO, isBefore, startOfToday, format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const leads = await getLeads();

  // Calculate KPIs
  const total = leads.length;
  const booked = leads.filter((l: Lead) => l.status === 'Booked').length;
  const newLeads = leads.filter((l: Lead) => l.status === 'Lead' || !l.status).length;
  const contacted = leads.filter((l: Lead) => l.status === 'Contacted').length;

  // Activity stats
  const today = startOfToday();
  const todayCalls = leads.filter((l: Lead) => {
    if (!l.contactDate) return false;
    try {
      return isToday(parseISO(l.contactDate));
    } catch {
      return false;
    }
  }).length;

  const followUpsDue = leads.filter((l: Lead) => {
    if (!l.followUpDate) return false;
    try {
      const followUp = parseISO(l.followUpDate);
      return isToday(followUp) || isBefore(followUp, today);
    } catch {
      return false;
    }
  }).length;

  return (
    <main className="min-h-full page-enter">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          Sales Dashboard
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-surface-500">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-green-400">Live</span>
          </span>
          <span className="text-surface-700">·</span>
          <span className="hidden sm:inline text-surface-500">
            Updated {format(new Date(), 'h:mm a')}
          </span>
          <a
            href="https://docs.google.com/spreadsheets/d/1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span className="hidden sm:inline">Open Sheet</span>
            <span className="sm:hidden">Sheet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        {/* Total Leads */}
        <div className="bg-surface-900 border border-surface-800 p-4 rounded-xl transition-all hover:border-surface-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-surface-800 rounded-lg">
              <Users className="w-5 h-5 text-surface-400" />
            </div>
            <div>
              <div className="stat-value text-white">{total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* New to Call */}
        <div className="bg-brand-950/50 border border-brand-900/40 p-4 rounded-xl transition-all hover:border-brand-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-900/30 rounded-lg">
              <Phone className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="stat-value text-brand-400">{newLeads}</div>
              <div className="text-[11px] text-brand-400/70 uppercase tracking-wide">New</div>
            </div>
          </div>
        </div>

        {/* Booked */}
        <div className="bg-green-950/40 border border-green-900/30 p-4 rounded-xl transition-all hover:border-green-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="stat-value text-green-400">{booked}</div>
              <div className="text-[11px] text-green-400/70 uppercase tracking-wide">Booked</div>
            </div>
          </div>
        </div>

        {/* Contacted */}
        <div className="bg-purple-950/40 border border-purple-900/30 p-4 rounded-xl transition-all hover:border-purple-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="stat-value text-purple-400">{contacted}</div>
              <div className="text-[11px] text-purple-400/70 uppercase tracking-wide">Contacted</div>
            </div>
          </div>
        </div>

        {/* Follow-ups / Today's Calls */}
        {followUpsDue > 0 ? (
          <Link
            href="/follow-ups"
            className="bg-emphasis-950/50 border border-emphasis-800/40 p-4 rounded-xl transition-all hover:border-emphasis-700/60 hover:bg-emphasis-950/70 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emphasis-900/30 rounded-lg group-hover:bg-emphasis-900/50 transition-colors">
                <Clock className="w-5 h-5 text-emphasis-400" />
              </div>
              <div>
                <div className="stat-value text-emphasis-400">{followUpsDue}</div>
                <div className="text-[11px] text-emphasis-400/70 uppercase tracking-wide">Due</div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-surface-900/60 border border-surface-800 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-surface-800 rounded-lg">
                <Clock className="w-5 h-5 text-surface-500" />
              </div>
              <div>
                <div className="stat-value text-white">{todayCalls}</div>
                <div className="stat-label">Today</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead List */}
      <LeadList leads={leads} />
    </main>
  );
}
