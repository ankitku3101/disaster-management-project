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
    const response = await fetch(
      `https://mole-model-drake.ngrok-free.app/get-current-weather?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Weather API] Raw response:', data);

    // Transform the data into our expected format
    const transformedData = {
      temperature: data.temp ? Math.round(data.temp - 273.15) : 0, // Convert Kelvin to Celsius
      condition: data.weather?.[0]?.main || 'Unknown',
      humidity: data.humidity || 0,
      windSpeed: data.wind_speed || 0
    };

    console.log('[Weather API] Transformed data:', transformedData);
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('[Weather API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 