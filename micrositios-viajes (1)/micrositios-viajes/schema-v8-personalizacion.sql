alter table itinerary_days
  add column image_credit text,
  add column image_credit_url text;

alter table proposals
  add column client_message text;
