/*
 * Deck-verbatim copy for the three service pages, keyed by offering id. Source of
 * truth: .memory/content/services-*.md (05b contracts) — strings are copy-pasted from
 * the decks and grep-verified by the fidelity tests (prevention:
 * .memory/mistakes/2026-09-01-fidelity-test-hand-typed-and-self-graded-exception.md).
 * Reference hedges ("may", "can", "similar in concept", "current service examples",
 * "determined independently") are load-bearing — never compress them away.
 */
export interface ServiceCopy {
  /** Contract title (the layout template appends "— Sandbee"). */
  title: string
  description: string
  heroSupport: string
  what: string[]
  /** Optional defer-to-index line rendered with a link to /services. */
  deferral?: string
  consume: string[]
  flow: {
    source: string
    capability: string
    destination: string
    title: string
    desc: string
    caption: string
    fallback: string
  }
  billingHeading: string
  billing: string[]
  fit?: string
  faq: Array<{ question: string; answer: string }>
  cta: string
}

export const SERVICE_COPY: Record<string, ServiceCopy> = {
  'whatsapp-sms-automation': {
    title: 'WhatsApp/SMS automation',
    description:
      'WhatsApp/SMS automation as an ongoing Sandbee service: hosted delivery, consumed through a dashboard, API or workflow, billed in the model that fits.',
    heroSupport:
      'Automation for WhatsApp and SMS messaging, delivered as an ongoing hosted capability rather than an installed application.',
    what: [
      'Services provide an ongoing capability rather than only a standalone installed application.',
      'WhatsApp/SMS automation is one of Sandbee’s current service examples.',
    ],
    consume: [
      'A service can be hosted by Sandbee and consumed through a dashboard, API, automation workflow, or other integration.',
      'Services may be delivered through hosted systems, APIs, dashboards, integrations, or other managed infrastructure.',
    ],
    flow: {
      source: 'your system',
      capability: 'sandbee-hosted automation',
      destination: 'whatsapp / sms',
      title: 'Hosted delivery position of the WhatsApp/SMS automation service',
      desc: 'Your system connects over dashed hosted-API edges to a Sandbee-hosted automation capability, which delivers to WhatsApp and SMS.',
      caption:
        'Delivery-model diagram: hosted automation between your system and WhatsApp/SMS — not a feature map.',
      fallback:
        'Your system connects to a Sandbee-hosted automation capability which delivers messages to WhatsApp and SMS.',
    },
    billingHeading: 'How billing is shaped',
    billing: [
      'The billing method is intentionally flexible and can be: subscription-based, usage-based, wallet/credit-based, hybrid, or another model that fits the particular service.',
    ],
    fit: 'Businesses that need messaging automation as a running capability, agencies and technology teams building it into their own systems.',
    faq: [
      {
        question: 'Is this an app we install?',
        answer:
          'No — services provide an ongoing capability rather than only a standalone installed application; delivery is hosted.',
      },
      {
        question: 'How would our system connect?',
        answer:
          'Consumption can be through a dashboard, API, automation workflow, or other integration — shaped per engagement.',
      },
      {
        question: 'What does it cost?',
        answer:
          'The billing model is chosen to fit the service — subscription, usage, wallet/credits or hybrid. Talk to us for specifics; no public price list exists.',
      },
    ],
    cta: 'Ask about WhatsApp/SMS automation',
  },
  'instagram-automation': {
    title: 'Instagram automation',
    description:
      'Instagram automation is a Sandbee technology direction. Discuss the workflow, integration scope and commercial model for your requirement.',
    heroSupport:
      'A direction for Instagram automation through hosted services and integrations. Current scope and availability are discussed per engagement.',
    what: [
      'Instagram automation is one of Sandbee’s service directions. Describe the workflow you need so we can discuss the current scope and availability.',
    ],
    deferral:
      'Delivery and billing depend on the offering. The services page separates current APIs and messaging from other service directions.',
    consume: [
      'A service can be hosted by Sandbee and consumed through a dashboard, API, automation workflow, or other integration.',
    ],
    flow: {
      source: 'your workflow',
      capability: 'sandbee-hosted automation',
      destination: 'instagram',
      title: 'Hosted delivery position of the Instagram automation service',
      desc: 'Your workflow connects over dashed hosted-API edges to a Sandbee-hosted automation capability, which delivers to Instagram.',
      caption:
        'Delivery-model diagram: hosted automation between your workflow and Instagram.',
      fallback:
        'Your workflow connects to a Sandbee-hosted automation capability which delivers to Instagram.',
    },
    billingHeading: 'How billing is shaped',
    billing: [
      'The billing method is intentionally flexible and can be: subscription-based, usage-based, wallet/credit-based, hybrid, or another model that fits the particular service. There is no requirement that every Sandbee service use the same pricing structure.',
    ],
    faq: [
      {
        question: 'Is this the same offering as Sandbee Messaging?',
        answer:
          'No. Sandbee Messaging is the QR-connected WhatsApp offering with prepaid balance. Instagram automation is a separate direction whose scope is discussed with Sandbee.',
      },
      {
        question: 'What exactly can it automate on Instagram?',
        answer:
          'Scope is agreed per engagement — describe what you need and we will tell you honestly whether this service covers it.',
      },
      {
        question: 'What does it cost?',
        answer:
          'Billing is model-based — subscription, usage, credits or hybrid — chosen to fit the service. No public price list exists.',
      },
    ],
    cta: 'Ask about Instagram automation',
  },
  'desktop-notification': {
    title: 'Desktop notification service',
    description:
      'A Sandbee direction for hosted desktop notifications, similar in concept to Pushy. Discuss integration scope and current availability.',
    heroSupport:
      'A direction for hosted desktop notifications, similar in concept to Pushy. Ask about current scope and availability for your application.',
    what: [
      'A desktop notification service similar in concept to Pushy — a hosted notification capability, not an application you install and run yourself.',
    ],
    deferral:
      'Hosted delivery and flexible billing follow the Sandbee service model, described in full on the services page.',
    consume: [
      'A service can be hosted by Sandbee and consumed through a dashboard, API, automation workflow, or other integration.',
    ],
    flow: {
      source: 'your application',
      capability: 'sandbee-hosted notifications',
      destination: 'desktop clients',
      title: 'Hosted delivery position of the desktop notification service',
      desc: 'Your application connects over dashed hosted-API edges to a Sandbee-hosted notification capability, which delivers to desktop clients.',
      caption:
        'Delivery-model diagram: hosted notifications between your application and desktop clients.',
      fallback:
        'Your application connects to a Sandbee-hosted notification capability which delivers to desktop clients.',
    },
    billingHeading: 'How billing is shaped',
    billing: [
      'The billing model for this service is determined independently — the direction is a service-specific model rather than a fixed company-wide structure.',
    ],
    faq: [
      {
        question: 'Is this Pushy?',
        answer:
          'No — it is Sandbee’s own hosted capability, similar in concept to Pushy.',
      },
      {
        question: 'How do our apps receive notifications?',
        answer:
          'Consumption can be through an API, dashboard, workflow or other integration — shaped per engagement.',
      },
      {
        question: 'What does it cost?',
        answer:
          'A service-specific model, agreed in conversation — no public price list exists.',
      },
    ],
    cta: 'Ask about desktop notifications',
  },
}
