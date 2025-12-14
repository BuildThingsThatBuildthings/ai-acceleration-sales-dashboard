#!/usr/bin/env python3
"""
BATCH FACT VERIFIER
==================
Exports rows that need fact verification to JSON for Claude to process.
Claude will do web research and generate fixes.

Usage:
    python execution/batch_fact_verifier.py --export  # Export rows to verify
    python execution/batch_fact_verifier.py --apply fixes.json  # Apply fixes
"""

import os
import sys
import json
import re
import argparse
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import time

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

OUTPUT_DIR = '.tmp/verification_batches'
WRITE_DELAY = 1.2  # Seconds between writes (50/min)


def ensure_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def get_service():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def extract_facts(hook):
    """Extract verifiable facts from a hook."""
    facts = []

    # Years
    years = re.findall(r'\b(19\d{2}|20\d{2})\b', hook)
    for year in years:
        facts.append({'type': 'year', 'value': year})

    # Dollar amounts
    dollars = re.findall(r'\$[\d,.]+\s*(?:million|billion|[BMK])?', hook, re.I)
    for d in dollars:
        facts.append({'type': 'dollars', 'value': d})

    # Counts (agents, members, etc)
    counts = re.findall(r'(\d+[,\d]*)\+?\s*(?:agents?|members?|employees?|offices?|locations?)', hook, re.I)
    for c in counts:
        facts.append({'type': 'count', 'value': c})

    # Square footage
    sqft = re.findall(r'([\d,.]+)\s*(?:million|M)?\s*(?:square feet|sq\.?\s*ft\.?|sqft)', hook, re.I)
    for s in sqft:
        facts.append({'type': 'sqft', 'value': s})

    # Rankings
    rankings = re.findall(r'#\d+|(?:number one|top \d+|first |largest |biggest )', hook, re.I)
    for r in rankings:
        facts.append({'type': 'ranking', 'value': r.strip()})

    # Designations/Awards
    designations = re.findall(r'(?:CCIM|CRS|ABR|SRES|RCE|GRI|SRS|RMP|Hall of Fame|Realtor of the Year)', hook, re.I)
    for des in designations:
        facts.append({'type': 'designation', 'value': des})

    # Named things (like "Louisville Urban League Sports Complex")
    named = re.findall(r'(?:Louisville|Nashville|Richmond|Lexington|Charleston)\s+[\w\s]+(?:Complex|Center|Foundation|Coalition)', hook)
    for n in named:
        facts.append({'type': 'named_entity', 'value': n})

    return facts


def pull_all_data(service):
    """Pull all CRM data."""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Sheet1!A:K'
    ).execute()

    rows = result.get('values', [])
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


def export_verification_batches(batch_size=30):
    """Export rows to JSON batches for verification."""
    ensure_dirs()

    print("=" * 80)
    print("EXPORTING VERIFICATION BATCHES")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    service = get_service()
    data = pull_all_data(service)

    # Find rows with facts to verify
    verify_rows = []
    for row in data:
        facts = extract_facts(row['hook'])
        if facts:
            row['extracted_facts'] = facts
            verify_rows.append(row)

    print(f"\nTotal rows: {len(data)}")
    print(f"Rows with facts to verify: {len(verify_rows)}")

    # Create batches
    batches = []
    for i in range(0, len(verify_rows), batch_size):
        batch = verify_rows[i:i + batch_size]
        batch_num = len(batches) + 1
        batches.append({
            'batch_num': batch_num,
            'row_count': len(batch),
            'rows': batch
        })

    print(f"Created {len(batches)} batches of ~{batch_size} rows each")

    # Save batches
    for batch in batches:
        filename = f"{OUTPUT_DIR}/verify_batch_{batch['batch_num']}.json"
        with open(filename, 'w') as f:
            json.dump(batch, f, indent=2)
        print(f"  Saved: {filename}")

    # Save manifest
    manifest = {
        'timestamp': datetime.now().isoformat(),
        'total_rows': len(data),
        'verify_rows': len(verify_rows),
        'batch_count': len(batches),
        'batch_size': batch_size,
        'batches': [
            {
                'batch_num': b['batch_num'],
                'row_count': b['row_count'],
                'row_range': f"{b['rows'][0]['row_num']}-{b['rows'][-1]['row_num']}"
            }
            for b in batches
        ]
    }

    with open(f"{OUTPUT_DIR}/manifest.json", 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"\nManifest saved to: {OUTPUT_DIR}/manifest.json")
    print(f"\nNext step: Claude should process each batch file and create fixes")

    return manifest


def apply_fixes(fixes_file):
    """Apply fixes from a JSON file."""
    print("=" * 80)
    print("APPLYING FIXES")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    with open(fixes_file) as f:
        fixes = json.load(f)

    if not fixes:
        print("No fixes to apply")
        return

    service = get_service()
    applied = 0

    for fix in fixes:
        row_num = fix['row_num']

        # Apply each column fix
        if 'subject' in fix:
            range_name = f"Sheet1!J{row_num}"
            body = {'values': [[fix['subject']]]}
            service.spreadsheets().values().update(
                spreadsheetId=SPREADSHEET_ID,
                range=range_name,
                valueInputOption='RAW',
                body=body
            ).execute()
            print(f"  Row {row_num}: Updated subject")
            time.sleep(WRITE_DELAY)

        if 'hook' in fix:
            range_name = f"Sheet1!K{row_num}"
            body = {'values': [[fix['hook']]]}
            service.spreadsheets().values().update(
                spreadsheetId=SPREADSHEET_ID,
                range=range_name,
                valueInputOption='RAW',
                body=body
            ).execute()
            print(f"  Row {row_num}: Updated hook")
            time.sleep(WRITE_DELAY)

        applied += 1

    print(f"\nApplied {applied} fixes")
    print(f"Completed: {datetime.now().isoformat()}")


def main():
    parser = argparse.ArgumentParser(description='Batch fact verification system')
    parser.add_argument('--export', action='store_true', help='Export rows to verify')
    parser.add_argument('--apply', type=str, help='Apply fixes from JSON file')
    parser.add_argument('--batch-size', type=int, default=30, help='Batch size for export')

    args = parser.parse_args()

    if args.export:
        export_verification_batches(args.batch_size)
    elif args.apply:
        apply_fixes(args.apply)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
