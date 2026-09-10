import { useState } from 'react';
import { faqs } from '../data/content.js';
import { SectionHead } from './Reveal.jsx';
import { useStaggerReveal } from '../hooks/useReveal.js';

/**
 * Accordion. The open/close animation uses the grid-template-rows 0fr → 1fr
 * trick, so nothing has to be measured in JavaScript.
 */
function Item({ item, isOpen, onToggle, id }) {
  return (
    <div className={`faq${isOpen ? ' is-open' : ''}`} data-reveal="">
      <h3 className="faq__heading">
        <button
          className="faq__q"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-body-${id}`}
        >
          <span>{item.q}</span>
          <span className="faq__sign" aria-hidden="true" />
        </button>
      </h3>
      <div className="faq__body" id={`faq-body-${id}`} role="region">
        <div className="faq__body-inner">
          <p className="muted">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  const listRef = useStaggerReveal({ step: 60 });

  return (
    <section className="section section--tight" id="faq">
      <div className="shell faq__layout">
        <SectionHead eyebrow="Questions" title="The things clients ask before signing." />

        <div className="faq__list" ref={listRef}>
          {faqs.map((item, i) => (
            <Item
              key={item.q}
              id={i}
              item={item}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
