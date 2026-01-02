/*
  # Add Weather Data for Cities

  1. New Table: city_weather
    - `id` (uuid, primary key)
    - `city_id` (uuid, foreign key to cities)
    - `current_temp_f` (integer) - Current temperature in Fahrenheit
    - `current_condition` (text) - Current weather condition description
    - `humidity` (integer) - Humidity percentage
    - `spring_avg_high_f` (integer) - Spring average high in Fahrenheit
    - `spring_avg_low_f` (integer) - Spring average low in Fahrenheit
    - `summer_avg_high_f` (integer) - Summer average high in Fahrenheit
    - `summer_avg_low_f` (integer) - Summer average low in Fahrenheit
    - `fall_avg_high_f` (integer) - Fall average high in Fahrenheit
    - `fall_avg_low_f` (integer) - Fall average low in Fahrenheit
    - `winter_avg_high_f` (integer) - Winter average high in Fahrenheit
    - `winter_avg_low_f` (integer) - Winter average low in Fahrenheit
    - `annual_precipitation_inches` (decimal) - Annual precipitation in inches
    - `sunny_days` (integer) - Number of sunny days per year
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `city_weather` table
    - Add policy for public read access (weather is public data)

  3. Functions
    - Create helper functions to convert Fahrenheit to Celsius
    - Create helper function to convert inches to millimeters
*/

-- Create city_weather table
CREATE TABLE IF NOT EXISTS city_weather (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid REFERENCES cities(id) ON DELETE CASCADE,
  current_temp_f integer,
  current_condition text DEFAULT 'Partly Cloudy',
  humidity integer DEFAULT 50,
  spring_avg_high_f integer,
  spring_avg_low_f integer,
  summer_avg_high_f integer,
  summer_avg_low_f integer,
  fall_avg_high_f integer,
  fall_avg_low_f integer,
  winter_avg_high_f integer,
  winter_avg_low_f integer,
  annual_precipitation_inches decimal(5,2) DEFAULT 40.0,
  sunny_days integer DEFAULT 200,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(city_id)
);

-- Enable RLS
ALTER TABLE city_weather ENABLE ROW LEVEL SECURITY;

-- Allow public read access to weather data
CREATE POLICY "Weather data is publicly readable"
  ON city_weather
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert weather data
CREATE POLICY "Authenticated users can insert weather data"
  ON city_weather
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update weather data
CREATE POLICY "Authenticated users can update weather data"
  ON city_weather
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster city lookups
CREATE INDEX IF NOT EXISTS idx_city_weather_city_id ON city_weather(city_id);

-- Function to convert Fahrenheit to Celsius
CREATE OR REPLACE FUNCTION fahrenheit_to_celsius(temp_f integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN ROUND((temp_f - 32) * 5.0 / 9.0);
END;
$$;

-- Function to convert inches to millimeters
CREATE OR REPLACE FUNCTION inches_to_mm(inches decimal)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN ROUND(inches * 25.4);
END;
$$;

-- Insert sample weather data for demonstration
INSERT INTO city_weather (
  city_id,
  current_temp_f,
  current_condition,
  humidity,
  spring_avg_high_f,
  spring_avg_low_f,
  summer_avg_high_f,
  summer_avg_low_f,
  fall_avg_high_f,
  fall_avg_low_f,
  winter_avg_high_f,
  winter_avg_low_f,
  annual_precipitation_inches,
  sunny_days
)
SELECT
  id,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 85
    WHEN name ILIKE '%Miami%' THEN 82
    WHEN name ILIKE '%San Diego%' THEN 72
    WHEN name ILIKE '%Seattle%' THEN 58
    WHEN name ILIKE '%Minneapolis%' THEN 45
    WHEN name ILIKE '%Denver%' THEN 62
    WHEN name ILIKE '%Austin%' THEN 78
    ELSE 68
  END,
  CASE
    WHEN name ILIKE '%Seattle%' THEN 'Cloudy'
    WHEN name ILIKE '%Phoenix%' THEN 'Sunny'
    WHEN name ILIKE '%Miami%' THEN 'Humid'
    ELSE 'Partly Cloudy'
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 25
    WHEN name ILIKE '%Miami%' THEN 75
    WHEN name ILIKE '%Seattle%' THEN 70
    ELSE 55
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 85
    WHEN name ILIKE '%Miami%' THEN 80
    WHEN name ILIKE '%Seattle%' THEN 58
    WHEN name ILIKE '%Minneapolis%' THEN 55
    ELSE 68
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 60
    WHEN name ILIKE '%Miami%' THEN 70
    WHEN name ILIKE '%Seattle%' THEN 45
    WHEN name ILIKE '%Minneapolis%' THEN 38
    ELSE 48
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 105
    WHEN name ILIKE '%Miami%' THEN 90
    WHEN name ILIKE '%Seattle%' THEN 75
    WHEN name ILIKE '%Minneapolis%' THEN 82
    ELSE 88
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 80
    WHEN name ILIKE '%Miami%' THEN 78
    WHEN name ILIKE '%Seattle%' THEN 58
    WHEN name ILIKE '%Minneapolis%' THEN 62
    ELSE 65
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 88
    WHEN name ILIKE '%Miami%' THEN 85
    WHEN name ILIKE '%Seattle%' THEN 62
    WHEN name ILIKE '%Minneapolis%' THEN 60
    ELSE 72
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 62
    WHEN name ILIKE '%Miami%' THEN 72
    WHEN name ILIKE '%Seattle%' THEN 48
    WHEN name ILIKE '%Minneapolis%' THEN 42
    ELSE 52
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 70
    WHEN name ILIKE '%Miami%' THEN 78
    WHEN name ILIKE '%Seattle%' THEN 48
    WHEN name ILIKE '%Minneapolis%' THEN 28
    ELSE 50
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 48
    WHEN name ILIKE '%Miami%' THEN 65
    WHEN name ILIKE '%Seattle%' THEN 35
    WHEN name ILIKE '%Minneapolis%' THEN 12
    ELSE 32
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 8.0
    WHEN name ILIKE '%Miami%' THEN 62.0
    WHEN name ILIKE '%Seattle%' THEN 38.0
    WHEN name ILIKE '%Minneapolis%' THEN 32.0
    WHEN name ILIKE '%San Diego%' THEN 10.0
    ELSE 40.0
  END,
  CASE
    WHEN name ILIKE '%Phoenix%' THEN 299
    WHEN name ILIKE '%San Diego%' THEN 266
    WHEN name ILIKE '%Seattle%' THEN 152
    WHEN name ILIKE '%Miami%' THEN 248
    ELSE 205
  END
FROM cities
WHERE NOT EXISTS (
  SELECT 1 FROM city_weather WHERE city_weather.city_id = cities.id
);
