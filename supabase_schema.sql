-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (for admin roles)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- POSTS (News/Blog)
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROJECTS (Portfolio)
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS (Catalog)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STORAGE BUCKETS
-- You will need to create a bucket named 'images' in the Storage section of dashboard
-- Policy to allow public read access
-- (Run this in SQL editor only after creating the bucket, or just configure in UI)
