/*
  # Analysis History Schema

  1. New Tables
    - analysis_history: Stores CSV analysis results and metadata
      - id: UUID primary key
      - user_id: Reference to auth.users
      - filename: Name of analyzed CSV file
      - created_at: Timestamp
      - summary: Analysis summary (jsonb)
      - analysis_report: Detailed analysis (jsonb)
      - insights: AI-generated insights
      - data: Original CSV data (jsonb)

  2. Security
    - Row Level Security enabled
    - Policies for authenticated users to manage their own data
*/

-- Create analysis history table
create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  filename text not null,
  created_at timestamptz default now(),
  summary jsonb not null,
  analysis_report jsonb not null,
  insights text,
  data jsonb not null
);

-- Enable RLS
alter table public.analysis_history enable row level security;

-- Create policies
create policy "Users can view own analysis history"
  on public.analysis_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own analysis history"
  on public.analysis_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analysis history"
  on public.analysis_history for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own analysis history"
  on public.analysis_history for delete
  using (auth.uid() = user_id);