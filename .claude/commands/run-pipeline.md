---
description: Run full lead gen pipeline for a city
argument-hint: [city] [state]
allowed-tools: Read, Write, Bash, SlashCommand, firecrawl_search, firecrawl_scrape, firecrawl_extract, firecrawl_map, mcp__google-sheets__*
---

# Full Pipeline Workflow

## Input File
**.tmp/target_cities.json** - Created by /research-cities

## Output File
**.tmp/pipeline_run_summary.json** - Complete audit trail of pipeline execution

## Arguments
- $1 = city name (e.g., "Louisville")
- $2 = state abbreviation (e.g., "KY")

## Pre-requisite Check
Verify .tmp/target_cities.json exists and contains $1 (city) in $2 (state)'s selected cities.
If missing, STOP and instruct to run /research-cities first.

## Pipeline Sequence

Execute each command in order, validating output before proceeding:

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: /setup-crm                                          │
│ Output: .tmp/crm_setup_complete.json                        │
│ Validation: status == "success", headers_written == 25      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: /scrape-leads $1 $2                                 │
│ Output: .tmp/scraped_leads.json                             │
│ Validation: status == "success", lead_count >= 10           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: /enrich-leads                                       │
│ Output: .tmp/enriched_leads.json                            │
│ Validation: status == "success", enriched_count > 0         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: /update-crm                                         │
│ Output: .tmp/crm_update_receipt.json                        │
│ Validation: status == "success"                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: /generate-outreach                                  │
│ Output: .tmp/email_sequences.json                           │
│ Validation: status == "success", email_count > 0            │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Execution

### Execute Step 1: Setup CRM
Run the workflow from /setup-crm command.
After completion, read .tmp/crm_setup_complete.json and verify:
- File exists
- status == "success"
- headers_written == 25

If validation fails, STOP pipeline. Log: "Pipeline failed at Step 1: /setup-crm"

### Execute Step 2: Scrape Leads
Run the workflow from /scrape-leads with $1 $2 arguments.
After completion, read .tmp/scraped_leads.json and verify:
- File exists
- status == "success"
- lead_count >= 10

If validation fails, STOP pipeline. Log: "Pipeline failed at Step 2: /scrape-leads"

### Execute Step 3: Enrich Leads
Run the workflow from /enrich-leads command.
After completion, read .tmp/enriched_leads.json and verify:
- File exists
- status == "success"
- enriched_count > 0

If validation fails, STOP pipeline. Log: "Pipeline failed at Step 3: /enrich-leads"

### Execute Step 4: Update CRM
Run the workflow from /update-crm command.
After completion, read .tmp/crm_update_receipt.json and verify:
- File exists
- status == "success"

If validation fails, STOP pipeline. Log: "Pipeline failed at Step 4: /update-crm"

### Execute Step 5: Generate Outreach
Run the workflow from /generate-outreach command.
After completion, read .tmp/email_sequences.json and verify:
- File exists
- status == "success"
- email_count > 0

If validation fails, STOP pipeline. Log: "Pipeline failed at Step 5: /generate-outreach"

## Save Pipeline Summary

Write to **.tmp/pipeline_run_summary.json**:
```json
{
  "timestamp": "2024-01-15T12:00:00Z",
  "city": "Louisville",
  "state": "KY",
  "steps_completed": [
    "/setup-crm",
    "/scrape-leads",
    "/enrich-leads",
    "/update-crm",
    "/generate-outreach"
  ],
  "outputs_generated": {
    "crm_setup": ".tmp/crm_setup_complete.json",
    "scraped_leads": ".tmp/scraped_leads.json",
    "enriched_leads": ".tmp/enriched_leads.json",
    "crm_receipt": ".tmp/crm_update_receipt.json",
    "email_sequences": ".tmp/email_sequences.json"
  },
  "metrics": {
    "leads_scraped": 25,
    "leads_enriched": 18,
    "leads_written_to_crm": 15,
    "emails_generated": 45
  },
  "spreadsheet_url": "https://docs.google.com/spreadsheets/d/1wS3HfG.../edit",
  "status": "success"
}
```

## Validation
- File .tmp/pipeline_run_summary.json exists
- All 5 steps in steps_completed
- All 5 output files exist
- status == "success"

## Self-Annealing
On any step failure:
1. Log which step failed and why
2. Save partial summary with status: "failed_at_step_N"
3. Apply self-annealing from failed command
4. Resume pipeline from failed step if fix succeeds

## Success Message
```
Pipeline complete for $1, $2.

Metrics:
- Leads scraped: {leads_scraped}
- Leads enriched: {leads_enriched}
- Leads in CRM: {leads_written_to_crm}
- Emails ready: {emails_generated}

CRM: {spreadsheet_url}
Summary: .tmp/pipeline_run_summary.json
```

## Failure Handling
If pipeline fails at any step:
1. Report exactly which step failed
2. Preserve outputs from successful steps
3. Provide specific fix instructions
4. Pipeline can be resumed from failed step after fix
