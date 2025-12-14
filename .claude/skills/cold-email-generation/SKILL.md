---
name: cold-email-generation
description: Generate B2B cold email sequences for real estate AI training workshops. Use when writing outreach emails, composing sequences, or preparing Instantly.ai campaigns.
allowed-tools: Read, Write
---

# Cold Email Generation for AI Workshops

## Product Details

| Product | Price | Capacity | Duration |
|---------|-------|----------|----------|
| 6-Hour In-Person AI Masterclass | $5,000 | 20 seats | Full day |
| 3-Hour Implementation Workshop | $3,000 | 20 seats | Half day |

**Target:** Broker Owners, Association Directors (NOT individual agents)

## 3-Email Sequence Strategy

### Email 1: The Asset Pitch
**Goal:** Sell 6-Hour Masterclass ($5,000)
**Hook:** "This is not a course; it is an operational asset for your brokerage."
**Mechanism:** Mention automating listing descriptions and client follow-up

```
Subject: {{AISubjectLine}}

{{AIOpeningHook}}

I help brokerages like {{CasualCompany}} turn AI into an operational asset—not just another training checkbox.

Our 6-Hour AI Masterclass gives your team hands-on implementation of:
- Automated listing descriptions (save 2+ hours per listing)
- AI-powered client follow-up sequences
- Market analysis workflows

This isn't theory. Your agents leave with working systems.

$5,000 for up to 20 seats. Worth it if just one agent closes one extra deal.

Open to a 15-minute call this week?
```

### Email 2: The Downsell
**Goal:** Pivot to 3-Hour Workshop ($3,000)
**Hook:** "If a full day is too much..."
**Timing:** 3-4 days after Email 1 if no response

```
Subject: Quick alternative for {{CasualCompany}}

Hey {{FirstName}},

If a full day isn't realistic right now, we have a 3-hour implementation workshop.

Same hands-on approach, focused on the highest-impact automation: listing descriptions + follow-up sequences.

$3,000 for your team. Usually fits in a lunch session.

Interested?
```

### Email 3: The Referral
**Goal:** Activate referral bonus program
**Offer:** $250 same week / $100 later
**Timing:** 3-4 days after Email 2 if no response

```
Subject: $250 for an intro

{{FirstName}},

Even if this isn't right for {{CasualCompany}}, you probably know another broker who'd benefit.

Refer them this week → $250 when they book
Refer them anytime → $100 when they book

Just reply with their name and I'll take it from there.
```

## Personalization Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{FirstName}}` | CRM Column A | Lead's first name |
| `{{LastName}}` | CRM Column B | Lead's last name |
| `{{CasualCompany}}` | CRM Column F | Casual company name |
| `{{City}}` | CRM Column H | Lead's city |
| `{{State}}` | CRM Column I | Lead's state |
| `{{AISubjectLine}}` | CRM Column J | AI-generated subject |
| `{{AIOpeningHook}}` | CRM Column K | AI-generated hook |

## Subject Line Best Practices

- 5 words maximum
- No spam trigger words (free, urgent, act now)
- Professional B2B tone
- Theme: AI as operational asset

Good examples:
- "AI transforms your brokerage operations"
- "Automation is your competitive edge"
- "Your agents need AI tools"

Bad examples:
- "FREE AI training!!!" (spam trigger)
- "URGENT: Don't miss this" (spam trigger)
- "Hi there" (too generic)

## Opening Hook Best Practices

- Maximum 20 words
- Hyper-local market reference
- Specific pain point
- Proves you did research

Good examples:
- "Nashville's competitive market demands efficiency—most brokers waste 3 hours daily on listing descriptions alone."
- "With inventory tight in Richmond, your agents can't afford to waste time on manual tasks."

Bad examples:
- "I hope this email finds you well." (generic)
- "I wanted to reach out about..." (weak opening)

## Instantly.ai Export Format

```json
[
  {
    "email": "john@abcrealty.com",
    "first_name": "John",
    "last_name": "Smith",
    "company": "ABC Realty",
    "city": "Nashville",
    "state": "TN",
    "casual_company": "ABC",
    "ai_subject_line": "AI transforms your brokerage operations",
    "ai_opening_hook": "Nashville's competitive market demands efficiency...",
    "email_1_subject": "AI transforms your brokerage operations",
    "email_1_body": "Nashville's competitive market demands efficiency...",
    "email_2_subject": "Quick alternative for ABC",
    "email_2_body": "Hey John, If a full day isn't realistic...",
    "email_3_subject": "$250 for an intro",
    "email_3_body": "John, Even if this isn't right for ABC..."
  }
]
```

## Referral Bonus Structure

| Scenario | Bonus |
|----------|-------|
| Referral books same week | $250 |
| Referral books different week | $100 |

Track in CRM columns:
- U: Referred By (Name)
- V: Referral Lead Date
- W: Referral Book Date
- X: Referral Bonus Owed (auto-calculated)
- Y: Bonus Paid (checkbox)
