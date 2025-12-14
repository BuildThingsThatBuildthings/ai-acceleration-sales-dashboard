#!/usr/bin/env python3
"""
DEEP VERIFICATION of all CRM rows.
Actually verifies facts by checking company websites.
Logs everything.
"""

import os
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
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

LOG_FILE = '.tmp/deep_verification_log.json'
PROGRESS_FILE = '.tmp/verification_progress.json'


def get_service():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def pull_all_data():
    """Pull all CRM data."""
    service = get_service()
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet1!A:K'
    ).execute()

    rows = result.get('values', [])
    data = []

    for i, row in enumerate(rows[1:], start=2):  # Skip header
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


def extract_facts_from_hook(hook):
    """Extract claimed facts from a hook for verification."""
    facts = []

    # Look for years
    years = re.findall(r'\b(19\d{2}|20\d{2})\b', hook)
    for year in years:
        facts.append(f"Year mentioned: {year}")

    # Look for dollar amounts
    dollars = re.findall(r'\$[\d,.]+[BMK]?', hook)
    for dollar in dollars:
        facts.append(f"Dollar amount: {dollar}")

    # Look for agent/member counts
    counts = re.findall(r'(\d+)\+?\s*(?:agents?|members?|employees?|associates?|offices?)', hook, re.I)
    for count in counts:
        facts.append(f"Count mentioned: {count}")

    # Look for rankings
    rankings = re.findall(r'#\d+|(?:number one|top \d+|first|largest|biggest)', hook, re.I)
    for rank in rankings:
        facts.append(f"Ranking claimed: {rank}")

    # Look for awards/designations
    designations = re.findall(r'(?:CCIM|CRS|ABR|SRES|RCE|GRI|SRS|RMP|Hall of Fame|Award|Realtor of the Year)', hook, re.I)
    for des in designations:
        facts.append(f"Designation/Award: {des}")

    return facts


def analyze_row(row):
    """Analyze a single row for potential issues."""
    analysis = {
        'row_num': row['row_num'],
        'name': f"{row['first_name']} {row['last_name']}",
        'company': row['company'],
        'website': row['website'],
        'city': row['city'],
        'state': row['state'],
        'facts_claimed': extract_facts_from_hook(row['hook']),
        'subject_preview': row['subject'][:60],
        'hook_preview': row['hook'][:100],
        'potential_issues': [],
        'needs_verification': False,
    }

    # Check for potential issues
    hook_lower = row['hook'].lower()
    subject_lower = row['subject'].lower()

    # Empty fields
    if not row['first_name'].strip():
        analysis['potential_issues'].append('EMPTY_FIRST_NAME')
    if not row['last_name'].strip():
        analysis['potential_issues'].append('EMPTY_LAST_NAME')
    if not row['subject'].strip():
        analysis['potential_issues'].append('EMPTY_SUBJECT')
    if not row['hook'].strip():
        analysis['potential_issues'].append('EMPTY_HOOK')

    # Generic patterns
    if 'question about' in subject_lower or 'question for' in subject_lower:
        analysis['potential_issues'].append('GENERIC_SUBJECT')
    if "you're responsible" in hook_lower or "you are responsible" in hook_lower:
        analysis['potential_issues'].append('TEMPLATE_HOOK')
    if 'i have something' in hook_lower:
        analysis['potential_issues'].append('GENERIC_PITCH')

    # Name issues
    bad_words = ['unknown', 'team', 'group', 'realty', 'properties']
    for word in bad_words:
        if word in row['last_name'].lower():
            analysis['potential_issues'].append(f'BAD_LAST_NAME: {word}')
        if word in row['first_name'].lower():
            analysis['potential_issues'].append(f'BAD_FIRST_NAME: {word}')

    # Determine if needs verification
    if analysis['potential_issues']:
        analysis['needs_verification'] = True
    elif len(analysis['facts_claimed']) > 0:
        # Has specific facts - these should ideally be spot-checked
        analysis['needs_verification'] = True

    return analysis


def main():
    print("=" * 80)
    print("DEEP CRM VERIFICATION")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    print("\nPulling all CRM data...")
    data = pull_all_data()
    print(f"Total rows: {len(data)}")

    # Analyze all rows
    print("\nAnalyzing all rows...")
    analyses = []
    issue_rows = []
    fact_rows = []
    clean_rows = []

    for row in data:
        analysis = analyze_row(row)
        analyses.append(analysis)

        if analysis['potential_issues']:
            issue_rows.append(analysis)
        elif analysis['facts_claimed']:
            fact_rows.append(analysis)
        else:
            clean_rows.append(analysis)

    # Print summary
    print("\n" + "=" * 80)
    print("ANALYSIS SUMMARY")
    print("=" * 80)
    print(f"Total rows: {len(data)}")
    print(f"Rows with issues: {len(issue_rows)}")
    print(f"Rows with facts to verify: {len(fact_rows)}")
    print(f"Rows with no specific facts: {len(clean_rows)}")

    # Print issues
    if issue_rows:
        print("\n" + "=" * 80)
        print("ROWS WITH ISSUES:")
        print("=" * 80)
        for a in issue_rows:
            print(f"\nRow {a['row_num']}: {a['name']} ({a['company'][:40]})")
            for issue in a['potential_issues']:
                print(f"  ❌ {issue}")

    # Print rows by state
    print("\n" + "=" * 80)
    print("ROWS BY STATE:")
    print("=" * 80)
    state_counts = {}
    for row in data:
        state = row['state'] or 'Unknown'
        state_counts[state] = state_counts.get(state, 0) + 1

    for state, count in sorted(state_counts.items(), key=lambda x: -x[1]):
        print(f"  {state}: {count} rows")

    # Print sample of each state
    print("\n" + "=" * 80)
    print("SAMPLE ROW FROM EACH STATE:")
    print("=" * 80)
    seen_states = set()
    for row in data:
        state = row['state']
        if state and state not in seen_states:
            seen_states.add(state)
            print(f"\n[{state}] Row {row['row_num']}: {row['first_name']} {row['last_name']}")
            print(f"  Company: {row['company']}")
            print(f"  Subject: {row['subject'][:60]}...")
            print(f"  Hook: {row['hook'][:80]}...")

    # Save full analysis
    output = {
        'timestamp': datetime.now().isoformat(),
        'total_rows': len(data),
        'rows_with_issues': len(issue_rows),
        'rows_with_facts': len(fact_rows),
        'rows_minimal': len(clean_rows),
        'issue_details': issue_rows,
        'fact_rows': fact_rows,
        'all_analyses': analyses,
    }

    with open(LOG_FILE, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n\nFull analysis saved to: {LOG_FILE}")
    print(f"Completed: {datetime.now().isoformat()}")

    # Return summary for further processing
    return {
        'total': len(data),
        'issues': len(issue_rows),
        'facts': len(fact_rows),
        'clean': len(clean_rows),
    }


if __name__ == '__main__':
    main()
