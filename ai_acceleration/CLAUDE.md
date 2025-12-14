# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Acceleration** is a comprehensive one-day workshop training real estate professionals on practical AI applications. The project delivers a complete course package including slides, exercises, handouts, templates, and instructor materials.

**Client**: Williamson County Association of REALTORS (WCAR)
**Format**: Full-day workshop (9:00 AM - 4:00 PM)
**Target Audience**: Real estate agents and brokers (non-technical professionals)
**Delivery Format**: Markdown-based materials designed for conversion to slides, PDFs, and print handouts

## Repository Structure

```
/ai_acceleration/
├── courseoutline.md              # SOURCE OF TRUTH - Original course requirements
├── Beginning.md                  # Detailed build plan and run-of-show
├── SUBAGENT_ORCHESTRATION.md    # Development methodology & agent coordination
├── mentalmodels.md               # Reference material for mental models content
├── claudecodedocs.md             # Claude Code documentation reference
├── research/                     # Industry & pedagogy research
├── design/                       # Learning design documents
├── slides/                       # 12 module slide decks (Markdown/Reveal.js)
├── exercises/                    # 6 hands-on workshop exercises
├── handouts/                     # 6 participant take-home materials
├── templates/                    # Reusable templates & scenario cards
├── instructor/                   # Instructor facilitation guide
├── qa/                           # Quality assurance and compliance reports
│   └── courseoutline_compliance_report.md  # Alignment verification with source spec
└── resources/                    # Bibliography, participant resources, prompt library
    ├── bibliography.md           # Comprehensive citations for all course materials
    └── participant_resource_library.md  # Post-workshop resource hub for participants
```

## Architecture & Design Philosophy

### Three-Tier Documentation System

1. **Source of Truth**: `courseoutline.md` - Original requirements and objectives
2. **Build Plan**: `Beginning.md` - Detailed execution plan with timing, exercises, deliverables
3. **Orchestration**: `SUBAGENT_ORCHESTRATION.md` - Development phases, agent roles, dependencies

**Critical**: When making changes to course content, verify alignment with `courseoutline.md` first, then consult `Beginning.md` for implementation details.

### Content Design Principles

- **Demo-First Pedagogy**: Show don't tell; practical over theoretical
- **Real Estate Specificity**: All examples, scenarios, and prompts use actual RE workflows
- **Markdown-Native**: All materials in Markdown for multi-format conversion (slides, PDF, print)
- **Accessibility-First**: Plain language (Flesch-Kincaid Grade 8-10), proper heading hierarchy
- **Compliance Embedded**: Fair Housing, data privacy, fraud prevention integrated throughout

### File Naming Conventions

- Slides: `module_NN_topic_name.md` (e.g., `module_05_prompting.md`)
- Exercises: `exercise_name.md` (e.g., `prompting_drills.md`)
- Handouts: `topic_type.md` (e.g., `prompting_framework_card.md`)
- Templates: `purpose_template.md` (e.g., `capstone_project_template.md`)

## Content Standards

### Markdown Format Requirements

**Slide Decks** (Reveal.js compatible):
- Front matter with `title:` and `theme:` metadata
- Horizontal rule `---` as slide separator
- Headings for slide titles (`#` or `##`)
- Speaker notes in HTML comments `<!-- Note: ... -->`
- Keep total slide count ≤40 across all 12 modules

**Handouts** (Print-ready):
- Single-page or front/back max (when converted to PDF)
- Scannable layout: bullets, checkboxes, bold headings
- Branding footer with course name and client
- QR code placeholder for digital resources
- Action-oriented (checklists, templates, frameworks)

**Exercises**:
- Standardized structure: Overview → Learning Objectives → Instructions → Facilitation Notes → Success Criteria → Variations → Follow-Up
- Real estate scenarios with specific property/client details
- Time allocations with checkpoints
- Clear success criteria for participants
- Facilitation notes for instructors

### Compliance Requirements

**Fair Housing Act**:
- Never use demographic descriptors (age, family status, race, religion, etc.)
- Avoid steering language ("family-friendly", "safe neighborhood")
- Stick to property facts and verifiable location features
- Include explicit warnings in prompting exercises

**Data Privacy**:
- Warn against uploading client PII to AI tools
- Reference MLS data usage rules
- Anonymize all example addresses and client names
- Include privacy posture in tool selection criteria

