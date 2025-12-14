# Directive: Run Email Campaigns

## Purpose

Execute cold email drip campaigns using pre-researched CRM data. Supports A/B testing, multiple sequences, and export to Instantly.ai or Smartlead.

## Campaign System Architecture

```
CRM (Google Sheets)
        ↓
export_from_sheets.py  →  .tmp/crm_export.json
        ↓
campaign_builder.py    →  .tmp/campaigns/
        ↓
    ├── campaign_A_*.json       (full data)
    ├── campaign_A_*_instantly.csv
    └── campaign_A_*_smartlead.csv
        ↓
Upload to Instantly.ai / Smartlead
```

## Available Sequences

### Sequence A: Personalized Hook
**Best for:** Leads with deep research (unique subject line + hook in CRM)

| Email | Day | Goal | Subject |
|-------|-----|------|---------|
| 1 | 0 | Pitch $5K Masterclass | {{ai_subject_line}} |
| 2 | +3 | Downsell $3K Workshop | Quick alternative for {{casual_company}} |
| 3 | +4 | Referral ask | $250 for an intro |

**Requirements:**
- AI Subject Line (column J) - unique, specific
- AI Opening Hook (column K) - verifiable fact
- Real first name (not "Partner")

### Sequence B: Pain-Point Based
**Best for:** Leads without deep research (universal hooks)

| Email | Day | Goal | Subject |
|-------|-----|------|---------|
| 1 | 0 | Lead response problem | your agents are probably losing deals right now |
| 2 | +4 | Tech adoption problem | RE: your agents are probably losing deals right now |
| 3 | +4 | Breakup | should I close your file? |

**Requirements:**
- First name
- Email address
- Works WITHOUT personalized subject/hook

### Sequence C: Hybrid
**Best for:** A/B testing personalization impact

| Email | Day | Goal | Subject |
|-------|-----|------|---------|
| 1 | 0 | Personalized + pain point | {{ai_subject_line}} |
| 2 | +4 | Tech adoption | one other thing for {{casual_company}} |
| 3 | +4 | Referral breakup | $250 if you know someone |

## Quick Start

### Step 1: Export from CRM

```bash
# Export all leads marked as "Lead" status
python execution/export_from_sheets.py --status Lead

# Export only KY leads not yet emailed
python execution/export_from_sheets.py --state KY --not-emailed

# Export leads with personalization ready
python execution/export_from_sheets.py --has-hook --not-emailed
```

### Step 2: Build Campaign

```bash
# Sequence A (personalized) - requires hooks in CRM
python execution/campaign_builder.py --sequence A

# Sequence B (pain-point) - works without deep research
python execution/campaign_builder.py --sequence B

# A/B test both sequences
python execution/campaign_builder.py --sequence AB

# See which leads failed validation
python execution/campaign_builder.py --sequence A --show-invalid
```

### Step 3: Upload to Platform

**Instantly.ai:**
1. Go to Campaigns → Create Campaign
2. Upload `.tmp/campaigns/campaign_*_instantly.csv`
3. Map fields: email, first_name, last_name, company_name
4. Set up sequence with email_1_subject, email_1_body, etc.

**Smartlead:**
1. Go to Campaigns → Import Leads
2. Upload `.tmp/campaigns/campaign_*_smartlead.csv`
3. Fields auto-map to Subject 1, Body 1, etc.

## A/B Testing Strategy

### Test 1: Personalized vs Universal
- Split audience 50/50
- Run Sequence A for half, Sequence B for half
- Compare reply rates after 2 weeks

### Test 2: Subject Line Variations
- Manually edit subject lines in exported CSV
- Test: specific achievement vs pain point question
- Winner becomes default for future campaigns

### Test 3: Email Length
- Short (under 75 words) vs current templates
- Hypothesis: shorter wins for cold outreach

## Quality Gates

### Before Campaign Export
- [ ] All leads have valid email addresses
- [ ] No generic emails (info@, contact@)
- [ ] First names are real (not "Partner")
- [ ] For Sequence A: all leads have unique hooks

### Before Platform Upload
- [ ] Review 5 random emails in exported CSV
- [ ] Check no template variables visible ({{variable}})
- [ ] Verify email count matches expected

### After Sending
- [ ] Monitor bounce rate (should be <5%)
- [ ] Check spam complaint rate (should be <0.1%)
- [ ] Review reply sentiment (positive vs negative)

## Common Filters

```bash
# Fresh leads only (never contacted)
python execution/export_from_sheets.py --not-emailed --not-called

# Kentucky market
python execution/export_from_sheets.py --state KY --not-emailed

# Louisville specifically
python execution/export_from_sheets.py --city Louisville --not-emailed

# Leads with research done (ready for Sequence A)
python execution/export_from_sheets.py --has-hook --not-emailed

# Limit for testing
python execution/export_from_sheets.py --limit 10 --not-emailed
```

## Troubleshooting

### "No valid leads" for Sequence A
Your CRM is missing AI Subject Line and/or AI Opening Hook. Options:
1. Do deep research to add personalization
2. Use Sequence B instead (doesn't require personalization)

### High bounce rate
- Check email verification in enrichment stage
- Remove leads with generic email patterns
- Consider email verification service (ZeroBounce, NeverBounce)

### Low reply rate
- Test different subject lines (A/B test)
- Review opening hooks for relevance
- Check if emails landing in spam (use mail-tester.com)

### Template variables showing in emails
- The `{{variable}}` wasn't replaced - check CRM has data in that column
- Run with `--show-invalid` to see which leads are missing data

## Campaign Tracking

After sending, update CRM:
1. Mark "Emailed (Yes/No)" = Yes
2. Set "Contact Date" to send date
3. Set "Follow Up Date" to 7 days out

When replies come in:
1. Update "Status" based on response
2. Add notes to "Call Notes" field
3. If interested, schedule call and update dates

## Output Files

| File | Purpose |
|------|---------|
| `.tmp/crm_export.json` | Raw export from CRM |
| `.tmp/campaigns/campaign_A_*.json` | Full campaign data with validation |
| `.tmp/campaigns/campaign_A_*_instantly.csv` | Instantly.ai import format |
| `.tmp/campaigns/campaign_A_*_smartlead.csv` | Smartlead import format |

## Sequence Email Templates

See full templates in `execution/campaign_builder.py` under:
- `SEQUENCE_A` - Personalized hook approach
- `SEQUENCE_B` - Pain-point based approach
- `SEQUENCE_C` - Hybrid approach

---

*Campaign System v1.0 | A/B testing support | Multi-platform export*
