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

export interface SchoolDistrict {
  id: string;
  name: string;
  city_id?: string;
  state_id?: string;
  type: 'public' | 'private';
  total_schools: number;
  total_students: number;
  student_teacher_ratio: number;
  graduation_rate: number;
  college_readiness: number;
  test_scores_avg: number;
  rating: number;
  funding_per_student: number;
  special_programs: string[];
  created_at: string;
}

export async function getSchoolDistrictsByCity(cityId: string): Promise<SchoolDistrict[]> {
  const { data, error } = await supabase
    .from('school_districts')
    .select('*')
    .eq('city_id', cityId)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching school districts:', error);
    return [];
  }

  return data || [];
}

export async function getSchoolDistrictsByState(stateId: string): Promise<SchoolDistrict[]> {
  const { data, error } = await supabase
    .from('school_districts')
    .select('*')
    .eq('state_id', stateId)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching school districts:', error);
    return [];
  }

  return data || [];
}

export async function getSchoolDistrictsByType(
  cityId: string,
  type: 'public' | 'private'
): Promise<SchoolDistrict[]> {
  const { data, error } = await supabase
    .from('school_districts')
    .select('*')
    .eq('city_id', cityId)
    .eq('type', type)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching school districts by type:', error);
    return [];
  }

  return data || [];
}

export async function getTopSchoolDistricts(
  cityId: string,
  limit: number = 5
): Promise<SchoolDistrict[]> {
  const { data, error } = await supabase
    .from('school_districts')
    .select('*')
    .eq('city_id', cityId)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top school districts:', error);
    return [];
  }

  return data || [];
}

export interface EducationStats {
  avgRating: number;
  avgGraduationRate: number;
  avgCollegeReadiness: number;
  avgStudentTeacherRatio: number;
  totalPublicSchools: number;
  totalPrivateSchools: number;
}

export async function getEducationStatsByCity(cityId: string): Promise<EducationStats | null> {
  const districts = await getSchoolDistrictsByCity(cityId);

  if (districts.length === 0) {
    return null;
  }

  const publicDistricts = districts.filter((d) => d.type === 'public');
  const privateDistricts = districts.filter((d) => d.type === 'private');

  return {
    avgRating: districts.reduce((sum, d) => sum + d.rating, 0) / districts.length,
    avgGraduationRate:
      districts.reduce((sum, d) => sum + d.graduation_rate, 0) / districts.length,
    avgCollegeReadiness:
      districts.reduce((sum, d) => sum + d.college_readiness, 0) / districts.length,
    avgStudentTeacherRatio:
      districts.reduce((sum, d) => sum + d.student_teacher_ratio, 0) / districts.length,
    totalPublicSchools: publicDistricts.reduce((sum, d) => sum + d.total_schools, 0),
    totalPrivateSchools: privateDistricts.reduce((sum, d) => sum + d.total_schools, 0),
  };
}
