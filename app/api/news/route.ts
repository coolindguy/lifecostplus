import { NextRequest, NextResponse } from 'next/server';
import { getNewsByLocation } from '@/lib/news';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locationType = searchParams.get('location_type') as 'city' | 'state';
  const locationId = searchParams.get('location_id');
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!locationType || !locationId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const news = await getNewsByLocation(locationType, locationId, category, limit);
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
