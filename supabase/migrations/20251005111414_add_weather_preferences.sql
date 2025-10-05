/*
  # Add Weather Preferences and Trade Types

  1. New Tables
    - `weather_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `trade_type` (text) - Selected trade profession
      - `work_start_time` (text) - Typical work start time
      - `work_end_time` (text) - Typical work end time
      - `outdoor_percentage` (integer) - Percentage of work done outdoors
      - `weather_alerts_enabled` (boolean) - Enable weather alerts
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `weather_preferences` table
    - Add policies for authenticated users to manage their own preferences
*/

CREATE TABLE IF NOT EXISTS weather_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_type text NOT NULL DEFAULT 'general',
  work_start_time text DEFAULT '07:00',
  work_end_time text DEFAULT '17:00',
  outdoor_percentage integer DEFAULT 50,
  weather_alerts_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE weather_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weather preferences"
  ON weather_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weather preferences"
  ON weather_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weather preferences"
  ON weather_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weather preferences"
  ON weather_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);