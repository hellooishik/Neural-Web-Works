import { useReveal } from '../hooks/useReveal.js';

/** Wraps children in an element that fades and lifts into view once. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal({ delay });
  return (
    <Tag ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** Section heading block: eyebrow, title, optional supporting copy. */
export function SectionHead({ eyebrow, title, children, align = 'start' }) {
  const ref = useReveal();
  return (
    <div ref={ref} data-reveal="" className="section-head" style={{ justifyItems: align }}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="h2">{title}</h2>
      {children ? <p className="lede">{children}</p> : null}
    </div>
  );
}

/** Pointer-tracking light for `.card`. Attach to onMouseMove. */
export function spotlight(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
}
