# Lead Enrichment Workflow

## Your Mission

You are preparing leads for a cold email campaign promoting the **AI Acceleration Workshop**. Your job is to research each lead thoroughly enough that the email feels personally written for them—not a mail merge with their name dropped in.

The goal is not to fill in a form. The goal is to understand each lead's business well enough to explain why AI training would specifically benefit them.

---

## Data Source

**Google Sheet**: `https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit`
**Credentials**: `/Users/ryan/ai_acceleration/credentials.json`
**Total Leads**: 472

### Column Map (0-indexed)

| Index | Column Name | Purpose |
|-------|-------------|---------|
| 0 | Email | Lead's email address |
| 1 | Lead Status | Workflow status ("Enriched" when complete) |
| 2 | First Name | Decision maker's first name OR casualized company name |
| 3 | Last Name | Decision maker's last name (blank if not found) |
| 11 | summary | 1-2 sentence professional bio |
| 12 | headline | Professional positioning statement |
| 15 | jobTitle | Their role (Broker/Owner, Team Leader, etc.) |
| 16 | linkedIn | Full LinkedIn URL or "Not Found" |
| 19 | companyName | Company name (pre-populated, read-only) |
| 22 | companyWebsite | Company website (pre-populated, for research) |
| 27 | unique_hook | Personalized connection to AI training |

### Columns to Populate

These are the fields you must fill for each lead:
1. **First Name** (col 2)
2. **Last Name** (col 3)
3. **jobTitle** (col 15)
4. **linkedIn** (col 16)
5. **summary** (col 11)
6. **headline** (col 12)
7. **unique_hook** (col 27)
8. **Lead Status** (col 1) - Set to "Enriched" when all above are complete

---

## The Product You're Selling

**AI Acceleration Workshop**
- Instructor: Ryan, Founder & CEO of Build Things that Build Things
- Duration: Full-day training (7 hours)
- Audience: Real estate professionals (agents, brokers, team leaders)
- Format: 70% hands-on practice, 30% instruction

**What participants learn:**
- How to communicate with AI tools effectively (prompting)
- How to maintain their brand voice when using AI (context engineering)
- Which parts of their workflow AI can handle (job identification)
- How to choose the right AI tools for specific tasks
- How to protect clients from AI-enabled fraud (wire fraud, voice cloning, deepfakes)

**The core problem this solves:**
Real estate professionals spend massive amounts of time on repetitive writing—property descriptions, client emails, market summaries, social media posts, buyer/seller guides. AI can do these tasks in seconds instead of hours.

But most agents either:
- Don't know how to use AI effectively
- Are afraid of making embarrassing mistakes
- Don't know which tools to trust
- Haven't connected AI capabilities to their specific workflow

This workshop gives them confidence and competence. They leave knowing exactly how to use AI in their daily work.

**Key value propositions by situation:**
- **High-volume operations**: More transactions = more repetitive writing. AI scales output without scaling headcount.
- **Teams**: AI training creates consistency. Every agent produces quality output without the team leader reviewing everything.
- **Luxury market**: Elevated copy that matches brand positioning. AI can write at the sophistication level luxury clients expect.
- **Commercial**: Lease abstracts, market reports, tenant communications—different writing needs than residential.
- **New agents**: AI helps newer agents produce experienced-level output while they're still building expertise.
- **Experienced agents**: AI lets them spend time on relationship-building and deals, not writing tasks.

---

## How to Research a Lead

### Finding the Decision Maker

You have a company name and website. Your first job is figuring out WHO at that company would decide to send people to training.

**Think about company structure:**
- Solo agent → That person is the decision maker
- Small team (2-5 people) → Team leader or broker/owner
- Brokerage office → Managing broker or office manager
- Large team within brokerage → Team leader

**Where to look:**
1. **Company website** - Look for "About," "Team," "Our Leadership," "Meet the Broker" pages
2. **LinkedIn** - Search the company name and look at employees, especially those with Owner, Broker, Team Leader in their title
3. **Google** - "{company name} owner" or "{company name} broker {city}"

