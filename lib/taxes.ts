import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface StateTaxData {
  stateId: string;
  stateName: string;
  year: number;
  incomeTaxMinPercent: number;
  incomeTaxMaxPercent: number;
  incomeTaxBrackets: number;
  hasIncomeTax: boolean;
  salesTaxStatePercent: number;
  avgLocalSalesTaxPercent: number;
  avgCombinedSalesTaxPercent: number;
  propertyTaxEffectiveRatePercent: number;
  medianPropertyTaxAnnualUsd: number;
  gasTaxPerGallonUsd: number;
  corporateTaxPercent: number;
  estateTaxExemptionUsd: number;
  hasEstateTax: boolean;
  effectiveTaxBurdenPercent: number;
  taxBurdenRank: number;
}

export interface CityTaxData {
  cityId: string;
  cityName: string;
  year: number;
  localIncomeTaxPercent: number;
  hasLocalIncomeTax: boolean;
  localSalesTaxPercent: number;
  combinedSalesTaxPercent: number;
  propertyTaxRatePercent: number;
  propertyTaxPer1000Assessed: number;
  medianPropertyTaxAnnualUsd: number;
  avgEffectivePropertyTaxPercent: number;
  businessTaxType: string;
  businessTaxRatePercent: number;
  hotelTaxPercent: number;
  restaurantTaxPercent: number;
  utilityTaxPercent: number;
  vehicleRegistrationAnnualAvgUsd: number;
  parkingTaxPercent: number;
  effectiveTotalTaxBurdenPercent: number;
}

export interface DistrictTaxData {
  districtId: string;
  districtName: string;
  year: number;
  localIncomeTaxPercent: number;
  hasLocalIncomeTax: boolean;
  localSalesTaxPercent: number;
  combinedSalesTaxPercent: number;
  propertyTaxRatePercent: number;
  medianPropertyTaxAnnualUsd: number;
  avgEffectivePropertyTaxPercent: number;
  effectiveTotalTaxBurdenPercent: number;
}

export interface TaxComparison {
  cityName: string;
  citySlug: string;
  stateName: string;
  combinedSalesTaxPercent: number;
  avgEffectivePropertyTaxPercent: number;
  localIncomeTaxPercent: number;
  effectiveTotalTaxBurdenPercent: number;
}

export interface TaxBurdenEstimate {
  locationName: string;
  estimatedIncomeTaxUsd: number;
  estimatedPropertyTaxUsd: number;
  estimatedSalesTaxUsd: number;
  estimatedTotalTaxUsd: number;
  effectiveTaxRatePercent: number;
}

export async function getLatestStateTaxes(stateSlug: string): Promise<StateTaxData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_state_taxes', {
      state_slug: stateSlug,
    });

    if (error) {
      console.error('Error fetching state tax data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const taxData: StateTaxData = {
      stateId: record.state_id,
      stateName: record.state_name,
      year: record.year,
      incomeTaxMinPercent: record.income_tax_min_percent,
      incomeTaxMaxPercent: record.income_tax_max_percent,
      incomeTaxBrackets: record.income_tax_brackets,
      hasIncomeTax: record.has_income_tax,
      salesTaxStatePercent: record.sales_tax_state_percent,
      avgLocalSalesTaxPercent: record.avg_local_sales_tax_percent,
      avgCombinedSalesTaxPercent: record.avg_combined_sales_tax_percent,
      propertyTaxEffectiveRatePercent: record.property_tax_effective_rate_percent,
      medianPropertyTaxAnnualUsd: record.median_property_tax_annual_usd,
      gasTaxPerGallonUsd: record.gas_tax_per_gallon_usd,
      corporateTaxPercent: record.corporate_tax_percent,
      estateTaxExemptionUsd: record.estate_tax_exemption_usd,
      hasEstateTax: record.has_estate_tax,
      effectiveTaxBurdenPercent: record.effective_tax_burden_percent,
      taxBurdenRank: record.tax_burden_rank,
    };

    return taxData;
  } catch (error) {
    console.error('Error fetching state tax data:', error);
    return null;
  }
}

