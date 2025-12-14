---
description: Research and identify optimal cities in the Nashville-Hershey corridor based on real estate market data and brokerage density
allowed-tools: Read, Write, Bash, WebSearch, WebFetch
---

# City Research Workflow

## Output File
**.tmp/target_cities.json** - Used by /scrape-leads to validate city selection

Read @directives/research-cities.md for full methodology.

## Objective
Identify the best cities for real estate brokerage outreach within the target corridor:
- Tennessee (TN)
- Kentucky (KY)
- Virginia (VA)
- West Virginia (WV)
- Maryland (MD)
- Pennsylvania (PA)

## Research Process

### Step 1: Gather State-Level Data
For each state, use WebSearch to research:
1. Total licensed real estate brokerages (state licensing board data)
2. Major MLS regions and coverage areas
3. Realtor Association chapter locations
4. Real estate market activity (transactions, volume)

Search queries:
- "[State] real estate commission licensed brokerages 2024"
- "[State] MLS regions coverage"
- "[State] Association of Realtors local chapters"
- "[State] real estate market statistics 2024"

### Step 2: Identify High-Density Cities
Criteria for city selection:
- Metro population 100K+ (larger addressable market)
- Active MLS with high transaction volume
- Multiple brokerages (not just 1-2 big players)
- Presence of local Realtor Association
- Reasonable distance on Nashville-Hershey corridor (I-40, I-81, I-64, I-83)

### Step 3: Rank Cities by Opportunity
Score each city on:
- Brokerage count (more = better)
- Market activity (hot markets need AI efficiency)
- Competition level (mid-tier = sweet spot)
- Association presence (easier group sales)

### Step 4: Final Selection
Select 2-4 cities per state based on research.
Prioritize cities with:
- Highest brokerage density
- Active market conditions
- Known Realtor Association presence

## Output Format
Save to **.tmp/target_cities.json**:
```json
{
  "research_date": "YYYY-MM-DD",
  "corridor": "Nashville TN to Hershey PA",
  "cities": {
    "TN": {
      "selected": ["city1", "city2"],
      "reasoning": "why these cities",
      "estimated_brokerages": N
    },
    "KY": {...},
    "VA": {...},
    "WV": {...},
    "MD": {...},
    "PA": {...}
  },
  "priority_order": ["city1 STATE", "city2 STATE", ...],
  "total_estimated_brokerages": N,
  "status": "success"
}
```

## Validation
- File .tmp/target_cities.json exists
- All 6 states have cities selected
- priority_order has at least 10 cities
- status == "success"

## Self-Annealing
On any error:
1. Log what research was completed
2. Save partial results with status: "incomplete"
3. Document what data gaps remain
4. Update @directives/research-cities.md Learnings Log with findings

## Success Message
"Research complete. {N} cities identified across 6 states. Output: .tmp/target_cities.json"

## Next Step
After this completes, run: `/scrape-leads [first city from priority_order] [state]`
