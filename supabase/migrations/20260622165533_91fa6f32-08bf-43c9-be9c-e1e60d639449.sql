
CREATE POLICY "Anyone can upload agent onboarding files"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'agent-onboarding-uploads');

CREATE POLICY "Admins can read agent onboarding files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'agent-onboarding-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete agent onboarding files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'agent-onboarding-uploads' AND public.has_role(auth.uid(), 'admin'));
