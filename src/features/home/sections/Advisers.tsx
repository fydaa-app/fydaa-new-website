import { siteConfig } from "@/config/site";
import BookCallForm from "../components/BookCallForm";

const { adviser } = siteConfig.entities;

/**
 * The adviser on a free call (tasteskill split on the surface band). This section carries the page's
 * one dealt moment, line-carries-colour: as it rises, a hairline climbs through it and clears the
 * previous section's ground. Under reduced motion, on a phone or without script it simply stands.
 */
export function Advisers() {
  return (
    <section
      id="advisers"
      className="section ground-surface g2m"
      aria-labelledby="advisers-title"
      data-moment="line-carries-colour"
      data-moment-opts='{"from": "base"}'
    >
      <div className="wrap split grid">
        <div className="span-5 split__text">
          <h2 id="advisers-title">Talk to a SEBI-registered adviser about your goals</h2>
          <p className="t-lead">
            Fydaa’s advisers work for {adviser.legalName}, a SEBI-registered investment adviser. Leave your
            number and one of them calls you back, free of charge.
          </p>
          <ul className="split__facts">
            <li>
              Registration <span className="font-mono">{adviser.sebiRegistrationNumber}</span>
            </li>
            <li>The call covers goals, debt, insurance and investments</li>
            <li>Fydaa Direct Plan brings it together in one plan</li>
          </ul>
        </div>
        <div id="book-a-call" className="span-6 form-card start-7">
          <BookCallForm />
        </div>
      </div>
    </section>
  );
}
