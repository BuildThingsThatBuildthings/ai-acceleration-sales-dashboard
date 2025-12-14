import { google } from 'googleapis';

// PRIMARY CRM Sheet - configurable via env var
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0';

// Column mapping (0-indexed) - 31 columns A-AE
export const COL = {
  firstName: 0,
  lastName: 1,
  phone: 2,
  email: 3,
  officialCompany: 4,
  casualCompany: 5,
  website: 6,
  city: 7,
  state: 8,
  aiSubjectLine: 9,
  aiOpeningHook: 10,
  contactDate: 11,
  followUpDate: 12,
  called: 13,
  emailed: 14,
  callNotes: 15,
  status: 16,
  bought1Hr: 17,
  bought3Hr: 18,
  bought6Hr: 19,
  referredBy: 20,
  referralLeadDate: 21,
  referralBookDate: 22,
  referralBonusOwed: 23,
  bonusPaid: 24,
  // New pipeline tracking columns (Z-AE)
  pipelineStage: 25,
  objectionType: 26,
  objectionDetails: 27,
  competitorMention: 28,
  interestLevel: 29,
  lostReason: 30
};

// Re-export constants for convenience (server-side only imports)
export {
  PIPELINE_STAGES,
  OBJECTION_TYPES,
  INTEREST_LEVELS,
  LOST_REASONS
} from './constants';

// Lead interface matching 31-column CRM
export interface Lead {
  rowNumber: number;  // Sheet row (1-indexed, 2 = first data row)
  firstName: string;
  lastName: string;
  name: string;       // Combined first + last
  phone: string;
  email: string;
  officialCompany: string;
  casualCompany: string;
  company: string;    // Casual preferred, fallback to official
  website: string;
  city: string;
  state: string;
  aiSubjectLine: string;
  aiOpeningHook: string;
  hook: string;       // Alias for aiOpeningHook
  contactDate: string;
  followUpDate: string;
  called: string;
  emailed: string;
  callNotes: string;
  status: string;
  bought1Hr: string;
  bought3Hr: string;
  bought6Hr: string;
  referredBy: string;
  referralLeadDate: string;
  referralBookDate: string;
  referralBonusOwed: string;
  bonusPaid: string;
  // New pipeline tracking fields
  pipelineStage: string;
  objectionType: string;
  objectionDetails: string;
  competitorMention: string;
  interestLevel: string;
  lostReason: string;
}

async function getAuth() {
  let auth;

  // 1. Try Environment Variable (Production/Netlify)
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }
  // 2. Fallback to Local File (Development)
  else {
    try {
      const path = require('path');
      const keyFile = path.join(process.cwd(), '..', 'credentials.json');
      auth = new google.auth.GoogleAuth({
        keyFile,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    } catch (e) {
      console.error('Could not load local credentials.json');
    }
  }

  if (!auth) {
    throw new Error('No Google Cloud credentials found. Set GOOGLE_SHEETS_CREDENTIALS env var.');
  }

  return auth;
}

async function getSheetsService() {
  const auth = await getAuth();
  return google.sheets({ version: 'v4', auth });
}

function rowToLead(row: string[], rowNumber: number): Lead {
  const firstName = row[COL.firstName] || '';
  const lastName = row[COL.lastName] || '';
  const officialCompany = row[COL.officialCompany] || '';
  const casualCompany = row[COL.casualCompany] || '';
  const aiOpeningHook = row[COL.aiOpeningHook] || '';

  return {
    rowNumber,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim() || 'Unknown',
    phone: row[COL.phone] || '',
    email: row[COL.email] || '',
    officialCompany,
    casualCompany,
    company: casualCompany || officialCompany || 'Unknown Company',
    website: row[COL.website] || '',
    city: row[COL.city] || '',
    state: row[COL.state] || '',
    aiSubjectLine: row[COL.aiSubjectLine] || '',
    aiOpeningHook,
    hook: aiOpeningHook,
    contactDate: row[COL.contactDate] || '',
    followUpDate: row[COL.followUpDate] || '',
    called: row[COL.called] || '',
    emailed: row[COL.emailed] || '',
    callNotes: row[COL.callNotes] || '',
    status: row[COL.status] || 'Lead',
    bought1Hr: row[COL.bought1Hr] || '',
    bought3Hr: row[COL.bought3Hr] || '',
    bought6Hr: row[COL.bought6Hr] || '',
    referredBy: row[COL.referredBy] || '',
    referralLeadDate: row[COL.referralLeadDate] || '',
    referralBookDate: row[COL.referralBookDate] || '',
    referralBonusOwed: row[COL.referralBonusOwed] || '',
    bonusPaid: row[COL.bonusPaid] || '',
    // New pipeline tracking fields
    pipelineStage: row[COL.pipelineStage] || 'First Contact',
    objectionType: row[COL.objectionType] || '',
    objectionDetails: row[COL.objectionDetails] || '',
    competitorMention: row[COL.competitorMention] || '',
    interestLevel: row[COL.interestLevel] || '',
    lostReason: row[COL.lostReason] || '',
  };
}

// Get all leads from the sheet
export async function getAllLeads(): Promise<Lead[]> {
  const sheets = await getSheetsService();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A2:AE',  // Skip header, get columns A-AE (31 columns)
  });

  const rows = response.data.values || [];

  // Convert rows to Lead objects, with rowNumber (2 = first data row after header)
  return rows.map((row, index) => rowToLead(row, index + 2));
}

