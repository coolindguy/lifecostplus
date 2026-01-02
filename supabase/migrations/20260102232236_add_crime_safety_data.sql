/*
  # Add Crime and Safety Data

  1. New Tables
    - `city_crime_data`
      - `id` (uuid, primary key)
      - `city_id` (uuid, foreign key to cities)
      - `year` (integer) - Year of data collection
      - `violent_crime_rate` (double precision) - Violent crimes per 100,000 residents
      - `property_crime_rate` (double precision) - Property crimes per 100,000 residents
      - `overall_crime_index` (double precision) - Normalized overall crime index (0-100, lower is safer)
      - `national_average_violent` (double precision) - National average for comparison
      - `national_average_property` (double precision) - National average for comparison
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `district_crime_data`
      - `id` (uuid, primary key)
      - `district_id` (uuid, foreign key to districts)
      - `year` (integer) - Year of data collection
      - `violent_crime_rate` (double precision) - Violent crimes per 100,000 residents
      - `property_crime_rate` (double precision) - Property crimes per 100,000 residents
      - `overall_crime_index` (double precision) - Normalized overall crime index (0-100, lower is safer)
      - `national_average_violent` (double precision) - National average for comparison
      - `national_average_property` (double precision) - National average for comparison
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (crime data is public information)

  3. Indexes
    - Add indexes on foreign keys and year columns for performance
    - Add composite indexes for common query patterns

  4. Functions
    - Function to get latest crime data for a city
    - Function to get crime trends over time
    - Function to compare crime rates across locations
*/

-- Create city_crime_data table
CREATE TABLE IF NOT EXISTS city_crime_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  year integer NOT NULL,
  violent_crime_rate double precision DEFAULT 0,
  property_crime_rate double precision DEFAULT 0,
  overall_crime_index double precision DEFAULT 0,
  national_average_violent double precision DEFAULT 0,
  national_average_property double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_city_year UNIQUE(city_id, year)
);

-- Create district_crime_data table
CREATE TABLE IF NOT EXISTS district_crime_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  year integer NOT NULL,
  violent_crime_rate double precision DEFAULT 0,
  property_crime_rate double precision DEFAULT 0,
  overall_crime_index double precision DEFAULT 0,
  national_average_violent double precision DEFAULT 0,
  national_average_property double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_district_year UNIQUE(district_id, year)
);

-- Enable RLS
ALTER TABLE city_crime_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_crime_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (crime statistics are public data)
CREATE POLICY "Anyone can read city crime data"
  ON city_crime_data FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read district crime data"
  ON district_crime_data FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_city_crime_city_id ON city_crime_data(city_id);
CREATE INDEX IF NOT EXISTS idx_city_crime_year ON city_crime_data(year);
CREATE INDEX IF NOT EXISTS idx_city_crime_city_year ON city_crime_data(city_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_district_crime_district_id ON district_crime_data(district_id);
CREATE INDEX IF NOT EXISTS idx_district_crime_year ON district_crime_data(year);
CREATE INDEX IF NOT EXISTS idx_district_crime_district_year ON district_crime_data(district_id, year DESC);

-- Function to get latest crime data for a city
CREATE OR REPLACE FUNCTION get_latest_city_crime_data(city_slug text)
RETURNS TABLE (
  city_id uuid,
  city_name text,
  year integer,
  violent_crime_rate double precision,
  property_crime_rate double precision,
  overall_crime_index double precision,
  national_average_violent double precision,
  national_average_property double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS city_id,
    c.name AS city_name,
    cd.year,
    cd.violent_crime_rate,
    cd.property_crime_rate,
    cd.overall_crime_index,
    cd.national_average_violent,
    cd.national_average_property
  FROM cities c
  INNER JOIN city_crime_data cd ON c.id = cd.city_id
  WHERE c.slug = city_slug
  ORDER BY cd.year DESC
  LIMIT 1;
END;
$$;

-- Function to get crime trends for a city (multiple years)
CREATE OR REPLACE FUNCTION get_city_crime_trends(city_slug text, years_back integer DEFAULT 5)
RETURNS TABLE (
  year integer,
  violent_crime_rate double precision,
  property_crime_rate double precision,
  overall_crime_index double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cd.year,
    cd.violent_crime_rate,
    cd.property_crime_rate,
    cd.overall_crime_index
  FROM cities c
  INNER JOIN city_crime_data cd ON c.id = cd.city_id
  WHERE c.slug = city_slug
  ORDER BY cd.year DESC
  LIMIT years_back;
END;
$$;

-- Function to get latest crime data for a district
CREATE OR REPLACE FUNCTION get_latest_district_crime_data(district_slug text)
RETURNS TABLE (
  district_id uuid,
  district_name text,
  year integer,
  violent_crime_rate double precision,
  property_crime_rate double precision,
  overall_crime_index double precision,
  national_average_violent double precision,
  national_average_property double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS district_id,
    d.name AS district_name,
    dd.year,
    dd.violent_crime_rate,
    dd.property_crime_rate,
    dd.overall_crime_index,
    dd.national_average_violent,
    dd.national_average_property
  FROM districts d
  INNER JOIN district_crime_data dd ON d.id = dd.district_id
  WHERE d.slug = district_slug
  ORDER BY dd.year DESC
  LIMIT 1;
END;
$$;

-- Function to get district crime trends
CREATE OR REPLACE FUNCTION get_district_crime_trends(district_slug text, years_back integer DEFAULT 5)
RETURNS TABLE (
  year integer,
  violent_crime_rate double precision,
  property_crime_rate double precision,
  overall_crime_index double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dd.year,
    dd.violent_crime_rate,
    dd.property_crime_rate,
    dd.overall_crime_index
  FROM districts d
  INNER JOIN district_crime_data dd ON d.id = dd.district_id
  WHERE d.slug = district_slug
  ORDER BY dd.year DESC
  LIMIT years_back;
END;
$$;

-- Function to compare crime rates across multiple cities
CREATE OR REPLACE FUNCTION compare_city_crime_rates(city_slugs text[])
RETURNS TABLE (
  city_name text,
  city_slug text,
  year integer,
  violent_crime_rate double precision,
  property_crime_rate double precision,
  overall_crime_index double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS city_name,
    c.slug AS city_slug,
    cd.year,
    cd.violent_crime_rate,
    cd.property_crime_rate,
    cd.overall_crime_index
  FROM cities c
  INNER JOIN LATERAL (
    SELECT *
    FROM city_crime_data
    WHERE city_id = c.id
    ORDER BY year DESC
    LIMIT 1
  ) cd ON true
  WHERE c.slug = ANY(city_slugs)
  ORDER BY cd.overall_crime_index ASC;
END;
$$;