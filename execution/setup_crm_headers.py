#!/usr/bin/env python3
"""
Setup CRM Headers - Initialize Google Sheet with 25-column structure

Creates or verifies the header row in the CRM spreadsheet.

Usage:
    python execution/setup_crm_headers.py
    python execution/setup_crm_headers.py --spreadsheet-id "xxx"
"""

import os
import json
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Load environment variables
load_dotenv()

# Configuration
SERVICE_ACCOUNT_PATH = os.getenv("SERVICE_ACCOUNT_PATH", "credentials.json")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SHEET_NAME = os.getenv("SHEET_NAME", "Sheet1")

OUTPUT_FILE = Path(".tmp/crm_setup_complete.json")

# Required header structure (25 columns)
REQUIRED_HEADERS = [
    "First Name", "Last Name", "Phone Number", "Email Address",
    "Official Company Name", "Casual Company Name", "Website URL",
    "City", "State", "AI Subject Line", "AI Opening Hook",
    "Contact Date", "Follow Up Date", "Called (Yes/No)", "Emailed (Yes/No)",
    "Call Notes", "Status (Lead/Neg/Closed)", "Bought 1Hr Course (Check)",
    "Bought 3Hr Course (Check)", "Bought 6Hr Course (Check)",
    "Referred By (Name)", "Referral Lead Date", "Referral Book Date",
    "Referral Bonus Owed", "Bonus Paid (Check)"
]


def get_sheets_service():
    """
    Create Google Sheets API service.

    Returns:
        Google Sheets service object
    """
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        raise FileNotFoundError(f"Service account file not found: {SERVICE_ACCOUNT_PATH}")

    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_PATH,
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )

    return build("sheets", "v4", credentials=creds)


def get_existing_headers(service, spreadsheet_id: str) -> list:
    """
    Get existing headers from row 1.

    Args:
        service: Google Sheets service
        spreadsheet_id: Spreadsheet ID

    Returns:
        List of existing header values
    """
    try:
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=f"{SHEET_NAME}!A1:Y1"
        ).execute()

        return result.get("values", [[]])[0]
    except Exception as e:
        print(f"Error reading headers: {e}")
        return []


def write_headers(service, spreadsheet_id: str) -> bool:
    """
    Write headers to row 1.

    Args:
        service: Google Sheets service
        spreadsheet_id: Spreadsheet ID

    Returns:
        True if successful
    """
    body = {"values": [REQUIRED_HEADERS]}

    result = service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!A1:Y1",
        valueInputOption="RAW",
        body=body
    ).execute()

    updated_cells = result.get("updatedCells", 0)
    print(f"Updated {updated_cells} header cells")

    return updated_cells == 25


def save_receipt(spreadsheet_id: str, headers_written: int, status: str) -> None:
    """
    Save setup receipt to output file.

    Args:
        spreadsheet_id: Spreadsheet ID
        headers_written: Number of headers written
        status: success or failure
    """
    OUTPUT_FILE.parent.mkdir(exist_ok=True)

    receipt = {
        "timestamp": datetime.now().isoformat(),
        "spreadsheet_id": spreadsheet_id,
        "spreadsheet_url": f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit",
        "sheet_name": SHEET_NAME,
        "headers_written": headers_written,
        "header_list": REQUIRED_HEADERS,
        "status": status
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(receipt, f, indent=2)

    print(f"Receipt saved to {OUTPUT_FILE}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Set up CRM headers in Google Sheets")
    parser.add_argument("--spreadsheet-id", default=SPREADSHEET_ID, help="Target spreadsheet ID")

    args = parser.parse_args()

    if not args.spreadsheet_id:
        print("Error: SPREADSHEET_ID not set. Use --spreadsheet-id or set in .env")
        return

    print(f"Setting up CRM headers for spreadsheet: {args.spreadsheet_id}")

    # Connect to Google Sheets
    service = get_sheets_service()

    # Check existing headers
    existing = get_existing_headers(service, args.spreadsheet_id)

    if existing == REQUIRED_HEADERS:
        print("Headers already set correctly!")
        save_receipt(args.spreadsheet_id, 25, "success")
        return

    if existing:
        print(f"Existing headers found but don't match. Overwriting...")
        print(f"  Existing: {existing[:5]}... ({len(existing)} columns)")
        print(f"  Required: {REQUIRED_HEADERS[:5]}... (25 columns)")

    # Write headers
    if write_headers(service, args.spreadsheet_id):
        print("\nCRM headers set successfully!")
        save_receipt(args.spreadsheet_id, 25, "success")
    else:
        print("\nFailed to set headers!")
        save_receipt(args.spreadsheet_id, 0, "failure")


if __name__ == "__main__":
    main()
