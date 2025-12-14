#!/usr/bin/env python3
"""
Scrape Firecrawl - Contact Enrichment Script

Fallback script for extracting decision-maker contacts from websites
when Firecrawl MCP is unavailable.

Usage:
    python execution/scrape_firecrawl.py
    python execution/scrape_firecrawl.py --input .tmp/scraped_leads.json
"""

import os
import json
import argparse
import argparse
import time
import random
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1"

INPUT_FILE = Path(".tmp/clean_leads.json")
OUTPUT_FILE = Path(".tmp/enriched_leads.json")

# Target pages to scrape for contacts (Reduced for efficiency)
CONTACT_PAGES = [
    "/about",
    "/our-team",
    "/team",
    "/contact"
]

# Target titles (ICP)
TARGET_TITLES = [
    "managing broker",
    "broker owner",
    "owner",
    "president",
    "association director",
    "education director",
    "office manager",
    "director of operations",
    "ceo",
    "principal broker"
]

# Generic emails to filter out
GENERIC_EMAILS = [
    "info@", "contact@", "support@", "hello@", "sales@",
    "admin@", "office@", "general@", "team@", "help@"
]

# Domains to skip (Aggregators/Directories)
SKIP_DOMAINS = [
    "realtor.com",
    "zillow.com",
    "homes.com",
    "redfin.com",
    "trulia.com",
    "loopnet.com",
    "apartments.com",
    "yellowpages.com",
    "yelp.com",
    "facebook.com",
    "linkedin.com",
    "instagram.com",
    "twitter.com",
    "compass.com",
    "coldwellbanker.com",
    "century21.com",
    "remax.com",
    "kw.com",
    "sothebysrealty.com",
    "movoto.com",
    "estately.com"
]


def make_request_with_backoff(url: str, headers: dict, json_payload: dict, max_retries: int = 5) -> requests.Response:
    """
    Make HTTP request with exponential backoff for rate limits.
    """
    retry_delay = 2
    for attempt in range(max_retries):
        try:
            response = requests.post(
                url,
                headers=headers,
                json=json_payload,
                timeout=120
            )

            if response.status_code == 429:
                print(f"    Rate limited (429). Waiting {retry_delay}s...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
                # Add jitter
                retry_delay += random.uniform(0, 1)
                continue

            if response.status_code >= 500:
                print(f"    Server error ({response.status_code}). Retrying...")
                time.sleep(retry_delay)
                retry_delay *= 1.5
                continue

            return response

        except requests.exceptions.RequestException as e:
            print(f"    Request failed: {e}")
            time.sleep(retry_delay)
            retry_delay *= 2

    return None


def firecrawl_scrape(url: str) -> dict:
    """
    Scrape a single URL using Firecrawl API.

    Args:
        url: URL to scrape

    Returns:
        Scraped content dict
    """
    if not FIRECRAWL_API_KEY:
        raise ValueError("FIRECRAWL_API_KEY not set in environment")

    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "url": url,
        "formats": ["markdown"],
        "onlyMainContent": True,
        "timeout": 30000
    }

    response = make_request_with_backoff(
        f"{FIRECRAWL_BASE_URL}/scrape",
        headers=headers,
        json_payload=payload
    )

    if response and response.status_code == 200:
        return response.json()
    elif response:
        print(f"Error scraping {url}: {response.status_code}")
        return {}
    else:
        return {}


def firecrawl_extract(url: str, schema: dict) -> dict:
    """
    Extract structured data from URL using Firecrawl.

    Args:
        url: URL to extract from
        schema: JSON schema for extraction

    Returns:
        Extracted data dict
    """
    if not FIRECRAWL_API_KEY:
        raise ValueError("FIRECRAWL_API_KEY not set in environment")

    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "url": url,
        "schema": schema,
        "prompt": "Extract the main decision maker (Owner/Broker/President). ALSO generate a short, friendly, conversational opening hook (under 20 words) for a cold email to them based on their bio or company news. Example: 'I saw you just opened a new office in X.' or 'Your focus on X is impressive.'"
    }

    response = make_request_with_backoff(
        f"{FIRECRAWL_BASE_URL}/extract",
        headers=headers,
        json_payload=payload
    )

    if response and response.status_code == 200:
        return response.json()
    elif response:
        print(f"Error extracting from {url}: {response.status_code}")
        return {}
    else:
        return {}


