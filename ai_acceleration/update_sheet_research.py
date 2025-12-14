#!/usr/bin/env python3
"""
Update Google Sheet with personalized research data
"""

import gspread
from google.oauth2.service_account import Credentials
import time

# Setup Google Sheets access
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
CREDS_FILE = '/Users/ryan/ai_acceleration/credentials.json'
SHEET_URL = 'https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit'

def setup_sheet():
    """Connect to Google Sheet"""
    creds = Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPES)
    client = gspread.authorize(creds)
    sheet = client.open_by_url(SHEET_URL).sheet1
    return sheet

# Research data for all leads
research_data = [
    {
        'row': 2,
        'company_name': 'Berkshire Hathaway Homesale Realty - The Craig Hartranft Team',
        'decision_maker_name': 'Craig Hartranft',
        'brand_tagline': 'Our primary focus is on YOU, the client',
        'unique_hook': '30+ years experience, #1 team in Lancaster County, ranked #4 nationally, sold 444 homes in 2024',
        'custom_subject': 'Craig - 444 homes sold in 2024?',
        'custom_opener': 'Craig, I saw your team ranked #4 nationally for homes sold. With 30+ years in Lancaster County and over 20 team members, you\'ve clearly built something impressive.',
        'research_status': 'Complete'
    },
    {
        'row': 3,
        'company_name': 'Jennifer King RE/MAX Evolved',
        'decision_maker_name': 'Jennifer King',
        'brand_tagline': 'Your Dreams. Our Passion Is To Help You Turn Dreams Into Realty Reality',
        'unique_hook': 'Licensed since 2000, RE/MAX Hall of Fame, 2019 Realtor of the Year, donates to Children\'s Miracle Network',
        'custom_subject': 'Jennifer - Hall of Fame + giving back?',
        'custom_opener': 'Jennifer, I noticed you\'re in the RE/MAX Hall of Fame and were named 2019 Realtor of the Year. Plus, donating commission to Children\'s Miracle Network is a beautiful touch.',
        'research_status': 'Complete'
    },
    {
        'row': 4,
        'company_name': 'The Moore Group Real Estate - Lancaster, PA Realtor',
        'decision_maker_name': 'The Moore Group',
        'brand_tagline': 'Trusted real estate resource in Lancaster PA',
        'unique_hook': 'Serves 4 counties (Lancaster, Chester, Lebanon, York), affiliated with Keller Williams Elite',
        'custom_subject': 'Moore Group - 4 county coverage?',
        'custom_opener': 'I see you cover Lancaster, Chester, Lebanon, and York counties with Keller Williams Elite. That\'s an impressive service area for your team.',
        'research_status': 'Complete'
    },
    {
        'row': 5,
        'company_name': 'Life Changes Realty Group - Lancaster Office',
        'decision_maker_name': 'Unknown',
        'brand_tagline': '',
        'unique_hook': '',
        'custom_subject': '',
        'custom_opener': '',
        'research_status': 'Website fetch failed - Wix site'
    },
    {
        'row': 6,
        'company_name': 'Lusk & Associates | Sotheby\'s International Realty',
        'decision_maker_name': 'Lusk & Associates',
        'brand_tagline': 'Success is built on relationships, integrity, and a commitment to excellence',
        'unique_hook': '25+ years, 26 sales associates, $143B annual sales, 1,115 offices in 84 countries, Sotheby\'s affiliate',
        'custom_subject': 'Lusk - 25 years + Sotheby\'s prestige?',
        'custom_opener': 'I noticed you\'ve been active in Lancaster for 25+ years with 26 associates. Being affiliated with Sotheby\'s International Realty with that global reach is quite the platform.',
        'research_status': 'Complete'
    },
    {
        'row': 7,
        'company_name': 'The Mark Rebert Team - Lancaster Residential Realtors',
        'decision_maker_name': 'Mark Rebert',
        'brand_tagline': '',
        'unique_hook': 'Lancaster PA specialist, uses YLOPO tech platform',
        'custom_subject': 'Mark - tech-forward approach?',
        'custom_opener': 'Mark, I see you\'re using some solid tech like YLOPO for your Lancaster listings. Always good to see agents embracing modern tools.',
        'research_status': 'Complete'
    },
    {
        'row': 8,
        'company_name': 'Home 1st Realty',
        'decision_maker_name': 'Ada Rivera',
        'brand_tagline': 'Committed to providing a world-class real estate experience',
        'unique_hook': 'Bilingual (Spanish/English), serves 5 counties, focuses on first-time homebuyers',
        'custom_subject': 'Ada - bilingual + first-time buyers?',
        'custom_opener': 'Ada, I love that you focus on Spanish/English service for first-time homebuyers across 5 counties. That\'s filling an important need in the Lancaster market.',
        'research_status': 'Complete'
    },
    {
        'row': 10,
        'company_name': 'Faruk Sisic - Realtor - Cavalry Realty LLC',
        'decision_maker_name': 'Faruk Sisic',
        'brand_tagline': 'You can expect honesty, respect, constant communication and highest quality service',
        'unique_hook': '21+ years full-time (since 2004), serves 5 counties, emphasis on negotiation',
        'custom_subject': 'Faruk - 21 years strong?',
        'custom_opener': 'Faruk, 21+ years as a full-time realtor since 2004 shows serious staying power. Your emphasis on negotiation skills really comes through on your site.',
        'research_status': 'Complete'
    },
    {
        'row': 11,
        'company_name': 'Berkshire Hathaway HomeServices Homesale Realty I North Pointe',
        'decision_maker_name': 'Berkshire Hathaway Homesale',
        'brand_tagline': '',
        'unique_hook': 'Part of Berkshire Hathaway network, offers mortgage services',
        'custom_subject': 'BHHS - one-stop shop approach?',
        'custom_opener': 'I see you\'re part of the Berkshire Hathaway network with HomeSale Mortgage integrated. Nice one-stop experience for buyers.',
        'research_status': 'Complete'
    },
    {
        'row': 12,
        'company_name': 'Berkshire Hathaway HomeServices Homesale Realty | Centerville',
        'decision_maker_name': 'Berkshire Hathaway Homesale',
        'brand_tagline': '',
        'unique_hook': 'Part of Berkshire Hathaway network, mobile PWA, mortgage division',
        'custom_subject': 'BHHS - mobile-first tech?',
        'custom_opener': 'I noticed your progressive web app for mobile and integrated mortgage services. Solid tech infrastructure for modern buyers.',
        'research_status': 'Complete'
    },
    {
        'row': 13,
        'company_name': 'Chuck Honabach Team – Realty ONE Group Unlimited',
        'decision_maker_name': 'Chuck Honabach',
        'brand_tagline': 'LOCAL EXPERTISE. EXCEPTIONAL RESULTS. ONE HOME AT A TIME.',
        'unique_hook': 'Focus on wealth-building through real estate, active on TikTok/YouTube/Instagram, Realty ONE Group',
        'custom_subject': 'Chuck - wealth building focus?',
        'custom_opener': 'Chuck, I like your focus on helping clients build net wealth through real estate in Lancaster County. Plus, seeing agents active on TikTok and YouTube is refreshing.',
        'research_status': 'Complete'
    },
    {
        'row': 14,
        'company_name': 'Prime Home Real Estate',
        'decision_maker_name': 'David Wolfe',
        'brand_tagline': 'A Fresh Approach to Real Estate - Humble and Hungry',
        'unique_hook': 'Serves buyers, sellers, investors + private money lending',
        'custom_subject': 'David - fresh approach + lending?',
        'custom_opener': 'David, I noticed you offer private money lending alongside traditional services. That "humble and hungry" approach really sets the tone.',
        'research_status': 'Complete'
    },
    {
        'row': 15,
        'company_name': 'RE/MAX SmartHub Realty',
        'decision_maker_name': 'Unknown',
        'brand_tagline': '',
        'unique_hook': '',
        'custom_subject': '',
        'custom_opener': '',
        'research_status': 'Website error 525'
    },
    {
        'row': 16,
        'company_name': 'PPM Real Estate, Inc',
        'decision_maker_name': 'Tracy Lin Horst / Corinn Kirchner',
        'brand_tagline': 'Lancaster\'s Leader in commercial real estate - Success is the Solution',
        'unique_hook': '30+ years (founded 1990), 5 professionals, 100% referral-based growth, commercial/industrial focus',
        'custom_subject': 'Tracy - 30 years, zero advertising?',
        'custom_opener': 'Tracy, I saw PPM has been serving Lancaster for 30+ years and has never advertised. Growing entirely on referrals speaks volumes about your commercial real estate expertise.',
        'research_status': 'Complete'
    },
    {
        'row': 17,
        'company_name': 'Alan H. Cherkin Real Estate Incorporated',
        'decision_maker_name': 'Alan Cherkin',
        'brand_tagline': '',
        'unique_hook': 'Offers "We Buy Homes", rental management, no money down programs, credit repair affiliates',
        'custom_subject': 'Alan - creative buyer programs?',
        'custom_opener': 'Alan, I see you offer no money down programs, rental management, and even credit repair affiliates. That\'s a comprehensive suite of solutions for Lancaster buyers.',
        'research_status': 'Complete'
    },
    {
        'row': 18,
        'company_name': 'The Shreiner Group',
        'decision_maker_name': 'Tim Shreiner',
        'brand_tagline': 'Go the Extra Mile - Your Real Estate Team for Life',
        'unique_hook': '11 agents, 200+ years combined experience, Chairman\'s Circle Diamond (top 0.5% of BHHS), 10 years running, free moving truck',
        'custom_subject': 'Tim - top 0.5% + free truck?',
        'custom_opener': 'Tim, being in the top 0.5% of Berkshire Hathaway agents for 10 straight years is remarkable. And offering a complimentary moving truck? That\'s going the extra mile indeed.',
        'research_status': 'Complete'
    },
    {
        'row': 19,
        'company_name': 'Coldwell Banker Realty - Lancaster',
        'decision_maker_name': 'Unknown',
        'brand_tagline': '',
        'unique_hook': '',
        'custom_subject': '',
        'custom_opener': '',
        'research_status': 'Website error - request rejected'
    },
    {
        'row': 20,
        'company_name': 'The Wissler Team of Coldwell Banker Realty',
        'decision_maker_name': 'Unknown',
        'brand_tagline': '',
        'unique_hook': '',
        'custom_subject': '',
        'custom_opener': '',
        'research_status': 'Website CSS only - no content'
    },
    {
        'row': 21,
        'company_name': 'The Marian Rutt Team',
        'decision_maker_name': 'Unknown',
        'brand_tagline': '',
        'unique_hook': '',
        'custom_subject': '',
        'custom_opener': '',
        'research_status': 'Website error 403'
    }
]

