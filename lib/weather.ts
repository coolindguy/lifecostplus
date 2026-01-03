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

export interface WeatherData {
  id: string;
  city_id: string;
  current_temp_f: number;
  current_condition: string;
  humidity: number;
  spring_avg_high_f: number;
  spring_avg_low_f: number;
  summer_avg_high_f: number;
  summer_avg_low_f: number;
  fall_avg_high_f: number;
  fall_avg_low_f: number;
  winter_avg_high_f: number;
  winter_avg_low_f: number;
  annual_precipitation_inches: number;
  sunny_days: number;
}

export async function getWeatherByCitySlug(citySlug: string): Promise<WeatherData | null> {
  try {
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('id')
      .eq('slug', citySlug)
      .maybeSingle();

    if (cityError || !cityData) {
      return null;
    }

    const { data: weatherData, error: weatherError } = await supabase
      .from('city_weather')
      .select('*')
      .eq('city_id', cityData.id)
      .maybeSingle();

    if (weatherError || !weatherData) {
      return null;
    }

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round((f - 32) * 5 / 9);
}

export function inchesToMm(inches: number): number {
  return Math.round(inches * 25.4);
}
