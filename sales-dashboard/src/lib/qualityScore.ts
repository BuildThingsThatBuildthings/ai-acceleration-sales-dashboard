import { Lead } from './google';

// Quality metrics interface
export interface QualityMetrics {
  totalLeads: number;
  overallScore: number;
  nameCompleteness: number;
  personalEmailRate: number;
  duplicateSubjectCount: number;
  duplicateHookCount: number;
  phoneCompleteness: number;
  genericContentCount: number;
  aggregatorCount: number;
  issues: QualityIssue[];
}

export interface QualityIssue {
  rowNumber: number;
  company: string;
  type: 'name' | 'email' | 'subject' | 'hook' | 'aggregator' | 'phone';
  severity: 'critical' | 'high' | 'medium';
  message: string;
  field: string;
  value: string;
}

// Bad name patterns (company words in person names)
const BAD_NAME_PATTERNS = [
  /^partner$/i,
  /^owner$/i,
  /^broker$/i,
  /^agent$/i,
  /^manager$/i,
  /^team$/i,
  /^office$/i,
  /^staff$/i,
  /^admin$/i,
  /realty/i,
  /properties/i,
  /real estate/i,
  /associates/i,
  /group$/i,
  /llc$/i,
  /inc$/i,
];

// Generic email prefixes
const GENERIC_EMAIL_PREFIXES = [
  'info@',
  'contact@',
  'hello@',
  'sales@',
  'admin@',
  'office@',
  'support@',
  'team@',
  'mail@',
  'inquiries@',
  'general@',
];

// Generic subject line patterns
const GENERIC_SUBJECT_PATTERNS = [
  /^question about/i,
  /^quick question/i,
  /regarding your/i,
  /^hello$/i,
  /^hi$/i,
  /following up/i,
  /\[company\]/i,
  /\[name\]/i,
];

// Generic hook patterns
const GENERIC_HOOK_PATTERNS = [
  /i've been following the .* market/i,
  /i noticed your company/i,
  /i came across your website/i,
  /i wanted to reach out/i,
  /i hope this email finds you/i,
  /help you/i,
  /help your team/i,
  /help your agents/i,
];

// Aggregator domains to detect
const AGGREGATOR_DOMAINS = [
  'realtor.com',
  'zillow.com',
  'homes.com',
  'redfin.com',
  'trulia.com',
  'loopnet.com',
  'apartments.com',
  'yellowpages.com',
  'yelp.com',
  'facebook.com',
  'linkedin.com',
  'movoto.com',
  'fastexpert.com',
  'homelight.com',
];

function isValidName(firstName: string, lastName: string): boolean {
  const name = `${firstName} ${lastName}`.trim().toLowerCase();
  if (!firstName || firstName.length < 2) return false;
  if (!lastName || lastName.length < 2) return false;

  for (const pattern of BAD_NAME_PATTERNS) {
    if (pattern.test(firstName) || pattern.test(lastName) || pattern.test(name)) {
      return false;
    }
  }
  return true;
}

function isPersonalEmail(email: string): boolean {
  if (!email) return false;
  const emailLower = email.toLowerCase();
  for (const prefix of GENERIC_EMAIL_PREFIXES) {
    if (emailLower.startsWith(prefix)) {
      return false;
    }
  }
  return true;
}

function isGenericSubject(subject: string): boolean {
  if (!subject) return true;
  for (const pattern of GENERIC_SUBJECT_PATTERNS) {
    if (pattern.test(subject)) {
      return true;
    }
  }
  return false;
}

function isGenericHook(hook: string): boolean {
  if (!hook) return true;
  for (const pattern of GENERIC_HOOK_PATTERNS) {
    if (pattern.test(hook)) {
      return true;
    }
  }
  return false;
}

function isAggregatorWebsite(website: string): boolean {
  if (!website) return false;
  const urlLower = website.toLowerCase();
  for (const domain of AGGREGATOR_DOMAINS) {
    if (urlLower.includes(domain)) {
      return true;
    }
  }
  return false;
}

function findDuplicates(values: string[]): Map<string, number[]> {
  const seen = new Map<string, number[]>();
  values.forEach((value, index) => {
    if (!value || value.trim() === '') return;
    const normalized = value.trim().toLowerCase();
    if (!seen.has(normalized)) {
      seen.set(normalized, []);
    }
    seen.get(normalized)!.push(index);
  });

  // Filter to only duplicates
  const duplicates = new Map<string, number[]>();
  seen.forEach((indices, value) => {
    if (indices.length > 1) {
      duplicates.set(value, indices);
    }
  });
  return duplicates;
}

