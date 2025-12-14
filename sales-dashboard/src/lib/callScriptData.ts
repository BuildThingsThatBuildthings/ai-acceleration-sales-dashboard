// CLOSER Framework - Structured Data for UI
// Based on Alex Hormozi's sales methodology

export interface CLOSERStage {
  id: string;
  letter: string;
  name: string;
  goal: string;
  duration: string;
  scripts: string[];
  prompts?: string[];
  tips?: string[];
}

export interface VacationStatement {
  pain: string;
  vacation: string;
}

export interface PreFrameCard {
  objection: string;
  preFrame: string;
  fullResponse: string;
}

export interface TimeSavings {
  task: string;
  before: string;
  after: string;
  savings: string;
}

export interface ROIData {
  hoursPerWeek: number;
  agents: number;
  annualValue: number;
}

// The 6 CLOSER Stages
export const CLOSER_STAGES: CLOSERStage[] = [
  {
    id: 'clarify',
    letter: 'C',
    name: 'CLARIFY',
    goal: 'Understand their world before proposing anything',
    duration: '60 sec',
    scripts: [
      `Hey [First Name], [read personalized hook].
Quick question for you—

When you think about your agents' productivity,
what's the one thing eating up most of their time right now?`
    ],
    prompts: [
      'Walk me through what happens when an agent gets a new listing.',
      'How long does that typically take them?',
      'What have you tried to speed that up?',
      'How many agents do you have on your team?',
      "What's your biggest bottleneck—marketing, operations, or productivity?"
    ],
    tips: [
      'Listen for hours lost per agent per week',
      'Get their team size for ROI math',
      'Note specific pain points for later'
    ]
  },
  {
    id: 'label',
    letter: 'L',
    name: 'LABEL',
    goal: 'Name their problem so they feel understood',
    duration: '30 sec',
    scripts: [
      `So if I'm hearing you right, your agents are spending
[X hours] on [specific task] that should take [Y minutes].

That's [X × agents × 52] hours a year going to admin instead of deals.
That's the bottleneck, right?`
    ],
    tips: [
      'Use their exact words back to them',
      'Quantify the problem with real math',
      'Pause after the question—let them confirm'
    ]
  },
  {
    id: 'overview',
    letter: 'O',
    name: 'OVERVIEW',
    goal: 'Understand why previous solutions failed',
    duration: '30 sec',
    scripts: [
      `What have you tried before?

Most brokerages I talk to have either:
- Done nothing and hoped it would figure itself out
- Tried ChatGPT and got garbage output
- Bought software that no one actually uses

Where do you fall?`
    ],
    prompts: [
      'If "nothing": What\'s held you back?',
      'If "tried ChatGPT": What went wrong?',
      'If "bought software": What didn\'t stick?',
      'If "had training": What didn\'t translate to action?'
    ],
    tips: [
      'This positions you as someone who understands',
      'Tailor your vacation pitch to their specific failure'
    ]
  },
  {
    id: 'sell-vacation',
    letter: 'S',
    name: 'SELL VACATION',
    goal: 'Paint the outcome, not the process',
    duration: '60 sec',
    scripts: [
      `Imagine it's Monday after the workshop.

Your agents open their laptops, type 3 sentences about a listing,
and get back a description that used to take 45 minutes.
They copy-paste it into MLS and move on.

That's the 5-hour-a-week savings. Every week. Forever.

The workshop is one day. The results are permanent.`
    ],
    tips: [
      'DON\'T say: "We do a 6-hour workshop with prompts..."',
      'DO say: What their Monday morning looks like',
      'Focus on transformation, not features'
    ]
  },
  {
    id: 'explain',
    letter: 'E',
    name: 'EXPLAIN',
    goal: 'Address concerns before they become objections',
    duration: '45 sec',
    scripts: [
      `Now, you're probably thinking one of three things:

1. 'My agents won't actually use it.'
   — They will, because they build it themselves.

2. 'We've tried training before and it didn't stick.'
   — This isn't a webinar. They leave with working systems.

3. 'Is this worth $5K?'
   — If 10 agents save 5 hours a week, that's $60K in productivity year one.
   That's 12:1 ROI.

Which one were you thinking?`
    ],
    tips: [
      'Pre-frame the top 3 concerns proactively',
      'End with a question to surface the real objection',
      'Don\'t be defensive—be curious'
    ]
  },
  {
    id: 'reinforce',
    letter: 'R',
    name: 'REINFORCE',
    goal: 'Make them close themselves',
    duration: '30 sec',
    scripts: [
      `Based on what you told me—[restate their pain],
this would give you [restate vacation].

Does that sound like something worth exploring on a 15-minute call?`
    ],
    prompts: [
      'If YES: "Great. I\'ve got [Day 1] or [Day 2]—which works better?"',
      'If HESITANT: "Can I send you the curriculum? If it makes sense, we\'ll find 15 minutes."',
      'If NO: "Do you know any other brokerages in [City] who might benefit?"'
    ],
    tips: [
      'Use their exact words for pain and vacation',
      'Give two specific date options',
      'Always ask for a referral if they say no'
    ]
  }
];

