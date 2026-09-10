import { useMemo, useState } from 'react';
import { stackGroups, allStackItems } from '../data/stacks.js';
import { SectionHead } from './Reveal.jsx';
import { useReveal } from '../hooks/useReveal.js';

export default function StackExplorer() {
  const [group, setGroup] = useState('all');
  const [query, setQuery] = useState('');
  const panelRef = useReveal();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return stackGroups
      .filter((entry) => group === 'all' || entry.id === group)
      .map((entry) => ({
        ...entry,
        items: needle ? entry.items.filter((item) => item.toLowerCase().includes(needle)) : entry.items
      }))
      .filter((entry) => entry.items.length > 0);
  }, [group, query]);

  const count = visible.reduce((total, entry) => total + entry.items.length, 0);

  return (
    <section className="section" id="stack">
      <div className="shell">
        <SectionHead eyebrow="Technology" title="Every stack we build on, listed openly.">
          We are not tied to one framework. Pick what you already run, or leave it to us and we will
          recommend the option with the longest support horizon and the biggest hiring pool.
        </SectionHead>

        <div ref={panelRef} data-reveal="" className="stack">
          <div className="stack__controls">
            <div className="stack__tabs" role="tablist" aria-label="Technology categories">
              <button
                role="tab"
                aria-selected={group === 'all'}
                className={`tab${group === 'all' ? ' is-active' : ''}`}
                onClick={() => setGroup('all')}
              >
                Everything
                <span className="tab__count">{allStackItems.length}</span>
              </button>
              {stackGroups.map((entry) => (
                <button
                  key={entry.id}
                  role="tab"
                  aria-selected={group === entry.id}
                  className={`tab${group === entry.id ? ' is-active' : ''}`}
                  onClick={() => setGroup(entry.id)}
                >
                  {entry.label}
                  <span className="tab__count">{entry.items.length}</span>
                </button>
              ))}
            </div>

            <label className="stack__search">
              <span className="sr-only">Search technologies</span>
              <svg viewBox="0 0 20 20" aria-hidden="true" className="stack__search-icon">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                placeholder="Search: kotlin, stripe, terraform…"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <p className="faint mono stack__count" aria-live="polite">
            {count} {count === 1 ? 'technology' : 'technologies'} shown
          </p>

          <div className="stack__groups">
            {visible.map((entry) => (
              <div className="stack__group" key={entry.id}>
                <div className="stack__group-head">
                  <h3 className="h3">{entry.label}</h3>
                  <p className="faint">{entry.blurb}</p>
                </div>
                <ul className="stack__items">
                  {entry.items.map((item, i) => (
                    <li key={item} style={{ '--i': i }}>
                      <span className="stack__bullet" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {visible.length === 0 ? (
              <p className="muted">
                Nothing matches &ldquo;{query}&rdquo;. Ask us anyway &mdash; the list is what we use
                often, not the limit of what we will learn.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
