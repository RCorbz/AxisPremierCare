**Component:** Supabase (PostgreSQL)
**Purpose:** Defines the minimal database structure required for Axis Premier Care v1.0.

## Overview
We require two simple tables: one for public lead capture (Waitlist) and one for internal operational tracking (Sentiment).
**CRITICAL CONSTRAINT:** No patient medical data (PHI) is to be stored here. All PHI remains in Jane App.

---

## Table 1: `leads` (The Waitlist)
**Purpose:** Tracks visitors who request information via the marketing site but have not yet booked in Jane App.

```sql
-- 1. Create the table
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Contact Info
  full_name text not null,
  email text, 
  phone text,
  
  -- Status Tracking
  -- Enforcing specific values to prevent frontend typos
  interest_level text check (interest_level in ('High', 'Medium', 'Low')) default 'Medium',
  status text check (status in ('New', 'Contacted', 'Converted', 'Archived')) default 'New',
  
  -- Context
  notes text
);

-- 2. Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- 3. RLS Policies

-- Policy A: Public Insert (The Website Form)
-- Allows anyone (even unauthenticated visitors) to add their name to the list.
create policy "Allow public inserts" 
  on public.leads 
  for insert 
  with check (true);

-- Policy B: Admin View (The Dashboard)
-- Only authenticated users (The Doctor/Admin) can see the list.
create policy "Allow admins to view leads" 
  on public.leads 
  for select 
  using (auth.role() = 'authenticated');

-- Policy C: Admin Update (Marking as 'Contacted')
create policy "Allow admins to update leads" 
  on public.leads 
  for update 
  using (auth.role() = 'authenticated');
```
