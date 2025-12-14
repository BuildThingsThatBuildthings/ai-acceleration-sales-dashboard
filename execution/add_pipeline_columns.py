#!/usr/bin/env python3
"""
Add Pipeline Columns - Extend Google Sheet with 6 new columns (Z-AE)

Adds columns for pipeline tracking, objection capture, and interest levels.

Usage:
    python execution/add_pipeline_columns.py
"""

import os
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Load environment variables
load_dotenv()

# Configuration
SERVICE_ACCOUNT_PATH = os.getenv("SERVICE_ACCOUNT_PATH", "credentials.json")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SHEET_NAME = os.getenv("SHEET_NAME", "Sheet1")

# New headers to add (columns Z-AE, indices 25-30)
NEW_HEADERS = [
    "Pipeline Stage",      # Z (25) - First Contact/Interested/Demo/Negotiating/Closed Won/Closed Lost
    "Objection Type",      # AA (26) - Budget/Time/Skepticism/Authority/Competition/Other
    "Objection Details",   # AB (27) - Their exact words
    "Competitor Mention",  # AC (28) - Competitor name if mentioned
    "Interest Level",      # AD (29) - Cold/Warm/Hot
    "Lost Reason"          # AE (30) - Price/Timing/Competitor/Not Fit/No Response
]


def get_sheets_service():
    """Create Google Sheets API service."""
    if not os.path.exists(SERVICE_ACCOUNT_PATH):
        raise FileNotFoundError(f"Service account file not found: {SERVICE_ACCOUNT_PATH}")

    creds = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_PATH,
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )

    return build("sheets", "v4", credentials=creds)


def check_existing_headers(service, spreadsheet_id: str) -> list:
    """Check what headers exist in row 1."""
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!Z1:AE1"
    ).execute()

    return result.get("values", [[]])[0] if result.get("values") else []


def add_headers(service, spreadsheet_id: str) -> bool:
    """Add new headers to columns Z-AE."""
    body = {"values": [NEW_HEADERS]}

    result = service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!Z1:AE1",
        valueInputOption="RAW",
        body=body
    ).execute()

    updated_cells = result.get("updatedCells", 0)
    print(f"Added {updated_cells} new header columns")

    return updated_cells == 6


def main():
    """Main entry point."""
    if not SPREADSHEET_ID:
        print("Error: SPREADSHEET_ID not set in .env")
        return

    print(f"Adding pipeline columns to spreadsheet: {SPREADSHEET_ID}")
    print(f"New columns: {NEW_HEADERS}")

    service = get_sheets_service()

    # Check if columns already exist
    existing = check_existing_headers(service, SPREADSHEET_ID)
    if existing == NEW_HEADERS:
        print("\nPipeline columns already exist!")
        return

    if existing:
        print(f"\nExisting values in Z-AE: {existing}")
        print("Overwriting with new headers...")

    # Add headers
    if add_headers(service, SPREADSHEET_ID):
        print("\nPipeline columns added successfully!")
        print("New CRM structure: 31 columns (A-AE)")
    else:
        print("\nFailed to add columns!")


if __name__ == "__main__":
    main()
