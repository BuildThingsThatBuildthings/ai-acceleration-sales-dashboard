#!/usr/bin/env python3
"""
Research real estate leads (rows 121-170) from Google Sheet.
Fetch website content, extract decision maker info, and generate personalized messaging.
"""

import gspread
from google.oauth2.service_account import Credentials
import requests
from bs4 import BeautifulSoup
import re
import time
import sys
from urllib.parse import urlparse

# Configuration
SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit"
CREDENTIALS_FILE = "/Users/ryan/ai_acceleration/credentials.json"
START_ROW = 121
END_ROW = 170

# Column indices (0-based after headers)
COL_COMPANY_WEBSITE = None  # Will find dynamically
COL_DECISION_MAKER = None
COL_UNIQUE_HOOK = None
COL_BRAND_TAGLINE = None
COL_PAIN_POINT = None
COL_CUSTOM_SUBJECT = None
COL_CUSTOM_OPENER = None
COL_RESEARCH_STATUS = None

def setup_google_sheets():
    """Authenticate and open the Google Sheet."""
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]

    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    client = gspread.authorize(creds)

    # Extract sheet ID from URL
    sheet_id = SPREADSHEET_URL.split('/d/')[1].split('/')[0]
    sheet = client.open_by_key(sheet_id)
    worksheet = sheet.get_worksheet(0)  # First sheet

    return worksheet

def find_column_indices(worksheet):
    """Find column indices by header names."""
    global COL_COMPANY_WEBSITE, COL_DECISION_MAKER, COL_UNIQUE_HOOK
    global COL_BRAND_TAGLINE, COL_PAIN_POINT, COL_CUSTOM_SUBJECT
    global COL_CUSTOM_OPENER, COL_RESEARCH_STATUS

    headers = worksheet.row_values(1)

    col_map = {
        'companyWebsite': 'COL_COMPANY_WEBSITE',
        'decision_maker_name': 'COL_DECISION_MAKER',
        'unique_hook': 'COL_UNIQUE_HOOK',
        'brand_tagline': 'COL_BRAND_TAGLINE',
        'pain_point': 'COL_PAIN_POINT',
        'custom_subject': 'COL_CUSTOM_SUBJECT',
        'custom_opener': 'COL_CUSTOM_OPENER',
        'research_status': 'COL_RESEARCH_STATUS'
    }

    for idx, header in enumerate(headers):
        if header in col_map:
            globals()[col_map[header]] = idx

    print(f"Found columns: website={COL_COMPANY_WEBSITE}, decision_maker={COL_DECISION_MAKER}, status={COL_RESEARCH_STATUS}")

def fetch_website(url, timeout=10):
    """Fetch website content with error handling."""
    if not url or url.strip() == '':
        return None, "No URL provided"

    # Normalize URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        response.raise_for_status()
        return response.text, None
    except requests.exceptions.Timeout:
        return None, "Timeout"
    except requests.exceptions.ConnectionError:
        return None, "Connection failed"
    except requests.exceptions.HTTPError as e:
        return None, f"HTTP {e.response.status_code}"
    except Exception as e:
        return None, f"Error: {str(e)[:50]}"

