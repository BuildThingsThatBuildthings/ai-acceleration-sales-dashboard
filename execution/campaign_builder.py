#!/usr/bin/env python3
"""
Campaign Builder - Full Drip Campaign System

Creates multi-sequence email campaigns with A/B testing support.
Outputs formatted for Instantly.ai, Smartlead, or CSV export.

Sequences:
  A: Personalized Hook (requires deep research - subject line + hook from CRM)
  B: Pain-Point Based (universal hooks - works without heavy personalization)

Usage:
    python execution/campaign_builder.py --sequence A
    python execution/campaign_builder.py --sequence B
    python execution/campaign_builder.py --sequence AB  # A/B test both
    python execution/campaign_builder.py --export instantly
"""

import os
import json
import csv
import argparse
from datetime import datetime
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Configuration
CRM_EXPORT_FILE = Path(".tmp/crm_export.json")
OUTPUT_DIR = Path(".tmp/campaigns")


# ============================================================================
# SEQUENCE A: Personalized Hook Approach
# Requires: AI Subject Line + AI Opening Hook from CRM (manual research)
# ============================================================================

SEQUENCE_A = {
    "name": "personalized_hook",
    "description": "Deep research approach - uses CRM-researched subject lines and hooks",
    "emails": [
        {
            "step": 1,
            "delay_days": 0,
            "name": "asset_pitch",
            "subject": "{{ai_subject_line}}",
            "body": """{{ai_opening_hook}}

I help brokerages like {{casual_company}} turn AI into an operational asset—not just another training checkbox.

Our 6-Hour AI Masterclass gives your team hands-on implementation:
- Automated listing descriptions (save 2+ hours per listing)
- AI-powered client follow-up sequences
- Market analysis that used to take days

This isn't theory. Your agents leave with working systems.

$5,000 for up to 20 seats. Worth it if one agent closes one extra deal.

Open to a 15-minute call this week?

Ryan"""
        },
        {
            "step": 2,
            "delay_days": 3,
            "name": "downsell",
            "subject": "Quick alternative for {{casual_company}}",
            "body": """{{first_name}},

If a full day isn't realistic right now, we have a 3-hour implementation workshop.

Same hands-on approach, focused on highest-impact automation:
- Listing descriptions
- Follow-up sequences

$3,000 for your team. Usually fits in a lunch session.

Interested?

Ryan"""
        },
        {
            "step": 3,
            "delay_days": 4,
            "name": "referral",
            "subject": "$250 for an intro",
            "body": """{{first_name}},

Even if this isn't right for {{casual_company}} right now, you probably know another broker who'd benefit.

Refer them this week → $250 when they book
Refer them later → $100 when they book

Just reply with their name and I'll handle the rest.

Ryan"""
        }
    ]
}


# ============================================================================
# SEQUENCE B: Pain-Point Based Approach
# Works without deep research - uses universal pain points with stats
# ============================================================================

SEQUENCE_B = {
    "name": "pain_point",
    "description": "Universal pain points - works without heavy personalization",
    "emails": [
        {
            "step": 1,
            "delay_days": 0,
            "name": "lead_response",
            "subject": "your agents are probably losing deals right now",
            "body": """Hey {{first_name}},

Quick question - how fast do your agents respond to new leads?

The stat that keeps coming up in my conversations with brokers: agents who respond in 5 minutes are 100x more likely to connect than those who wait 30 minutes.

Most agents take hours. Some take days. That's money walking out the door while they're showing houses or eating lunch.

AI can draft a response before they finish reading the notification. Takes the "what do I say" delay out of the equation.

Is slow lead response something you're running into?

Ryan"""
        },
        {
            "step": 2,
            "delay_days": 4,
            "name": "tech_adoption",
            "subject": "RE: your agents are probably losing deals right now",
            "body": """Hey {{first_name}},

Following up - one other thing I keep hearing from broker/owners:

They've spent money on tech. CRM, AI tools, automation. But half their agents still do everything manually.

The 2024 Delta survey put it at 55% of brokers saying "agent tech adoption" is a top challenge. Up from 39% last year.

The problem usually isn't the tools - it's that nobody showed agents what to actually DO with them. That's fixable.

Would it be useful if I shared what's working for other brokerages on this?

Ryan"""
        },
        {
            "step": 3,
            "delay_days": 4,
            "name": "breakup",
            "subject": "should I close your file?",
            "body": """{{first_name}},

I've reached out a couple times about AI training for {{casual_company}}.

Haven't heard back, which is totally fine - you're busy running a brokerage.

If AI training isn't a priority right now, just let me know and I'll close out your file. No hard feelings.

But if it's just timing, happy to circle back in a few months.

Either way, let me know?

Ryan"""
        }
    ]
}