def update_sheet_with_research(sheet):
    """Update sheet with all research data"""
    header = sheet.row_values(1)

    # Get column indices
    col_indices = {
        'decision_maker_name': header.index('decision_maker_name') + 1,
        'unique_hook': header.index('unique_hook') + 1,
        'brand_tagline': header.index('brand_tagline') + 1,
        'custom_subject': header.index('custom_subject') + 1,
        'custom_opener': header.index('custom_opener') + 1,
        'research_status': header.index('research_status') + 1
    }

    print(f"Updating {len(research_data)} leads with research data...\n")

    for lead in research_data:
        row = lead['row']
        print(f"Row {row}: {lead['company_name']}")
        print(f"  Status: {lead['research_status']}")

        # Update each column
        updates = [
            (row, col_indices['decision_maker_name'], lead.get('decision_maker_name', '')),
            (row, col_indices['unique_hook'], lead.get('unique_hook', '')),
            (row, col_indices['brand_tagline'], lead.get('brand_tagline', '')),
            (row, col_indices['custom_subject'], lead.get('custom_subject', '')),
            (row, col_indices['custom_opener'], lead.get('custom_opener', '')),
            (row, col_indices['research_status'], lead['research_status'])
        ]

        for row_num, col_num, value in updates:
            if value:  # Only update if there's a value
                sheet.update_cell(row_num, col_num, value)
                time.sleep(1.5)  # Rate limiting

        if lead.get('custom_subject'):
            print(f"  Subject: {lead['custom_subject']}")
        print()

    print("✓ All updates complete!")

def main():
    print("Updating Google Sheet with Research Data")
    print("="*60)

    # Setup
    sheet = setup_sheet()
    print("✓ Connected to Google Sheet\n")

    # Update with research
    update_sheet_with_research(sheet)

    # Summary
    complete = sum(1 for r in research_data if r['research_status'] == 'Complete')
    failed = len(research_data) - complete

    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Total leads processed: {len(research_data)}")
    print(f"Successfully researched: {complete}")
    print(f"Failed/No data: {failed}")
    print("\nFailed leads:")
    for lead in research_data:
        if lead['research_status'] != 'Complete':
            print(f"  - Row {lead['row']}: {lead['company_name']} ({lead['research_status']})")

if __name__ == "__main__":
    main()
