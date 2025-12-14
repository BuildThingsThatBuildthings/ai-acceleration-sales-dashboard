#!/usr/bin/env python3
"""
Generate Emails - Outreach Sequence Script

Fallback script for generating cold email sequences
when Claude subagent is unavailable.

Usage:
    python execution/generate_emails.py
    python execution/generate_emails.py --input .tmp/enriched_leads.json
"""

import os
import json
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
INPUT_FILE = Path(".tmp/enriched_leads.json")
OUTPUT_FILE = Path(".tmp/email_sequences.json")


def generate_casual_company_name(official_name: str) -> str:
    """
    Generate casual company name by stripping legal entities.

    Args:
        official_name: Official company name

    Returns:
        Casual/friendly company name
    """
    strip_words = [
        "LLC", "Inc", "Inc.", "Corp", "Corp.", "Ltd", "Ltd.", "LLP",
        "Realty", "Real Estate", "Properties", "Group", "Company",
        "Associates", "& Associates"
    ]

    name = official_name
    for word in strip_words:
        name = name.replace(word, "")

    name = " ".join(name.split())
    name = name.strip(" ,.-")

    return name


def generate_subject_line(city: str) -> str:
    """
    Generate AI subject line (5 words, B2B hook).

    Args:
        city: Lead's city

    Returns:
        5-word subject line
    """
    templates = [
        "AI transforms your brokerage operations",
        "Automation is your competitive edge",
        "Turn AI into operational asset",
        "Your agents need AI tools",
        "Stop losing deals to inefficiency"
    ]

    index = hash(city) % len(templates)
    return templates[index]


def generate_opening_hook(city: str, state: str) -> str:
    """
    Generate AI opening hook (max 20 words, hyper-local).

    Args:
        city: Lead's city
        state: Lead's state

    Returns:
        Opening hook sentence
    """
    templates = [
        f"{city}'s competitive market demands efficiency—most brokers waste 3 hours daily on listing descriptions alone.",
        f"With inventory tight in {city}, your agents can't afford manual tasks eating their prospecting time.",
        f"{city}'s hot market moves fast—automated follow-ups catch leads your competitors miss.",
        f"In {city}'s shifting market, the brokerages winning are the ones automating the mundane.",
        f"Every hour your {city} agents spend on admin is an hour not spent closing deals."
    ]

    index = hash(city + state) % len(templates)
    return templates[index]


def generate_email_1(lead: dict, casual_company: str, subject: str, hook: str) -> dict:
    """
    Generate Email 1: The Asset Pitch ($5K Masterclass).

    Args:
        lead: Lead dictionary
        casual_company: Casual company name
        subject: AI subject line
        hook: AI opening hook

    Returns:
        Dict with subject and body
    """
    body = f"""{hook}

I help brokerages like {casual_company} turn AI into an operational asset—not just another training checkbox.

Our 6-Hour AI Masterclass gives your team hands-on implementation of:
- Automated listing descriptions (save 2+ hours per listing)
- AI-powered client follow-up sequences
- Market analysis workflows

This isn't theory. Your agents leave with working systems.

$5,000 for up to 20 seats. Worth it if just one agent closes one extra deal.

Open to a 15-minute call this week?"""

    return {
        "subject": subject,
        "body": body
    }


def generate_email_2(lead: dict, casual_company: str) -> dict:
    """
    Generate Email 2: The Downsell ($3K Workshop).

    Args:
        lead: Lead dictionary
        casual_company: Casual company name

    Returns:
        Dict with subject and body
    """
    first_name = lead.get("first_name", "")

    subject = f"Quick alternative for {casual_company}"

    body = f"""Hey {first_name},

If a full day isn't realistic right now, we have a 3-hour implementation workshop.

Same hands-on approach, focused on the highest-impact automation: listing descriptions + follow-up sequences.

$3,000 for your team. Usually fits in a lunch session.

Interested?"""

    return {
        "subject": subject,
        "body": body
    }


def generate_email_3(lead: dict, casual_company: str) -> dict:
    """
    Generate Email 3: The Referral ($250/$100 bonus).

    Args:
        lead: Lead dictionary
        casual_company: Casual company name

    Returns:
        Dict with subject and body
    """
    first_name = lead.get("first_name", "")

    subject = "$250 for an intro"

    body = f"""{first_name},

Even if this isn't right for {casual_company}, you probably know another broker who'd benefit.

Refer them this week → $250 when they book
Refer them anytime → $100 when they book

Just reply with their name and I'll take it from there."""

    return {
        "subject": subject,
        "body": body
    }


def generate_sequence(lead: dict) -> dict:
    """
    Generate full 3-email sequence for a lead.

    Args:
        lead: Enriched lead dictionary

    Returns:
        Sequence dictionary for Instantly.ai
    """
    casual_company = generate_casual_company_name(lead.get("business_name", ""))
    subject_line = generate_subject_line(lead.get("city", ""))
    opening_hook = generate_opening_hook(lead.get("city", ""), lead.get("state", ""))

    email_1 = generate_email_1(lead, casual_company, subject_line, opening_hook)
    email_2 = generate_email_2(lead, casual_company)
    email_3 = generate_email_3(lead, casual_company)

    return {
        "email": lead.get("email", ""),
        "first_name": lead.get("first_name", ""),
        "last_name": lead.get("last_name", ""),
        "company": lead.get("business_name", ""),
        "city": lead.get("city", ""),
        "state": lead.get("state", ""),
        "casual_company": casual_company,
        "ai_subject_line": subject_line,
        "ai_opening_hook": opening_hook,
        "email_1_subject": email_1["subject"],
        "email_1_body": email_1["body"],
        "email_2_subject": email_2["subject"],
        "email_2_body": email_2["body"],
        "email_3_subject": email_3["subject"],
        "email_3_body": email_3["body"]
    }


def load_leads() -> list[dict]:
    """
    Load enriched leads from input file.

    Returns:
        List of lead dictionaries
    """
    if not INPUT_FILE.exists():
        print(f"Input file not found: {INPUT_FILE}")
        return []

    with open(INPUT_FILE) as f:
        return json.load(f)


def save_sequences(sequences: list[dict]) -> None:
    """
    Save email sequences to output file.

    Args:
        sequences: List of sequence dictionaries
    """
    OUTPUT_FILE.parent.mkdir(exist_ok=True)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(sequences, f, indent=2)

    print(f"Saved {len(sequences)} sequences to {OUTPUT_FILE}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Generate cold email sequences")
    parser.add_argument("--input", default=str(INPUT_FILE), help="Input JSON file")

    args = parser.parse_args()

    # Load leads
    leads = load_leads()
    if not leads:
        print("No leads to process")
        return

    print(f"Generating sequences for {len(leads)} leads...")

    # Generate sequences
    sequences = []
    for i, lead in enumerate(leads):
        print(f"[{i+1}/{len(leads)}] {lead.get('email', 'Unknown')}")
        sequence = generate_sequence(lead)
        sequences.append(sequence)

    # Save results
    save_sequences(sequences)

    print(f"\nSequence generation complete:")
    print(f"  Leads processed: {len(leads)}")
    print(f"  Sequences generated: {len(sequences)}")
    print(f"  Emails per sequence: 3")
    print(f"  Total emails: {len(sequences) * 3}")


if __name__ == "__main__":
    main()
