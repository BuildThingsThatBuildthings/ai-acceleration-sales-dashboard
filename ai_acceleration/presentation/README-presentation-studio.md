# AI Acceleration Presentation Studio
**Visually Stunning Presentation Platform for Workshop Delivery**

---

## 🎯 What This Is

A professional, dual-window presentation system that lets you (instructor) navigate course materials while students see beautifully designed, full-screen presentations optimized for projectors.

**Two Windows, One System:**
- **Presenter Window** (your laptop) - Navigate, preview, control
- **Presentation Window** (projector) - Stunning, large-format content for students

---

## 🚀 Quick Start

### Step 1: Start the Server
```bash
cd /Users/ryan/ai_acceleration
python3 -m http.server 8000
```
Keep this terminal window open during your workshop.

### Step 2: Open Presentation Studio
Open your browser to:
```
http://localhost:8000/presentation/presentation-studio.html
```

### Step 3: Open Presentation Window
1. In the presenter window, click **"📽️ Open Presentation Window"**
2. A new window opens - this is what students will see
3. Drag this window to your projector screen
4. Press **F11** (or Fn+F) for fullscreen on projector

### Step 4: Start Presenting
1. In presenter window (your laptop), click any document in the sidebar
2. Students instantly see it beautifully rendered on the projector
3. Navigate through materials by clicking different documents
4. Preview shows you what students see

---

## 🎨 What Makes It Visually Stunning

### Projector-Optimized Typography:
- **Headings**: 70-100px (readable from anywhere in the room)
- **Body text**: 32px (comfortable viewing from back row)
- **Code blocks**: 28px with syntax highlighting
- **Montserrat** (headings) + **Open Sans** (body) fonts

