#!/usr/bin/env python3
"""
Verify ALL 296 CRM rows are clean.
"""

import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Bad patterns
BAD_NAME_WORDS = [
    'realty', 'real estate', 'properties', 'property', 'group', 'team',
    'associates', 'company', 'management', 'services', 'solutions',
    'valley', 'home', 'homes', 'house', 'century', 'coldwell', 'keller',
    'williams', 'remax', 'berkshire', 'hathaway', 'exit', 'nest', 'iron',
    'key', 'city', 'unknown', 'partner', 'broker', 'agent', 'realtor',
    'rental', 'rentals', 'commercial', 'residential', 'holdings', 'welcome'
]

BAD_EMAIL_PREFIXES = ['info@', 'contact@', 'office@', 'admin@', 'hello@', 'team@', 'sales@']

# Known real surnames that contain bad words (false positives)
REAL_SURNAMES = ['kincaid', 'homeyer', 'homewood', 'greenwood', 'houseman']


def get_service():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def check_row(row_num, first, last, email, subject, hook):
    issues = []

    first_lower = first.lower().strip()
    last_lower = last.lower().strip()

    # Check first name for company words
    for word in BAD_NAME_WORDS:
        if word in first_lower:
            issues.append(f"BAD_FIRST_NAME: contains '{word}'")
            break

    # Check last name for company words (excluding real surnames)
    if last_lower not in REAL_SURNAMES:
        for word in BAD_NAME_WORDS:
            if word in last_lower:
                issues.append(f"BAD_LAST_NAME: contains '{word}'")
                break

    # Check email
    email_lower = email.lower().strip()
    for prefix in BAD_EMAIL_PREFIXES:
        if email_lower.startswith(prefix):
            issues.append(f"GENERIC_EMAIL: {prefix}")
            break

    # Check subject for generic patterns
    subject_lower = subject.lower()
    if 'question about' in subject_lower or 'question for' in subject_lower:
        if 'quick question' not in subject_lower:  # Some quick questions are OK with context
            issues.append("GENERIC_SUBJECT: 'question about/for'")

    # Check hook for template patterns
    hook_lower = hook.lower()
    if "you're responsible for agent" in hook_lower or "you are responsible for agent" in hook_lower:
        issues.append("TEMPLATE_HOOK: 'responsible for agent productivity'")

    # Check for generic hook endings
    if hook_lower.rstrip().endswith("help you.") or hook_lower.rstrip().endswith("help your team."):
        issues.append("GENERIC_HOOK_ENDING: ends with 'help you/your team'")
    if "i have something that could help" in hook_lower:
        issues.append("GENERIC_HOOK: 'i have something that could help'")

    # Check for empty fields
    if not first.strip():
        issues.append("EMPTY_FIRST_NAME")
    if not last.strip():
        issues.append("EMPTY_LAST_NAME")
    if not subject.strip():
        issues.append("EMPTY_SUBJECT")
    if not hook.strip():
        issues.append("EMPTY_HOOK")

    return issues


def main():
    print("=" * 80)
    print("FULL CRM VERIFICATION - ALL ROWS")
    print("=" * 80)

    service = get_service()
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet1!A:K'
    ).execute()

    rows = result.get('values', [])
    headers = rows[0]
    data_rows = rows[1:]

    total_rows = len(data_rows)
    clean_rows = 0
    problem_rows = []

    # Check each row
    for i, row in enumerate(data_rows, start=2):
        # Pad row to ensure we have all columns
        while len(row) < 11:
            row.append('')

        first = row[0]
        last = row[1]
        email = row[3]
        subject = row[9]
        hook = row[10]

        issues = check_row(i, first, last, email, subject, hook)

        if issues:
            problem_rows.append({
                'row': i,
                'name': f"{first} {last}",
                'company': row[4] if len(row) > 4 else '',
                'issues': issues
            })
        else:
            clean_rows += 1

    # Print results
    print(f"\nTotal rows audited: {total_rows}")
    print(f"Clean rows: {clean_rows}")
    print(f"Problem rows: {len(problem_rows)}")
    print(f"\n{'✅' if len(problem_rows) == 0 else '⚠️'} PASS RATE: {clean_rows}/{total_rows} ({100*clean_rows/total_rows:.1f}%)")

    if problem_rows:
        print("\n" + "=" * 80)
        print("REMAINING ISSUES TO FIX:")
        print("=" * 80)
        for p in problem_rows:
            print(f"\nRow {p['row']}: {p['name']}")
            print(f"  Company: {p['company']}")
            for issue in p['issues']:
                print(f"  ❌ {issue}")
    else:
        print("\n" + "=" * 80)
        print("✅ ALL ROWS VERIFIED CLEAN - NO ISSUES FOUND")
        print("=" * 80)

    # Show breakdown by state
    print("\n" + "=" * 80)
    print("ROWS BY STATE:")
    print("=" * 80)
    state_counts = {}
    for row in data_rows:
        while len(row) < 9:
            row.append('')
        state = row[8] if row[8] else 'Unknown'
        state_counts[state] = state_counts.get(state, 0) + 1

    for state, count in sorted(state_counts.items(), key=lambda x: -x[1]):
        print(f"  {state}: {count} rows")

    # Show sample of verified rows across the dataset
    print("\n" + "=" * 80)
    print("SAMPLE VERIFIED ROWS (every 25th row):")
    print("=" * 80)

    for i in range(0, len(data_rows), 25):
        row = data_rows[i]
        while len(row) < 11:
            row.append('')
        row_num = i + 2
        print(f"\n[Row {row_num}] {row[0]} {row[1]} - {row[4][:40]}...")
        print(f"  Subject: {row[9][:55]}...")
        print(f"  Hook: {row[10][:70]}...")

    print("\n" + "=" * 80)
    print(f"VERIFICATION COMPLETE: {total_rows} rows audited")
    print("=" * 80)


if __name__ == '__main__':
    main()
