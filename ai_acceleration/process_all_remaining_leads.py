#!/usr/bin/env python3
"""
Process ALL remaining leads in the Google Sheet.
Identifies unprocessed rows and researches them in batches.
"""

import gspread
from google.oauth2.service_account import Credentials
import requests
from bs4 import BeautifulSoup
import re
import time
import json
import sys
from datetime import datetime

# Configuration
SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1sEI4U6YVczVG8ybR-k-IhE023B2DusvIVHN1iPw5Fy0/edit"
CREDENTIALS_FILE = "/Users/ryan/ai_acceleration/credentials.json"

# Batch configuration
BATCH_SIZE = 50
DELAY_BETWEEN_REQUESTS = 1.5  # seconds

class LeadResearcher:
    def __init__(self):
        self.worksheet = None
        self.headers = []
        self.col_indices = {}
        self.results = []

    def setup(self):
        """Connect to Google Sheets."""
        print("Connecting to Google Sheet...")
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
        client = gspread.authorize(creds)
        sheet_id = SPREADSHEET_URL.split('/d/')[1].split('/')[0]
        sheet = client.open_by_key(sheet_id)
        self.worksheet = sheet.get_worksheet(0)

        # Get headers and find column indices
        self.headers = self.worksheet.row_values(1)
        important_cols = [
            'companyName', 'companyWebsite', 'Email', 'First Name', 'Last Name',
            'decision_maker_name', 'unique_hook', 'brand_tagline', 'pain_point',
            'custom_subject', 'custom_opener', 'research_status', 'linkedIn'
        ]
        for col in important_cols:
            try:
                self.col_indices[col] = self.headers.index(col)
            except ValueError:
                pass

        print(f"Connected! Found {len(self.headers)} columns")
        return True

    def get_unprocessed_rows(self):
        """Find all rows that haven't been processed yet."""
        print("Scanning for unprocessed leads...")
        all_data = self.worksheet.get_all_values()

        unprocessed = []
        status_col = self.col_indices.get('research_status')
        website_col = self.col_indices.get('companyWebsite')

        for i, row in enumerate(all_data[1:], start=2):  # Skip header, 1-indexed rows
            # Get research status
            status = row[status_col] if status_col and status_col < len(row) else ''
            website = row[website_col] if website_col and website_col < len(row) else ''

            # Consider unprocessed if no status or status is empty
            if not status or status.strip() == '' or status == 'Pending':
                unprocessed.append({
                    'row': i,
                    'website': website.strip() if website else '',
                    'row_data': row
                })

        print(f"Found {len(unprocessed)} unprocessed leads")
        return unprocessed

    def fetch_website(self, url, timeout=12):
        """Fetch website content with multiple strategies."""
        if not url or url.strip() == '':
            return None, "No URL"

        # Clean URL
        url = url.strip()
        if 'utm_' in url:
            url = url.split('?')[0]
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url

        # Try different user agents
        user_agents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ]

        for ua in user_agents:
            try:
                headers = {
                    'User-Agent': ua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
                response = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
                if response.status_code == 200:
                    return response.text, None
                elif response.status_code == 403:
                    continue  # Try next user agent
                else:
                    return None, f"HTTP {response.status_code}"
            except requests.exceptions.Timeout:
                return None, "Timeout"
            except requests.exceptions.ConnectionError:
                return None, "Connection failed"
            except Exception as e:
                return None, f"Error: {str(e)[:30]}"

        return None, "HTTP 403 Blocked"

    def extract_info(self, html, url):
        """Extract all relevant info from website."""
        soup = BeautifulSoup(html, 'html.parser')

        # Remove noise
        for tag in soup(['script', 'style', 'nav', 'footer', 'iframe']):
            tag.decompose()

        text = soup.get_text(separator=' ', strip=True)
        text = re.sub(r'\s+', ' ', text)

        info = {
            'decision_maker': self._find_decision_maker(soup, text),
            'tagline': self._find_tagline(soup, text),
            'unique_hook': self._find_hooks(text),
        }

        return info

    def _find_decision_maker(self, soup, text):
        """Extract owner/founder/agent name."""
        patterns = [
            r'(?:founded by|founder|ceo|president|owner|broker|realtor)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)[,\s]+(?:founder|ceo|president|owner|broker|realtor)',
            r'(?:meet|about|hello[,]?\s+i\'?m)\s+([A-Z][a-z]+)',
            r'(?:contact|call|email)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
        ]

        exclude_words = {'The', 'Our', 'Welcome', 'Home', 'About', 'Contact', 'Real',
                        'Search', 'Find', 'Buy', 'Sell', 'Team', 'Group', 'Office',
                        'Lancaster', 'Pennsylvania', 'Properties', 'Realty', 'Estate'}

        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                name = match.strip().split()[0]
                if len(name) > 2 and name not in exclude_words:
                    return name

        # Try title tag
        title = soup.find('title')
        if title:
            title_text = title.get_text()
            # Look for "Name - Company" or "Name | Company" patterns
            match = re.match(r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-|]', title_text)
            if match:
                name = match.group(1).split()[0]
                if name not in exclude_words:
                    return name

        return None

    def _find_tagline(self, soup, text):
        """Find company tagline or mission."""
        # Check meta description
        meta = soup.find('meta', attrs={'name': 'description'})
        if meta and meta.get('content'):
            desc = meta['content'].strip()
            if 20 < len(desc) < 200:
                return desc[:150]

        # Check og:description
        og_desc = soup.find('meta', property='og:description')
        if og_desc and og_desc.get('content'):
            desc = og_desc['content'].strip()
            if 20 < len(desc) < 200:
                return desc[:150]

        # Look in h1/h2
        for tag in ['h1', 'h2']:
            headers = soup.find_all(tag, limit=3)
            for h in headers:
                text_content = h.get_text(strip=True)
                if 15 < len(text_content) < 100:
                    skip_words = ['search', 'find', 'browse', 'welcome', 'menu']
                    if not any(w in text_content.lower() for w in skip_words):
                        return text_content

        return None

    def _find_hooks(self, text):
        """Find unique differentiators."""
        hooks = []

        # Years in business
        year_patterns = [
            r'(?:since|established|founded|serving since)\s+(\d{4})',
            r'(\d{4})\s*-\s*present',
            r'over\s+(\d+)\+?\s*years',
            r'(\d+)\+?\s*years\s+(?:of\s+)?experience',
        ]
        for pattern in year_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                val = match.group(1)
                if val.isdigit():
                    if int(val) > 1950:
                        years = 2025 - int(val)
                        if years > 0:
                            hooks.append(f"{years}+ years experience")
                    elif int(val) > 0 and int(val) < 100:
                        hooks.append(f"{val}+ years experience")
                break

        # Awards/recognition
        if re.search(r'\b(?:award|hall of fame|top producer|#\d|ranked|certified|accredited)\b', text, re.IGNORECASE):
            hooks.append("award-winning")

        # Team size
        team_match = re.search(r'(\d+)\+?\s*(?:agents|realtors|team members|professionals|associates)', text, re.IGNORECASE)
        if team_match:
            count = int(team_match.group(1))
            if count > 1:
                hooks.append(f"{count}+ agent team")

        # Specialties
        specialties = {
            'luxury': 'luxury specialist',
            'commercial': 'commercial real estate',
            'investment': 'investment properties',
            'first.?time': 'first-time buyer specialist',
            'relocation': 'relocation specialist',
            'military': 'military relocation',
            'bilingual|spanish|habla': 'bilingual services',
        }
        for pattern, label in specialties.items():
            if re.search(rf'\b{pattern}\b', text, re.IGNORECASE):
                hooks.append(label)
                break

        # Transaction volume
        vol_match = re.search(r'(?:sold|closed)\s+(\d+)\+?\s*(?:homes|properties|transactions)', text, re.IGNORECASE)
        if vol_match:
            count = int(vol_match.group(1))
            if count >= 50:
                hooks.append(f"{count}+ transactions")

        return ", ".join(hooks[:3]) if hooks else None

    def generate_personalization(self, info, company_name):
        """Generate subject line and opener."""
        name = info['decision_maker'] or 'there'
        hook = info['unique_hook']
        tagline = info['tagline']

        # Subject line (under 50 chars)
        if hook:
            if 'award' in hook.lower():
                subject = f"{name} - award-winning approach?"
            elif 'years' in hook:
                subject = f"{name} - impressive track record?"
            elif 'team' in hook:
                subject = f"{name} - growing your team?"
            elif 'luxury' in hook:
                subject = f"{name} - luxury market question"
            elif 'specialist' in hook.lower():
                subject = f"{name} - your niche expertise?"
            else:
                subject = f"{name} - quick question for you"
        else:
            subject = f"{name} - quick question for you"

        # Ensure under 50 chars
        if len(subject) >= 50:
            subject = f"{name} - quick question"[:49]

        # Opener (1-2 sentences)
        opener_parts = []
        if hook:
            opener_parts.append(f"Hi {name}, I noticed you're {hook}.")
        elif tagline:
            snippet = tagline[:70] + "..." if len(tagline) > 70 else tagline
            opener_parts.append(f"Hi {name}, I came across your site and loved the mission: \"{snippet}\"")
        else:
            opener_parts.append(f"Hi {name}, I came across your real estate business and wanted to reach out.")

        opener = " ".join(opener_parts)

        return {
            'custom_subject': subject,
            'custom_opener': opener[:300]
        }

    def research_lead(self, row_info):
        """Research a single lead."""
        row_num = row_info['row']
        website = row_info['website']
        row_data = row_info['row_data']

        company_col = self.col_indices.get('companyName', 0)
        company_name = row_data[company_col] if company_col < len(row_data) else 'Unknown'

        print(f"  Row {row_num}: {company_name[:40]}...", end=" ", flush=True)

        if not website:
            print("❌ No URL")
            return {
                'row': row_num,
                'research_status': 'Failed: No URL',
                'decision_maker_name': '',
                'unique_hook': '',
                'brand_tagline': '',
                'custom_subject': '',
                'custom_opener': ''
            }

        # Fetch website
        html, error = self.fetch_website(website)
        if error:
            print(f"❌ {error}")
            return {
                'row': row_num,
                'research_status': f'Failed: {error}',
                'decision_maker_name': '',
                'unique_hook': '',
                'brand_tagline': '',
                'custom_subject': '',
                'custom_opener': ''
            }

        # Extract info
        info = self.extract_info(html, website)
        personalization = self.generate_personalization(info, company_name)

        status = "Complete" if info['unique_hook'] or info['decision_maker'] else "Complete (basic)"
        print(f"✓ {info['decision_maker'] or 'No name'} | {(info['unique_hook'] or 'No hook')[:30]}")

        return {
            'row': row_num,
            'research_status': status,
            'decision_maker_name': info['decision_maker'] or '',
            'unique_hook': info['unique_hook'] or '',
            'brand_tagline': info['tagline'] or '',
            'custom_subject': personalization['custom_subject'],
            'custom_opener': personalization['custom_opener']
        }

    def update_sheet_batch(self, results):
        """Update multiple rows in the sheet at once."""
        if not results:
            return

        cells_to_update = []

        col_map = {
            'decision_maker_name': self.col_indices.get('decision_maker_name'),
            'unique_hook': self.col_indices.get('unique_hook'),
            'brand_tagline': self.col_indices.get('brand_tagline'),
            'custom_subject': self.col_indices.get('custom_subject'),
            'custom_opener': self.col_indices.get('custom_opener'),
            'research_status': self.col_indices.get('research_status'),
        }

        for result in results:
            row_num = result['row']
            for field, col_idx in col_map.items():
                if col_idx is not None and field in result:
                    cells_to_update.append(
                        gspread.Cell(row_num, col_idx + 1, result[field])
                    )

        if cells_to_update:
            self.worksheet.update_cells(cells_to_update)

    def process_batch(self, rows, batch_num, total_batches):
        """Process a batch of leads."""
        print(f"\n{'='*60}")
        print(f"BATCH {batch_num}/{total_batches} - Processing {len(rows)} leads")
        print(f"{'='*60}")

        results = []
        for row_info in rows:
            result = self.research_lead(row_info)
            results.append(result)
            self.results.append(result)
            time.sleep(DELAY_BETWEEN_REQUESTS)

        # Update sheet with batch results
        print(f"\nUpdating Google Sheet with {len(results)} results...")
        self.update_sheet_batch(results)

        # Calculate stats
        complete = sum(1 for r in results if r['research_status'].startswith('Complete'))
        failed = len(results) - complete
        print(f"Batch complete: {complete} successful, {failed} failed")

        return results

    def run(self, start_row=None, end_row=None):
        """Main execution."""
        print("="*60)
        print("LEAD RESEARCH PROCESSOR")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)

        # Setup
        self.setup()

        # Get unprocessed rows
        unprocessed = self.get_unprocessed_rows()

        # Filter by row range if specified
        if start_row or end_row:
            unprocessed = [
                r for r in unprocessed
                if (start_row is None or r['row'] >= start_row) and
                   (end_row is None or r['row'] <= end_row)
            ]
            print(f"Filtered to {len(unprocessed)} leads in range {start_row}-{end_row}")

        if not unprocessed:
            print("\n✓ All leads have been processed!")
            return

        # Process in batches
        total_batches = (len(unprocessed) + BATCH_SIZE - 1) // BATCH_SIZE

        for i in range(0, len(unprocessed), BATCH_SIZE):
            batch = unprocessed[i:i + BATCH_SIZE]
            batch_num = (i // BATCH_SIZE) + 1
            self.process_batch(batch, batch_num, total_batches)

            # Pause between batches to avoid rate limiting
            if batch_num < total_batches:
                print("\nPausing 5 seconds before next batch...")
                time.sleep(5)

        # Final report
        print("\n" + "="*60)
        print("FINAL REPORT")
        print("="*60)

        total = len(self.results)
        complete = sum(1 for r in self.results if r['research_status'].startswith('Complete'))
        failed = total - complete

        print(f"Total Processed:  {total}")
        print(f"✓ Completed:      {complete} ({complete/total*100:.1f}%)")
        print(f"✗ Failed:         {failed} ({failed/total*100:.1f}%)")

        # Save results to JSON
        output_file = f"/Users/ryan/ai_acceleration/research_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"\nResults saved to: {output_file}")

        # List failed rows
        failed_rows = [r for r in self.results if not r['research_status'].startswith('Complete')]
        if failed_rows:
            print(f"\nFailed rows ({len(failed_rows)}):")
            for r in failed_rows[:20]:
                print(f"  Row {r['row']}: {r['research_status']}")
            if len(failed_rows) > 20:
                print(f"  ... and {len(failed_rows) - 20} more")


def main():
    researcher = LeadResearcher()

    # Parse command line args for row range
    start_row = None
    end_row = None

    if len(sys.argv) >= 2:
        start_row = int(sys.argv[1])
    if len(sys.argv) >= 3:
        end_row = int(sys.argv[2])

    researcher.run(start_row=start_row, end_row=end_row)


if __name__ == "__main__":
    main()
