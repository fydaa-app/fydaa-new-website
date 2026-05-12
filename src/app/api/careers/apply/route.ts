import { NextRequest, NextResponse } from 'next/server';

/**
 * Accepts multipart job applications from the careers modal.
 * Wire this to your CRM or storage; by default it validates presence of core fields and returns success.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const positionTitle = String(formData.get('positionTitle') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const firstName = String(formData.get('firstName') ?? '').trim();

    if (!positionTitle || !email || !firstName) {
      return NextResponse.json({ ok: false, message: 'Missing required fields.' }, { status: 400 });
    }

    if (process.env.NODE_ENV === 'development') {
      for (const [key, value] of formData.entries()) {
        const display = value instanceof File ? `${value.name} (${value.size} bytes)` : String(value);
        console.info(`[api/careers/apply] ${key}:`, display);
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      const phone = String(formData.get('phone') ?? '').replace(/\D/g, '');
      const lastName = String(formData.get('lastName') ?? '').trim();
      const leadPayload = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        mobileNumber: phone,
        graduationYear: String(new Date().getFullYear()),
        college: String(formData.get('city') ?? ''),
        course: `Careers: ${positionTitle}`,
        isStudent: false,
      };

      try {
        const res = await fetch(`${baseUrl}referrals/website-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
        });
        if (!res.ok && process.env.NODE_ENV === 'development') {
          console.warn('[api/careers/apply] website-lead returned', res.status);
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[api/careers/apply] website-lead forward failed', e);
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'Application received.' });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }
}
