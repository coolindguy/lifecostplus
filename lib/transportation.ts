import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export interface TransportationData {
  cityId?: string;
  cityName?: string;
  districtId?: string;
  districtName?: string;
  year: number;
  avgCommuteTimeMinutes: number;
  medianCommuteTimeMinutes: number;
  publicTransitUsagePercent: number;
  carUsagePercent: number;
  carpoolUsagePercent: number;
  bikeUsagePercent: number;
  walkUsagePercent: number;
  workFromHomePercent: number;
  carDependencyScore: number;
  transitQualityScore: number;
  trafficCongestionIndex: number;
  commuteComputeMonthlyUsd: number;
}

export interface TransportationTrend {
  year: number;
  avgCommuteTimeMinutes: number;
  publicTransitUsagePercent: number;
  carUsagePercent: number;
  carDependencyScore: number;
  trafficCongestionIndex: number;
}

export interface TransportationComparison {
  cityName: string;
  citySlug: string;
  year: number;
  avgCommuteTimeMinutes: number;
  publicTransitUsagePercent: number;
  carDependencyScore: number;
  trafficCongestionIndex: number;
}

export interface NearbyTransportationCity {
  cityName: string;
  citySlug: string;
  distanceKm: number;
  avgCommuteTimeMinutes: number;
  publicTransitUsagePercent: number;
  carDependencyScore: number;
}

export async function getLatestCityTransportation(
  citySlug: string
): Promise<TransportationData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_city_transportation', {
      city_slug: citySlug,
    });

    if (error) {
      console.error('Error fetching city transportation data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const transportationData: TransportationData = {
      cityId: record.city_id,
      cityName: record.city_name,
      year: record.year,
      avgCommuteTimeMinutes: record.avg_commute_time_minutes,
      medianCommuteTimeMinutes: record.median_commute_time_minutes,
      publicTransitUsagePercent: record.public_transit_usage_percent,
      carUsagePercent: record.car_usage_percent,
      carpoolUsagePercent: record.carpool_usage_percent,
      bikeUsagePercent: record.bike_usage_percent,
      walkUsagePercent: record.walk_usage_percent,
      workFromHomePercent: record.work_from_home_percent,
      carDependencyScore: record.car_dependency_score,
      transitQualityScore: record.transit_quality_score,
      trafficCongestionIndex: record.traffic_congestion_index,
      commuteComputeMonthlyUsd: record.commute_cost_monthly_usd,
    };

    return transportationData;
  } catch (error) {
    console.error('Error fetching city transportation data:', error);
    return null;
  }
}

export async function getCityTransportationTrends(
  citySlug: string,
  yearsBack: number = 5
): Promise<TransportationTrend[]> {
  try {
    const { data, error } = await supabase.rpc('get_city_transportation_trends', {
      city_slug: citySlug,
      years_back: yearsBack,
    });

    if (error) {
      console.error('Error fetching city transportation trends:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const trends: TransportationTrend[] = data.map((record: any) => ({
      year: record.year,
      avgCommuteTimeMinutes: record.avg_commute_time_minutes,
      publicTransitUsagePercent: record.public_transit_usage_percent,
      carUsagePercent: record.car_usage_percent,
      carDependencyScore: record.car_dependency_score,
      trafficCongestionIndex: record.traffic_congestion_index,
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching city transportation trends:', error);
    return [];
  }
}

export async function getLatestDistrictTransportation(
  districtSlug: string
): Promise<TransportationData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_district_transportation', {
      district_slug: districtSlug,
    });

    if (error) {
      console.error('Error fetching district transportation data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const transportationData: TransportationData = {
      districtId: record.district_id,
      districtName: record.district_name,
      year: record.year,
      avgCommuteTimeMinutes: record.avg_commute_time_minutes,
      medianCommuteTimeMinutes: record.median_commute_time_minutes,
      publicTransitUsagePercent: record.public_transit_usage_percent,
      carUsagePercent: record.car_usage_percent,
      carpoolUsagePercent: record.carpool_usage_percent,
      bikeUsagePercent: record.bike_usage_percent,
      walkUsagePercent: record.walk_usage_percent,
      workFromHomePercent: record.work_from_home_percent,
      carDependencyScore: record.car_dependency_score,
      transitQualityScore: record.transit_quality_score,
      trafficCongestionIndex: record.traffic_congestion_index,
      commuteComputeMonthlyUsd: record.commute_cost_monthly_usd,
    };

    return transportationData;
  } catch (error) {
    console.error('Error fetching district transportation data:', error);
    return null;
  }
}

