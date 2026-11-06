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

export function captureButtonClick(
  label: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  const trimmed = String(label || '').trim().slice(0, 120);
  if (!trimmed) return;
  captureEvent('button_click', {
    button_name: trimmed,
    button_label: trimmed,
    ...properties,
  });
}

/** Visible / accessible name for a clicked control. */
export function labelFromElement(target: EventTarget | null): string {
  if (!(target instanceof Element)) return '';

  const el = target.closest(
    'button, a[href], [role="button"], input[type="submit"], input[type="button"], input[type="reset"]',
  );
  if (!el) return '';

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
    .replace(/\s+/g, ' ')
    .trim();
  if (text) return text.slice(0, 120);

  const name = el.getAttribute('name')?.trim();
  if (name) return name.slice(0, 120);

  return (el.id || el.tagName.toLowerCase()).slice(0, 120);
}

let globalButtonTrackingInstalled = false;

/**
 * Capture every button / CTA click site-wide with button_name = visible label.
 */
export function installGlobalButtonTracking() {
  if (typeof window === 'undefined' || globalButtonTrackingInstalled) return;
  globalButtonTrackingInstalled = true;

  document.addEventListener(
    'click',
    (event) => {
      const buttonName = labelFromElement(event.target);
      if (!buttonName) return;

      const el =
        event.target instanceof Element
          ? event.target.closest(
              'button, a[href], [role="button"], input[type="submit"], input[type="button"], input[type="reset"]',
            )
          : null;

      captureEvent('button_click', {
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
