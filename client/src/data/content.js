export const studio = {
  name: 'Neural Web Works',
  domain: 'neuralwebworks.com',
  tagline: 'Web and mobile software, wired to work.',
  email: 'hello@neuralwebworks.com',
  phone: '+1 (415) 555-0163',
  locations: ['Remote-first', 'Kolkata · London · Austin']
};

export const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#stack', label: 'Stack' },
  { href: '#work', label: 'Work' },
  { href: '#pricing', label: 'Engagement' },
  { href: '#brief', label: 'Start a project' }
];

export const metrics = [
  { value: '64', suffix: '', label: 'products shipped' },
  { value: '11', suffix: 'yrs', label: 'average engineer experience' },
  { value: '98', suffix: '%', label: 'clients who come back' },
  { value: '1', suffix: 'day', label: 'to a costed reply' }
];

export const services = [
  {
    id: 'web',
    index: '01',
    title: 'Web applications',
    body: 'Dashboards, portals and SaaS products built on React or Next.js with a typed API behind them. Fast on a mid-range Android phone, not just on our laptops.',
    tags: ['React', 'Next.js', 'TypeScript', 'PostgreSQL']
  },
  {
    id: 'mobile',
    index: '02',
    title: 'Mobile applications',
    body: 'React Native and Flutter when one codebase is right, native Swift or Kotlin when it is not. We handle store submission, signing and phased rollout.',
    tags: ['React Native', 'Flutter', 'Swift', 'Kotlin']
  },
  {
    id: 'backend',
    index: '03',
    title: 'Backends & APIs',
    body: 'Node, Python or Go services with schema migrations, background jobs and observability wired in from the first commit rather than after the first outage.',
    tags: ['Node.js', 'FastAPI', 'GraphQL', 'Redis']
  },
  {
    id: 'cloud',
    index: '04',
    title: 'Cloud & DevOps',
    body: 'Infrastructure as code, containerised deploys, preview environments per pull request, and alerts that page a human only when something is genuinely wrong.',
    tags: ['AWS', 'Docker', 'Terraform', 'GitHub Actions']
  },
  {
    id: 'ai',
    index: '05',
    title: 'AI product engineering',
    body: 'Retrieval, extraction and assistant features with evaluation harnesses and cost ceilings. We will tell you honestly when a model is the wrong tool.',
    tags: ['Claude API', 'RAG', 'pgvector', 'Evals']
  },
  {
    id: 'design',
    index: '06',
    title: 'Product design',
    body: 'Research, flows, a real component library and prototypes you can click. Design that survives contact with engineering because engineers were in the room.',
    tags: ['Figma', 'Design systems', 'WCAG 2.2', 'Prototyping']
  },
  {
    id: 'commerce',
    index: '07',
    title: 'Commerce',
    body: 'Storefronts and checkouts on Shopify, Medusa or bespoke stacks, with payments, tax, fulfilment and the analytics to see what is actually selling.',
    tags: ['Shopify', 'Stripe', 'Medusa', 'Headless CMS']
  },
  {
    id: 'care',
    index: '08',
    title: 'Support & modernisation',
    body: 'Inherited a codebase nobody understands? We audit it, stabilise it, add tests, then modernise in slices while the product keeps earning.',
    tags: ['Audits', 'Refactoring', 'Test coverage', 'SLAs']
  }
];

export const process = [
  {
    step: '01',
    title: 'Discovery',
    duration: '3 – 10 days',
    body: 'We interview your users and your team, map the workflows and write down what success means in numbers. You leave with a scope, a risk list and a price.',
    outputs: ['Scope document', 'Technical approach', 'Fixed estimate']
  },
  {
    step: '02',
    title: 'Design',
    duration: '2 – 4 weeks',
    body: 'Flows first, then screens, then a component library. Clickable prototypes go in front of real users before a single production component is written.',
    outputs: ['User flows', 'High-fidelity UI', 'Design system']
  },
  {
    step: '03',
    title: 'Build',
    duration: '4 – 20 weeks',
    body: 'Two-week sprints, a demo at the end of each one, and a staging URL that is always current. You see the product growing rather than hearing about it.',
    outputs: ['Sprint demos', 'Staging environment', 'Test suite']
  },
  {
    step: '04',
    title: 'Launch',
    duration: '1 – 2 weeks',
    body: 'Load testing, a security pass, store submissions, analytics and a rollback plan. We stay on call through the first week in production.',
    outputs: ['Security review', 'Store release', 'Runbook']
  },
  {
    step: '05',
    title: 'Scale',
    duration: 'Ongoing',
    body: 'Monthly iteration against the metrics we agreed in discovery. Uptime monitoring, dependency upgrades and a roadmap you control.',
    outputs: ['Monitoring & SLA', 'Monthly roadmap', 'Handover docs']
  }
];

