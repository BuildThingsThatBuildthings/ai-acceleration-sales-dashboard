#!/usr/bin/env python3
"""Sync leads from Google Sheets to Instantly campaign."""

import json
import subprocess
from sheets_manager import get_leads_ready_for_campaign, format_lead_for_instantly

CAMPAIGN_ID = "fc45b2c2-109c-40f9-83ef-12ee1af9dc18"

def sync_leads_to_instantly(leads: list, batch_size: int = 50):
    """Sync leads to Instantly via MCP CLI."""
    # This would typically use the Instantly API directly
    # For now, we prepare the data for manual import or API call

    formatted = []
    seen_emails = set()

    for lead in leads:
        email = lead.get('email', '').strip().lower()
        if not email or '@' not in email or email in seen_emails:
            continue
        if len(email) > 100:
            continue
        seen_emails.add(email)
        formatted.append(lead)

    print(f"Prepared {len(formatted)} leads for Instantly")
    return formatted

def main():
    print("Fetching leads from Google Sheet...")
    raw_leads = get_leads_ready_for_campaign()
    print(f"Found {len(raw_leads)} leads with email + draft")

    print("\nFormatting for Instantly...")
    formatted = [format_lead_for_instantly(lead) for lead in raw_leads]

    print("\nValidating and deduplicating...")
    clean_leads = sync_leads_to_instantly(formatted)

    print(f"\n=== READY FOR INSTANTLY ===")
    print(f"Campaign ID: {CAMPAIGN_ID}")
    print(f"Total leads: {len(clean_leads)}")

    # Output JSON for import
    output_file = "leads_for_instantly.json"
    with open(output_file, 'w') as f:
        json.dump(clean_leads, f, indent=2)
    print(f"Saved to: {output_file}")

    # Show sample
    print("\nSample lead:")
    if clean_leads:
        sample = clean_leads[0]
        print(f"  Email: {sample['email']}")
        print(f"  Name: {sample.get('first_name', 'N/A')}")
        print(f"  Company: {sample.get('company_name', 'N/A')}")

if __name__ == '__main__':
    main()
