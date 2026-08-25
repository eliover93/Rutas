alter table proposals add column views integer default 0 not null;

-- El público que ve /p/[slug] no tiene permiso de UPDATE sobre proposals
-- (solo la agencia dueña, vía RLS). Esta función, al ser security definer,
-- puede incrementar la vista sin necesitar esos permisos.
create or replace function public.increment_proposal_views(p_slug text)
returns void as $$
begin
  update public.proposals set views = views + 1 where public_slug = p_slug;
end;
$$ language plpgsql security definer;

grant execute on function public.increment_proposal_views(text) to anon, authenticated;
