/*
  # Add Local and Regional Tax Data

  1. New Tables
    - `state_taxes`
      - `id` (uuid, primary key)
      - `state_id` (uuid, foreign key to states)
      - `year` (integer) - Year of tax rates
      - `income_tax_min_percent` (double precision) - Minimum income tax rate (0-100)
      - `income_tax_max_percent` (double precision) - Maximum income tax rate (0-100)
      - `income_tax_brackets` (integer) - Number of tax brackets
      - `has_income_tax` (boolean) - Whether state has income tax
      - `sales_tax_state_percent` (double precision) - State sales tax rate (0-100)
      - `avg_local_sales_tax_percent` (double precision) - Average local sales tax rate (0-100)
      - `avg_combined_sales_tax_percent` (double precision) - Average combined state + local sales tax (0-100)
      - `property_tax_effective_rate_percent` (double precision) - Effective property tax rate (0-100)
      - `median_property_tax_annual_usd` (double precision) - Median annual property tax payment
      - `gas_tax_per_gallon_usd` (double precision) - State gas tax per gallon
      - `corporate_tax_percent` (double precision) - State corporate income tax rate (0-100)
      - `estate_tax_exemption_usd` (double precision) - Estate tax exemption threshold
      - `has_estate_tax` (boolean) - Whether state has estate tax
      - `effective_tax_burden_percent` (double precision) - Overall effective tax burden (0-100)
      - `tax_burden_rank` (integer) - Ranking among states (1 = highest burden)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `city_taxes`
      - `id` (uuid, primary key)
      - `city_id` (uuid, foreign key to cities)
      - `year` (integer) - Year of tax rates
      - `local_income_tax_percent` (double precision) - City income tax rate (0-100)
      - `has_local_income_tax` (boolean) - Whether city has income tax
      - `local_sales_tax_percent` (double precision) - City sales tax rate (0-100)
      - `combined_sales_tax_percent` (double precision) - Total city + county + state sales tax (0-100)
      - `property_tax_rate_percent` (double precision) - City property tax rate (0-100)
      - `property_tax_per_1000_assessed` (double precision) - Tax per $1000 of assessed value
      - `median_property_tax_annual_usd` (double precision) - Median annual property tax payment
      - `avg_effective_property_tax_percent` (double precision) - Average effective property tax rate (0-100)
      - `business_tax_type` (text) - Type of business tax (e.g., "license", "gross receipts", "none")
      - `business_tax_rate_percent` (double precision) - Business tax rate if applicable (0-100)
      - `hotel_tax_percent` (double precision) - Hotel occupancy tax rate (0-100)
      - `restaurant_tax_percent` (double precision) - Restaurant/prepared food tax rate (0-100)
      - `utility_tax_percent` (double precision) - Utility tax rate (0-100)
      - `vehicle_registration_annual_avg_usd` (double precision) - Average annual vehicle registration
      - `parking_tax_percent` (double precision) - Parking tax rate if applicable (0-100)
      - `effective_total_tax_burden_percent` (double precision) - Combined effective tax burden (0-100)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `district_taxes`
      - `id` (uuid, primary key)
      - `district_id` (uuid, foreign key to districts)
      - `year` (integer) - Year of tax rates
      - `local_income_tax_percent` (double precision) - District income tax rate (0-100)
      - `has_local_income_tax` (boolean) - Whether district has income tax
      - `local_sales_tax_percent` (double precision) - District sales tax rate (0-100)
      - `combined_sales_tax_percent` (double precision) - Total district + state sales tax (0-100)
      - `property_tax_rate_percent` (double precision) - District property tax rate (0-100)
      - `median_property_tax_annual_usd` (double precision) - Median annual property tax payment
      - `avg_effective_property_tax_percent` (double precision) - Average effective property tax rate (0-100)
      - `effective_total_tax_burden_percent` (double precision) - Combined effective tax burden (0-100)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (tax data is public information)

  3. Indexes
    - Add indexes on foreign keys and year columns for performance
    - Add composite indexes for common query patterns

  4. Functions
    - Function to get latest tax data for a location
    - Function to compare tax burden across locations
    - Function to calculate total tax burden estimate for given income/property value
*/

