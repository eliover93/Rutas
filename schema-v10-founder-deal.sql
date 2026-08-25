create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_agency_id uuid;
  founder boolean;
begin
  select count(*) < 20 into founder from public.agencies;

  insert into public.agencies (name, is_founder_deal)
  values (coalesce(new.raw_user_meta_data->>'agency_name', 'Mi agencia'), founder)
  returning id into new_agency_id;

  insert into public.profiles (id, agency_id, role)
  values (new.id, new_agency_id, 'owner');

  return new;
end;
$$ language plpgsql security definer;
