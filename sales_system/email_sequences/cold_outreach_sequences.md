# Cold Outreach Sequences for Instantly.ai

## Purpose

Primary cold email sequences for initial outreach. Use these templates in Instantly.ai campaigns with your CRM data.

**Related Files:**
- `response_handlers.md` - How to reply when they respond
- `re_engagement.md` - How to win back cold leads
- `voicemail_scripts.md` - What to say when calling

---

## Sequence Selection Guide

| Sequence | Best For | CRM Filter |
|----------|----------|------------|
| Lead Response Pain | Brokerages focused on deals/revenue | `industry = Brokerage` |
| ROI/Productivity | CFOs, ops-focused decision makers | `jobLevel = C-Suite` OR `department = Operations` |
| Association Member Value | Associations, trade groups | `industry = Association` |
| Recruiting Edge | Growing brokerages, HR roles | `companyHeadCount > 20` |

---

## SEQUENCE 1: Brokerage - Lead Response Pain

**Target**: Managing brokers, broker owners
**Pain Point**: Slow lead response = lost deals

### Email 1 (Day 1)

**Subject**: `{{AI Subject Line}}`

```
{{PERSONALIZATION}}

Quick question - how fast do your agents respond to new leads?

The stat I keep hearing: agents who respond in 5 minutes are 100x more likely to connect than those who wait 30 minutes.

Most take hours. That's money walking out while they're showing houses.

AI can draft a response before they finish reading the notification.

Would it help if I shared what other {{State}} brokerages are doing here?
```

### Email 2 (Day 4)

**Subject**: `one other thing`

```
{{CONTACT}},

Following up on lead response - here's the flip side:

55% of broker/owners now say "agent tech adoption" is their top challenge. Up from 39% last year.

The problem usually isn't the tools. It's that nobody showed agents what to actually DO with them.

That's fixable.

Would a quick overview of what's working be useful?
```

### Email 3 (Day 7)

**Subject**: `closing the loop`

```
{{CONTACT}},

If this isn't a priority right now, no worries - I'll close out this thread.

One ask: if you know another broker who's thinking about AI training for their team, happy to send them something useful.

Either way, appreciate your time.
```

---

## SEQUENCE 2: Brokerage - Productivity Pain

**Target**: CFOs, VPs of Operations, margin-focused broker owners
**Pain Point**: Agents buried in admin, not selling

### Email 1 (Day 1)

**Subject**: `{{AI Subject Line}}`

```
{{PERSONALIZATION}}

Your agents are probably working 50+ hours a week. But how many of those hours are actually selling?

Listing descriptions, follow-up emails, market reports, social posts - that's 10-15 hours of admin per agent per week.

AI handles all of it. Not perfectly, but well enough that your agents get those hours back for client work.

Would it help if I shared what other {{State}} brokerages are doing to fix this?
```

### Email 2 (Day 4)

**Subject**: `the training gap`

```
{{CONTACT}},

68% of agents have adopted AI tools.
Only 17% see meaningful results.

That 51% gap? It's implementation, not tools.

Most agents dabble. They don't have systems.

We fix that in one day - hands-on workshop where your team builds working AI workflows they use Monday morning.

Would that kind of training be useful for {{Casual Company Name}}?
```

### Email 3 (Day 7)

**Subject**: `last note`

```
{{CONTACT}},

Either this is bad timing or bad fit.

Both are fine - I'll close your file unless you'd like me to circle back in Q1.

If you know another broker wrestling with AI adoption, happy to be a resource.

Thanks,
```

---

## SEQUENCE 3: Association - Member Value

**Target**: Association executives, education directors
**Pain Point**: Need training that members actually use

### Email 1 (Day 1)

**Subject**: `{{AI Subject Line}}`

```
{{PERSONALIZATION}}

Most association execs I talk to are looking for training that members actually use.

Here's the challenge: 68% of agents have adopted AI, but only 17% see real results. That gap is where we help.

We run hands-on AI workshops where members leave with working systems - prompts for listings, follow-up sequences, market reports.

Not theory. Implementation.

Would it help if I shared how other associations are positioning this as a member benefit?
```

### Email 2 (Day 4)

**Subject**: `CE-eligible option`

```
{{CONTACT}},

One thing I forgot to mention - depending on {{State}} requirements, our curriculum can be CE-eligible.

We've worked with associations to get approval.

For context: 6-hour workshop for up to 20 members, $5,000. That's $250/seat.

Or 3-hour version for $3,000 if a full day isn't realistic.

Want me to check CE requirements for your state?
```

### Email 3 (Day 7)

**Subject**: `referral idea`

