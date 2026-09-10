const ITEMS = [
  'React',
  'React Native',
  'Next.js',
  'Node.js',
  'TypeScript',
  'Flutter',
  'Swift',
  'Kotlin',
  'Python',
  'Go',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'GraphQL',
  'Stripe',
  'Claude API',
  'Terraform'
];

/**
 * Infinite tech ticker. The list is rendered twice and the track slides by
 * exactly half its width, so the loop has no visible seam.
 */
export default function Marquee() {
  return (
    <div className="marquee" aria-label="Technologies we work with">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul className="marquee__set" key={copy} aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <li key={item}>
                <span className="marquee__dot" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
