import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'housing' | 'economy' | 'safety' | 'education';
  location_type: 'city' | 'state';
  location_id: string;
  source: string;
  source_url?: string;
  published_at: string;
  created_at: string;
}

export async function getNewsByLocation(
  locationType: 'city' | 'state',
  locationId: string,
  category?: string,
  limit: number = 20
): Promise<NewsItem[]> {
  let query = supabase
    .from('news')
    .select('*')
    .eq('location_type', locationType)
    .eq('location_id', locationId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data || [];
}

export async function getNewsByCategory(
  locationType: 'city' | 'state',
  locationId: string,
  category: string,
  limit: number = 5
): Promise<NewsItem[]> {
  return getNewsByLocation(locationType, locationId, category, limit);
}
