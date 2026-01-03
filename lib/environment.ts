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

export interface AirQualityData {
  cityId?: string;
  cityName?: string;
  districtId?: string;
  districtName?: string;
  year: number;
  currentAqi: number;
  avgAnnualAqi: number;
  currentPm25: number;
  avgAnnualPm25: number;
  currentPm10: number;
  avgAnnualPm10: number;
  ozoneLevel: number;
  no2Level: number;
  goodAirDays: number;
  unhealthyAirDays: number;
}

export interface AirQualityTrend {
  year: number;
  avgAnnualAqi: number;
  avgAnnualPm25: number;
  avgAnnualPm10: number;
  goodAirDays: number;
  unhealthyAirDays: number;
}

export interface AirQualityComparison {
  cityName: string;
  citySlug: string;
  year: number;
  avgAnnualAqi: number;
  avgAnnualPm25: number;
  goodAirDays: number;
}

export async function getLatestCityAirQuality(citySlug: string): Promise<AirQualityData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_city_air_quality', {
      city_slug: citySlug,
    });

    if (error) {
      console.error('Error fetching city air quality data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const airQualityData: AirQualityData = {
      cityId: record.city_id,
      cityName: record.city_name,
      year: record.year,
      currentAqi: record.current_aqi,
      avgAnnualAqi: record.avg_annual_aqi,
      currentPm25: record.current_pm25,
      avgAnnualPm25: record.avg_annual_pm25,
      currentPm10: record.current_pm10,
      avgAnnualPm10: record.avg_annual_pm10,
      ozoneLevel: record.ozone_level,
      no2Level: record.no2_level,
      goodAirDays: record.good_air_days,
      unhealthyAirDays: record.unhealthy_air_days,
    };

    return airQualityData;
  } catch (error) {
    console.error('Error fetching city air quality data:', error);
    return null;
  }
}

export async function getCityAirQualityTrends(
  citySlug: string,
  yearsBack: number = 5
): Promise<AirQualityTrend[]> {
  try {
    const { data, error } = await supabase.rpc('get_city_air_quality_trends', {
      city_slug: citySlug,
      years_back: yearsBack,
    });

    if (error) {
      console.error('Error fetching city air quality trends:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const trends: AirQualityTrend[] = data.map((record: any) => ({
      year: record.year,
      avgAnnualAqi: record.avg_annual_aqi,
      avgAnnualPm25: record.avg_annual_pm25,
      avgAnnualPm10: record.avg_annual_pm10,
      goodAirDays: record.good_air_days,
      unhealthyAirDays: record.unhealthy_air_days,
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching city air quality trends:', error);
    return [];
  }
}

export async function getLatestDistrictAirQuality(
  districtSlug: string
): Promise<AirQualityData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_district_air_quality', {
      district_slug: districtSlug,
    });

    if (error) {
      console.error('Error fetching district air quality data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const airQualityData: AirQualityData = {
      districtId: record.district_id,
      districtName: record.district_name,
      year: record.year,
      currentAqi: record.current_aqi,
      avgAnnualAqi: record.avg_annual_aqi,
      currentPm25: record.current_pm25,
      avgAnnualPm25: record.avg_annual_pm25,
      currentPm10: record.current_pm10,
      avgAnnualPm10: record.avg_annual_pm10,
      ozoneLevel: record.ozone_level,
      no2Level: record.no2_level,
      goodAirDays: record.good_air_days,
      unhealthyAirDays: record.unhealthy_air_days,
    };

    return airQualityData;
  } catch (error) {
    console.error('Error fetching district air quality data:', error);
    return null;
  }
}

