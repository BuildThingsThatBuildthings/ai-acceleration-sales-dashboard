---
description: Find real estate brokerages in target city
argument-hint: [city] [state]
allowed-tools: Read, Write, Bash, firecrawl_search, firecrawl_map
---

# Lead Scraping Workflow

## Input File
**.tmp/target_cities.json** - Created by /research-cities

## Output File
**.tmp/scraped_leads.json** - Used by /enrich-leads

## Arguments
- $1 = city name (e.g., "Louisville")
- $2 = state abbreviation (e.g., "KY")

## Directive Reference
Read @directives/scrape-google-maps.md for search queries and validation rules.

## Workflow

### Step 1: Validate City
Load .tmp/target_cities.json and verify $1 (city) exists in $2 (state)'s selected cities.
If city not in researched list, STOP and return error.

### Step 2: Execute Firecrawl Search
Use firecrawl_search with queries from directive:
```
"Real Estate Brokerage $1 $2"
"Real Estate Broker $1 $2"
"Realtor Association $2"
"Commercial Real Estate $1 $2"
```

### Step 3: Extract Lead Data
For each result, extract:
```json
{
  "business_name": "ABC Realty LLC",
  "website_url": "https://abcrealty.com",
  "city": "$1",
  "state": "$2",
  "source": "firecrawl_search",
  "scraped_at": "ISO-8601 timestamp"
}
```

### Step 4: Deduplicate
Remove duplicate entries by website_url (normalized to lowercase, no trailing slash).

### Step 5: Validate Results
- Minimum 10 leads required
- All leads must have valid website_url (starts with http)
- No duplicate website URLs

### Step 6: Save Output
Write to **.tmp/scraped_leads.json**:
```json
{
  "city": "Louisville",
  "state": "KY",
  "scraped_at": "2024-01-15T10:00:00Z",
  "lead_count": 25,
  "leads": [
    {
      "business_name": "ABC Realty LLC",
      "website_url": "https://abcrealty.com",
      "city": "Louisville",
      "state": "KY",
      "source": "firecrawl_search"
    }
  ],
  "status": "success"
}
```

## Validation
- File .tmp/scraped_leads.json exists
- lead_count >= 10
- All leads have website_url
- status == "success"

## Self-Annealing
On Firecrawl API error:
1. Log the error message
2. Check API rate limits
3. If rate limited, wait and retry
4. If persistent failure, try fallback: `python execution/scrape_firecrawl.py --city "$1" --state "$2"`
5. Update @directives/scrape-google-maps.md Learnings Log

## Success Message
"{lead_count} leads scraped for $1, $2. Output: .tmp/scraped_leads.json"

## Failure Handling
If fewer than 10 leads found:
1. Try additional search queries
2. Expand search radius
3. If still < 10, save what was found with status: "partial"
4. Document in Learnings Log

## Next Step
Run /enrich-leads
