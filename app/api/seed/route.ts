import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import citiesData from '@/data/cities.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const stateNames: Record<string, string> = {
  'NC': 'North Carolina',
  'TX': 'Texas',
  'CO': 'Colorado',
  'TN': 'Tennessee',
  'ID': 'Idaho',
  'AZ': 'Arizona',
  'OR': 'Oregon',
  'OH': 'Ohio',
  'FL': 'Florida',
  'MN': 'Minnesota',
  'UT': 'Utah',
  'IN': 'Indiana',
  'MO': 'Missouri',
};

const countyMapping: Record<string, string> = {
  'raleigh-nc': 'Wake County',
  'austin-tx': 'Travis County',
  'denver-co': 'Denver County',
  'nashville-tn': 'Davidson County',
  'boise-id': 'Ada County',
  'phoenix-az': 'Maricopa County',
  'portland-or': 'Multnomah County',
  'charlotte-nc': 'Mecklenburg County',
  'columbus-oh': 'Franklin County',
  'san-antonio-tx': 'Bexar County',
  'minneapolis-mn': 'Hennepin County',
  'tampa-fl': 'Hillsborough County',
  'salt-lake-city-ut': 'Salt Lake County',
  'indianapolis-in': 'Marion County',
  'kansas-city-mo': 'Jackson County',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const logs: string[] = [];

    logs.push('Starting location seeding...');

    // 1. Create USA country
    const { data: country, error: countryError } = await supabase
      .from('countries')
      .upsert({
        name: 'United States',
        slug: 'united-states',
        code: 'US',
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (countryError) {
      throw new Error(`Error creating country: ${countryError.message}`);
    }

    logs.push(`Created country: ${country.name}`);

    // 2. Create states
    const uniqueStates = Array.from(new Set(citiesData.map((city: any) => city.state)));
    const stateMap: Record<string, string> = {};

    for (const stateCode of uniqueStates) {
      const stateName = stateNames[stateCode] || stateCode;
      const stateSlug = slugify(stateName);

      const { data: state, error: stateError } = await supabase
        .from('states')
        .upsert({
          country_id: country.id,
          name: stateName,
          slug: stateSlug,
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (stateError) {
        logs.push(`Error creating state ${stateName}: ${stateError.message}`);
        continue;
      }

      stateMap[stateCode] = state.id;
      logs.push(`Created state: ${stateName}`);
    }

    // 3. Create districts
    const districtMap: Record<string, string> = {};

    for (const [citySlug, countyName] of Object.entries(countyMapping)) {
      const city = citiesData.find((c: any) => c.slug === citySlug);
      if (!city) continue;

      const stateId = stateMap[city.state];
      if (!stateId) continue;

      const districtSlug = slugify(countyName);

      const { data: district, error: districtError } = await supabase
        .from('districts')
        .upsert({
          state_id: stateId,
          name: countyName,
          slug: districtSlug,
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (districtError) {
        logs.push(`Error creating district ${countyName}: ${districtError.message}`);
        continue;
      }

      districtMap[citySlug] = district.id;
      logs.push(`Created district: ${countyName}`);
    }

    // 4. Create cities
    for (const city of citiesData) {
      const stateId = stateMap[city.state];
      const districtId = districtMap[city.slug];

      const { error: cityError } = await supabase
        .from('cities')
        .upsert({
          state_id: stateId,
          district_id: districtId || null,
          name: city.name,
          slug: city.slug,
          median_income: city.medianIncome,
          avg_rent: city.avgRent,
          monthly_cost: city.monthlyCost,
          commute_time: city.commuteTime,
          score_overall: city.scores.overall,
          score_affordability: city.scores.affordability,
          score_jobs: city.scores.jobs,
          score_commute: city.scores.commute,
          score_safety: city.scores.safety,
          score_lifestyle: city.scores.lifestyle,
          latitude: city.lat,
          longitude: city.lng,
        }, { onConflict: 'slug' });

      if (cityError) {
        logs.push(`Error creating city ${city.name}: ${cityError.message}`);
        continue;
      }

      logs.push(`Created city: ${city.name}`);
    }

    logs.push('Location seeding completed!');

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
