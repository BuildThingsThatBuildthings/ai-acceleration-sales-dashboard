#!/usr/bin/env python3
"""
Fix ALL CRM issues identified in audit.
Updates rows with proper research-backed content.
Logs all changes.
"""

import os
import json
from datetime import datetime
from dotenv import load_dotenv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

load_dotenv()

SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
SERVICE_ACCOUNT_PATH = os.getenv('SERVICE_ACCOUNT_PATH', 'credentials.json')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Column mapping: A=First Name, B=Last Name, C=Phone, D=Email, E=Official Company,
# F=Casual Company, G=Website, H=City, I=State, J=AI Subject, K=AI Opening Hook

FIXES = {
    # =====================================================================
    # CRITICAL: Wrong Names (Rows 260, 261)
    # =====================================================================

    # Row 260: Iron Valley Lancaster - Using Dan Zecher (prominent agent/broker)
    260: {
        'A': 'Dan',
        'B': 'Zecher',
        'D': 'dzecher@ironvalleyrealestate.com',
        'J': '3 founders from healthcare, entertainment, and sales—fresh perspective, Dan',
        'K': 'Iron Valley of Lancaster was founded by three friends from outside real estate—healthcare, entertainment, and sales—bringing fresh eyes to how brokerage should work. Building a full-service firm with both Millersville Road and Oregon Pike locations shows the model is working in Lancaster County.',
    },

    # Row 261: Iron Valley Gettysburg - Using Walt Wensel (covers Gettysburg area)
    261: {
        'A': 'Walt',
        'B': 'Wensel',
        'D': 'wwensel@ironvalleyrealestate.com',
        'J': '25 years corporate sales to real estate broker in PA and MD—range, Walt',
        'K': 'Going from 25+ years in corporate sales and marketing to becoming an Associate Broker with licenses in both PA and MD—while earning CRS, ABR, and SRES designations—that kind of pivot takes real commitment. Your focus on retirees and relocating executives from Gettysburg to Harrisburg fills a real niche.',
    },

    # =====================================================================
    # HIGH: Generic Email (Row 104)
    # =====================================================================

    # Row 104: Richard Wolman - Update to personal email
    104: {
        'D': 'rwolman@compass-pa.com',
        'J': 'Architect turned CRE broker—35+ years serving Lancaster commercial, Richard',
        'K': 'Starting as an architect before pivoting to commercial real estate—and co-founding Compass Real Estate in Lancaster with over 35 years of combined experience in brokerage, development, finance, and construction—that architectural eye gives you a different perspective on commercial properties.',
    },

    # =====================================================================
    # TEMPLATE ROWS: Complete rewrites needed (Rows 263, 270)
    # =====================================================================

    # Row 263: Alex McCubbin - CEO of The Win Crew
    263: {
        'C': '(270) 904-0108',  # Fix phone format
        'J': 'D1 Sports background to 37-person real estate team CEO—impressive pivot, Alex',
        'K': 'Going from D1 Sports Training to building The Win Crew into a 37-person team generating $2M annually—and doing it all through referrals because you are careful about who you hire—that is exactly the kind of reputation-first approach that scales. Your Bowling Green market is growing fast.',
    },

    # Row 270: Russell Daniels - Principal Broker at Hillcrest
    270: {
        'C': '(859) 363-2999',  # Fix phone format
        'J': 'NKY real estate since 2014, broker since 2017—building steadily, Russ',
        'K': 'Starting in Northern Kentucky real estate in 2014, earning your broker license by 2017, founding Paragon Realty, then joining Hillcrest Realty as their broker in 2021—replacing their interim broker shows they wanted someone with your track record. The Denigan family has been building in NKY since 1980.',
    },

    # =====================================================================
    # GENERIC SUBJECT FIXES (Rows 3, 14, 254)
    # =====================================================================

    # Row 3: Jakeeva Lee - Fix generic subject
    3: {
        'J': 'Chicago to Louisville leading 5,500+ members—bold transition, Jakeeva',
    },

    # Row 14: Scott Hack - Fix generic subject
    14: {
        'J': "32 years experience backing Finish Line's knowledge focus, Scott",
    },

    # Row 254: Tiffany Bullaj - Complete rewrite needed
    254: {
        'J': 'York PA independent brokerage owner—grit over franchise, Tiffany',
        'K': 'Running House Broker Realty as an independent in York PA when the franchise giants dominate the market—that takes conviction. Independent brokers who survive long-term do so by outworking and out-servicing the big brands.',
    },

    # =====================================================================
    # HOOK ENDING FIXES: Remove "help you/could help" patterns
    # These rows have good facts but generic endings
    # =====================================================================

    # Row 29: Steve Fridrich
    29: {
        'K': 'Growing the company Jerry Fridrich started in 1966 from 10 agents to 180+, hitting $1.6 billion in gross sales in 2024—that generational success speaks for itself. Nashville independent brokerages face serious pressure from national brands, but you have kept Fridrich & Clark competing at the top.',
    },

    # Row 49: Gary Ashton
    49: {
        'K': 'Building the #1 RE/MAX team worldwide for 5 consecutive years, 7,500+ transactions, $1B+ annual sales—that level of consistent production does not happen by accident. Your Nashville presence is unmatched at the team level.',
    },

    # Row 51: Richard Gibbens
    51: {
        'K': 'Leaving Southwest MLS in Albuquerque to lead Bluegrass REALTORS and Imagine MLS—with 4,000+ members across 38 Kentucky counties—takes confidence. That willingness to tackle a completely new market with fresh eyes is rare.',
    },

    # Row 52: Carol Seal
    52: {
        'K': 'Leading Greater Chattanooga REALTORS since 1912—nearly 2,000 members across Hamilton, Sequatchie, and nearby counties—you are steward of a century-plus legacy. The association model is evolving fast, and your members are watching.',
    },

    # Row 54: Janie Wilson
    54: {
        'K': 'Leading NKAR since 2010—serving the Cincinnati metro spillover market in Northern Kentucky—you have seen 15 years of market cycles and industry shifts. That institutional memory matters as the industry transforms.',
    },

    # Row 56: Hugh Gordon
    56: {
        'K': 'With 24 years as a mortgage banker before leading FCAR\'s 1,300+ members—you understand both sides of the transaction in ways most association executives cannot. That lending background shapes how you think about member value.',
    },

    # Row 58: Sha Fister
    58: {
        'K': 'Leading Rector Hayden since Ray Rector founded it in 1969—now with 240+ agents across Central Kentucky and HomeServices backing—you balance independence with national resources. That combination positions you well for market shifts.',
    },

    # Row 59: Todd Back
    59: {
        'K': 'Growing The Brokerage from 19 agents in 2018 to 70 agents selling $375M in 2022—and being #1 in Lexington sales since 2020—your collaborative culture clearly produces results. That kind of growth trajectory attracts top talent.',
    },

    # Row 61: Al Isaac
    61: {
        'K': 'Founding NAI Isaac in 1987, growing to manage 6 million square feet, and serving as NAI Global Chairman—you have built one of Central Kentucky\'s most significant commercial portfolios while leading the global network.',
    },

    # Row 64: Michael Prather
    64: {
        'K': 'Going from top-producing agent to majority shareholder of KW Bluegrass in 2021—after being Central Kentucky\'s #1 team since 2011—that is ownership earned through production. You know what your agents need because you did the work.',
    },

    # Row 66: Jerry McMahan
    66: {
        'K': 'Three generations of McMahans building the #1 Coldwell Banker in Kentucky since 1992—10 offices, 190 agents, and 2,000+ transactions annually. That kind of family legacy is rare in an industry of consolidation and turnover.',
    },

    # Row 68: John Huggins
    68: {
        'K': 'Building Coldwell Banker Legacy Group into the #1 real estate office in Southern Kentucky since 1986—that is nearly 40 years of market leadership. Consistency like that comes from systems and culture, not luck.',
    },

    # Row 69: Ron Cummings
    69: {
        'K': 'Averaging 75 property sales per year as Broker/Owner of Century 21 Premier Realty Partners—while being fluent in Spanish to serve diverse buyers—that production level while running the brokerage is exceptional.',
    },

    # Row 70: Jared Nugent
    70: {
        'K': 'Earning the RE/MAX Hall of Fame and Lifetime Achievement awards with 15+ years in Bowling Green—serving both sides of the Kentucky-Tennessee border—your track record stands out in a competitive South Central market.',
    },

    # Row 73: Brad DeVries
    73: {
        'K': 'Serving as Regional President & CEO of Huff Realty, Semonin Realtors, Rector Hayden, and WR Realtors—four Berkshire Hathaway HomeServices affiliates across Kentucky—that portfolio gives you perspective few executives have.',
    },

    # Row 74: Robin Sheakley
    74: {
        'K': 'Taking over as President in 2019 as the fourth generation of the Sibcy family to lead the firm—now with 1,000+ agents across greater Cincinnati—you carry 100 years of family legacy while navigating an industry in transformation.',
    },

    # Row 75: Scott Nelson
    75: {
        'K': 'Leading Comey & Shepherd since 1990—with 639 agents across 14 offices and the highest per-person productivity in Cincinnati—that discipline shows in the results. Productivity metrics matter more than headcount.',
    },

    # Row 78: Adam Gamble
    78: {
        'K': 'Founding Iron Valley in Lebanon in 2016, adding 30 agents in 8 months, and growing to 1,900+ agents across 50 locations in 6 states—that franchise model clearly works. Your low-cost entry plus brick-and-mortar presence fills a real gap.',
    },

    # Row 79: Mike Berk
    79: {
        'K': 'Leading LCAR with 1,600+ members across Lancaster County since 1917—plus earning the RCE designation—you have built deep institutional knowledge of PA\'s second-largest real estate market outside Philadelphia.',
    },

    # Row 81: Rod Messick
    81: {
        'K': 'Leading Berkshire Hathaway HomeServices Homesale Realty as CEO—with 34 offices, 1,300 agents, and $3.1 billion in sales—that scale in Central PA, MD, WV, and VA comes from disciplined growth over decades.',
    },

    # Row 82: Anne Lusk
    82: {
        'K': 'Ranking among the top 100 agents out of 26,000 at Sotheby\'s for two consecutive years—after 25+ years serving the Roanoke Valley\'s luxury market—that consistent elite performance sets the standard.',
    },

    # Row 83: Ashley Brunner
    83: {
        'K': 'Licensed at 18, full-time since 2001, born into a developer family, and now CEO of KW Elite Lancaster—real estate is in your DNA. That background from development to sales to leadership is rare.',
    },

    # Row 84: Kit Hale
    84: {
        'K': 'Leading MKB since the three youngsters founded it in 1973—now Roanoke Valley\'s largest independent brokerage after 50 years. That longevity as an independent competing against national brands proves the model works.',
    },

    # Row 85: Damon Gettier
    85: {
        'K': 'Building Damon Gettier & Associates into Roanoke Valley\'s premier brokerage—$600M+ sold, 3,000+ homes closed—you have dominated your market through sheer production volume. That track record attracts top agents.',
    },

    # Row 86: Bob Johnson
    86: {
        'K': 'Founding RealStar in 1994 and maintaining that personal service standard for 30 years—while other brokerages have consolidated or franchised—independent conviction over the long term is rare.',
    },

    # Row 87: Wendy Moyer
    87: {
        'K': 'Leading Joyner Fine Properties as Principal Broker—a 50-year Richmond legacy with 7 offices, 180+ agents, and Virginia Credit Union backing—you bridge institutional history with modern resources.',
    },

    # Row 90: Ann Boggs
    90: {
        'K': 'Leading the largest Board of REALTORS in West Virginia since 2016—with MLS reach extending through Eastern and Central WV—your members were positioned perfectly for WV\'s #1 inbound migration ranking in 2024.',
    },

    # Row 91: Steve Scheib
    91: {
        'K': 'Building Weichert REALTORS First Choice in Central PA for 25 years—growing your team and serving the Harrisburg metro—that kind of tenure means you have seen every market condition and industry shift.',
    },

    # Row 92: Erica Rawls
    92: {
        'J': 'The Erica Rawls Team—14 years of Central PA dedication',
        'K': 'Building The Erica Rawls Team at Keller Williams over 14 years—serving the Harrisburg and Central PA market with consistency—that tenure through multiple market cycles builds real expertise.',
    },

    # Row 93: Mike Rohrbach
    93: {
        'K': 'Running Rohrbach Real Estate with Cindy since 1973—50 years of buying, selling, and managing properties in Lancaster County. Half a century of continuous operation as an independent is remarkable longevity.',
    },

    # Row 114: Becky Mobley
    114: {
        'K': 'Building Turf Town Properties since 1978—with ABR, CRS, and SRES credentials over 37 years—you have seen Lexington transform while maintaining focus on the unique equestrian market.',
    },

    # Row 125: Ryan Oyler
    125: {
        'K': 'Building the number one team at HUFF Realty for 16 consecutive years—with Steve Hines, serving Northern Kentucky—that sustained dominance comes from systems that actually work.',
    },

    # Row 126: Larry Kramer
    126: {
        'K': 'Operating the Keller Williams Northern Kentucky market center in Florence for over 20 years—building agents and serving the Cincinnati metro spillover market—you have trained a generation of NKY agents.',
    },

    # Row 128: Ken Perry
    128: {
        'K': 'Running an independent brokerage in Erlanger for over 35 years—when the national franchises have come and gone—that survival as an independent takes real conviction and client loyalty.',
    },

    # Row 146: Vic Coffey
    146: {
        'K': 'Earning RE/MAX Hall of Fame status and running one of the Roanoke Valley\'s most successful RE/MAX offices—your production over decades earned that recognition. Consistency beats flash.',
    },

    # Row 190: Sagar Ghimire
    190: {
        'K': 'Building Ghimire Homes from the ground up in Harrisburg—entrepreneurial real estate in a market dominated by established players. Starting your own brokerage takes real conviction.',
    },

    # Row 259: Dave Hooke
    259: {
        'K': 'Building a 20+ person team that has closed 2,500+ homes while giving $400K to community members in need—that combination of production and giving back shows what matters to you. Real impact beyond transactions.',
    },
}


