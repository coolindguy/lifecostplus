/*
  # Add News Table

  1. New Tables
    - `news`
      - `id` (uuid, primary key) - Unique identifier for each news item
      - `title` (text) - News article title
      - `summary` (text) - Brief summary for collapsed view
      - `content` (text) - Full news article content
      - `category` (text) - Category: housing, economy, safety, or education
      - `location_type` (text) - Type of location: city or state
      - `location_id` (uuid) - Reference to the location (city or state)
      - `source` (text) - News source name
      - `source_url` (text) - URL to original article
      - `published_at` (timestamptz) - Publication date
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `news` table
    - Add policy for public read access to news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('housing', 'economy', 'safety', 'education')),
  location_type text NOT NULL CHECK (location_type IN ('city', 'state')),
  location_id uuid NOT NULL,
  source text NOT NULL,
  source_url text,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient queries by location
CREATE INDEX IF NOT EXISTS idx_news_location ON news(location_type, location_id, category, published_at DESC);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow public read access to news
CREATE POLICY "Public can view news"
  ON news
  FOR SELECT
  TO public
  USING (true);