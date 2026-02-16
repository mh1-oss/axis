-- Enable RLS on tables
alter table public.projects enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;

-- PROJECTS POLICIES
create policy "Public projects are viewable by everyone." on public.projects for select using (true);
create policy "Authenticated users can insert projects." on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update projects." on public.projects for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete projects." on public.projects for delete using (auth.role() = 'authenticated');

-- PRODUCTS POLICIES
create policy "Public products are viewable by everyone." on public.products for select using (true);
create policy "Authenticated users can insert products." on public.products for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update products." on public.products for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete products." on public.products for delete using (auth.role() = 'authenticated');

-- POSTS POLICIES
create policy "Public posts are viewable by everyone." on public.posts for select using (true);
create policy "Authenticated users can insert posts." on public.posts for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update posts." on public.posts for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete posts." on public.posts for delete using (auth.role() = 'authenticated');