// Vacation Statements by Pain
export const VACATION_STATEMENTS: VacationStatement[] = [
  { pain: 'Time on listings', vacation: '45 minutes → 5 minutes. Every listing.' },
  { pain: 'Follow-up chaos', vacation: 'Never forget a follow-up again.' },
  { pain: 'New agent ramp', vacation: 'New agents producing like veterans in week one.' },
  { pain: 'Tech overwhelm', vacation: 'One system that does 10 things.' },
  { pain: 'Agent adoption', vacation: 'They build it themselves, so they actually use it.' },
  { pain: 'Training that doesn\'t stick', vacation: 'They leave with working systems, not notes.' },
  { pain: 'Competitive pressure', vacation: 'Your agents outpace the competition.' },
  { pain: 'Admin burnout', vacation: '5-10 hours back every week, forever.' }
];

// Pre-Frame Objection Cards
export const PRE_FRAME_CARDS: PreFrameCard[] = [
  {
    objection: 'Too expensive',
    preFrame: 'Most people think $5K is high until they do the math...',
    fullResponse: `Most people think $5K is high until they do the math.
10 agents × 5 hours × $50/hour × 52 weeks = $130K in recovered time.
The workshop is 4% of that. It pays for itself in the first month.`
  },
  {
    objection: 'Agents won\'t use it',
    preFrame: 'Every brokerage worries about adoption...',
    fullResponse: `Every brokerage worries about adoption. That's why they build it live.
If you build it, you use it. They don't leave with notes—they leave with working systems.`
  },
  {
    objection: 'Already using AI',
    preFrame: 'Using vs. using well are different...',
    fullResponse: `Using vs. using well are different. Most agents tried ChatGPT once,
got garbage output, and quit. We turn the toy into a teammate.
What tools are they using now?`
  },
  {
    objection: 'Need to think about it',
    preFrame: 'Totally fair. What specifically would help you decide?',
    fullResponse: `Totally fair. What specifically would help you decide?
Is it the price, the timing, or something about how it works?`
  },
  {
    objection: 'Send me info',
    preFrame: 'Happy to. Quick question first...',
    fullResponse: `Happy to. Quick question—are you open to on-site training if the curriculum fits?
I don't want to waste your time with a PDF if this isn't a fit.`
  },
  {
    objection: 'Bad timing',
    preFrame: 'I hear you. When would be better?',
    fullResponse: `I hear you. When would be a better time to revisit this?
I can set a reminder and follow up then.`
  },
  {
    objection: 'Already had training',
    preFrame: 'What didn\'t translate to action?',
    fullResponse: `Most training doesn't stick because it's theory, not practice.
Our agents build working systems live. They use them Monday morning.
What didn't translate to action last time?`
  },
  {
    objection: 'My agents are too old/resistant',
    preFrame: 'We\'ve trained agents in their 60s...',
    fullResponse: `We've trained agents in their 60s who'd never opened ChatGPT.
They leave confident. The system is designed for non-tech people.
If they can copy-paste, they can use this.`
  }
];

// Time Savings Examples
export const TIME_SAVINGS: TimeSavings[] = [
  { task: 'Listing description', before: '45 min', after: '5 min', savings: '40 min' },
  { task: 'Follow-up email', before: '15 min', after: '2 min', savings: '13 min' },
  { task: 'Social media post', before: '20 min', after: '3 min', savings: '17 min' },
  { task: 'Market report', before: '60 min', after: '10 min', savings: '50 min' },
  { task: 'Open house invite', before: '30 min', after: '5 min', savings: '25 min' },
  { task: 'Newsletter content', before: '90 min', after: '15 min', savings: '75 min' }
];

// ROI Quick Reference
export const ROI_TABLE: ROIData[] = [
  { hoursPerWeek: 5, agents: 5, annualValue: 15000 },
  { hoursPerWeek: 5, agents: 10, annualValue: 30000 },
  { hoursPerWeek: 5, agents: 20, annualValue: 60000 },
  { hoursPerWeek: 5, agents: 50, annualValue: 150000 },
  { hoursPerWeek: 10, agents: 10, annualValue: 60000 },
  { hoursPerWeek: 10, agents: 20, annualValue: 120000 },
  { hoursPerWeek: 10, agents: 50, annualValue: 300000 }
];

