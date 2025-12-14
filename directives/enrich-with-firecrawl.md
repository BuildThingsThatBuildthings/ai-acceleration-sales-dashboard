# Directive: Enrich Leads with Deep Research

## Purpose
This is the MOST CRITICAL stage. Do NOT use automated scripts for enrichment. Each lead requires MANUAL deep research using web searches to find:
1. Decision maker name, title, email, phone
2. Company-specific facts for personalized outreach

## CRITICAL: Deep Research Required

**DO NOT:**
- Use Python scripts to auto-generate subject lines or hooks
- Copy/paste the same generic hook for every lead
- Use "Partner" as a first name
- Leave any field empty that can be researched
- Use template phrases like "I've been following the [City] market"

**DO:**
- Web search each company + "owner" / "president" / "broker"
- Find specific facts: years in business, sales volume, awards, recent news, agent count
- Write UNIQUE subject lines referencing specific achievements
- Write UNIQUE opening hooks with facts only that person would know

## Input
Load leads from: `.tmp/clean_leads.json` (NOT scraped_leads.json)

## Target ICP (Ideal Customer Profile)

### Primary Decision Makers (Priority 1)
- CEO / President
- Managing Broker / Principal Broker
- Broker Owner / Broker/Owner
- Association Executive Director
- Education Director

### Secondary Decision Makers (Priority 2)
- COO / General Manager
- Office Manager
- Director of Operations

### NOT Targets (Skip These)
- Individual real estate agents (unless they own the brokerage)
- Administrative assistants
- Marketing coordinators
- Transaction coordinators

## Research Process (For Each Lead)

### Step 1: Find Decision Maker
Web search: `"[Company Name]" [City] owner OR president OR broker`

Look for:
- LinkedIn profiles
- Company about/team/staff pages
- Press releases
- Business journal articles

### Step 2: Find Contact Info
Web search: `"[Person Name]" [Company] email OR contact`

Also check:
- RocketReach, ZoomInfo (partial emails visible)
- Company website contact page
- LinkedIn (sometimes shows email)

### Step 3: Gather Personalization Facts
Web search: `"[Company Name]" [City] news OR award OR growth`

Find at least ONE specific fact:
- Sales volume ($X million in 2024)
- Agent count (X agents)
- Years in business (founded 19XX)
- Recent news (new office, acquisition, award)
- Leadership change (new CEO, promotion)
- Philanthropy (charity involvement)
- Unique background (military, career pivot)

### Step 4: Write Personalized Content

**AI Subject Line Requirements:**
- Must reference something SPECIFIC to the person/company
- Should create curiosity or recognition
- Examples:
  - "Congrats on the historic promotion, Stacy"
  - "$479M in 2024—what's the 2025 plan?"
  - "70 years of Louisville real estate—what's next?"

**AI Opening Hook Requirements:**
- Must include a SPECIFIC FACT only they would recognize
- Should feel like you actually researched them
- 1-3 sentences max
- Examples:
  - "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents across Semonin, Huff, and Rector Hayden—that's a massive responsibility."
  - "Going from healthcare finance startup to $150M+ in sales in 5 years—and founding the YP board for Coalition for The Homeless—tells me you move fast and give back."

## Output Format

Each enriched lead MUST have ALL of these fields:
```json
{
  "first_name": "Stacy",
  "last_name": "Durbin",
  "phone": "(502) 420-5000",
  "email": "stacydurbin@homeservices.com",
  "official_company_name": "Semonin Realtors / HomeServices KOI",
  "casual_company_name": "Semonin",
  "website_url": "https://www.semonin.com/",
  "city": "Louisville",
  "state": "KY",
  "ai_subject_line": "Congrats on the historic promotion, Stacy",
  "ai_opening_hook": "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents across Semonin, Huff, and Rector Hayden—that's a massive responsibility. I imagine you're thinking about how to give your agents a competitive edge.",
  "title": "President"
}
```

## Quality Standards

### Subject Line Checklist
- [ ] References specific person or company achievement?
- [ ] Would make recipient think "how do they know that?"
- [ ] Under 50 characters?
- [ ] No generic phrases?

### Opening Hook Checklist
- [ ] Contains at least ONE specific fact about them?
- [ ] Fact is verifiable (from their website, news, LinkedIn)?
- [ ] Feels personalized, not templated?
- [ ] Under 3 sentences?
- [ ] Transitions naturally to the pitch?

## Success Criteria
- 100% of leads have real first + last name (not "Partner")
- 100% have personal email (not info@, contact@)
- 100% have UNIQUE subject line with specific reference
- 100% have UNIQUE opening hook with researched fact
- 80%+ have phone number

## Fallback: Automated Script
ONLY use `execution/scrape_firecrawl.py` to find email addresses.
NEVER use it to generate subject lines or hooks - those must be manually researched.

---

## Learnings Log

### 2025-12-10: Louisville KY Deep Research Session

**What Works:**
- Web searching "[Company] [City] owner president broker" finds decision makers
- RocketReach/ZoomInfo show partial emails that can be completed
- LinkedIn shows career history for personalization
- Lane Report, Business First have local business news

**Best Personalization Angles:**
1. Recent promotion/leadership change (Stacy Durbin - first woman to lead)
2. Sales volume achievement (Homepage Realty - $479M in 2024)
3. Unique background (Joe Hayden - Air Ambulance pilot, Kyle Elmore - healthcare finance)
4. Philanthropy (Jay Gulick - $53M raised for Louisville Urban League)
5. Company milestone (BHHS Parks & Weisberg - 70 years, Dahlem - 3rd generation)
6. Industry recognition (#1 agent, awards, market share)

**Time Investment:**
- Proper research: 5-10 minutes per lead
- Result: High-quality leads that actually get responses
- vs. automated: 5 seconds per lead, garbage output, zero responses

### 2025-12-10: Roanoke VA Session

**Rate Limiting:**
- Firecrawl API has strict limits (~10-15 requests before 429)
- Use web search instead of Firecrawl for research
- Reserve Firecrawl for email extraction only

**Page Priority:**
1. `/staff` - Best for associations
2. `/our-team` - Decision makers
3. `/about-us` - Company history/facts
