# Directive: Research Target Cities

## Purpose
Research and identify optimal cities for real estate brokerage outreach within the Nashville-Hershey corridor.

## Output
Save to `.tmp/target_cities.json`

## Target Geography
The corridor from Nashville, TN to Hershey, PA covering:
- Tennessee (TN)
- Kentucky (KY)
- Virginia (VA)
- West Virginia (WV)
- Maryland (MD)
- Pennsylvania (PA)

## Research Methodology

### Step 1: State-Level Data Collection
For each state, gather:
1. **Licensing Data**: Total licensed real estate brokerages from state commission
2. **MLS Coverage**: Major MLS regions and their transaction volumes
3. **Association Chapters**: Local Realtor Association chapter locations
4. **Market Activity**: Recent transaction counts, median prices, market velocity

### Step 2: City Selection Criteria
Prioritize cities with:
| Criterion | Target | Weight |
|-----------|--------|--------|
| Metro Population | 100K+ | High |
| Brokerage Density | 50+ brokerages | High |
| MLS Activity | Active transactions | Medium |
| Association Presence | Local chapter | Medium |
| Corridor Proximity | On I-81/I-40/I-64 | Low |

### Step 3: Scoring Model
Score each candidate city (1-10):
- **Brokerage Count**: More = Better (data from state licensing)
- **Market Heat**: Hot markets need AI efficiency tools
- **Competition Level**: Mid-tier = Sweet spot (not dominated by 1-2 players)
- **Association Presence**: Enables group sales opportunities

### Step 4: Final Selection
Select 2-4 cities per state with highest composite scores.

## Research Sources

### State Licensing Boards
| State | Commission Website |
|-------|-------------------|
| TN | tn.gov/commerce/trec |
| KY | krec.ky.gov |
| VA | dpor.virginia.gov |
| WV | wvrec.org |
| MD | dllr.state.md.us/license/mrec |
| PA | dos.pa.gov/ProfessionalLicensing |

### MLS Systems
| State | Primary MLS |
|-------|-------------|
| TN | Greater Nashville REALTORS, KAAR (Knoxville) |
| KY | GLAR (Louisville), LBAR (Lexington) |
| VA | REIN, CVR MLS, DAAR |
| WV | KAWV MLS |
| MD | Bright MLS |
| PA | Bright MLS, GPAR |

### Realtor Associations
| State | Association |
|-------|-------------|
| TN | Tennessee REALTORS |
| KY | Kentucky REALTORS |
| VA | Virginia REALTORS |
| WV | West Virginia Association of REALTORS |
| MD | Maryland REALTORS |
| PA | Pennsylvania Association of REALTORS |

## Output Format

```json
{
  "research_date": "YYYY-MM-DD",
  "corridor": "Nashville TN to Hershey PA",
  "methodology": "Web research on state licensing, MLS data, and association presence",
  "cities": {
    "TN": {
      "selected": ["Nashville", "Knoxville"],
      "reasoning": "Top 2 markets by transaction volume and brokerage count",
      "estimated_brokerages": 500,
      "mls": "Greater Nashville REALTORS, KAAR",
      "association_chapters": ["Greater Nashville", "Knoxville Area"]
    },
    "KY": {
      "selected": ["Louisville", "Lexington"],
      "reasoning": "...",
      "estimated_brokerages": N,
      "mls": "...",
      "association_chapters": [...]
    }
    // ... remaining states
  },
  "priority_order": [
    "Louisville KY",
    "Lexington KY",
    "Roanoke VA",
    "Harrisburg PA"
    // ... ranked by opportunity score
  ],
  "total_estimated_brokerages": N,
  "notes": "Any research limitations or caveats"
}
```

## Success Criteria
- All 6 states researched
- 2-4 cities selected per state
- Clear reasoning for each selection
- Priority order established for outreach
- Output file valid JSON

## Failure Handling
If research is incomplete:
1. Document what was found
2. Note which states/cities need manual input
3. Save partial results with `"status": "incomplete"`
4. List specific data gaps

---

## Learnings Log

<!-- Append learnings here as they're discovered -->
