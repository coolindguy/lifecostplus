/*
  # Create Location Hierarchy

  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `code` (text, unique, ISO country code)
      - `created_at` (timestamptz)
    
    - `states`
      - `id` (uuid, primary key)
      - `country_id` (uuid, foreign key)
      - `name` (text)
      - `slug` (text, unique)
      - `created_at` (timestamptz)
    
    - `districts`
      - `id` (uuid, primary key)
      - `state_id` (uuid, foreign key)
      - `name` (text)
      - `slug` (text, unique)
      - `created_at` (timestamptz)
    
    - `cities`
      - `id` (uuid, primary key)
      - `district_id` (uuid, foreign key, nullable for backward compatibility)
      - `state_id` (uuid, foreign key, nullable initially)
      - `name` (text)
      - `slug` (text, unique)
      - `median_income` (integer)
      - `avg_rent` (integer)
      - `monthly_cost` (integer)
      - `commute_time` (integer)
      - `score_overall` (integer)
      - `score_affordability` (integer)
      - `score_jobs` (integer)
      - `score_commute` (integer)
      - `score_safety` (integer)
      - `score_lifestyle` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public read policies for all tables (data is public)

  3. Indexes
    - Create indexes on foreign keys and slug fields for performance
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid REFERENCES districts(id) ON DELETE SET NULL,
  state_id uuid REFERENCES states(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  median_income integer DEFAULT 0,
  avg_rent integer DEFAULT 0,
  monthly_cost integer DEFAULT 0,
  commute_time integer DEFAULT 0,
  score_overall integer DEFAULT 0,
  score_affordability integer DEFAULT 0,
  score_jobs integer DEFAULT 0,
  score_commute integer DEFAULT 0,
  score_safety integer DEFAULT 0,
  score_lifestyle integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_states_country_id ON states(country_id);
CREATE INDEX IF NOT EXISTS idx_states_slug ON states(slug);
CREATE INDEX IF NOT EXISTS idx_districts_state_id ON districts(state_id);
CREATE INDEX IF NOT EXISTS idx_districts_slug ON districts(slug);
CREATE INDEX IF NOT EXISTS idx_cities_district_id ON cities(district_id);
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Create public read policies (all location data is public)
CREATE POLICY "Countries are publicly readable"
  ON countries FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "States are publicly readable"
  ON states FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Districts are publicly readable"
  ON districts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Cities are publicly readable"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);
