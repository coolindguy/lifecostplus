/*
  # Add Commute and Transportation Data

  1. New Tables
    - `city_transportation`
      - `id` (uuid, primary key)
      - `city_id` (uuid, foreign key to cities)
      - `year` (integer) - Year of data collection
      - `avg_commute_time_minutes` (double precision) - Average one-way commute time in minutes
      - `median_commute_time_minutes` (double precision) - Median one-way commute time
      - `public_transit_usage_percent` (double precision) - Percentage using public transit (0-100)
      - `car_usage_percent` (double precision) - Percentage driving alone (0-100)
      - `carpool_usage_percent` (double precision) - Percentage carpooling (0-100)
      - `bike_usage_percent` (double precision) - Percentage biking (0-100)
      - `walk_usage_percent` (double precision) - Percentage walking (0-100)
      - `work_from_home_percent` (double precision) - Percentage working from home (0-100)
      - `car_dependency_score` (double precision) - Calculated car dependency indicator (0-100, higher = more car dependent)
      - `transit_quality_score` (double precision) - Public transit quality rating (0-100)
      - `traffic_congestion_index` (double precision) - Traffic congestion level (0-100)
      - `commute_cost_monthly_usd` (double precision) - Average monthly commute cost in USD
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `district_transportation`
      - `id` (uuid, primary key)
      - `district_id` (uuid, foreign key to districts)
      - `year` (integer) - Year of data collection
      - `avg_commute_time_minutes` (double precision) - Average one-way commute time in minutes
      - `median_commute_time_minutes` (double precision) - Median one-way commute time
      - `public_transit_usage_percent` (double precision) - Percentage using public transit (0-100)
      - `car_usage_percent` (double precision) - Percentage driving alone (0-100)
      - `carpool_usage_percent` (double precision) - Percentage carpooling (0-100)
      - `bike_usage_percent` (double precision) - Percentage biking (0-100)
      - `walk_usage_percent` (double precision) - Percentage walking (0-100)
      - `work_from_home_percent` (double precision) - Percentage working from home (0-100)
      - `car_dependency_score` (double precision) - Calculated car dependency indicator (0-100)
      - `transit_quality_score` (double precision) - Public transit quality rating (0-100)
      - `traffic_congestion_index` (double precision) - Traffic congestion level (0-100)
      - `commute_cost_monthly_usd` (double precision) - Average monthly commute cost in USD
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (transportation data is public information)

  3. Indexes
    - Add indexes on foreign keys and year columns for performance
    - Add composite indexes for common query patterns

  4. Functions
    - Function to get latest transportation data for a city
    - Function to get transportation trends over time
    - Function to compare transportation across locations
    - Function to calculate car dependency score
*/

-- Create city_transportation table
CREATE TABLE IF NOT EXISTS city_transportation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  year integer NOT NULL,
  avg_commute_time_minutes double precision DEFAULT 0,
  median_commute_time_minutes double precision DEFAULT 0,
  public_transit_usage_percent double precision DEFAULT 0,
  car_usage_percent double precision DEFAULT 0,
  carpool_usage_percent double precision DEFAULT 0,
  bike_usage_percent double precision DEFAULT 0,
  walk_usage_percent double precision DEFAULT 0,
  work_from_home_percent double precision DEFAULT 0,
  car_dependency_score double precision DEFAULT 0,
  transit_quality_score double precision DEFAULT 0,
  traffic_congestion_index double precision DEFAULT 0,
  commute_cost_monthly_usd double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_city_transport_year UNIQUE(city_id, year)
);

-- Create district_transportation table
CREATE TABLE IF NOT EXISTS district_transportation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  year integer NOT NULL,
  avg_commute_time_minutes double precision DEFAULT 0,
  median_commute_time_minutes double precision DEFAULT 0,
  public_transit_usage_percent double precision DEFAULT 0,
  car_usage_percent double precision DEFAULT 0,
  carpool_usage_percent double precision DEFAULT 0,
  bike_usage_percent double precision DEFAULT 0,
  walk_usage_percent double precision DEFAULT 0,
  work_from_home_percent double precision DEFAULT 0,
  car_dependency_score double precision DEFAULT 0,
  transit_quality_score double precision DEFAULT 0,
  traffic_congestion_index double precision DEFAULT 0,
  commute_cost_monthly_usd double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_district_transport_year UNIQUE(district_id, year)
);