export async function getDistrictAirQualityTrends(
  districtSlug: string,
  yearsBack: number = 5
): Promise<AirQualityTrend[]> {
  try {
    const { data, error } = await supabase.rpc('get_district_air_quality_trends', {
      district_slug: districtSlug,
      years_back: yearsBack,
    });

    if (error) {
      console.error('Error fetching district air quality trends:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const trends: AirQualityTrend[] = data.map((record: any) => ({
      year: record.year,
      avgAnnualAqi: record.avg_annual_aqi,
      avgAnnualPm25: record.avg_annual_pm25,
      avgAnnualPm10: record.avg_annual_pm10,
      goodAirDays: record.good_air_days,
      unhealthyAirDays: record.unhealthy_air_days,
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching district air quality trends:', error);
    return [];
  }
}

export async function compareCityAirQuality(
  citySlugs: string[]
): Promise<AirQualityComparison[]> {
  try {
    const { data, error } = await supabase.rpc('compare_city_air_quality', {
      city_slugs: citySlugs,
    });

    if (error) {
      console.error('Error comparing city air quality:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const comparisons: AirQualityComparison[] = data.map((record: any) => ({
      cityName: record.city_name,
      citySlug: record.city_slug,
      year: record.year,
      avgAnnualAqi: record.avg_annual_aqi,
      avgAnnualPm25: record.avg_annual_pm25,
      goodAirDays: record.good_air_days,
    }));

    return comparisons;
  } catch (error) {
    console.error('Error comparing city air quality:', error);
    return [];
  }
}

export function getAirQualityRating(aqi: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (aqi <= 50) {
    return {
      rating: 'Good',
      color: 'text-green-700 bg-green-50 border-green-200',
      description: 'Air quality is satisfactory',
    };
  } else if (aqi <= 100) {
    return {
      rating: 'Moderate',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      description: 'Acceptable air quality',
    };
  } else if (aqi <= 150) {
    return {
      rating: 'Unhealthy for Sensitive Groups',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      description: 'May affect sensitive individuals',
    };
  } else if (aqi <= 200) {
    return {
      rating: 'Unhealthy',
      color: 'text-red-700 bg-red-50 border-red-200',
      description: 'Everyone may experience health effects',
    };
  } else if (aqi <= 300) {
    return {
      rating: 'Very Unhealthy',
      color: 'text-red-800 bg-red-100 border-red-300',
      description: 'Health alert: serious effects for everyone',
    };
  } else {
    return {
      rating: 'Hazardous',
      color: 'text-red-900 bg-red-200 border-red-400',
      description: 'Emergency conditions: everyone affected',
    };
  }
}

export function getPollutantLevel(value: number, type: 'pm25' | 'pm10'): {
  level: string;
  color: string;
} {
  if (type === 'pm25') {
    if (value <= 12) {
      return { level: 'Good', color: 'text-green-700' };
    } else if (value <= 35.4) {
      return { level: 'Moderate', color: 'text-yellow-700' };
    } else if (value <= 55.4) {
      return { level: 'Unhealthy (Sensitive)', color: 'text-orange-700' };
    } else if (value <= 150.4) {
      return { level: 'Unhealthy', color: 'text-red-700' };
    } else if (value <= 250.4) {
      return { level: 'Very Unhealthy', color: 'text-red-800' };
    } else {
      return { level: 'Hazardous', color: 'text-red-900' };
    }
  } else {
    if (value <= 54) {
      return { level: 'Good', color: 'text-green-700' };
    } else if (value <= 154) {
      return { level: 'Moderate', color: 'text-yellow-700' };
    } else if (value <= 254) {
      return { level: 'Unhealthy (Sensitive)', color: 'text-orange-700' };
    } else if (value <= 354) {
      return { level: 'Unhealthy', color: 'text-red-700' };
    } else if (value <= 424) {
      return { level: 'Very Unhealthy', color: 'text-red-800' };
    } else {
      return { level: 'Hazardous', color: 'text-red-900' };
    }
  }
}

export function calculateYearOverYearAirQualityChange(trends: AirQualityTrend[]): {
  aqiChange: number;
  pm25Change: number;
  pm10Change: number;
  direction: 'improving' | 'worsening' | 'stable';
} | null {
  if (trends.length < 2) {
    return null;
  }

  const latest = trends[0];
  const previous = trends[1];

  const aqiChange =
    ((latest.avgAnnualAqi - previous.avgAnnualAqi) / previous.avgAnnualAqi) * 100;
  const pm25Change =
    ((latest.avgAnnualPm25 - previous.avgAnnualPm25) / previous.avgAnnualPm25) * 100;
  const pm10Change =
    ((latest.avgAnnualPm10 - previous.avgAnnualPm10) / previous.avgAnnualPm10) * 100;

  let direction: 'improving' | 'worsening' | 'stable' = 'stable';
  if (aqiChange < -2) {
    direction = 'improving';
  } else if (aqiChange > 2) {
    direction = 'worsening';
  }

  return {
    aqiChange,
    pm25Change,
    pm10Change,
    direction,
  };
}
