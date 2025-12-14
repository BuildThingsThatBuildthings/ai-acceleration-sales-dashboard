# Cold Email Campaign Directive

## Goal
Launch a high-converting cold email campaign targeting realtors using Instantly. The focus is on deep personalization and a natural, "casual" tone.

## 1. Prospect Research
**Target:** Real Estate Agents and Brokers.
**Tools:** LinkedIn, Zillow, Realtor.com, Google.
**Destination:** [Google Sheet](https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit)

**Process:**
1.  Identify potential prospects.
2.  Verify their email address (use tools like NeverBounce or similar if available).
3.  **Populate the Sheet:**
    - **Name:** First and Last Name.
    - **Email:** Verified email address.
    - **Company (Raw):** The full legal name found (e.g., "Keller Williams Realty, Inc.").
    - **Website:** URL of their profile or agency.
    - **Research Notes:** Key details for the hook (e.g., "Just listed a $2M property," "Won Top Producer award," "Featured in local news").

## 2. Data Parsing & AI Personalization
**Objective:** Transform raw data into email-ready variables.

### A. Company Name Casualization
**Rule:** Remove legal entities, locations, and generic terms to sound like a friend speaking.
- **Input:** "Keller Williams Realty, Inc." -> **Output:** "Keller Williams"
- **Input:** "Re/Max Fine Properties of Nashville" -> **Output:** "Re/Max"
- **Input:** "The Smith Group at Compass" -> **Output:** "The Smith Group" or "Compass" (depending on context)

### B. Hook Generation
**Rule:** Create a 1-sentence opening that proves you did research.
- **Input:** Research Note: "Just listed 123 Main St."
- **Output:** "Saw that listing you just put up on Main St—looks incredible."
- **Input:** Research Note: "Won 2024 Circle of Excellence."
- **Output:** "Congrats on the Circle of Excellence win this year."

## 3. Execution (Agentic Workflow)
**Goal:** Act as an AI Agent to manage the entire campaign lifecycle using Instantly's tools.

### Virtual Tools
The Agent has access to the following capabilities (via `execution/marketing/test_mcp_campaign.py` or MCP):
1.  **Create Campaign:** Initialize a new campaign container.
2.  **Add Sequence:** Push email templates and schedules.
3.  **Upload Leads:** Batch upload processed prospects.

### Workflow Steps
1.  **Initialize:**
    - Run the agent script to create the campaign.
    - *Command:* `python execution/marketing/test_mcp_campaign.py`
2.  **Monitor:**
    - The agent will output the Campaign ID and status of lead uploads.
    - Check Instantly dashboard to verify the "AI Agent Test Campaign" appears.
3.  **Scale:**
    - Once verified, use `process_prospects.py` for the full list, targeting the newly created Campaign ID.

## 4. Copywriting Resources
Refer to `directives/marketing/copywriting_examples.md` for tone, style, and successful templates.
