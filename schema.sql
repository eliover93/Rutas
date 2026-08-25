-- AGENCIES (va primero: profiles la referencia)
create table agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  brand_color text default '#0ea5e9',
  custom_domain text,
  subscription_status text default 'trialing' check (subscription_status in ('trialing','active','expired','canceled')),
  plan text default 'starter' check (plan in ('starter','pro','team')),
  stripe_customer_id text,
  trial_ends_at timestamptz default (now() + interval '15 days'),
  is_founder_deal boolean default false,
  created_at timestamptz default now()
);

-- PROFILES (extiende auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  agency_id uuid references agencies(id) on delete cascade,
  full_name text,
  role text default 'agent' check (role in ('agent', 'owner', 'superadmin')),
  created_at timestamptz default now()
);

-- PROPOSALS
create table proposals (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  client_name text not null,
  title text not null,
  destination text not null,
  theme_key text,
  cover_image_url text,
  start_date date,
  end_date date,
  price numeric(10,2),
  status text default 'draft' check (status in ('draft','sent','accepted','rejected')),
  public_slug text unique default encode(gen_random_bytes(6), 'hex'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ITINERARY_DAYS
create table itinerary_days (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid references proposals(id) on delete cascade,
  day_number int not null,
  title text,
  description text,
  accommodation text,
  image_url text,
  order_index int default 0
);

alter table agencies enable row level security;
alter table proposals enable row level security;
alter table itinerary_days enable row level security;

create policy "agency reads own data" on agencies
  for select using (id = (select agency_id from profiles where id = auth.uid()));

create policy "agency manages own proposals" on proposals
  for all using (agency_id = (select agency_id from profiles where id = auth.uid()));

create policy "public reads sent/accepted proposals" on proposals
  for select using (status in ('sent','accepted'));
