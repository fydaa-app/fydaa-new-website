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
  captureEvent('webapp_button_click', {
    button_label: trimmed,
    ...properties,
  });
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
