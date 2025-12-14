#!/usr/bin/env python3
"""
Consolidate two Google Sheets into the PRIMARY CRM.
Merges SECONDARY into PRIMARY, deduplicating by email address.
"""

import os
import json
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Sheet IDs
PRIMARY_SHEET_ID = '1wS3HfG_4jdfO8no4933GNw5KsO_B1uOZwLWBtpqMaM0'
SECONDARY_SHEET_ID = '1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0'

# Column index for email (0-indexed, column D = index 3)
EMAIL_COL = 3

def get_sheets_service():
    """Get authenticated Google Sheets service."""
    creds_path = os.path.join(os.path.dirname(__file__), '..', 'credentials.json')

    creds = Credentials.from_service_account_file(
        creds_path,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )

    return build('sheets', 'v4', credentials=creds)

def get_all_rows(service, sheet_id, range_name='A:Y'):
    """Get all rows from a sheet."""
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range=range_name
    ).execute()

    return result.get('values', [])

def extract_emails(rows, skip_header=True):
    """Extract email addresses from rows as a set for fast lookup."""
    emails = set()
    start = 1 if skip_header else 0

    for row in rows[start:]:
        if len(row) > EMAIL_COL and row[EMAIL_COL]:
            email = row[EMAIL_COL].strip().lower()
            if email and '@' in email:
                emails.add(email)

    return emails

def append_rows(service, sheet_id, rows):
    """Append rows to a sheet."""
    if not rows:
        return 0

    body = {'values': rows}

    result = service.spreadsheets().values().append(
        spreadsheetId=sheet_id,
        range='A:Y',
        valueInputOption='RAW',
        insertDataOption='INSERT_ROWS',
        body=body
    ).execute()

    return result.get('updates', {}).get('updatedRows', 0)

def main():
    print("=" * 60)
    print("SHEET CONSOLIDATION")
    print("=" * 60)
    print(f"\nPRIMARY:   {PRIMARY_SHEET_ID}")
    print(f"SECONDARY: {SECONDARY_SHEET_ID}")
    print()

    service = get_sheets_service()

    # Read both sheets
    print("Reading PRIMARY sheet...")
    primary_rows = get_all_rows(service, PRIMARY_SHEET_ID)
    print(f"  Found {len(primary_rows)} rows (including header)")

    print("Reading SECONDARY sheet...")
    secondary_rows = get_all_rows(service, SECONDARY_SHEET_ID)
    print(f"  Found {len(secondary_rows)} rows (including header)")

    # Get existing emails in PRIMARY
    primary_emails = extract_emails(primary_rows)
    print(f"\nUnique emails in PRIMARY: {len(primary_emails)}")

    # Find rows in SECONDARY that aren't in PRIMARY
    rows_to_add = []
    duplicates = 0
    no_email = 0

    # Skip header row in secondary
    for row in secondary_rows[1:]:
        if len(row) > EMAIL_COL and row[EMAIL_COL]:
            email = row[EMAIL_COL].strip().lower()
            if email and '@' in email:
                if email not in primary_emails:
                    rows_to_add.append(row)
                    primary_emails.add(email)  # Prevent duplicates within secondary
                else:
                    duplicates += 1
            else:
                no_email += 1
        else:
            no_email += 1

    print(f"\nAnalysis:")
    print(f"  - Duplicates (already in PRIMARY): {duplicates}")
    print(f"  - Rows without valid email: {no_email}")
    print(f"  - New rows to add: {len(rows_to_add)}")

    if rows_to_add:
        print(f"\nAppending {len(rows_to_add)} new rows to PRIMARY...")
        added = append_rows(service, PRIMARY_SHEET_ID, rows_to_add)
        print(f"  Added {added} rows successfully!")
    else:
        print("\nNo new rows to add - sheets already consolidated.")

    # Final count
    final_rows = get_all_rows(service, PRIMARY_SHEET_ID)
    print(f"\nFinal PRIMARY sheet: {len(final_rows)} rows")
    print("\nConsolidation complete!")

if __name__ == '__main__':
    main()
