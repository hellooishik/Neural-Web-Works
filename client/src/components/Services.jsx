import { services } from '../data/content.js';
import { useStaggerReveal } from '../hooks/useReveal.js';
import { SectionHead, spotlight } from './Reveal.jsx';

export default function Services() {
  const gridRef = useStaggerReveal({ step: 70 });

  return (
    <section className="section" id="services">
      <div className="shell">
        <SectionHead eyebrow="What we do" title="Eight disciplines, one team, no handoffs.">
          Most projects need three or four of these at once. You get them from the same people,
          working in the same repository, on the same schedule.
        </SectionHead>

        <div className="services" ref={gridRef}>
          {services.map((service) => (
            <article className="card service" key={service.id} onMouseMove={spotlight}>
              <span className="service__index mono">{service.index}</span>
              <h3 className="h3">{service.title}</h3>
              <p className="muted service__body">{service.body}</p>
              <ul className="chips">
                {service.tags.map((tag) => (
                  <li className="chip" key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
