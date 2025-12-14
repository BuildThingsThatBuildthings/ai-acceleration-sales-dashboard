---
description: Write enriched leads to Google Sheets CRM
allowed-tools: Read, Write, Bash
---

# CRM Update Workflow

## Input Files
- **.tmp/enriched_leads.json** - Created by /enrich-leads
- **.tmp/crm_setup_complete.json** - Created by /setup-crm (validates CRM is ready)

## Output File
**.tmp/crm_update_receipt.json** - Receipt of what was written to CRM

## Directive Reference
Read @directives/update-crm.md for column mappings and AI field generation.

## Workflow

### Step 1: Verify Prerequisites
Check .tmp/crm_setup_complete.json exists and status == "success".
If missing, STOP and instruct to run /setup-crm first.

### Step 2: Load Enriched Leads
Read .tmp/enriched_leads.json and extract leads array.
Verify enriched_count > 0.

### Step 3: Generate AI Fields
For each lead, generate:

**Casual Company Name** (Column F):
Strip from business_name: LLC, Inc, Inc., Corp, Corp., Ltd, Ltd., LLP, Realty, Real Estate, Properties, Group, Company, Associates, & Associates

**AI Subject Line** (Column J):
5 words, B2B hook. Templates:
- "AI transforms your brokerage operations"
- "Automation is your competitive edge"
- "Turn AI into operational asset"
- "Your agents need AI tools"
- "Stop losing deals to inefficiency"

**AI Opening Hook** (Column K):
Max 20 words, hyper-local. Templates:
- "{City}'s competitive market demands efficiency—most brokers waste 3 hours daily on listing descriptions alone."
- "With inventory tight in {City}, your agents can't afford manual tasks eating their prospecting time."
- "{City}'s hot market moves fast—automated follow-ups catch leads your competitors miss."

### Step 4: Build Rows
Map each enriched lead to 25-column row:
```
A: first_name
B: last_name
C: phone
D: email
E: business_name
F: casual_company_name (generated)
G: website_url
H: city
I: state
J: ai_subject_line (generated)
K: ai_opening_hook (generated)
L: today's date (YYYY-MM-DD)
M-P: empty
Q: "Lead"
R-Y: empty
```

### Step 5: Deduplicate
Get existing emails from Column D in spreadsheet.
Skip any leads where email already exists.

### Step 6: Write to Google Sheet
Run the Python script to write leads:
```bash
python execution/write_to_sheets.py
```
This script handles authentication, deduplication, and appending rows.

### Step 7: Save Receipt
Write to **.tmp/crm_update_receipt.json**:
```json
{
  "timestamp": "2024-01-15T11:00:00Z",
  "spreadsheet_id": "1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0",
  "spreadsheet_url": "https://docs.google.com/spreadsheets/d/1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0/edit",
  "sheet_name": "Sheet1",
  "rows_written": 12,
  "rows_skipped_duplicate": 3,
  "row_range": "A2:Y14",
  "emails_added": ["john@abcrealty.com", "jane@xyzbrokers.com"],
  "status": "success"
}
```

## Validation
- File .tmp/crm_update_receipt.json exists
- status == "success"
- rows_written > 0 OR rows_skipped_duplicate == input_count (all dupes)

## Self-Annealing
On script failure:
1. Log the error and stack trace
2. Check .env has valid SPREADSHEET_ID and credentials.json exists
3. Verify service account is shared with spreadsheet
4. Update @directives/update-crm.md Learnings Log with:
   - API quota issues
   - Permission errors
   - Rate limit discoveries

## Success Message
"{rows_written} leads written to CRM ({rows_skipped_duplicate} duplicates skipped). Receipt: .tmp/crm_update_receipt.json"

## Failure Handling
If write fails completely:
1. Delete any partial .tmp/crm_update_receipt.json
2. Check spreadsheet permissions
3. Verify service account access
4. Return error with specific fix instructions

## Next Step
Run /generate-outreach
