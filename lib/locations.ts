import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cache } from './cache';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export interface Country {
  id: string;
  name: string;
  slug: string;
  code: string;
  created_at: string;
}

export interface State {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface District {
  id: string;
  state_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface City {
  id: string;
  district_id?: string;
  state_id?: string;
  name: string;
  slug: string;
  median_income: number;
  avg_rent: number;
  monthly_cost: number;
  commute_time: number;
  score_overall: number;
  score_affordability: number;
  score_jobs: number;
  score_commute: number;
  score_safety: number;
  score_lifestyle: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface LocationHierarchy {
  country?: Country;
  state?: State;
  district?: District;
  city?: City;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  slug: string;
}

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching countries:', error);
    return [];
  }

  return data || [];
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  const cacheKey = `country:${slug}`;
  const cached = cache.get<Country>(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching country:', error);
    return null;
  }

  if (data) {
    cache.set(cacheKey, data, 600000);
  }

  return data;
}

export async function getStatesByCountry(countrySlug: string): Promise<State[]> {
  const { data, error } = await supabase
    .from('states')
    .select('*, countries!inner(slug)')
    .eq('countries.slug', countrySlug)
    .order('name');

  if (error) {
    console.error('Error fetching states:', error);
    return [];
  }

  return data || [];
}

export async function getStateBySlug(slug: string): Promise<State | null> {
  const cacheKey = `state:${slug}`;
  const cached = cache.get<State>(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabase
    .from('states')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching state:', error);
    return null;
  }

  if (data) {
    cache.set(cacheKey, data, 600000);
  }

  return data;
}

export async function getDistrictsByState(stateSlug: string): Promise<District[]> {
  const { data, error } = await supabase
    .from('districts')
    .select('*, states!inner(slug)')
    .eq('states.slug', stateSlug)
    .order('name');

  if (error) {
    console.error('Error fetching districts:', error);
    return [];
  }

  return data || [];
}

export async function getDistrictBySlug(slug: string): Promise<District | null> {
  const { data, error } = await supabase
    .from('districts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching district:', error);
    return null;
  }

  return data;
}

export async function getCitiesByDistrict(districtSlug: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*, districts!inner(slug)')
    .eq('districts.slug', districtSlug)
    .order('name');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

export async function getCitiesByState(stateSlug: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*, states!inner(slug)')
    .eq('states.slug', stateSlug)
    .order('name');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const cacheKey = `city:${slug}`;
  const cached = cache.get<City>(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching city:', error);
    return null;
  }

  if (data) {
    cache.set(cacheKey, data, 300000);
  }

  return data;
}

export async function getLocationHierarchy(
  countrySlug?: string,
  stateSlug?: string,
  districtSlug?: string,
  citySlug?: string
): Promise<LocationHierarchy> {
  const hierarchy: LocationHierarchy = {};

  if (countrySlug) {
    const country = await getCountryBySlug(countrySlug);
    if (country) hierarchy.country = country;
  }

  if (stateSlug) {
    const state = await getStateBySlug(stateSlug);
    if (state) hierarchy.state = state;
  }

  if (districtSlug) {
    const district = await getDistrictBySlug(districtSlug);
    if (district) hierarchy.district = district;
  }

  if (citySlug) {
    const city = await getCityBySlug(citySlug);
    if (city) hierarchy.city = city;
  }

  return hierarchy;
}

export function buildBreadcrumbs(hierarchy: LocationHierarchy): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  if (hierarchy.country) {
    breadcrumbs.push({
      label: hierarchy.country.name,
      href: `/location/${hierarchy.country.slug}`,
      slug: hierarchy.country.slug,
    });
  }

  if (hierarchy.state) {
    breadcrumbs.push({
      label: hierarchy.state.name,
      href: `/location/${hierarchy.country?.slug}/${hierarchy.state.slug}`,
      slug: hierarchy.state.slug,
    });
  }

  if (hierarchy.district) {
    breadcrumbs.push({
      label: hierarchy.district.name,
      href: `/location/${hierarchy.country?.slug}/${hierarchy.state?.slug}/${hierarchy.district.slug}`,
      slug: hierarchy.district.slug,
    });
  }

  if (hierarchy.city) {
    breadcrumbs.push({
      label: hierarchy.city.name,
      href: `/location/${hierarchy.country?.slug}/${hierarchy.state?.slug}/${hierarchy.district?.slug || '_'}/${hierarchy.city.slug}`,
      slug: hierarchy.city.slug,
    });
  }

  return breadcrumbs;
}

export async function getAllCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching all cities:', error);
    return [];
  }

  return data || [];
}

export interface NearbyCity extends City {
  distance_miles?: number;
  distance_km?: number;
}

export async function getNearbyCities(
  citySlug: string,
  radiusMiles: number = 25
): Promise<NearbyCity[]> {
  const cacheKey = `nearby:${citySlug}:${radiusMiles}`;
  const cached = cache.get<NearbyCity[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabase.rpc('get_nearby_cities_by_slug', {
    city_slug: citySlug,
    radius_miles: radiusMiles,
  });

  if (error) {
    console.error('Error fetching nearby cities:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const slugs = data.map((city: any) => city.slug);
  const { data: citiesData, error: citiesError } = await supabase
    .from('cities')
    .select(`
      *,
      states (
        name,
        slug
      )
    `)
    .in('slug', slugs);

  if (citiesError) {
    console.error('Error fetching city details:', citiesError);
    return [];
  }

  const detailsMap = new Map(
    (citiesData || []).map((city: any) => [city.slug, city])
  );

  const result = data.map((nearbyCity: any) => {
    const details: any = detailsMap.get(nearbyCity.slug);
    return {
      id: details?.id,
      name: details?.name,
      slug: details?.slug,
      state: details?.states?.name || '',
      latitude: nearbyCity.latitude,
      longitude: nearbyCity.longitude,
      median_income: details?.median_income,
      avg_rent: details?.avg_rent,
      monthly_cost: details?.monthly_cost,
      commute_time: details?.commute_time,
      score_overall: details?.score_overall,
      score_affordability: details?.score_affordability,
      score_jobs: details?.score_jobs,
      score_commute: details?.score_commute,
      score_safety: details?.score_safety,
      score_lifestyle: details?.score_lifestyle,
      monthlyCost: details?.monthly_cost,
      avgRent: details?.avg_rent,
      commuteTime: details?.commute_time,
      medianIncome: details?.median_income,
      scores: {
        overall: details?.score_overall,
        affordability: details?.score_affordability,
        jobs: details?.score_jobs,
        commute: details?.score_commute,
        safety: details?.score_safety,
        lifestyle: details?.score_lifestyle,
      },
      distance_miles: nearbyCity.distance_miles,
      distance_km: nearbyCity.distance_miles * 1.60934,
      created_at: details?.created_at,
    } as NearbyCity;
  });

  cache.set(cacheKey, result, 600000);

  return result;
}
