export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Bad name patterns
const BAD_NAMES = [
  'partner', 'owner', 'broker', 'agent', 'team', 'office', 'staff', 'admin',
  'manager', 'director', 'president', 'ceo', 'unknown', 'n/a', 'na', 'none',
];

const COMPANY_WORDS = [
  'realty', 'properties', 'real estate', 'associates', 'group', 'llc', 'inc',
  'company', 'corp', 'brokerage', 'agency', 'homes', 'home',
];

// Generic email prefixes
const GENERIC_EMAIL_PREFIXES = [
  'info', 'contact', 'hello', 'sales', 'admin', 'office', 'support', 'team',
  'mail', 'inquiries', 'general', 'help', 'service', 'inquiry',
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
  /\[city\]/i,
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
  /i'm reaching out/i,
  /your brokerage/i,
];

export function validateFirstName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nameLower = name.toLowerCase().trim();

  if (!name || name.trim().length === 0) {
    errors.push('First name is required');
  } else if (name.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  if (BAD_NAMES.includes(nameLower)) {
    errors.push(`"${name}" is not a valid first name`);
  }

  for (const word of COMPANY_WORDS) {
    if (nameLower.includes(word)) {
      errors.push(`First name contains company word: "${word}"`);
      break;
    }
  }

  // Check for all caps
  if (name === name.toUpperCase() && name.length > 2) {
    warnings.push('Name is all caps - consider proper case');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateLastName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nameLower = name.toLowerCase().trim();

  if (!name || name.trim().length === 0) {
    errors.push('Last name is required');
  } else if (name.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  for (const word of COMPANY_WORDS) {
    if (nameLower.includes(word)) {
      errors.push(`Last name contains company word: "${word}"`);
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!email || email.trim().length === 0) {
    warnings.push('Email is empty - lead may be harder to reach');
    return { valid: true, errors, warnings };
  }

  // Basic email format check
  if (!email.includes('@') || !email.includes('.')) {
    errors.push('Invalid email format');
    return { valid: false, errors, warnings };
  }

  const prefix = email.split('@')[0].toLowerCase();
  if (GENERIC_EMAIL_PREFIXES.includes(prefix)) {
    errors.push(`Generic email prefix "${prefix}@" - find personal email`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateSubjectLine(subject: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!subject || subject.trim().length === 0) {
    errors.push('Subject line is required');
    return { valid: false, errors, warnings };
  }

  if (subject.length > 60) {
    warnings.push('Subject line over 60 chars - may be truncated in inbox');
  }

  for (const pattern of GENERIC_SUBJECT_PATTERNS) {
    if (pattern.test(subject)) {
      errors.push('Subject line is too generic - make it specific');
      break;
    }
  }

  // Check for personalization (should contain a proper noun or specific reference)
  const hasCapitalWord = /[A-Z][a-z]+/.test(subject);
  const hasNumber = /\d/.test(subject);
  if (!hasCapitalWord && !hasNumber) {
    warnings.push('Subject lacks personalization - add name, company, or specific detail');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateOpeningHook(hook: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!hook || hook.trim().length === 0) {
    errors.push('Opening hook is required');
    return { valid: false, errors, warnings };
  }

  if (hook.length > 300) {
    warnings.push('Hook over 300 chars - keep it concise');
  }

  for (const pattern of GENERIC_HOOK_PATTERNS) {
    if (pattern.test(hook)) {
      errors.push('Hook contains generic language - make it specific');
      break;
    }
  }

  // Check for specific facts (numbers, proper nouns)
  const hasNumber = /\d/.test(hook);
  const hasProperNoun = /[A-Z][a-z]+/.test(hook);

  if (!hasNumber && !hasProperNoun) {
    errors.push('Hook lacks specific facts - add verifiable details (years, amounts, names)');
  } else if (!hasNumber) {
    warnings.push('Consider adding specific numbers (years, agents, volume)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateEnrichmentForm(data: {
  firstName: string;
  lastName: string;
  email?: string;
  aiSubjectLine: string;
  aiOpeningHook: string;
}): ValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  const firstNameResult = validateFirstName(data.firstName);
  allErrors.push(...firstNameResult.errors);
  allWarnings.push(...firstNameResult.warnings);

  const lastNameResult = validateLastName(data.lastName);
  allErrors.push(...lastNameResult.errors);
  allWarnings.push(...lastNameResult.warnings);

  if (data.email) {
    const emailResult = validateEmail(data.email);
    allErrors.push(...emailResult.errors);
    allWarnings.push(...emailResult.warnings);
  }

  const subjectResult = validateSubjectLine(data.aiSubjectLine);
  allErrors.push(...subjectResult.errors);
  allWarnings.push(...subjectResult.warnings);

  const hookResult = validateOpeningHook(data.aiOpeningHook);
  allErrors.push(...hookResult.errors);
  allWarnings.push(...hookResult.warnings);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}
