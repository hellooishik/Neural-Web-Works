import { studio, navLinks } from '../data/content.js';
import Logo from './Logo.jsx';
import { useReveal } from '../hooks/useReveal.js';

export default function Footer() {
  const ref = useReveal({ threshold: 0.1 });
  const year = new Date().getFullYear();

  return (
    <footer className="footer" ref={ref} data-reveal="">
      <div className="shell">
        <div className="footer__top">
          <div>
            <Logo className="footer__wordmark" />
            <p className="lede footer__tagline serif">{studio.tagline}</p>
          </div>

          <div className="footer__cols">
            <div>
              <h3 className="footer__label mono">Sections</h3>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="footer__label mono">Contact</h3>
              <ul>
                <li><a href={`mailto:${studio.email}`}>{studio.email}</a></li>
                <li><a href={`tel:${studio.phone.replace(/[^\d+]/g, '')}`}>{studio.phone}</a></li>
                {studio.locations.map((place) => (
                  <li className="faint" key={place}>{place}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="rule" />

        <div className="footer__bottom">
          <p className="faint">© {year} {studio.name} · {studio.domain}. All rights reserved.</p>
          <p className="faint">
            Built with React and Node. <a href="#top">Back to top ↑</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
