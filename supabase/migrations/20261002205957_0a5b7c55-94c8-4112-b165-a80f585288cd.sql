CREATE TABLE public.deed_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  services text[] NOT NULL DEFAULT '{}',
  deed_count integer NOT NULL DEFAULT 0,
  homestead_count integer NOT NULL DEFAULT 0,
  notary_requested boolean NOT NULL DEFAULT false,
  submitter_role text NOT NULL,
  agent_name text,
  agent_email text,
  agent_phone text,
  client_name text,
  client_email text,
  client_phone text,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  amount_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  notified_at timestamptz,
  sms_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.deed_service_requests TO authenticated;
GRANT ALL ON public.deed_service_requests TO service_role;
ALTER TABLE public.deed_service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view deed requests" ON public.deed_service_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update deed requests" ON public.deed_service_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_deed_service_requests_updated_at BEFORE UPDATE ON public.deed_service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();