-- Create state_taxes table
CREATE TABLE IF NOT EXISTS state_taxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  year integer NOT NULL,
  income_tax_min_percent double precision DEFAULT 0,
  income_tax_max_percent double precision DEFAULT 0,
  income_tax_brackets integer DEFAULT 0,
  has_income_tax boolean DEFAULT false,
  sales_tax_state_percent double precision DEFAULT 0,
  avg_local_sales_tax_percent double precision DEFAULT 0,
  avg_combined_sales_tax_percent double precision DEFAULT 0,
  property_tax_effective_rate_percent double precision DEFAULT 0,
  median_property_tax_annual_usd double precision DEFAULT 0,
  gas_tax_per_gallon_usd double precision DEFAULT 0,
  corporate_tax_percent double precision DEFAULT 0,
  estate_tax_exemption_usd double precision DEFAULT 0,
  has_estate_tax boolean DEFAULT false,
  effective_tax_burden_percent double precision DEFAULT 0,
  tax_burden_rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_state_tax_year UNIQUE(state_id, year)
);

-- Create city_taxes table
CREATE TABLE IF NOT EXISTS city_taxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  year integer NOT NULL,
  local_income_tax_percent double precision DEFAULT 0,
  has_local_income_tax boolean DEFAULT false,
  local_sales_tax_percent double precision DEFAULT 0,
  combined_sales_tax_percent double precision DEFAULT 0,
  property_tax_rate_percent double precision DEFAULT 0,
  property_tax_per_1000_assessed double precision DEFAULT 0,
  median_property_tax_annual_usd double precision DEFAULT 0,
  avg_effective_property_tax_percent double precision DEFAULT 0,
  business_tax_type text DEFAULT 'none',
  business_tax_rate_percent double precision DEFAULT 0,
  hotel_tax_percent double precision DEFAULT 0,
  restaurant_tax_percent double precision DEFAULT 0,
  utility_tax_percent double precision DEFAULT 0,
  vehicle_registration_annual_avg_usd double precision DEFAULT 0,
  parking_tax_percent double precision DEFAULT 0,
  effective_total_tax_burden_percent double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_city_tax_year UNIQUE(city_id, year)
);

-- Create district_taxes table
CREATE TABLE IF NOT EXISTS district_taxes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  year integer NOT NULL,
  local_income_tax_percent double precision DEFAULT 0,
  has_local_income_tax boolean DEFAULT false,
  local_sales_tax_percent double precision DEFAULT 0,
  combined_sales_tax_percent double precision DEFAULT 0,
  property_tax_rate_percent double precision DEFAULT 0,
  median_property_tax_annual_usd double precision DEFAULT 0,
  avg_effective_property_tax_percent double precision DEFAULT 0,
  effective_total_tax_burden_percent double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_district_tax_year UNIQUE(district_id, year)
);

-- Enable RLS
ALTER TABLE state_taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE district_taxes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Anyone can read state tax data"
  ON state_taxes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read city tax data"
  ON city_taxes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read district tax data"
  ON district_taxes FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_taxes_state_id ON state_taxes(state_id);
