DROP FUNCTION IF EXISTS public.get_advisor_by_slug(text);

CREATE FUNCTION public.get_advisor_by_slug(advisor_slug text)
RETURNS TABLE(id uuid, name text, title text, image_url text, scheduling_link text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    da.id,
    da.name,
    da.title,
    da.image_url,
    da.scheduling_link
  FROM public.dynamic_advisors da
  WHERE da.slug = advisor_slug
    AND da.status = 'published'
  LIMIT 1;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_advisor_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_advisor_by_slug(text) TO anon, authenticated;