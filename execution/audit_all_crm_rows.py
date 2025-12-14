#!/usr/bin/env python3
"""
Audit ALL CRM rows and identify EVERY issue.
Outputs detailed log of problems found.
"""

import os
import json
import re
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Words that should NOT appear in first/last names
BAD_NAME_WORDS = [
    'realty', 'real estate', 'properties', 'property', 'group', 'team',
    'associates', 'company', 'inc', 'llc', 'corp', 'management',
    'services', 'solutions', 'valley', 'home', 'homes', 'house',
    'century', 'coldwell', 'keller', 'williams', 'remax', 're/max',
    'berkshire', 'hathaway', 'exit', 'nest', 'iron', 'key', 'city',
    'unknown', 'partner', 'broker', 'agent', 'realtor', 'rental',
    'rentals', 'commercial', 'residential', 'investments', 'investors',
    'holdings', 'capital', 'premier', 'elite', 'first', 'national',
    'american', 'united', 'metro', 'metro', 'nrv', 'welcome'
]

# Email prefixes that indicate generic/office emails
BAD_EMAIL_PREFIXES = [
    'info@', 'contact@', 'office@', 'admin@', 'hello@', 'team@',
    'sales@', 'support@', 'general@', 'inquiries@', 'mail@'
]

# Generic subject line patterns
BAD_SUBJECT_PATTERNS = [
    r'question about',
    r'quick question',
    r'question for',
    r'\[company\]',
    r'\[name\]',
    r'your company',
    r'your team',
    r'your brokerage',
    r'^question ',
]

# Generic hook patterns
BAD_HOOK_PATTERNS = [
    r"i've been following",
    r"as the .{1,50} at .{1,50}, you're responsible",
    r"as the .{1,50} at .{1,50}, you are responsible",
    r"^your company",
    r"^your team",
    r"help you",
    r"could help",
    r"i noticed",
    r"i saw that",
    r"i came across",
]


