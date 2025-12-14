# CRM Guide: Using the Google Sheet

## Overview

Your lead sheet has 500+ contacts across TN, KY, VA, WV, MD, PA.
This guide shows you how to use it effectively.

---

## Column Reference (25 Columns)

### Contact Information
| Column | What It Is | How to Use |
|--------|------------|------------|
| First Name | Decision maker's first name | Use in opening + throughout call |
| Last Name | Decision maker's last name | Formal address if needed |
| Phone Number | Primary phone | Your dial number |
| Email Address | Primary email | For follow-up, calendar invites |

### Company Information
| Column | What It Is | How to Use |
|--------|------------|------------|
| Official Company Name | Full legal name | For contracts, formal docs |
| Casual Company Name | Short/common name | Use in conversation |
| Website URL | Company website | Reference if needed |
| City | Location | Local context in pitch |
| State | State | Regional targeting |

### Personalization (CRITICAL)
| Column | What It Is | How to Use |
|--------|------------|------------|
| AI Subject Line | Personalized email subject | Reference in opening: "I sent you an email about [this]" |
| AI Opening Hook | Specific fact/achievement | YOUR PATTERN INTERRUPT - read verbatim |

### Tracking
| Column | What It Is | How to Use |
|--------|------------|------------|
| Contact Date | Date of first contact | Auto-fill when you call |
| Follow Up Date | Scheduled callback | Set during call if needed |
| Called (Yes/No) | Have you called? | Update immediately |
| Emailed (Yes/No) | Have you emailed? | Track email status |
| Call Notes | What happened | CRITICAL - capture everything |
| Status | Lead stage | Update after every interaction |

### Deal Tracking
| Column | What It Is | How to Use |
|--------|------------|------------|
| Bought 1Hr Course | Purchased intro course | Check when closed |
| Bought 3Hr Course | Purchased workshop | Check when closed |
| Bought 6Hr Course | Purchased masterclass | Check when closed |

### Referral Tracking
| Column | What It Is | How to Use |
|--------|------------|------------|
| Referred By | Who referred them | Track referral source |
| Referral Lead Date | When referral came in | For bonus calculation |
| Referral Book Date | When they booked | For bonus calculation |
| Referral Bonus Owed | Amount owed to referrer | $250 (fast) or $100 (anytime) |
| Bonus Paid | Bonus sent? | Track payment |

---

## Status Definitions

Update status after EVERY call:

| Status | Meaning | Next Action |
|--------|---------|-------------|
| **Lead** | Uncontacted | Call them |
| **Contacted** | Talked/VM, no booking yet | Follow up on scheduled date |
| **Booked** | Demo/call scheduled | Prep for meeting |
| **Not Interested** | Said no | Send referral ask, then archive |
| **Bad Data** | Wrong number/person/out of business | Flag for research |
| **Closed** | Deal done | Track which product purchased |

---

## Daily Workflow with the Sheet

### Morning (8:30 AM)

**Step 1: Filter for "Lead" status**
- Filter column: Status = "Lead"
- This shows uncontacted leads only

**Step 2: Sort by priority**
- Hot leads (email openers from Instantly) first
- Then by State or City if targeting a region
- Then by most recent additions

**Step 3: Pull 25 leads**
- Copy to a separate tab or note which rows
- These are your morning calls

### During Calls

**Before each dial:**
1. Note the First Name
2. Read the AI Opening Hook (your pattern interrupt)
3. Glance at Company Name and City

**After each call:**
1. Update Status immediately
2. Update Call Notes with specifics
3. Set Follow Up Date if callback scheduled
4. Mark Called = Yes

### End of Day (3:30 PM)

**Step 1: Verify all updates**
- Every call should have notes
- Every status should be current
- Every callback should have a date

**Step 2: Pull tomorrow's list**
- Filter for Follow Up Date = tomorrow
- Filter for Status = Lead (new calls)
- Combine into tomorrow's list

---

## Writing Good Call Notes

Bad notes are useless. Good notes help you and anyone who follows up.

### Bad Notes
```
"Called, left VM"
"Not interested"
"Will call back"
```

