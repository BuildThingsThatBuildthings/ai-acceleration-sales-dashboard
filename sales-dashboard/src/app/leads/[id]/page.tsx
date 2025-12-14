import { getLead, getScripts, getObjections } from '@/app/actions';
import CallInterface from '@/components/CallInterface';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Globe, Building, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const rowNumber = Number(params.id);

  const lead = await getLead(rowNumber);
  const scripts = await getScripts();
  const objections = await getObjections();

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-4 p-4">
        <h1 className="text-xl md:text-2xl font-bold text-red-500">Lead Not Found</h1>
        <div className="p-4 bg-neutral-900 rounded border border-neutral-800 text-left font-mono text-xs md:text-sm w-full max-w-md">
          <p>Requested Row: <span className="text-blue-400">{params.id}</span></p>
          <p>Parsed Row Number: <span className="text-blue-400">{rowNumber}</span></p>
          <p>Result: <span className="text-red-400">null</span></p>
        </div>
        <Link href="/" className="text-neutral-400 hover:text-white underline min-h-[44px] flex items-center">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-md">
        <div className="flex items-center px-3 md:px-6 py-3 min-h-[56px] md:min-h-16">
          <Link href="/" className="text-neutral-400 hover:text-white flex items-center gap-1.5 md:gap-2 text-sm font-medium transition-colors min-w-[44px] min-h-[44px] justify-center md:justify-start">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="ml-3 md:ml-6 flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <h1 className="text-base md:text-xl font-bold truncate">{lead.name}</h1>
              <span className="text-neutral-500 hidden sm:inline">@</span>
              <span className="text-neutral-300 truncate hidden sm:inline">{lead.company}</span>
            </div>
            <div className="text-sm text-neutral-400 truncate sm:hidden">{lead.company}</div>
            <div className="hidden md:flex items-center gap-4 text-sm text-neutral-400 mt-1">
              {(lead.city || lead.state) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {lead.city}{lead.city && lead.state ? ', ' : ''}{lead.state}
                </span>
              )}
              {lead.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {lead.phone}
                </span>
              )}
              {lead.email && (
                <span className="flex items-center gap-1 truncate max-w-[200px]">
                  <Mail className="w-3 h-3 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Call Interface */}
        <div className="flex-1 lg:border-r border-neutral-800 bg-neutral-900/30 relative overflow-y-auto order-1">
          <CallInterface lead={lead} scripts={scripts} objections={objections} />
        </div>

        {/* Data Sidebar */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-neutral-950 flex flex-col border-t lg:border-t-0 lg:border-l border-neutral-800 shadow-2xl z-20 overflow-hidden order-2 max-h-[50vh] lg:max-h-none">
          <div className="p-3 md:p-4 border-b border-neutral-800 bg-neutral-900 shrink-0">
            <h3 className="font-bold text-white text-xs md:text-sm uppercase tracking-wider">Lead Details</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Contact Information */}
            <Section title="Contact Information" icon={<Phone className="w-4 h-4" />}>
              <Field label="First Name" value={lead.firstName} />
              <Field label="Last Name" value={lead.lastName} />
              <Field label="Phone" value={lead.phone} />
              <Field label="Email" value={lead.email} />
              {lead.website && (
                <Field label="Website" value={lead.website} link={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} />
              )}
            </Section>

            {/* Company Information */}
            <Section title="Company" icon={<Building className="w-4 h-4" />}>
              <Field label="Official Name" value={lead.officialCompany} />
              <Field label="Casual Name" value={lead.casualCompany} />
              <Field label="City" value={lead.city} />
              <Field label="State" value={lead.state} />
            </Section>

            {/* AI Personalization */}
            <Section title="AI Personalization" icon={<span className="text-yellow-500">AI</span>} highlight>
              <Field label="Subject Line" value={lead.aiSubjectLine} multiline />
              <Field label="Opening Hook" value={lead.aiOpeningHook} multiline />
            </Section>

            {/* Status & Tracking */}
            <Section title="Status & Tracking" icon={<Calendar className="w-4 h-4" />}>
              <Field label="Status" value={lead.status || 'Lead'} />
              <Field label="Contact Date" value={lead.contactDate} />
              <Field label="Follow Up Date" value={lead.followUpDate} />
              <Field label="Called" value={lead.called} boolean />
              <Field label="Emailed" value={lead.emailed} boolean />
              <Field label="Call Notes" value={lead.callNotes} multiline />
            </Section>

            {/* Products Purchased */}
            <Section title="Products Purchased" icon={<CheckCircle className="w-4 h-4" />}>
              <Field label="1Hr Course" value={lead.bought1Hr} boolean />
              <Field label="3Hr Course" value={lead.bought3Hr} boolean />
              <Field label="6Hr Course" value={lead.bought6Hr} boolean />
            </Section>

            {/* Referral Information */}
            <Section title="Referral Info" icon={<span>REF</span>}>
              <Field label="Referred By" value={lead.referredBy} />
              <Field label="Lead Date" value={lead.referralLeadDate} />
              <Field label="Book Date" value={lead.referralBookDate} />
              <Field label="Bonus Owed" value={lead.referralBonusOwed} />
              <Field label="Bonus Paid" value={lead.bonusPaid} boolean />
            </Section>

            {/* Meta */}
            <div className="p-3 md:p-4 text-[10px] md:text-xs text-neutral-600 border-t border-neutral-800">
              Row #{lead.rowNumber} in Google Sheet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, highlight }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`border-b border-neutral-800 ${highlight ? 'bg-yellow-900/10' : ''}`}>
      <div className="p-2.5 md:p-3 bg-neutral-900/50 flex items-center gap-2">
        {icon}
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-neutral-400">{title}</span>
      </div>
      <div className="p-3 md:p-4 space-y-2.5 md:space-y-3">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, multiline, boolean, link }: {
  label: string;
  value: string;
  multiline?: boolean;
  boolean?: boolean;
  link?: string;
}) {
  if (!value && !boolean) return null;

  let displayValue: React.ReactNode = value || '—';

  if (boolean) {
    const isYes = value?.toLowerCase() === 'yes' || value === 'TRUE' || value === '1';
    displayValue = isYes ? (
      <span className="text-green-400 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Yes
      </span>
    ) : (
      <span className="text-neutral-500 flex items-center gap-1">
        <XCircle className="w-3 h-3" /> No
      </span>
    );
  }

  if (link && value) {
    displayValue = (
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
        <Globe className="w-3 h-3" /> {value}
      </a>
    );
  }

  return (
    <div>
      <div className="text-[10px] uppercase font-bold text-neutral-500 mb-1">{label}</div>
      <div className={`text-sm text-neutral-300 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
        {displayValue}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Lead': 'bg-blue-900/20 text-blue-400 border-blue-900/50',
    'New': 'bg-blue-900/20 text-blue-400 border-blue-900/50',
    'Contacted': 'bg-purple-900/20 text-purple-400 border-purple-900/50',
    'Booked': 'bg-green-900/20 text-green-400 border-green-900/50',
    'Not Interested': 'bg-neutral-800 text-neutral-500 border-neutral-700',
    'Bad Data': 'bg-red-900/20 text-red-400 border-red-900/50',
  };

  const displayStatus = status || 'Lead';

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[displayStatus] || styles['Lead']}`}>
      {displayStatus}
    </span>
  );
}
