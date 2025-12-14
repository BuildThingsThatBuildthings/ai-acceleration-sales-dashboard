#!/usr/bin/env python3
"""
Apply verified fixes to CRM.
Reads fixes from .tmp/all_verified_fixes.json and applies them.
"""

import os
import json
import time
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

FIXES_FILE = '.tmp/all_verified_fixes.json'
LOG_FILE = '.tmp/fixes_applied_log.json'
WRITE_DELAY = 1.2  # Stay under 60/min limit


def get_service():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def main():
    print("=" * 80)
    print("APPLYING VERIFIED FIXES TO CRM")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    with open(FIXES_FILE) as f:
        fixes = json.load(f)

    print(f"\nTotal fixes to apply: {len(fixes)}")

    service = get_service()
    applied = []
    errors = []

    for fix in fixes:
        row_num = fix['row_num']
        field = fix['field']
        new_value = fix['fix']

        # Map field to column
        if field == 'subject':
            col = 'J'  # Column J = AI Subject Line
        elif field == 'hook':
            col = 'K'  # Column K = AI Opening Hook
        else:
            print(f"  Row {row_num}: Unknown field '{field}' - SKIPPED")
            continue

        range_name = f"Sheet1!{col}{row_num}"

        try:
            body = {'values': [[new_value]]}
            service.spreadsheets().values().update(
                spreadsheetId=SPREADSHEET_ID,
                range=range_name,
                valueInputOption='RAW',
                body=body
            ).execute()

            print(f"  Row {row_num}: {fix['name']} - {field} updated ✓")
            applied.append({
                'row_num': row_num,
                'name': fix['name'],
                'field': field,
                'issue': fix['issue']
            })

            time.sleep(WRITE_DELAY)

        except Exception as e:
            print(f"  Row {row_num}: ERROR - {str(e)}")
            errors.append({
                'row_num': row_num,
                'name': fix['name'],
                'error': str(e)
            })

    # Save log
    log = {
        'timestamp': datetime.now().isoformat(),
        'total_fixes': len(fixes),
        'applied': len(applied),
        'errors': len(errors),
        'applied_details': applied,
        'error_details': errors
    }

    with open(LOG_FILE, 'w') as f:
        json.dump(log, f, indent=2)

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total fixes: {len(fixes)}")
    print(f"Applied: {len(applied)}")
    print(f"Errors: {len(errors)}")
    print(f"Log saved: {LOG_FILE}")
    print(f"Completed: {datetime.now().isoformat()}")


if __name__ == '__main__':
    main()
