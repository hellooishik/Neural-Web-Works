import { process } from '../data/content.js';
import { useElementProgress } from '../hooks/useScrollProgress.js';
import { SectionHead } from './Reveal.jsx';
import { useReveal } from '../hooks/useReveal.js';

function Step({ step, isLit }) {
  const ref = useReveal({ threshold: 0.3 });
  return (
    <li ref={ref} data-reveal="" className={`step${isLit ? ' is-lit' : ''}`}>
      <span className="step__node" aria-hidden="true" />
      <div className="step__head">
        <span className="mono step__num">{step.step}</span>
        <h3 className="h3">{step.title}</h3>
        <span className="mono step__time">{step.duration}</span>
      </div>
      <p className="muted step__body">{step.body}</p>
      <ul className="chips">
        {step.outputs.map((output) => (
          <li className="chip chip--quiet" key={output}>{output}</li>
        ))}
      </ul>
    </li>
  );
}

export default function Process() {
  // The droplet on the timeline is driven directly by scroll position, so the
  // line fills at exactly the rate the visitor reads.
  const [trackRef, progress] = useElementProgress();
  const eased = Math.min(Math.max((progress - 0.12) / 0.68, 0), 1);
  const litCount = Math.round(eased * process.length);

  return (
    <section className="section" id="process">
      <div className="shell">
        <SectionHead eyebrow="How we work" title="Five stages. You can see all of them.">
          No black box, no monthly status email that says &ldquo;on track&rdquo;. There is a staging
          URL from week one and a demo every fortnight.
        </SectionHead>

        <div className="timeline" ref={trackRef}>
          <div className="timeline__rail" aria-hidden="true">
            <div className="timeline__fill" style={{ transform: `scaleY(${eased})` }} />
            <div className="timeline__drop" style={{ top: `${eased * 100}%` }} />
          </div>

          <ol className="timeline__steps">
            {process.map((step, i) => (
              <Step key={step.step} step={step} isLit={i < litCount} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
