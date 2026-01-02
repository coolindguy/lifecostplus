/*
  # Add School Districts and Education Data

  1. New Tables
    - `school_districts`
      - `id` (uuid, primary key) - Unique identifier for each school district
      - `name` (text) - District name
      - `city_id` (uuid) - Reference to the city
      - `state_id` (uuid) - Reference to the state
      - `type` (text) - Type: public or private
      - `total_schools` (integer) - Total number of schools in district
      - `total_students` (integer) - Total enrolled students
      - `student_teacher_ratio` (decimal) - Student to teacher ratio
      - `graduation_rate` (decimal) - Graduation rate percentage (0-100)
      - `college_readiness` (decimal) - College readiness percentage (0-100)
      - `test_scores_avg` (decimal) - Average test scores (0-100)
      - `rating` (decimal) - Overall rating (0-10)
      - `funding_per_student` (integer) - Annual funding per student in dollars
      - `special_programs` (text[]) - Array of special programs offered
      - `created_at` (timestamptz) - Record creation timestamp

  2. Indexes
    - Create index on city_id for efficient city-based queries
    - Create index on state_id for efficient state-based queries
    - Create index on type for filtering by public/private

  3. Security
    - Enable RLS on `school_districts` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS school_districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city_id uuid,
  state_id uuid,
  type text NOT NULL CHECK (type IN ('public', 'private')),
  total_schools integer DEFAULT 0,
  total_students integer DEFAULT 0,
  student_teacher_ratio decimal(5,2),
  graduation_rate decimal(5,2) CHECK (graduation_rate >= 0 AND graduation_rate <= 100),
  college_readiness decimal(5,2) CHECK (college_readiness >= 0 AND college_readiness <= 100),
  test_scores_avg decimal(5,2) CHECK (test_scores_avg >= 0 AND test_scores_avg <= 100),
  rating decimal(3,1) CHECK (rating >= 0 AND rating <= 10),
  funding_per_student integer DEFAULT 0,
  special_programs text[],
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_school_districts_city ON school_districts(city_id, type);
CREATE INDEX IF NOT EXISTS idx_school_districts_state ON school_districts(state_id, type);
CREATE INDEX IF NOT EXISTS idx_school_districts_rating ON school_districts(rating DESC);

ALTER TABLE school_districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view school districts"
  ON school_districts
  FOR SELECT
  TO public
  USING (true);