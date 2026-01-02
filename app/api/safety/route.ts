import { NextRequest, NextResponse } from 'next/server';
import {
  getLatestCityCrimeData,
  getCityCrimeTrends,
  getLatestDistrictCrimeData,
  getDistrictCrimeTrends,
  compareCityCrimeRates,
} from '@/lib/safety';

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
      const comparison = await compareCityCrimeRates(slugsArray);
      return NextResponse.json(comparison);
    } catch (error) {
      console.error('Error comparing crime rates:', error);
      return NextResponse.json({ error: 'Failed to compare crime rates' }, { status: 500 });
    }
  }

  if (!locationType || !locationSlug) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (action === 'trends') {
      const trends =
        locationType === 'city'
          ? await getCityCrimeTrends(locationSlug, yearsBack)
          : await getDistrictCrimeTrends(locationSlug, yearsBack);
      return NextResponse.json(trends);
    } else {
      const data =
        locationType === 'city'
          ? await getLatestCityCrimeData(locationSlug)
          : await getLatestDistrictCrimeData(locationSlug);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching safety data:', error);
    return NextResponse.json({ error: 'Failed to fetch safety data' }, { status: 500 });
  }
}