def is_generic_email(email: str) -> bool:
    """
    Check if email is a generic company email.

    Args:
        email: Email address

    Returns:
        True if generic, False if personal
    """
    email_lower = email.lower()
    return any(generic in email_lower for generic in GENERIC_EMAILS)


def is_target_title(title: str) -> bool:
    """
    Check if title matches ICP.

    Args:
        title: Job title

    Returns:
        True if matches ICP
    """
    title_lower = title.lower()
    return any(target in title_lower for target in TARGET_TITLES)


def enrich_lead(lead: dict) -> dict:
    """
    Enrich a single lead with contact information.

    Args:
        lead: Lead dictionary with website_url

    Returns:
        Enriched lead dictionary
    """
    website = lead.get("website_url", "")
    if not website:
        return lead

    # Ensure URL doesn't have trailing slash
    website = website.rstrip("/")

    # Check for skip domains
    for domain in SKIP_DOMAINS:
        if domain in website.lower():
            print(f"  Skipping aggregator: {domain}")
            return lead

    # Strategy: Scrape ONLY the homepage for reliability
    # generate hook from homepage content, find any email
    url = website
    print(f"  Scraping homepage: {url}")

    # Contact extraction schema
    contact_schema = {
        "type": "object",
        "properties": {
            "contacts": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "email": {"type": "string"},
                        "ai_opening_hook": {"type": "string", "description": "A personalized, friendly (non-salesy) opening sentence for a cold email based on the homepage content."}
                    }
                }
            }
        }
    }
    
    payload = {
        "url": url,
        "schema": contact_schema,
        "prompt": "Extract any contact email found. ALSO generate a friendly opening hook based on the homepage text."
    }

    try:
        data = firecrawl_extract(url, contact_schema)
        
        if data and "contacts" in data.get("data", {}):
            contacts = data["data"]["contacts"]
            if contacts:
                # Take the first contact
                contact = contacts[0]
                lead["email"] = contact.get("email", "")
                lead["ai_opening_hook"] = contact.get("ai_opening_hook", "")
                # Preserve existing data if missing
                if not lead.get("first_name"):
                    lead["first_name"] = "Partner" 
                
                return lead

    except Exception as e:
        print(f"  Error: {e}")

    return lead


def load_leads() -> list[dict]:
    """
    Load scraped leads from input file.

    Returns:
        List of lead dictionaries
    """
    if not INPUT_FILE.exists():
        print(f"Input file not found: {INPUT_FILE}")
        return []

    with open(INPUT_FILE) as f:
        return json.load(f)


def save_enriched_leads(leads: list[dict]) -> None:
    """
    Save enriched leads to output file.

    Args:
        leads: List of enriched lead dictionaries
    """
    OUTPUT_FILE.parent.mkdir(exist_ok=True)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(leads, f, indent=2)

    print(f"\nSaved {len(leads)} enriched leads to {OUTPUT_FILE}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Enrich leads with contact information")
    parser.add_argument("--input", default=str(INPUT_FILE), help="Input JSON file")

    args = parser.parse_args()

    # Load leads
    leads = load_leads()
    if not leads:
        print("No leads to process")
        return

    print(f"Processing {len(leads)} leads...")

    # Enrich each lead
    enriched_leads = []
    for i, lead in enumerate(leads):
        print(f"\n[{i+1}/{len(leads)}] {lead.get('business_name', 'Unknown')}")

        enriched = enrich_lead(lead)

        # Only keep leads that were successfully enriched
        if enriched.get("email"):
            enriched_leads.append(enriched)
            print(f"  ✓ Found: {enriched.get('first_name')} {enriched.get('last_name')} ({enriched.get('email')})")
        else:
            print(f"  ✗ No contact found")

    # Save results
    save_enriched_leads(enriched_leads)

    print(f"\nEnrichment complete:")
    print(f"  Input: {len(leads)}")
    print(f"  Enriched: {len(enriched_leads)}")
    print(f"  Rate: {len(enriched_leads)/len(leads)*100:.1f}%")


if __name__ == "__main__":
    main()