**When the company name IS a person's name:**
Many real estate businesses are named after the owner. "The Jennifer King Team" tells you Jennifer King is who you're looking for. "Craig Hartranft Realty" means Craig Hartranft. Use the company name as your starting point for research.

**When it's a franchise office:**
"RE/MAX Pinnacle" or "Coldwell Banker Lancaster" requires finding the local owner or managing broker. Corporate doesn't make training decisions—the local franchise owner does.

### Building Their Professional Profile

Once you know who the decision maker is, gather information about them:

**From LinkedIn:**
- Their headline (how they describe themselves)
- Their About section (their story, what they emphasize)
- Years in real estate
- Career path
- What they post about (reveals what matters to them)

**From company website:**
- Their bio
- Team size (how many agents?)
- Specializations mentioned
- Awards or recognition
- Geographic areas served

**From review sites (Zillow, Realtor.com):**
- Number of reviews (volume indicator)
- Types of properties mentioned
- Client feedback themes

**What you're looking for:**
You're building a picture of their business to understand what AI training would mean FOR THEM SPECIFICALLY. A solo agent needs different things than a team leader managing 15 people.

### Generating the Hook

The hook answers: "Why would THIS specific person benefit from AI training?"

**This is the hardest part. Here's how to think about it:**

Start with what you learned about them:
- What's their scale? (solo, small team, large operation)
- What's their specialty? (luxury, commercial, investors, first-time buyers)
- What's their differentiator? (tech-forward, relationship-focused, high-volume)
- What's their challenge? (scaling, consistency, time, staying competitive)

Then connect to what AI training delivers:
- Time savings on repetitive writing
- Consistency across team output
- Elevated copy quality
- Fraud protection knowledge
- Competitive advantage

**The connection must be specific:**

Bad hook: "AI could help your business"
*Why it's bad: Applies to literally everyone. Says nothing specific.*

Bad hook: "With your impressive 30-year career"
*Why it's bad: Flattery without substance. Doesn't connect to AI training.*

Good hook: "Managing 12 agents means 12 different writing styles on listings—AI training creates consistency without you reviewing every description"
*Why it's good: References their specific situation (12 agents) and connects to a specific benefit (consistency without micromanaging).*

Good hook: "Your luxury listings need copy that matches Sotheby's brand standards—properly trained AI writes at that level"
*Why it's good: References their market position (luxury/Sotheby's) and connects to a specific benefit (elevated copy quality).*