### Professional Design System:
- **Deep Blue** (#1a365d) - Primary color, authority
- **Electric Cyan** (#00b4d8) - Accent, energy, links
- **Clean whitespace** - Breathing room, not cluttered
- **Strategic color blocks** - Visual hierarchy

### Beautiful Layouts by Content Type:

#### Module Slides:
- Full-screen, centered content
- Large hero typography
- Minimal elements per screen
- High contrast for readability

#### Handouts:
- Professional document layout
- Section headers with colored backgrounds
- Visual dividers between sections
- Clean, readable formatting

#### Exercises:
- Numbered step cards with visual borders
- Color-coded instructions (blue backgrounds)
- Large, clear typography
- Highlighted success criteria

#### Resources/Bibliography:
- Grid layout for easy scanning
- Organized by category
- Visual card design
- Links styled prominently

---

## 💡 How to Use During Workshop

### Before Workshop (30 min before):
1. Start server (`python3 -m http.server 8000`)
2. Open presenter window in browser
3. Click "Open Presentation Window"
4. Drag presentation window to projector
5. Press F11 for fullscreen on projector
6. Test by clicking a few documents

### During Workshop:
1. **Presenter window stays on your laptop** - you see:
   - Full navigation sidebar
   - Search bar for finding materials
   - Preview of what students see

2. **Presentation window on projector** - students see:
   - Beautifully formatted content
   - Large, readable text
   - Professional design
   - No navigation clutter

3. **Click any document** in sidebar:
   - Preview updates on your screen
   - Presentation updates on projector
   - Smooth, instant transition

### Common Scenarios:

**Starting Module 5:**
```
Click: "Module 05: Prompting Fundamentals"
Students see: Large title "Prompting Fundamentals"
              Plus CLEAR framework content
              Beautifully styled with huge text
```

**Distributing a handout:**
```
Click: "Prompting Framework Card"
Students see: Professional handout layout
              Section headers in blue
              Clean, printable format
              Can read entire content clearly
```

**Running an exercise:**
```
Click: "Prompting Drills"
Students see: Exercise title and instructions
              Numbered steps in card format
              Large text they can follow along
              Success criteria highlighted
```

**Answering a question about fraud:**
```
Search: "fraud"
Click: "Fraud Red Flags Checklist"
Students see: Full fraud prevention guide
              4 attack vectors visually separated
              Statistics in large format
              Action items clearly outlined
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl/Cmd + P** | Open presentation window |
| **Ctrl/Cmd + F** | Toggle fullscreen |
| **F11** (Windows) or **Fn + F** (Mac) | Fullscreen on presentation window |
| **ESC** | Exit fullscreen |

---

## 🎓 Features Overview

### Dual-Window System:
- **Presenter View** - Your control panel
- **Presentation View** - What students see
- **Windows stay in sync** - Click once, both update

### Content Type Detection:
- System automatically detects document type
- Applies appropriate visual template
- **Slides**: Full-screen centered layout
- **Handouts**: Document format
- **Exercises**: Step-by-step cards
- **Resources**: Grid layout

### Visual Templates:
- **Large typography** (70-100px headings)
- **Professional layouts** - Not generic markdown
- **Color-coded sections** - Deep Blue/Electric Cyan
- **Optimized for projectors** - High contrast, readable from distance

### Search & Navigation:
- **Search bar** - Type keyword to filter documents
- **Category organization** - 6 main categories
- **One-click access** - No nested menus
- **Preview pane** - See before students do

---

## 🎨 Visual Design Highlights

### Welcome Screen:
- Gradient background (Deep Blue → Electric Cyan)
- Large "AI Acceleration" title (140px)
- Professional, modern aesthetic
- Sets tone for workshop

### Module Slides:
- **H1**: 100px, Montserrat Black, Deep Blue
- **H2**: 70px, Montserrat Bold, Electric Cyan
- **Body**: 32px, Open Sans, high line-height
- Clean, uncluttered layouts
- Strategic use of whitespace

### Handouts:
- Section headers with colored bars
- Two-column layout where appropriate
- Visual dividers between sections
- Print-friendly design

### Exercises:
- Light blue background (#e3f2fd)
- Numbered steps in white cards
- Blue left border on each step
- Success boxes in green

### Code Blocks:
- Dark blue background (#1a365d)
- White text for contrast
- 28px font size
- Syntax highlighting
- Rounded corners, shadows

---

## 📋 Workshop Day Workflow

### Setup (15 minutes):
1. [ ] Start web server
2. [ ] Open presenter window
3. [ ] Open presentation window
4. [ ] Move presentation window to projector
5. [ ] F11 for fullscreen on projector
6. [ ] Test by clicking Course Skeleton
7. [ ] Verify students' screen shows content

### During Workshop:
- **Keep presenter window on your laptop**
- **Keep presentation window on projector**
- **Click documents as needed**
- **Use search when students ask questions**
- **Leave both windows open all day**

### After Workshop:
1. Close presentation window
2. Close presenter window
3. Stop server (Ctrl+C in terminal)

---

## 🛠️ Technical Details

### How It Works:
- **Single HTML file** with embedded styles
- **Dual-window architecture** - Main window + popup
- **Window communication** - Updates sync automatically
- **Markdown rendering** - marked.js library
- **CSS templates** - Type-based styling
- **Responsive design** - Works on any screen size

### Browser Requirements:
- Modern browser (Chrome, Safari, Firefox, Edge)
- JavaScript enabled
- Popup blocker disabled (for presentation window)

### Network Requirements:
- Local web server (python3 -m http.server)
- Internet for fonts (Google Fonts CDN)
- Internet for marked.js (CDN)
- After first load, works offline (cached)

### Performance:
- Instant document switching
- No build step required
- No lag or delays
- Smooth transitions

---

## 🆘 Troubleshooting

### "Open Presentation Window" button does nothing:
- **Issue**: Browser blocking popups
- **Fix**: Allow popups for localhost
- **Check**: Browser address bar for popup blocked icon

### Documents won't load:
- **Issue**: Server not running or wrong path
- **Fix**: Verify server is running on port 8000
- **Check**: Terminal shows "Serving HTTP on..."

### Text too small on projector:
- **Issue**: Projector resolution mismatch
- **Fix**: This shouldn't happen - fonts are 32px+ minimum
- **Workaround**: Browser zoom (Ctrl/Cmd + Plus)

### Windows not staying in sync:
- **Issue**: Presentation window was closed and reopened
- **Fix**: Click document again to refresh both windows
- **Prevention**: Don't close presentation window during workshop

### Fonts look wrong:
- **Issue**: Google Fonts didn't load (no internet)
- **Fix**: Connect to internet and refresh
- **Note**: Still readable with fallback fonts

---

## 💡 Pro Tips

### Before Workshop:
- **Test on actual projector** - Colors and size may differ
- **Bookmark frequently used documents** - Create mental map
- **Practice navigating** - Be smooth during workshop
- **Have backup screenshots** - In case server fails

### During Workshop:
- **Keep presentation window fullscreen** - Don't minimize
- **Use search liberally** - Faster than clicking through categories
- **Preview before switching** - See what students will see
- **Don't close windows** - Leave open all day

### For Best Visual Impact:
- **Let content breathe** - Don't rush through slides
- **Zoom if needed** - Ctrl/Cmd + Plus for even larger text
- **Use fullscreen** - F11 removes all browser chrome
- **Dim lights** - Projector content pops more

---

## 📊 Content Organization

**Total Documents**: 30+ materials across 6 categories

### Core Documents (3 files):
- Course Skeleton
- Course Outline
- Mental Models

### Module Slides (12 files):
- All 12 workshop modules
- Module 01 through Module 12

### Handouts (7 files):
- Mental Models Cheat Sheet
- Prompting Framework Card
- Context Engineering Worksheet
- Job Scan Worksheet
- Tool Selection Matrix
- Fraud Red Flags Checklist
- Desktop AI Quick Card

### Exercises (6 files):
- Prompting Drills
- Context Cards
- Job Scan Workshop
- Fraud Demos
- Desktop AI Follow-Along
- Capstone Sprint

### Resources (2 files):
- Bibliography (30+ Sources)
- Participant Resource Library (100+ Links)

### Instructor Materials (1 file):
- Comprehensive Instructor Guide

---

## 🎯 Success Criteria

**You'll know it's working when:**
- ✅ Students can read content from back of room
- ✅ Design looks professional and polished
- ✅ Navigation is smooth and confident
- ✅ No fumbling between files or applications
- ✅ Students comment on professional appearance
- ✅ You can find any document in < 5 seconds

**Students should think:**
- "Wow, this looks professional"
- "I can read everything clearly"
- "This trainer knows what they're doing"
- "This course is well-organized"

---

## 🔄 Updating Content

### To Update a Document:
1. Edit the markdown file (e.g., `/slides/module_05_prompting.md`)
2. Save changes
3. In presenter window, click document again
4. Content updates immediately in both windows

### To Add New Documents:
1. Create markdown file in appropriate directory
2. Edit `presentation-studio.html`
3. Add entry to `materials` object (around line 735)
4. Format: `{ name: 'Doc Name', path: '../path/to/doc.md', type: 'slide' }`
5. Refresh browser

---

## 📞 Support & Help

### If Something Breaks:
1. **Refresh both windows** (Ctrl/Cmd + R)
2. **Restart server** if files won't load
3. **Check terminal** for error messages
4. **Test in different browser** if issues persist

### Common Issues & Solutions:
- **Popup blocked**: Allow popups in browser settings
- **Fonts not loading**: Check internet connection
- **Content not updating**: Click document again
- **Window closed accidentally**: Click "Open Presentation Window" again

---

## ✅ Pre-Workshop Checklist

**30 Minutes Before:**
- [ ] Server running (`python3 -m http.server 8000`)
- [ ] Presenter window open in browser
- [ ] Presentation window opened
- [ ] Presentation window on projector screen
- [ ] F11 pressed for fullscreen
- [ ] Test document clicked (Course Skeleton)
- [ ] Students' screen verified working
- [ ] Search tested
- [ ] Both windows staying open

**You're Ready!**

---

## 🎉 You're Set!

This presentation system gives you:
- **Professional appearance** - Students see polished, designed content
- **Easy navigation** - Find any document instantly
- **Projector-optimized** - Large, readable text
- **Dual-window control** - You navigate, students see results
- **Smooth workflow** - No fumbling, no delays

**Start your server, open the studio, and start presenting!**

---

**Last Updated**: November 13, 2025
**Version**: 1.0
**Built for**: AI Acceleration Workshop, WCAR
