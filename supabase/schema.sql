-- ============================================================
-- financeRox — Supabase PostgreSQL Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  currency     text not null default 'EUR',
  avatar_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================================
-- categories
-- ============================================================
create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.profiles(id) on delete cascade,
  name       text not null,
  icon       text not null default 'circle',        -- lucide icon name
  color      text not null default '#6366f1',       -- hex color
  type       text not null check (type in ('income', 'expense')),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
create policy "Users manage own categories" on public.categories
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed default categories (called after user signup via trigger)
-- ============================================================
-- transactions
-- ============================================================
create table if not exists public.transactions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  category_id     uuid references public.categories(id) on delete set null,
  amount          numeric(12, 2) not null check (amount > 0),
  description     text,
  date            date not null default current_date,
  type            text not null check (type in ('income', 'expense')),
  -- Recurring fields
  is_recurring    boolean not null default false,
  interval        text check (interval in ('daily', 'weekly', 'monthly', 'yearly')),
  recurring_end   date,                            -- null = indefinite
  status          text not null default 'confirmed' check (status in ('confirmed', 'planned')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.transactions enable row level security;
create policy "Users manage own transactions" on public.transactions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for date-range queries
create index idx_transactions_user_date on public.transactions(user_id, date desc);

-- ============================================================
-- savings_goals
-- ============================================================
create table if not exists public.savings_goals (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  icon            text not null default 'piggy-bank',
  color           text not null default '#10b981',
  target_amount   numeric(12, 2) not null check (target_amount > 0),
  current_amount  numeric(12, 2) not null default 0 check (current_amount >= 0),
  deadline        date,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.savings_goals enable row level security;
create policy "Users manage own goals" on public.savings_goals
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row execute procedure public.set_updated_at();

create trigger set_goals_updated_at
  before update on public.savings_goals
  for each row execute procedure public.set_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Trigger: create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
