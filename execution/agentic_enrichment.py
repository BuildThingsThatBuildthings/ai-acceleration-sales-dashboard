#!/usr/bin/env python3
"""
Agentic Enrichment - Deep Research & Decision Maker Extraction

Enriches clean leads by navigating their websites to find:
- Decision Maker (Owner/Principal/Broker)
- Contact Email
- Personalized Hook

Usage:
    python execution/agentic_enrichment.py --input .tmp/clean_leads.json --output .tmp/enriched_leads.json --limit 10
"""

import os
import json
import argparse
import time
import requests
from pathlib import Path
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed

# Load environment variables
load_dotenv()

FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1"

if not FIRECRAWL_API_KEY:
    raise ValueError("FIRECRAWL_API_KEY not set in environment")

# Prompt for Firecrawl Extraction
EXTRACT_SCHEMA = {
    "type": "object",
    "properties": {
        "decision_maker_name": {
            "type": "string",
            "description": "Full name of the Owner, President, Managing Broker, or Principal."
        },
        "decision_maker_title": {
            "type": "string", 
            "description": "Job title of the decision maker."
        },
        "decision_maker_email": {
            "type": "string",
            "description": "Email address of the decision maker (prefer personal over generic)."
        },
        "company_mission_short": {
            "type": "string",
            "description": "A very short (under 10 words) summary of what makes them unique."
        },
        "recent_achievement_or_news": {
            "type": "string",
            "description": "Any recent award, anniversary, or specific achievement mentioned."
        }
    },
    "required": ["decision_maker_name", "decision_maker_title"]
}

def enrich_single_lead(lead: dict) -> dict:
    """
    Enrich a single lead using Firecrawl /scrape with extract.
    """
    url = lead.get("website_url")
    if not url:
        return lead

    print(f"  Enriching: {lead.get('business_name')} ({url})...")
    
    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # We want to look at About/Team pages if possible, but Firecrawl /scrape 
    # usually handles the main page. For deep research, we might map first, 
    # but to save costs/time, we'll try the main page or /about if guessed.
    # A simple tactic: try the provided URL.
    
    payload = {
        "url": url,
        "formats": ["extract"],
        "extract": {
            "schema": EXTRACT_SCHEMA,
            "prompt": "Find the key decision maker (Owner, Broker, President) and a unique fact about the company."
        }
    }

    try:
        response = requests.post(
            f"{FIRECRAWL_BASE_URL}/scrape",
            headers=headers,
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            extract_data = data.get("data", {}).get("extract", {})
            
            # Merge extracted data into lead
            lead["decision_maker_name"] = extract_data.get("decision_maker_name", "")
            lead["decision_maker_title"] = extract_data.get("decision_maker_title", "")
            lead["decision_maker_email"] = extract_data.get("decision_maker_email", "")
            
            # Generate Hook Logic
            mission = extract_data.get("company_mission_short", "")
            news = extract_data.get("recent_achievement_or_news", "")
            city = lead.get("city", "your area")
            
            # Simple template-based hook generation (robust & deterministic)
            if news:
                hook = f"I saw the news about {news}."
                subject = f"Question about {news}"
            elif mission:
                hook = f"I love your focus on {mission}."
                subject = f"Idea for {lead.get('business_name')}"
            else:
                hook = f"I've been following the {city} market closely."
                subject = f"Partnership in {city}"
                
            lead["ai_opening_hook"] = hook
            lead["ai_subject_line"] = subject
            lead["enrichment_status"] = "success"
            
        else:
            print(f"    Failed: {response.status_code}")
            lead["enrichment_status"] = "failed_api"
            
    except Exception as e:
        print(f"    Error: {e}")
        lead["enrichment_status"] = "error"

    return lead

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=".tmp/clean_leads.json")
    parser.add_argument("--output", default=".tmp/enriched_leads.json")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of leads to process (0 for all)")
    args = parser.parse_args()
    
    input_path = Path(args.input)
    output_path = Path(args.output)
    
    if not input_path.exists():
        print(f"Input file not found: {input_path}")
        return
        
    with open(input_path) as f:
        leads = json.load(f)
        
    print(f"Loaded {len(leads)} leads.")
    
    # Slice if limit
    if args.limit > 0:
        leads = leads[:args.limit]
        print(f"Processing first {args.limit} leads...")
        
    enriched_leads = []
    
    # Parallel processing with rate limiting considerations
    # Firecrawl generic rate limits? 
    # Use max_workers=5 for safety.
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        future_to_lead = {executor.submit(enrich_single_lead, lead.copy()): lead for lead in leads}
        
        for future in as_completed(future_to_lead):
            new_lead = future.result()
            enriched_leads.append(new_lead)
            
            # Incremental save (optional, but good for safety)
            # For now, just print progress
            if len(enriched_leads) % 10 == 0:
                print(f"Processed {len(enriched_leads)}/{len(leads)}")

    # Save
    with open(output_path, "w") as f:
        json.dump(enriched_leads, f, indent=2)
        
    print(f"\nSaved {len(enriched_leads)} enriched leads to {output_path}")

if __name__ == "__main__":
    main()
