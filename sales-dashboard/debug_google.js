const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function testConnection() {
  console.log('--- STARTING DEBUG ---');
  
  // 1. Locate Credentials
  const credPath = path.join(process.cwd(), '..', 'credentials.json');
  console.log(`Looking for credentials at: ${credPath}`);
  
  if (!fs.existsSync(credPath)) {
    console.error('ERROR: credentials.json not found in parent directory!');
    return;
  }
  console.log('SUCCESS: Credentials file found.');

  try {
    // 2. Auth
    const auth = new google.auth.GoogleAuth({
      keyFile: credPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const client = await auth.getClient();
    console.log('SUCCESS: Auth client created.');

    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = '1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0';
    
    // 3. Metadata Check (List Sheets)
    console.log(`Checking Spreadsheet ID: ${spreadsheetId}`);
    const metadata = await sheets.spreadsheets.get({ spreadsheetId });
    console.log('Sheet Names found:', metadata.data.sheets.map(s => s.properties.title));

    // 4. Fetch Headers to verify mapping
    const range = 'Sheet1!A1:Z1'; // Grab headers
    console.log(`Fetching headers: ${range}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range, 
    });

    const headers = response.data.values;
    if (headers && headers.length > 0) {
      console.log('HEADERS:', headers[0]);
    }

    // Fetch sample data
    const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A2:Z2',
    });
    console.log('SAMPLE ROW:', dataResponse.data.values[0]);

  } catch (error) {
    console.error('FATAL ERROR during execution:', error.message);
    if (error.response) {
       console.error('API Response:', error.response.data);
    }
  }
}

testConnection();
