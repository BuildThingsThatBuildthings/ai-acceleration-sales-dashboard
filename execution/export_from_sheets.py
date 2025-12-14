#!/usr/bin/env python3
"""
Export from Sheets - CRM Data Export for Campaigns

Pulls leads from Google Sheets CRM for use in campaign builder.
Filters by status, city, state, or pipeline stage.

Usage:
    python execution/export_from_sheets.py
    python execution/export_from_sheets.py --status Lead
    python execution/export_from_sheets.py --state KY --city Louisville
    python execution/export_from_sheets.py --not-emailed
"""

import os
import json
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

# Configuration
SERVICE_ACCOUNT_PATH = os.getenv("SERVICE_ACCOUNT_PATH", "credentials.json")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SHEET_NAME = os.getenv("SHEET_NAME", "Sheet1")

OUTPUT_FILE = Path(".tmp/crm_export.json")

# Column mapping (A=0, B=1, etc.)
COLUMNS = {
    "first_name": 0,       # A
    "last_name": 1,        # B
    "phone": 2,            # C
    "email": 3,            # D
    "company": 4,          # E - Official Company Name
    "casual_company": 5,   # F
    "website": 6,          # G
    "city": 7,             # H
    "state": 8,            # I
    "ai_subject_line": 9,  # J
    "ai_opening_hook": 10, # K
    "contact_date": 11,    # L
    "follow_up_date": 12,  # M
    "called": 13,          # N
    "emailed": 14,         # O
    "call_notes": 15,      # P
    "status": 16,          # Q
}


def get_sheets_service():
    """Create Google Sheets API service."""
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        raise FileNotFoundError(f"Service account file not found: {SERVICE_ACCOUNT_PATH}")

    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_PATH,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
    )

    return build("sheets", "v4", credentials=creds)


def get_cell(row: list, col_index: int) -> str:
    """Safely get cell value from row."""
    if col_index < len(row):
        return str(row[col_index]).strip()
    return ""


def export_leads(
    service,
    spreadsheet_id: str,
    status_filter: str = None,
    state_filter: str = None,
    city_filter: str = None,
    not_emailed: bool = False,
    not_called: bool = False,
    has_hook: bool = False,
    limit: int = None
) -> list[dict]:
    """
    Export leads from CRM with optional filters.

    Returns:
        List of lead dictionaries
    """
    # Get all data (skip header row)
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!A2:Y"
    ).execute()

    rows = result.get("values", [])

    leads = []
    for row in rows:
        # Skip empty rows
        if not row or not get_cell(row, COLUMNS["email"]):
            continue

        lead = {
            "first_name": get_cell(row, COLUMNS["first_name"]),
            "last_name": get_cell(row, COLUMNS["last_name"]),
            "phone": get_cell(row, COLUMNS["phone"]),
            "email": get_cell(row, COLUMNS["email"]),
            "company": get_cell(row, COLUMNS["company"]),
            "casual_company": get_cell(row, COLUMNS["casual_company"]),
            "website": get_cell(row, COLUMNS["website"]),
            "city": get_cell(row, COLUMNS["city"]),
            "state": get_cell(row, COLUMNS["state"]),
            "ai_subject_line": get_cell(row, COLUMNS["ai_subject_line"]),
            "ai_opening_hook": get_cell(row, COLUMNS["ai_opening_hook"]),
            "contact_date": get_cell(row, COLUMNS["contact_date"]),
            "follow_up_date": get_cell(row, COLUMNS["follow_up_date"]),
            "called": get_cell(row, COLUMNS["called"]),
            "emailed": get_cell(row, COLUMNS["emailed"]),
            "call_notes": get_cell(row, COLUMNS["call_notes"]),
            "status": get_cell(row, COLUMNS["status"]),
        }

        # Apply filters
        if status_filter and lead["status"].lower() != status_filter.lower():
            continue

        if state_filter and lead["state"].upper() != state_filter.upper():
            continue

        if city_filter and city_filter.lower() not in lead["city"].lower():
            continue

        if not_emailed and lead["emailed"].lower() in ["yes", "y", "true", "1"]:
            continue

        if not_called and lead["called"].lower() in ["yes", "y", "true", "1"]:
            continue

        if has_hook and not lead["ai_opening_hook"]:
            continue

        leads.append(lead)

        if limit and len(leads) >= limit:
            break

    return leads


def print_summary(leads: list[dict]) -> None:
    """Print summary statistics for exported leads."""
    if not leads:
        print("No leads exported")
        return

    # Count by state
    states = {}
    for lead in leads:
        state = lead.get("state", "Unknown")
        states[state] = states.get(state, 0) + 1

    # Count by status
    statuses = {}
    for lead in leads:
        status = lead.get("status", "Unknown")
        statuses[status] = statuses.get(status, 0) + 1

    # Count personalization
    with_hook = sum(1 for l in leads if l.get("ai_opening_hook"))
    with_subject = sum(1 for l in leads if l.get("ai_subject_line"))

    print(f"\nExported {len(leads)} leads")
    print(f"\nBy State:")
    for state, count in sorted(states.items(), key=lambda x: -x[1]):
        print(f"  {state}: {count}")

    print(f"\nBy Status:")
    for status, count in sorted(statuses.items(), key=lambda x: -x[1]):
        print(f"  {status}: {count}")

    print(f"\nPersonalization:")
    print(f"  With AI Subject Line: {with_subject}/{len(leads)}")
    print(f"  With AI Opening Hook: {with_hook}/{len(leads)}")


def main():
    parser = argparse.ArgumentParser(description="Export leads from CRM for campaigns")
    parser.add_argument("--spreadsheet-id", default=SPREADSHEET_ID, help="Source spreadsheet ID")
    parser.add_argument("--status", help="Filter by status (Lead, Neg, Closed)")
    parser.add_argument("--state", help="Filter by state (KY, TN, PA, etc.)")
    parser.add_argument("--city", help="Filter by city (partial match)")
    parser.add_argument("--not-emailed", action="store_true", help="Only leads not yet emailed")
    parser.add_argument("--not-called", action="store_true", help="Only leads not yet called")
    parser.add_argument("--has-hook", action="store_true", help="Only leads with AI Opening Hook")
    parser.add_argument("--limit", type=int, help="Max leads to export")
    parser.add_argument("--output", "-o", type=Path, default=OUTPUT_FILE, help="Output file")

    args = parser.parse_args()

    if not args.spreadsheet_id:
        print("Error: SPREADSHEET_ID not set. Use --spreadsheet-id or set in .env")
        return

    print(f"Connecting to Google Sheets...")
    service = get_sheets_service()

    print(f"Exporting leads...")
    leads = export_leads(
        service,
        args.spreadsheet_id,
        status_filter=args.status,
        state_filter=args.state,
        city_filter=args.city,
        not_emailed=args.not_emailed,
        not_called=args.not_called,
        has_hook=args.has_hook,
        limit=args.limit
    )

    print_summary(leads)

    # Save to file
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w") as f:
        json.dump(leads, f, indent=2)

    print(f"\nExported to {args.output}")


if __name__ == "__main__":
    main()
