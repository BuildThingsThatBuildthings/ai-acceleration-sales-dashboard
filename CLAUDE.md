# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Real estate lead generation and sales automation system for AI training workshops targeting brokerages and associations in TN, PA, VA, KY, MD, WV. Primary product is a $5,000 6-Hour In-Person AI Masterclass; downsell is a $3,000 3-Hour Implementation Workshop.

## CRITICAL: Quality Over Quantity

**The entire pipeline is worthless if it produces garbage data.**

### What GOOD Data Looks Like:
- First Name: "Stacy" (real person's name)
- AI Subject Line: "Congrats on the historic promotion, Stacy" (specific reference)
- AI Opening Hook: "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents..." (verifiable fact)

### What BAD Data Looks Like:
- First Name: "Partner" (not a name)
- AI Subject Line: "Quick question about [Company]" (lazy template)
- AI Opening Hook: "I've been following the Louisville market..." (generic garbage)

**If the CRM has bad data, DELETE IT and start over with proper research.**

## Architecture: 3-Layer System

### Layer 1: Directives (`directives/`)
- SOPs written in Markdown with quality standards
- Define goals, inputs, tools/scripts to use, outputs, edge cases
- Natural language instructions for the orchestration layer

### Layer 2: Orchestration (You)
- Read directives, call execution tools in correct order
- **CRITICAL:** For enrichment, YOU must do deep research using WebSearch
- Do NOT rely on automated scripts for subject lines or hooks
- Scripts can find emails; YOU must write personalized content

### Layer 3: Execution (`execution/`)
- Deterministic Python scripts for API calls, data processing
- Environment variables and API tokens stored in `.env`
- Scripts are for scraping/filtering - NOT for personalization

**Key principle:** Automate scraping, manually research personalization.

## Directory Structure

- `directives/` - Markdown SOPs (instruction set)
- `execution/` - Python scripts (deterministic tools)
- `.tmp/` - Intermediate files (scraped data, temp exports). Never commit.
- `.env` - Environment variables and API keys
- `credentials.json` - Google service account credentials (in .gitignore)

## Pipeline Stages & Quality Gates

### Stage 1: Scrape
```bash
python execution/scrape_maps.py --city "Louisville" --state "KY"
python execution/filter_leads.py
```
**Output:** `.tmp/clean_leads.json`
**Quality Gate:** 0% aggregator sites (zillow, realtor.com, etc.)

### Stage 2: Deep Research (MANUAL - CRITICAL)
**DO NOT use scripts for this stage.**

For EACH lead in `.tmp/clean_leads.json`:
1. WebSearch: `"[Company Name]" [City] owner president broker`
2. Find decision maker name, title, email, phone
3. WebSearch: `"[Company Name]" [City] news award growth`
4. Find personalization fact (sales volume, years in business, recent news, awards)
5. Write UNIQUE subject line referencing specific achievement
6. Write UNIQUE opening hook with verifiable fact

**Quality Gate:**
- 100% real names (no "Partner")
- 100% personal emails (no info@, contact@)
- 100% unique subject lines (no duplicates)
- 100% unique hooks with specific facts

### Stage 3: CRM Update
Write researched leads to Google Sheets using:
```bash
python execution/write_to_sheets.py
```
Or direct API calls.

**Quality Gate:** All 25 columns populated for each row.

### Stage 4: Email Generation
Generate 3-email sequences using templates in `directives/compose-outreach.md`

**Quality Gate:** Each email uses personalized subject line and hook from CRM.

## CRM Data Structure (Google Sheets)

Required headers (exact order, 25 columns):
```
First Name,Last Name,Phone Number,Email Address,Official Company Name,Casual Company Name,Website URL,City,State,AI Subject Line,AI Opening Hook,Contact Date,Follow Up Date,Called (Yes/No),Emailed (Yes/No),Call Notes,Status (Lead/Neg/Closed),Bought 1Hr Course (Check),Bought 3Hr Course (Check),Bought 6Hr Course (Check),Referred By (Name),Referral Lead Date,Referral Book Date,Referral Bonus Owed,Bonus Paid (Check)
```

## Target ICP

**Primary:** CEO, President, Managing Broker, Broker Owner, Association Executive Director, Education Director
**Secondary:** COO, Office Manager, Director of Operations
**Container:** Brokerages, Associations, Trade Groups (NOT individual agents)

## Aggregator Blacklist

NEVER include leads from these domains:
- realtor.com, zillow.com, homes.com, redfin.com, trulia.com
- loopnet.com, apartments.com, yellowpages.com, yelp.com
- facebook.com, linkedin.com, instagram.com, twitter.com
- fastexpert.com, movoto.com, homelight.com, anywhere.re

The `filter_leads.py` script removes these automatically.

## Subagents

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `lead-scraper` | Scrape brokerages | Initial lead discovery |
| `lead-enricher` | Find decision makers | After filtering (but YOU do the research) |
| `crm-writer` | Write to Google Sheets | After deep research complete |
| `outreach-composer` | Generate email sequences | After CRM has quality data |
| `directive-updater` | Update SOPs | After pipeline runs (capture learnings) |

## Pipeline Execution

**CORRECT way to run pipeline:**

1. **Scrape:** `python execution/scrape_maps.py --city "Louisville" --state "KY"`
2. **Filter:** `python execution/filter_leads.py`
3. **Research (MANUAL):** WebSearch each company, find decision maker + facts
4. **Write to CRM:** With researched, personalized data
5. **Generate emails:** Using CRM data as source

**WRONG way (produces garbage):**
- Running automated scripts that generate "AI Subject Lines"
- Copy/pasting same hook for every lead
- Using "Partner" as a name
- Skipping the research step

## Intermediate Files

| File | Stage | Contents |
|------|-------|----------|
| `.tmp/scraped_leads.json` | 1 | Raw scraped data (includes garbage) |
| `.tmp/clean_leads.json` | 1 | Filtered leads (no aggregators) |
| `.tmp/enriched_leads.json` | 2 | Optional - if using script for emails only |
| `.tmp/email_sequences.json` | 4 | 3-email sequences for Instantly.ai |

## Environment Setup

Required in `.env`:
```
FIRECRAWL_API_KEY=fc-your-key
SPREADSHEET_ID=your-google-sheet-id
SERVICE_ACCOUNT_PATH=credentials.json
```

## Quick Reference

```bash
# Check what's in .tmp
ls -la .tmp/

# Run scraper
python execution/scrape_maps.py --city "Louisville" --state "KY"

# Filter out garbage
python execution/filter_leads.py

# See clean leads count
cat .tmp/clean_leads.json | python3 -c "import json,sys; print(len(json.load(sys.stdin)))"
```

## Quality Checklist Before Outreach

Before sending ANY emails, verify:
- [ ] Every lead has a real person's first + last name
- [ ] Every email is personal (not info@, contact@)
- [ ] Every AI Subject Line references something specific
- [ ] Every AI Opening Hook contains a verifiable fact
- [ ] No two leads have identical subject lines
- [ ] No two leads have identical opening hooks
- [ ] All leads are from company websites (no aggregators)

**If any check fails, go back and fix the data. Do not send garbage.**