export function calculateQualityMetrics(leads: Lead[]): QualityMetrics {
  const issues: QualityIssue[] = [];

  let validNames = 0;
  let personalEmails = 0;
  let hasPhone = 0;
  let genericContent = 0;
  let aggregators = 0;

  // Check each lead
  leads.forEach((lead) => {
    // Name check
    if (isValidName(lead.firstName, lead.lastName)) {
      validNames++;
    } else {
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'name',
        severity: 'critical',
        message: `Invalid name: "${lead.firstName} ${lead.lastName}"`,
        field: 'Name',
        value: `${lead.firstName} ${lead.lastName}`,
      });
    }

    // Email check
    if (lead.email && isPersonalEmail(lead.email)) {
      personalEmails++;
    } else if (lead.email) {
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'email',
        severity: 'high',
        message: `Generic email: ${lead.email}`,
        field: 'Email',
        value: lead.email,
      });
    }

    // Phone check
    if (lead.phone && lead.phone.trim() !== '') {
      hasPhone++;
    }

    // Generic content check
    if (isGenericSubject(lead.aiSubjectLine)) {
      genericContent++;
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'subject',
        severity: 'medium',
        message: `Generic subject line`,
        field: 'AI Subject Line',
        value: lead.aiSubjectLine || '(empty)',
      });
    }

    if (isGenericHook(lead.aiOpeningHook)) {
      genericContent++;
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'hook',
        severity: 'medium',
        message: `Generic opening hook`,
        field: 'AI Opening Hook',
        value: lead.aiOpeningHook?.substring(0, 100) || '(empty)',
      });
    }

    // Aggregator check
    if (isAggregatorWebsite(lead.website)) {
      aggregators++;
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'aggregator',
        severity: 'critical',
        message: `Aggregator website detected`,
        field: 'Website',
        value: lead.website,
      });
    }
  });

  // Check for duplicates
  const subjectDuplicates = findDuplicates(leads.map(l => l.aiSubjectLine));
  const hookDuplicates = findDuplicates(leads.map(l => l.aiOpeningHook));

  let duplicateSubjectCount = 0;
  subjectDuplicates.forEach((indices, value) => {
    duplicateSubjectCount += indices.length;
    indices.forEach((idx) => {
      const lead = leads[idx];
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'subject',
        severity: 'high',
        message: `Duplicate subject line (${indices.length} copies)`,
        field: 'AI Subject Line',
        value: value.substring(0, 50),
      });
    });
  });

  let duplicateHookCount = 0;
  hookDuplicates.forEach((indices, value) => {
    duplicateHookCount += indices.length;
    indices.forEach((idx) => {
      const lead = leads[idx];
      issues.push({
        rowNumber: lead.rowNumber,
        company: lead.company,
        type: 'hook',
        severity: 'high',
        message: `Duplicate opening hook (${indices.length} copies)`,
        field: 'AI Opening Hook',
        value: value.substring(0, 50),
      });
    });
  });

  // Calculate percentages
  const total = leads.length || 1;
  const nameCompleteness = (validNames / total) * 100;
  const personalEmailRate = (personalEmails / total) * 100;
  const phoneCompleteness = (hasPhone / total) * 100;

  // Calculate overall score (weighted)
  // 25pts: Names valid
  // 25pts: Emails personal
  // 20pts: Subject lines unique
  // 20pts: Hooks unique
  // 10pts: Phone numbers present
  const nameScore = (validNames / total) * 25;
  const emailScore = (personalEmails / total) * 25;
  const subjectScore = Math.max(0, 20 - (duplicateSubjectCount / total) * 20);
  const hookScore = Math.max(0, 20 - (duplicateHookCount / total) * 20);
  const phoneScore = (hasPhone / total) * 10;

  // Deductions
  const aggregatorDeduction = Math.min(10, aggregators * 2);
  const genericDeduction = Math.min(10, (genericContent / 2) * 0.5);

  const overallScore = Math.max(0, Math.min(100,
    nameScore + emailScore + subjectScore + hookScore + phoneScore - aggregatorDeduction - genericDeduction
  ));

  // Sort issues by severity
  const severityOrder = { critical: 0, high: 1, medium: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    totalLeads: total,
    overallScore: Math.round(overallScore),
    nameCompleteness: Math.round(nameCompleteness),
    personalEmailRate: Math.round(personalEmailRate),
    duplicateSubjectCount,
    duplicateHookCount,
    phoneCompleteness: Math.round(phoneCompleteness),
    genericContentCount: genericContent,
    aggregatorCount: aggregators,
    issues,
  };
}
