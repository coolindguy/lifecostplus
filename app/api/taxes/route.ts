import { NextRequest, NextResponse } from 'next/server';
import {
  getLatestStateTaxes,
  getLatestCityTaxes,
  getLatestDistrictTaxes,
  compareCityTaxBurden,
  estimateAnnualTaxBurden,
} from '@/lib/taxes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locationType = searchParams.get('location_type') as 'state' | 'city' | 'district';
  const locationSlug = searchParams.get('location_slug');
  const action = searchParams.get('action') || 'latest';

  if (action === 'compare') {
    const compareSlugs = searchParams.get('compare_slugs');
    if (!compareSlugs) {
      return NextResponse.json({ error: 'Missing compare_slugs parameter' }, { status: 400 });
    }

    try {
      const slugsArray = compareSlugs.split(',');
      const comparison = await compareCityTaxBurden(slugsArray);
      return NextResponse.json(comparison);
    } catch (error) {
      console.error('Error comparing tax burden:', error);
      return NextResponse.json({ error: 'Failed to compare tax burden' }, { status: 500 });
    }
  }

  if (action === 'estimate') {
    const annualIncome = parseFloat(searchParams.get('annual_income') || '0');
    const propertyValue = parseFloat(searchParams.get('property_value') || '0');
    const annualSpending = parseFloat(searchParams.get('annual_spending') || '0');

    if (!locationSlug || annualIncome <= 0) {
      return NextResponse.json(
        { error: 'Missing required parameters for estimate' },
        { status: 400 }
      );
    }

    try {
      const estimate = await estimateAnnualTaxBurden(
        locationSlug,
        annualIncome,
        propertyValue,
        annualSpending
      );
      return NextResponse.json(estimate);
    } catch (error) {
      console.error('Error estimating tax burden:', error);
      return NextResponse.json({ error: 'Failed to estimate tax burden' }, { status: 500 });
    }
  }

  if (!locationType || !locationSlug) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    let data;
    switch (locationType) {
      case 'state':
        data = await getLatestStateTaxes(locationSlug);
        break;
      case 'city':
        data = await getLatestCityTaxes(locationSlug);
        break;
      case 'district':
        data = await getLatestDistrictTaxes(locationSlug);
        break;
      default:
        return NextResponse.json({ error: 'Invalid location_type' }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Tax data not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tax data:', error);
    return NextResponse.json({ error: 'Failed to fetch tax data' }, { status: 500 });
  }
}
