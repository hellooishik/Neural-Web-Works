import { useEffect, useState } from 'react';
import { navLinks, studio } from '../data/content.js';
import Logo from './Logo.jsx';
import { usePageProgress, useActiveSection } from '../hooks/useScrollProgress.js';

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

export default function Nav() {
  const progress = usePageProgress();
  const active = useActiveSection(SECTION_IDS);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a className="skip" href="#services">Skip to content</a>

      <nav className={`nav${solid ? ' nav--solid' : ''}`} aria-label="Primary">
        <div className="shell nav__inner">
          <a
            className="nav__brand"
            href="#top"
            aria-label={`${studio.name} — back to top`}
            onClick={() => setOpen(false)}
          >
            <Logo />
          </a>

          <ul className="nav__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav__link${active === link.href.slice(1) ? ' is-active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a className="btn btn--primary nav__cta" href="#brief">
            Get a quote
          </a>

          <button
            className={`nav__burger${open ? ' is-open' : ''}`}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
          </button>
        </div>

        <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
      </nav>

      <div className={`sheet${open ? ' is-open' : ''}`} hidden={!open}>
        <ul>
          {navLinks.map((link, i) => (
            <li key={link.href} style={{ transitionDelay: `${i * 45}ms` }}>
              <a href={link.href} onClick={() => setOpen(false)}>
                <span className="mono sheet__num">{String(i + 1).padStart(2, '0')}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="faint">{studio.email}</p>
      </div>
    </>
  );
}
