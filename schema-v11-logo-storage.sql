insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('logos', 'logos', true, 5242880, array['image/png','image/jpeg','image/jpg','image/webp','image/svg+xml'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Cualquiera puede VER los logos (los micrositios públicos los muestran)
create policy "public reads logos" on storage.objects
  for select using (bucket_id = 'logos');

-- Solo la propia agencia puede subir dentro de SU carpeta (primer segmento
-- de la ruta = su agency_id) — el resto de agencias no pueden tocarla.
create policy "agency uploads own logo" on storage.objects
  for insert
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = (select agency_id::text from profiles where id = auth.uid())
  );

create policy "agency updates own logo" on storage.objects
  for update
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = (select agency_id::text from profiles where id = auth.uid())
  );
