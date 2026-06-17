ALTER TABLE public.life_insurance_applications
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'medical';

CREATE INDEX IF NOT EXISTS life_insurance_applications_product_type_idx
  ON public.life_insurance_applications (product_type);