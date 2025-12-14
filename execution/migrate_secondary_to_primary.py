#!/usr/bin/env python3
"""
Migrate leads from SECONDARY (LinkedIn) sheet to PRIMARY (CRM) sheet.
Maps columns strategically and deduplicates by email.
"""

import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Sheet IDs
PRIMARY_SHEET_ID = '1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0'
SECONDARY_SHEET_ID = '1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0'

# Credentials path
CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), '..', 'credentials.json')

# State name to abbreviation mapping
STATE_MAP = {
    "Pennsylvania": "PA", "Kentucky": "KY", "Tennessee": "TN",
    "Virginia": "VA", "Maryland": "MD", "West Virginia": "WV",
    "Ohio": "OH", "Indiana": "IN", "North Carolina": "NC",
    "New York": "NY", "New Jersey": "NJ", "Delaware": "DE",
    "Georgia": "GA", "Florida": "FL", "Alabama": "AL",
    "South Carolina": "SC", "Missouri": "MO", "Illinois": "IL",
    "Michigan": "MI", "Wisconsin": "WI", "Minnesota": "MN",
    "Iowa": "IA", "Kansas": "KS", "Nebraska": "NE",
    "Colorado": "CO", "Arizona": "AZ", "Nevada": "NV",
    "California": "CA", "Oregon": "OR", "Washington": "WA",
    "Texas": "TX", "Oklahoma": "OK", "Arkansas": "AR",
    "Louisiana": "LA", "Mississippi": "MS",
}

def get_sheets_service():
    """Authenticate and return Google Sheets service."""
    credentials = Credentials.from_service_account_file(
        CREDENTIALS_PATH,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )
    return build('sheets', 'v4', credentials=credentials)

def parse_location(location):
    """Parse 'City, State' into (city, state_abbrev)."""
    if not location:
        return "", ""

    parts = [p.strip() for p in location.split(",")]
    if len(parts) >= 2:
        city = parts[0]
        state = parts[-1].strip()
        # Convert full state name to abbreviation if needed
        state = STATE_MAP.get(state, state)
        return city, state

    # Single value - assume it's a city
    return location, ""

def safe_get(row, index, default=""):
    """Safely get value from row at index."""
    try:
        return row[index] if index < len(row) and row[index] else default
    except (IndexError, TypeError):
        return default

def transform_row(sec_row):
    """
    Transform SECONDARY row to PRIMARY format.

    SECONDARY columns (LinkedIn):
    0: Email, 1: Lead Status, 2: First Name, 3: Last Name
    11: summary, 15: jobTitle, 17: location
    19: companyName, 22: companyWebsite

    PRIMARY columns (CRM - 25 total A-Y):
    0: First Name, 1: Last Name, 2: Phone, 3: Email
    4: Official Company, 5: Casual Company, 6: Website
    7: City, 8: State, 9: AI Subject Line, 10: AI Opening Hook
    11: Contact Date, 12: Follow Up Date, 13: Called, 14: Emailed
    15: Call Notes, 16: Status
    17-24: Purchase/Referral fields (empty)
    """
    location = safe_get(sec_row, 17)
    city, state = parse_location(location)

    job_title = safe_get(sec_row, 15)
    call_notes = f"Role: {job_title}" if job_title else ""

    return [
        safe_get(sec_row, 2),           # A: First Name
        safe_get(sec_row, 3),           # B: Last Name
        "",                             # C: Phone (empty)
        safe_get(sec_row, 0),           # D: Email
        safe_get(sec_row, 19),          # E: Official Company
        safe_get(sec_row, 19),          # F: Casual Company (same)
        safe_get(sec_row, 22),          # G: Website
        city,                           # H: City
        state,                          # I: State
        "",                             # J: AI Subject Line (needs manual)
        safe_get(sec_row, 11),          # K: AI Opening Hook (from summary)
        "",                             # L: Contact Date
        "",                             # M: Follow Up Date
        "No",                           # N: Called
        "No",                           # O: Emailed
        call_notes,                     # P: Call Notes
        "Lead",                         # Q: Status
        "",                             # R: Bought 1Hr
        "",                             # S: Bought 3Hr
        "",                             # T: Bought 6Hr
        "",                             # U: Referred By
        "",                             # V: Referral Lead Date
        "",                             # W: Referral Book Date
        "",                             # X: Referral Bonus Owed
        "",                             # Y: Bonus Paid
    ]

def migrate():
    """Main migration function."""
    print("=" * 60)
    print("SECONDARY → PRIMARY Sheet Migration")
    print("=" * 60)

    service = get_sheets_service()

    # Fetch all rows from SECONDARY
    print("\n[1/4] Fetching SECONDARY sheet...")
    sec_response = service.spreadsheets().values().get(
        spreadsheetId=SECONDARY_SHEET_ID,
        range='Sheet1!A2:Z'
    ).execute()
    sec_rows = sec_response.get('values', [])
    print(f"      Found {len(sec_rows)} total rows")

    # Fetch emails from PRIMARY for dedup
    print("\n[2/4] Fetching PRIMARY emails for deduplication...")
    pri_response = service.spreadsheets().values().get(
        spreadsheetId=PRIMARY_SHEET_ID,
        range='Sheet1!D:D'
    ).execute()
    pri_emails = set(
        row[0].lower().strip()
        for row in pri_response.get('values', [])[1:]  # Skip header
        if row and row[0]
    )
    print(f"      Found {len(pri_emails)} existing emails in PRIMARY")

    # Transform and filter rows
    print("\n[3/4] Processing rows...")
    rows_to_add = []
    skipped_no_email = 0
    skipped_duplicate = 0

    for sec_row in sec_rows:
        email = safe_get(sec_row, 0).strip()

        # Skip rows without valid email
        if not email or '@' not in email:
            skipped_no_email += 1
            continue

        # Skip duplicates
        if email.lower() in pri_emails:
            skipped_duplicate += 1
            continue

        # Transform and add
        transformed = transform_row(sec_row)
        rows_to_add.append(transformed)
        pri_emails.add(email.lower())  # Prevent duplicates within batch

    print(f"      Skipped (no email): {skipped_no_email}")
    print(f"      Skipped (duplicate): {skipped_duplicate}")
    print(f"      Ready to migrate: {len(rows_to_add)}")

    if not rows_to_add:
        print("\nNo rows to migrate!")
        return

    # Append to PRIMARY
    print(f"\n[4/4] Appending {len(rows_to_add)} rows to PRIMARY...")
    result = service.spreadsheets().values().append(
        spreadsheetId=PRIMARY_SHEET_ID,
        range='Sheet1!A:Y',
        valueInputOption='RAW',
        insertDataOption='INSERT_ROWS',
        body={'values': rows_to_add}
    ).execute()

    updates = result.get('updates', {})
    print(f"      Updated range: {updates.get('updatedRange')}")
    print(f"      Rows added: {updates.get('updatedRows')}")

    print("\n" + "=" * 60)
    print("MIGRATION COMPLETE")
    print("=" * 60)
    print(f"\nSummary:")
    print(f"  - Migrated: {len(rows_to_add)} leads")
    print(f"  - Skipped (no email): {skipped_no_email}")
    print(f"  - Skipped (duplicate): {skipped_duplicate}")
    print(f"\nNote: {len(rows_to_add)} leads have EMPTY AI Subject Lines.")
    print("These need manual personalization in the PRIMARY sheet.")

if __name__ == '__main__':
    migrate()