# ============================================================================
# SEQUENCE C: Hybrid - Personalized opener + Pain point follow-ups
# ============================================================================

SEQUENCE_C = {
    "name": "hybrid",
    "description": "Personalized Email 1, pain-point follow-ups",
    "emails": [
        {
            "step": 1,
            "delay_days": 0,
            "name": "personalized_opener",
            "subject": "{{ai_subject_line}}",
            "body": """{{ai_opening_hook}}

I help brokerages like {{casual_company}} turn AI into an operational asset—not just another training checkbox.

Quick question - how fast do your agents respond to new leads? The 5-minute rule is real: agents who respond in 5 minutes are 100x more likely to connect.

AI can handle that first response instantly. Takes "what do I say" out of the equation.

Worth a quick call to see if it fits your setup?

Ryan"""
        },
        {
            "step": 2,
            "delay_days": 4,
            "name": "tech_adoption",
            "subject": "one other thing for {{casual_company}}",
            "body": """Hey {{first_name}},

Following up on my note about AI training.

One stat that keeps coming up: 55% of brokers say "agent tech adoption" is a top challenge. Up from 39% last year.

You've probably spent money on tools. The problem is nobody showed your agents what to actually DO with them.

That's what hands-on training fixes. Not theory—building the workflows in the room.

Would a 15-minute call be useful to see if this fits?

Ryan"""
        },
        {
            "step": 3,
            "delay_days": 4,
            "name": "referral_breakup",
            "subject": "$250 if you know someone",
            "body": """{{first_name}},

I'll keep this short since I haven't heard back.

Even if AI training isn't right for {{casual_company}} right now, you probably know another broker who'd benefit.

Refer them this week → $250 when they book
Refer them anytime → $100 when they book

Just reply with a name if anyone comes to mind.

Ryan"""
        }
    ]
}


SEQUENCES = {
    "A": SEQUENCE_A,
    "B": SEQUENCE_B,
    "C": SEQUENCE_C
}


# ============================================================================
# Quality Validation
# ============================================================================

def validate_lead_for_sequence(lead: dict, sequence_name: str) -> tuple[bool, list[str]]:
    """
    Validate a lead has required data for the sequence.

    Returns:
        Tuple of (is_valid, list of issues)
    """
    issues = []

    # Universal requirements
    if not lead.get("email"):
        issues.append("Missing email address")

    if not lead.get("first_name") or lead.get("first_name", "").lower() in ["partner", "team", "info", "contact"]:
        issues.append(f"Invalid first name: '{lead.get('first_name', 'MISSING')}'")

    # Check for personal email (not info@, contact@, etc.)
    email = lead.get("email", "")
    generic_prefixes = ["info@", "contact@", "hello@", "admin@", "support@", "sales@"]
    if any(email.lower().startswith(prefix) for prefix in generic_prefixes):
        issues.append(f"Generic email address: {email}")

    # Sequence A and C require personalization
    if sequence_name in ["A", "C"]:
        subject = lead.get("ai_subject_line", "")
        hook = lead.get("ai_opening_hook", "")

        if not subject:
            issues.append("Missing AI Subject Line (required for sequence A/C)")
        elif any(generic in subject.lower() for generic in ["quick question", "[company]", "[city]", "template"]):
            issues.append(f"Generic subject line detected: '{subject}'")

        if not hook:
            issues.append("Missing AI Opening Hook (required for sequence A/C)")
        elif any(generic in hook.lower() for generic in ["shifting market", "competitive market", "i've been following"]):
            issues.append(f"Generic hook detected (first 50 chars): '{hook[:50]}...'")

    return len(issues) == 0, issues


