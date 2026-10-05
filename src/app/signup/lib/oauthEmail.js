const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';
const APPLE_SCRIPT = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('OAuth is only available in the browser.'));
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load sign-in script.')));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load sign-in script.'));
    document.head.appendChild(script);
  });
}

function decodeJwtPayload(credential) {
  try {
    const part = credential.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Google Identity Services — returns the user's email from the ID token.
 * Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID.
 */
export async function getEmailFromGoogle() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.');
  }
  await loadScript(GOOGLE_SCRIPT);
  if (!window.google?.accounts?.id) {
    throw new Error('Google sign-in failed to initialize.');
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Google sign-in timed out. Please try again.'));
    }, 120000);

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        clearTimeout(timeout);
        const payload = decodeJwtPayload(response?.credential || '');
        const email = payload?.email?.trim();
        if (!email) {
          reject(new Error('Could not read email from Google. Please try again.'));
          return;
        }
        resolve(email);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
        // Fallback: render a One Tap alternative via oauth2 code client popup
        try {
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'email profile openid',
            callback: async (tokenResponse) => {
              clearTimeout(timeout);
              if (tokenResponse?.error) {
                reject(new Error(tokenResponse.error_description || 'Google sign-in cancelled.'));
                return;
              }
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const data = await res.json();
                const email = data?.email?.trim();
                if (!email) {
                  reject(new Error('Could not read email from Google. Please try again.'));
                  return;
                }
                resolve(email);
              } catch {
                reject(new Error('Could not read email from Google. Please try again.'));
              }
            },
          });
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (err) {
          clearTimeout(timeout);
          reject(err instanceof Error ? err : new Error('Google sign-in failed.'));
        }
      }
    });
  });
}

/**
 * Apple JS SDK — returns the user's email when Apple provides it.
 * Requires NEXT_PUBLIC_APPLE_CLIENT_ID (Services ID) and optional NEXT_PUBLIC_APPLE_REDIRECT_URI.
 */
export async function getEmailFromApple() {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Apple sign-in is not configured. Set NEXT_PUBLIC_APPLE_CLIENT_ID.');
  }
  await loadScript(APPLE_SCRIPT);
  if (!window.AppleID?.auth) {
    throw new Error('Apple sign-in failed to initialize.');
  }

  const redirectURI =
    process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI ||
    (typeof window !== 'undefined' ? `${window.location.origin}/signup` : '');

  window.AppleID.auth.init({
    clientId,
    scope: 'name email',
    redirectURI,
    usePopup: true,
  });

  const response = await window.AppleID.auth.signIn();
  const idToken = response?.authorization?.id_token;
  const payload = idToken ? decodeJwtPayload(idToken) : null;
  const email =
    response?.user?.email?.trim() ||
    payload?.email?.trim() ||
    '';

  if (!email) {
    throw new Error(
      'Apple did not return an email. Use email + OTP, or share email with Apple and try again.'
    );
  }
  return email;
}