### Good Notes
```
"LVM - mentioned AI email. Best time: Tues/Thurs afternoon."

"Not interested - said they already use ChatGPT for everything.
Agents tried it, didn't stick. Skeptical of training value.
→ Send prompts to prove value?"

"Interested but busy until Jan. Hates full-day training.
→ Pitch 3-hour option in Jan follow-up."
```

### What to Capture
- **Outcome**: VM, talked, no answer, bad number
- **Pain points**: What problems did they mention?
- **Objections**: What pushback did they give?
- **Interest level**: Hot, warm, cold
- **Next step**: Callback date, send info, referral ask
- **Personal details**: Best time to call, assistant's name

---

## Filtering and Sorting

### Common Filters

**"Show me uncontacted leads"**
- Status = Lead

**"Show me callbacks for today"**
- Follow Up Date = [Today's date]

**"Show me all Kentucky leads"**
- State = KY

**"Show me booked but not closed"**
- Status = Booked

**"Show me bad data to fix"**
- Status = Bad Data

### Sorting Strategies

**Freshest leads first:**
- Sort by row number (descending) - newest at top

**Callbacks first:**
- Sort by Follow Up Date (ascending) - soonest at top

**By region:**
- Sort by State, then City

---

## Using the Personalization Columns

### AI Subject Line

This is the email subject line sent to the lead.
Use it in your opening:

```
"Hi [First Name], this is [Your Name] with AI Acceleration.
I sent you an email about [AI Subject Line].
Did you have a chance to look at it?"
```

**Example:**
If AI Subject Line = "Congrats on the record year, Sarah"

You say:
```
"I sent you an email about congrats on the record year..."
```

### AI Opening Hook

This is a researched fact about the prospect or company.
This is your pattern interrupt. **Read it exactly.**

```
"Hi [First Name], this is [Your Name].
[AI Opening Hook - verbatim].
Quick question—how are your agents handling AI right now?"
```

**Example:**
If AI Opening Hook = "Being named the first woman to lead HomeServices KOI—overseeing 1,100 agents across Semonin, Huff, and Rector Hayden—that's a massive responsibility."

You say:
```
"Being named the first woman to lead HomeServices KOI—
overseeing 1,100 agents—that's a massive responsibility.
Quick question..."
```

---

## Data Quality Flags

If you encounter bad data, flag it immediately:

### Wrong Number
- Status = Bad Data
- Call Notes = "Wrong number - got [business name] instead"

### Wrong Person
- Status = Bad Data
- Call Notes = "Not decision maker - [Name] is the broker, not [original name]"
- If they gave you the right contact, add: "Correct contact: [Name], [Number]"

### Out of Business
- Status = Bad Data
- Call Notes = "Out of business / closed"

### Duplicate
- Status = Bad Data
- Call Notes = "Duplicate of row [X]"

---

## Weekly Data Review

Every Friday, review data quality:

1. **Filter for Bad Data status**
   - How many this week?
   - Any patterns? (certain cities, data sources)

2. **Review "Not Interested" notes**
   - What objections came up most?
   - Update objection library if new ones

3. **Check callbacks due next week**
   - Are they scheduled with notes?
   - Any prep needed?

4. **Clean up incomplete records**
   - Missing status updates?
   - Empty Call Notes?

---

## Common Mistakes to Avoid

### Don't: Skip the notes
Every call gets notes. Period. Future you will thank current you.

### Don't: Forget to update status
A lead with status "Lead" but you've called them = confusion.

### Don't: Delete bad data
Change status to "Bad Data" but keep the row. Track what went wrong.

### Don't: Call the same person twice in one day
Check "Called" and "Contact Date" before dialing.

### Don't: Ignore follow-up dates
If you said you'd call Tuesday, call Tuesday. Your word matters.

---

## Sheet Shortcuts

**Filter quickly:**
- Select column header → Data → Filter

**Find a specific company:**
- Ctrl+F (or Cmd+F) → search company name

**Sort by column:**
- Click column header → Data → Sort A-Z or Z-A

**Freeze header row:**
- View → Freeze → 1 row

**Hide unnecessary columns:**
- Right-click column → Hide column
