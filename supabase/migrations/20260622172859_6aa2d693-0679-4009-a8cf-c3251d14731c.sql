
-- 1) Tighten INSERT WITH CHECK policies to remove "always true"

-- estate_planning_applications
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.estate_planning_applications;
CREATE POLICY "Anyone can submit applications"
  ON public.estate_planning_applications
  FOR INSERT
  WITH CHECK (status = 'draft'::estate_planning_status);

-- prequalification_applications
DROP POLICY IF EXISTS "Anyone can submit prequalification" ON public.prequalification_applications;
CREATE POLICY "Anyone can submit prequalification"
  ON public.prequalification_applications
  FOR INSERT
  WITH CHECK (status = 'draft');

-- life_insurance_applications
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.life_insurance_applications;
CREATE POLICY "Anyone can submit applications"
  ON public.life_insurance_applications
  FOR INSERT
  WITH CHECK (status = 'draft'::application_status);

-- event_submissions
DROP POLICY IF EXISTS "Anyone can submit events" ON public.event_submissions;
CREATE POLICY "Anyone can submit events"
  ON public.event_submissions
  FOR INSERT
  WITH CHECK (status IS NULL OR status = 'pending');

-- dynamic_advisors
DROP POLICY IF EXISTS "Anyone can submit advisor profile" ON public.dynamic_advisors;
CREATE POLICY "Anyone can submit advisor profile"
  ON public.dynamic_advisors
  FOR INSERT
  WITH CHECK (status = 'pending'::advisor_status);

-- sponsorship_leads
DROP POLICY IF EXISTS "Allow anonymous insert sponsorship_leads" ON public.sponsorship_leads;
CREATE POLICY "Allow anonymous insert sponsorship_leads"
  ON public.sponsorship_leads
  FOR INSERT
  WITH CHECK (status IS NULL OR status = 'pending');

-- form_submissions
DROP POLICY IF EXISTS "Anyone can submit forms" ON public.form_submissions;
CREATE POLICY "Anyone can submit forms"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (form_type IS NOT NULL AND length(form_type) BETWEEN 1 AND 100);

-- 2) Hide stripe_price_id from public reads of sponsorship_tiers via column-level revoke
REVOKE SELECT (stripe_price_id) ON public.sponsorship_tiers FROM anon, authenticated, PUBLIC;
-- service_role keeps full access (used by create-sponsorship-checkout edge function)

-- 3) Restrict agent-onboarding-uploads INSERT to a UUID-prefixed folder path
DROP POLICY IF EXISTS "Anyone can upload agent onboarding files" ON storage.objects;
CREATE POLICY "Anyone can upload agent onboarding files"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'agent-onboarding-uploads'
    AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  );

-- 4) Tighten public-bucket SELECT policies so they aren't broadly "any object in bucket"
-- advisor-photos
DROP POLICY IF EXISTS "Anyone can view advisor photos" ON storage.objects;
CREATE POLICY "Anyone can view advisor photos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'advisor-photos'
    AND lower(name) ~ '\.(jpe?g|png|webp|svg|gif|avif)$'
  );

-- event-images
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
CREATE POLICY "Anyone can view event images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'event-images'
    AND lower(name) ~ '\.(jpe?g|png|webp|svg|gif|avif)$'
  );

-- sponsor-logos
DROP POLICY IF EXISTS "Anyone can view sponsor logos" ON storage.objects;
CREATE POLICY "Anyone can view sponsor logos"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'sponsor-logos'
    AND lower(name) ~ '\.(jpe?g|png|webp|svg|gif|avif)$'
  );

-- business-card-uploads: remove broad public read; restrict to admins (files served via signed URLs)
DROP POLICY IF EXISTS "Business card files are publicly accessible" ON storage.objects;
CREATE POLICY "Admins can read business card files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'business-card-uploads'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- 5) Revoke direct EXECUTE on internal helper SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_advisor_slug(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