def generate_casual_name(official_name: str) -> str:
    """Strip legal entities and create casual company name."""
    strip_words = [
        "LLC", "Inc", "Inc.", "Corp", "Corp.", "Ltd", "Ltd.", "LLP",
        "Realty", "Real Estate", "Properties", "Group", "Company",
        "Associates", "& Associates", "Brokerage", "Services"
    ]

    name = official_name
    for word in strip_words:
        name = name.replace(word, "")

    name = " ".join(name.split()).strip(" ,.-")
    return name if name else official_name


def render_template(template: str, lead: dict) -> str:
    """Replace template variables with lead data."""
    casual = lead.get("casual_company") or generate_casual_name(lead.get("company", ""))

    replacements = {
        "{{first_name}}": lead.get("first_name", ""),
        "{{last_name}}": lead.get("last_name", ""),
        "{{email}}": lead.get("email", ""),
        "{{company}}": lead.get("company", ""),
        "{{casual_company}}": casual,
        "{{city}}": lead.get("city", ""),
        "{{state}}": lead.get("state", ""),
        "{{ai_subject_line}}": lead.get("ai_subject_line", ""),
        "{{ai_opening_hook}}": lead.get("ai_opening_hook", ""),
    }

    result = template
    for var, value in replacements.items():
        result = result.replace(var, str(value))

    return result


# ============================================================================
# Campaign Generation
# ============================================================================

def build_campaign(leads: list[dict], sequence_name: str, validate: bool = True) -> dict:
    """
    Build a campaign for the given sequence.

    Returns:
        Campaign dict with valid leads, invalid leads, and rendered emails
    """
    sequence = SEQUENCES[sequence_name]

    valid_leads = []
    invalid_leads = []

    for lead in leads:
        is_valid, issues = validate_lead_for_sequence(lead, sequence_name)

        if validate and not is_valid:
            invalid_leads.append({
                "lead": lead,
                "issues": issues
            })
        else:
            # Render emails for this lead
            rendered_emails = []
            for email_template in sequence["emails"]:
                rendered = {
                    "step": email_template["step"],
                    "delay_days": email_template["delay_days"],
                    "name": email_template["name"],
                    "subject": render_template(email_template["subject"], lead),
                    "body": render_template(email_template["body"], lead)
                }
                rendered_emails.append(rendered)

            valid_leads.append({
                "lead": lead,
                "emails": rendered_emails
            })

    return {
        "sequence": sequence_name,
        "sequence_info": {
            "name": sequence["name"],
            "description": sequence["description"],
            "email_count": len(sequence["emails"])
        },
        "generated_at": datetime.now().isoformat(),
        "stats": {
            "total_leads": len(leads),
            "valid_leads": len(valid_leads),
            "invalid_leads": len(invalid_leads)
        },
        "valid_leads": valid_leads,
        "invalid_leads": invalid_leads
    }


# ============================================================================
# Export Formats
# ============================================================================

def export_instantly_csv(campaign: dict, output_path: Path) -> None:
    """
    Export campaign to Instantly.ai CSV format.

    Instantly expects:
    - email (required)
    - first_name, last_name, company_name (personalization)
    - Custom fields for multi-step sequences
    """
    rows = []

    for item in campaign["valid_leads"]:
        lead = item["lead"]
        emails = item["emails"]

        row = {
            "email": lead.get("email", ""),
            "first_name": lead.get("first_name", ""),
            "last_name": lead.get("last_name", ""),
            "company_name": lead.get("company", ""),
            "city": lead.get("city", ""),
            "state": lead.get("state", ""),
        }

        # Add each email step
        for email in emails:
            step = email["step"]
            row[f"email_{step}_subject"] = email["subject"]
            row[f"email_{step}_body"] = email["body"]

        rows.append(row)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if rows:
        fieldnames = list(rows[0].keys())
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    print(f"Exported {len(rows)} leads to {output_path}")


