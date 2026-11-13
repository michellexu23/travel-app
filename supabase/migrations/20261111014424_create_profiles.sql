create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name text check (char_length(display_name) <= 50),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Signed-in users can read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Users may only change these two columns; id and created_at become read-only.
revoke update on public.profiles from authenticated;
grant update (username, display_name) on public.profiles to authenticated;