import { NextRequest, NextResponse } from 'next/server';
import { getSchoolDistrictsByCity, getSchoolDistrictsByType, getEducationStatsByCity } from '@/lib/education';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cityId = searchParams.get('city_id');
  const type = searchParams.get('type') as 'public' | 'private' | null;
  const statsOnly = searchParams.get('stats_only') === 'true';

  if (!cityId) {
    return NextResponse.json(
      { error: 'Missing city_id parameter' },
      { status: 400 }
    );
  }

  try {
    if (statsOnly) {
      const stats = await getEducationStatsByCity(cityId);
      return NextResponse.json(stats);
    }

    let districts;
    if (type) {
      districts = await getSchoolDistrictsByType(cityId, type);
    } else {
      districts = await getSchoolDistrictsByCity(cityId);
    }

    return NextResponse.json(districts);
  } catch (error) {
    console.error('Error fetching education data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education data' },
      { status: 500 }
    );
  }
}
