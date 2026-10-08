/** Current commercial facts: owner instruction, September 25, 2026. */
export const STORE_URL = 'https://store.sandbee.in'

export type ProductId = 'gst' | 'ocr' | 'messaging' | 'pos'
export interface CatalogProduct {
  id: ProductId
  name: string
  category: 'API service' | 'Developer package' | 'Business software'
  href:
    | '/services/gst-api'
    | '/technology/aadhaar-pan-ocr'
    | '/services/whatsapp-sms-automation'
    | '/products/pos'
  label: string
  headline: string
  description: string
  price: string
  pricingDetail: string
  action: string
  actionHref: string
  steps: readonly [string, string][]
  features: readonly [string, string][]
  faqs: readonly [string, string][]
}

export const CATALOG: readonly CatalogProduct[] = [
  {
    id: 'gst',
    name: 'GSTIN',
    category: 'API service',
    href: '/services/gst-api',
    label: 'Business details, one API away.',
    headline: 'Less data entry. More verified business context.',
    description:
      'Look up a GST number and bring business details into your onboarding, vendor or billing workflow through a hosted API.',
    price: 'Free',
    pricingDetail: 'Free access with authenticated requests and usage limits.',
    action: 'Open in Store',
    actionHref: STORE_URL,
    steps: [
      [
        'Enable GSTIN',
        'Sign in to Sandbee Store and enable the app for your workspace.',
      ],
      [
        'Create an API key',
        'Choose a GSTIN-only key or a global key for your enabled apps.',
      ],
      [
        'Connect your backend',
        'Call gstapi.sandbee.in from your server and review the response.',
      ],
    ],
    features: [
      [
        'Built for your backend',
        'Use an API key to add GST lookups to your existing software.',
      ],
      [
        'Avoid repeat lookups',
        'Successful results are cached. Check their age when freshness matters.',
      ],
      [
        'Know what was used',
        'See workspace usage and manage access from Sandbee Store.',
      ],
    ],
    faqs: [
      [
        'Is GSTIN free?',
        'Yes. GSTIN currently has free access. Authentication and service limits still apply.',
      ],
      [
        'Is every response live?',
        'No. Previously fetched results can come from the cache. Use response freshness information when your process needs current details.',
      ],
      [
        'Where do I get a key?',
        'Create your account in Sandbee Store, enable GSTIN and generate an app-specific or global API key. Keep it on your backend.',
      ],
    ],
  },
  {
    id: 'ocr',
    name: 'Document OCR',
    category: 'Developer package',
    href: '/technology/aadhaar-pan-ocr',
    label: 'Your documents. Your server.',
    headline: 'Extract the text. Keep the document.',
    description:
      'Install the Sandbee OCR package in your Node.js backend. Extract document data locally, with access managed through your Sandbee key.',
    price: 'Free',
    pricingDetail:
      'Free package access. Your infrastructure runs the extraction.',
    action: 'Get the package',
    actionHref: `${STORE_URL}/developers`,
    steps: [
      [
        'Enable Document OCR',
        'Create your Store account, enable OCR and generate an API key.',
      ],
      [
        'Install the package',
        'Download the authenticated package and install it in your Node.js project.',
      ],
      [
        'Run on your server',
        'Configure the key once. Access verifies at startup and renews in the background.',
      ],
    ],
    features: [
      [
        'Local document processing',
        'Documents used by the installed package stay on your infrastructure.',
      ],
      [
        'One configured key',
        'Startup verification and periodic license renewal manage access.',
      ],
      [
        'A useful review step',
        'Read structured output and check important extracted fields before saving them.',
      ],
    ],
    faqs: [
      [
        'Where does OCR run?',
        'The installed package runs on your Node.js server. The hosted Store demo is separate and processes files you explicitly upload to that demo.',
      ],
      [
        'Which environments are supported?',
        'Node.js 22 or newer on Windows x64 or Linux x64 with glibc. Alpine, ARM, macOS and browser execution are not supported in the current package.',
      ],
      [
        'Does it need an internet connection?',
        'Yes, for startup verification and periodic access renewal. Revoked keys stop new work after the bounded license window.',
      ],
      [
        'Is extraction always perfect?',
        'No. Image quality, layout and document condition affect results. Build a review step for important fields.',
      ],
    ],
  },
  {
    id: 'messaging',
    name: 'Sandbee Messaging',
    category: 'API service',
    href: '/services/whatsapp-sms-automation',
    label: 'Connect once. Start a conversation.',
    headline: 'From your application to their WhatsApp.',
    description:
      'Connect a WhatsApp session with a QR scan. Send messages through the panel or your own application, using a prepaid account balance.',
    price: 'Prepaid balance',
    pricingDetail:
      'Agree your usage rate during onboarding. Sending depends on available balance.',
    action: 'Request messaging access',
    actionHref: '/contact?product=messaging',
    steps: [
      [
        'Request your account',
        'Tell Sandbee about your messaging workflow and agree the usage terms.',
      ],
      [
        'Connect with a QR scan',
        'Link your WhatsApp session in the product panel.',
      ],
      [
        'Fund and send',
        'Add the agreed balance and send from the panel or integrate the API.',
      ],
    ],
    features: [
      [
        'Panel and API',
        'Send messages directly or connect messaging to your existing application.',
      ],
      [
        'Balance-based access',
        'Usage is managed against your account balance. Confirm rates before funding.',
      ],
      [
        'A guided setup',
        'Sandbee helps you start with the account and connection workflow.',
      ],
    ],
    faqs: [
      [
        'How is messaging charged?',
        'It uses prepaid balance. Rates and applicable charges are confirmed with Sandbee before activation.',
      ],
      [
        'Is this the official WhatsApp Business Platform?',
        'This offering uses a QR-connected WhatsApp session. It is not presented as the official WhatsApp Business Platform or a Meta partnership.',
      ],
      [
        'Can the session disconnect?',
        'Yes. Session availability depends on the connected account and WhatsApp. Reconnection may be needed. Use it for messages recipients expect and have agreed to receive.',
      ],
      [
        'Is self-service wallet top-up available in Store?',
        'Not yet. Request access and Sandbee will confirm the current onboarding and balance process.',
      ],
    ],
  },
  {
    id: 'pos',
    name: 'Sandbee POS',
    category: 'Business software',
    href: '/products/pos',
    label: 'A better day behind the counter.',
    headline: 'Your counter. Your workflow. Your setup.',
    description:
      'Bring restaurant billing, menu and order workflows together. Sandbee sets up the POS in your own Vercel account for a one-time implementation charge.',
    price: 'One-time setup',
    pricingDetail:
      'Quoted for your setup. Hosting, database and optional work are agreed separately.',
    action: 'Discuss your POS setup',
    actionHref: '/contact?product=pos',
    steps: [
      [
        'Show us your operation',
        'Discuss your menu, counters, order flow and setup needs.',
      ],
      [
        'Set up in your account',
        'Sandbee configures the deployment in your Vercel account. Provider access stays with you.',
      ],
      [
        'Review and hand over',
        'Check the agreed workflows together and confirm support and operating costs.',
      ],
    ],
    features: [
      [
        'Counter to kitchen',
        'Discuss billing, order handling and kitchen workflow for your operation.',
      ],
      [
        'QR ordering',
        'Bring table QR menu and ordering into the setup discussion.',
      ],
      [
        'A clear handover',
        'Agree deployment, database, provider costs and support before launch.',
      ],
    ],
    faqs: [
      [
        'Is the setup fee a monthly subscription?',
        'No. Sandbee charges a one-time implementation fee for the agreed setup. Provider subscriptions, support arrangements and later custom work are separate.',
      ],
      [
        'Whose Vercel account is used?',
        'Your account. Sandbee handles the initial setup with the access you provide for the project.',
      ],
      [
        'Is commercial hosting free?',
        'Do not assume so. Choose a provider plan that permits your commercial use; hosting and database charges are confirmed separately from the Sandbee setup fee.',
      ],
      [
        'Can I see it before proceeding?',
        'Yes. Contact Sandbee to discuss a walkthrough and your requirements before the setup is agreed.',
      ],
    ],
  },
]

export function catalogProduct(id: ProductId) {
  return CATALOG.find((product) => product.id === id)!
}