// Calculate ROI dynamically
export function calculateROI(hoursPerWeek: number, agents: number, hourlyRate: number = 50): {
  monthlyValue: number;
  annualValue: number;
  roi: number;
  paybackMonths: number;
} {
  const workshopCost = 5000;
  const monthlyValue = hoursPerWeek * 4 * hourlyRate * agents;
  const annualValue = monthlyValue * 12;
  const roi = Math.round((annualValue / workshopCost) * 100) / 100;
  const paybackMonths = Math.ceil(workshopCost / monthlyValue);

  return {
    monthlyValue,
    annualValue,
    roi,
    paybackMonths
  };
}

// Hours Lost Calculator
export function calculateHoursLost(hoursPerWeek: number, agents: number): {
  weekly: number;
  monthly: number;
  annual: number;
} {
  const weekly = hoursPerWeek * agents;
  const monthly = weekly * 4;
  const annual = weekly * 52;

  return { weekly, monthly, annual };
}

// Conviction Statements
export const CONVICTION_STATEMENTS = [
  'I know this works because I\'ve seen it work.',
  'The math is simple. It either makes sense or it doesn\'t.',
  'I\'m not here to convince you. I\'m here to see if it fits.',
  'If this doesn\'t help your agents, I want to know why.',
  'The workshop is one day. The results are permanent.'
];

// Tonality Red Flags
export const TONALITY_RED_FLAGS = [
  'Talking more than 40% of the call',
  'Answering questions they didn\'t ask',
  'Defending instead of clarifying',
  'Rushing to the close',
  'Using filler words (um, like, you know)'
];

// Credibility Anchors
export const CREDIBILITY_ANCHORS = [
  'We\'ve trained 50+ brokerages in the region.',
  'Average agent saves 5-10 hours per week.',
  '97% say they\'d recommend to another brokerage.',
  'Agents who complete the workshop use AI daily.',
  'ROI is typically 6:1 in year one.'
];

// =========================================
// BECKER HIGH-TICKET POSITIONING (Added v4)
// =========================================

// High-Ticket Mindset Statements (Becker Method)
export interface MindsetFrame {
  oldFrame: string;
  newFrame: string;
}

export const HIGH_TICKET_MINDSET: MindsetFrame[] = [
  { oldFrame: "I'm trying to get them to buy", newFrame: "I'm here to see if they qualify" },
  { oldFrame: "$5K is expensive, I need to justify it", newFrame: "The price is fair for the value—no apology needed" },
  { oldFrame: "Every lead is a potential customer", newFrame: "Not every lead is a fit—and that's fine" },
  { oldFrame: "I hope they say yes", newFrame: "I'm helping them make the right decision either way" },
  { oldFrame: "I'm interrupting their day", newFrame: "I'm offering value, not asking for a favor" }
];

// Qualification Questions (Becker-style early disqualification)
export interface QualificationQuestion {
  question: string;
  disqualifyIf: string;
  transitionOut: string;
}

export const QUALIFICATION_QUESTIONS: QualificationQuestion[] = [
  {
    question: "How many agents do you have on your team?",
    disqualifyIf: "Solo agent or < 5 agents (no leverage)",
    transitionOut: "Got it. Honestly, this is designed for larger teams—the ROI really kicks in at 10+ agents. Do you know any larger brokerages in the area who might benefit?"
  },
  {
    question: "When it comes to a $5K investment in training, who would need to weigh in?",
    disqualifyIf: "Not decision maker AND can't connect you",
    transitionOut: "Makes sense. Would it be helpful if I spoke with [decision maker] directly? I can make sure they have the right info."
  },
  {
    question: "Just so I don't waste your time—this workshop is $5,000. Is that something you'd consider if the curriculum fits?",
    disqualifyIf: "Clear 'no budget' with no path forward",
    transitionOut: "Understood. We also have a 3-hour option at $3,000 if that's more realistic. Or I can follow up next quarter when budgets reset. What makes more sense?"
  }
];

// Timeline Urgency Statements (Becker: FOMO > Fear of Spending)
export const TIMELINE_URGENCY = [
  "AI is moving fast. Six months from now, this is table stakes.",
  "The brokerages training their agents NOW will have a head start. The ones waiting will be playing catch-up.",
  "Your competitors are adopting AI. The question is whether you want to lead or follow.",
  "Every week you wait is another week your agents lose 5+ hours to admin.",
  "The best time to train was last year. The second best time is now."
];

// Consultant Close Language (Becker-style)
export interface CloseVariant {
  name: string;
  language: string;
  whenToUse: string;
}

