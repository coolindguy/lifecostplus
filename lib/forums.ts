import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type ForumCategory = 'housing' | 'jobs' | 'schools' | 'lifestyle';
export type LocationType = 'city' | 'state';

export interface ForumThread {
  id: string;
  title: string;
  category: ForumCategory;
  location_type: LocationType;
  location_id: string;
  author_name: string;
  content: string;
  views: number;
  reply_count: number;
  last_activity: string;
  created_at: string;
  is_pinned: boolean;
  is_locked: boolean;
}

export interface ForumPost {
  id: string;
  thread_id: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getThreadsByLocation(
  locationId: string,
  locationType: LocationType,
  category?: ForumCategory
): Promise<ForumThread[]> {
  let query = supabase
    .from('forum_threads')
    .select('*')
    .eq('location_id', locationId)
    .eq('location_type', locationType);

  if (category) {
    query = query.eq('category', category);
  }

  query = query.order('is_pinned', { ascending: false }).order('last_activity', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching forum threads:', error);
    return [];
  }

  return data || [];
}

export async function getThreadById(threadId: string): Promise<ForumThread | null> {
  const { data, error } = await supabase
    .from('forum_threads')
    .select('*')
    .eq('id', threadId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching thread:', error);
    return null;
  }

  if (data) {
    await incrementThreadViews(threadId);
  }

  return data;
}

export async function getPostsByThread(threadId: string): Promise<ForumPost[]> {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

export async function createThread(
  title: string,
  content: string,
  category: ForumCategory,
  locationType: LocationType,
  locationId: string,
  authorName: string
): Promise<ForumThread | null> {
  const { data, error } = await supabase
    .from('forum_threads')
    .insert({
      title,
      content,
      category,
      location_type: locationType,
      location_id: locationId,
      author_name: authorName,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating thread:', error);
    return null;
  }

  return data;
}

export async function createPost(
  threadId: string,
  content: string,
  authorName: string
): Promise<ForumPost | null> {
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      thread_id: threadId,
      content,
      author_name: authorName,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  return data;
}

async function incrementThreadViews(threadId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_thread_views', { thread_id: threadId });

  if (error) {
    const { data: currentThread } = await supabase
      .from('forum_threads')
      .select('views')
      .eq('id', threadId)
      .maybeSingle();

    if (currentThread) {
      await supabase
        .from('forum_threads')
        .update({ views: (currentThread.views || 0) + 1 })
        .eq('id', threadId);
    }
  }
}

export async function getThreadStats(
  locationId: string,
  locationType: LocationType
): Promise<{
  totalThreads: number;
  totalPosts: number;
  categories: Record<ForumCategory, number>;
}> {
  const threads = await getThreadsByLocation(locationId, locationType);

  const categories: Record<ForumCategory, number> = {
    housing: 0,
    jobs: 0,
    schools: 0,
    lifestyle: 0,
  };

  threads.forEach((thread) => {
    categories[thread.category]++;
  });

  const totalPosts = threads.reduce((sum, thread) => sum + thread.reply_count, 0);

  return {
    totalThreads: threads.length,
    totalPosts,
    categories,
  };
}
