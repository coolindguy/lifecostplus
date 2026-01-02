/*
  # Add Location-Based Forums

  ## Overview
  Creates forum system for city-level and state-level discussions with categories.

  ## 1. New Tables
  
  ### `forum_threads`
  - `id` (uuid, primary key) - Unique thread identifier
  - `title` (text) - Thread title
  - `category` (text) - Category: housing, jobs, schools, lifestyle
  - `location_type` (text) - Type: city or state
  - `location_id` (uuid) - Reference to city or state
  - `author_name` (text) - Thread author's name
  - `content` (text) - Thread content/first post
  - `views` (integer) - View count
  - `reply_count` (integer) - Number of replies
  - `last_activity` (timestamptz) - Last post/reply timestamp
  - `created_at` (timestamptz) - Thread creation time
  - `is_pinned` (boolean) - Whether thread is pinned
  - `is_locked` (boolean) - Whether thread is locked

  ### `forum_posts`
  - `id` (uuid, primary key) - Unique post identifier
  - `thread_id` (uuid) - Reference to parent thread
  - `author_name` (text) - Post author's name
  - `content` (text) - Post content
  - `created_at` (timestamptz) - Post creation time
  - `updated_at` (timestamptz) - Post last update time

  ## 2. Indexes
  - Index on location_id and category for efficient filtering
  - Index on thread_id for post lookups
  - Index on last_activity for sorting threads

  ## 3. Security
  - Enable RLS on both tables
  - Public read access for all users
  - Allow public to create threads and posts (simple forum)
*/

CREATE TABLE IF NOT EXISTS forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('housing', 'jobs', 'schools', 'lifestyle')),
  location_type text NOT NULL CHECK (location_type IN ('city', 'state')),
  location_id uuid NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  views integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forum_threads_location ON forum_threads(location_id, location_type, category);
CREATE INDEX IF NOT EXISTS idx_forum_threads_activity ON forum_threads(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_forum_threads_pinned ON forum_threads(is_pinned DESC, last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_thread ON forum_posts(thread_id, created_at ASC);

ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum threads"
  ON forum_threads
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create forum threads"
  ON forum_threads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view forum posts"
  ON forum_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create forum posts"
  ON forum_posts
  FOR INSERT
  TO public
  WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_thread_reply_count'
  ) THEN
    CREATE OR REPLACE FUNCTION update_thread_stats()
    RETURNS TRIGGER AS $func$
    BEGIN
      UPDATE forum_threads
      SET 
        reply_count = reply_count + 1,
        last_activity = NEW.created_at
      WHERE id = NEW.thread_id;
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    CREATE TRIGGER update_thread_reply_count
    AFTER INSERT ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_thread_stats();
  END IF;
END $$;