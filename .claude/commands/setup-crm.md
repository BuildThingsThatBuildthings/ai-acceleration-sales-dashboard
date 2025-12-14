---
description: Set up Google Sheet with 25-column CRM headers
allowed-tools: Read, Write, Bash
---

# CRM Setup Workflow

## Output File
**.tmp/crm_setup_complete.json** - Receipt confirming headers are set

## Input
Reads from `.env`:
- SPREADSHEET_ID
- SHEET_NAME (default: Sheet1)

## Directive Reference
Read @directives/update-crm.md for the required 25-column header structure.

## Workflow

### Step 1: Load Configuration
Read .env for SPREADSHEET_ID and SHEET_NAME.

### Step 2: Check Existing Headers
Run the Python script to check and set up headers:
```bash
python execution/setup_crm_headers.py
```

### Step 3: Write Headers if Missing
The Python script will write all 25 headers if row 1 is empty or incomplete:
```
First Name | Last Name | Phone Number | Email Address | Official Company Name |
Casual Company Name | Website URL | City | State | AI Subject Line |
AI Opening Hook | Contact Date | Follow Up Date | Called (Yes/No) | Emailed (Yes/No) |
Call Notes | Status (Lead/Neg/Closed) | Bought 1Hr Course (Check) |
Bought 3Hr Course (Check) | Bought 6Hr Course (Check) | Referred By (Name) |
Referral Lead Date | Referral Book Date | Referral Bonus Owed | Bonus Paid (Check)
```

### Step 4: Validate Headers
Re-read row 1 and verify all 25 headers are present and correct.

### Step 5: Save Receipt
Write to **.tmp/crm_setup_complete.json**:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "spreadsheet_id": "1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0",
  "spreadsheet_url": "https://docs.google.com/spreadsheets/d/1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0/edit",
  "sheet_name": "Sheet1",
  "headers_written": 25,
  "header_list": ["First Name", "Last Name", "Phone Number", "Email Address", "Official Company Name", "Casual Company Name", "Website URL", "City", "State", "AI Subject Line", "AI Opening Hook", "Contact Date", "Follow Up Date", "Called (Yes/No)", "Emailed (Yes/No)", "Call Notes", "Status (Lead/Neg/Closed)", "Bought 1Hr Course (Check)", "Bought 3Hr Course (Check)", "Bought 6Hr Course (Check)", "Referred By (Name)", "Referral Lead Date", "Referral Book Date", "Referral Bonus Owed", "Bonus Paid (Check)"],
  "status": "success"
}
```

## Validation
- File .tmp/crm_setup_complete.json exists
- status == "success"
- headers_written == 25

## Self-Annealing
On script failure:
1. Log the error and stack trace
2. Check .env has valid SPREADSHEET_ID and credentials.json exists
3. Verify service account is shared with spreadsheet
4. Update @directives/update-crm.md Learnings Log

## Success Message
"CRM ready. 25 headers set. Receipt: .tmp/crm_setup_complete.json"

## Failure Handling
If headers cannot be written:
1. Delete any partial .tmp/crm_setup_complete.json
2. Return error with specific instructions
3. Common issues:
   - Service account not shared with spreadsheet
   - SPREADSHEET_ID incorrect
   - Google Sheets API not enabled

## Next Step
Run /scrape-leads [city] [state] (city must be from /research-cities output)
