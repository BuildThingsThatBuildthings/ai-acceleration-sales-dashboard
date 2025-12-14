# Exercise: Desktop AI

## Overview
**Purpose**: Master desktop AI workflows for processing files (PDFs, photos, email threads) with speed and accuracy
**Module**: Module 11 - Desktop AI + Connectors (2:40-3:25 PM)
**Time**: 45 minutes (3 workflows × 15 min each)
**Format**: Follow-along practice (instructor demos, participants replicate)
**Materials Needed**:
- Laptop with desktop AI app installed (Claude Desktop, ChatGPT Desktop, or similar)
- Sample files provided: market report PDF, listing photos (3-5), email thread screenshot
- Desktop AI Quick-Use Card handout
- Verification checklist

## Learning Objectives
By completing these workflows, participants will be able to:
- Use drag-and-drop file processing with AI (no copy-paste required)
- Extract key data from PDFs accurately and quickly
- Analyze images and generate structured output
- Process messy email threads into actionable summaries
- Implement verification checkpoints in every workflow
- Integrate desktop AI into daily real estate tasks

---

## Overview: What is Desktop AI?

**Definition**: Desktop AI apps run locally on your computer with hotkey access and file processing capabilities.

**Key Features**:
- **File drop**: Drag PDFs, images, screenshots directly into chat (no copy-paste)
- **Hotkey invoke**: CMD+Space (Mac) or similar to open AI instantly
- **Local processing options**: Some apps process files locally (more private)
- **Multi-file analysis**: Compare documents, cross-reference data
- **Screenshot integration**: Capture screen, analyze immediately

