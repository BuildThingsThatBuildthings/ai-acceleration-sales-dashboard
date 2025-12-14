const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

async function forceSync() {
  console.log('--- STARTING MANUAL FORCE SYNC (INCLUSIVE) ---');

  // 1. DB Connection
  const dbPath = path.join(__dirname, '../sales.db');
  console.log('Connecting to DB:', dbPath);
  const db = new Database(dbPath);

  // 2. Google Auth
  const credPath = path.join(__dirname, '../../credentials.json');
  const auth = new google.auth.GoogleAuth({
    keyFile: credPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const spreadsheetId = '1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0';

  // 3. Fetch WIDE Range
  console.log('Fetching range A2:AA...');
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:AA', 
  });
  const rows = response.data.values;
  console.log(`Fetched ${rows.length} rows.`);

  // 4. Update DB
  const update = db.prepare('UPDATE leads SET hook = ?, name = ?, phone = ?, company = ?, role = ?, raw_data = ? WHERE email = ?');
  const create = db.prepare('INSERT INTO leads (name, email, phone, company, role, hook, status, raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const check = db.prepare('SELECT id FROM leads WHERE email = ?');

  let updated = 0;
  let created = 0;

  for (const row of rows) {
      // 0: Email, 2: First, 3: Last, 10: Summary, 17: Company, 13: Role
      let email = row[0];
      const firstName = row[2] || '';
      const lastName = row[3] || '';
      let name = `${firstName} ${lastName}`.trim();
      
      const company = row[17] || 'Unknown Company';
      const role = row[13] || 'Unknown Role';
      const hook = row[10] || row[11] || '';
      const rawData = JSON.stringify(row);

      // Validation / Placeholder Logic
      if (!email || !email.includes('@')) {
          if (!name && !company) continue; // Skip empty
          if (!name) name = "Unknown Lead";
          // Placeholder email
          const sanitized = (name + company).replace(/[^a-z0-9]/gi, '');
          // Simple random suffix to reduce collision chance in this script
          email = `no_email_${sanitized}_${Math.floor(Math.random() * 100000)}@ai-acceleration.com`;
      }

      if (check.get(email)) {
          update.run(hook, name, '', company, role, rawData, email);
          updated++;
      } else {
          create.run(name, email, '', company, role, hook, 'New', rawData);
          created++;
      }
  }

  console.log(`SYNC COMPLETE. Created: ${created}, Updated: ${updated}`);
}

forceSync();