export async function getLatestCityTaxes(citySlug: string): Promise<CityTaxData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_city_taxes', {
      city_slug: citySlug,
    });

    if (error) {
      console.error('Error fetching city tax data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const taxData: CityTaxData = {
      cityId: record.city_id,
      cityName: record.city_name,
      year: record.year,
      localIncomeTaxPercent: record.local_income_tax_percent,
      hasLocalIncomeTax: record.has_local_income_tax,
      localSalesTaxPercent: record.local_sales_tax_percent,
      combinedSalesTaxPercent: record.combined_sales_tax_percent,
      propertyTaxRatePercent: record.property_tax_rate_percent,
      propertyTaxPer1000Assessed: record.property_tax_per_1000_assessed,
      medianPropertyTaxAnnualUsd: record.median_property_tax_annual_usd,
      avgEffectivePropertyTaxPercent: record.avg_effective_property_tax_percent,
      businessTaxType: record.business_tax_type,
      businessTaxRatePercent: record.business_tax_rate_percent,
      hotelTaxPercent: record.hotel_tax_percent,
      restaurantTaxPercent: record.restaurant_tax_percent,
      utilityTaxPercent: record.utility_tax_percent,
      vehicleRegistrationAnnualAvgUsd: record.vehicle_registration_annual_avg_usd,
      parkingTaxPercent: record.parking_tax_percent,
      effectiveTotalTaxBurdenPercent: record.effective_total_tax_burden_percent,
    };

    return taxData;
  } catch (error) {
    console.error('Error fetching city tax data:', error);
    return null;
  }
}

export async function getLatestDistrictTaxes(districtSlug: string): Promise<DistrictTaxData | null> {
  try {
    const { data, error } = await supabase.rpc('get_latest_district_taxes', {
      district_slug: districtSlug,
    });

    if (error) {
      console.error('Error fetching district tax data:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const taxData: DistrictTaxData = {
      districtId: record.district_id,
      districtName: record.district_name,
      year: record.year,
      localIncomeTaxPercent: record.local_income_tax_percent,
      hasLocalIncomeTax: record.has_local_income_tax,
      localSalesTaxPercent: record.local_sales_tax_percent,
      combinedSalesTaxPercent: record.combined_sales_tax_percent,
      propertyTaxRatePercent: record.property_tax_rate_percent,
      medianPropertyTaxAnnualUsd: record.median_property_tax_annual_usd,
      avgEffectivePropertyTaxPercent: record.avg_effective_property_tax_percent,
      effectiveTotalTaxBurdenPercent: record.effective_total_tax_burden_percent,
    };

    return taxData;
  } catch (error) {
    console.error('Error fetching district tax data:', error);
    return null;
  }
}

export async function compareCityTaxBurden(citySlugs: string[]): Promise<TaxComparison[]> {
  try {
    const { data, error } = await supabase.rpc('compare_city_tax_burden', {
      city_slugs: citySlugs,
    });

    if (error) {
      console.error('Error comparing city tax burden:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    const comparisons: TaxComparison[] = data.map((record: any) => ({
      cityName: record.city_name,
      citySlug: record.city_slug,
      stateName: record.state_name,
      combinedSalesTaxPercent: record.combined_sales_tax_percent,
      avgEffectivePropertyTaxPercent: record.avg_effective_property_tax_percent,
      localIncomeTaxPercent: record.local_income_tax_percent,
      effectiveTotalTaxBurdenPercent: record.effective_total_tax_burden_percent,
    }));

    return comparisons;
  } catch (error) {
    console.error('Error comparing city tax burden:', error);
    return [];
  }
}

