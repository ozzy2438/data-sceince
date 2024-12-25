/*
  # Update analysis history table schema
  
  1. Changes
    - Remove user_id requirement
    - Add public access policy
    - Keep data organized by session
  
  2. Security
    - Enable RLS
    - Add policy for public access
*/

-- Create analysis history table
create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  filename text not null,
  created_at timestamptz default now(),
  summary jsonb not null,
  analysis_report jsonb not null,
  insights text,
  data jsonb not null
);

-- Enable RLS
alter table public.analysis_history enable row level security;

-- Create policy for public access
create policy "Public can access analysis history"
  on public.analysis_history for all
  using (true)
  with check (true);