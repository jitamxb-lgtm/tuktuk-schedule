/*
  # Add missing columns to todos table

  1. Changes
    - Add `created_at` column to `todos` table if it doesn't exist
    - Add `updated_at` column to `todos` table if it doesn't exist
    - Add trigger function and trigger for auto-updating `updated_at`

  2. Notes
    - Uses conditional logic to only add columns if they don't exist
    - Safe to run multiple times
*/

-- Add created_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'todos' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE todos ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'todos' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE todos ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();