-- Enable RLS
ALTER TABLE city_transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_transportation ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Anyone can read city transportation data"
  ON city_transportation FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read district transportation data"
  ON district_transportation FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_city_transportation_city_id ON city_transportation(city_id);
CREATE INDEX IF NOT EXISTS idx_city_transportation_year ON city_transportation(year);
CREATE INDEX IF NOT EXISTS idx_city_transportation_city_year ON city_transportation(city_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_district_transportation_district_id ON district_transportation(district_id);
CREATE INDEX IF NOT EXISTS idx_district_transportation_year ON district_transportation(year);
CREATE INDEX IF NOT EXISTS idx_district_transportation_district_year ON district_transportation(district_id, year DESC);

-- Function to get latest transportation data for a city
CREATE OR REPLACE FUNCTION get_latest_city_transportation(city_slug text)
RETURNS TABLE (
  city_id uuid,
  city_name text,
  year integer,
  avg_commute_time_minutes double precision,
  median_commute_time_minutes double precision,
  public_transit_usage_percent double precision,
  car_usage_percent double precision,
  carpool_usage_percent double precision,
  bike_usage_percent double precision,
  walk_usage_percent double precision,
  work_from_home_percent double precision,
  car_dependency_score double precision,
  transit_quality_score double precision,
  traffic_congestion_index double precision,
  commute_cost_monthly_usd double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS city_id,
    c.name AS city_name,
    t.year,
    t.avg_commute_time_minutes,
    t.median_commute_time_minutes,
    t.public_transit_usage_percent,
    t.car_usage_percent,
    t.carpool_usage_percent,
    t.bike_usage_percent,
    t.walk_usage_percent,
    t.work_from_home_percent,
    t.car_dependency_score,
    t.transit_quality_score,
    t.traffic_congestion_index,
    t.commute_cost_monthly_usd
  FROM cities c
  INNER JOIN city_transportation t ON c.id = t.city_id
  WHERE c.slug = city_slug
  ORDER BY t.year DESC
  LIMIT 1;
END;
$$;

-- Function to get transportation trends for a city (multiple years)
CREATE OR REPLACE FUNCTION get_city_transportation_trends(city_slug text, years_back integer DEFAULT 5)
RETURNS TABLE (
  year integer,
  avg_commute_time_minutes double precision,
  public_transit_usage_percent double precision,
  car_usage_percent double precision,
  car_dependency_score double precision,
  traffic_congestion_index double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.year,
    t.avg_commute_time_minutes,
    t.public_transit_usage_percent,
    t.car_usage_percent,
    t.car_dependency_score,
    t.traffic_congestion_index
  FROM cities c
  INNER JOIN city_transportation t ON c.id = t.city_id
  WHERE c.slug = city_slug
  ORDER BY t.year DESC
  LIMIT years_back;
END;
$$;

-- Function to get latest transportation data for a district
CREATE OR REPLACE FUNCTION get_latest_district_transportation(district_slug text)
RETURNS TABLE (
  district_id uuid,
  district_name text,
  year integer,
  avg_commute_time_minutes double precision,
  median_commute_time_minutes double precision,
  public_transit_usage_percent double precision,
  car_usage_percent double precision,
  carpool_usage_percent double precision,
  bike_usage_percent double precision,
  walk_usage_percent double precision,
  work_from_home_percent double precision,
  car_dependency_score double precision,
  transit_quality_score double precision,
  traffic_congestion_index double precision,
  commute_cost_monthly_usd double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS district_id,
    d.name AS district_name,
    t.year,
    t.avg_commute_time_minutes,
    t.median_commute_time_minutes,
    t.public_transit_usage_percent,
    t.car_usage_percent,
    t.carpool_usage_percent,
    t.bike_usage_percent,
    t.walk_usage_percent,
    t.work_from_home_percent,
    t.car_dependency_score,
    t.transit_quality_score,
    t.traffic_congestion_index,
    t.commute_cost_monthly_usd
  FROM districts d
  INNER JOIN district_transportation t ON d.id = t.district_id
  WHERE d.slug = district_slug
  ORDER BY t.year DESC
  LIMIT 1;
END;
$$;

-- Function to get district transportation trends
CREATE OR REPLACE FUNCTION get_district_transportation_trends(district_slug text, years_back integer DEFAULT 5)
RETURNS TABLE (
  year integer,
  avg_commute_time_minutes double precision,
  public_transit_usage_percent double precision,
  car_usage_percent double precision,
  car_dependency_score double precision,
  traffic_congestion_index double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.year,
    t.avg_commute_time_minutes,
    t.public_transit_usage_percent,
    t.car_usage_percent,
    t.car_dependency_score,
    t.traffic_congestion_index
  FROM districts d
  INNER JOIN district_transportation t ON d.id = t.district_id
  WHERE d.slug = district_slug
  ORDER BY t.year DESC
  LIMIT years_back;
END;
$$;

-- Function to compare transportation across multiple cities
CREATE OR REPLACE FUNCTION compare_city_transportation(city_slugs text[])
RETURNS TABLE (
  city_name text,
  city_slug text,
  year integer,
  avg_commute_time_minutes double precision,
  public_transit_usage_percent double precision,
  car_dependency_score double precision,
  traffic_congestion_index double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS city_name,
    c.slug AS city_slug,
    t.year,
    t.avg_commute_time_minutes,
    t.public_transit_usage_percent,
    t.car_dependency_score,
    t.traffic_congestion_index
  FROM cities c
  INNER JOIN LATERAL (
    SELECT *
    FROM city_transportation
    WHERE city_id = c.id
    ORDER BY year DESC
    LIMIT 1
  ) t ON true
  WHERE c.slug = ANY(city_slugs)
  ORDER BY t.avg_commute_time_minutes ASC;
END;
$$;

-- Function to find cities within radius with transportation filters
CREATE OR REPLACE FUNCTION find_cities_by_transportation_criteria(
  reference_city_slug text,
  radius_km double precision,
  max_commute_time double precision DEFAULT NULL,
  min_transit_usage double precision DEFAULT NULL,
  max_car_dependency double precision DEFAULT NULL
)
RETURNS TABLE (
  city_name text,
  city_slug text,
  distance_km double precision,
  avg_commute_time_minutes double precision,
  public_transit_usage_percent double precision,
  car_dependency_score double precision
)
LANGUAGE plpgsql
AS $$
DECLARE
  ref_lat double precision;
  ref_lon double precision;
BEGIN
  SELECT latitude, longitude INTO ref_lat, ref_lon
  FROM cities
  WHERE slug = reference_city_slug;

  IF ref_lat IS NULL OR ref_lon IS NULL THEN
    RAISE EXCEPTION 'Reference city not found or missing coordinates';
  END IF;

  RETURN QUERY
  SELECT
    c.name AS city_name,
    c.slug AS city_slug,
    calculate_distance(ref_lat, ref_lon, c.latitude, c.longitude) AS distance_km,
    t.avg_commute_time_minutes,
    t.public_transit_usage_percent,
    t.car_dependency_score
  FROM cities c
  INNER JOIN LATERAL (
    SELECT *
    FROM city_transportation
    WHERE city_id = c.id
    ORDER BY year DESC
    LIMIT 1
  ) t ON true
  WHERE c.slug != reference_city_slug
    AND calculate_distance(ref_lat, ref_lon, c.latitude, c.longitude) <= radius_km
    AND (max_commute_time IS NULL OR t.avg_commute_time_minutes <= max_commute_time)
    AND (min_transit_usage IS NULL OR t.public_transit_usage_percent >= min_transit_usage)
    AND (max_car_dependency IS NULL OR t.car_dependency_score <= max_car_dependency)
  ORDER BY distance_km ASC;
END;
$$;