export async function estimateAnnualTaxBurden(
  citySlug: string,
  annualIncomeUsd: number,
  propertyValueUsd: number,
  annualSpendingUsd: number
): Promise<TaxBurdenEstimate | null> {
  try {
    const { data, error } = await supabase.rpc('estimate_annual_tax_burden', {
      city_slug: citySlug,
      annual_income_usd: annualIncomeUsd,
      property_value_usd: propertyValueUsd,
      annual_spending_usd: annualSpendingUsd,
    });

    if (error) {
      console.error('Error estimating tax burden:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const record = data[0];
    const estimate: TaxBurdenEstimate = {
      locationName: record.location_name,
      estimatedIncomeTaxUsd: record.estimated_income_tax_usd,
      estimatedPropertyTaxUsd: record.estimated_property_tax_usd,
      estimatedSalesTaxUsd: record.estimated_sales_tax_usd,
      estimatedTotalTaxUsd: record.estimated_total_tax_usd,
      effectiveTaxRatePercent: record.effective_tax_rate_percent,
    };

    return estimate;
  } catch (error) {
    console.error('Error estimating tax burden:', error);
    return null;
  }
}

export function getTaxBurdenRating(percent: number): {
  rating: string;
  color: string;
  description: string;
} {
  if (percent <= 7) {
    return {
      rating: 'Very Low',
      color: 'text-green-700 bg-green-50 border-green-200',
      description: 'Below average tax burden',
    };
  } else if (percent <= 9) {
    return {
      rating: 'Low',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      description: 'Relatively low tax burden',
    };
  } else if (percent <= 11) {
    return {
      rating: 'Moderate',
      color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      description: 'Average tax burden',
    };
  } else if (percent <= 13) {
    return {
      rating: 'High',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      description: 'Above average tax burden',
    };
  } else {
    return {
      rating: 'Very High',
      color: 'text-red-700 bg-red-50 border-red-200',
      description: 'Significantly high tax burden',
    };
  }
}

export function getSalesTaxRating(percent: number): {
  rating: string;
  color: string;
} {
  if (percent === 0) {
    return { rating: 'No Sales Tax', color: 'text-green-700' };
  } else if (percent <= 5) {
    return { rating: 'Very Low', color: 'text-green-700' };
  } else if (percent <= 7) {
    return { rating: 'Low', color: 'text-blue-700' };
  } else if (percent <= 9) {
    return { rating: 'Moderate', color: 'text-yellow-700' };
  } else if (percent <= 10) {
    return { rating: 'High', color: 'text-orange-700' };
  } else {
    return { rating: 'Very High', color: 'text-red-700' };
  }
}

export function getPropertyTaxRating(percent: number): {
  rating: string;
  color: string;
} {
  if (percent <= 0.5) {
    return { rating: 'Very Low', color: 'text-green-700' };
  } else if (percent <= 1.0) {
    return { rating: 'Low', color: 'text-blue-700' };
  } else if (percent <= 1.5) {
    return { rating: 'Moderate', color: 'text-yellow-700' };
  } else if (percent <= 2.0) {
    return { rating: 'High', color: 'text-orange-700' };
  } else {
    return { rating: 'Very High', color: 'text-red-700' };
  }
}

export function getIncomeTaxRating(percent: number, hasIncomeTax: boolean): {
  rating: string;
  color: string;
} {
  if (!hasIncomeTax || percent === 0) {
    return { rating: 'No Income Tax', color: 'text-green-700' };
  } else if (percent <= 3) {
    return { rating: 'Very Low', color: 'text-green-700' };
  } else if (percent <= 5) {
    return { rating: 'Low', color: 'text-blue-700' };
  } else if (percent <= 7) {
    return { rating: 'Moderate', color: 'text-yellow-700' };
  } else if (percent <= 9) {
    return { rating: 'High', color: 'text-orange-700' };
  } else {
    return { rating: 'Very High', color: 'text-red-700' };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTaxRate(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

export function calculateTaxSavings(
  currentTaxBurden: number,
  compareTaxBurden: number,
  annualIncome: number
): {
  annualSavings: number;
  monthlySavings: number;
  percentDifference: number;
} {
  const annualSavings = annualIncome * ((currentTaxBurden - compareTaxBurden) / 100);
  const monthlySavings = annualSavings / 12;
  const percentDifference = ((currentTaxBurden - compareTaxBurden) / currentTaxBurden) * 100;

  return {
    annualSavings,
    monthlySavings,
    percentDifference,
  };
}
