# Assets Folder

Central repository for all visual content. One asset, multiple platforms.

---

## Folder Structure

```
assets/
├── self-filmed/          # Phone/camera footage you record
├── ai-videos/            # AI-generated video content
├── ai-images/            # AI-generated images (NanoBanana, Midjourney, etc.)
└── README.md             # This file
```

---

## Naming Convention

All assets follow this pattern:

```
[TYPE]-[CATEGORY]-[NUMBER]-[DESCRIPTION].[ext]
```

### Type Prefixes

| Prefix | Meaning | Example |
|--------|---------|---------|
| SF | Self-filmed | SF-tip-001-prompt-trick.mp4 |
| AV | AI video | AV-story-012-skeptic-conversion.mp4 |
| AI | AI image | AI-stat-005-14-hours-wasted.png |

### Category Codes

| Code | Content Type | Description |
|------|--------------|-------------|
| tip | Quick tip | Educational micro-content |
| story | Story content | Transformation stories, testimonials |
| stat | Statistics | Data-driven visuals |
| quote | Quote graphics | Text-based motivational/insight |
| promo | Promotional | Workshop announcements, CTAs |
| demo | Demonstration | Screen recordings, tutorials |
| pain | Pain point | Problem-focused content |
| proof | Social proof | Results, testimonials |
| hook | Hook content | Attention grabbers |
| bts | Behind the scenes | Real work moments |

### Examples

**Self-Filmed:**
```
SF-tip-001-one-prompt-fix.mp4
SF-story-003-skeptic-broker.mp4
SF-demo-007-chatgpt-listing.mp4
SF-bts-002-workshop-setup.mp4
```

**AI Videos:**
```
AV-hook-001-scrolling-agent.mp4
AV-pain-005-midnight-typing.mp4
AV-promo-002-workshop-announcement.mp4
```

**AI Images:**
```
AI-stat-001-68-percent-adoption.png
AI-quote-003-tools-not-broken.png
AI-proof-007-before-after.png
AI-promo-001-workshop-banner.png
```

---

## Asset Creation Guide

### Self-Filmed Content (SF)

**Equipment:**
- Phone (1080p minimum, 4K preferred)
- Ring light or window light
- Lavalier mic or phone's built-in
- Tripod or phone mount

**Recording Settings:**
- Vertical (9:16) for TikTok/Reels/Shorts
- Horizontal (16:9) for YouTube long-form
- Record both if possible

**File Format:**
- MP4 or MOV
- Keep original high-res version
- Export compressed versions for upload

**Content Types:**
| Code | What to Film |
|------|--------------|
| tip | Talking head tips, quick tutorials |
| story | Personal stories, client transformations |
| demo | Screen recordings with voiceover |
| bts | Workshop prep, office moments, real work |
| hook | Pattern interrupts, attention grabbers |

---

### AI-Generated Videos (AV)

**Tools:**
- Runway ML (motion from images)
- Pika Labs (text-to-video)
- HeyGen (AI avatars)
- Synthesia (talking head AI)
- CapCut (AI features + editing)

**Best Practices:**
- Keep under 15 seconds per clip
- Use for B-roll and transitions
- Combine with self-filmed content
- Add captions manually (AI auto-captions aren't great)

**Content Types:**
| Code | What to Generate |
|------|------------------|
| hook | Eye-catching openers |
| pain | Visualized frustration scenarios |
| demo | Screen animation overlays |
| promo | Dynamic announcement clips |

---

### AI-Generated Images (AI)

**Primary Tool: NanoBanana (Gemini)**

See `/nanobanana/README.md` for complete prompting guide.

**Quick Reference:**
- Describe scenes in narrative paragraphs
- Include: shot type, subject, action, environment, lighting, mood
- Specify aspect ratio (1:1 for feed, 9:16 for stories, 16:9 for YouTube)

**Secondary Tools:**
- Midjourney (artistic, stylized)
- DALL-E 3 (integrated with ChatGPT)
- Ideogram (text rendering)
- Leonardo AI (variety of styles)

**Content Types:**
| Code | What to Generate |
|------|------------------|
| stat | Data visualization backgrounds |
| quote | Text-ready backgrounds |
| pain | Stressed agent scenarios |
| proof | Before/after comparisons |
| promo | Event banners, workshop graphics |
| story | Scene-setting imagery |

---

## Cross-Platform Specs

### Aspect Ratios

| Platform | Feed | Stories/Reels |
|----------|------|---------------|
| Instagram | 1:1 or 4:5 | 9:16 |
| TikTok | 9:16 | 9:16 |
| YouTube Shorts | 9:16 | 9:16 |
| YouTube Long | 16:9 | N/A |
| LinkedIn | 1:1 or 16:9 | N/A |
| Facebook | 1:1 or 16:9 | 9:16 |

### Resolution Requirements

| Format | Minimum | Recommended |
|--------|---------|-------------|
| Feed images | 1080x1080 | 1440x1440 |
| Stories/Reels | 1080x1920 | 1080x1920 |
| YouTube | 1920x1080 | 3840x2160 |
| Thumbnails | 1280x720 | 1920x1080 |

---

## Asset Tracking

Maintain a simple spreadsheet:

| Asset ID | Type | Category | Platforms Used | Date Created | Notes |
|----------|------|----------|----------------|--------------|-------|
| SF-tip-001 | Video | Tip | TT, IG, YT | 2025-01-15 | Prompt trick |
| AI-stat-003 | Image | Stat | LI, FB, IG | 2025-01-16 | 14 hours stat |

This prevents duplicate work and tracks what's been posted where.

---

## Content Production Workflow

### Weekly Production Session (2-3 hours)

**Hour 1: Self-Filmed**
1. Review scripts for the week
2. Film 5-10 vertical clips
3. Film any horizontal content needed

**Hour 2: AI Generation**
1. Generate 10-15 images (batch prompts)
2. Generate any AI video clips needed
3. Organize into folders

**Hour 3: Assembly**
1. Edit videos (CapCut recommended)
2. Add captions to all video content
3. Create platform-specific versions
4. Export with correct naming

---

## File Management

### Folder Organization

```
assets/
├── self-filmed/
│   ├── raw/                    # Original footage
│   └── edited/                 # Final versions
├── ai-videos/
│   ├── source/                 # Original AI outputs
│   └── edited/                 # With captions, cuts, etc.
├── ai-images/
│   ├── source/                 # Original AI outputs
│   └── formatted/              # Platform-specific versions
└── exports/
    ├── tiktok/
    ├── instagram/
    ├── youtube/
    ├── linkedin/
    └── facebook/
```

### Backup Strategy

- Keep all RAW/source files
- Backup weekly to cloud (Google Drive, Dropbox)
- Never delete source footage

---

*One asset library. Every platform covered.*