**Popular Tools**:
- Claude Desktop (what we'll use today)
- ChatGPT Desktop App
- Raycast AI
- Microsoft Copilot (Windows)

**Privacy Note**: Always check app's privacy policy. Avoid uploading client PII to cloud-based tools without consent.

---

## Workflow 1: PDF Market Report → Seller One-Pager (15 minutes)

### Scenario
You received a 20-page quarterly market report from your local MLS. Your top 20 seller prospects need a concise, relevant update by EOD. You have 15 minutes to create a professional briefing.

**Old Way** (45 minutes):
- Read 20 pages
- Highlight key stats
- Open Word, write summary
- Format and proofread

**AI-Powered Way** (8 minutes):
- Drop PDF into AI
- Extract key stats with verification
- Generate seller briefing
- Review and send

---

### Step-by-Step Instructions

**Step 1: Prepare Your Prompt (2 minutes)**

Before dropping the file, write your prompt with clear constraints.

**Prompt Template**:
```
Analyze this quarterly market report PDF and extract data for sellers in [YOUR MARKET].

EXTRACT:
1. Median sale price - 90-day trend (include % change)
2. Average days on market - current vs. 90 days ago
3. Inventory levels - current listings vs. last year (YoY %)
4. List-to-sale ratio - are homes selling at/above/below asking?
5. Price per square foot trend
6. One RISK for sellers (what's working against them)
7. One OPPORTUNITY for sellers (what's in their favor)

OUTPUT FORMAT:
Write a 120-word seller briefing in professional but warm tone.
Include a [SOURCE] section citing page numbers for each stat.

EXCLUSIONS:
- No fear-based language ("market crash," "panic")
- No hype language ("now's the perfect time!")
- Neutral, data-driven tone only
```

**Your Turn**: Copy this template and customize for your market (replace [YOUR MARKET]).

---

**Step 2: Drop PDF into Desktop AI (30 seconds)**

1. Open your desktop AI app (CMD+Space on Mac, or click app)
2. Drag the market report PDF into the chat window
3. Wait for "File uploaded" confirmation
4. Paste your prompt below the file

---

**Step 3: Review AI Output (3 minutes)**

AI will generate:
- Extracted stats (7 data points)
- 120-word briefing
- Source citations

**VERIFICATION CHECKPOINT** (Don't skip this):
- [ ] Open PDF to cited pages - do stats match exactly?
- [ ] Check math: If AI says "3.2% increase," verify the calculation
- [ ] Confirm date ranges: "90-day" should match report's timeframe
- [ ] Look for hallucinations: Did AI invent stats not in the PDF?

**Common AI Mistakes to Catch**:
- Confuses "median" vs "average" (they're different)
- Rounds numbers incorrectly (5.8% becomes "nearly 6%")
- Cites wrong page number
- Invents insights not supported by data

---

**Step 4: Edit and Finalize (3 minutes)**

**Iterate on the Output**:
- If tone is too formal: "Rewrite in a friendlier, more conversational tone"
- If too long: "Tighten to exactly 100 words"
- If missing local context: "Add a line about [YOUR NEIGHBORHOOD] specifically"

**Add Your Human Touch**:
- Personalize opening: "Hi [Client Name], here's what's happening in [Your Market]"
- Add your call-to-action: "Curious what this means for your home's value? Let's chat - reply with your availability this week."
- Sign with your name and credentials

---

**Step 5: Create Reusable Template (2 minutes)**

Save your prompt as "Market Report Extraction Template" for future use.

**Pro Tip**: Add placeholders:
```
Analyze this quarterly market report for [NEIGHBORHOOD].
[Paste template from Step 1]
```

Next quarter, drop new PDF + paste template = done in 5 minutes.

---

**Success Criteria**:
- [ ] Extracted all 7 data points accurately
- [ ] Generated 120-word briefing in under 8 minutes (total workflow time)
- [ ] Verified stats against source (caught any errors)
- [ ] Saved reusable template for next time

---

## Workflow 2: Listing Photos → MLS Feature List (15 minutes)

### Scenario
You're at a listing appointment. Seller gives you 30 photos of their home. You need to create a detailed feature list for MLS and identify which photos are MLS-compliant.

**Old Way** (30 minutes):
- Manually review all 30 photos
- Write down features you see
- Cross-check MLS photo rules
- Create feature list

**AI-Powered Way** (10 minutes):
- Drop 5-10 representative photos into AI
- Extract features visible in photos
- Review for accuracy and compliance
- Finalize feature list

---

### Step-by-Step Instructions

**Step 1: Select Representative Photos (1 minute)**

From 30 photos, choose 5-10 that show:
- Exterior front view
- Kitchen
- Primary bedroom
- Bathrooms
- Unique features (pool, fireplace, built-ins)

Don't upload all 30 - AI performs better with curated selection.

---

**Step 2: Prepare Your Prompt (2 minutes)**

**Prompt Template**:
```
Analyze these listing photos and create a detailed feature inventory.

EXTRACT from photos (be specific):
- Exterior features: siding type, roof material, architectural style, lot features
- Kitchen features: countertop material, appliances visible, cabinet style, flooring
- Bathroom features: fixtures, tile work, vanity type
- Flooring throughout: hardwood, carpet, tile (note which rooms)
- Special features: fireplaces, built-ins, vaulted ceilings, lighting fixtures
- Condition indicators: updated vs dated, maintenance needs visible

FORMAT output as bulleted list grouped by room/area.

FLAG any photos that violate MLS rules:
- Personal photos visible (family pictures, identifiable people)
- Clutter or staging issues
- Poor lighting that misrepresents space

[CONFIDENCE CHECK]: For each feature, rate your confidence 1-5 (5 = certain from photo, 1 = guessing). Only include 4-5 confidence items.
```

**Your Turn**: Copy this template.

---

**Step 3: Drop Photos into Desktop AI (1 minute)**

1. Select 5-10 photos in Finder/File Explorer
2. Drag all at once into AI chat window
3. AI will upload and create thumbnails
4. Paste your prompt below the images

---

**Step 4: Review AI Output (4 minutes)**

AI will generate:
- Feature list by room/area
- Compliance flags
- Confidence ratings

**VERIFICATION CHECKPOINT**:
- [ ] Open each photo - do described features actually appear?
- [ ] Check for hallucinations: AI might "see" granite counters when it's laminate
- [ ] Verify colors: AI can misidentify colors in poor lighting
- [ ] Confirm room identification: AI might call a den a "bedroom"

**Common AI Mistakes to Catch**:
- Guesses finishes (sees reflection, assumes granite)
- Miscounts features (says 2 sinks when there's 1)
- Misidentifies architectural style
- Misses clutter or staging issues you'd catch

---

**Step 5: Refine and Add Human Expertise (4 minutes)**

**What AI Can't Know** (you must add):
- Age of updates ("Kitchen remodeled 2022" - AI can't determine year from photo)
- Square footage (AI can estimate room size but not precise sqft)
- Brands (AI might see stainless appliances but not know "Wolf range" vs generic)
- Off-camera features (3-car garage, fenced yard if not in photos)

**Iterate for Completeness**:
- "Add a line about the backyard based on these two exterior photos"
- "Expand the kitchen description - include storage and layout"
- "Flag photo #3 for privacy - there's a family photo on the mantle"

---

**Step 6: Create MLS-Ready Description (3 minutes)**

Take AI's feature list + your expertise = MLS description.

**Prompt**:
```
Using the feature list you created, write a 140-word MLS listing description.
Target audience: [first-time buyers / move-up buyers / retirees].
Tone: professional but warm.
Include: architectural style, key updates, standout features.
Exclude: superlatives, unverifiable claims.
```

Generate, review, verify facts, done.

---

**Success Criteria**:
- [ ] Extracted 15+ specific features from photos
- [ ] Caught any MLS compliance issues
- [ ] Verified feature list against photos (no hallucinations)
- [ ] Generated MLS description in under 10 minutes (total workflow)
- [ ] Identified what AI got wrong and corrected it

---

## Workflow 3: Email Thread Screenshot → Action Summary (15 minutes)

### Scenario
You have a messy 10-email thread between you, buyer, seller's agent, and lender. You need to reply with clear next steps and update your CRM.

**Old Way** (20 minutes):
- Re-read entire thread
- Piece together who said what
- Identify open questions
- Write reply and CRM note manually

**AI-Powered Way** (7 minutes):
- Screenshot the thread
- Drop into AI with extraction prompt
- Generate action summary + reply
- Review and send

---

### Step-by-Step Instructions

**Step 1: Capture Email Thread (1 minute)**

**If using Gmail/Outlook**:
- Scroll to show full thread (collapse quoted replies if possible)
- Take screenshot (CMD+Shift+4 on Mac, Windows+Shift+S on Windows)
- Save screenshot to desktop

**If thread is very long**:
- Take 2-3 screenshots (beginning, middle, end)
- Upload all to AI

---

**Step 2: Prepare Your Extraction Prompt (2 minutes)**

**Prompt Template**:
```
Analyze this email thread screenshot and create an action summary.

EXTRACT:
1. TOPIC: What is this thread about? (1 sentence)
2. PARTIES: Who is involved? (names + roles)
3. KEY POINTS: What decisions have been made? (bullets)
4. OPEN QUESTIONS: What's still unresolved? (bullets)
5. ACTION ITEMS: What needs to happen next, by whom, by when? (bullets with owners)
6. MY NEXT STEP: What should I (the agent) do immediately?

OUTPUT 1: Bullet-point summary (above structure)
OUTPUT 2: Draft reply email (3-4 sentences) that:
- Confirms key points
- Answers open questions (or says "I'll find out by [date]")
- Proposes next steps with timeline
- Ends with clear CTA

OUTPUT 3: One-line CRM note summarizing status

TONE: Professional, concise, solution-oriented
```

**Your Turn**: Copy this template.

---

**Step 3: Drop Screenshot into Desktop AI (30 seconds)**

1. Drag screenshot file into AI chat
2. Paste your prompt below the image
3. Generate

---

**Step 4: Review AI Output (2 minutes)**

AI will generate:
- Action summary (6 components)
- Draft reply email
- CRM note

**VERIFICATION CHECKPOINT**:
- [ ] Check names: Did AI correctly identify all parties?
- [ ] Check dates: Are deadlines accurate (e.g., "inspection due Friday" - is that correct?)
- [ ] Check open questions: Did AI miss anything unresolved?
- [ ] Check tone: Does reply sound like you? (If too formal/casual, iterate)

**Common AI Mistakes to Catch**:
- Misreads names (bad handwriting, similar names confused)
- Misses sarcasm or tone (interprets literally)
- Assigns action items to wrong person
- Misses implicit urgency ("ASAP" buried in thread)

---

**Step 5: Personalize and Finalize (3 minutes)**

**Add Your Human Touch to Reply**:
- Personalize greeting: "Hi [Name]," (use first name if established relationship)
- Add warmth: "Thanks for your patience on this" or "Great teamwork here"
- Adjust tone if needed: "Make this friendlier" or "Make this more direct"

**Iterate on Draft**:
- If too long: "Shorten to 3 sentences max"
- If missing key point: "Add a line confirming the new closing date"
- If CTA is weak: "End with specific next step: 'Please reply by EOD with your availability for the walk-through'"

---

**Step 6: Multi-Task Efficiency (2 minutes)**

AI gave you 3 outputs - use all of them:

1. **Reply Email**: Send it (after personalizing and verifying)
2. **CRM Note**: Copy one-liner directly into your CRM transaction record
3. **Action Summary**: Forward to your TC or save in transaction file as "Email Thread Summary - [Date]"

**Pro Tip**: If you do this for every complex thread, your transaction files become searchable and organized.

---

**Success Criteria**:
- [ ] Generated action summary in under 5 minutes
- [ ] Draft reply accurately reflects thread content
- [ ] Caught any misread names or dates
- [ ] Sent reply within 7 minutes (total workflow time)
- [ ] Updated CRM with one-line note

---

## Bonus Workflow Tips (Instructor Demo Only)

### Workflow 4: Compare Two Documents
**Use Case**: Compare seller's original disclosure to updated version - what changed?

**Prompt**:
```
Compare these two documents (Disclosure v1 and Disclosure v2).
Identify:
- What was added
- What was removed
- What was modified
Output as: ADDED | REMOVED | MODIFIED sections.
```

---

### Workflow 5: Batch Process Multiple CMAs
**Use Case**: You have 5 CMAs to review - extract key stats from all.

**Prompt**:
```
I'm uploading 5 CMA PDFs. For each one, extract:
- Subject property address
- Estimated value range
- Median sold price of comps
- Average days on market

Output as table with 5 rows.
```

---

### Workflow 6: Screenshot → Task List
**Use Case**: Whiteboard photo from team meeting → digital task list.

**Prompt**:
```
This is a photo of our team whiteboard with project tasks.
Extract all tasks and create:
- Task list (checkboxes)
- Assigned owner if visible
- Due date if mentioned
```

---

## Facilitation Notes

### Setup (Before Exercise)
- Install desktop AI app on instructor laptop (screen share ready)
- Pre-load sample files: market PDF, 5 listing photos, email thread screenshot
- Test file upload (ensure Wi-Fi/connectivity works)
- Have participants pre-install desktop AI app (sent in pre-workshop email) OR pair participants without app
- Print Desktop AI Quick-Use Card handout
- Write workflow timing on board: "PDF (15) | Photos (15) | Email (15)"

### While Facilitating

**Workflow 1 - PDF (0-15 min)**:
- Announce: "We're learning by doing. I'll demo, then you try with your own file or sample provided."
- Demo Steps 1-5 live (screen share)
- At 8 min: "Now you try - use the sample PDF or your own market report"
- Circulate room, help participants troubleshoot file upload
- At 15 min: "Finish up. Who got stats extracted? Raise hands."
- Quick share: "Anyone catch an AI hallucination?" (celebrate verification)

**Workflow 2 - Photos (15-30 min)**:
- Announce: "Workflow 2 - listing photos. Same process: demo first, you replicate."
- Demo Steps 1-6 live
- At 20 min: "Drop your photos in and run the prompt"
- Watch for common issue: participants try to upload 30 photos → slow/crashes app
- Remind: "5-10 photos max per prompt for speed"
- At 30 min: "Wrap up. Did AI correctly identify features? What did it get wrong?"

**Workflow 3 - Email (30-45 min)**:
- Announce: "Final workflow - email threads. This is a daily use case for most of you."
- Demo Steps 1-6 live
- At 35 min: "Your turn - use sample screenshot or your own email thread"
- Key point: "Notice how fast this is vs. re-reading entire thread manually"
- At 42 min: "Finish your draft reply"
- At 45 min: "Time. How many saved 10+ minutes with this workflow?"

### Debrief Questions (2-3 minutes at end)
- "Which workflow will you use most in your daily work?"
- "What surprised you about AI's file processing capabilities?"
- "What did AI get wrong that you had to correct?"
- "How will you integrate this into your routine?"

### Common Issues & Solutions

**Issue**: "File upload isn't working"
**Solution**: Check Wi-Fi connection, try smaller file, or use copy-paste as fallback

**Issue**: "AI can't read my PDF - says it's scanned images"
**Solution**: "OCR issue. Use Adobe or online OCR tool first, then re-upload"

**Issue**: "AI is giving me generic responses, not using the file"
**Solution**: "Make sure prompt references the file: 'Analyze THIS PDF' or 'Using these photos...'"

**Issue**: "This is taking too long - AI is slow"
**Solution**: "File processing takes 10-30 sec depending on size. Reduce file count or size if slow."

**Issue**: "I don't trust AI's output - too many errors"
**Solution**: "Good instinct. That's why verification checkpoint is step 4 in every workflow. AI is draft generator, not final product."

---

## Success Criteria

**Individual Success**:
- Completed all 3 workflows (PDF, photos, email) within time limits
- Successfully uploaded files to desktop AI app
- Caught at least 1 AI error during verification checkpoints
- Saved at least one reusable prompt template
- Can explain the workflow to a colleague
- Identified 1-2 daily use cases for desktop AI

**Group Success**:
- 80%+ of participants completed at least 2 of 3 workflows
- Multiple participants share "aha moments" about time savings
- Room energy is excited (not overwhelmed or frustrated)
- Questions focus on application ("Can I use this for...?") not basics ("Why isn't this working?")

**Time Savings Validation**:
- Workflow 1: 8 min with AI vs 45 min manual = 37 min saved
- Workflow 2: 10 min with AI vs 30 min manual = 20 min saved
- Workflow 3: 7 min with AI vs 20 min manual = 13 min saved
- **Total**: 70 minutes saved across 3 common tasks

---

## Variations

### For Advanced Participants
- Challenge: Create custom prompt for complex use case (e.g., contract comparison, multi-property analysis)
- Challenge: Combine multiple workflows (PDF + photos → complete listing package)
- Challenge: Build hotkey/shortcut for fastest AI access

### For Beginners
- Simplification: Use provided sample files only (don't require them to bring own)
- Simplification: Focus on Workflow 1 (PDF) in depth, make Workflows 2-3 optional
- Support: Pair with experienced participant, one laptop shared

### Time Adjustments
**If running 15 minutes behind**:
- Reduce to 2 workflows (PDF + Email, skip photos)
- Demo only, make participant replication optional homework
- Reduce verification time (faster review)

**If running 10 minutes ahead**:
- Add Workflow 4 (document comparison) as bonus
- Extended practice: participants try 2 different PDFs
- Share-out: 3-4 participants screen share their workflows

---

## Follow-Up

### Connection to Handouts
- **Desktop AI Quick-Use Card**: One-pager with hotkeys, prompt templates, verification checklist (participants keep)
- **Prompt Library**: Collection of reusable prompts from all 3 workflows

### Connection to Next Activities
- **Capstone Sprint (Module 12)**: "Choose one of these workflows (or create new) for your pilot job"
- **Post-Workshop**: "Use desktop AI for next 3 transactions, track time saved"

### Post-Workshop Actions
- Install desktop AI app if not done in workshop
- Create "AI Prompts" note in phone/computer with reusable templates
- Test all 3 workflows with real work files within 48 hours
- Report time saved in 7-day check-in email
- Train one team member on your favorite workflow (scale impact)

---

## Instructor Quick Reference

**Timing Breakdown**:
- Workflow 1 (PDF): 15 min
- Workflow 2 (Photos): 15 min
- Workflow 3 (Email): 15 min
- **Total**: 45 min

**Key Talking Points**:
- "Desktop AI turns your laptop into a processing powerhouse"
- "File drop is faster than copy-paste - use it"
- "Always verify - AI drafts, you finalize"
- "These 3 workflows save 70+ min/week - that's 60 hours/year"

**Success Mantra**: "You just learned workflows that will save you 1 hour per week. That's 50 hours per year. What will you do with that time?"

**Pre-Flight Checklist**:
- [ ] Desktop AI app installed and tested
- [ ] Sample files ready (PDF, photos, email screenshot)
- [ ] Screen share working
- [ ] Participants notified to install app pre-workshop
- [ ] Backup plan if Wi-Fi fails (use mobile hotspot)
