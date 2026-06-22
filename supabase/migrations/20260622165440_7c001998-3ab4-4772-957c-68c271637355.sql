
CREATE TABLE public.agent_onboarding_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  current_section integer NOT NULL DEFAULT 1,
  resume_token text UNIQUE NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  applicant_name text,
  applicant_email text,
  applicant_phone text,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature text,
  signed_at timestamptz,
  submitted_at timestamptz,
  advisor_notification_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.agent_onboarding_applications TO anon, authenticated;
GRANT ALL ON public.agent_onboarding_applications TO service_role;

ALTER TABLE public.agent_onboarding_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a new draft (anonymous form submission)
CREATE POLICY "anyone_insert_agent_onboarding"
  ON public.agent_onboarding_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'draft');

-- Admins can view/manage all
CREATE POLICY "admins_select_agent_onboarding"
  ON public.agent_onboarding_applications
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_update_agent_onboarding"
  ON public.agent_onboarding_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_delete_agent_onboarding"
  ON public.agent_onboarding_applications
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER update_agent_onboarding_updated_at
  BEFORE UPDATE ON public.agent_onboarding_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Secure access via resume token (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_agent_onboarding_by_token(p_resume_token text)
RETURNS SETOF public.agent_onboarding_applications
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.agent_onboarding_applications
  WHERE resume_token = p_resume_token AND status = 'draft'
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_agent_onboarding_by_token(
  p_resume_token text,
  p_form_data jsonb,
  p_current_section integer,
  p_applicant_name text DEFAULT NULL,
  p_applicant_email text DEFAULT NULL,
  p_applicant_phone text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id
  FROM public.agent_onboarding_applications
  WHERE resume_token = p_resume_token AND status = 'draft'
  ORDER BY updated_at DESC LIMIT 1;

  IF v_id IS NULL THEN RETURN NULL; END IF;

  UPDATE public.agent_onboarding_applications
  SET form_data = p_form_data,
      current_section = p_current_section,
      applicant_name = COALESCE(p_applicant_name, applicant_name),
      applicant_email = COALESCE(p_applicant_email, applicant_email),
      applicant_phone = COALESCE(p_applicant_phone, applicant_phone),
      updated_at = now()
  WHERE id = v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_agent_onboarding_application(
  p_application_id uuid,
  p_signature text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.agent_onboarding_applications
  SET status = 'submitted',
      signature = p_signature,
      signed_at = now(),
      submitted_at = now(),
      updated_at = now()
  WHERE id = p_application_id AND status = 'draft';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found or already submitted';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_agent_onboarding_by_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_agent_onboarding_by_token(text, jsonb, integer, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_agent_onboarding_application(uuid, text) TO anon, authenticated;
