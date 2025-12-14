# Directive: Compose Outreach Emails

## Purpose
Generate personalized 3-email cold sequences for each enriched lead, formatted for Instantly.ai import.

## CRITICAL: This Stage Depends on Quality Enrichment

The emails are only as good as the enrichment data. If the CRM has garbage data (generic hooks, "Partner" as name), the emails will fail.

**Prerequisites before running this stage:**
- [ ] All leads have real first + last names
- [ ] All leads have personal emails (not info@)
- [ ] All leads have UNIQUE AI Subject Lines (specific to person/company)
- [ ] All leads have UNIQUE AI Opening Hooks (contains verifiable fact)

**If prerequisites not met:** Go back to enrichment stage.

## Input
Load leads from CRM (Google Sheet) - NOT from `.tmp/enriched_leads.json`

Why? The CRM is the source of truth after manual quality review.

## Product Details

| Product | Price | Duration | Capacity |
|---------|-------|----------|----------|
| AI Masterclass | $5,000 | 6 hours | 20 seats |
| Implementation Workshop | $3,000 | 3 hours | 20 seats |

## 3-Email Sequence Strategy

### Email 1: The Personalized Hook + Asset Pitch
**Goal:** Sell 6-Hour Masterclass ($5,000)
**Key:** The AI Opening Hook does the heavy lifting - it must be personalized

```
Subject: {{AISubjectLine}}

{{AIOpeningHook}}

I help brokerages like {{CasualCompany}} turn AI into an operational asset—not just another training checkbox.

Our 6-Hour AI Masterclass gives your team hands-on implementation:
- Automated listing descriptions (save 2+ hours per listing)
- AI-powered client follow-up sequences
- Market analysis that used to take days

This isn't theory. Your agents leave with working systems.

$5,000 for up to 20 seats. Worth it if one agent closes one extra deal.

Open to a 15-minute call this week?

[Your signature]
```

**Why this works:**
- Subject line references something specific they'll recognize
- Opening hook proves you researched them
- Rest of email can be templated because trust is established

### Email 2: The Downsell
**Goal:** Offer 3-Hour Workshop ($3,000) if no response
**Timing:** 3-4 days after Email 1

```
Subject: Quick alternative for {{CasualCompany}}

{{FirstName}},

If a full day isn't realistic right now, we have a 3-hour implementation workshop.

Same hands-on approach, focused on highest-impact automation:
- Listing descriptions
- Follow-up sequences

$3,000 for your team. Usually fits in a lunch session.

Interested?

[Your signature]
```

### Email 3: The Referral Ask
**Goal:** Activate referral bonus even if they don't buy
**Timing:** 3-4 days after Email 2
**Offer:** $250 if referral books same week / $100 anytime

```
Subject: $250 for an intro

{{FirstName}},

Even if this isn't right for {{CasualCompany}} right now, you probably know another broker who'd benefit.

Refer them this week → $250 when they book
Refer them later → $100 when they book

Just reply with their name and I'll handle the rest.

[Your signature]
```

## Personalization Variables

| Variable | Source | Example |
|----------|--------|---------|
| `{{FirstName}}` | CRM Column A | Stacy |
| `{{LastName}}` | CRM Column B | Durbin |
| `{{CasualCompany}}` | CRM Column F | Semonin |
| `{{City}}` | CRM Column H | Louisville |
| `{{State}}` | CRM Column I | KY |
| `{{AISubjectLine}}` | CRM Column J | Congrats on the historic promotion, Stacy |
| `{{AIOpeningHook}}` | CRM Column K | Being named the first woman to lead HomeServices KOI... |

## Quality Validation Before Sending

### Check Each Email For:

**Email 1:**
- [ ] Subject line is unique (not repeated for other leads)
- [ ] Opening hook contains specific fact (not template)
- [ ] No placeholder text like {{variable}} visible
- [ ] First name is real (not "Partner")

**Email 2:**
- [ ] Uses first name correctly
- [ ] Company name is casual version (not full legal name)

**Email 3:**
- [ ] First name correct
- [ ] Company name correct

### Red Flags That Indicate Bad Data:
- Subject line: "Quick question about [Company]" - GENERIC
- Opening hook: "I've been following the [City] market" - TEMPLATE
- First name: "Partner" - NOT A REAL NAME
- Multiple leads have identical subject lines - LAZY

**If you see these patterns, STOP. Go back to enrichment.**

## Output Format

Save to `.tmp/email_sequences.json`:
```json
[
  {
    "email": "stacydurbin@homeservices.com",
    "first_name": "Stacy",
    "last_name": "Durbin",
    "company": "Semonin Realtors / HomeServices KOI",
    "casual_company": "Semonin",
    "city": "Louisville",
    "state": "KY",
    "ai_subject_line": "Congrats on the historic promotion, Stacy",
    "ai_opening_hook": "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents across Semonin, Huff, and Rector Hayden—that's a massive responsibility. I imagine you're thinking about how to give your agents a competitive edge.",
    "email_1_subject": "Congrats on the historic promotion, Stacy",
    "email_1_body": "[Full personalized email 1]",
    "email_2_subject": "Quick alternative for Semonin",
    "email_2_body": "[Full email 2]",
    "email_3_subject": "$250 for an intro",
    "email_3_body": "[Full email 3]"
  }
]
```

## Email Quality Rules

### Subject Lines
- MUST be unique per lead
- MUST reference something specific
- No spam triggers: FREE, URGENT, ACT NOW, !!!
- No ALL CAPS
- Under 50 characters

### Body Content
- NO "I hope this email finds you well"
- NO "I wanted to reach out because"
- NO "I came across your profile"
- Start with the researched hook
- End with clear, simple CTA
- Use first name only (not "Hi Mr. Smith")

### What Gets Filtered as Spam
- Generic subject lines
- No personalization in opening
- Overly long emails
- Multiple exclamation points
- Sales-y language like "revolutionary" or "game-changing"

## Success Criteria
- 100% of sequences use unique AI Subject Line
- 100% of sequences use unique AI Opening Hook
- Email 1 pitches 6-Hour Masterclass ($5K)
- Email 2 downsells to 3-Hour Workshop ($3K)
- Email 3 offers referral bonus ($250/$100)
- Zero templated/generic content in personalized fields

## Instantly.ai Import Format

For CSV export:
```
email,first_name,last_name,company,ai_subject,ai_hook
stacydurbin@homeservices.com,Stacy,Durbin,Semonin,"Congrats on the historic promotion, Stacy","Being named the first woman to lead..."
```

## Fallback Script
If generation needed offline: `execution/generate_emails.py`

**Note:** The script should ONLY fill in the template structure. The AI Subject Line and AI Opening Hook MUST come from manual research in the CRM.

---

## Learnings Log

### 2025-12-10: Quality Standards Established

**Key Insight:**
The entire email sequence lives or dies based on Email 1's opening hook. If the hook is generic, the rest of the email doesn't matter - it gets deleted.

**What Makes a Good Opening Hook:**
1. References something they'll immediately recognize as true
2. Shows you did actual research (not just scraped their website)
3. Creates a "how did they know that?" moment
4. Ties naturally into why AI training would help them

**Examples of Hooks That Work:**
- "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents..."
- "$479 million in sales in 2024 as a 100% locally-owned brokerage is no joke..."
- "Going from healthcare finance startup to $150M+ in sales in 5 years..."

**Examples of Hooks That FAIL:**
- "I've been following the Louisville market..." (lazy)
- "In Louisville's shifting market, the brokerages winning are..." (generic)
- "I see [Company] is doing heavy lifting..." (template)
