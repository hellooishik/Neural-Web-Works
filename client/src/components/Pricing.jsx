import { pricing } from '../data/content.js';
import { useStaggerReveal } from '../hooks/useReveal.js';
import { SectionHead, spotlight } from './Reveal.jsx';

export default function Pricing() {
  const gridRef = useStaggerReveal({ step: 110 });

  return (
    <section className="section" id="pricing">
      <div className="shell">
        <SectionHead eyebrow="Engagement" title="Three ways to work with us.">
          Prices are honest starting points, not anchors. The exact figure comes out of discovery,
          in writing, before you commit to a build.
        </SectionHead>

        <div className="plans" ref={gridRef}>
          {pricing.map((plan) => (
            <article
              className={`card plan${plan.featured ? ' plan--featured' : ''}`}
              key={plan.id}
              onMouseMove={spotlight}
            >
              {plan.featured ? <span className="plan__flag mono">Most chosen</span> : null}
              <h3 className="h3">{plan.name}</h3>
              <p className="faint plan__pitch">{plan.pitch}</p>
              <p className="plan__price">
                {plan.price}
                <span className="plan__cadence"> / {plan.cadence}</span>
              </p>
              <ul className="plan__list">
                {plan.includes.map((line) => (
                  <li key={line}>
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="tick">
                      <path
                        d="m3 8.4 3.2 3.2L13 4.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {line}
                  </li>
                ))}
              </ul>
              <a className={`btn ${plan.featured ? 'btn--primary' : 'btn--ghost'} plan__cta`} href="#brief">
                Start here <span className="btn__arrow" aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
