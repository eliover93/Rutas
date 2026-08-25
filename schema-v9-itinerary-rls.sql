create policy "agency manages own itinerary days" on itinerary_days
  for all
  using (
    proposal_id in (
      select id from proposals
      where agency_id = (select agency_id from profiles where id = auth.uid())
    )
  )
  with check (
    proposal_id in (
      select id from proposals
      where agency_id = (select agency_id from profiles where id = auth.uid())
    )
  );

create policy "public reads days of sent or accepted proposals" on itinerary_days
  for select
  using (
    proposal_id in (select id from proposals where status in ('sent','accepted'))
  );