export const work = [
  {
    id: 'tidewater',
    client: 'Tidewater Utilities',
    title: 'Leak detection platform for 400 pumping stations',
    body: 'Sensor ingestion at 2M readings a day, anomaly scoring, and an engineer-facing mobile app that works underground with no signal.',
    stack: ['React', 'React Native', 'Go', 'TimescaleDB', 'AWS'],
    result: '31% fewer unplanned outages in the first year'
  },
  {
    id: 'northwind',
    client: 'Northwind Health',
    title: 'Patient intake replacing 9 paper forms',
    body: 'HIPAA-aligned intake with offline capture on clinic tablets, clinician review queues and an audit trail regulators actually accepted.',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Azure'],
    result: 'Intake time cut from 22 minutes to 6'
  },
  {
    id: 'kettle',
    client: 'Kettle & Co',
    title: 'Headless storefront across 14 markets',
    body: 'Shopify backend, bespoke React front end, localised pricing and tax, and a CMS the marketing team runs without filing tickets.',
    stack: ['React', 'Shopify', 'Sanity', 'Cloudflare'],
    result: '2.4× conversion on mobile'
  },
  {
    id: 'ledgerly',
    client: 'Ledgerly',
    title: 'AI document extraction for accountants',
    body: 'Invoice and receipt extraction with a human-in-the-loop review queue, per-customer accuracy dashboards and a hard monthly cost ceiling.',
    stack: ['Claude API', 'FastAPI', 'pgvector', 'React'],
    result: '94% of documents cleared without review'
  }
];

export const pricing = [
  {
    id: 'sprint',
    name: 'Discovery sprint',
    price: 'from $4,800',
    cadence: 'one to two weeks',
    pitch: 'For teams who need certainty before committing budget.',
    includes: [
      'Stakeholder and user interviews',
      'Technical feasibility review',
      'Clickable prototype of the core flow',
      'Scoped backlog and fixed build quote',
      'Yours to take anywhere'
    ],
    featured: false
  },
  {
    id: 'project',
    name: 'Fixed-scope build',
    price: 'from $18,000',
    cadence: 'per project',
    pitch: 'A defined product, a defined price, a defined date.',
    includes: [
      'Everything in a discovery sprint',
      'Design and full-stack build',
      'Automated tests and CI/CD',
      'Store submission or production deploy',
      '60 days of warranty support'
    ],
    featured: true
  },
  {
    id: 'team',
    name: 'Dedicated team',
    price: 'from $9,500',
    cadence: 'per month',
    pitch: 'An embedded squad for products that keep evolving.',
    includes: [
      'Two to six engineers plus a designer',
      'Your board, your standups, our practices',
      'Monthly roadmap and reporting',
      'Uptime monitoring and an SLA',
      'Pause or stop with 30 days notice'
    ],
    featured: false
  }
];

export const faqs = [
  {
    q: 'How quickly can you start?',
    a: 'Discovery usually begins within two weeks of signing. Full build teams are typically booked three to five weeks out, and we will tell you the real date before you commit, not after.'
  },
  {
    q: 'Who owns the code?',
    a: 'You do, from the first commit. Work happens in your repository where possible, or in ours and transferred at no cost. There is no licence, no lock-in and no hostage situation.'
  },
  {
    q: 'Do you work with existing codebases?',
    a: 'Frequently. We start with a paid audit covering architecture, security, test coverage and dependency risk, then propose a plan that keeps the product earning while we improve it.'
  },
  {
    q: 'What if the scope changes mid-build?',
    a: 'It usually does. Fixed-scope projects include a change budget, and anything beyond it gets priced as a small increment you approve before we build it. No surprise invoices.'
  },
  {
    q: 'Can you sign an NDA?',
    a: 'Yes. Tick the box in the brief form and we will send ours, or sign yours. We can review and return most standard NDAs the same day.'
  },
  {
    q: 'Do you offer support after launch?',
    a: 'Every project includes 60 days of warranty cover. Beyond that, support plans start at a fixed monthly fee with an agreed response time for critical issues.'
  }
];

export const principles = [
  {
    title: 'Estimates you can plan around',
    body: 'We quote after discovery, not before. If we get it wrong inside a fixed scope, that is our problem, not an invoice.'
  },
  {
    title: 'One team, start to finish',
    body: 'The engineers who scope your project build it. Nothing is handed to a cheaper bench once the contract is signed.'
  },
  {
    title: 'Boring technology on purpose',
    body: 'We pick tools with long support horizons and large hiring pools, so you are never stranded on something clever and abandoned.'
  },
  {
    title: 'Written down, always',
    body: 'Architecture decisions, runbooks and handover docs ship with the code. If we disappeared tomorrow you could keep going.'
  }
];
