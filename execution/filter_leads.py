#!/usr/bin/env python3
"""
Filter Leads - Remove Aggregators and Clean Data

Filters scraped leads to remove aggregator sites, duplicates,
and cleans up business names.

Usage:
    python execution/filter_leads.py
    python execution/filter_leads.py --input .tmp/scraped_leads.json --output .tmp/clean_leads.json
"""

import json
import re
import argparse
from pathlib import Path

INPUT_FILE = Path(".tmp/scraped_leads.json")
OUTPUT_FILE = Path(".tmp/clean_leads.json")

# Aggregator domains to ALWAYS skip - these are NOT real brokerages
SKIP_DOMAINS = [
    # Major portals
    "realtor.com", "zillow.com", "homes.com", "redfin.com", "trulia.com",
    "realtor.ca", "homesnap.com", "homefinder.com",

    # Commercial aggregators
    "loopnet.com", "crexi.com", "costar.com", "commercialcafe.com",

    # Directories
    "apartments.com", "yellowpages.com", "yelp.com", "bbb.org",
    "manta.com", "superpages.com", "citysearch.com",

    # Social media
    "facebook.com", "linkedin.com", "instagram.com", "twitter.com",
    "tiktok.com", "youtube.com", "pinterest.com",

    # National franchise directories (not local offices)
    "compass.com/agents", "coldwellbanker.com/agent", "century21.com/real-estate-agent",
    "remax.com/real-estate-agents", "kw.com/agent", "sothebysrealty.com/agent",
    "bhhs.com/agent",  # National BHHS pages, not local offices

    # Agent rating sites
    "movoto.com", "estately.com", "fastexpert.com", "listwithclever.com",
    "homelight.com", "upnest.com", "ideal-agent.com", "clever.com",
    "homeguide.com", "thumbtack.com",

    # Job/company info sites
    "glassdoor.com", "indeed.com", "ziprecruiter.com",
    "usnews.com", "newsweek.com",

    # Government sites
    ".gov", "krec.ky.gov", "trec.texas.gov", "dre.ca.gov",

    # Corporate parent sites (not local brokerages)
    "anywhere.re", "realogy.com", "homeservicesofamerica.com",

    # Data aggregators
    "rocketreach.co", "zoominfo.com", "contactout.com", "datanyze.com",
    "lusha.com", "apollo.io",

    # News/media
    "bizjournals.com", "inman.com", "realtrends.com",
]

# Bad business name patterns to filter out
BAD_NAME_PATTERNS = [
    r"^Find Realtors",
    r"^Top Real Estate Agents",
    r"^Search for a Real Estate",
    r"^Best.*Realtors",
    r"^Real Estate Agents in",
    r"^\d+.*Best",
    r"Realtor & Real Estate Agent Reviews",
    r"Real Estate & Homes for Sale$",
]


def is_aggregator(url: str) -> bool:
    """Check if URL is from an aggregator domain."""
    url_lower = url.lower()
    for domain in SKIP_DOMAINS:
        if domain in url_lower:
            return True
    return False


def is_bad_business_name(name: str) -> bool:
    """Check if business name indicates an aggregator page."""
    for pattern in BAD_NAME_PATTERNS:
        if re.search(pattern, name, re.IGNORECASE):
            return True
    return False


def clean_business_name(name: str) -> str:
    """Clean up business name, removing cruft."""
    # Remove common suffixes that got scraped
    name = re.sub(r'\s*[-|:–]\s*.*$', '', name)  # Remove everything after dash/pipe
    name = re.sub(r'\s*\|\s*.*$', '', name)
    name = re.sub(r',\s*(LLC|Inc|Corp|Ltd|LLP)\.?$', '', name, flags=re.IGNORECASE)
    name = name.strip()
    return name


def dedupe_leads(leads: list[dict]) -> list[dict]:
    """Remove duplicate leads by website URL (case-insensitive)."""
    seen_urls = set()
    unique_leads = []

    for lead in leads:
        url = lead.get("website_url", "").lower().rstrip("/")
        # Normalize URL - remove www. prefix for comparison
        url_normalized = re.sub(r'^https?://(www\.)?', '', url)

        if url_normalized and url_normalized not in seen_urls:
            seen_urls.add(url_normalized)
            unique_leads.append(lead)

    return unique_leads


def main():
    parser = argparse.ArgumentParser(description="Filter and clean scraped leads")
    parser.add_argument("--input", default=str(INPUT_FILE), help="Input JSON file")
    parser.add_argument("--output", default=str(OUTPUT_FILE), help="Output JSON file")

    args = parser.parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f"Input file not found: {input_path}")
        return

    with open(input_path) as f:
        leads = json.load(f)

    print(f"Filtering {len(leads)} leads...")
    print("=" * 50)

    clean_leads = []
    skipped_aggregator = 0
    skipped_bad_name = 0

    for lead in leads:
        url = lead.get("website_url", "")
        name = lead.get("business_name", "")

        if not url:
            continue

        # Check if aggregator
        if is_aggregator(url):
            print(f"[SKIP - Aggregator] {url[:60]}")
            skipped_aggregator += 1
            continue

        # Check if bad business name
        if is_bad_business_name(name):
            print(f"[SKIP - Bad Name] {name[:50]}")
            skipped_bad_name += 1
            continue

        # Clean the business name
        lead["business_name"] = clean_business_name(name)
        clean_leads.append(lead)

    # Dedupe
    before_dedupe = len(clean_leads)
    clean_leads = dedupe_leads(clean_leads)
    duplicates_removed = before_dedupe - len(clean_leads)

    # Save output
    output_path.parent.mkdir(exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(clean_leads, f, indent=2)

    print("=" * 50)
    print(f"\nFiltering Summary:")
    print(f"  Input:              {len(leads)}")
    print(f"  Skipped aggregators: {skipped_aggregator}")
    print(f"  Skipped bad names:   {skipped_bad_name}")
    print(f"  Duplicates removed:  {duplicates_removed}")
    print(f"  Clean output:        {len(clean_leads)}")
    print(f"\nSaved to: {output_path}")


if __name__ == "__main__":
    main()
