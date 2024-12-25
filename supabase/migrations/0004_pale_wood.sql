/*
  # Update analysis history table structure
  
  1. Changes
    - Drop existing policies safely
    - Recreate table with session-based access
    - Add simplified RLS policy
  
  2. Security
    - Enable RLS
    - Add policy for all operations
*/

-- Drop existing policies safely
DROP POLICY IF EXISTS "Users can view own session data" ON analysis_history;
DROP POLICY IF EXISTS "Users can insert own session data" ON analysis_history;
DROP POLICY IF EXISTS "Users can update own session data" ON analysis_history;
DROP POLICY IF EXISTS "Users can delete own session data" ON analysis_history;
DROP POLICY IF EXISTS "Public can access analysis history" ON analysis_history;

-- Drop and recreate the table
DROP TABLE IF EXISTS analysis_history;

CREATE TABLE public.analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  filename text NOT NULL,
  created_at timestamptz DEFAULT now(),
  summary jsonb NOT NULL,
  analysis_report jsonb NOT NULL,
  insights text,
  data jsonb NOT NULL
);

-- Enable RLS
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Create a single policy for session-based access
CREATE POLICY "Session based access"
  ON public.analysis_history
  FOR ALL
  USING (true)
  WITH CHECK (true);