CREATE INDEX IF NOT EXISTS idx_state_taxes_year ON state_taxes(year);
CREATE INDEX IF NOT EXISTS idx_state_taxes_state_year ON state_taxes(state_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_city_taxes_city_id ON city_taxes(city_id);
CREATE INDEX IF NOT EXISTS idx_city_taxes_year ON city_taxes(year);
CREATE INDEX IF NOT EXISTS idx_city_taxes_city_year ON city_taxes(city_id, year DESC);

CREATE INDEX IF NOT EXISTS idx_district_taxes_district_id ON district_taxes(district_id);
CREATE INDEX IF NOT EXISTS idx_district_taxes_year ON district_taxes(year);
CREATE INDEX IF NOT EXISTS idx_district_taxes_district_year ON district_taxes(district_id, year DESC);

-- Function to get latest state tax data
CREATE OR REPLACE FUNCTION get_latest_state_taxes(state_slug text)
RETURNS TABLE (
  state_id uuid,
  state_name text,
  year integer,
  income_tax_min_percent double precision,
  income_tax_max_percent double precision,
  income_tax_brackets integer,
  has_income_tax boolean,
  sales_tax_state_percent double precision,
  avg_local_sales_tax_percent double precision,
  avg_combined_sales_tax_percent double precision,
  property_tax_effective_rate_percent double precision,
  median_property_tax_annual_usd double precision,
  gas_tax_per_gallon_usd double precision,
  corporate_tax_percent double precision,
  estate_tax_exemption_usd double precision,
  has_estate_tax boolean,
  effective_tax_burden_percent double precision,
  tax_burden_rank integer
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id AS state_id,
    s.name AS state_name,
    t.year,
    t.income_tax_min_percent,
    t.income_tax_max_percent,
    t.income_tax_brackets,
    t.has_income_tax,
    t.sales_tax_state_percent,
    t.avg_local_sales_tax_percent,
    t.avg_combined_sales_tax_percent,
    t.property_tax_effective_rate_percent,
    t.median_property_tax_annual_usd,
    t.gas_tax_per_gallon_usd,
    t.corporate_tax_percent,
    t.estate_tax_exemption_usd,
    t.has_estate_tax,
    t.effective_tax_burden_percent,
    t.tax_burden_rank
  FROM states s
  INNER JOIN state_taxes t ON s.id = t.state_id
  WHERE s.slug = state_slug
  ORDER BY t.year DESC
  LIMIT 1;
END;
$$;

-- Function to get latest city tax data
CREATE OR REPLACE FUNCTION get_latest_city_taxes(city_slug text)
RETURNS TABLE (
  city_id uuid,
  city_name text,
  year integer,
  local_income_tax_percent double precision,
  has_local_income_tax boolean,
  local_sales_tax_percent double precision,
  combined_sales_tax_percent double precision,
  property_tax_rate_percent double precision,
  property_tax_per_1000_assessed double precision,
  median_property_tax_annual_usd double precision,
  avg_effective_property_tax_percent double precision,
  business_tax_type text,
  business_tax_rate_percent double precision,
  hotel_tax_percent double precision,
  restaurant_tax_percent double precision,
  utility_tax_percent double precision,
  vehicle_registration_annual_avg_usd double precision,
  parking_tax_percent double precision,
  effective_total_tax_burden_percent double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS city_id,
    c.name AS city_name,
    t.year,
    t.local_income_tax_percent,
    t.has_local_income_tax,
    t.local_sales_tax_percent,
    t.combined_sales_tax_percent,
    t.property_tax_rate_percent,
    t.property_tax_per_1000_assessed,
    t.median_property_tax_annual_usd,
    t.avg_effective_property_tax_percent,
    t.business_tax_type,
    t.business_tax_rate_percent,
    t.hotel_tax_percent,
    t.restaurant_tax_percent,
    t.utility_tax_percent,
    t.vehicle_registration_annual_avg_usd,
    t.parking_tax_percent,
    t.effective_total_tax_burden_percent
  FROM cities c
  INNER JOIN city_taxes t ON c.id = t.city_id
  WHERE c.slug = city_slug
  ORDER BY t.year DESC
  LIMIT 1;
END;
$$;

-- Function to get latest district tax data
CREATE OR REPLACE FUNCTION get_latest_district_taxes(district_slug text)
RETURNS TABLE (
  district_id uuid,
  district_name text,
  year integer,
  local_income_tax_percent double precision,
  has_local_income_tax boolean,
  local_sales_tax_percent double precision,
  combined_sales_tax_percent double precision,
  property_tax_rate_percent double precision,
  median_property_tax_annual_usd double precision,
  avg_effective_property_tax_percent double precision,
  effective_total_tax_burden_percent double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id AS district_id,
    d.name AS district_name,
    t.year,
    t.local_income_tax_percent,
    t.has_local_income_tax,
    t.local_sales_tax_percent,
    t.combined_sales_tax_percent,
    t.property_tax_rate_percent,
    t.median_property_tax_annual_usd,
    t.avg_effective_property_tax_percent,
    t.effective_total_tax_burden_percent
  FROM districts d
  INNER JOIN district_taxes t ON d.id = t.district_id
  WHERE d.slug = district_slug
  ORDER BY t.year DESC
  LIMIT 1;
END;
$$;

-- Function to compare tax burden across cities
CREATE OR REPLACE FUNCTION compare_city_tax_burden(city_slugs text[])
RETURNS TABLE (
  city_name text,
  city_slug text,
  state_name text,
  combined_sales_tax_percent double precision,
  avg_effective_property_tax_percent double precision,
  local_income_tax_percent double precision,
  effective_total_tax_burden_percent double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS city_name,
    c.slug AS city_slug,
    s.name AS state_name,
    t.combined_sales_tax_percent,
    t.avg_effective_property_tax_percent,
    t.local_income_tax_percent,
    t.effective_total_tax_burden_percent
  FROM cities c
  INNER JOIN states s ON c.state_id = s.id
  INNER JOIN LATERAL (
    SELECT *
    FROM city_taxes
    WHERE city_id = c.id
    ORDER BY year DESC
    LIMIT 1
  ) t ON true
  WHERE c.slug = ANY(city_slugs)
  ORDER BY t.effective_total_tax_burden_percent DESC;
END;
$$;

-- Function to estimate annual tax burden for a location
CREATE OR REPLACE FUNCTION estimate_annual_tax_burden(
  city_slug text,
  annual_income_usd double precision,
  property_value_usd double precision,
  annual_spending_usd double precision
)
RETURNS TABLE (
  location_name text,
  estimated_income_tax_usd double precision,
  estimated_property_tax_usd double precision,
  estimated_sales_tax_usd double precision,
  estimated_total_tax_usd double precision,
  effective_tax_rate_percent double precision
)
LANGUAGE plpgsql
AS $$
DECLARE
  city_rec RECORD;
  state_rec RECORD;
  income_tax double precision := 0;
  property_tax double precision := 0;
  sales_tax double precision := 0;
  total_tax double precision := 0;
BEGIN
  -- Get city tax data
  SELECT * INTO city_rec
  FROM get_latest_city_taxes(city_slug)
  LIMIT 1;

  IF city_rec IS NULL THEN
    RETURN;
  END IF;

  -- Get state tax data
  SELECT * INTO state_rec
  FROM states s
  INNER JOIN cities c ON c.state_id = s.id
  INNER JOIN LATERAL (
    SELECT * FROM get_latest_state_taxes(s.slug) LIMIT 1
  ) st ON true
  WHERE c.slug = city_slug
  LIMIT 1;

  -- Calculate income tax (simplified - uses average of min/max state rate + local)
  IF state_rec.has_income_tax THEN
    income_tax := annual_income_usd * ((state_rec.income_tax_min_percent + state_rec.income_tax_max_percent) / 2.0) / 100.0;
  END IF;
  
  IF city_rec.has_local_income_tax THEN
    income_tax := income_tax + (annual_income_usd * city_rec.local_income_tax_percent / 100.0);
  END IF;

  -- Calculate property tax
  property_tax := property_value_usd * (city_rec.avg_effective_property_tax_percent / 100.0);

  -- Calculate sales tax (on spending)
  sales_tax := annual_spending_usd * (city_rec.combined_sales_tax_percent / 100.0);

  -- Calculate total
  total_tax := income_tax + property_tax + sales_tax;

  RETURN QUERY
  SELECT
    city_rec.city_name AS location_name,
    income_tax AS estimated_income_tax_usd,
    property_tax AS estimated_property_tax_usd,
    sales_tax AS estimated_sales_tax_usd,
    total_tax AS estimated_total_tax_usd,
    (total_tax / annual_income_usd * 100.0) AS effective_tax_rate_percent;
END;
$$;