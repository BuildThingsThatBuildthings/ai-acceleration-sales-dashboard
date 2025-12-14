'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAllLeads,
  getLeadByRow,
  updateLeadStatus,
  updateContactDate,
  updateFollowUpDate,
  updateLeadWithOutcome,
  updatePipelineStage,
  appendLeadsToCRM,
  getExistingEmails,
  getExistingWebsites,
  updateLeadEnrichment,
  Lead,
  OutcomeDetails,
  NewLead,
  EnrichmentData
} from '@/lib/google';

export async function login(password: string) {
  'use server';

  const CORRECT_PASSWORD = process.env.AUTH_PASSWORD || 'SweetMuffin';

  if (password === CORRECT_PASSWORD) {
    (await cookies()).set('auth_token', 'authenticated', {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true };
  }
  return { success: false };
}

export async function logout() {
  (await cookies()).delete('auth_token');
  redirect('/login');
}

// Log a call and update status in Google Sheets
export async function logCall(rowNumber: number, outcome: string, notes: string) {
  const statusMap: Record<string, string> = {
    'Booked': 'Booked',
    'Bad Data': 'Bad Data',
    'No Interest': 'Not Interested',
    'Follow Up': 'Contacted',
    'Voicemail': 'Contacted',
    'Callback': 'Contacted',
  };

  const status = statusMap[outcome] || 'Contacted';

  // Update Google Sheet directly
  await updateLeadStatus(rowNumber, status, notes);

  // Also update contact date
  await updateContactDate(rowNumber);

  revalidatePath('/');
  revalidatePath(`/leads/${rowNumber}`);
  revalidatePath('/follow-ups');
}

// Schedule a follow-up for a lead
export async function setFollowUp(rowNumber: number, date: string, notes?: string) {
  await updateFollowUpDate(rowNumber, date, notes);

  // Also update status to Contacted if not already booked
  await updateContactDate(rowNumber);

  revalidatePath('/');
  revalidatePath(`/leads/${rowNumber}`);
  revalidatePath('/follow-ups');
}

// Log a detailed call outcome with objection tracking
export async function logDetailedOutcome(
  rowNumber: number,
  outcome: string,
  details: OutcomeDetails
) {
  const statusMap: Record<string, string> = {
    'Booked': 'Booked',
    'Bad Data': 'Bad Data',
    'No Interest': 'Not Interested',
    'Follow Up': 'Contacted',
    'Voicemail': 'Contacted',
    'Callback': 'Contacted',
  };

  const status = statusMap[outcome] || 'Contacted';

  // Update with all the detailed outcome data
  await updateLeadWithOutcome(rowNumber, status, details);

  revalidatePath('/');
  revalidatePath(`/leads/${rowNumber}`);
  revalidatePath('/follow-ups');
}

// Quick pipeline stage update
export async function changePipelineStage(rowNumber: number, stage: string) {
  await updatePipelineStage(rowNumber, stage);

  revalidatePath('/');
  revalidatePath(`/leads/${rowNumber}`);
}

// Get all leads directly from Google Sheets
export async function getLeads(): Promise<Lead[]> {
  try {
    return await getAllLeads();
  } catch (e) {
    console.error('Error fetching leads from Google Sheets:', e);
    // In production, you'd want to surface this error to the UI
    return [];
  }
}

// Get a single lead by row number from Google Sheets
export async function getLead(rowNumber: number): Promise<Lead | null> {
  try {
    return await getLeadByRow(rowNumber);
  } catch (e) {
    console.error('Error fetching lead from Google Sheets:', e);
    return null;
  }
}

// CLOSER Framework Scripts (Hormozi methodology)
const SCRIPTS = [
  {
    id: 1,
    title: 'C - CLARIFY',
    display_order: 1,
    stage: 'clarify',
    duration: '60 sec',
    goal: 'Understand their world before proposing anything',
    content: `Hey [First Name], [read personalized hook].
Quick question for you—

When you think about your agents' productivity,
what's the one thing eating up most of their time right now?`,
    prompts: [
      'Walk me through what happens when an agent gets a new listing.',
      'How long does that typically take them?',
      'What have you tried to speed that up?',
      'How many agents do you have on your team?'
    ]
  },
  {
    id: 2,
    title: 'L - LABEL',
    display_order: 2,
    stage: 'label',
    duration: '30 sec',
    goal: 'Name their problem so they feel understood',
    content: `So if I'm hearing you right, your agents are spending
[X hours] on [specific task] that should take [Y minutes].

That's [X × agents × 52] hours a year going to admin instead of deals.
That's the bottleneck, right?`,
    prompts: [
      'Use their exact words back to them',
      'Quantify the problem with real math',
      'Pause after—let them confirm'
    ]
  },
  {
    id: 3,
    title: 'O - OVERVIEW',
    display_order: 3,
    stage: 'overview',
    duration: '30 sec',
    goal: 'Understand why previous solutions failed',
    content: `What have you tried before?

Most brokerages I talk to have either:
- Done nothing and hoped it would figure itself out
- Tried ChatGPT and got garbage output
- Bought software that no one actually uses

Where do you fall?`,
    prompts: [
      'If "nothing": What\'s held you back?',
      'If "tried ChatGPT": What went wrong?',
      'If "bought software": What didn\'t stick?'
    ]
  },
  {
    id: 4,
    title: 'S - SELL VACATION',
    display_order: 4,
    stage: 'vacation',
    duration: '60 sec',
    goal: 'Paint the outcome, not the process',
    content: `Imagine it's Monday after the workshop.

Your agents open their laptops, type 3 sentences about a listing,
and get back a description that used to take 45 minutes.
They copy-paste it into MLS and move on.

That's the 5-hour-a-week savings. Every week. Forever.

The workshop is one day. The results are permanent.`,
    prompts: [
      'Focus on OUTCOMES, not features',
      'Paint their Monday morning',
      'Make it concrete and visual'
    ]
  },
  {
    id: 5,
    title: 'E - EXPLAIN',
    display_order: 5,
    stage: 'explain',
    duration: '45 sec',
    goal: 'Address concerns before they become objections',
    content: `Now, you're probably thinking one of three things:

1. 'My agents won't actually use it.'
   — They will, because they build it themselves.

2. 'We've tried training before and it didn't stick.'
   — This isn't a webinar. They leave with working systems.

3. 'Is this worth $5K?'
   — If 10 agents save 5 hours a week, that's $60K year one.
   That's 12:1 ROI.

Which one were you thinking?`,
    prompts: [
      'Pre-frame top 3 concerns proactively',
      'End with a question to surface the real one',
      'Don\'t be defensive—be curious'
    ]
  },
  {
    id: 6,
    title: 'R - REINFORCE',
    display_order: 6,
    stage: 'reinforce',
    duration: '30 sec',
    goal: 'Make them close themselves',
    content: `Based on what you told me—[restate their pain],
this would give you [restate vacation].

Does that sound like something worth exploring on a 15-minute call?`,
    prompts: [
      'If YES: "I\'ve got [Day 1] or [Day 2]—which works better?"',
      'If HESITANT: "Can I send the curriculum? If it fits, we\'ll find 15 min."',
      'If NO: "Know any other brokerages who might benefit? $250 for an intro."'
    ]
  }
];

// Pre-Frame Objection Cards (address before they become objections)
const OBJECTIONS = [
  {
    id: 1,
    objection: "It's too expensive",
    preFrame: "Most people think $5K is high until they do the math...",
    response: `Most people think $5K is high until they do the math.

10 agents × 5 hours × $50/hour × 52 weeks = $130K in recovered time.
The workshop is 4% of that. It pays for itself in the first month.

For a team of 10, that's 12:1 ROI in year one.
What would make this feel like a no-brainer for you?`
  },
  {
    id: 2,
    objection: "My agents won't actually use it",
    preFrame: "Every brokerage worries about adoption...",
    response: `Every brokerage worries about adoption. That's why they build it live.

If you build it, you use it. They don't leave with notes—
they leave with working systems they created themselves.

They'll use it Monday morning because it's THEIR system.`
  },
  {
    id: 3,
    objection: "We're already using AI",
    preFrame: "Using vs. using well are different...",
    response: `Using vs. using well are different.

Most agents tried ChatGPT once, got garbage output, and quit.
We turn the toy into a teammate.

Quick question: Are your agents using AI consistently,
or did they try it once and move on?
What tools are they using now?`
  },
  {
    id: 4,
    objection: "We've tried training before and it didn't stick",
    preFrame: "Most training doesn't stick because it's theory...",
    response: `Most training doesn't stick because it's theory, not practice.

Our agents build working systems live. They use them Monday morning.
It's not a webinar they forget—it's a tool they own.

What didn't translate to action last time?`
  },
  {
    id: 5,
    objection: "Just send me some information",
    preFrame: "Happy to. Quick question first...",
    response: `Happy to send that over.

Quick question—are you open to on-site training if the curriculum fits?
I don't want to waste your time with a PDF if this isn't a fit.`
  },
  {
    id: 6,
    objection: "I need to think about it",
    preFrame: "Totally fair. What specifically would help you decide?",
    response: `Totally fair. What specifically would help you decide?

Is it the price, the timing, or something about how it works?
I want to make sure you have everything you need.`
  },
  {
    id: 7,
    objection: "Bad timing right now",
    preFrame: "I hear you. When would be better?",
    response: `I hear you. When would be a better time to revisit this?

I can set a reminder and follow up then.
What's changing between now and then?`
  },
  {
    id: 8,
    objection: "My agents are too old/resistant to tech",
    preFrame: "We've trained agents in their 60s...",
    response: `We've trained agents in their 60s who'd never opened ChatGPT.
They leave confident. The system is designed for non-tech people.

If they can copy-paste, they can use this.
What specifically worries you about adoption?`
  }
];

export async function getScripts() {
  return SCRIPTS;
}

export async function getObjections() {
  return OBJECTIONS;
}

// No sync needed - data is always live from Google Sheets
export async function syncLeads() {
  // Just revalidate the page to get fresh data
  revalidatePath('/');
  return { success: true, message: 'Data refreshed from Google Sheets' };
}

// ============ PIPELINE: IMPORT LEADS ============

export interface ImportResult {
  success: number;
  duplicates: number;
  errors: string[];
}

export async function importLeads(leads: NewLead[]): Promise<ImportResult> {
  // Get existing data for deduplication
  const [existingEmails, existingWebsites] = await Promise.all([
    getExistingEmails(),
    getExistingWebsites()
  ]);

  const duplicates: NewLead[] = [];
  const toImport: NewLead[] = [];

  for (const lead of leads) {
    // Check for duplicate email
    if (lead.email && existingEmails.has(lead.email.toLowerCase().trim())) {
      duplicates.push(lead);
      continue;
    }

    // Check for duplicate website
    if (lead.website) {
      let normalizedUrl = lead.website.toLowerCase().trim();
      normalizedUrl = normalizedUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
      if (existingWebsites.has(normalizedUrl)) {
        duplicates.push(lead);
        continue;
      }
    }

    toImport.push(lead);
  }

  // Import non-duplicate leads
  const result = await appendLeadsToCRM(toImport);

  // Revalidate pages
  revalidatePath('/');
  revalidatePath('/pipeline');
  revalidatePath('/pipeline/scrape');
  revalidatePath('/quality');

  return {
    success: result.success,
    duplicates: duplicates.length,
    errors: result.errors
  };
}

// ============ PIPELINE: ENRICHMENT ============

export async function getUnenrichedLeads(): Promise<Lead[]> {
  const leads = await getAllLeads();

  // Filter to leads that need enrichment
  return leads.filter(lead => {
    // No subject line or hook
    if (!lead.aiSubjectLine || !lead.aiOpeningHook) return true;

    // Bad name patterns
    const badNames = ['partner', 'owner', 'broker', 'team', 'office', 'staff'];
    if (badNames.includes(lead.firstName.toLowerCase())) return true;
    if (!lead.firstName || lead.firstName.length < 2) return true;

    return false;
  });
}

export async function saveEnrichment(rowNumber: number, data: EnrichmentData): Promise<void> {
  await updateLeadEnrichment(rowNumber, data);

  revalidatePath('/');
  revalidatePath('/pipeline/enrich');
  revalidatePath('/quality');
  revalidatePath(`/leads/${rowNumber}`);
}

// ============ PIPELINE: OUTREACH ============

export async function getEmailableLeads(): Promise<Lead[]> {
  const leads = await getAllLeads();

  // Filter to leads ready for email
  return leads.filter(lead => {
    // Must have email
    if (!lead.email) return false;

    // Must have personalized content
    if (!lead.aiSubjectLine || !lead.aiOpeningHook) return false;

    // Not already emailed
    if (lead.emailed === 'Yes') return false;

    // Not bad data or closed
    if (lead.status === 'Bad Data' || lead.status === 'Not Interested') return false;

    return true;
  });
}

export async function markAsEmailed(rowNumbers: number[]): Promise<void> {
  const { google } = await import('googleapis');

  // Get auth and sheets service
  let auth;
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    const path = await import('path');
    const keyFile = path.join(process.cwd(), '..', 'credentials.json');
    auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  const sheets = google.sheets({ version: 'v4', auth });
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0';
  const today = new Date().toISOString().split('T')[0];

  // Update each row
  const data = rowNumbers.flatMap(rowNumber => [
    { range: `O${rowNumber}`, values: [['Yes']] },  // Emailed column
    { range: `L${rowNumber}`, values: [[today]] },  // Contact Date
  ]);

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data
    }
  });

  revalidatePath('/');
  revalidatePath('/pipeline/outreach');
}
