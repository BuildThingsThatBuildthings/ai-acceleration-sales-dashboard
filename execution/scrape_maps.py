#!/usr/bin/env python3
"""
Scrape Maps - Lead Acquisition Script

Scrapes real estate brokerages using Firecrawl Search API.
Dynamically loads target cities from .tmp/target_cities.json

Usage:
    python execution/scrape_maps.py --city "Nashville" --state "TN"
    python execution/scrape_maps.py --all
"""

import os
import json
import argparse
import time
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1"

OUTPUT_DIR = Path(".tmp")
OUTPUT_FILE = OUTPUT_DIR / "scraped_leads.json"
TARGET_CITIES_FILE = OUTPUT_DIR / "target_cities.json"

# Query templates
QUERY_TEMPLATES = [
    "Real Estate Brokerage in {city}, {state}",
    "Real Estate Agency {city} {state}",
    "Realty company {city} {state}",
    "Commercial Real Estate {city} {state}"  
]

def load_target_cities():
    """Load target cities from JSON file."""
    if not TARGET_CITIES_FILE.exists():
        print(f"Error: {TARGET_CITIES_FILE} not found.")
        return []
    
    with open(TARGET_CITIES_FILE, 'r') as f:
        data = json.load(f)
        
    # extract from priority_order or the cities dict
    # priority_order is a list of strings like "Louisville KY"
    
    targets = []
    if "priority_order" in data:
        for item in data["priority_order"]:
            # item is "City ST" e.g. "Louisville KY", "Northern Kentucky KY"
            # We need to split carefully. Assuming last 2 chars are state.
            state = item[-2:]
            city = item[:-3].strip()
            targets.append({"city": city, "state": state})
            
    return targets

def scrape_with_firecrawl(query: str, limit: int = 30) -> list[dict]:
    """
    Search for businesses using Firecrawl Search API.

    Args:
        query: Search query string
        limit: Max results to return

    Returns:
        List of business dictionaries
    """
    if not FIRECRAWL_API_KEY:
        raise ValueError("FIRECRAWL_API_KEY not set in environment")

    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "query": query,
        "limit": limit,
        "country": "US",
        "scrapeOptions": {
            "formats": ["markdown"],
            "onlyMainContent": True
        }
    }

    try:
        response = requests.post(
            f"{FIRECRAWL_BASE_URL}/search",
            headers=headers,
            json=payload,
            timeout=60
        )

        if response.status_code == 200:
            data = response.json()
            results = data.get("data", [])
            print(f"  Found {len(results)} results")
            return results
        else:
            print(f"  Error: {response.status_code} - {response.text[:200]}")
            return []

    except requests.exceptions.RequestException as e:
        print(f"  Request failed: {e}")
        return []


def parse_firecrawl_result(result: dict, city: str, state: str) -> dict:
    """
    Parse a Firecrawl search result into a lead dictionary.

    Args:
        result: Firecrawl search result
        city: Target city
        state: Target state

    Returns:
        Lead dictionary with standardized fields
    """
    url = result.get("url", "")
    title = result.get("title", "")
    description = result.get("description", "")

    # Extract business name from title (often format: "Business Name - City | ...")
    business_name = title.split(" - ")[0].split(" | ")[0].strip()

    # Clean up the URL
    if url and not url.startswith(("http://", "https://")):
        url = "https://" + url

    return {
        "business_name": business_name,
        "website_url": url,
        "description": description,
        "city": city,
        "state": state,
        "source": "firecrawl_search",
        "scraped_at": datetime.now().isoformat()
    }


def validate_lead(lead: dict, target_states: list) -> bool:
    """
    Validate a scraped lead has required fields and match state.

    Args:
        lead: Lead dictionary
        target_states: List of valid state codes

    Returns:
        True if valid, False otherwise
    """
    required_fields = ["business_name", "website_url", "city", "state"]

    for field in required_fields:
        if not lead.get(field):
            return False

    # Validate website URL
    website = lead.get("website_url", "")
    if not website.startswith(("http://", "https://")):
        return False

    # Validate state matches strict list
    if lead.get("state") not in target_states:
        return False

    return True


def dedupe_leads(leads: list[dict]) -> list[dict]:
    """
    Remove duplicate leads by website URL.

    Args:
        leads: List of lead dictionaries

    Returns:
        Deduplicated list
    """
    seen_urls = set()
    unique_leads = []

    for lead in leads:
        url = lead.get("website_url", "").lower().rstrip("/")
        # Basic normalization
        url = url.replace("www.", "")
        
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_leads.append(lead)

    return unique_leads


def scrape_city(city: str, state: str) -> list[dict]:
    """
    Scrape all brokerages in a city.

    Args:
        city: City name
        state: State abbreviation

    Returns:
        List of lead dictionaries
    """
    print(f"\n=== Scraping {city}, {state} ===")
    leads = []

    for template in QUERY_TEMPLATES:
        query = template.format(city=city, state=state)

        results = scrape_with_firecrawl(query, limit=30)

        # Convert results to leads with correct city/state
        for result in results:
            lead = parse_firecrawl_result(result, city, state)
            if lead.get("website_url") and lead.get("business_name"):
                leads.append(lead)

        # Rate limiting between queries
        time.sleep(2)

    print(f"Found {len(leads)} total leads in {city}, {state}")
    return leads


def scrape_all_targets() -> list[dict]:
    """
    Scrape all target cities and states loaded from JSON.

    Returns:
        List of all scraped leads
    """
    targets = load_target_cities()
    if not targets:
        print("No targets found in target_cities.json")
        return []

    print(f"Loaded {len(targets)} cities to scrape.")
    
    all_leads = []

    for target in targets:
        leads = scrape_city(target["city"], target["state"])
        all_leads.extend(leads)

    print(f"\n=== Total: {len(all_leads)} leads across all cities ===")
    return all_leads


def save_leads(leads: list[dict]) -> None:
    """
    Save leads to JSON file.

    Args:
        leads: List of lead dictionaries
    """
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(exist_ok=True)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(leads, f, indent=2)

    print(f"\nSaved {len(leads)} leads to {OUTPUT_FILE}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Scrape real estate leads from Firecrawl")
    parser.add_argument("--city", help="Target city")
    parser.add_argument("--state", help="Target state (2-letter code)")
    parser.add_argument("--all", action="store_true", help="Scrape all target cities")

    args = parser.parse_args()

    # Determine targets
    leads = []
    
    # Get valid states from target file for validation
    targets = load_target_cities()
    valid_states = set(t["state"] for t in targets)
    # Add args state if provided
    if args.state:
        valid_states.add(args.state)

    if args.all:
        leads = scrape_all_targets()
    elif args.city and args.state:
        leads = scrape_city(args.city, args.state)
    else:
        print("Usage: python scrape_maps.py --city Nashville --state TN")
        print("       python scrape_maps.py --all")
        return

    # Validate and dedupe
    valid_leads = [l for l in leads if validate_lead(l, valid_states)]
    unique_leads = dedupe_leads(valid_leads)

    print(f"\nTotal scraped: {len(leads)}")
    print(f"Valid (Correct State): {len(valid_leads)}")
    print(f"After dedupe: {len(unique_leads)}")

    # Save results
    save_leads(unique_leads)


if __name__ == "__main__":
    main()
