import Link from 'next/link';
import { getLeads } from '../actions';
import { Lead } from '@/lib/google';
import { Clock, Phone, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { format, isToday, isBefore, parseISO, startOfToday, differenceInDays } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FollowUpsPage() {
  const leads = await getLeads();
  const today = startOfToday();

  // Filter leads with follow-up dates
  const leadsWithFollowUp = leads.filter((l: Lead) => l.followUpDate);

  // Categorize follow-ups
  const overdue = leadsWithFollowUp.filter((l: Lead) => {
    try {
      const date = parseISO(l.followUpDate);
      return isBefore(date, today) && !isToday(date);
    } catch {
      return false;
    }
  });

  const todayFollowUps = leadsWithFollowUp.filter((l: Lead) => {
    try {
      return isToday(parseISO(l.followUpDate));
    } catch {
      return false;
    }
  });

  const upcoming = leadsWithFollowUp.filter((l: Lead) => {
    try {
      const date = parseISO(l.followUpDate);
      return !isBefore(date, today) && !isToday(date);
    } catch {
      return false;
    }
  }).sort((a, b) => {
    try {
      return parseISO(a.followUpDate).getTime() - parseISO(b.followUpDate).getTime();
    } catch {
      return 0;
    }
  });

  return (
    <>
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Follow-Ups</h1>
        <p className="text-neutral-400 text-sm md:text-base">Scheduled callbacks and reminders</p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-red-900/20 border border-red-900/30 p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
          <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-400 shrink-0" />
          <div>
            <div className="text-2xl md:text-3xl font-bold text-red-400">{overdue.length}</div>
            <div className="text-xs md:text-sm text-red-400/70">Overdue</div>
          </div>
        </div>
        <div className="bg-orange-900/20 border border-orange-900/30 p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
          <Clock className="w-6 h-6 md:w-8 md:h-8 text-orange-400 shrink-0" />
          <div>
            <div className="text-2xl md:text-3xl font-bold text-orange-400">{todayFollowUps.length}</div>
            <div className="text-xs md:text-sm text-orange-400/70">Due Today</div>
          </div>
        </div>
        <div className="bg-blue-900/20 border border-blue-900/30 p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-400 shrink-0" />
          <div>
            <div className="text-2xl md:text-3xl font-bold text-blue-400">{upcoming.length}</div>
            <div className="text-xs md:text-sm text-blue-400/70">Upcoming</div>
          </div>
        </div>
      </div>

      {/* Overdue Section */}
      {overdue.length > 0 && (
        <section className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold text-red-400 mb-3 md:mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
            Overdue ({overdue.length})
          </h2>
          <div className="space-y-3">
            {overdue.map((lead) => (
              <FollowUpCard key={lead.rowNumber} lead={lead} variant="overdue" />
            ))}
          </div>
        </section>
      )}

      {/* Today Section */}
      {todayFollowUps.length > 0 && (
        <section className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold text-orange-400 mb-3 md:mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            Due Today ({todayFollowUps.length})
          </h2>
          <div className="space-y-3">
            {todayFollowUps.map((lead) => (
              <FollowUpCard key={lead.rowNumber} lead={lead} variant="today" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Section */}
      {upcoming.length > 0 && (
        <section className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold text-blue-400 mb-3 md:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map((lead) => (
              <FollowUpCard key={lead.rowNumber} lead={lead} variant="upcoming" />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {leadsWithFollowUp.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 md:p-12 text-center">
          <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">All Caught Up!</h3>
          <p className="text-neutral-400 text-sm md:text-base max-w-md mx-auto">
            No follow-ups scheduled. When you mark a call for follow-up, it will appear here.
          </p>
        </div>
      )}
    </>
  );
}

function FollowUpCard({ lead, variant }: { lead: Lead; variant: 'overdue' | 'today' | 'upcoming' }) {
  const borderColor = {
    overdue: 'border-red-900/50 hover:border-red-500',
    today: 'border-orange-900/50 hover:border-orange-500',
    upcoming: 'border-neutral-800 hover:border-blue-500',
  }[variant];

  const dateColor = {
    overdue: 'text-red-400',
    today: 'text-orange-400',
    upcoming: 'text-blue-400',
  }[variant];

  let dateDisplay = '';
  try {
    const date = parseISO(lead.followUpDate);
    if (variant === 'overdue') {
      const days = differenceInDays(startOfToday(), date);
      dateDisplay = `${days} day${days > 1 ? 's' : ''} overdue`;
    } else if (variant === 'today') {
      dateDisplay = 'Today';
    } else {
      dateDisplay = format(date, 'EEE, MMM d');
    }
  } catch {
    dateDisplay = lead.followUpDate;
  }

  return (
    <div className={`bg-neutral-900 border ${borderColor} rounded-xl p-3 md:p-4 transition-colors`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-400 shrink-0">
            {lead.name?.charAt(0) || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <h3 className="font-semibold text-white truncate">{lead.name}</h3>
              <span className="text-neutral-500 hidden sm:inline">@</span>
              <span className="text-neutral-400 truncate hidden sm:inline">{lead.company}</span>
            </div>
            <div className="text-sm text-neutral-400 truncate sm:hidden">{lead.company}</div>
            <div className="hidden sm:flex items-center gap-4 text-sm text-neutral-500 mt-1">
              {(lead.city || lead.state) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {lead.city}{lead.city && lead.state ? ', ' : ''}{lead.state}
                </span>
              )}
              {lead.contactDate && (
                <span>Last contact: {lead.contactDate}</span>
              )}
            </div>
            {lead.callNotes && (
              <p className="text-sm text-neutral-400 mt-2 max-w-xl truncate hidden md:block">
                &quot;{lead.callNotes}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4 shrink-0">
          <div className={`${dateColor}`}>
            <div className="text-sm font-medium">{dateDisplay}</div>
          </div>
          <Link href={`/leads/${lead.rowNumber}`}>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 min-h-[44px]">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
