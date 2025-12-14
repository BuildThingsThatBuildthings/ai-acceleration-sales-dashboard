# Directive: Update CRM (Google Sheets)

## Purpose
Write fully researched, personalized lead data to Google Sheets CRM. This is the FINAL stage - data quality here determines outreach success.

## CRITICAL: Quality Gate

**DO NOT write to CRM if:**
- First Name is "Partner" or empty
- Last Name is empty
- Email is generic (info@, contact@, etc.)
- AI Subject Line is templated/generic
- AI Opening Hook doesn't reference a SPECIFIC fact about the person/company

**ONLY write leads that pass ALL quality checks.**

## Input
Load leads from deep research (manual enrichment, not automated script output).

## Required Header Structure
The Google Sheet MUST have this exact header row (25 columns):
```
First Name,Last Name,Phone Number,Email Address,Official Company Name,Casual Company Name,Website URL,City,State,AI Subject Line,AI Opening Hook,Contact Date,Follow Up Date,Called (Yes/No),Emailed (Yes/No),Call Notes,Status (Lead/Neg/Closed),Bought 1Hr Course (Check),Bought 3Hr Course (Check),Bought 6Hr Course (Check),Referred By (Name),Referral Lead Date,Referral Book Date,Referral Bonus Owed,Bonus Paid (Check)
```

## Column Mapping & Quality Requirements

| Column | Letter | Source | Quality Requirement |
|--------|--------|--------|---------------------|
| First Name | A | Research | Real name, NOT "Partner" |
| Last Name | B | Research | Real name, NOT empty |
| Phone Number | C | Research | Direct/mobile preferred |
| Email Address | D | Research | Personal email ONLY |
| Official Company Name | E | Research | Full legal name |
| Casual Company Name | F | Research | What people call it |
| Website URL | G | Scrape | Company's own domain |
| City | H | Scrape | City name |
| State | I | Scrape | 2-letter code |
| AI Subject Line | J | Research | UNIQUE, specific reference |
| AI Opening Hook | K | Research | UNIQUE, contains specific fact |
| Contact Date | L | Auto | Leave empty (set on contact) |
| Follow Up Date | M | Manual | Leave empty |
| Called (Yes/No) | N | Manual | Default: "No" |
| Emailed (Yes/No) | O | Manual | Default: "No" |
| Call Notes | P | Manual | Leave empty |
| Status | Q | Auto | Default: "Lead" |
| Bought 1Hr Course | R | Manual | Leave empty |
| Bought 3Hr Course | S | Manual | Leave empty |
| Bought 6Hr Course | T | Manual | Leave empty |
| Referred By | U | Manual | Leave empty |
| Referral Lead Date | V | Manual | Leave empty |
| Referral Book Date | W | Manual | Leave empty |
| Referral Bonus Owed | X | Manual | Leave empty |
| Bonus Paid | Y | Manual | Leave empty |

## Quality Standards for AI Fields

### AI Subject Line (Column J)

**GOOD Examples:**
- "Congrats on the historic promotion, Stacy"
- "$479M in 2024—what's the 2025 plan?"
- "70 years of Louisville real estate—what's next?"
- "Healthcare finance to top 5 realtor—impressive pivot"
- "#1 in Kentucky—how to scale from here?"

**BAD Examples (NEVER USE):**
- "Stop losing deals to inefficiency" (generic)
- "Quick question about [Company]" (lazy template)
- "AI transforms your brokerage operations" (generic)
- "Your agents need AI tools" (generic)

### AI Opening Hook (Column K)

**GOOD Examples:**
- "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents across Semonin, Huff, and Rector Hayden—that's a massive responsibility."
- "Selling $479 million in real estate in 2024 as a 100% locally-owned brokerage is no joke. I read you pivoted from running Chop Shop to real estate—that entrepreneurial mindset shows."
- "20-25% market share in Southern Indiana with 250 agents is impressive. Your quote about 2024 being 'a more normal year' stuck with me."

**BAD Examples (NEVER USE):**
- "I've been following the Louisville market and [Company] keeps popping up on my radar." (lazy template)
- "In Louisville's shifting market, the brokerages winning are the ones automating the mundane." (generic)
- "I see [Company] is doing heavy lifting in the [City] space." (template garbage)

## Pre-Write Quality Checklist

Before writing EACH row, verify:

- [ ] First Name is a real person's first name
- [ ] Last Name is a real person's last name
- [ ] Email is personal (not info@, contact@, hello@, sales@, admin@)
- [ ] AI Subject Line references something SPECIFIC (name, achievement, milestone)
- [ ] AI Opening Hook contains a VERIFIABLE FACT (sales volume, years in business, award, news)
- [ ] No templated phrases in subject or hook

**If ANY check fails, DO NOT write the row. Go back and research properly.**

## Tool Usage

### Using write_to_sheets.py
```bash
python execution/write_to_sheets.py
```

The script reads from `.tmp/enriched_leads.json` and writes to the configured sheet.

### Manual Write via Python
```python
# Only for properly researched leads
leads = [
    ["Stacy", "Durbin", "(502) 420-5000", "stacydurbin@homeservices.com",
     "Semonin Realtors / HomeServices KOI", "Semonin", "https://www.semonin.com/",
     "Louisville", "KY",
     "Congrats on the historic promotion, Stacy",
     "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents...",
     "", "", "No", "No", "", "Lead", "", "", "", "", "", "", "", ""]
]
```

## Deduplication

Before writing, check if email already exists in sheet:
1. Read all emails from Column D
2. Compare against new leads
3. Skip any duplicates
4. Log skipped entries

## Success Criteria
- 100% of written leads have real first + last name
- 100% have personal email (not generic)
- 100% have UNIQUE subject line (no two leads have same subject)
- 100% have UNIQUE opening hook (no two leads have same hook)
- 0 duplicate emails in sheet
- 0 aggregator websites in sheet

## Error Handling
- **Quality check fails:** Do NOT write row, log issue, continue to next
- **Headers mismatch:** Stop and fix headers first
- **Duplicate email:** Skip row, log warning
- **API error:** Retry with exponential backoff

---

## Learnings Log

### 2025-12-10: Louisville KY CRM Rebuild

**Problem Identified:**
- Sheet had 99 rows of garbage data
- Same generic subject line repeated 99 times
- Same generic hook repeated 99 times
- "Partner" as first name
- Aggregator sites (realtor.com, zillow.com) as leads
- No actual contact info

**Solution:**
1. Cleared all garbage data
2. Deep researched 14 Louisville brokerages manually
3. Wrote personalized subject lines based on specific achievements
4. Wrote unique hooks with verifiable facts
5. Result: 14 high-quality leads vs 99 garbage leads

**Time Comparison:**
- Automated garbage: 5 minutes for 99 useless leads
- Manual quality: 2 hours for 14 actionable leads
- ROI: Quality leads actually get responses

**Key Insight:**
The CRM is only as good as the research that goes into it. Automated scripts should ONLY be used for scraping and email extraction. Subject lines and hooks MUST be manually researched.