def get_sheets_service():
    """Initialize Google Sheets API service."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def pull_all_crm_data(service):
    """Pull all data from CRM."""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet1!A:Y'  # All 25 columns
    ).execute()

    rows = result.get('values', [])
    if not rows:
        return []

    headers = rows[0]
    data = []

    for i, row in enumerate(rows[1:], start=2):  # Start at row 2 (after header)
        # Pad row to match header length
        while len(row) < len(headers):
            row.append('')

        row_dict = {
            'row_num': i,
            'first_name': row[0] if len(row) > 0 else '',
            'last_name': row[1] if len(row) > 1 else '',
            'phone': row[2] if len(row) > 2 else '',
            'email': row[3] if len(row) > 3 else '',
            'official_company': row[4] if len(row) > 4 else '',
            'casual_company': row[5] if len(row) > 5 else '',
            'website': row[6] if len(row) > 6 else '',
            'city': row[7] if len(row) > 7 else '',
            'state': row[8] if len(row) > 8 else '',
            'subject': row[9] if len(row) > 9 else '',
            'hook': row[10] if len(row) > 10 else '',
        }
        data.append(row_dict)

    return data


def check_name_issues(first_name, last_name):
    """Check if first/last name contains company words."""
    issues = []

    first_lower = first_name.lower().strip()
    last_lower = last_name.lower().strip()

    for word in BAD_NAME_WORDS:
        if word in first_lower:
            issues.append(f"First name contains '{word}': '{first_name}'")
        if word in last_lower:
            issues.append(f"Last name contains '{word}': '{last_name}'")

    # Check for empty names
    if not first_name.strip():
        issues.append("First name is empty")
    if not last_name.strip():
        issues.append("Last name is empty")

    return issues


def check_email_issues(email):
    """Check if email is generic."""
    issues = []
    email_lower = email.lower().strip()

    for prefix in BAD_EMAIL_PREFIXES:
        if email_lower.startswith(prefix):
            issues.append(f"Generic email prefix '{prefix}': '{email}'")
            break

    if not email.strip():
        issues.append("Email is empty")

    return issues


def check_subject_issues(subject):
    """Check if subject line is generic."""
    issues = []
    subject_lower = subject.lower().strip()

    for pattern in BAD_SUBJECT_PATTERNS:
        if re.search(pattern, subject_lower):
            issues.append(f"Generic subject pattern '{pattern}': '{subject[:50]}...'")
            break

    if not subject.strip():
        issues.append("Subject line is empty")

    # Check if subject is too short (likely generic)
    if len(subject.strip()) < 20:
        issues.append(f"Subject too short ({len(subject)} chars): '{subject}'")

    return issues


def check_hook_issues(hook):
    """Check if hook is generic."""
    issues = []
    hook_lower = hook.lower().strip()

    for pattern in BAD_HOOK_PATTERNS:
        if re.search(pattern, hook_lower):
            issues.append(f"Generic hook pattern '{pattern}'")
            break

    if not hook.strip():
        issues.append("Hook is empty")

    # Check if hook is too short (likely generic)
    if len(hook.strip()) < 50:
        issues.append(f"Hook too short ({len(hook)} chars)")

    return issues


def audit_row(row):
    """Audit a single row for all issues."""
    issues = {
        'row_num': row['row_num'],
        'first_name': row['first_name'],
        'last_name': row['last_name'],
        'company': row['official_company'],
        'email': row['email'],
        'problems': []
    }

    # Check names
    name_issues = check_name_issues(row['first_name'], row['last_name'])
    issues['problems'].extend([('NAME', i) for i in name_issues])

    # Check email
    email_issues = check_email_issues(row['email'])
    issues['problems'].extend([('EMAIL', i) for i in email_issues])

    # Check subject
    subject_issues = check_subject_issues(row['subject'])
    issues['problems'].extend([('SUBJECT', i) for i in subject_issues])

    # Check hook
    hook_issues = check_hook_issues(row['hook'])
    issues['problems'].extend([('HOOK', i) for i in hook_issues])

    return issues


def categorize_severity(issues):
    """Categorize issues by severity."""
    severity = 'OK'

    for category, _ in issues['problems']:
        if category == 'NAME':
            severity = 'CRITICAL'
            break
        elif category == 'EMAIL' and severity != 'CRITICAL':
            severity = 'HIGH'
        elif category in ['SUBJECT', 'HOOK'] and severity not in ['CRITICAL', 'HIGH']:
            severity = 'MEDIUM'

    return severity


def main():
    """Run full CRM audit."""
    print("=" * 80)
    print("CRM AUDIT - ANALYZING ALL ROWS")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    print("\nConnecting to Google Sheets...")
    service = get_sheets_service()

    print("Pulling all CRM data...")
    data = pull_all_crm_data(service)
    print(f"Retrieved {len(data)} rows\n")

    # Audit each row
    all_issues = []
    critical_rows = []
    high_rows = []
    medium_rows = []
    ok_rows = []

    for row in data:
        issues = audit_row(row)
        severity = categorize_severity(issues)
        issues['severity'] = severity
        all_issues.append(issues)

        if severity == 'CRITICAL':
            critical_rows.append(issues)
        elif severity == 'HIGH':
            high_rows.append(issues)
        elif severity == 'MEDIUM':
            medium_rows.append(issues)
        else:
            ok_rows.append(issues)

    # Print summary
    print("=" * 80)
    print("AUDIT SUMMARY")
    print("=" * 80)
    print(f"Total rows:     {len(data)}")
    print(f"CRITICAL:       {len(critical_rows)} (wrong names)")
    print(f"HIGH:           {len(high_rows)} (generic emails)")
    print(f"MEDIUM:         {len(medium_rows)} (generic subject/hook)")
    print(f"OK:             {len(ok_rows)}")
    print()

    # Print CRITICAL issues
    if critical_rows:
        print("=" * 80)
        print("CRITICAL ISSUES (Company names as person names)")
        print("=" * 80)
        for issue in critical_rows:
            print(f"\nRow {issue['row_num']}: {issue['first_name']} {issue['last_name']}")
            print(f"  Company: {issue['company']}")
            for cat, prob in issue['problems']:
                print(f"  [{cat}] {prob}")

    # Print HIGH issues
    if high_rows:
        print("\n" + "=" * 80)
        print("HIGH ISSUES (Generic emails)")
        print("=" * 80)
        for issue in high_rows:
            print(f"\nRow {issue['row_num']}: {issue['first_name']} {issue['last_name']}")
            print(f"  Company: {issue['company']}")
            print(f"  Email: {issue['email']}")
            for cat, prob in issue['problems']:
                if cat == 'EMAIL':
                    print(f"  [{cat}] {prob}")

    # Print MEDIUM issues
    if medium_rows:
        print("\n" + "=" * 80)
        print("MEDIUM ISSUES (Generic subject/hook)")
        print("=" * 80)
        for issue in medium_rows:
            print(f"\nRow {issue['row_num']}: {issue['first_name']} {issue['last_name']}")
            print(f"  Company: {issue['company']}")
            for cat, prob in issue['problems']:
                if cat in ['SUBJECT', 'HOOK']:
                    print(f"  [{cat}] {prob}")

    # Save full audit to file
    output = {
        'audit_date': datetime.now().isoformat(),
        'total_rows': len(data),
        'summary': {
            'critical': len(critical_rows),
            'high': len(high_rows),
            'medium': len(medium_rows),
            'ok': len(ok_rows)
        },
        'critical_rows': critical_rows,
        'high_rows': high_rows,
        'medium_rows': medium_rows,
        'all_data': data
    }

    output_path = '.tmp/crm_full_audit.json'
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n\nFull audit saved to: {output_path}")
    print(f"Completed: {datetime.now().isoformat()}")


if __name__ == '__main__':
    main()
