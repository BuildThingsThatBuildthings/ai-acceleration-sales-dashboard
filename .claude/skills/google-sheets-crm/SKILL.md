---
name: google-sheets-crm
description: Read and write to Google Sheets CRM using MCP. Use when managing lead data, updating the CRM, or exporting to spreadsheets. Requires Google Sheets MCP server configured.
allowed-tools: mcp__google-sheets__*, Read, Write
---

# Google Sheets CRM Management

## CRM Header Structure (25 Columns)

```
First Name,Last Name,Phone Number,Email Address,Official Company Name,Casual Company Name,Website URL,City,State,AI Subject Line,AI Opening Hook,Contact Date,Follow Up Date,Called (Yes/No),Emailed (Yes/No),Call Notes,Status (Lead/Neg/Closed),Bought 1Hr Course (Check),Bought 3Hr Course (Check),Bought 6Hr Course (Check),Referred By (Name),Referral Lead Date,Referral Book Date,Referral Bonus Owed,Bonus Paid (Check)
```

## Quick Start

**Read spreadsheet:**
```
Use google-sheets read with spreadsheet_id and range="Sheet1!A:Y"
```

**Write rows:**
```
Use google-sheets append with spreadsheet_id and values=[["John", "Smith", ...]]
```

**Create new sheet:**
```
Use google-sheets create with title="Lead Gen CRM"
```

**Batch update:**
```
Use google-sheets batch_update for multiple operations
```

## Column Reference

| # | Column Name | Type | Notes |
|---|-------------|------|-------|
| A | First Name | Text | Required |
| B | Last Name | Text | Required |
| C | Phone Number | Text | Optional |
| D | Email Address | Email | Required |
| E | Official Company Name | Text | As scraped |
| F | Casual Company Name | Text | AI-generated |
| G | Website URL | URL | Required |
| H | City | Text | Required |
| I | State | Text | 2-letter code |
| J | AI Subject Line | Text | AI-generated, 5 words |
| K | AI Opening Hook | Text | AI-generated, max 20 words |
| L | Contact Date | Date | Auto-set to today |
| M | Follow Up Date | Date | Manual |
| N | Called (Yes/No) | Boolean | Manual tracking |
| O | Emailed (Yes/No) | Boolean | Manual tracking |
| P | Call Notes | Text | Manual notes |
| Q | Status | Enum | Lead/Neg/Closed |
| R | Bought 1Hr Course | Check | Legacy field |
| S | Bought 3Hr Course | Check | $3,000 workshop |
| T | Bought 6Hr Course | Check | $5,000 masterclass |
| U | Referred By (Name) | Text | Referral tracking |
| V | Referral Lead Date | Date | When referral came in |
| W | Referral Book Date | Date | When referral booked |
| X | Referral Bonus Owed | Currency | Auto-calc: $250/$100 |
| Y | Bonus Paid | Check | Payment tracking |

## AI Field Generation Rules

### Casual Company Name (Column F)
Strip these from Official Company Name:
- LLC, Inc, Corp, Ltd
- Realty, Real Estate, Properties
- City names from the address

Example: "Nashville Premier Realty LLC" → "Nashville Premier"

### AI Subject Line (Column J)
- Exactly 5 words
- Theme: AI Operational Asset
- B2B professional tone
- Examples:
  - "AI transforms your brokerage operations"
  - "Automation is your competitive edge"
  - "Turn AI into operational asset"

### AI Opening Hook (Column K)
- Maximum 20 words
- Hyper-local market observation
- Mention specific city/market condition
- Prove you're not spam

Example: "Nashville's competitive market demands efficiency—most brokers waste 3 hours daily on listing descriptions alone."

## Referral Bonus Formula (Column X)
```
=IF(ISBLANK(U2), "None", IF(ISOWEEKNUM(V2)=ISOWEEKNUM(W2), "$250", "$100"))
```
- Same week booking: $250
- Different week booking: $100

## Best Practices

1. **Always verify headers match exactly** before writing
2. **Use batch operations** for multiple rows
3. **Set Contact Date to today** on new leads
4. **Default Status to "Lead"** for new entries
5. **Validate email format** before writing
6. **Check for duplicates** by email before inserting

## Authentication Setup

1. Enable Google Sheets API + Google Drive API in GCP Console
2. Create Service Account
3. Download JSON key file
4. Share target Drive folder with service account email
5. Set environment variables:
   - `SERVICE_ACCOUNT_PATH=/path/to/key.json`
   - `DRIVE_FOLDER_ID=your_folder_id`
