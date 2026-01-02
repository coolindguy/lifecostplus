import { NextRequest, NextResponse } from 'next/server';
import {
  getLatestCityTransportation,
  getCityTransportationTrends,
  getLatestDistrictTransportation,
  getDistrictTransportationTrends,
  compareCityTransportation,
  findCitiesByTransportationCriteria,
} from '@/lib/transportation';

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
      const comparison = await compareCityTransportation(slugsArray);
      return NextResponse.json(comparison);
    } catch (error) {
      console.error('Error comparing transportation:', error);
      return NextResponse.json({ error: 'Failed to compare transportation' }, { status: 500 });
    }
  }

  if (action === 'find_nearby') {
    const radiusKm = parseFloat(searchParams.get('radius_km') || '0');
    const maxCommuteTime = searchParams.get('max_commute_time')
      ? parseFloat(searchParams.get('max_commute_time')!)
      : undefined;
    const minTransitUsage = searchParams.get('min_transit_usage')
      ? parseFloat(searchParams.get('min_transit_usage')!)
      : undefined;
    const maxCarDependency = searchParams.get('max_car_dependency')
      ? parseFloat(searchParams.get('max_car_dependency')!)
      : undefined;

    if (!locationSlug || radiusKm <= 0) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
      const cities = await findCitiesByTransportationCriteria(
        locationSlug,
        radiusKm,
        maxCommuteTime,
        minTransitUsage,
        maxCarDependency
      );
      return NextResponse.json(cities);
    } catch (error) {
      console.error('Error finding cities by transportation criteria:', error);
      return NextResponse.json(
        { error: 'Failed to find cities by transportation criteria' },
        { status: 500 }
      );
    }
  }

  if (!locationType || !locationSlug) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (action === 'trends') {
      const trends =
        locationType === 'city'
          ? await getCityTransportationTrends(locationSlug, yearsBack)
          : await getDistrictTransportationTrends(locationSlug, yearsBack);
      return NextResponse.json(trends);
    } else {
      const data =
        locationType === 'city'
          ? await getLatestCityTransportation(locationSlug)
          : await getLatestDistrictTransportation(locationSlug);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching transportation data:', error);
    return NextResponse.json({ error: 'Failed to fetch transportation data' }, { status: 500 });
  }
}
