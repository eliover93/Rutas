alter table agencies
  add column stripe_subscription_id text;

alter table agencies drop constraint agencies_subscription_status_check;
alter table agencies add constraint agencies_subscription_status_check
  check (subscription_status in ('trialing','active','past_due','expired','canceled'));
