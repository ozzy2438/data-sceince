/*
  # Add session_id column
  
  1. Changes
    - Add session_id column to analysis_history table
    - Make it non-null with a default value
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add session_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'analysis_history' 
    AND column_name = 'session_id'
  ) THEN
    ALTER TABLE analysis_history 
    ADD COLUMN session_id text NOT NULL DEFAULT 'legacy';
  END IF;
END $$;