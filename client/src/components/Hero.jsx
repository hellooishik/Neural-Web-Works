import { useEffect, useRef, useState } from 'react';
import PowerPlant from './PowerPlant.jsx';
import WaterCanvas from './WaterCanvas.jsx';
import { metrics, studio } from '../data/content.js';

/** Headline words rise into place one after another on mount. */
function SplitLine({ text, delay = 0, className = '' }) {
  return (
    <span className={`split ${className}`}>
      {text.split(' ').map((word, i) => (
        <span className="split__mask" key={`${word}-${i}`}>
          <span className="split__word" style={{ animationDelay: `${delay + i * 70}ms` }}>
            {word}
          </span>
          {/* real space so the headline copies and reads correctly */}
          {' '}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const [offset, setOffset] = useState(0);

  // Cheap parallax: the scene drifts down and dims as the page scrolls away.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      setOffset(Math.min(Math.max(-rect.top / rect.height, 0), 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div
        className="hero__scene"
        style={{
          transform: `translate3d(0, ${offset * 90}px, 0) scale(${1 + offset * 0.06})`,
          opacity: 1 - offset * 0.7
        }}
      >
        <PowerPlant />
        <WaterCanvas waterLine={0.78} />
        <div className="hero__vignette" />
      </div>

      <div className="shell hero__inner">
        <p className="eyebrow hero__eyebrow">Software studio · web &amp; mobile</p>

        <h1 className="display hero__title">
          <SplitLine text="We build software" delay={120} />
          <SplitLine text="that earns" delay={340} />
          <span className="hero__title-row">
            <SplitLine text="its" delay={520} />
            <span className="split__mask">
              <span className="split__word serif grad-text" style={{ animationDelay: '600ms' }}>
                keep.
              </span>
            </span>
          </span>
        </h1>

        <p className="lede hero__lede">
          {studio.name} is a senior team designing and shipping web applications, mobile apps and the
          backends underneath them. Tell us what you need below and you get a scope, a stack and a
          price inside one business day.
        </p>

        <div className="row hero__actions">
          <a className="btn btn--primary" href="#brief">
            Start a project <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn btn--ghost" href="#process">
            How we work
          </a>
        </div>

        <dl className="hero__metrics">
          {metrics.map((metric, i) => (
            <div className="hero__metric" key={metric.label} style={{ animationDelay: `${900 + i * 110}ms` }}>
              <dt className="hero__metric-value">
                {metric.value}
                <span className="hero__metric-suffix">{metric.suffix}</span>
              </dt>
              <dd className="hero__metric-label">{metric.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a className="hero__cue" href="#services" aria-label="Scroll to services">
        <span className="hero__cue-track"><span className="hero__cue-drop" /></span>
        <span className="mono">scroll</span>
      </a>
    </header>
  );
}
