/*
  # Add Environmental and Air Quality Data

  1. New Tables
    - `city_air_quality`
      - `id` (uuid, primary key)
      - `city_id` (uuid, foreign key to cities)
      - `year` (integer) - Year of data collection
      - `current_aqi` (integer) - Current Air Quality Index (0-500)
      - `avg_annual_aqi` (double precision) - Average annual AQI
      - `current_pm25` (double precision) - Current PM2.5 level (µg/m³)
      - `avg_annual_pm25` (double precision) - Average annual PM2.5 level
      - `current_pm10` (double precision) - Current PM10 level (µg/m³)
      - `avg_annual_pm10` (double precision) - Average annual PM10 level
      - `ozone_level` (double precision) - Ozone concentration (ppb)
      - `no2_level` (double precision) - Nitrogen dioxide level (ppb)
      - `good_air_days` (integer) - Number of days with good air quality per year
      - `unhealthy_air_days` (integer) - Number of days with unhealthy air quality per year
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `district_air_quality`
      - `id` (uuid, primary key)
      - `district_id` (uuid, foreign key to districts)
      - `year` (integer) - Year of data collection
      - `current_aqi` (integer) - Current Air Quality Index (0-500)
      - `avg_annual_aqi` (double precision) - Average annual AQI
      - `current_pm25` (double precision) - Current PM2.5 level (µg/m³)
      - `avg_annual_pm25` (double precision) - Average annual PM2.5 level
      - `current_pm10` (double precision) - Current PM10 level (µg/m³)
      - `avg_annual_pm10` (double precision) - Average annual PM10 level
      - `ozone_level` (double precision) - Ozone concentration (ppb)
      - `no2_level` (double precision) - Nitrogen dioxide level (ppb)
      - `good_air_days` (integer) - Number of days with good air quality per year
      - `unhealthy_air_days` (integer) - Number of days with unhealthy air quality per year
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (air quality data is public information)

  3. Indexes
    - Add indexes on foreign keys and year columns for performance
    - Add composite indexes for common query patterns

  4. Functions
    - Function to get latest air quality data for a city
    - Function to get air quality trends over time
    - Function to compare air quality across locations
*/

-- Create city_air_quality table
CREATE TABLE IF NOT EXISTS city_air_quality (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  year integer NOT NULL,
  current_aqi integer DEFAULT 0,
  avg_annual_aqi double precision DEFAULT 0,
  current_pm25 double precision DEFAULT 0,
  avg_annual_pm25 double precision DEFAULT 0,
  current_pm10 double precision DEFAULT 0,
  avg_annual_pm10 double precision DEFAULT 0,
  ozone_level double precision DEFAULT 0,
  no2_level double precision DEFAULT 0,
  good_air_days integer DEFAULT 0,
  unhealthy_air_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_city_air_year UNIQUE(city_id, year)
);

-- Create district_air_quality table
CREATE TABLE IF NOT EXISTS district_air_quality (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  year integer NOT NULL,
  current_aqi integer DEFAULT 0,
  avg_annual_aqi double precision DEFAULT 0,
  current_pm25 double precision DEFAULT 0,
  avg_annual_pm25 double precision DEFAULT 0,
  current_pm10 double precision DEFAULT 0,
  avg_annual_pm10 double precision DEFAULT 0,
  ozone_level double precision DEFAULT 0,
  no2_level double precision DEFAULT 0,
  good_air_days integer DEFAULT 0,
  unhealthy_air_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_district_air_year UNIQUE(district_id, year)
);

-- Enable RLS
ALTER TABLE city_air_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_air_quality ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (air quality data is public information)
CREATE POLICY "Anyone can read city air quality data"
  ON city_air_quality FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read district air quality data"
  ON district_air_quality FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_city_air_quality_city_id ON city_air_quality(city_id);
