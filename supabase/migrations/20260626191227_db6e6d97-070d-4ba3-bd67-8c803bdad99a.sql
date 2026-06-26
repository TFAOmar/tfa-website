
-- 1. Public can view published advisors (so read RPCs can run as INVOKER)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid='public.dynamic_advisors'::regclass AND polname='Public can view published advisors') THEN
    CREATE POLICY "Public can view published advisors"
      ON public.dynamic_advisors FOR SELECT
      USING (status = 'published');
  END IF;
END $$;

GRANT SELECT ON public.dynamic_advisors TO anon;

-- 2. Convert read RPCs to SECURITY INVOKER (they no longer need to bypass RLS)
CREATE OR REPLACE FUNCTION public.get_public_advisors()
RETURNS TABLE(id uuid, name text, title text, type advisor_type, state text, city text, region text, bio text, passionate_bio text, specialties text[], licenses text[], years_of_experience integer, image_url text, scheduling_link text, status advisor_status, display_priority integer, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public'
AS $$
  SELECT id, name, title, type, state, city, region, bio, passionate_bio, specialties, licenses,
         years_of_experience, image_url, scheduling_link, status, display_priority, created_at, updated_at
  FROM public.dynamic_advisors
  WHERE status = 'published'
  ORDER BY name ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_advisor_by_slug(advisor_slug text)
RETURNS TABLE(id uuid, name text, title text, image_url text, scheduling_link text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path TO 'public'
AS $$
  SELECT da.id, da.name, da.title, da.image_url, da.scheduling_link
  FROM public.dynamic_advisors da
  WHERE da.slug = advisor_slug AND da.status = 'published'
  LIMIT 1;
$$;

-- 3. Sponsorship tiers: stop exposing stripe_price_id to the public.
-- Revoke broad table SELECT, create a safe public view, and re-grant only what's needed.
REVOKE SELECT ON public.sponsorship_tiers FROM anon;
REVOKE SELECT ON public.sponsorship_tiers FROM authenticated;

GRANT SELECT (id, tier_id, name, price, price_note, features, highlight, is_popular, display_order, is_active, created_at, updated_at)
  ON public.sponsorship_tiers TO anon, authenticated;
-- Admins also need stripe_price_id; they go through the admin path which uses authenticated + RLS policy.
-- Grant full SELECT to authenticated so the admin policy can return all columns; RLS still gates rows for non-admins via the "Anyone can view active tiers" policy which doesn't restrict columns, but the column-level GRANT above limits anon. Authenticated admins need the price id:
GRANT SELECT (stripe_price_id) ON public.sponsorship_tiers TO authenticated;

-- 4. Add an explicit UPDATE policy on the private agent-onboarding-uploads bucket
-- (only admins can update; everyone else is blocked by RLS).
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid='storage.objects'::regclass AND polname='Admins can update agent onboarding files') THEN
    CREATE POLICY "Admins can update agent onboarding files"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'agent-onboarding-uploads' AND public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (bucket_id = 'agent-onboarding-uploads' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;