export async function getDistrictTransportationTrends(
  districtSlug: string,
  yearsBack: number = 5
): Promise<TransportationTrend[]> {
  try {
    const { data, error } = await supabase.rpc('get_district_transportation_trends', {
      district_slug: districtSlug,
      years_back: yearsBack,
    });

    if (error) {
      console.error('Error fetching district transportation trends:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const trends: TransportationTrend[] = data.map((record: any) => ({
      year: record.year,
      avgCommuteTimeMinutes: record.avg_commute_time_minutes,
      publicTransitUsagePercent: record.public_transit_usage_percent,
      carUsagePercent: record.car_usage_percent,
      carDependencyScore: record.car_dependency_score,
      trafficCongestionIndex: record.traffic_congestion_index,
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching district transportation trends:', error);
    return [];
  }
}

export async function compareCityTransportation(
  citySlugs: string[]
): Promise<TransportationComparison[]> {
  try {
    const { data, error } = await supabase.rpc('compare_city_transportation', {
      city_slugs: citySlugs,
    });

    if (error) {
      console.error('Error comparing city transportation:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const comparisons: TransportationComparison[] = data.map((record: any) => ({
      cityName: record.city_name,
      citySlug: record.city_slug,
      year: record.year,
      avgCommuteTimeMinutes: record.avg_commute_time_minutes,
      publicTransitUsagePercent: record.public_transit_usage_percent,
      carDependencyScore: record.car_dependency_score,
      trafficCongestionIndex: record.traffic_congestion_index,
    }));

    return comparisons;
  } catch (error) {
    console.error('Error comparing city transportation:', error);
    return [];
  }
}

export async function findCitiesByTransportationCriteria(
  referenceCitySlug: string,
  radiusKm: number,
  maxCommuteTime?: number,
  minTransitUsage?: number,
  maxCarDependency?: number
): Promise<NearbyTransportationCity[]> {
  try {
    const { data, error } = await supabase.rpc('find_cities_by_transportation_criteria', {
      reference_city_slug: referenceCitySlug,
      radius_km: radiusKm,
      max_commute_time: maxCommuteTime || null,
      min_transit_usage: minTransitUsage || null,
      max_car_dependency: maxCarDependency || null,
    });

    if (error) {
      console.error('Error finding cities by transportation criteria:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const cities: NearbyTransportationCity[] = data.map((record: any) => ({
      cityName: record.city_name,
      citySlug: record.city_slug,
      distanceKm: record.distance_km,
      avgCommuteTimeMinutes: record.avg_commute_time_minutes,
      publicTransitUsagePercent: record.public_transit_usage_percent,
      carDependencyScore: record.car_dependency_score,
    }));

    return cities;
  } catch (error) {
    console.error('Error finding cities by transportation criteria:', error);
    return [];
  }
}

export function getCommuteTimeRating(minutes: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (minutes <= 20) {
    return {
      rating: 'Excellent',
      color: 'text-green-700 bg-green-50 border-green-200',
      description: 'Very short commute',
    };
  } else if (minutes <= 30) {
    return {
      rating: 'Good',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      description: 'Reasonable commute time',
    };
  } else if (minutes <= 40) {
    return {
      rating: 'Moderate',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      description: 'Average commute time',
    };
  } else if (minutes <= 50) {
    return {
      rating: 'Long',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      description: 'Above average commute',
    };
  } else {
    return {
      rating: 'Very Long',
      color: 'text-red-700 bg-red-50 border-red-200',
      description: 'Lengthy commute time',
    };
  }
}

export function getCarDependencyRating(score: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (score <= 30) {
    return {
      rating: 'Low Dependency',
      color: 'text-green-700',
      description: 'Excellent transportation options',
    };
  } else if (score <= 50) {
    return {
      rating: 'Moderate Dependency',
      color: 'text-blue-700',
      description: 'Good alternative options',
    };
  } else if (score <= 70) {
    return {
      rating: 'High Dependency',
      color: 'text-orange-700',
      description: 'Limited alternatives',
    };
  } else {
    return {
      rating: 'Very High Dependency',
      color: 'text-red-700',
      description: 'Car essential for most trips',
    };
  }
}

export function getTransitQualityRating(score: number): {
  rating: string;
  color: string;
} {
  if (score >= 80) {
    return { rating: 'Excellent', color: 'text-green-700' };
  } else if (score >= 60) {
    return { rating: 'Good', color: 'text-blue-700' };
  } else if (score >= 40) {
    return { rating: 'Fair', color: 'text-yellow-700' };
  } else if (score >= 20) {
    return { rating: 'Poor', color: 'text-orange-700' };
  } else {
    return { rating: 'Very Poor', color: 'text-red-700' };
  }
}

export function getTrafficCongestionRating(index: number): {
  rating: string;
  color: string;
} {
  if (index <= 20) {
    return { rating: 'Minimal', color: 'text-green-700' };
  } else if (index <= 40) {
    return { rating: 'Light', color: 'text-blue-700' };
  } else if (index <= 60) {
    return { rating: 'Moderate', color: 'text-yellow-700' };
  } else if (index <= 80) {
    return { rating: 'Heavy', color: 'text-orange-700' };
  } else {
    return { rating: 'Severe', color: 'text-red-700' };
  }
}

export function calculateYearOverYearCommuteChange(trends: TransportationTrend[]): {
  commuteChange: number;
  transitUsageChange: number;
  carDependencyChange: number;
  direction: 'improving' | 'worsening' | 'stable';
} | null {
  if (trends.length < 2) {
    return null;
  }

  const latest = trends[0];
  const previous = trends[1];

  const commuteChange =
    ((latest.avgCommuteTimeMinutes - previous.avgCommuteTimeMinutes) /
      previous.avgCommuteTimeMinutes) *
    100;
  const transitUsageChange =
    ((latest.publicTransitUsagePercent - previous.publicTransitUsagePercent) /
      previous.publicTransitUsagePercent) *
    100;
  const carDependencyChange =
    ((latest.carDependencyScore - previous.carDependencyScore) / previous.carDependencyScore) *
    100;

  let direction: 'improving' | 'worsening' | 'stable' = 'stable';
  if (commuteChange < -2 || transitUsageChange > 5 || carDependencyChange < -5) {
    direction = 'improving';
  } else if (commuteChange > 2 || transitUsageChange < -5 || carDependencyChange > 5) {
    direction = 'worsening';
  }

  return {
    commuteChange,
    transitUsageChange,
    carDependencyChange,
    direction,
  };
}
