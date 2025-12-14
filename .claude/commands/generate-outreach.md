---
description: Generate 3-email sequences for Instantly.ai
allowed-tools: Read, Write, Bash
---

# Email Generation Workflow

## Input File
**.tmp/enriched_leads.json** - Created by /enrich-leads

## Output File
**.tmp/email_sequences.json** - Ready for Instantly.ai import

## Directive Reference
Read @directives/compose-outreach.md for email templates and personalization rules.

## Workflow

### Step 1: Load Enriched Leads
Read .tmp/enriched_leads.json and extract leads array.
Verify enriched_count > 0.

### Step 2: Generate Casual Company Names
For each lead, strip from business_name:
LLC, Inc, Inc., Corp, Corp., Ltd, Ltd., LLP, Realty, Real Estate, Properties, Group, Company, Associates, & Associates

### Step 3: Generate AI Subject Line
5 words, B2B hook. Rotate through templates based on city hash:
- "AI transforms your brokerage operations"
- "Automation is your competitive edge"
- "Turn AI into operational asset"
- "Your agents need AI tools"
- "Stop losing deals to inefficiency"

### Step 4: Generate AI Opening Hook
Max 20 words, hyper-local. Rotate through templates based on city+state hash:
- "{City}'s competitive market demands efficiency—most brokers waste 3 hours daily on listing descriptions alone."
- "With inventory tight in {City}, your agents can't afford manual tasks eating their prospecting time."
- "{City}'s hot market moves fast—automated follow-ups catch leads your competitors miss."
- "In {City}'s shifting market, the brokerages winning are the ones automating the mundane."
- "Every hour your {City} agents spend on admin is an hour not spent closing deals."

### Step 5: Generate Email 1 - Asset Pitch ($5K)
```
Subject: {AISubjectLine}

{AIOpeningHook}

I help brokerages like {CasualCompany} turn AI into an operational asset—not just another training checkbox.

Our 6-Hour AI Masterclass gives your team hands-on implementation of:
- Automated listing descriptions (save 2+ hours per listing)
- AI-powered client follow-up sequences
- Market analysis workflows

This isn't theory. Your agents leave with working systems.

$5,000 for up to 20 seats. Worth it if just one agent closes one extra deal.

Open to a 15-minute call this week?
```

### Step 6: Generate Email 2 - Downsell ($3K)
```
Subject: Quick alternative for {CasualCompany}

Hey {FirstName},

If a full day isn't realistic right now, we have a 3-hour implementation workshop.

Same hands-on approach, focused on the highest-impact automation: listing descriptions + follow-up sequences.

$3,000 for your team. Usually fits in a lunch session.

Interested?
```

### Step 7: Generate Email 3 - Referral ($250/$100)
```
Subject: $250 for an intro

{FirstName},

Even if this isn't right for {CasualCompany}, you probably know another broker who'd benefit.

Refer them this week → $250 when they book
Refer them anytime → $100 when they book

Just reply with their name and I'll take it from there.
```

### Step 8: Save Output
Write to **.tmp/email_sequences.json**:
```json
{
  "generated_at": "2024-01-15T12:00:00Z",
  "lead_count": 15,
  "email_count": 45,
  "sequences": [
    {
      "email": "john@abcrealty.com",
      "first_name": "John",
      "last_name": "Smith",
      "company": "ABC Realty LLC",
      "city": "Louisville",
      "state": "KY",
      "casual_company": "ABC",
      "ai_subject_line": "AI transforms your brokerage operations",
      "ai_opening_hook": "Louisville's competitive market demands efficiency...",
      "email_1_subject": "AI transforms your brokerage operations",
      "email_1_body": "Louisville's competitive market demands efficiency...[full email]",
      "email_2_subject": "Quick alternative for ABC",
      "email_2_body": "Hey John, If a full day isn't realistic...[full email]",
      "email_3_subject": "$250 for an intro",
      "email_3_body": "John, Even if this isn't right for ABC...[full email]"
    }
  ],
  "status": "success"
}
```

## Validation
- File .tmp/email_sequences.json exists
- lead_count == enriched_count from input
- email_count == lead_count * 3
- All sequences have all 3 emails populated
- status == "success"

## Email Quality Checks
Before saving, verify:
- No spam triggers (FREE, URGENT, ACT NOW, !!!, ALL CAPS)
- Subject lines under 50 characters
- All personalization variables filled (no {FirstName} remaining)
- Professional B2B tone

## Self-Annealing
On any generation error:
1. Log which lead failed
2. Skip and continue with remaining leads
3. If > 20% fail, investigate common pattern
4. Update @directives/compose-outreach.md Learnings Log

## Success Message
"{lead_count} sequences ({email_count} total emails) generated. Output: .tmp/email_sequences.json"

## Failure Handling
If generation fails:
1. Try fallback: `python execution/generate_emails.py`
2. Save partial results with count of failed
3. Document failure patterns

## Next Step
Export .tmp/email_sequences.json to Instantly.ai