export const CONSULTANT_CLOSES: CloseVariant[] = [
  {
    name: "Selection Close",
    language: "Based on what you've shared, I think you'd be a good fit for this. The question is whether the timing works on your end.",
    whenToUse: "When they're clearly a fit and you want to flip the dynamic"
  },
  {
    name: "Scarcity Close",
    language: "I have two spots left this quarter. If the curriculum makes sense after our next call, I can hold one for you.",
    whenToUse: "When you have legitimate scarcity to leverage"
  },
  {
    name: "Assumptive Close",
    language: "Great. I've got Tuesday or Thursday. Which works better for a follow-up call?",
    whenToUse: "Strong buying signals, don't over-explain"
  },
  {
    name: "Referral Pivot",
    language: "Appreciate your time. Do you know any other brokerages in [City] who might benefit? I'm offering $250 for any intro that books a call.",
    whenToUse: "When they say no—extract value anyway"
  }
];

// Daily Affirmations (Combined Hormozi + Becker)
export const DAILY_AFFIRMATIONS = [
  "I have something valuable. I'm here to see if they qualify.",
  "The math is simple. It either makes sense or it doesn't.",
  "Every 'no' gets me closer to 'yes.'",
  "I'm helping, not selling.",
  "Conviction corrects tonality.",
  "The workshop is one day. The results are permanent.",
  "I've done this before. I'll do it again. Just dial.",
  "I solve a $130,000 problem. My solution is $5,000. The math works.",
  "Not everyone qualifies. That's by design."
];

// Tonality States (for UI display)
export interface TonalityState {
  name: string;
  whenToUse: string;
  soundsLike: string;
  energyLevel: string;
  practicePhrase: string;
}

export const TONALITY_STATES: TonalityState[] = [
  {
    name: "Curious",
    whenToUse: "CLARIFY and OVERVIEW stages",
    soundsLike: "Genuine interest, slightly upward inflection on questions",
    energyLevel: "Medium, engaged",
    practicePhrase: "That's interesting—tell me more about that."
  },
  {
    name: "Certain",
    whenToUse: "LABEL stage when quantifying their problem",
    soundsLike: "Matter-of-fact, lower pitch, definitive",
    energyLevel: "Medium-high, grounded",
    practicePhrase: "That's the bottleneck, right?"
  },
  {
    name: "Empathetic",
    whenToUse: "First response to any objection",
    soundsLike: "Warm, understanding, slower pace",
    energyLevel: "Lower, softer",
    practicePhrase: "I completely understand why you'd feel that way."
  },
  {
    name: "Excited",
    whenToUse: "SELL VACATION stage",
    soundsLike: "Energy increase, painting a picture, forward leaning",
    energyLevel: "Higher, aspirational",
    practicePhrase: "The workshop is one day. The results are permanent."
  },
  {
    name: "Calm Confidence",
    whenToUse: "REINFORCE stage, asking for commitment",
    soundsLike: "Lower pitch, slower pace, no desperation",
    energyLevel: "Medium-low, grounded, unfazed",
    practicePhrase: "Does that sound worth 15 minutes to explore?"
  }
];

// Red Flags for Disqualification
export const DISQUALIFICATION_RED_FLAGS = [
  "Solo agent, no team",
  "\"I have no budget\" (definitive)",
  "Wants free advice, not training",
  "Argumentative, disrespectful",
  "Decision maker unavailable indefinitely"
];

// Price Presentation Templates
export const PRICE_PRESENTATIONS = {
  matterOfFact: "The workshop is $5,000. For a team of 10 agents, that's $500 per agent. One extra deal per agent more than covers it.",
  consultantFrame: "The workshop is $5,000. Based on what you've told me—10 agents losing 5 hours a week—that's a 26:1 ROI in year one. Does that math work for you?",
  perAgentBreakdown: "$5,000 ÷ 10 agents = $500 per agent. One extra deal per agent pays for it twice over.",
  costOfWaiting: "What's the cost of NOT doing this? Your agents are losing 5+ hours a week. In 6 months, that's 130 hours per agent going to admin."
};

// =========================================
// STRIPE PAYMENT LINKS
// =========================================
export interface PaymentLink {
  name: string;
  price: number;
  duration: string;
  url: string;
  description: string;
}

export const PAYMENT_LINKS: PaymentLink[] = [
  {
    name: "6-Hour AI Masterclass",
    price: 5000,
    duration: "6 hours",
    url: "https://buy.stripe.com/00w00k5wS1L1dEtamgbwk0F",
    description: "Full day, complete curriculum, all exercises, fraud training"
  },
  {
    name: "3-Hour Implementation Workshop",
    price: 3000,
    duration: "3 hours",
    url: "https://buy.stripe.com/3cIeVe1gC3T97g5bqkbwk0G",
    description: "Half day, core skills, key prompts, streamlined exercises"
  }
];

// Quick access function
export function getPaymentLink(product: '6hour' | '3hour'): string {
  return product === '6hour' ? PAYMENT_LINKS[0].url : PAYMENT_LINKS[1].url;
}
