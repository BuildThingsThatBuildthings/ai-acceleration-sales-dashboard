#!/usr/bin/env python3
"""
Fix specific CRM rows with researched data.
Updates only the columns that need fixing, preserving everything else.
DOES NOT add contact dates.
"""

import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Fixes to apply: row_number -> {column_letter: new_value}
# Column A = First Name, B = Last Name, C = Phone, D = Email, E = Official Company,
# J = AI Subject Line, K = AI Opening Hook
FIXES = {
    # Row 255: Jeff Unknown → Jeff Wright (Foundation First Property Group)
    255: {
        'B': 'Wright',
        'J': 'RMP designation and PA NARPM President—impressive credentials, Jeff',
        'K': 'Earning your RMP designation while serving as 2020-2021 President of the PA State Chapter of NARPM—then receiving the 2021 Volunteer of the Year award—shows serious dedication to property management excellence. Your journey from that first fixer-upper in 2008 to building Foundation First is the kind of story that resonates.'
    },
    # Row 256: Ashlee Unknown → Ashlee Stutzman (YRG Property Services)
    256: {
        'B': 'Stutzman',
        'J': 'From 2014 to Operating Partner—impressive growth at YRG, Ashlee',
        'K': 'Joining YRG in 2014 and becoming a partner of YRG Property Services by 2016—that kind of rapid advancement shows you understand property management at every level. Your investor-first consulting approach is exactly what owners need.'
    },
    # Row 274: Michelle Unknown → Michelle Oates-Duda (The Extra Mile Realtors)
    274: {
        'B': 'Oates-Duda',
        'J': 'Co-founding The Extra Mile in 2021—bold move, Michelle',
        'K': 'Forming The Extra Mile Realtors in 2021 with Zack Pell—building a team that is available 24/7 with constant communication across every part of the transaction—that commitment to service in Morgantown stands out.'
    },
    # Row 284: Eve Unknown → Eve Leombruno (The Extra Mile Realtors)
    284: {
        'B': 'Leombruno',
        'J': 'Going the extra mile with Michelle and Zack in WV',
        'K': 'Being part of The Extra Mile team alongside Michelle Oates-Duda and Zack Pell—maintaining that 24/7 availability and relationships with every expert in the transaction process—you understand what separates good service from great service in Morgantown.'
    },
}


def get_sheets_service():
    """Initialize Google Sheets API service."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def update_row(service, row_num, updates):
    """Update specific cells in a row."""
    for col_letter, value in updates.items():
        range_name = f'Sheet1!{col_letter}{row_num}'
        body = {'values': [[value]]}

        result = service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=range_name,
            valueInputOption='RAW',
            body=body
        ).execute()

        print(f"  Updated {col_letter}{row_num}: {value[:50]}..." if len(value) > 50 else f"  Updated {col_letter}{row_num}: {value}")


def main():
    """Apply all fixes to the CRM."""
    print("Connecting to Google Sheets...")
    service = get_sheets_service()

    print(f"\nApplying {len(FIXES)} row fixes...")

    for row_num, updates in FIXES.items():
        print(f"\nFixing row {row_num}:")
        update_row(service, row_num, updates)

    print("\n✓ All fixes applied successfully!")
    print("\nSummary of changes:")
    print("  - Row 255: Jeff Unknown → Jeff Wright")
    print("  - Row 256: Ashlee Unknown → Ashlee Stutzman")
    print("  - Row 274: Michelle Unknown → Michelle Oates-Duda")
    print("  - Row 284: Eve Unknown → Eve Leombruno")
    print("\nNote: Rows 260-261 (Iron Valley Lancaster/Gettysburg) need manual research")
    print("      - Could not find specific franchise owner names via web search")


if __name__ == '__main__':
    main()