// Get a single lead by row number
export async function getLeadByRow(rowNumber: number): Promise<Lead | null> {
  if (rowNumber < 2) return null;  // Row 1 is header

  const sheets = await getSheetsService();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `A${rowNumber}:AE${rowNumber}`,  // 31 columns
  });

  const rows = response.data.values || [];
  if (rows.length === 0) return null;

  return rowToLead(rows[0], rowNumber);
}

// Update a single cell
export async function updateCell(rowNumber: number, column: number, value: string): Promise<void> {
  const sheets = await getSheetsService();

  // Convert column index to letter (0=A, 1=B, etc.)
  const colLetter = String.fromCharCode(65 + column);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${colLetter}${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[value]]
    }
  });
}

// Update status and call notes together
export async function updateLeadStatus(
  rowNumber: number,
  status: string,
  notes: string,
  called: string = 'Yes'
): Promise<void> {
  const sheets = await getSheetsService();

  // Update Called (column N), Call Notes (column P), Status (column Q)
  // Using batchUpdate for efficiency
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: [
        {
          range: `N${rowNumber}`,  // Called
          values: [[called]]
        },
        {
          range: `P${rowNumber}`,  // Call Notes
          values: [[notes]]
        },
        {
          range: `Q${rowNumber}`,  // Status
          values: [[status]]
        }
      ]
    }
  });
}

// Update contact date
export async function updateContactDate(rowNumber: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await updateCell(rowNumber, COL.contactDate, today);
}

// Update follow-up date and notes
export async function updateFollowUpDate(
  rowNumber: number,
  followUpDate: string,
  notes?: string
): Promise<void> {
  const sheets = await getSheetsService();

  const data = [
    {
      range: `M${rowNumber}`,  // Follow Up Date
      values: [[followUpDate]]
    }
  ];

  // Also update notes if provided
  if (notes) {
    data.push({
      range: `P${rowNumber}`,  // Call Notes
      values: [[notes]]
    });
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data
    }
  });
}

// Legacy function for backward compatibility
export async function getGoogleSheetData() {
  const leads = await getAllLeads();
  // Return raw row data for backward compatibility
  return leads.map(lead => [
    lead.firstName,
    lead.lastName,
    lead.phone,
    lead.email,
    lead.officialCompany,
    lead.casualCompany,
    lead.website,
    lead.city,
    lead.state,
    lead.aiSubjectLine,
    lead.aiOpeningHook,
    lead.contactDate,
    lead.followUpDate,
    lead.called,
    lead.emailed,
    lead.callNotes,
    lead.status,
    lead.bought1Hr,
    lead.bought3Hr,
    lead.bought6Hr,
    lead.referredBy,
    lead.referralLeadDate,
    lead.referralBookDate,
    lead.referralBonusOwed,
    lead.bonusPaid,
  ]);
}

// Detailed outcome data for pipeline tracking
export interface OutcomeDetails {
  notes: string;
  pipelineStage?: string;
  objectionType?: string;
  objectionDetails?: string;
  competitorMention?: string;
  interestLevel?: string;
  lostReason?: string;
}

// Update lead with detailed outcome data (for Not Interested, Follow Up, etc.)
export async function updateLeadWithOutcome(
  rowNumber: number,
  status: string,
  details: OutcomeDetails
): Promise<void> {
  const sheets = await getSheetsService();
  const today = new Date().toISOString().split('T')[0];

  // Build batch update data
  const data: Array<{ range: string; values: string[][] }> = [
    { range: `L${rowNumber}`, values: [[today]] },        // Contact Date
    { range: `N${rowNumber}`, values: [['Yes']] },        // Called
    { range: `P${rowNumber}`, values: [[details.notes]] }, // Call Notes
    { range: `Q${rowNumber}`, values: [[status]] },       // Status
  ];

  // Add pipeline tracking fields if provided
  if (details.pipelineStage) {
    data.push({ range: `Z${rowNumber}`, values: [[details.pipelineStage]] });
  }
  if (details.objectionType) {
    data.push({ range: `AA${rowNumber}`, values: [[details.objectionType]] });
  }
  if (details.objectionDetails) {
    data.push({ range: `AB${rowNumber}`, values: [[details.objectionDetails]] });
  }
  if (details.competitorMention) {
    data.push({ range: `AC${rowNumber}`, values: [[details.competitorMention]] });
  }
  if (details.interestLevel) {
    data.push({ range: `AD${rowNumber}`, values: [[details.interestLevel]] });
  }
  if (details.lostReason) {
    data.push({ range: `AE${rowNumber}`, values: [[details.lostReason]] });
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data
    }
  });
}

