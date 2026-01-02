import { supabase } from './locations';
import { cache } from './cache';
import type { City } from './locations';

export type DistanceUnit = 'miles' | 'kilometers';

export interface NearbyCity extends City {
  distance_miles?: number;
  distance_km?: number;
}

export interface ProximityConfig {
  radius: number;
  unit: DistanceUnit;
}

const DEFAULT_RADIUS_MILES = 25;
const MILES_TO_KM = 1.60934;
const KM_TO_MILES = 0.621371;

export function convertDistance(
  distance: number,
  from: DistanceUnit,
  to: DistanceUnit
): number {
  if (from === to) return distance;

  if (from === 'miles' && to === 'kilometers') {
    return distance * MILES_TO_KM;
  }

  if (from === 'kilometers' && to === 'miles') {
    return distance * KM_TO_MILES;
  }

  return distance;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: DistanceUnit = 'miles'
): number {
  const R = unit === 'miles' ? 3958.8 : 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export async function getNearbyCitiesBySlug(
  citySlug: string,
  config: Partial<ProximityConfig> = {}
): Promise<NearbyCity[]> {
  const { radius = DEFAULT_RADIUS_MILES, unit = 'miles' } = config;
  const radiusMiles = unit === 'kilometers' ? radius * KM_TO_MILES : radius;

  const cacheKey = `proximity:slug:${citySlug}:${radiusMiles}`;
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

  const result = (data || []).map((city: any) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    state_id: city.state_id,
    district_id: city.district_id,
    latitude: city.latitude,
    longitude: city.longitude,
    distance_miles: city.distance_miles,
    distance_km: city.distance_miles * MILES_TO_KM,
    median_income: 0,
    avg_rent: 0,
    monthly_cost: 0,
    commute_time: 0,
    score_overall: 0,
    score_affordability: 0,
    score_jobs: 0,
    score_commute: 0,
    score_safety: 0,
    score_lifestyle: 0,
    created_at: '',
  }));

  cache.set(cacheKey, result, 600000);

  return result;
}

export async function getNearbyCitiesById(
  cityId: string,
  config: Partial<ProximityConfig> = {}
): Promise<NearbyCity[]> {
  const { radius = DEFAULT_RADIUS_MILES, unit = 'miles' } = config;
  const radiusMiles = unit === 'kilometers' ? radius * KM_TO_MILES : radius;

  const cacheKey = `proximity:id:${cityId}:${radiusMiles}`;
  const cached = cache.get<NearbyCity[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const { data, error } = await supabase.rpc('get_nearby_cities', {
    city_id: cityId,
    radius_miles: radiusMiles,
  });

  if (error) {
    console.error('Error fetching nearby cities:', error);
    return [];
  }

  const result = (data || []).map((city: any) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    state_id: city.state_id,
    district_id: city.district_id,
    latitude: city.latitude,
    longitude: city.longitude,
    distance_miles: city.distance_miles,
    distance_km: city.distance_miles * MILES_TO_KM,
    median_income: 0,
    avg_rent: 0,
    monthly_cost: 0,
    commute_time: 0,
    score_overall: 0,
    score_affordability: 0,
    score_jobs: 0,
    score_commute: 0,
    score_safety: 0,
    score_lifestyle: 0,
    created_at: '',
  }));

  cache.set(cacheKey, result, 600000);

  return result;
}

export async function getNearbyCitiesWithDetails(
  citySlug: string,
  config: Partial<ProximityConfig> = {}
): Promise<City[]> {
  const nearbyCities = await getNearbyCitiesBySlug(citySlug, config);

  if (nearbyCities.length === 0) {
    return [];
  }

  const slugs = nearbyCities.map((city) => city.slug);

  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .in('slug', slugs);

  if (error) {
    console.error('Error fetching city details:', error);
    return [];
  }

  const detailsMap = new Map(
    (data || []).map((city) => [city.slug, city])
  );

  return nearbyCities.map((nearbyCity) => {
    const details = detailsMap.get(nearbyCity.slug);
    return {
      ...details,
      ...nearbyCity,
    } as City;
  });
}

export async function getCityDistance(
  citySlug1: string,
  citySlug2: string,
  unit: DistanceUnit = 'miles'
): Promise<number | null> {
  const { data: cities, error } = await supabase
    .from('cities')
    .select('slug, latitude, longitude')
    .in('slug', [citySlug1, citySlug2]);

  if (error || !cities || cities.length !== 2) {
    console.error('Error fetching cities for distance calculation:', error);
    return null;
  }

  const city1 = cities.find((c) => c.slug === citySlug1);
  const city2 = cities.find((c) => c.slug === citySlug2);

  if (
    !city1 ||
    !city2 ||
    city1.latitude == null ||
    city1.longitude == null ||
    city2.latitude == null ||
    city2.longitude == null
  ) {
    return null;
  }

  return calculateDistance(
    city1.latitude,
    city1.longitude,
    city2.latitude,
    city2.longitude,
    unit
  );
}

export function formatDistance(distance: number, unit: DistanceUnit): string {
  return `${distance.toFixed(1)} ${unit === 'miles' ? 'mi' : 'km'}`;
}

export function isWithinRadius(
  distance: number,
  radius: number,
  unit: DistanceUnit = 'miles'
): boolean {
  return distance <= radius;
}
