# Directive: Scrape Google Maps for Real Estate Leads

## Purpose
Identify real estate brokerages and associations in the target geography. This is Stage 1 of the pipeline - focus on finding REAL brokerages, not aggregator sites.

## Target Geography
- Tennessee (TN) - Primary: Nashville corridor
- Pennsylvania (PA) - Primary: Hershey area
- Virginia (VA) - Primary: Roanoke
- Kentucky (KY) - Primary: Louisville
- Maryland (MD)
- West Virginia (WV)

## CRITICAL: Filter Out Aggregators

**NEVER include these domains - they are NOT real brokerages:**
- realtor.com, zillow.com, homes.com, redfin.com, trulia.com
- loopnet.com, apartments.com, yellowpages.com, yelp.com
- facebook.com, linkedin.com, instagram.com, twitter.com
- compass.com, coldwellbanker.com, century21.com, remax.com (national pages only)
- kw.com, sothebysrealty.com, movoto.com, estately.com
- glassdoor.com, usnews.com, homeguide.com, listwithclever.com
- fastexpert.com, anywhere.re, *.gov sites

**ONLY include:**
- Local/regional brokerage websites (e.g., semonin.com, schulerbauer.com)
- State/local REALTOR associations (e.g., louisvillerealtors.com, rvar.com)
- Independent brokerages with their own domain

## Query Strings
Use these exact queries for consistency:
1. "Real Estate Brokerage" in [Target City]
2. "Real Estate Agency" [Target City] [State]
3. "Realty company" [Target City] [State]
4. "Realtor Association" in [Target State]
5. "Real Estate Board" in [Target State]

## Required Data Extraction
For each business found:
- **Business Name** (Official company name, cleaned up)
- **Website URL** (Must be the company's own domain)
- **Physical Address** (To confirm geography)
- **City**
- **State**

## Tool Usage

### Primary: Python Script
```bash
python execution/scrape_maps.py --city "[City]" --state "[State]"
```

### Then ALWAYS filter:
```bash
python execution/filter_leads.py
```

This removes aggregator sites and outputs to `.tmp/clean_leads.json`

### Fallback: Firecrawl MCP
If script fails:
```
firecrawl_search query="Real Estate Brokerage Louisville KY"
```

## Output Files

| File | Contents |
|------|----------|
| `.tmp/scraped_leads.json` | Raw scraped data (may include garbage) |
| `.tmp/clean_leads.json` | Filtered, deduplicated leads (use this for enrichment) |

## Output Format
```json
[
  {
    "business_name": "Semonin Realtors",
    "website_url": "https://www.semonin.com/",
    "city": "Louisville",
    "state": "KY",
    "source": "firecrawl_search",
    "scraped_at": "2025-12-10T00:00:00"
  }
]
```

## Validation Rules
1. Website URL must be the company's OWN domain (not an aggregator page)
2. Business must be a brokerage or association (NOT individual agent page)
3. Address must be in target geography
4. No duplicate entries (dedupe by website URL, case-insensitive)
5. Business name must be cleaned (no "Find Realtors in..." titles)

## Success Criteria
- Minimum 15-25 QUALITY leads per target city (quality > quantity)
- 100% have valid, non-aggregator website URLs
- 0 duplicates
- All leads are actual brokerages or associations

## Edge Cases
- **Multiple locations:** Include primary office only
- **Franchise vs independent:** Include local franchise offices (e.g., local Century21 office with unique domain)
- **Association vs board:** Include both (different decision makers)
- **No website:** Skip (can't enrich without it)
- **Agent personal site:** Skip unless they own a brokerage

## Rate Limiting
- Pause 1-2 seconds between searches
- Use batch operations when possible
- Respect Firecrawl API limits (~10-15 requests before rate limiting)

---

## Learnings Log

### 2025-12-10: Louisville KY & Roanoke VA Scraping

**Aggregator Problem:**
- Initial scrapes returned 40-60% aggregator sites (realtor.com, zillow.com, etc.)
- These are useless - no decision maker contact info
- MUST run filter_leads.py after every scrape

**Quality Leads Found:**
- Louisville: Semonin, BHHS Parks & Weisberg, Schuler Bauer, The Agency, Homepage Realty, GLAR
- Roanoke: RVAR, MKB Realtors, Nest Realty, Berkshire Hathaway Premier

**What Works:**
- Firecrawl search with specific city/state queries
- Running 3 query variations (Brokerage, Agency, Realty company)
- Filtering immediately after scraping

**What Doesn't Work:**
- Trusting raw scrape results
- Including national franchise directory pages
- Scraping without filtering
