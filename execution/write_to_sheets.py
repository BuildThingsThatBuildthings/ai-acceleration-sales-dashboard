#!/usr/bin/env python3
"""
Write to Sheets - CRM Update Script

Fallback script for writing enriched leads to Google Sheets CRM
when Google Sheets MCP is unavailable.

Usage:
    python execution/write_to_sheets.py
    python execution/write_to_sheets.py --spreadsheet-id "xxx"
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

INPUT_FILE = Path(".tmp/enriched_leads.json")
FALLBACK_INPUT_FILE = Path(".tmp/scraped_leads.json")

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


def generate_casual_company_name(official_name: str) -> str:
    """
    Generate casual company name by stripping legal entities.

    Args:
        official_name: Official company name

    Returns:
        Casual/friendly company name
    """
    # Words to remove
    strip_words = [
        "LLC", "Inc", "Inc.", "Corp", "Corp.", "Ltd", "Ltd.", "LLP",
        "Realty", "Real Estate", "Properties", "Group", "Company",
        "Associates", "& Associates"
    ]

    name = official_name
    for word in strip_words:
        name = name.replace(word, "")

    # Clean up extra spaces and trailing commas
    name = " ".join(name.split())
    name = name.strip(" ,.-")

    return name


def generate_subject_line(city: str) -> str:
    """
    Generate AI subject line (5 words, B2B hook).

    Args:
        city: Lead's city

    Returns:
        5-word subject line
    """
    templates = [
        "AI transforms your brokerage operations",
        "Automation is your competitive edge",
        "Turn AI into operational asset",
        "Your agents need AI tools",
        "Stop losing deals to inefficiency"
    ]

    # Rotate through templates based on city hash
    index = hash(city) % len(templates)
    return templates[index]


def generate_opening_hook(city: str, state: str) -> str:
    """
    Generate AI opening hook (max 20 words, hyper-local).

    Args:
        city: Lead's city
        state: Lead's state

    Returns:
        Opening hook sentence
    """
    templates = [
        f"{city}'s competitive market demands efficiency—most brokers waste 3 hours daily on listing descriptions alone.",
        f"With inventory tight in {city}, your agents can't afford manual tasks eating their prospecting time.",
        f"{city}'s hot market moves fast—automated follow-ups catch leads your competitors miss.",
        f"In {city}'s shifting market, the brokerages winning are the ones automating the mundane.",
        f"Every hour your {city} agents spend on admin is an hour not spent closing deals."
    ]

    index = hash(city + state) % len(templates)
    return templates[index]


def verify_headers(service, spreadsheet_id: str) -> bool:
    """
    Verify spreadsheet has correct headers.

    Args:
        service: Google Sheets service
        spreadsheet_id: Spreadsheet ID

    Returns:
        True if headers match, False otherwise
    """
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!A1:Y1"
    ).execute()

    headers = result.get("values", [[]])[0]

    if headers != REQUIRED_HEADERS:
        print("Header mismatch!")
        print(f"Expected: {REQUIRED_HEADERS}")
        print(f"Got: {headers}")
        return False

    return True


def get_existing_emails(service, spreadsheet_id: str) -> set:
    """
    Get all existing emails in the sheet for deduplication.

    Args:
        service: Google Sheets service
        spreadsheet_id: Spreadsheet ID

    Returns:
        Set of existing email addresses
    """
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!D:D"
    ).execute()

    values = result.get("values", [])
    emails = {row[0].lower() for row in values if row}

    return emails


def get_existing_websites(service, spreadsheet_id: str) -> set:
    """
    Get all existing websites in the sheet for deduplication.

    Args:
        service: Google Sheets service
        spreadsheet_id: Spreadsheet ID

    Returns:
        Set of existing website URLs
    """
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!G:G"
    ).execute()

    values = result.get("values", [])
    websites = {row[0].lower().rstrip("/") for row in values if row}

    return websites


def lead_to_row(lead: dict) -> list:
    """
    Convert a lead dictionary to a row for the spreadsheet.

    Args:
        lead: Lead dictionary

    Returns:
        List of values for spreadsheet row
    """
    # Map Decision Maker fields if available
    dm_name = lead.get("decision_maker_name", "").strip()
    first_name = lead.get("first_name", "")
    last_name = lead.get("last_name", "")
    
    if not first_name and dm_name:
        parts = dm_name.split()
        if len(parts) >= 1:
            first_name = parts[0]
            if len(parts) > 1:
                last_name = " ".join(parts[1:])
    
    email = lead.get("email", "") or lead.get("decision_maker_email", "")
    
    casual_name = generate_casual_company_name(lead.get("business_name", ""))
    
    # Use existing hook/subject if present (manual enrichment), else generate
    subject_line = lead.get("ai_subject_line") or generate_subject_line(lead.get("city", ""))
    opening_hook = lead.get("ai_opening_hook") or generate_opening_hook(lead.get("city", ""), lead.get("state", ""))
    
    today = datetime.now().strftime("%Y-%m-%d")

    return [
        first_name,                            # A: First Name
        last_name,                             # B: Last Name
        lead.get("phone", ""),                 # C: Phone Number
        email,                                 # D: Email Address
        lead.get("business_name", ""),         # E: Official Company Name
        casual_name,                           # F: Casual Company Name
        lead.get("website_url", ""),           # G: Website URL
        lead.get("city", ""),                  # H: City
        lead.get("state", ""),                 # I: State
        subject_line,                          # J: AI Subject Line
        opening_hook,                          # K: AI Opening Hook
        today,                                 # L: Contact Date
        "",                                    # M: Follow Up Date
        "",                                    # N: Called (Yes/No)
        "",                                    # O: Emailed (Yes/No)
        "",                                    # P: Call Notes
        "Lead",                                # Q: Status
        "",                                    # R: Bought 1Hr Course
        "",                                    # S: Bought 3Hr Course
        "",                                    # T: Bought 6Hr Course
        "",                                    # U: Referred By
        "",                                    # V: Referral Lead Date
        "",                                    # W: Referral Book Date
        "",                                    # X: Referral Bonus Owed
        ""                                     # Y: Bonus Paid
    ]


def write_leads(service, spreadsheet_id: str, leads: list[dict]) -> int:
    """
    Write leads to spreadsheet.

    Args:
        service: Google Sheets service
        spreadsheet_id: Spreadsheet ID
        leads: List of enriched lead dictionaries

    Returns:
        Number of rows written
    """
    # Get existing emails and websites for deduplication
    existing_emails = get_existing_emails(service, spreadsheet_id)
    existing_websites = get_existing_websites(service, spreadsheet_id)

    # Convert leads to rows, skipping duplicates
    rows = []
    skipped = 0

    for lead in leads:
        email = lead.get("email", "").lower()
        website = lead.get("website_url", "").lower().rstrip("/")

        # Dedupe by email if present
        if email and email in existing_emails:
            print(f"Skipping duplicate (email): {email}")
            skipped += 1
            continue

        # Dedupe by website if email missing
        if not email and website and website in existing_websites:
             print(f"Skipping duplicate (website): {website}")
             skipped += 1
             continue

        rows.append(lead_to_row(lead))
        if email:
            existing_emails.add(email)
        if website:
            existing_websites.add(website)

    if not rows:
        print("No new leads to write")
        return 0

    # Append rows to sheet
    body = {"values": rows}

    result = service.spreadsheets().values().append(
        spreadsheetId=spreadsheet_id,
        range=f"{SHEET_NAME}!A:Y",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body=body
    ).execute()

    written = result.get("updates", {}).get("updatedRows", 0)
    print(f"Wrote {written} rows, skipped {skipped} duplicates")

    return written


def load_leads() -> list[dict]:
    """
    Load enriched leads from input file.

    Returns:
        List of lead dictionaries
    """
    if INPUT_FILE.exists():
        with open(INPUT_FILE) as f:
            data = json.load(f)
            # Handle different formats (list vs dict)
            if isinstance(data, dict):
                return data.get("leads", [])
            return data
    elif FALLBACK_INPUT_FILE.exists():
        print(f"Enriched leads not found, using scraped leads: {FALLBACK_INPUT_FILE}")
        with open(FALLBACK_INPUT_FILE) as f:
            data = json.load(f)
            # Handle different formats (list vs dict)
            if isinstance(data, dict):
                return data.get("leads", [])
            return data
    else:
        print(f"No input files found. Checked {INPUT_FILE} and {FALLBACK_INPUT_FILE}")
        return []


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Write leads to Google Sheets CRM")
    parser.add_argument("--spreadsheet-id", default=SPREADSHEET_ID, help="Target spreadsheet ID")

    args = parser.parse_args()

    if not args.spreadsheet_id:
        print("Error: SPREADSHEET_ID not set. Use --spreadsheet-id or set in .env")
        return

    # Load leads
    leads = load_leads()
    if not leads:
        print("No leads to process")
        return

    print(f"Processing {len(leads)} leads...")

    # Connect to Google Sheets
    service = get_sheets_service()

    # Verify headers
    if not verify_headers(service, args.spreadsheet_id):
        print("Error: Headers don't match required structure. Fix sheet headers first.")
        return

    # Write leads
    written = write_leads(service, args.spreadsheet_id, leads)

    print(f"\nCRM update complete: {written} new leads added")


if __name__ == "__main__":
    main()
