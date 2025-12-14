#!/usr/bin/env python3
"""Google Sheets manager for real estate lead workflow."""

import gspread
from google.oauth2.service_account import Credentials
from typing import List, Dict, Optional
import os

SHEET_URL = 'https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit'
CREDS_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'credentials.json')

def get_client():
    """Get authenticated gspread client."""
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    creds = Credentials.from_service_account_file(CREDS_PATH, scopes=scopes)
    return gspread.authorize(creds)

def get_sheet():
    """Get the main worksheet."""
    client = get_client()
    return client.open_by_url(SHEET_URL).sheet1

def get_all_leads() -> List[Dict]:
    """Get all leads from sheet."""
    sheet = get_sheet()
    return sheet.get_all_records()

def get_leads_ready_for_campaign() -> List[Dict]:
    """Get leads that have email address and email draft."""
    leads = get_all_leads()
    return [
        lead for lead in leads
        if lead.get('Email', '').strip() and lead.get('Email Draft', '').strip()
    ]

def parse_email_draft(draft: str) -> Dict:
    """Parse email draft into subject and body."""
    lines = draft.strip().split('\n')
    subject = ""
    body_lines = []

    for i, line in enumerate(lines):
        if line.startswith('SUBJECT:'):
            subject = line.replace('SUBJECT:', '').strip()
        elif subject:  # After subject line
            body_lines.append(line)

    body = '\n'.join(body_lines).strip()
    return {'subject': subject, 'body': body}

def format_lead_for_instantly(lead: Dict) -> Dict:
    """Format a lead for Instantly import."""
    draft_parsed = parse_email_draft(lead.get('Email Draft', ''))

    # Extract first name from various fields
    first_name = lead.get('First Name', '').strip()
    if not first_name:
        # Try to extract from company name or draft
        company = lead.get('companyName', '')
        if 'Hi ' in lead.get('Email Draft', ''):
            try:
                start = lead['Email Draft'].index('Hi ') + 3
                end = lead['Email Draft'].index(',', start)
                name = lead['Email Draft'][start:end].strip()
                if name != 'there':
                    first_name = name
            except:
                pass

    return {
        'email': lead.get('Email', '').strip(),
        'first_name': first_name or 'there',
        'last_name': lead.get('Last Name', '').strip(),
        'company_name': lead.get('companyName', '').strip(),
        'phone': lead.get('Phone', '').strip(),
        'website': lead.get('companyWebsite', '').strip(),
        'custom_variables': {
            'location': lead.get('location', '').strip(),
            'industry': lead.get('industry', '').strip(),
            'linkedIn': lead.get('linkedIn', '').strip(),
            'personalContext': lead.get('Personal Context', '').strip(),
            'emailSubject': draft_parsed['subject'],
            'emailBody': draft_parsed['body'],
        }
    }

def update_lead_status(email: str, status: str):
    """Update lead status in sheet."""
    sheet = get_sheet()
    cell = sheet.find(email)
    if cell:
        # Lead Status is column B (index 2)
        sheet.update_cell(cell.row, 2, status)

if __name__ == '__main__':
    leads = get_leads_ready_for_campaign()
    print(f"Found {len(leads)} leads ready for campaign")

    if leads:
        sample = format_lead_for_instantly(leads[0])
        print(f"\nSample formatted lead:")
        for k, v in sample.items():
            if k != 'custom_variables':
                print(f"  {k}: {v}")
        print(f"  custom_variables:")
        for k, v in sample['custom_variables'].items():
            preview = str(v)[:50] + '...' if len(str(v)) > 50 else v
            print(f"    {k}: {preview}")
