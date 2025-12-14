# Sales Dashboard Application Guide

We have built a custom web application to manage your leads and sales calls. This replaces the spreadsheet for daily work.

## 1. Installation
The app is located in `sales-dashboard`.

**First Time Setup:**
1.  Open Terminal.
2.  Navigate to the folder: `cd sales-dashboard`
3.  Install dependencies: `npm install` (Already done)
4.  Seed the Database: `node scripts/seed.js` (Already done, but run this to reset data)

## 2. Running the App
To start the dashboard for your sales manager:

```bash
cd sales-dashboard
npm run dev
```

Then open your browser to **http://localhost:3000**.

## 3. Using the Dashboard
### The Lead List (Home)
*   Shows all leads sorted by "Newest".
*   **Status Badges:** Color-coded (New = Blue, Booked = Green).
*   **Action:** Click the "Call" button to enter Call Mode.

### Call Mode (The "Cockpit")
This screen is designed to be open *during* the phone call.
*   **Left Panel:** Lead info + The "Hook" (in yellow). Use this for step 1 of the script.
*   **Center Panel:**
    *   **Script Tab:** The dynamic script. Variables like `[Prospect Name]` are auto-filled. The Hook is highlighted.
    *   **Objections Tab:** Clickable "Battle Cards". If they say "Too Expensive", click that card to see the rebuttal.
*   **Bottom Bar:** Log the outcome.
    *   **Booked:** Marks lead as Booked.
    *   **Not Interested:** Marks lead as Dead.
    *   **Bad Data:** Flags for cleanup.

## 4. Updates & Improvements
*   **Edit Scripts:** The scripts are stored in the SQLite database. You can edit `scripts/seed.js` and re-run it to change the global script, or we can build an Admin Edit page in the future.
*   **Database:** Data is stored in `sales-dashboard/sales.db`. This is a portable SQLite file.
