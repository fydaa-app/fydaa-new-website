import posthog from 'posthog-js';
import type { ReactNode } from 'react';

export function captureEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  if (typeof window === 'undefined') return;
  try {
    posthog.capture(event, properties);
  } catch {
    // PostHog not ready — ignore
  }
}

/**
 * Turn a human label into an explicit PostHog event name.
 * "Book a Call" + "btn_clicked" → book_a_call_btn_clicked
 */
export function toEventName(label: string, suffix = 'btn_clicked'): string {
  const slug = String(label || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_')
    .slice(0, 64);
  const base = slug || 'unknown';
  const cleanSuffix = String(suffix || 'btn_clicked')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (base.endsWith(`_${cleanSuffix}`) || base === cleanSuffix) return base;
  return `${base}_${cleanSuffix}`;
}

/** Flatten React children into a short label for button tracking. */
export function labelFromChildren(children: ReactNode): string {
  if (children == null || typeof children === 'boolean') return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children.map(labelFromChildren).filter(Boolean).join(' ').trim();
  }
  if (typeof children === 'object' && 'props' in children) {
    return labelFromChildren((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

/** Suppress one global click capture after a manual named capture in the same tick. */
let suppressNextGlobalClick = false;

export function captureButtonClick(
  label: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  const trimmed = String(label || '').trim().slice(0, 120);
  if (!trimmed) return;
  suppressNextGlobalClick = true;
  captureEvent(toEventName(trimmed, 'btn_clicked'), {
    button_name: trimmed,
    ...properties,
  });
  queueMicrotask(() => {
    suppressNextGlobalClick = false;
  });
}

/** Manual capture that also suppresses the global button listener for this click. */
export function captureNamedButton(
  label: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
  suffix = 'btn_clicked',
) {
  const trimmed = String(label || '').trim().slice(0, 120);
  if (!trimmed) return;
  suppressNextGlobalClick = true;
  captureEvent(toEventName(trimmed, suffix), {
    button_name: trimmed,
    ...properties,
  });
  queueMicrotask(() => {
    suppressNextGlobalClick = false;
  });
}

/** Visible / accessible name for a clicked control. */
export function labelFromElement(target: EventTarget | null): string {
  if (!(target instanceof Element)) return '';

  const el = target.closest(
    'button, a[href], [role="button"], input[type="submit"], input[type="button"], input[type="reset"]',
  );
  if (!el) return '';

  // Prefer stable analytics id when present
  const dataEvent = el.getAttribute('data-ph-event')?.trim();
  if (dataEvent) return dataEvent;

  if (el instanceof HTMLInputElement) {
    return (
      String(el.value || '').trim() ||
      el.getAttribute('aria-label')?.trim() ||
      el.getAttribute('name')?.trim() ||
      el.id ||
      'button'
    ).slice(0, 120);
  }

  const aria = el.getAttribute('aria-label')?.trim();
  if (aria) return aria.slice(0, 120);

  const title = el.getAttribute('title')?.trim();
  if (title) return title.slice(0, 120);

  const dataName = el.getAttribute('data-button-name')?.trim();
  if (dataName) return dataName.slice(0, 120);

  const text = String(el.textContent || '')
    .replace(/[→←↑↓➜➝➞➡︎▶️]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text) return text.slice(0, 120);

  const name = el.getAttribute('name')?.trim();
  if (name) return name.slice(0, 120);

  return (el.id || el.tagName.toLowerCase()).slice(0, 120);
}

let globalButtonTrackingInstalled = false;

/**
 * Capture every button / CTA click with an explicit event name:
 * e.g. book_a_call_btn_clicked (not a generic button_click).
 */
export function installGlobalButtonTracking() {
  if (typeof window === 'undefined' || globalButtonTrackingInstalled) return;
  globalButtonTrackingInstalled = true;

  document.addEventListener(
    'click',
    (event) => {
      if (suppressNextGlobalClick) {
        suppressNextGlobalClick = false;
        return;
      }

      const buttonName = labelFromElement(event.target);
      if (!buttonName) return;

      const el =
        event.target instanceof Element
          ? event.target.closest(
              'button, a[href], [role="button"], input[type="submit"], input[type="button"], input[type="reset"]',
            )
          : null;

      // data-ph-event may already be a full event name
      const eventName = /_btn_clicked$|_clicked$|_submitted$|_viewed$|_focused$|_sent$/.test(
        buttonName,
      )
        ? buttonName
        : toEventName(buttonName, 'btn_clicked');

      captureEvent(eventName, {
        button_name: buttonName,
        element_tag: el?.tagName?.toLowerCase() || null,
        element_id: el?.id || null,
        href: el instanceof HTMLAnchorElement ? el.href : null,
        pathname: window.location.pathname,
      });
    },
    true,
  );
}

export function identifyUser(distinctId: string, traits?: Record<string, string | null | undefined>) {
  if (typeof window === 'undefined' || !distinctId) return;
  try {
    posthog.identify(distinctId, traits);
  } catch {
    // ignore
  }
}

export { posthog };
