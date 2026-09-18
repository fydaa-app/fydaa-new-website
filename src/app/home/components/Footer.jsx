import { FOOTER_COLUMNS, LEGAL_FOOTER_TEXT } from '../data/content';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">Fydaa</div>
            <p>Mutual fund investing, financial planning, and wealth tracking — built around your goals.</p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h4>{col.heading}</h4>
              {col.links.map((label) => (
                <a href="#" key={label}>{label}</a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Fydaa · Multistarto Capital Advisors Pvt. Ltd.</p>
        </div>

        <div className="footer-legal">{LEGAL_FOOTER_TEXT}</div>
      </div>
    </footer>
  );
}
