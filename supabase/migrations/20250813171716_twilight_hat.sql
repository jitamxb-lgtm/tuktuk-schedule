/*
  # Create goals and sub-goals system

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `title` (text, the main goal title)
      - `is_complete` (boolean, completion status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `sub_goals`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, foreign key to goals)
      - `title` (text, the sub-goal title)
      - `is_complete` (boolean, completion status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access
    - Add trigger to auto-complete main goal when all sub-goals are complete

  3. Functions
    - Function to check and update main goal completion status
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sub_goals table
CREATE TABLE IF NOT EXISTS sub_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_goals ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Allow public read access on goals"
  ON goals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on goals"
  ON goals
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access on goals"
  ON goals
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access on goals"
  ON goals
  FOR DELETE
  TO public
  USING (true);

-- Sub-goals policies
CREATE POLICY "Allow public read access on sub_goals"
  ON sub_goals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on sub_goals"
  ON sub_goals
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access on sub_goals"
  ON sub_goals
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access on sub_goals"
  ON sub_goals
  FOR DELETE
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check and update goal completion status
CREATE OR REPLACE FUNCTION check_goal_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the main goal's completion status based on sub-goals
  UPDATE goals 
  SET is_complete = (
    SELECT CASE 
      WHEN COUNT(*) = 0 THEN false
      ELSE COUNT(*) = COUNT(*) FILTER (WHERE is_complete = true)
    END
    FROM sub_goals 
    WHERE goal_id = COALESCE(NEW.goal_id, OLD.goal_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.goal_id, OLD.goal_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_goals_updated_at
  BEFORE UPDATE ON sub_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update goal completion when sub-goals change
CREATE TRIGGER check_goal_completion_trigger
  AFTER INSERT OR UPDATE OR DELETE ON sub_goals
  FOR EACH ROW
  EXECUTE FUNCTION check_goal_completion();