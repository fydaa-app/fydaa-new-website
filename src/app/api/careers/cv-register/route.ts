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
      const leadPayload = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        mobileNumber: phone,
        graduationYear: String(new Date().getFullYear()),
        college: 'CV pool',
        course: 'Careers: CV pool registration',
        isStudent: false,
      };

      try {
        const res = await fetch(`${baseUrl}referrals/website-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload),
        });
        if (!res.ok && process.env.NODE_ENV === 'development') {
          console.warn('[api/careers/cv-register] website-lead returned', res.status);
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[api/careers/cv-register] website-lead forward failed', e);
        }
      }
    }

    return NextResponse.json({ ok: true, message: 'CV registration received.' });
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }
}
