// Every technology the studio will build with, grouped for the explorer and
// reused verbatim as the checkbox options in the project brief.

export const stackGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    blurb: 'What the customer actually touches. Accessible, fast, tested.',
    items: [
      'React',
      'Next.js',
      'Vue',
      'Nuxt',
      'Svelte / SvelteKit',
      'Angular',
      'Astro',
      'Remix',
      'TypeScript',
      'Tailwind CSS',
      'Vite',
      'Three.js / WebGL'
    ]
  },
  {
    id: 'mobile',
    label: 'Mobile',
    blurb: 'One codebase or two, shipped to both stores with CI signing.',
    items: [
      'React Native',
      'Expo',
      'Flutter',
      'Swift / SwiftUI (iOS)',
      'Kotlin / Jetpack Compose (Android)',
      'Ionic / Capacitor',
      '.NET MAUI',
      'Progressive Web App',
      'Push & deep links',
      'Offline-first sync'
    ]
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    blurb: 'Boring, observable services that survive your growth curve.',
    items: [
      'Node.js',
      'Express',
      'NestJS',
      'Fastify',
      'Python / FastAPI',
      'Django',
      'Go',
      'Java / Spring Boot',
      'Ruby on Rails',
      'PHP / Laravel',
      '.NET Core',
      'GraphQL',
      'gRPC',
      'REST',
      'WebSockets',
      'Event queues (Kafka, SQS)'
    ]
  },
  {
    id: 'data',
    label: 'Data & storage',
    blurb: 'Schemas designed once, migrated safely, backed up automatically.',
    items: [
      'PostgreSQL',
      'MySQL / MariaDB',
      'MongoDB',
      'Redis',
      'SQLite',
      'Supabase',
      'Firebase / Firestore',
      'DynamoDB',
      'Elasticsearch',
      'ClickHouse',
      'Prisma',
      'Snowflake / BigQuery'
    ]
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    blurb: 'Reproducible infrastructure, one-command deploys, real alerting.',
    items: [
      'AWS',
      'Google Cloud',
      'Microsoft Azure',
      'Vercel',
      'Netlify',
      'Cloudflare Workers',
      'Docker',
      'Kubernetes',
      'Terraform',
      'GitHub Actions',
      'GitLab CI',
      'Sentry / Datadog',
      'Nginx',
      'DigitalOcean'
    ]
  },
  {
    id: 'ai',
    label: 'AI & automation',
    blurb: 'Applied models with evaluation, guardrails and cost control.',
    items: [
      'Claude / Anthropic API',
      'OpenAI API',
      'Retrieval-augmented generation',
      'Vector databases (pgvector, Pinecone)',
      'LangChain / LlamaIndex',
      'Fine-tuning',
      'Speech to text',
      'Computer vision',
      'Recommendation engines',
      'Workflow automation (n8n, Zapier)'
    ]
  },
  {
    id: 'commerce',
    label: 'Commerce & CMS',
    blurb: 'Sell things and let non-developers change the words.',
    items: [
      'Shopify / Hydrogen',
      'WooCommerce',
      'Medusa',
      'Stripe',
      'Razorpay',
      'PayPal',
      'Adyen',
      'Sanity',
      'Contentful',
      'Strapi',
      'Payload CMS',
      'WordPress (headless)'
    ]
  },
  {
    id: 'quality',
    label: 'Quality & security',
    blurb: 'The part most studios quietly skip.',
    items: [
      'Playwright',
      'Cypress',
      'Jest / Vitest',
      'Load testing (k6)',
      'OWASP review',
      'Penetration test support',
      'WCAG 2.2 accessibility audit',
      'SOC 2 / ISO evidence support',
      'GDPR & data mapping',
      'SSO / SAML / OAuth 2.0'
    ]
  }
];

export const allStackItems = stackGroups.flatMap((group) => group.items);

export const projectTypes = [
  { id: 'web-app', label: 'Web application', note: 'Dashboards, portals, SaaS products' },
  { id: 'mobile-app', label: 'Mobile application', note: 'iOS, Android or both' },
  { id: 'web-and-mobile', label: 'Web + mobile', note: 'Shared backend, two front doors' },
  { id: 'website', label: 'Marketing website', note: 'Brochure, landing pages, CMS' },
  { id: 'ecommerce', label: 'E-commerce store', note: 'Catalogue, checkout, fulfilment' },
  { id: 'saas', label: 'SaaS platform', note: 'Multi-tenant, billing, roles' },
  { id: 'ai-product', label: 'AI-powered product', note: 'Assistants, extraction, search' },
  { id: 'api', label: 'API / backend only', note: 'Integrations and services' },
  { id: 'redesign', label: 'Redesign or rescue', note: 'Existing product needs work' },
  { id: 'support', label: 'Ongoing support', note: 'Maintenance and iteration' }
];

export const platforms = [
  'Responsive web',
  'iOS',
  'Android',
  'Desktop (Windows/macOS)',
  'Tablet / kiosk',
  'Smart TV',
  'Wearables',
  'Browser extension'
];

export const featureOptions = [
  'User accounts & authentication',
  'Roles and permissions',
  'Payments & subscriptions',
  'Admin dashboard',
  'Analytics & reporting',
  'Real-time chat or messaging',
  'Push / email notifications',
  'Search & filtering',
  'File uploads & media',
  'Maps & geolocation',
  'Booking or scheduling',
  'Multi-language',
  'Offline mode',
  'Third-party integrations',
  'AI assistant or automation',
  'Data import / export',
  'Audit logs',
  'White-labelling'
];

export const designNeeds = [
  'We already have final designs',
  'We have wireframes only',
  'Full UI/UX design needed',
  'Brand identity & logo',
  'Design system / component library',
  'Copywriting',
  'Illustration or 3D',
  'Motion & prototyping'
];

export const timelines = [
  'As soon as possible',
  '1 to 3 months',
  '3 to 6 months',
  '6 months or more',
  'Still exploring'
];

export const budgets = [
  'Under $5k',
  '$5k – $15k',
  '$15k – $40k',
  '$40k – $100k',
  '$100k+',
  'Need guidance'
];

export const engagements = [
  'Fixed-scope project',
  'Dedicated team (monthly)',
  'Hourly / time & materials',
  'Discovery sprint first',
  'Not sure yet'
];

export const referrals = [
  'Google search',
  'Referral from a client',
  'LinkedIn',
  'GitHub / open source',
  'Conference or event',
  'Somewhere else'
];
