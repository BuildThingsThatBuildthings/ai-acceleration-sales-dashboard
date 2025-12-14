# Netlify Deployment Guide

> **CRITICAL WARNING:** This app currently uses **SQLite** (`sales.db`), which writes to a local file. Netlify is **serverless**, meaning the file system is ephemeral. **Any data you save (Booked Calls, Feedback) will disappear after a few minutes on Netlify.** 

To deploy successfully for production usage, you have two options:

---

## Option 1: The "Right" Way (Migrate DB to Cloud)
Use this if you need persistent data on Netlify.

### 1. Create a Turso Database
Turso is a fast SQLite-compatible cloud database.
1. Sign up at [turso.tech](https://turso.tech).
2. Create a database.
3. Get the **Database URL** and **Auth Token**.

### 2. Update `src/lib/db.ts`
You need to switch from `better-sqlite3` to `@libsql/client`.
(I can perform this code migration for you if you ask: *"Migrate database to Turso"*).

---

## Option 2: The "Easiest" Way (Deploy to Railway)
Railway offers persistent storage so your `sales.db` file will work just like it does on your laptop.

1. Create a repo on GitHub (Already done).
2. Go to [railway.app](https://railway.app).
3. "New Project" -> "Deploy from GitHub".
4. Select `ai-acceleration-sales-dashboard`.
5. Add the **Google Credentials Variable** (see below).

---

## Setting up Google Credentials (Required for BOTH options)
Because `credentials.json` is a sensitive file, we do not commit it to GitHub. You must add it as an **Environment Variable**.

1. Open your local `credentials.json` file.
2. Copy the **entire content**.
3. Minify it (remove newlines) -> You can use a tool or just ensure it's a valid JSON string.
4. Go to your Host (Netlify "Environment Variables" / Railway "Variables").
5. Add a new variable:
   *   **Key:** `GOOGLE_SHEETS_CREDENTIALS`
   *   **Value:** `[PASTE THE JSON CONTENT HERE]`

## Deploying to Netlify (If you accept the Data Reset risk)
1. Log in to Netlify.
2. "Add new site" -> "Import an existing project".
3. Select GitHub -> `ai-acceleration-sales-dashboard`.
4. **Build Settings:**
   *   **Build Command:** `npm run build`
   *   **Publish Directory:** `.next`
5. **Environment Variables:**
   *   Add `GOOGLE_SHEETS_CREDENTIALS` (as described above).
6. Click **Deploy**.
