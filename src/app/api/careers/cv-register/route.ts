import { NextRequest, NextResponse } from 'next/server';

/**
 * General CV pool registration from the careers page divider (no specific job).
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').replace(/\D/g, '');
    const resume = formData.get('resume');

    if (!firstName || !lastName || !email || phone.length !== 10) {
      return NextResponse.json({ ok: false, message: 'Missing or invalid contact details.' }, { status: 400 });
    }

    if (!resume || !(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ ok: false, message: 'CV file is required.' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'development') {
      for (const [key, value] of formData.entries()) {
        const display = value instanceof File ? `${value.name} (${value.size} bytes)` : String(value);
        console.info(`[api/careers/cv-register] ${key}:`, display);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}referrals/cv-register`, {
          method: 'POST',
          body: formData,
        });

        if (process.env.NODE_ENV === 'development') {
          console.info('[api/careers/cv-register] Forwarded to backend:', res.status);
        }

        // Return the backend's response with appropriate status and headers
        return new NextResponse(res.body, {
          status: res.status,
          headers: res.headers,
        });
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[api/careers/cv-register] Forwarding failed', e);
        }
        return NextResponse.json({ ok: false, message: 'Failed to forward to backend.' }, { status: 502 });
      }
    }

    // If no baseUrl is configured, return an error
    return NextResponse.json({ ok: false, message: 'Backend URL not configured.' }, { status: 500 });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }
}
