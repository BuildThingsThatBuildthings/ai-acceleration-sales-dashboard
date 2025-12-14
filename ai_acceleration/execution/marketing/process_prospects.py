import csv
import argparse
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Scopes for Google Sheets
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_google_sheet_data(spreadsheet_id, range_name, credentials_file):
    """Reads data from a Google Sheet."""
    creds = Credentials.from_service_account_file(credentials_file, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    values = result.get('values', [])
    
    if not values:
        print('No data found.')
        return []

    # Assuming first row is header
    headers = values[0]
    data = []
    for row in values[1:]:
        item = {}
        for i, val in enumerate(row):
            if i < len(headers):
                item[headers[i]] = val
        data.append(item)
    return data

def casualize_company(company_name):
    """
    Removes legal suffixes and generic terms to make the company name sound natural.
    """
    suffixes = [", Inc.", " Inc.", ", LLC", " LLC", " Realty", " Real Estate", " Group", " Team", " Properties", " Inc"]
    clean_name = company_name
    for suffix in suffixes:
        if clean_name.endswith(suffix):
            clean_name = clean_name[:-len(suffix)]
    return clean_name.strip()

def generate_hook(notes):
    """
    Generates a personalized hook based on research notes.
    """
    if not notes:
        return "Hope you're having a great week."
    
    if "award" in notes.lower():
        return f"Huge congrats on the recent recognition—{notes}."
    if "list" in notes.lower():
        return f"Saw that listing you have—{notes} looks impressive."
        
    return f"I was reading about your work with {notes} and wanted to reach out."

def process_prospects(args):
    prospects = []
    
    # 1. Read Data
    if args.sheet_url:
        # Extract ID from URL
        spreadsheet_id = args.sheet_url.split('/d/')[1].split('/')[0]
        print(f"Reading from Google Sheet ID: {spreadsheet_id}")
        prospects = get_google_sheet_data(spreadsheet_id, "Sheet1!A:Z", "credentials.json")
    elif args.input:
        print(f"Reading from CSV: {args.input}")
        with open(args.input, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            prospects = list(reader)
    else:
        print("Error: Must provide --sheet_url or --input")
        return

    # 2. Process Data
    print("Processing data...")
    for p in prospects:
        p['Casual_Company'] = casualize_company(p.get('Company', ''))
        p['Personalized_Hook'] = generate_hook(p.get('Research Notes', ''))

    # 3. Output
    print("Saving to CSV.")
    fieldnames = list(prospects[0].keys()) if prospects else []
    with open(args.output, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(prospects)
    print(f"Saved to {args.output}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process prospects.')
    parser.add_argument('--input', help='Input CSV file')
    parser.add_argument('--sheet_url', help='Google Sheet URL')
    parser.add_argument('--output', help='Output CSV file', default='processed_prospects.csv')
    
    args = parser.parse_args()
    
    process_prospects(args)