// Update just the pipeline stage (for quick stage changes)
export async function updatePipelineStage(
  rowNumber: number,
  stage: string
): Promise<void> {
  await updateCell(rowNumber, COL.pipelineStage, stage);
}

// Append new leads to the CRM
export interface NewLead {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  officialCompany: string;
  casualCompany?: string;
  website: string;
  city?: string;
  state?: string;
  aiSubjectLine?: string;
  aiOpeningHook?: string;
}

export async function appendLeadsToCRM(leads: NewLead[]): Promise<{ success: number; errors: string[] }> {
  const sheets = await getSheetsService();
  const errors: string[] = [];
  let success = 0;

  // Convert leads to row format
  const rows = leads.map(lead => {
    // Generate casual company name if not provided
    const casualName = lead.casualCompany || generateCasualName(lead.officialCompany);

    return [
      lead.firstName || '',           // A: First Name
      lead.lastName || '',            // B: Last Name
      lead.phone || '',               // C: Phone
      lead.email || '',               // D: Email
      lead.officialCompany,           // E: Official Company
      casualName,                     // F: Casual Company
      lead.website,                   // G: Website
      lead.city || '',                // H: City
      lead.state || '',               // I: State
      lead.aiSubjectLine || '',       // J: AI Subject Line
      lead.aiOpeningHook || '',       // K: AI Opening Hook
      '',                             // L: Contact Date
      '',                             // M: Follow Up Date
      '',                             // N: Called
      '',                             // O: Emailed
      '',                             // P: Call Notes
      'Lead',                         // Q: Status
      '',                             // R: Bought 1Hr
      '',                             // S: Bought 3Hr
      '',                             // T: Bought 6Hr
      '',                             // U: Referred By
      '',                             // V: Referral Lead Date
      '',                             // W: Referral Book Date
      '',                             // X: Referral Bonus Owed
      '',                             // Y: Bonus Paid
      'First Contact',                // Z: Pipeline Stage
      '',                             // AA: Objection Type
      '',                             // AB: Objection Details
      '',                             // AC: Competitor Mention
      '',                             // AD: Interest Level
      '',                             // AE: Lost Reason
    ];
  });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A:AE',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rows
      }
    });
    success = leads.length;
  } catch (e) {
    errors.push(`Failed to append leads: ${e}`);
  }

  return { success, errors };
}

// Generate a casual company name from official name
function generateCasualName(official: string): string {
  if (!official) return '';

  // Remove common suffixes
  let casual = official
    .replace(/,?\s*(LLC|Inc\.?|Corp\.?|Company|Co\.?|Group|Properties|Realty|Real Estate|& Associates|Associates)$/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return casual || official;
}

// Get existing emails for deduplication
export async function getExistingEmails(): Promise<Set<string>> {
  const sheets = await getSheetsService();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'D:D',  // Email column
  });

  const values = response.data.values || [];
  const emails = new Set<string>();

  values.forEach(row => {
    if (row[0] && typeof row[0] === 'string' && row[0].includes('@')) {
      emails.add(row[0].toLowerCase().trim());
    }
  });

  return emails;
}

// Get existing websites for deduplication
export async function getExistingWebsites(): Promise<Set<string>> {
  const sheets = await getSheetsService();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'G:G',  // Website column
  });

  const values = response.data.values || [];
  const websites = new Set<string>();

  values.forEach(row => {
    if (row[0] && typeof row[0] === 'string') {
      // Normalize URL
      let url = row[0].toLowerCase().trim();
      url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
      if (url) {
        websites.add(url);
      }
    }
  });

  return websites;
}

// Update lead enrichment data
export interface EnrichmentData {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  title?: string;
  aiSubjectLine: string;
  aiOpeningHook: string;
}

export async function updateLeadEnrichment(
  rowNumber: number,
  data: EnrichmentData
): Promise<void> {
  const sheets = await getSheetsService();

  const updates: Array<{ range: string; values: string[][] }> = [
    { range: `A${rowNumber}`, values: [[data.firstName]] },
    { range: `B${rowNumber}`, values: [[data.lastName]] },
    { range: `J${rowNumber}`, values: [[data.aiSubjectLine]] },
    { range: `K${rowNumber}`, values: [[data.aiOpeningHook]] },
  ];

  if (data.phone) {
    updates.push({ range: `C${rowNumber}`, values: [[data.phone]] });
  }
  if (data.email) {
    updates.push({ range: `D${rowNumber}`, values: [[data.email]] });
  }

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: updates
    }
  });
}
