#!/usr/bin/env python3
"""
Lead Database Enhancement Script
Adds personalized research to first 20 leads in Google Sheet
"""

import gspread
from google.oauth2.service_account import Credentials
import time
import re

# Setup Google Sheets access
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
CREDS_FILE = '/Users/ryan/ai_acceleration/credentials.json'
SHEET_URL = 'https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit'

def setup_sheet():
    """Connect to Google Sheet"""
    creds = Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPES)
    client = gspread.authorize(creds)
    sheet = client.open_by_url(SHEET_URL).sheet1
    return sheet

def add_columns(sheet):
    """Add new columns to sheet if they don't exist"""
    header_row = sheet.row_values(1)

    new_columns = [
        'decision_maker_name',
        'unique_hook',
        'brand_tagline',
        'pain_point',
        'custom_subject',
        'custom_opener',
        'research_status'
    ]

    columns_to_add = []
    for col in new_columns:
        if col not in header_row:
            columns_to_add.append(col)

    if columns_to_add:
        # Add new column headers
        start_col = len(header_row) + 1
        for i, col_name in enumerate(columns_to_add):
            sheet.update_cell(1, start_col + i, col_name)
            print(f"✓ Added column: {col_name}")
        time.sleep(2)  # Rate limiting
    else:
        print("✓ All columns already exist")

    # Return updated header
    return sheet.row_values(1)

def get_column_index(header, col_name):
    """Get column index (1-based) for a column name"""
    try:
        return header.index(col_name) + 1
    except ValueError:
        return None

def process_leads(sheet, num_leads=20):
    """Process first N leads with web research"""
    header = sheet.row_values(1)

    # Get column indices
    col_indices = {
        'companyName': get_column_index(header, 'companyName'),
        'companyWebsite': get_column_index(header, 'companyWebsite'),
        'decision_maker_name': get_column_index(header, 'decision_maker_name'),
        'unique_hook': get_column_index(header, 'unique_hook'),
        'brand_tagline': get_column_index(header, 'brand_tagline'),
        'pain_point': get_column_index(header, 'pain_point'),
        'custom_subject': get_column_index(header, 'custom_subject'),
        'custom_opener': get_column_index(header, 'custom_opener'),
        'research_status': get_column_index(header, 'research_status')
    }

    print(f"\nColumn mapping: {col_indices}\n")

    # Get all data
    all_data = sheet.get_all_values()

    results = []

    # Process first num_leads (skip header row)
    for row_num in range(2, min(num_leads + 2, len(all_data) + 1)):
        row_data = all_data[row_num - 1]  # 0-indexed

        company_name = row_data[col_indices['companyName'] - 1] if col_indices['companyName'] else ''
        website = row_data[col_indices['companyWebsite'] - 1] if col_indices['companyWebsite'] else ''

        result = {
            'row': row_num,
            'company_name': company_name,
            'website': website,
            'status': 'Pending'
        }

        print(f"\n{'='*60}")
        print(f"Row {row_num}: {company_name}")
        print(f"Website: {website}")

        if not website or website == '':
            print("⚠ No website found - skipping")
            result['status'] = 'No website'
            results.append(result)
            continue

        # This will be filled in by WebFetch calls (done separately by Claude)
        result['needs_research'] = True
        results.append(result)

    return results, col_indices

def main():
    print("Lead Database Enhancement Script")
    print("="*60)

    # Setup
    sheet = setup_sheet()
    print("✓ Connected to Google Sheet")

    # Add columns
    print("\nAdding new columns...")
    header = add_columns(sheet)

    # Process leads
    print("\nProcessing first 20 leads...")
    results, col_indices = process_leads(sheet, num_leads=20)

    print(f"\n{'='*60}")
    print("Summary:")
    print(f"Total leads processed: {len(results)}")
    print(f"Needs research: {sum(1 for r in results if r.get('needs_research'))}")
    print(f"No website: {sum(1 for r in results if r['status'] == 'No website')}")

    # Return data for Claude to process
    return results, col_indices, sheet

if __name__ == "__main__":
    results, col_indices, sheet = main()

    # Save these for later use
    import json
    with open('/Users/ryan/ai_acceleration/lead_research_data.json', 'w') as f:
        json.dump({
            'results': results,
            'col_indices': col_indices
        }, f, indent=2)

    print("\n✓ Saved research data to lead_research_data.json")
    print("\nReady for web research phase...")