def extract_text(html):
    """Extract clean text from HTML."""
    soup = BeautifulSoup(html, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style", "nav", "footer"]):
        script.decompose()

    text = soup.get_text()
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = ' '.join(chunk for chunk in chunks if chunk)

    return text

def find_decision_maker(html, text):
    """Extract decision maker name from website."""
    soup = BeautifulSoup(html, 'html.parser')

    # Common patterns for founder/CEO/owner
    patterns = [
        r'(?:founded by|founder|ceo|president|owner|broker)[:\s]+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)',
        r'([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)[,\s]+(?:founder|ceo|president|owner|broker)',
        r'(?:meet|about)\s+([A-Z][a-z]+)(?:\s+[A-Z][a-z]+)?,\s*(?:our\s+)?(?:founder|ceo|owner|broker)',
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            # Extract first name
            first_name = name.split()[0]
            if len(first_name) > 2 and first_name not in ['The', 'Our', 'Welcome']:
                return first_name

    # Look in meta tags
    for meta in soup.find_all('meta'):
        content = meta.get('content', '')
        if any(keyword in content.lower() for keyword in ['founder', 'ceo', 'owner']):
            match = re.search(r'([A-Z][a-z]+)', content)
            if match:
                return match.group(1)

    return None

def find_tagline(html, text):
    """Extract brand tagline or mission statement."""
    soup = BeautifulSoup(html, 'html.parser')

    # Check meta description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    if meta_desc and meta_desc.get('content'):
        desc = meta_desc['content'].strip()
        if 20 < len(desc) < 200:
            return desc[:150]

    # Look for taglines in headers
    for tag in ['h1', 'h2']:
        headers = soup.find_all(tag, limit=5)
        for header in headers:
            text_content = header.get_text().strip()
            if 10 < len(text_content) < 100 and not text_content.startswith(('Welcome', 'Home', 'About')):
                return text_content

    # Extract first meaningful paragraph
    paragraphs = soup.find_all('p', limit=10)
    for p in paragraphs:
        text_content = p.get_text().strip()
        if 30 < len(text_content) < 200:
            return text_content[:150]

    return None

def find_unique_hook(html, text):
    """Extract unique differentiators."""
    hooks = []

    # Years in business
    year_pattern = r'(?:since|established|founded in)\s+(\d{4})'
    match = re.search(year_pattern, text, re.IGNORECASE)
    if match:
        year = int(match.group(1))
        if 1950 < year < 2025:
            years = 2025 - year
            hooks.append(f"{years}+ years in business")

    # Awards
    if re.search(r'\b(?:award|recognition|certified|accredited)\b', text, re.IGNORECASE):
        hooks.append("award-winning")

    # Team size
    team_pattern = r'(\d+)\+?\s+(?:agents|realtors|team members|professionals)'
    match = re.search(team_pattern, text, re.IGNORECASE)
    if match:
        count = match.group(1)
        hooks.append(f"{count}+ person team")

    # Specialties
    specialty_keywords = ['luxury', 'commercial', 'residential', 'investment', 'waterfront', 'ranch']
    for keyword in specialty_keywords:
        if re.search(rf'\b{keyword}\b', text, re.IGNORECASE):
            hooks.append(f"{keyword} specialist")
            break

    return ", ".join(hooks[:2]) if hooks else None

def generate_subject_line(decision_maker, unique_hook):
    """Generate personalized subject line under 50 characters."""
    if not decision_maker:
        decision_maker = "there"

    subjects = []

    if unique_hook:
        if "award" in unique_hook.lower():
            subjects.append(f"{decision_maker} - award-winning team?")
        elif "years" in unique_hook:
            subjects.append(f"{decision_maker} - impressive longevity")
        elif "team" in unique_hook:
            subjects.append(f"{decision_maker} - scaling your team?")
        elif "specialist" in unique_hook:
            subjects.append(f"{decision_maker} - niche expertise?")

    if not subjects:
        subjects = [
            f"{decision_maker} - AI for real estate?",
            f"{decision_maker} - quick question",
            f"Noticed your site, {decision_maker}"
        ]

    # Pick shortest under 50 chars
    for subject in subjects:
        if len(subject) < 50:
            return subject

    return subjects[0][:49]

def generate_opener(decision_maker, unique_hook, tagline):
    """Generate personalized 1-2 sentence opener."""
    name = decision_maker if decision_maker else "there"

    openers = []

    if unique_hook:
        openers.append(f"Hi {name}, saw that you're {unique_hook}.")

    if tagline and len(tagline) < 100:
        snippet = tagline[:80] + "..." if len(tagline) > 80 else tagline
        openers.append(f"Noticed your mission: \"{snippet}\"")

    if not openers:
        openers.append(f"Hi {name}, came across your site and wanted to reach out.")

    return " ".join(openers[:2])

def research_lead(row_num, website_url):
    """Research a single lead and return extracted data."""
    print(f"\n[Row {row_num}] Researching: {website_url}")

    # Fetch website
    html, error = fetch_website(website_url)
    if error:
        print(f"  ❌ Failed: {error}")
        return {
            'research_status': f'Failed: {error}',
            'decision_maker_name': '',
            'unique_hook': '',
            'brand_tagline': '',
            'custom_subject': '',
            'custom_opener': ''
        }

    # Extract data
    text = extract_text(html)
    decision_maker = find_decision_maker(html, text)
    tagline = find_tagline(html, text)
    unique_hook = find_unique_hook(html, text)

    # Generate personalized content
    subject = generate_subject_line(decision_maker, unique_hook)
    opener = generate_opener(decision_maker, unique_hook, tagline)

    print(f"  ✓ Decision Maker: {decision_maker or 'Not found'}")
    print(f"  ✓ Hook: {unique_hook or 'None'}")
    print(f"  ✓ Subject: {subject}")
    print(f"  ✓ Opener: {opener[:60]}...")

    return {
        'research_status': 'Complete',
        'decision_maker_name': decision_maker or '',
        'unique_hook': unique_hook or '',
        'brand_tagline': tagline or '',
        'custom_subject': subject,
        'custom_opener': opener
    }

def update_sheet_row(worksheet, row_num, data):
    """Update a single row in the sheet."""
    updates = []

    if COL_DECISION_MAKER is not None:
        updates.append(gspread.Cell(row_num, COL_DECISION_MAKER + 1, data['decision_maker_name']))
    if COL_UNIQUE_HOOK is not None:
        updates.append(gspread.Cell(row_num, COL_UNIQUE_HOOK + 1, data['unique_hook']))
    if COL_BRAND_TAGLINE is not None:
        updates.append(gspread.Cell(row_num, COL_BRAND_TAGLINE + 1, data['brand_tagline']))
    if COL_CUSTOM_SUBJECT is not None:
        updates.append(gspread.Cell(row_num, COL_CUSTOM_SUBJECT + 1, data['custom_subject']))
    if COL_CUSTOM_OPENER is not None:
        updates.append(gspread.Cell(row_num, COL_CUSTOM_OPENER + 1, data['custom_opener']))
    if COL_RESEARCH_STATUS is not None:
        updates.append(gspread.Cell(row_num, COL_RESEARCH_STATUS + 1, data['research_status']))

    worksheet.update_cells(updates)

def main():
    """Main execution function."""
    print("=" * 60)
    print("Real Estate Lead Research: Rows 121-170")
    print("=" * 60)

    # Setup
    print("\n[1/3] Connecting to Google Sheet...")
    worksheet = setup_google_sheets()
    find_column_indices(worksheet)

    print(f"\n[2/3] Fetching existing data...")
    # Get all rows at once for efficiency
    all_rows = worksheet.get_all_values()

    # Statistics
    total = END_ROW - START_ROW + 1
    completed = 0
    failed = 0

    print(f"\n[3/3] Researching {total} leads (rows {START_ROW}-{END_ROW})...")
    print("-" * 60)

    for row_num in range(START_ROW, END_ROW + 1):
        try:
            # Get website URL (row_num is 1-indexed, array is 0-indexed)
            row_data = all_rows[row_num - 1]
            website_url = row_data[COL_COMPANY_WEBSITE] if COL_COMPANY_WEBSITE < len(row_data) else ''

            if not website_url or website_url.strip() == '':
                print(f"\n[Row {row_num}] ⊘ Skipping: No website URL")
                update_sheet_row(worksheet, row_num, {
                    'research_status': 'Failed: No URL',
                    'decision_maker_name': '',
                    'unique_hook': '',
                    'brand_tagline': '',
                    'custom_subject': '',
                    'custom_opener': ''
                })
                failed += 1
                continue

            # Research the lead
            data = research_lead(row_num, website_url)

            # Update the sheet
            update_sheet_row(worksheet, row_num, data)

            if data['research_status'] == 'Complete':
                completed += 1
            else:
                failed += 1

            # Rate limiting
            time.sleep(2)

        except Exception as e:
            print(f"\n[Row {row_num}] ❌ Error: {str(e)}")
            failed += 1
            try:
                update_sheet_row(worksheet, row_num, {
                    'research_status': f'Error: {str(e)[:50]}',
                    'decision_maker_name': '',
                    'unique_hook': '',
                    'brand_tagline': '',
                    'custom_subject': '',
                    'custom_opener': ''
                })
            except:
                pass
            continue

    # Final report
    print("\n" + "=" * 60)
    print("RESEARCH COMPLETE")
    print("=" * 60)
    print(f"Total Leads:     {total}")
    print(f"✓ Completed:     {completed} ({completed/total*100:.1f}%)")
    print(f"✗ Failed:        {failed} ({failed/total*100:.1f}%)")
    print("=" * 60)

if __name__ == "__main__":
    main()
