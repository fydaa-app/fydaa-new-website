"use client";

import { useEffect, useState } from "react";

const WATCHED = ["heroCtas", "book-a-call", "final", "footer"];

export default function StickyCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visible = {};
    const hero = document.getElementById("heroCtas");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible[entry.target.id] = entry.isIntersecting;
        });
        const heroPassed = hero && !visible.heroCtas && hero.getBoundingClientRect().bottom < 0;
        setShow(Boolean(heroPassed && !visible["book-a-call"] && !visible.final && !visible.footer));
      },
      { rootMargin: "-64px 0px 0px 0px" }
    );

    WATCHED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`mobile-sticky-cta${show ? " show" : ""}`} aria-hidden={!show}>
      <a href="#heroCalc" className="btn-download" tabIndex={show ? 0 : -1}>
        Start a SIP
      </a>
      <a href="#book-a-call" className="btn-invest" tabIndex={show ? 0 : -1}>
        Book a Free Call
      </a>
    </div>
  );
}
