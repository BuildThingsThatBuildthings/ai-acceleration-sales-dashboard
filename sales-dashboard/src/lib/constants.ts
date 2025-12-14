// CRM Constants - Can be imported in both client and server components

// Pipeline stage options
export const PIPELINE_STAGES = [
  'First Contact',
  'Interested',
  'Demo Scheduled',
  'Negotiating',
  'Closed Won',
  'Closed Lost'
] as const;

// Objection type options
export const OBJECTION_TYPES = [
  'Budget',
  'Time',
  'Skepticism',
  'Authority',
  'Competition',
  'Other'
] as const;

// Interest level options
export const INTEREST_LEVELS = ['Cold', 'Warm', 'Hot'] as const;

// Lost reason options
export const LOST_REASONS = [
  'Price',
  'Timing',
  'Competitor',
  'Not Right Fit',
  'No Response'
] as const;

// Type exports
export type PipelineStage = typeof PIPELINE_STAGES[number];
export type ObjectionType = typeof OBJECTION_TYPES[number];
export type InterestLevel = typeof INTEREST_LEVELS[number];
export type LostReason = typeof LOST_REASONS[number];
