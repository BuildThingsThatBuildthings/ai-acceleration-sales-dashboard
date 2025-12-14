---
name: lead-gen-workflow
description: Orchestrate the full lead generation pipeline from scraping to outreach. Use when user wants to run the complete workflow or asks about the pipeline status.
allowed-tools: Read, Glob, Bash
---

# Lead Generation Pipeline Orchestration

## Pipeline Overview

```
[1. lead-scraper] → [2. lead-enricher] → [3. crm-writer] → [4. outreach-composer]
                                                  ↓
                                        [5. directive-updater] (on errors)
```

## Pipeline Stages

| Stage | Agent | Input | Output |
|-------|-------|-------|--------|
| 1 | lead-scraper | Target geography | `.tmp/scraped_leads.json` |
| 2 | lead-enricher | scraped_leads.json | `.tmp/enriched_leads.json` |
| 3 | crm-writer | enriched_leads.json | Google Sheets rows |
| 4 | outreach-composer | enriched_leads.json | `.tmp/email_sequences.json` |

## Running the Full Pipeline

### Option 1: Fully Automated (via Hooks)
Just invoke the first agent:
```
Use the lead-scraper agent to find brokerages in Nashville, TN
```
The SubagentStop hooks will automatically chain to the next stage.

### Option 2: Manual Stage-by-Stage
```
1. "Use lead-scraper to find brokerages in Nashville, TN"
2. "Use lead-enricher to find decision makers"
3. "Use crm-writer to update Google Sheets"
4. "Use outreach-composer to generate email sequences"
```

## Target Geography

| State | Abbreviation | Primary City |
|-------|--------------|--------------|
| Tennessee | TN | Nashville |
| Pennsylvania | PA | Hershey |
| Virginia | VA | Richmond |
| Kentucky | KY | Louisville |
| Maryland | MD | Baltimore |
| West Virginia | WV | Charleston |

## Target ICP (Ideal Customer Profile)

**Primary Decision Makers:**
- Managing Broker
- Broker Owner
- President
- Association Director
- Education Director

**Secondary Decision Makers:**
- Office Manager
- Director of Operations

**Container (NOT Target):**
- Individual real estate agents

## Intermediate Files

| File | Created By | Contents |
|------|------------|----------|
| `.tmp/scraped_leads.json` | lead-scraper | Raw business data |
| `.tmp/enriched_leads.json` | lead-enricher | Contacts added |
| `.tmp/email_sequences.json` | outreach-composer | 3-email sequences |

## Pipeline Status Check

Check which stages are complete:
```bash
ls -la .tmp/
```

Expected files when complete:
- `scraped_leads.json` - Stage 1 complete
- `enriched_leads.json` - Stage 2 complete
- `email_sequences.json` - Stage 4 complete

Google Sheets updated = Stage 3 complete

## Error Handling

If any stage fails:
1. The directive-updater agent is invoked
2. Error is logged and analyzed
3. Directive is updated with learnings
4. Fix is applied if possible
5. Stage can be re-run

## Deliverables

**Intermediate (local):**
- JSON files in `.tmp/`
- These are for processing only
- Can be deleted and regenerated

**Final (cloud):**
- Google Sheets CRM (primary deliverable)
- Instantly.ai campaign (export from `.tmp/email_sequences.json`)

## Metrics

Track success by:
- Leads scraped per city (target: 20+)
- Enrichment rate (% with valid emails)
- CRM rows written
- Email sequences generated

## Quick Commands

```
# Check pipeline status
ls -la .tmp/

# View scraped lead count
cat .tmp/scraped_leads.json | jq length

# View enriched lead count
cat .tmp/enriched_leads.json | jq length

# View email sequence count
cat .tmp/email_sequences.json | jq length
```
