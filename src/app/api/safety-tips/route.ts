import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔄 Forwarding this data to external API:', body);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch('https://mole-model-drake.ngrok-free.app/disaster-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔴 API responded with error:', errorText);
      throw new Error('Failed to fetch safety tips');
    }

    const data = await response.json();
    console.log('✅ Received safety tips:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in safety tips proxy:', error);
    return NextResponse.json({ error: 'Failed to fetch safety tips' }, { status: 500 });
  }
}