def export_smartlead_csv(campaign: dict, output_path: Path) -> None:
    """
    Export campaign to Smartlead CSV format.
    Similar to Instantly but uses different field names.
    """
    rows = []

    for item in campaign["valid_leads"]:
        lead = item["lead"]
        emails = item["emails"]

        row = {
            "Email": lead.get("email", ""),
            "First Name": lead.get("first_name", ""),
            "Last Name": lead.get("last_name", ""),
            "Company": lead.get("company", ""),
            "City": lead.get("city", ""),
            "State": lead.get("state", ""),
        }

        for email in emails:
            step = email["step"]
            row[f"Subject {step}"] = email["subject"]
            row[f"Body {step}"] = email["body"]

        rows.append(row)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if rows:
        fieldnames = list(rows[0].keys())
        with open(output_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    print(f"Exported {len(rows)} leads to {output_path}")


def export_json(campaign: dict, output_path: Path) -> None:
    """Export full campaign data as JSON."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(campaign, f, indent=2)

    print(f"Exported campaign JSON to {output_path}")


# ============================================================================
# Load Leads from CRM Export
# ============================================================================

def load_leads_from_crm_export() -> list[dict]:
    """Load leads from CRM export JSON file."""
    if not CRM_EXPORT_FILE.exists():
        print(f"CRM export not found: {CRM_EXPORT_FILE}")
        print("Run: python execution/export_from_sheets.py first")
        return []

    with open(CRM_EXPORT_FILE) as f:
        return json.load(f)


def load_leads_from_json(path: Path) -> list[dict]:
    """Load leads from any JSON file."""
    if not path.exists():
        print(f"File not found: {path}")
        return []

    with open(path) as f:
        return json.load(f)


# ============================================================================
# Main
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description="Build email campaigns with A/B testing")
    parser.add_argument(
        "--sequence", "-s",
        choices=["A", "B", "C", "AB", "ABC"],
        default="A",
        help="Sequence to generate (A=personalized, B=pain-point, C=hybrid, AB/ABC=A/B test)"
    )
    parser.add_argument(
        "--input", "-i",
        type=Path,
        default=CRM_EXPORT_FILE,
        help="Input JSON file with leads"
    )
    parser.add_argument(
        "--export", "-e",
        choices=["instantly", "smartlead", "json", "all"],
        default="all",
        help="Export format"
    )
    parser.add_argument(
        "--no-validate",
        action="store_true",
        help="Skip validation (not recommended)"
    )
    parser.add_argument(
        "--show-invalid",
        action="store_true",
        help="Show details of invalid leads"
    )

    args = parser.parse_args()

    # Load leads
    leads = load_leads_from_json(args.input)
    if not leads:
        print("No leads to process")
        return

    print(f"Loaded {len(leads)} leads from {args.input}")

    # Determine which sequences to generate
    if args.sequence == "AB":
        sequence_names = ["A", "B"]
    elif args.sequence == "ABC":
        sequence_names = ["A", "B", "C"]
    else:
        sequence_names = [args.sequence]

    # Generate campaigns
    for seq_name in sequence_names:
        print(f"\n{'='*60}")
        print(f"Building Sequence {seq_name}: {SEQUENCES[seq_name]['name']}")
        print(f"{'='*60}")

        campaign = build_campaign(leads, seq_name, validate=not args.no_validate)

        # Print stats
        stats = campaign["stats"]
        print(f"\nResults:")
        print(f"  Valid leads: {stats['valid_leads']}/{stats['total_leads']}")
        print(f"  Invalid leads: {stats['invalid_leads']}")

        if args.show_invalid and campaign["invalid_leads"]:
            print(f"\nInvalid leads:")
            for item in campaign["invalid_leads"][:5]:  # Show first 5
                lead = item["lead"]
                print(f"  - {lead.get('email', 'No email')}")
                for issue in item["issues"]:
                    print(f"      {issue}")
            if len(campaign["invalid_leads"]) > 5:
                print(f"  ... and {len(campaign['invalid_leads']) - 5} more")

        # Export
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name = f"campaign_{seq_name}_{timestamp}"

        if args.export in ["json", "all"]:
            export_json(campaign, OUTPUT_DIR / f"{base_name}.json")

        if args.export in ["instantly", "all"]:
            export_instantly_csv(campaign, OUTPUT_DIR / f"{base_name}_instantly.csv")

        if args.export in ["smartlead", "all"]:
            export_smartlead_csv(campaign, OUTPUT_DIR / f"{base_name}_smartlead.csv")

    print(f"\nCampaign files saved to {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