**Fraud Prevention**:
- All fraud examples must be current and verified (cross-reference with FBI IC3 reports)
- Include "verify via known channel" SOP
- Provide specific red flags for text, voice, image, and document fraud
- Legal liability language should include attorney review disclaimer

### Real Estate Context Requirements

All examples, prompts, and scenarios must:
- Use realistic property details (beds/baths/sqft/location/price)
- Reference actual RE workflows (listing prep, CMA, lead triage, etc.)
- Include compliance considerations (MLS rules, Fair Housing, wire fraud)
- Align with attendee pain points identified in `research/real_estate_landscape.md`
- Use industry-standard terminology (CTA, CMA, DOM, list-to-sale ratio, etc.)

## Working with Course Materials

### Making Changes to Modules

1. **Check Source Documents**: Verify change aligns with `courseoutline.md` learning outcomes
2. **Timing Implications**: Check `Beginning.md` run-of-show for timing constraints
3. **Cross-References**: Update related exercises, handouts, and instructor guide
4. **Consistency**: Ensure terminology matches across all materials
5. **Compliance Check**: Review against Fair Housing, privacy, and fraud standards

### Adding New Content

**New Exercise**:
1. Use standard structure from `exercises/README.md`
2. Allocate time within 9am-4pm constraint (check `Beginning.md`)
3. Create corresponding handout if needed
4. Add facilitation notes to `instructor/instructor_guide.md`
5. Link to relevant learning outcomes in `design/learning_outcomes.md`

