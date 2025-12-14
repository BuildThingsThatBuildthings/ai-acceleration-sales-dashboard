const { google } = require('googleapis');
const path = require('path');

async function analyzeSheet() {
  const credPath = path.join(__dirname, '../../credentials.json');
  const auth = new google.auth.GoogleAuth({
    keyFile: credPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const spreadsheetId = '1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0';

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:AA',
  });
  const rows = response.data.values;
  
  console.log(`Total Rows Fetched: ${rows.length}`);
  
  let validEmail = 0;
  let noEmailButName = 0;
  let empty = 0;
  const emails = new Set();
  let duplicates = 0;

  rows.forEach((row, i) => {
      const email = row[0];
      const name = row[2];
      // Let's check all columns for a phone-like pattern or just look for non-empty
      // But first, let's just log the first row (headers) to find the phone column
      if (i === 0) {
          console.log('Headers:', row);
          return;
      }
      
      if (!email && !name) {
          empty++;
          return;
      }

      if (email && email.includes('@')) {
          if (emails.has(email)) {
              duplicates++;
          } else {
              emails.add(email);
              validEmail++;
          }
      } else {
          if (name) {
              if (noEmailButName < 5) console.log(`Skipped (No Email): ${name}, col[17]=${row[17]}`);
              noEmailButName++;
          }
      }
  });

  console.log('--- Analysis ---');
  console.log(`Valid Unique Emails (Importable): ${validEmail}`);
  console.log(`Duplicates (Skipped): ${duplicates}`);
  console.log(`No Email but has Name (Skipped): ${noEmailButName}`);
  console.log(`Empty/Garbage Rows: ${empty}`);
  console.log(`Total data rows: ${validEmail + duplicates + noEmailButName}`);
}

analyzeSheet();
