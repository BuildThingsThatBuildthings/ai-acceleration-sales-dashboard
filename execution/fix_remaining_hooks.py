#!/usr/bin/env python3
"""
Fix ALL remaining hooks that have "I have something..." endings.
Removes generic pitch and replaces with strong closing statements.
"""

import os
import re
import json
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

LOG_FILE = '.tmp/hook_fixes_log.json'


def get_service():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def fix_hook(hook):
    """Remove generic pitch endings and improve the closing."""
    # Patterns to remove
    patterns = [
        r'\s*I have something that fits leaders like you\.?$',
        r'\s*I have something to amplify it\.?$',
        r'\s*I have something for your unique market\.?$',
        r'\s*I have something for your members\.?$',
        r'\s*I have something that fits your model\.?$',
        r'\s*I have something for your team\.?$',
        r'\s*I have something for the next chapter\.?$',
        r'\s*I have something that could give your agents an edge\.?$',
        r'\s*I have something for your agents\.?$',
        r'\s*I have something for your owner clients\.?$',
        r'\s*I have something for them\.?$',
        r'\s*I have something that fits your unique market\.?$',
        r'\s*I have something that could help your team\.?$',
        r'\s*I have something for you\.?$',
        r'\s*I have something that could multiply that\.?$',
        r'\s*I have something that could accelerate your team even more\.?$',
        r'\s*I have something for that\.?$',
        r'\s*I have something.*?\.?$',  # Catch-all for any remaining
    ]

    fixed_hook = hook
    for pattern in patterns:
        fixed_hook = re.sub(pattern, '', fixed_hook, flags=re.IGNORECASE)

    # Clean up any trailing whitespace or orphaned punctuation
    fixed_hook = fixed_hook.strip()
    if fixed_hook.endswith('—'):
        fixed_hook = fixed_hook[:-1].strip() + '.'

    # If hook now ends mid-sentence, add proper ending
    if fixed_hook and not fixed_hook[-1] in '.!?':
        fixed_hook += '.'

    return fixed_hook


def main():
    print("=" * 80)
    print("FIXING ALL REMAINING GENERIC HOOK ENDINGS")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    service = get_service()

    # Pull all hooks
    print("\nPulling all hooks from CRM...")
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet1!A:K'
    ).execute()

    rows = result.get('values', [])
    header = rows[0]
    data_rows = rows[1:]

    print(f"Total rows: {len(data_rows)}")

    # Find and fix hooks with generic endings
    fixes = []
    for i, row in enumerate(data_rows, start=2):
        while len(row) < 11:
            row.append('')

        hook = row[10]
        hook_lower = hook.lower()

        if 'i have something' in hook_lower:
            fixed_hook = fix_hook(hook)

            if fixed_hook != hook:
                fixes.append({
                    'row': i,
                    'name': f"{row[0]} {row[1]}",
                    'company': row[4],
                    'original_ending': hook[-80:],
                    'new_ending': fixed_hook[-80:],
                    'full_fixed_hook': fixed_hook
                })

    print(f"\nFound {len(fixes)} hooks to fix")

    # Apply fixes
    print("\nApplying fixes...")
    for fix in fixes:
        range_name = f"Sheet1!K{fix['row']}"
        body = {'values': [[fix['full_fixed_hook']]]}

        service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=range_name,
            valueInputOption='RAW',
            body=body
        ).execute()

        print(f"  Row {fix['row']}: {fix['name'][:30]} - Fixed")

    # Save log
    log_data = {
        'timestamp': datetime.now().isoformat(),
        'total_fixes': len(fixes),
        'fixes': fixes
    }

    with open(LOG_FILE, 'w') as f:
        json.dump(log_data, f, indent=2)

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total hooks fixed: {len(fixes)}")
    print(f"Log saved to: {LOG_FILE}")
    print(f"Completed: {datetime.now().isoformat()}")

    # Show sample of fixes
    print("\n" + "=" * 80)
    print("SAMPLE FIXES (first 10):")
    print("=" * 80)
    for fix in fixes[:10]:
        print(f"\nRow {fix['row']}: {fix['name']}")
        print(f"  Before: ...{fix['original_ending']}")
        print(f"  After:  ...{fix['new_ending']}")


if __name__ == '__main__':
    main()
