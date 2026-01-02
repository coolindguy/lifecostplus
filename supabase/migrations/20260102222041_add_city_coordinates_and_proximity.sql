/*
  # Add Geographic Coordinates and Proximity Support

  1. Changes to Cities Table
    - Add `latitude` column (double precision)
    - Add `longitude` column (double precision)
    - Add spatial index for performance

  2. Functions
    - Create function to calculate distance between cities
    - Create function to find nearby cities within radius

  3. Notes
    - Uses PostgreSQL earth distance module for calculations
    - Distance calculations support both miles and kilometers
    - Default radius: 25 miles
*/

-- Add latitude and longitude columns to cities table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cities' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE cities ADD COLUMN latitude double precision;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cities' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE cities ADD COLUMN longitude double precision;
  END IF;
END $$;

-- Enable the earthdistance extension for distance calculations
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Create index on lat/lng for performance
CREATE INDEX IF NOT EXISTS idx_cities_coordinates ON cities(latitude, longitude);

-- Function to calculate distance between two cities in miles
CREATE OR REPLACE FUNCTION calculate_distance_miles(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    point(lon1, lat1) <@> point(lon2, lat2)
  );
END;
$$;

-- Function to calculate distance between two cities in kilometers
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
RETURNS double precision
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    point(lon1, lat1) <@> point(lon2, lat2)
  ) * 1.60934;
END;
$$;

-- Function to find nearby cities within a radius (in miles)
CREATE OR REPLACE FUNCTION get_nearby_cities(
  city_id uuid,
  radius_miles double precision DEFAULT 25
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  distance_miles double precision,
  latitude double precision,
  longitude double precision,
  state_id uuid,
  district_id uuid
)
LANGUAGE plpgsql
AS $$
DECLARE
  origin_lat double precision;
  origin_lon double precision;
BEGIN
  -- Get the origin city's coordinates
  SELECT c.latitude, c.longitude
  INTO origin_lat, origin_lon
  FROM cities c
  WHERE c.id = city_id;

  -- Return cities within the radius, excluding the origin city
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    (point(origin_lon, origin_lat) <@> point(c.longitude, c.latitude))::double precision AS distance_miles,
    c.latitude,
    c.longitude,
    c.state_id,
    c.district_id
  FROM cities c
  WHERE
    c.id != city_id
    AND c.latitude IS NOT NULL
    AND c.longitude IS NOT NULL
    AND (point(origin_lon, origin_lat) <@> point(c.longitude, c.latitude)) <= radius_miles
  ORDER BY distance_miles ASC;
END;
$$;

-- Function to find nearby cities by slug
CREATE OR REPLACE FUNCTION get_nearby_cities_by_slug(
  city_slug text,
  radius_miles double precision DEFAULT 25
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  distance_miles double precision,
  latitude double precision,
  longitude double precision,
  state_id uuid,
  district_id uuid
)
LANGUAGE plpgsql
AS $$
DECLARE
  origin_id uuid;
BEGIN
  -- Get the origin city's id
  SELECT c.id INTO origin_id FROM cities c WHERE c.slug = city_slug;
  
  -- Return results from the main function
  RETURN QUERY SELECT * FROM get_nearby_cities(origin_id, radius_miles);
END;
$$;
