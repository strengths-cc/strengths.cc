import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = typeof body?.linkedinUrl === 'string' ? body.linkedinUrl.trim() : '';

    if (!rawUrl) {
      return NextResponse.json({ error: 'LinkedIn URL is required' }, { status: 400 });
    }

    const normalizedUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    let parsed: URL;
    try {
      parsed = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (!parsed.hostname.toLowerCase().endsWith('linkedin.com')) {
      return NextResponse.json({ error: 'URL must be a linkedin.com profile' }, { status: 400 });
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return NextResponse.json({ photoUrl: null }, { status: 200 });
    }

    const html = await response.text();
    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    const candidate = ogMatch?.[1]?.replace(/&amp;/g, '&') || '';

    // Ignore generic LinkedIn placeholder banners
    if (
      candidate &&
      !candidate.includes('static.licdn.com/aero-v1/sc/h/') &&
      !candidate.includes('logo')
    ) {
      return NextResponse.json({ photoUrl: candidate }, { status: 200 });
    }

    return NextResponse.json({ photoUrl: null }, { status: 200 });
  } catch {
    return NextResponse.json({ photoUrl: null }, { status: 200 });
  }
}
