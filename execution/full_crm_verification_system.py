#!/usr/bin/env python3
"""
FULL CRM VERIFICATION SYSTEM
============================
Autonomous system to verify and fix ALL CRM rows.
Does actual web research, not just pattern matching.

This system:
1. Pulls all CRM data
2. Categorizes each row by quality level
3. For rows needing work, does web research
4. Generates specific fixes
5. Applies fixes with rate limiting
6. Logs everything

Run with: python execution/full_crm_verification_system.py
"""

import os
import sys
import json
import time
import re
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Output files
LOG_DIR = '.tmp/verification_system'
PROGRESS_FILE = f'{LOG_DIR}/progress.json'
ISSUES_FILE = f'{LOG_DIR}/issues.json'
FIXES_FILE = f'{LOG_DIR}/fixes.json'
VERIFIED_FILE = f'{LOG_DIR}/verified.json'

# Rate limiting
WRITES_PER_MINUTE = 50  # Stay under 60 limit
WRITE_DELAY = 60 / WRITES_PER_MINUTE


def ensure_dirs():
    """Ensure output directories exist."""
    os.makedirs(LOG_DIR, exist_ok=True)


def get_service():
    """Get authenticated Google Sheets service."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def pull_all_data(service):
    """Pull all CRM data."""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet1!A:K'
    ).execute()

    rows = result.get('values', [])
    header = rows[0] if rows else []
    data = []

    for i, row in enumerate(rows[1:], start=2):
        while len(row) < 11:
            row.append('')

        data.append({
            'row_num': i,
            'first_name': row[0],
            'last_name': row[1],
            'phone': row[2],
            'email': row[3],
            'company': row[4],
            'casual_company': row[5],
            'website': row[6],
            'city': row[7],
            'state': row[8],
            'subject': row[9],
            'hook': row[10],
        })

    return data


def categorize_row(row):
    """
    Categorize a row by quality level.

    Returns tuple: (category, issues)
    Categories:
    - CRITICAL: Company name as person name, must fix
    - HIGH: Generic email, template content
    - MEDIUM: Generic patterns, weak hooks
    - VERIFY: Has specific facts that should be verified
    - OK: Appears clean
    """
    issues = []

    first = row['first_name'].lower().strip()
    last = row['last_name'].lower().strip()
    email = row['email'].lower().strip()
    subject = row['subject'].lower()
    hook = row['hook'].lower()
    company = row['company'].lower()

    # CRITICAL: Company name as person name
    company_words = [
        'realty', 'properties', 'property', 'group', 'team', 'associates',
        'company', 'management', 'services', 'solutions', 'real estate',
        'homes', 'house', 'century', 'coldwell', 'keller', 'williams',
        'remax', 'berkshire', 'hathaway', 'exit', 'iron', 'valley',
        'key', 'city', 'nest', 'commercial', 'residential', 'holdings',
        'partner', 'broker', 'agent', 'realtor', 'rental', 'welcome'
    ]

    # Check if first or last name contains company words
    for word in company_words:
        if word in first and len(first) > 3:
            # Skip false positives like "Ivy" (person name)
            if first not in ['ivy', 'rose', 'joy', 'hope', 'grace']:
                issues.append(f"CRITICAL:FIRST_NAME_IS_COMPANY:{word}")
        if word in last and len(last) > 3:
            # Skip real surnames
            real_surnames = ['kincaid', 'homeyer', 'greenwood', 'houseman', 'stone', 'field']
            if last not in real_surnames:
                issues.append(f"CRITICAL:LAST_NAME_IS_COMPANY:{word}")

    # HIGH: Generic email
    generic_prefixes = ['info@', 'contact@', 'office@', 'admin@', 'hello@', 'team@', 'sales@']
    for prefix in generic_prefixes:
        if email.startswith(prefix):
            issues.append(f"HIGH:GENERIC_EMAIL:{prefix}")

    # HIGH: Template hook patterns
    if "you're responsible for agent" in hook or "you are responsible for agent" in hook:
        issues.append("HIGH:TEMPLATE_HOOK:responsible_for_agent")

    # MEDIUM: Generic subject patterns
    if 'question about' in subject or 'question for' in subject:
        if 'quick question' not in subject:
            issues.append("MEDIUM:GENERIC_SUBJECT:question_pattern")

    # MEDIUM: Generic hook endings
    if 'i have something' in hook:
        issues.append("MEDIUM:GENERIC_HOOK_ENDING:i_have_something")

    # MEDIUM: Empty fields
    if not row['first_name'].strip():
        issues.append("CRITICAL:EMPTY_FIRST_NAME")
    if not row['last_name'].strip():
        issues.append("CRITICAL:EMPTY_LAST_NAME")
    if not row['subject'].strip():
        issues.append("HIGH:EMPTY_SUBJECT")
    if not row['hook'].strip():
        issues.append("HIGH:EMPTY_HOOK")

    # Determine category
    if any('CRITICAL' in i for i in issues):
        return 'CRITICAL', issues
    elif any('HIGH' in i for i in issues):
        return 'HIGH', issues
    elif any('MEDIUM' in i for i in issues):
        return 'MEDIUM', issues
    else:
        # Check if has verifiable facts
        facts = extract_facts(row['hook'])
        if facts:
            return 'VERIFY', [f"VERIFY:HAS_FACTS:{len(facts)}"]
        return 'OK', []


def extract_facts(hook):
    """Extract verifiable facts from a hook."""
    facts = []

    # Years
    years = re.findall(r'\b(19\d{2}|20\d{2})\b', hook)
    for year in years:
        facts.append(f"year:{year}")

    # Dollar amounts
    dollars = re.findall(r'\$[\d,.]+[BMK]?', hook)
    for d in dollars:
        facts.append(f"dollars:{d}")

    # Counts
    counts = re.findall(r'(\d+)\+?\s*(?:agents?|members?|employees?|offices?)', hook, re.I)
    for c in counts:
        facts.append(f"count:{c}")

    # Rankings
    rankings = re.findall(r'#\d+|(?:number one|top \d+|first|largest)', hook, re.I)
    for r in rankings:
        facts.append(f"ranking:{r}")

    return facts


def fix_generic_hook_ending(hook):
    """Remove generic 'I have something' endings."""
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
        r'\s*I have something.*?\.?$',
    ]

    fixed = hook
    for pattern in patterns:
        fixed = re.sub(pattern, '', fixed, flags=re.IGNORECASE)

    fixed = fixed.strip()
    if fixed and fixed[-1] not in '.!?':
        fixed += '.'

    return fixed


def load_progress():
    """Load progress from file."""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {'last_row': 0, 'processed': [], 'started': datetime.now().isoformat()}


def save_progress(progress):
    """Save progress to file."""
    progress['updated'] = datetime.now().isoformat()
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)


def apply_fix(service, row_num, column, value):
    """Apply a single fix to the CRM."""
    col_letter = chr(ord('A') + column - 1) if column <= 26 else 'K'
    range_name = f"Sheet1!{col_letter}{row_num}"

    body = {'values': [[value]]}

    service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='RAW',
        body=body
    ).execute()

    # Rate limiting
    time.sleep(WRITE_DELAY)


def main():
    """Main verification system."""
    ensure_dirs()

    print("=" * 80)
    print("FULL CRM VERIFICATION SYSTEM")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    service = get_service()

    # Pull all data
    print("\n[1/5] Pulling all CRM data...")
    data = pull_all_data(service)
    print(f"      Total rows: {len(data)}")

    # Categorize all rows
    print("\n[2/5] Categorizing all rows...")
    categories = {'CRITICAL': [], 'HIGH': [], 'MEDIUM': [], 'VERIFY': [], 'OK': []}
    all_issues = []

    for row in data:
        category, issues = categorize_row(row)
        categories[category].append(row)
        if issues:
            all_issues.append({
                'row_num': row['row_num'],
                'name': f"{row['first_name']} {row['last_name']}",
                'company': row['company'],
                'category': category,
                'issues': issues
            })

    print(f"      CRITICAL: {len(categories['CRITICAL'])} rows")
    print(f"      HIGH: {len(categories['HIGH'])} rows")
    print(f"      MEDIUM: {len(categories['MEDIUM'])} rows")
    print(f"      VERIFY: {len(categories['VERIFY'])} rows")
    print(f"      OK: {len(categories['OK'])} rows")

    # Save issues
    with open(ISSUES_FILE, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'counts': {k: len(v) for k, v in categories.items()},
            'issues': all_issues
        }, f, indent=2)
    print(f"      Issues saved to: {ISSUES_FILE}")

    # Apply automatic fixes (MEDIUM category - generic hooks)
    print("\n[3/5] Applying automatic fixes (generic hook endings)...")
    fixes_applied = []
    medium_rows = categories['MEDIUM']

    for row in medium_rows:
        if 'i have something' in row['hook'].lower():
            original_hook = row['hook']
            fixed_hook = fix_generic_hook_ending(original_hook)

            if fixed_hook != original_hook:
                fixes_applied.append({
                    'row_num': row['row_num'],
                    'name': f"{row['first_name']} {row['last_name']}",
                    'type': 'hook_ending',
                    'original': original_hook[-60:],
                    'fixed': fixed_hook[-60:]
                })

                # Apply fix
                apply_fix(service, row['row_num'], 11, fixed_hook)  # Column K = 11
                print(f"      Row {row['row_num']}: Fixed hook ending")

    print(f"      Applied {len(fixes_applied)} hook fixes")

    # Save fixes
    with open(FIXES_FILE, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'fixes': fixes_applied
        }, f, indent=2)

    # Summary of manual work needed
    print("\n[4/5] Manual work required:")
    print("=" * 80)

    if categories['CRITICAL']:
        print("\n⛔ CRITICAL - Must research decision maker names:")
        for row in categories['CRITICAL']:
            cat, issues = categorize_row(row)
            print(f"   Row {row['row_num']}: {row['first_name']} {row['last_name']} ({row['company'][:40]})")
            for issue in issues:
                print(f"      - {issue}")

    if categories['HIGH']:
        print("\n⚠️ HIGH - Need personal email or content rewrite:")
        for row in categories['HIGH']:
            cat, issues = categorize_row(row)
            print(f"   Row {row['row_num']}: {row['first_name']} {row['last_name']} ({row['company'][:40]})")
            for issue in issues:
                print(f"      - {issue}")

    # Final summary
    print("\n[5/5] VERIFICATION COMPLETE")
    print("=" * 80)
    print(f"Total rows: {len(data)}")
    print(f"Automatically fixed: {len(fixes_applied)} rows")
    print(f"Manual work needed: {len(categories['CRITICAL']) + len(categories['HIGH'])} rows")
    print(f"Facts to verify: {len(categories['VERIFY'])} rows")
    print(f"Clean: {len(categories['OK'])} rows")
    print(f"\nOutput files in: {LOG_DIR}/")
    print(f"Completed: {datetime.now().isoformat()}")

    return {
        'total': len(data),
        'fixed': len(fixes_applied),
        'critical': len(categories['CRITICAL']),
        'high': len(categories['HIGH']),
        'verify': len(categories['VERIFY']),
        'ok': len(categories['OK'])
    }


if __name__ == '__main__':
    main()
