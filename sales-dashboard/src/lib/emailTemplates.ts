import { Lead } from './google';

export interface EmailSequence {
  lead: Lead;
  email1: GeneratedEmail;
  email2: GeneratedEmail;
  email3: GeneratedEmail;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  delay?: string;
}

export function generateEmailSequence(lead: Lead): EmailSequence {
  const firstName = lead.firstName || 'there';
  const company = lead.casualCompany || lead.company;

  // Email 1: Personalized Hook + Asset Pitch
  const email1: GeneratedEmail = {
    subject: lead.aiSubjectLine || `Quick question for ${company}`,
    body: `${lead.aiOpeningHook || `I came across ${company} and wanted to reach out.`}

I run AI workshops specifically for real estate brokerages—helping teams like yours cut 5-10 hours a week off admin tasks.

The 6-Hour Masterclass covers:
• AI-powered listing descriptions and marketing
• Automated follow-up systems
• Lead qualification workflows
• Fraud detection and risk management

Would you be open to a 15-minute call to see if this fits ${company}?

Best,
[Your Name]
AI Acceleration`,
  };

  // Email 2: Downsell (3-4 days later)
  const email2: GeneratedEmail = {
    subject: `Quick alternative for ${company}`,
    delay: '3 days',
    body: `Hey ${firstName},

Following up in case the full 6-hour workshop feels like a lot right now.

We also offer a 3-Hour Implementation Workshop that focuses on the highest-impact automations:
• One working AI system (not just theory)
• Ready-to-use prompt library
• Quick wins your team can apply Monday morning

Same results, half the time. Would that work better for ${company}?

Let me know and I'll send over details.

Best,
[Your Name]`,
  };

  // Email 3: Referral Ask (3-4 days later)
  const email3: GeneratedEmail = {
    subject: `$250 for an intro`,
    delay: '3 days',
    body: `${firstName},

Quick ask—even if this isn't for ${company}, do you know another brokerage that might benefit?

I'm offering $250 this week for any intro that books a call (or $100 anytime after).

No strings—just looking to connect with brokerages that are serious about AI adoption.

Worth a quick intro?

Thanks,
[Your Name]`,
  };

  return {
    lead,
    email1,
    email2,
    email3,
  };
}

export function generateInstantlyCSV(sequences: EmailSequence[]): string {
  // CSV header for Instantly.ai format
  const headers = [
    'email',
    'first_name',
    'last_name',
    'company_name',
    'custom_field_1', // Subject 1
    'custom_field_2', // Body 1
    'custom_field_3', // Subject 2
    'custom_field_4', // Body 2
    'custom_field_5', // Subject 3
    'custom_field_6', // Body 3
  ];

  const rows = sequences.map(seq => {
    return [
      seq.lead.email,
      seq.lead.firstName,
      seq.lead.lastName,
      seq.lead.casualCompany || seq.lead.company,
      seq.email1.subject,
      seq.email1.body.replace(/\n/g, '\\n'),
      seq.email2.subject,
      seq.email2.body.replace(/\n/g, '\\n'),
      seq.email3.subject,
      seq.email3.body.replace(/\n/g, '\\n'),
    ].map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
