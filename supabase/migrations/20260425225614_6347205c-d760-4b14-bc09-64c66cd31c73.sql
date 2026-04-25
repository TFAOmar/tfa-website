CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior schedule with this name so re-runs are idempotent
DO $$
BEGIN
  PERFORM cron.unschedule('retry-missed-life-insurance-notifications');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'retry-missed-life-insurance-notifications',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://cstkeblqqyjwlrbppucu.supabase.co/functions/v1/retry-missed-life-insurance-notifications',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdGtlYmxxcXlqd2xyYnBwdWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Nzk5MTgsImV4cCI6MjA4MTE1NTkxOH0.a-nhVwuN98APmWz0eSR57lHHqBWOMpnREkuIAJ-1ppo"}'::jsonb,
    body:=concat('{"trigger":"cron","time":"', now(), '"}')::jsonb
  ) as request_id;
  $$
);