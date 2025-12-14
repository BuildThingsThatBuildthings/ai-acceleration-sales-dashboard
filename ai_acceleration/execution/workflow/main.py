#!/usr/bin/env python3
"""
Real Estate Agent Outreach Workflow

Complete system to:
1. Pull agent data from Google Sheet
2. Format for email campaigns
3. Sync to Instantly for automated outreach

Usage:
    python main.py              # Run full workflow
    python main.py --status     # Check campaign status
"""

import argparse
from sheets_manager import get_leads_ready_for_campaign, get_all_leads, format_lead_for_instantly

CAMPAIGN_ID = "fc45b2c2-109c-40f9-83ef-12ee1af9dc18"
CAMPAIGN_NAME = "Real Estate AI Training - Dec 2025"

def show_status():
    """Show current workflow status."""
    print("=" * 50)
    print("REAL ESTATE OUTREACH WORKFLOW STATUS")
    print("=" * 50)

    all_leads = get_all_leads()
    ready = get_leads_ready_for_campaign()

    print(f"\n📊 Google Sheet Stats:")
    print(f"   Total rows: {len(all_leads)}")
    print(f"   With email: {len([l for l in all_leads if l.get('Email')])}")
    print(f"   Ready to send: {len(ready)}")

    print(f"\n📧 Instantly Campaign:")
    print(f"   ID: {CAMPAIGN_ID}")
    print(f"   Name: {CAMPAIGN_NAME}")
    print(f"   Senders: 5 accounts (@buildthingsai.com)")
    print(f"   Sequence: 3 emails, 3-day delays")
    print(f"   Schedule: Mon-Fri 9am-5pm CST")

    print(f"\n✅ System Ready")
    print(f"   Run 'python main.py' to sync new leads")

def run_workflow():
    """Run the full sync workflow."""
    print("🚀 Starting Real Estate Outreach Workflow\n")

    # Step 1: Get leads
    print("Step 1: Fetching leads from Google Sheet...")
    ready_leads = get_leads_ready_for_campaign()
    print(f"   Found {len(ready_leads)} leads ready for campaign")

    # Step 2: Format
    print("\nStep 2: Formatting leads for Instantly...")
    formatted = []
    seen = set()
    for lead in ready_leads:
        data = format_lead_for_instantly(lead)
        email = data['email'].lower()
        if email and '@' in email and email not in seen:
            seen.add(email)
            formatted.append(data)
    print(f"   Prepared {len(formatted)} unique leads")

    # Step 3: Output
    print("\nStep 3: Ready for Instantly import")
    print(f"   Campaign: {CAMPAIGN_NAME}")
    print(f"   Leads: {len(formatted)}")

    # Show sample
    if formatted:
        print("\n📋 Sample lead:")
        s = formatted[0]
        print(f"   {s['email']}")
        print(f"   {s.get('company_name', 'N/A')}")
        print(f"   {s.get('custom_variables', {}).get('location', 'N/A')}")

    print("\n✅ Workflow complete!")
    print(f"   Use Instantly MCP to add {len(formatted)} leads to campaign")

    return formatted

def main():
    parser = argparse.ArgumentParser(description='Real Estate Outreach Workflow')
    parser.add_argument('--status', action='store_true', help='Show status only')
    args = parser.parse_args()

    if args.status:
        show_status()
    else:
        run_workflow()

if __name__ == '__main__':
    main()
