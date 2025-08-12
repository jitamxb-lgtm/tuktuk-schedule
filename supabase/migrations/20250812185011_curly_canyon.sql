/*
  # Create todos table for task management

  1. New Tables
    - `todos`
      - `id` (uuid, primary key)
      - `task` (text, the todo task description)
      - `is_complete` (boolean, completion status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `todos` table
    - Add policies for public access (matching the original functionality)
*/

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task text NOT NULL,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Allow public access for todos (matching original functionality)
CREATE POLICY "Allow public read access on todos"
  ON todos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access on todos"
  ON todos
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access on todos"
  ON todos
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access on todos"
  ON todos
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

-- Trigger to automatically update updated_at
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();