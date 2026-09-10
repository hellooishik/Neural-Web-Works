import { work, principles } from '../data/content.js';
import { useStaggerReveal } from '../hooks/useReveal.js';
import { SectionHead, spotlight } from './Reveal.jsx';

export default function Work() {
  const gridRef = useStaggerReveal({ step: 110 });
  const principlesRef = useStaggerReveal({ step: 80 });

  return (
    <section className="section" id="work">
      <div className="shell">
        <SectionHead eyebrow="Selected work" title="Products in production, with numbers attached.">
          Names are used with permission. Anything under NDA we will talk through on a call rather
          than dress up as a case study here.
        </SectionHead>

        <div className="work" ref={gridRef}>
          {work.map((item) => (
            <article className="card work__item" key={item.id} onMouseMove={spotlight}>
              <div className="work__top">
                <span className="mono work__client">{item.client}</span>
                <span className="work__result">{item.result}</span>
              </div>
              <h3 className="h3 work__title">{item.title}</h3>
              <p className="muted">{item.body}</p>
              <ul className="chips">
                {item.stack.map((tech) => (
                  <li className="chip" key={tech}>{tech}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="principles" ref={principlesRef}>
          {principles.map((principle) => (
            <div className="principle" key={principle.title}>
              <span className="principle__drop" aria-hidden="true" />
              <h4 className="h3">{principle.title}</h4>
              <p className="muted">{principle.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
