-- 1. Crea la fila de profiles automáticamente al registrarse en auth.users
--    (hasta ahora nada la generaba, por eso el update en signup no tenía efecto).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Faltaba la policy de insert en agencies: el esquema original solo
--    permitía "select". Sin esto, crear la agencia en el signup falla por RLS.
create policy "authenticated users can create an agency" on agencies
  for insert
  with check (auth.uid() is not null);