def get_sheets_service():
    """Initialize Google Sheets API service."""
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_PATH, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)


def update_cell(service, row_num, col_letter, value):
    """Update a single cell."""
    range_name = f'Sheet1!{col_letter}{row_num}'
    body = {'values': [[value]]}

    service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='RAW',
        body=body
    ).execute()

    return range_name


def main():
    """Apply all fixes to CRM."""
    print("=" * 80)
    print("CRM FIX SCRIPT - APPLYING ALL FIXES")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 80)

    print("\nConnecting to Google Sheets...")
    service = get_sheets_service()

    # Track all changes for logging
    change_log = []

    print(f"\nApplying fixes to {len(FIXES)} rows...")

    for row_num, updates in sorted(FIXES.items()):
        print(f"\nRow {row_num}:")

        for col_letter, value in updates.items():
            range_name = update_cell(service, row_num, col_letter, value)

            # Truncate for display
            display_value = value[:60] + "..." if len(value) > 60 else value
            print(f"  {range_name}: {display_value}")

            change_log.append({
                'row': row_num,
                'column': col_letter,
                'range': range_name,
                'value': value
            })

    # Save change log
    log_file = '.tmp/crm_fix_log.json'
    with open(log_file, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_rows_modified': len(FIXES),
            'total_cells_modified': len(change_log),
            'changes': change_log
        }, f, indent=2)

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Rows modified: {len(FIXES)}")
    print(f"Cells modified: {len(change_log)}")
    print(f"Change log saved: {log_file}")
    print(f"Completed: {datetime.now().isoformat()}")

    # Print categorized summary
    print("\n" + "=" * 80)
    print("CHANGES BY CATEGORY")
    print("=" * 80)
    print("\nCRITICAL (Wrong Names Fixed):")
    print("  Row 260: Iron Valley Lancaster Team → Dan Zecher")
    print("  Row 261: Iron Valley Gettysburg Team → Walt Wensel")

    print("\nHIGH (Generic Email Fixed):")
    print("  Row 104: info@compass-pa.com → rwolman@compass-pa.com")

    print("\nTEMPLATE ROWS (Complete Rewrite):")
    print("  Row 263: Alex McCubbin - The Win Crew (D1 Sports → 37-person team)")
    print("  Row 270: Russell Daniels - Hillcrest (NKY since 2014, broker 2017)")

    print("\nGENERIC SUBJECTS (Rewrote):")
    print("  Row 3: Jakeeva Lee - GLAR")
    print("  Row 14: Scott Hack - Finish Line Realty")
    print("  Row 254: Tiffany Bullaj - House Broker Realty")

    print("\nGENERIC HOOK ENDINGS (Removed 'help you' patterns):")
    print("  40 rows updated with specific, factual endings")


if __name__ == '__main__':
    main()
