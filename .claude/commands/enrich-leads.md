---
description: Extract decision-maker contacts from lead websites
allowed-tools: Read, Write, Bash, firecrawl_scrape, firecrawl_extract
---

# Lead Enrichment Workflow

## Input File
**.tmp/scraped_leads.json** - Created by /scrape-leads

## Output File
**.tmp/enriched_leads.json** - Used by /update-crm and /generate-outreach

## Directive Reference
Read @directives/enrich-with-firecrawl.md for ICP definitions and extraction rules.

## Workflow

### Step 1: Load Scraped Leads
Read .tmp/scraped_leads.json and extract leads array.
Verify status == "success" and lead_count > 0.

### Step 2: Define Contact Extraction Schema
```json
{
  "type": "object",
  "properties": {
    "contacts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "first_name": {"type": "string"},
          "last_name": {"type": "string"},
          "email": {"type": "string"},
          "phone": {"type": "string"},
          "title": {"type": "string"}
        }
      }
    }
  }
}
```

### Step 3: Scrape Contact Pages
For each lead, use firecrawl_scrape on these pages (in order):
1. /about
2. /about-us
3. /team
4. /our-team
5. /leadership
6. /staff
7. /roster
8. /management
9. /contact

Stop at first page that yields ICP contact.

### Step 4: Filter Contacts
Apply ICP filter from directive - target titles:
- Managing Broker
- Broker Owner
- Owner
- President
- Association Director
- Education Director
- Office Manager
- Director of Operations
- CEO
- Principal Broker

Filter out generic emails:
- info@, contact@, support@, hello@, sales@
- admin@, office@, general@, team@, help@

### Step 5: Enrich Lead Records
For each lead with valid contact found:
```json
{
  "business_name": "ABC Realty LLC",
  "website_url": "https://abcrealty.com",
  "city": "Louisville",
  "state": "KY",
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@abcrealty.com",
  "phone": "(502) 555-1234",
  "title": "Managing Broker",
  "enriched_at": "ISO-8601 timestamp"
}
```

### Step 6: Save Output
Write to **.tmp/enriched_leads.json**:
```json
{
  "city": "Louisville",
  "state": "KY",
  "enriched_at": "2024-01-15T11:00:00Z",
  "input_count": 25,
  "enriched_count": 18,
  "enrichment_rate": "72%",
  "leads": [
    {
      "business_name": "ABC Realty LLC",
      "website_url": "https://abcrealty.com",
      "city": "Louisville",
      "state": "KY",
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@abcrealty.com",
      "phone": "(502) 555-1234",
      "title": "Managing Broker"
    }
  ],
  "skipped": [
    {"business_name": "XYZ Properties", "reason": "No ICP contact found"}
  ],
  "status": "success"
}
```

## Validation
- File .tmp/enriched_leads.json exists
- enriched_count > 0
- All enriched leads have email (personal, not generic)
- status == "success"

## Self-Annealing
On Firecrawl API error:
1. Log the error and URL that failed
2. Skip problematic URL and continue
3. If > 50% fail, try fallback: `python execution/scrape_firecrawl.py`
4. Update @directives/enrich-with-firecrawl.md Learnings Log with:
   - URLs that consistently fail
   - New contact page patterns discovered
   - Rate limit thresholds

## Success Message
"{enriched_count} of {input_count} leads enriched ({enrichment_rate}). Output: .tmp/enriched_leads.json"

## Failure Handling
If enrichment rate < 20%:
1. Review skipped reasons
2. Consider expanding ICP titles
3. Check if websites have unusual structures
4. Save partial results with status: "low_enrichment"

## Next Step
Run /update-crm then /generate-outreach