CREATE INDEX IF NOT EXISTS idx_city_air_quality_year ON city_air_quality(year);
CREATE INDEX IF NOT EXISTS idx_city_air_quality_city_year ON city_air_quality(city_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_district_air_quality_district_id ON district_air_quality(district_id);
CREATE INDEX IF NOT EXISTS idx_district_air_quality_year ON district_air_quality(year);
CREATE INDEX IF NOT EXISTS idx_district_air_quality_district_year ON district_air_quality(district_id, year DESC);

-- Function to get latest air quality data for a city
CREATE OR REPLACE FUNCTION get_latest_city_air_quality(city_slug text)
RETURNS TABLE (
  city_id uuid,
  city_name text,
  year integer,
  current_aqi integer,
  avg_annual_aqi double precision,
  current_pm25 double precision,
  avg_annual_pm25 double precision,
  current_pm10 double precision,
  avg_annual_pm10 double precision,
  ozone_level double precision,
  no2_level double precision,
  good_air_days integer,
  unhealthy_air_days integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS city_id,
    c.name AS city_name,
    aq.year,
    aq.current_aqi,
    aq.avg_annual_aqi,
    aq.current_pm25,
    aq.avg_annual_pm25,
    aq.current_pm10,
    aq.avg_annual_pm10,
    aq.ozone_level,
    aq.no2_level,
    aq.good_air_days,
    aq.unhealthy_air_days
  FROM cities c
  INNER JOIN city_air_quality aq ON c.id = aq.city_id
  WHERE c.slug = city_slug
  ORDER BY aq.year DESC
  LIMIT 1;
END;
$$;

-- Function to get air quality trends for a city (multiple years)
CREATE OR REPLACE FUNCTION get_city_air_quality_trends(city_slug text, years_back integer DEFAULT 5)
RETURNS TABLE (
  year integer,
  avg_annual_aqi double precision,
  avg_annual_pm25 double precision,
  avg_annual_pm10 double precision,
  good_air_days integer,
  unhealthy_air_days integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aq.year,
    aq.avg_annual_aqi,
    aq.avg_annual_pm25,
    aq.avg_annual_pm10,
    aq.good_air_days,
    aq.unhealthy_air_days
  FROM cities c
  INNER JOIN city_air_quality aq ON c.id = aq.city_id
  WHERE c.slug = city_slug
  ORDER BY aq.year DESC
  LIMIT years_back;
END;
$$;

-- Function to get latest air quality data for a district
CREATE OR REPLACE FUNCTION get_latest_district_air_quality(district_slug text)
RETURNS TABLE (
  district_id uuid,
  district_name text,
  year integer,
  current_aqi integer,
  avg_annual_aqi double precision,
  current_pm25 double precision,
  avg_annual_pm25 double precision,
  current_pm10 double precision,
  avg_annual_pm10 double precision,
  ozone_level double precision,
  no2_level double precision,
  good_air_days integer,
  unhealthy_air_days integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS district_id,
    d.name AS district_name,
    aq.year,
    aq.current_aqi,
    aq.avg_annual_aqi,
    aq.current_pm25,
    aq.avg_annual_pm25,
    aq.current_pm10,
    aq.avg_annual_pm10,
    aq.ozone_level,
    aq.no2_level,
    aq.good_air_days,
    aq.unhealthy_air_days
  FROM districts d
  INNER JOIN district_air_quality aq ON d.id = aq.district_id
  WHERE d.slug = district_slug
  ORDER BY aq.year DESC
  LIMIT 1;
END;
$$;

-- Function to get district air quality trends
CREATE OR REPLACE FUNCTION get_district_air_quality_trends(district_slug text, years_back integer DEFAULT 5)
RETURNS TABLE (
  year integer,
  avg_annual_aqi double precision,
  avg_annual_pm25 double precision,
  avg_annual_pm10 double precision,
  good_air_days integer,
  unhealthy_air_days integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aq.year,
    aq.avg_annual_aqi,
    aq.avg_annual_pm25,
    aq.avg_annual_pm10,
    aq.good_air_days,
    aq.unhealthy_air_days
  FROM districts d
  INNER JOIN district_air_quality aq ON d.id = aq.district_id
  WHERE d.slug = district_slug
  ORDER BY aq.year DESC
  LIMIT years_back;
END;
$$;

-- Function to compare air quality across multiple cities
CREATE OR REPLACE FUNCTION compare_city_air_quality(city_slugs text[])
RETURNS TABLE (
  city_name text,
  city_slug text,
  year integer,
  avg_annual_aqi double precision,
  avg_annual_pm25 double precision,
  good_air_days integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS city_name,
    c.slug AS city_slug,
    aq.year,
    aq.avg_annual_aqi,
    aq.avg_annual_pm25,
    aq.good_air_days
  FROM cities c
  INNER JOIN LATERAL (
    SELECT *
    FROM city_air_quality
    WHERE city_id = c.id
    ORDER BY year DESC
    LIMIT 1
  ) aq ON true
  WHERE c.slug = ANY(city_slugs)
  ORDER BY aq.avg_annual_aqi ASC;
END;
$$;