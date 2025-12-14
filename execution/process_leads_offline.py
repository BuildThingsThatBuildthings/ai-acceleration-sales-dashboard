
import json
from pathlib import Path

INPUT_FILE = Path(".tmp/clean_leads.json")
OUTPUT_FILE = Path(".tmp/enriched_leads.json")

# Manually enriched leads (The "Gold" Standard)
MANUAL_LEADS = {
    "Semonin Realtors": {
        "email": "stacydurbin@homeservices.com",
        "first_name": "Stacy",
        "last_name": "Durbin",
        "title": "President",
        "hook": "Leading three major brokerages across KY, IN, and OH is no small feat—Semonin, Huff, and Rector Hayden."
    },
    "Louisville KY Real Estate": { # Homepage Realty
        "email": "George@HomepageRealtyKY.com",
        "first_name": "George",
        "last_name": "Barrett",
        "title": "Owner",
        "hook": "Your rapid growth with the 'Homepage' brand in Louisville has been impressive to watch."
    },
    "Joe Hayden Real Estate": {
        "email": "joe@joehaydenrealtor.com",
        "first_name": "Joe",
        "last_name": "Hayden",
        "title": "Owner",
        "hook": "You've built one of the strongest personal brands in Louisville real estate."
    },
    "White Picket Real Estate": {
        "email": "kyle@whitepicketky.com",
        "first_name": "Kyle",
        "last_name": "Elmore",
        "title": "Founder",
        "hook": "From healthcare finance to top 5 Louisville realtor—impressive pivot, Kyle."
    },
    "Schuler Bauer Real Estate Services": {
        "email": "kurtschuler@schulerbauer.com",
        "first_name": "Kurt",
        "last_name": "Schuler",
        "title": "Owner",
        "hook": "Navigating the leadership shift to the next generation at Schuler Bauer is a huge moment."
    }
}

def clean_description(desc):
    """Clean up description to get the key value prop"""
    if not desc:
        return ""
    # Remove generic prefixes
    bad_starts = ["Explore homes", "View homes", "Search homes", "Find homes"]
    for start in bad_starts:
        if desc.startswith(start):
            return desc
    return desc

def generate_offline_hook(lead):
    """Generate a friendly hook from available metadata"""
    name = lead.get("business_name", "")
    city = lead.get("city", "Louisville")
    desc = lead.get("description", "")
    
    # 1. Check for manual override (Gold Standard)
    if name in MANUAL_LEADS:
        return MANUAL_LEADS[name]["hook"]
        
    # 2. Logic for Homepage Realty if missed by key match
    if "homepage" in lead.get("website_url", "").lower():
         return MANUAL_LEADS["Louisville KY Real Estate"]["hook"]

    # 3. Generate from Description (Silver Standard)
    if desc:
        # Check for specific keywords
        if "commercial" in desc.lower():
            return f"I see {name} is doing heavy lifting in the {city} commercial space—that's a tough market to master."
        if "luxury" in desc.lower():
            return f"The luxury portfolio at {name} stands out in the {city} market."
        if "property management" in desc.lower():
            return f"Handling property management in {city} is a beast—kudos to the {name} team for keeping it running."
        if "family" in desc.lower() or "family-owned" in desc.lower():
             return f"Love that {name} is keeping the family-owned tradition alive in {city}."
             
    # 4. Fallback (Bronze Standard - but still friendly/conversational)
    return f"I've been following the {city} market and {name} keeps popping up on my radar."

def main():
    if not INPUT_FILE.exists():
        print("Input file missing")
        return

    with open(INPUT_FILE) as f:
        leads = json.load(f)

    enriched_leads = []
    print(f"Processing {len(leads)} leads offline...")

    for lead in leads:
        name = lead.get("business_name", "")
        
        # Merge Manual Info
        manual = MANUAL_LEADS.get(name)
        if not manual and "homepage" in lead.get("website_url", "").lower():
             manual = MANUAL_LEADS["Louisville KY Real Estate"]

        if manual:
            lead["first_name"] = manual["first_name"]
            lead["last_name"] = manual["last_name"]
            lead["email"] = manual["email"]
            lead["title"] = manual["title"]
            lead["ai_opening_hook"] = manual["hook"]
            lead["ai_subject_line"] = f"Question for {manual['first_name']}"
        else:
            # Generate Offline
            lead["ai_opening_hook"] = generate_offline_hook(lead)
            lead["first_name"] = "Partner" # Generic
            lead["ai_subject_line"] = f"Quick question about {name}"

        enriched_leads.append(lead)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(enriched_leads, f, indent=2)
    
    print(f"Enriched {len(enriched_leads)} leads successfully.")

if __name__ == "__main__":
    main()
