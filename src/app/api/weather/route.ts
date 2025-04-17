import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    console.log('[Weather API] Fetching weather data for:', { lat, lon });

    const apiUrl = `https://mole-model-drake.ngrok-free.app/get-current-weather?lat=${lat}&lon=${lon}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Weather API] Failed response text:', errorText);
      throw new Error(`Weather API responded with status: ${response.status} — ${errorText}`);
    }

    const data = await response.json();
    console.log('[Weather API] Raw response:', data);

    // ✅ Transform the data
    const transformedData = {
      temperature: data.temp ? Math.round(data.temp - 273.15) : 0,
      condition: data.weather?.[0]?.main || 'Unknown',
      humidity: data.humidity || 0,
      windSpeed: data.wind_speed || 0,
    };

    console.log('[Weather API] Transformed data:', transformedData);
    return NextResponse.json(transformedData);

  } catch (error) {
    console.error('[Weather API] Error:', error);

    // 👇 Optional fallback mock if needed for demo/dev
    return NextResponse.json({
      temperature: 30,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 12,
      error: 'Live weather data fetch failed. Showing mock data.',
    }, { status: 200 });
  }
}