**Questions to ask yourself when writing the hook:**
1. Would this hook make sense if I sent it to a random different lead? (If yes, it's too generic)
2. Does this reference something I actually learned about them? (If no, do more research)
3. Does this explain why AI training specifically helps their situation? (If no, make the connection explicit)

---

## Field Specifications

### First Name
The decision maker's first name.

**If you find the person:** Use their first name. "Jennifer" not "Jennifer King."

**If you cannot find a specific person:** Casualize the company name for conversational use in the email greeting.
- "The Jennifer King Team" → "Jennifer" (name is right there)
- "RE/MAX Pinnacle" → "Pinnacle team"
- "Berkshire Hathaway HomeServices" → "Berkshire team"
- "Life Changes Realty Group" → "Life Changes team"
- "Craig Hartranft Realty" → "Craig" (name is in company name)

**Never use:** "there," "Open," "The," "and," or any word that isn't a name or natural company shorthand.

### Last Name
The decision maker's last name.

If found, include it. If not found, leave blank. Don't fabricate.

### jobTitle
Their professional title/role.

Use what they actually call themselves:
- Broker/Owner
- Team Leader
- Associate Broker
- Managing Broker
- Realtor
- Principal Broker
- CEO/Broker
- Partner

Don't invent titles. If their LinkedIn says "Realtor" that's what you use, even if you think they're more senior.

### linkedIn
Full LinkedIn profile URL.

Format: `https://www.linkedin.com/in/username`

If you cannot find their LinkedIn profile after searching, write "Not Found"—don't guess or construct URLs.

**Verify it's the right person:** Check that the profile's location and company match before using the URL.

### summary
1-2 sentence professional bio.

Write this like a brief bio you'd see in a conference program:
- How long in real estate
- Notable achievements
- Geographic focus
- What makes them distinctive

Base this on what you actually found. Don't fabricate credentials or achievements.

**Example:** "2nd generation Realtor serving Lancaster, Lebanon & Berks counties since 2000. RE/MAX Hall of Fame, 2017 LCAR Board President."

### headline
Their professional positioning statement.

Format: "Role | Company/Team | Differentiator"

**Example:** "Associate Broker | RE/MAX Diamond Team Leader | Hall of Fame"

Use their actual LinkedIn headline if available, or construct from what they emphasize about themselves.

### unique_hook
The personalized reason they need AI training.

This must:
1. Reference something SPECIFIC about them (team size, market focus, volume, awards, etc.)
2. Connect to a SPECIFIC benefit of AI training (time savings, consistency, elevated copy, fraud awareness, etc.)
3. Be one sentence
4. Would NOT make sense if sent to a random other lead

See "Generating the Hook" section above for detailed guidance.

### Lead Status
Set to "Enriched" when all required fields are complete and meet quality standards.

---

## Quality Standards

A lead is ready for "Enriched" status when:

**First Name** - Is a real name OR properly casualized company name (not "there," "Open," etc.)

**Last Name** - Is the actual last name OR blank if not found (not fabricated)

**jobTitle** - Is a real title they use (not invented)

**linkedIn** - Is a valid URL to the right person OR "Not Found"

**summary** - Is 1-2 factual sentences based on actual research

**headline** - Follows the format and accurately represents their positioning

**unique_hook** - Is personalized AND connects to AI training value

---

## When Research Is Limited

Sometimes you'll find minimal information about a lead. Handle this honestly:

**Can't find the decision maker:**
- Use casualized company name for First Name
- Leave Last Name blank
- Use general title like "Broker" or "Team Leader" based on company type
- Note "Not Found" for LinkedIn
- Write summary based on company info
- Make hook about the company/role rather than the individual

**Website is thin:**
- Focus on what you CAN verify
- Don't fill in gaps with assumptions
- A shorter, accurate summary is better than a fabricated detailed one

**No LinkedIn presence:**
- Note "Not Found"
- Use other sources (website bio, Google)
- Don't construct fake URLs

**Limited info overall:**
- Be honest in the summary
- Make hook based on their market/role type rather than personal details
- Still connect to AI training benefit

The goal is honest, verifiable research. An incomplete but accurate profile is better than a complete but fabricated one.

---

---

## Execution Process: Row-by-Row

You enrich leads ONE AT A TIME, completing ALL fields for each lead before moving to the next.

### For Each Lead:

**Step 1: Read from sheet**
- Get companyName and companyWebsite for the lead

**Step 2: Research the company website (WebFetch)**
- Fetch About/Team/Leadership pages
- Find decision maker name and role
- Note team size, specializations, awards, areas served
- Gather anything revealing their business situation

**Step 3: Search LinkedIn (WebSearch)**
- Search: "{Person Name} {Company} real estate {location}"
- Find their LinkedIn profile URL
- Get their headline and about section
- Verify it's the correct person (location/company match)

**Step 4: Think about what you found**
- Who is this person specifically?
- What's unique about their business situation?
- Why would AI training help THEM specifically?
- What's the connection between their situation and our product?

**Step 5: Write ALL fields to the sheet**
- First Name
- Last Name
- jobTitle
- linkedIn
- summary
- headline
- unique_hook
- Lead Status = "Enriched"

**Step 6: Validate the row**
- Check all fields meet quality criteria
- If any fail, fix immediately

**Step 7: Move to next lead**

### Batch Validation Checkpoints

After every 10-20 leads:
- Review what was written
- Validate quality against criteria
- If any rows fail → fix them immediately
- Continue to next batch

---

## Remember

You're not filling out a spreadsheet. You're learning about real businesses so we can have relevant conversations with real people.

Every lead is a real estate professional who spends hours every week on writing tasks that AI could handle in minutes. Your research determines whether they'll see our email as spam or as something worth their time.

The person receiving this email will instantly know if you actually looked them up or just mail-merged their name. Your research is the difference between "delete" and "tell me more."
