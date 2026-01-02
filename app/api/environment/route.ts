import { NextRequest, NextResponse } from 'next/server';
import {
  getLatestCityAirQuality,
  getCityAirQualityTrends,
  getLatestDistrictAirQuality,
  getDistrictAirQualityTrends,
  compareCityAirQuality,
} from '@/lib/environment';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locationType = searchParams.get('location_type') as 'city' | 'district';
  const locationSlug = searchParams.get('location_slug');
  const action = searchParams.get('action') || 'latest';
  const yearsBack = parseInt(searchParams.get('years_back') || '5', 10);
  const compareSlugs = searchParams.get('compare_slugs');

  if (action === 'compare' && compareSlugs) {
    try {
      const slugsArray = compareSlugs.split(',');
      const comparison = await compareCityAirQuality(slugsArray);
      return NextResponse.json(comparison);
    } catch (error) {
      console.error('Error comparing air quality:', error);
      return NextResponse.json({ error: 'Failed to compare air quality' }, { status: 500 });
    }
  }

  if (!locationType || !locationSlug) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (action === 'trends') {
      const trends =
        locationType === 'city'
          ? await getCityAirQualityTrends(locationSlug, yearsBack)
          : await getDistrictAirQualityTrends(locationSlug, yearsBack);
      return NextResponse.json(trends);
    } else {
      const data =
        locationType === 'city'
          ? await getLatestCityAirQuality(locationSlug)
          : await getLatestDistrictAirQuality(locationSlug);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return NextResponse.json({ error: 'Failed to fetch air quality data' }, { status: 500 });
  }
}