**New Prompt Examples**:
1. Add to `resources/prompt_library.md` (create if doesn't exist)
2. Follow 4-part framework: Context, Task, Constraints, Format
3. Include real estate specifics and compliance guardrails
4. Test prompt and include example output
5. Add fact-check or verification step

**New Slide Deck**:
1. Use Reveal.js Markdown format with front matter
2. Follow demo-first approach (show before tell)
3. Keep text minimal (headlines + key bullets)
4. Add speaker notes for instructor guide
5. Verify total slide count stays ≤40

### Converting Formats

**Markdown to PDF** (for handouts):
```bash
pandoc handout.md -o handout.pdf --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=12pt
```

**Markdown to Reveal.js Slides**:
- Use `reveal-md` or deploy to Reveal.js server
- Ensure front matter includes `theme:` (recommend `simple` or `white`)
- Preview before presenting to test transitions

**Markdown to Word** (for client delivery):
```bash
pandoc document.md -o document.docx
```

## Development Workflow

### Subagent Orchestration Model

This project uses a **phase-based subagent orchestration** approach documented in `SUBAGENT_ORCHESTRATION.md`:

**Phase 1: Research Foundation**
- Real estate landscape analysis
- AI pedagogy research
- Security & fraud analysis

**Phase 2: Instructional Design**
- Learning outcomes architecture
- Module content blueprints
- Assessment design

**Phase 3: Content Creation**
- 12 module slide decks
- Instructor facilitation guide
- 6 hands-on exercises

**Phase 4: Supplementary Materials**
- 6 participant handouts
- Templates (scenario cards, capstone, resource hub)
- Prompt library (30+ prompts)

**Phase 5: Quality Assurance**
- Content review (alignment, consistency, completeness)
- Compliance validation (Fair Housing, privacy, fraud)
- Technical integration (final package assembly)

**When Working Across Phases**:
- Check dependencies in `SUBAGENT_ORCHESTRATION.md` before starting
- Verify inputs from prior phases are complete
- Follow output specifications exactly
- Update cross-references when modifying upstream content

### Quality Standards

**Before Committing Changes**:
- [ ] Alignment: Verify against `courseoutline.md` source of truth
- [ ] Consistency: Check terminology matches existing materials
- [ ] Completeness: Ensure all referenced handouts/exercises exist
- [ ] Compliance: Review Fair Housing, privacy, fraud standards
- [ ] Cross-references: Update instructor guide and related materials
- [ ] Timing: Verify fits within 9am-4pm workshop schedule
- [ ] Format: Follow Markdown conventions for target output (slides/PDF/print)
- [ ] Accessibility: Plain language, proper headings, screen-reader friendly

**Severity Levels** (from quality-patterns.yml):
- **Critical**: Compliance violations, broken cross-references, timing overruns
- **High**: Inconsistent terminology, missing facilitation notes, incomplete exercises
- **Medium**: Formatting issues, minor wording improvements
- **Low**: Typos, style preferences

## Common Tasks

### Running Quality Checks

**Verify Timing**:
```bash
# Extract time allocations from Beginning.md and sum
grep "min" Beginning.md | grep -E "[0-9]+:[0-9]+"
```

**Check Cross-References**:
```bash
# Find broken internal links
grep -r "\[.*\](.*\.md)" . | grep -v "http"
```

**Validate Compliance**:
- Review all prompts for Fair Housing compliance (no protected classes)
- Check fraud examples against recent FBI IC3 reports
- Ensure data privacy warnings in tool usage sections

### Generating Deliverables

**Create Print-Ready Handouts**:
```bash
cd handouts
for f in *.md; do pandoc "$f" -o "${f%.md}.pdf" --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=12pt; done
```

**Generate Slide Decks**:
```bash
cd slides
reveal-md module_*.md --theme white --static _site
```

**Package for Client Delivery**:
1. Convert all handouts to PDF
2. Generate slide decks from Markdown
3. Create ZIP with directory structure intact
4. Include README with format conversion instructions

## Key Constraints

- **Total Workshop Time**: 9:00 AM - 4:00 PM (420 minutes total)
- **Teaching Time**: ~330 minutes (90 min breaks/lunch)
- **Total Slides**: Maximum 40 across all 12 modules
- **Handout Pages**: 2 pages max per handout (6 handouts = 12 pages)
- **Exercise Time**: 195 minutes total across 6 exercises
- **Target Audience**: Non-technical real estate professionals
- **Reading Level**: Flesch-Kincaid Grade 8-10
- **Print Format**: Black & white acceptable, QR codes must be functional

## Reference Documents

- **Course Requirements**: `courseoutline.md` (9 to 4 summary syllabus)
- **Build Specification**: `Beginning.md` (detailed run-of-show, materials, samples)
- **Development Plan**: `SUBAGENT_ORCHESTRATION.md` (27 subagents, 5 phases)
- **Mental Models Content**: `mentalmodels.md` (reference for Module 3 content)
- **Research Foundation**:
  - `research/real_estate_landscape.md` (workflow analysis, pain points, AI opportunities)
  - `research/ai_teaching_methods.md` (pedagogy, adult learning, demonstration techniques)
  - `research/fraud_landscape.md` (AI-enabled scams, detection, prevention)

## Terminology & Style

**Preferred Terms**:
- "AI tool" (not "AI assistant" or "AI model")
- "prompt" (not "query" or "request")
- "real estate professional" or "realtor" (not "agent" alone)
- "verification" (not "validation" in security context)
- "workflow" (not "process" for RE tasks)

**Voice & Tone**:
- Professional but approachable (conversational without being casual)
- Action-oriented (verb-first imperatives)
- Confidence-building (emphasize iteration and experimentation)
- Safety-conscious (compliance and fraud awareness embedded naturally)

**Real Estate Acronyms** (explain on first use):
- CMA: Comparative Market Analysis
- MLS: Multiple Listing Service
- DOM: Days on Market
- CTA: Call to Action
- HOA: Homeowners Association
- PII: Personally Identifiable Information

## Support & Resources

**Workshop Information**:
- Client: Williamson County Association of REALTORS (WCAR)
- Instructor: Ryan, Founder & CEO, Build Things that Build Things
- Target Participants: 30 (print 35 sets for buffer)

**External References**:
- Fair Housing Act compliance: HUD.gov guidance
- AI fraud reports: FBI IC3 Annual Reports
- NAR guidance: National Association of REALTORS AI policy
- Claude Code docs: `claudecodedocs.md` (local reference)

## Citations & Bibliography

### Citation Standards

All factual claims, statistics, and guidance must be cited using authoritative sources:

**Master Bibliography**: `resources/bibliography.md`
- Comprehensive list of all sources used in course materials
- APA 7th Edition format
- Numbered reference system (e.g., [FBI-1], [NAR-2])
- Includes: URLs, access dates, key data points, reliability ratings

**Citation Requirements**:
- ✅ **Authoritative**: Government, academic, industry association, or recognized research org
- ✅ **Current**: Published within last 24 months (except foundational concepts)
- ✅ **Accessible**: Publicly available URL or widely accessible
- ✅ **Verifiable**: Claims can be independently verified from source
- ✅ **Relevant**: Directly supports claim made in materials

**Citation Placement**:
- **Research documents**: Inline citations with numbered references `[FBI-1]`
- **Handouts**: Footnotes at bottom `[^1]`
- **Slide decks**: Source attribution on slide or in speaker notes
- **Instructor guide**: Full bibliography in appendix

### Key Sources

**Security & Fraud**:
- FBI Internet Crime Complaint Center (IC3): Annual reports, real estate fraud statistics
- CISA: Deepfake guidance, cybersecurity protocols
- NAR/ALTA: Industry-specific fraud prevention

**AI Technology**:
- Anthropic, OpenAI, Google: Official documentation, technical papers
- Academic research: AI capabilities, limitations, best practices

**Real Estate Industry**:
- NAR Member Profile & Technology Survey: Agent workflows, pain points, tech adoption
- NAR Code of Ethics: Standards for AI use in marketing and operations

**Compliance**:
- HUD Fair Housing: Protected classes, advertising requirements
- GDPR/CCPA: Data privacy obligations

**Pedagogy**:
- Knowles (Andragogy), Bloom's Taxonomy, Merrill (First Principles of Instruction)
- Dr. Ethan Mollick (Wharton): AI education research

### Verification Schedule

**Quarterly Review** (or when major events occur):
- Update fraud statistics (FBI IC3 annual report each May)
- Verify AI tool capabilities (rapid evolution)
- Check regulatory guidance updates
- Refresh industry research (NAR reports)

**Annual Audit**:
- Verify all URLs active
- Update with latest data
- Replace deprecated tools
- Add new sources

### Participant Resources

**Post-Workshop Resource Hub**: `resources/participant_resource_library.md`
- Clickable links to free AI tools
- Learning resources (courses, guides, tutorials)
- Fraud prevention resources (FBI, FTC, CISA)
- Compliance guidance (HUD, NAR, ALTA)
- Community resources (Reddit, Discord, LinkedIn)
- 30-day action plan for continued learning

**Purpose**: Provide ongoing support beyond workshop with vetted, reliable resources

## Course Status & Completion

**Completed (November 12, 2025)**:
- ✅ All 12 module slide decks created
- ✅ All 6 exercises developed
- ✅ All 6 required handouts completed:
  1. Prompting framework card ✓
  2. Context engineering worksheet ✓
  3. Job scan worksheet ✓
  4. Fraud red flags checklist ✓
  5. Tool selection matrix ✓
  6. Desktop AI quick card ✓
- ✅ Instructor guide comprehensive and ready
- ✅ QA compliance report completed (`qa/courseoutline_compliance_report.md`)
- ✅ Comprehensive bibliography created (`resources/bibliography.md`)
- ✅ Participant resource library built (`resources/participant_resource_library.md`)
- ✅ All critical issues from compliance review resolved

**Remaining Tasks** (Before Workshop Delivery):
1. **Format Conversion**:
   - Convert handouts to print-ready PDFs (use Pandoc commands in Common Tasks)
   - Generate slide decks from Markdown (use reveal-md or similar)
   - Test QR code functionality in handouts

2. **Content Review**:
   - Attorney review of fraud liability language in fraud_red_flags_checklist.md
   - Verify all URLs in participant_resource_library.md are active
   - Final proofreading pass for typos

3. **Logistics**:
   - Print 35 sets of handouts (6 handouts × 2 pages = 12 pages per set)
   - Create QR codes linking to participant_resource_library.md (hosted online)
   - Set up resource hub webpage (use templates/resource_hub_page.md as starting point)
   - Test all demo workflows on workshop WiFi

4. **Post-Workshop**:
   - Create alumni community group (platform TBD - Facebook, LinkedIn, Discord)
   - Schedule 7-day and 30-day follow-up emails
   - Implement feedback collection system

**Known Deviations from courseoutline.md** (documented in compliance report):
- 12 modules vs. 9 specified (added: Welcome/Framing, Capstone, Commitments) - **Value-add enhancement**
- Learning outcomes reframed from 7 to 5 (all original outcomes covered) - **Pedagogical improvement**
- **Recommendation**: Review deviations with client for approval before delivery
