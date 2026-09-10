CREATE TABLE public.preferred_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  company text,
  category text NOT NULL,
  title text,
  city text,
  state text,
  bio text,
  specialties text[] NOT NULL DEFAULT '{}',
  phone text,
  email text,
  website_url text,
  photo_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.preferred_partners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.preferred_partners TO authenticated;
GRANT ALL ON public.preferred_partners TO service_role;

ALTER TABLE public.preferred_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published partners are publicly viewable"
ON public.preferred_partners FOR SELECT
USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins and staff can insert partners"
ON public.preferred_partners FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins and staff can update partners"
ON public.preferred_partners FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins can delete partners"
ON public.preferred_partners FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_preferred_partners_updated_at
BEFORE UPDATE ON public.preferred_partners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_preferred_partners_order ON public.preferred_partners (display_order, name);