```
{{CONTACT}},

Even if this isn't right for {{Casual Company Name}} right now, you probably know other association execs thinking about AI education.

We pay $250 for referrals that book this week, $100 anytime after.

Just reply with their name - I'll handle the rest.

Either way, thanks for your time.
```

---

## SEQUENCE 4: Brokerage - Recruiting Edge

**Target**: Growing brokerages, recruiters, HR-focused decision makers
**Pain Point**: Agent retention, recruiting differentiation

### Email 1 (Day 1)

**Subject**: `your recruiting edge`

```
{{CONTACT}},

{{PERSONALIZATION}}

When a top agent interviews with {{Casual Company Name}}, what do you offer that competitors don't?

Higher split? Everyone does that.
AI training they can't get elsewhere? That's differentiation.

75% of agents leave the industry within 5 years. The brokerages keeping them offer development the others don't.

Would it help if I shared how other {{State}} brokerages are using this for retention?
```

### Email 2 (Day 4)

**Subject**: `the retention math`

```
{{CONTACT}},

Cost of losing one agent: about $50,000 (training, office space, admin time).

If AI training makes even one agent stick around who'd otherwise leave, the workshop pays for itself 10x.

And the pitch to recruits: "We have AI systems your last brokerage didn't."

Would that kind of positioning be useful for {{Casual Company Name}}?
```

### Email 3 (Day 7)

**Subject**: `closing out`

```
{{CONTACT}},

I'll stop here unless you'd like to continue the conversation.

If you know another broker building their team who might benefit, happy to be a resource.

Thanks for your time.
```

---

## Personalization Variables

| Variable | CRM Column | Example | Required |
|----------|------------|---------|----------|
| `{{CONTACT}}` | CONTACT | Sarah | Yes |
| `{{Casual Company Name}}` | Casual Company Name | Berkshire | Yes |
| `{{PERSONALIZATION}}` | PERSONALIZATION | Congrats on 25 years... | Yes (Email 1) |
| `{{AI Subject Line}}` | AI Subject Line | Sarah - quick question | Yes (where used) |
| `{{companyHeadCount}}` | companyHeadCount | 50 | For ROI sequence |
| `{{State}}` | State | TN | Yes |
| `{{industry}}` | industry | Brokerage | For filtering |

---

## Instantly.ai Setup

### CSV Import Format

```csv
email,first_name,company,personalization,ai_subject_line,state,industry,company_head_count
sarah@example.com,Sarah,Berkshire Realty,Congrats on 25 years leading Berkshire...,Sarah - quick question,TN,Brokerage,50
```

### Campaign Settings

| Setting | Value |
|---------|-------|
| Email 1 | Day 1 |
| Email 2 | Day 4 (3 days after) |
| Email 3 | Day 7 (3 days after) |
| Send window | 10 AM - 2 PM recipient local time |
| Daily limit | 30-50 per sending account |
| Open tracking | OFF (improves deliverability) |
| Link tracking | OFF (improves deliverability) |

### A/B Tests to Run

**Test 1: Subject Line**
- Variant A: `{{AI Subject Line}}` (personalized)
- Variant B: `quick question` (generic)
- Metric: Open rate
- Sample: 200 leads per variant

**Test 2: CTA Style**
- Variant A: "Would it help if I shared..." (value offer)
- Variant B: "Worth a 12-minute call?" (direct ask)
- Metric: Reply rate
- Sample: 200 leads per variant

---

## Quality Checklist Before Launch

Before activating any campaign:

- [ ] Every `{{PERSONALIZATION}}` has specific, verifiable content
- [ ] Every `{{AI Subject Line}}` is unique (no duplicates)
- [ ] Every `{{CONTACT}}` is a real first name (not "Partner")
- [ ] All emails under 100 words
- [ ] No links in email body
- [ ] No spam triggers (FREE, URGENT, LIMITED TIME, !!!)
- [ ] Subject lines under 50 characters
- [ ] Test email sent to yourself first

---

## Metrics to Track

| Metric | Good | Great | Action if Below |
|--------|------|-------|-----------------|
| Open rate | 40%+ | 55%+ | Change subject line |
| Reply rate | 5%+ | 10%+ | Improve personalization |
| Bounce rate | <2% | <1% | Clean list |
| Unsubscribe | <0.5% | <0.2% | Soften messaging |

---

## Quick Reference: Which Sequence for Which Lead

```
IF industry = "Association" THEN
  → Sequence 3: Association Member Value

ELSE IF jobLevel = "C-Suite" OR department = "Operations" THEN
  → Sequence 2: ROI/Productivity Pain

ELSE IF companyHeadCount > 20 THEN
  → Sequence 4: Recruiting Edge

ELSE
  → Sequence 1: Lead Response Pain (default)
```

---

*Cold Outreach Sequences v1.0 | Instantly.ai Ready | December 2024*
