// Aggregator domains to filter out (ported from execution/filter_leads.py)
export const SKIP_DOMAINS = [
  // Major portals
  'realtor.com', 'zillow.com', 'homes.com', 'redfin.com', 'trulia.com',
  'realtor.ca', 'homesnap.com', 'homefinder.com',

  // Commercial aggregators
  'loopnet.com', 'crexi.com', 'costar.com', 'commercialcafe.com',

  // Directories
  'apartments.com', 'yellowpages.com', 'yelp.com', 'bbb.org',
  'manta.com', 'superpages.com', 'citysearch.com',

  // Social media
  'facebook.com', 'linkedin.com', 'instagram.com', 'twitter.com',
  'tiktok.com', 'youtube.com', 'pinterest.com',

  // National franchise directories
  'compass.com/agents', 'coldwellbanker.com/agent', 'century21.com/real-estate-agent',
  'remax.com/real-estate-agents', 'kw.com/agent', 'sothebysrealty.com/agent',
  'bhhs.com/agent',

  // Agent rating sites
  'movoto.com', 'estately.com', 'fastexpert.com', 'listwithclever.com',
  'homelight.com', 'upnest.com', 'ideal-agent.com', 'clever.com',
  'homeguide.com', 'thumbtack.com',

  // Job/company info sites
  'glassdoor.com', 'indeed.com', 'ziprecruiter.com',
  'usnews.com', 'newsweek.com',

  // Government sites
  '.gov', 'krec.ky.gov', 'trec.texas.gov', 'dre.ca.gov',

  // Corporate parent sites
  'anywhere.re', 'realogy.com', 'homeservicesofamerica.com',

  // Data aggregators
  'rocketreach.co', 'zoominfo.com', 'contactout.com', 'datanyze.com',
  'lusha.com', 'apollo.io',

  // News/media
  'bizjournals.com', 'inman.com', 'realtrends.com',
];

// Bad business name patterns
const BAD_NAME_PATTERNS = [
  /^Find Realtors/i,
  /^Top Real Estate Agents/i,
  /^Search for a Real Estate/i,
  /^Best.*Realtors/i,
  /^Real Estate Agents in/i,
  /^\d+.*Best/i,
  /Realtor & Real Estate Agent Reviews/i,
  /Real Estate & Homes for Sale$/i,
];

export interface RawLead {
  name?: string;
  business_name?: string;
  title?: string;
  url?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  description?: string;
}

export interface FilteredLead {
  businessName: string;
  website: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  description: string;
}

export interface FilterResult {
  clean: FilteredLead[];
  filtered: Array<{ lead: RawLead; reason: string }>;
  stats: {
    total: number;
    kept: number;
    filtered: number;
    aggregators: number;
    badNames: number;
    duplicates: number;
  };
}

function isAggregator(url: string): boolean {
  if (!url) return false;
  const urlLower = url.toLowerCase();
  for (const domain of SKIP_DOMAINS) {
    if (urlLower.includes(domain)) {
      return true;
    }
  }
  return false;
}

function isBadBusinessName(name: string): boolean {
  if (!name) return true;
  for (const pattern of BAD_NAME_PATTERNS) {
    if (pattern.test(name)) {
      return true;
    }
  }
  return false;
}

function cleanBusinessName(name: string): string {
  if (!name) return '';
  // Remove common suffixes that got scraped
  let cleaned = name.replace(/\s*[-|:–]\s*.*$/, ''); // Remove everything after dash/pipe
  cleaned = cleaned.replace(/\s*\|\s*.*$/, '');
  cleaned = cleaned.trim();
  return cleaned;
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  let normalized = url.toLowerCase().trim();
  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');
  // Remove www.
  normalized = normalized.replace(/^www\./, '');
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  return normalized;
}

export function filterLeads(leads: RawLead[]): FilterResult {
  const clean: FilteredLead[] = [];
  const filtered: Array<{ lead: RawLead; reason: string }> = [];
  const seenUrls = new Set<string>();

  let aggregators = 0;
  let badNames = 0;
  let duplicates = 0;

  for (const lead of leads) {
    const url = lead.url || lead.website || '';
    const name = lead.name || lead.business_name || lead.title || '';

    // Check for aggregator domains
    if (isAggregator(url)) {
      filtered.push({ lead, reason: 'Aggregator domain' });
      aggregators++;
      continue;
    }

    // Check for bad business names
    if (isBadBusinessName(name)) {
      filtered.push({ lead, reason: 'Bad business name pattern' });
      badNames++;
      continue;
    }

    // Check for duplicates
    const normalizedUrl = normalizeUrl(url);
    if (normalizedUrl && seenUrls.has(normalizedUrl)) {
      filtered.push({ lead, reason: 'Duplicate URL' });
      duplicates++;
      continue;
    }
    if (normalizedUrl) {
      seenUrls.add(normalizedUrl);
    }

    // Clean and add to results
    clean.push({
      businessName: cleanBusinessName(name),
      website: url,
      address: lead.address || '',
      city: lead.city || '',
      state: lead.state || '',
      phone: lead.phone || '',
      description: lead.description || '',
    });
  }

  return {
    clean,
    filtered,
    stats: {
      total: leads.length,
      kept: clean.length,
      filtered: filtered.length,
      aggregators,
      badNames,
      duplicates,
    },
  };
}

// Parse JSON from file upload
export function parseLeadsJson(jsonString: string): RawLead[] {
  try {
    const data = JSON.parse(jsonString);
    // Handle both array and object with leads property
    if (Array.isArray(data)) {
      return data;
    }
    if (data.leads && Array.isArray(data.leads)) {
      return data.leads;
    }
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }
    throw new Error('JSON must be an array of leads or an object with a leads/results property');
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw e;
  }
}
