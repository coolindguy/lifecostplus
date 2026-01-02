import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface CrimeData {
  cityId?: string;
  cityName?: string;
  districtId?: string;
  districtName?: string;
  year: number;
  violentCrimeRate: number;
  propertyCrimeRate: number;
  overallCrimeIndex: number;
  nationalAverageViolent: number;
  nationalAverageProperty: number;
}

export interface CrimeTrend {
  year: number;
  violentCrimeRate: number;
  propertyCrimeRate: number;
  overallCrimeIndex: number;
}

export interface SafetyComparison {
  cityName: string;
  citySlug: string;
  year: number;
  violentCrimeRate: number;
  propertyCrimeRate: number;
  overallCrimeIndex: number;
}

export async function getLatestCityCrimeData(citySlug: string): Promise<CrimeData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_city_crime_data', {
      city_slug: citySlug,
    });

    if (error) {
      console.error('Error fetching city crime data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const crimeData: CrimeData = {
      cityId: record.city_id,
      cityName: record.city_name,
      year: record.year,
      violentCrimeRate: record.violent_crime_rate,
      propertyCrimeRate: record.property_crime_rate,
      overallCrimeIndex: record.overall_crime_index,
      nationalAverageViolent: record.national_average_violent,
      nationalAverageProperty: record.national_average_property,
    };

    return crimeData;
  } catch (error) {
    console.error('Error fetching city crime data:', error);
    return null;
  }
}

export async function getCityCrimeTrends(
  citySlug: string,
  yearsBack: number = 5
): Promise<CrimeTrend[]> {
  try {
    const { data, error } = await supabase.rpc('get_city_crime_trends', {
      city_slug: citySlug,
      years_back: yearsBack,
    });

    if (error) {
      console.error('Error fetching city crime trends:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const trends: CrimeTrend[] = data.map((record: any) => ({
      year: record.year,
      violentCrimeRate: record.violent_crime_rate,
      propertyCrimeRate: record.property_crime_rate,
      overallCrimeIndex: record.overall_crime_index,
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching city crime trends:', error);
    return [];
  }
}

export async function getLatestDistrictCrimeData(districtSlug: string): Promise<CrimeData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_district_crime_data', {
      district_slug: districtSlug,
    });

    if (error) {
      console.error('Error fetching district crime data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const crimeData: CrimeData = {
      districtId: record.district_id,
      districtName: record.district_name,
      year: record.year,
      violentCrimeRate: record.violent_crime_rate,
      propertyCrimeRate: record.property_crime_rate,
      overallCrimeIndex: record.overall_crime_index,
      nationalAverageViolent: record.national_average_violent,
      nationalAverageProperty: record.national_average_property,
    };

    return crimeData;
  } catch (error) {
    console.error('Error fetching district crime data:', error);
    return null;
  }
}

export async function getDistrictCrimeTrends(
  districtSlug: string,
  yearsBack: number = 5
): Promise<CrimeTrend[]> {
  try {
    const { data, error } = await supabase.rpc('get_district_crime_trends', {
      district_slug: districtSlug,
      years_back: yearsBack,
    });

    if (error) {
      console.error('Error fetching district crime trends:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const trends: CrimeTrend[] = data.map((record: any) => ({
      year: record.year,
      violentCrimeRate: record.violent_crime_rate,
      propertyCrimeRate: record.property_crime_rate,
      overallCrimeIndex: record.overall_crime_index,
    }));

    return trends;
  } catch (error) {
    console.error('Error fetching district crime trends:', error);
    return [];
  }
}

export async function compareCityCrimeRates(citySlugs: string[]): Promise<SafetyComparison[]> {
  try {
    const { data, error } = await supabase.rpc('compare_city_crime_rates', {
      city_slugs: citySlugs,
    });

    if (error) {
      console.error('Error comparing city crime rates:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const comparisons: SafetyComparison[] = data.map((record: any) => ({
      cityName: record.city_name,
      citySlug: record.city_slug,
      year: record.year,
      violentCrimeRate: record.violent_crime_rate,
      propertyCrimeRate: record.property_crime_rate,
      overallCrimeIndex: record.overall_crime_index,
    }));

    return comparisons;
  } catch (error) {
    console.error('Error comparing city crime rates:', error);
    return [];
  }
}

export function getSafetyRating(crimeIndex: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (crimeIndex <= 20) {
    return {
      rating: 'Very Safe',
      color: 'text-green-700 bg-green-50 border-green-200',
      description: 'Significantly below national average',
    };
  } else if (crimeIndex <= 40) {
    return {
      rating: 'Safe',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      description: 'Below national average',
    };
  } else if (crimeIndex <= 60) {
    return {
      rating: 'Moderate',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      description: 'Near national average',
    };
  } else if (crimeIndex <= 80) {
    return {
      rating: 'Elevated',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      description: 'Above national average',
    };
  } else {
    return {
      rating: 'High',
      color: 'text-red-700 bg-red-50 border-red-200',
      description: 'Significantly above national average',
    };
  }
}

export function calculateYearOverYearChange(trends: CrimeTrend[]): {
  overallChange: number;
  violentChange: number;
  propertyChange: number;
  direction: 'improving' | 'worsening' | 'stable';
} | null {
  if (trends.length < 2) {
    return null;
  }

  const latest = trends[0];
  const previous = trends[1];

  const overallChange =
    ((latest.overallCrimeIndex - previous.overallCrimeIndex) / previous.overallCrimeIndex) * 100;
  const violentChange =
    ((latest.violentCrimeRate - previous.violentCrimeRate) / previous.violentCrimeRate) * 100;
  const propertyChange =
    ((latest.propertyCrimeRate - previous.propertyCrimeRate) / previous.propertyCrimeRate) * 100;

  let direction: 'improving' | 'worsening' | 'stable' = 'stable';
  if (overallChange < -2) {
    direction = 'improving';
  } else if (overallChange > 2) {
    direction = 'worsening';
  }

  return {
    overallChange,
    violentChange,
    propertyChange,
    direction,
  };
}
