-- Sustituye el trigger de v4: ahora crea también la agencia, dentro del
-- mismo trigger (security definer, corre como postgres, nunca depende de
-- si el navegador ya tiene sesión o de si el email está confirmado).
-- El nombre de la agencia viaja en options.data.agency_name del signUp().

create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_agency_id uuid;
begin
  insert into public.agencies (name)
  values (coalesce(new.raw_user_meta_data->>'agency_name', 'Mi agencia'))
  returning id into new_agency_id;

  insert into public.profiles (id, agency_id, role)
  values (new.id, new_agency_id, 'owner');

  return new;
end;
$$ language plpgsql security definer;

-- El trigger de v4 (on_auth_user_created) ya apunta a esta función,
-- no hace falta recrearlo — create or replace basta.

-- La policy de insert de v4 en agencies ya no es necesaria para el signup
-- (el trigger la bypassa por ser security definer), pero la dejamos por si
-- en el futuro permites crear agencias desde el cliente por otro flujo.
