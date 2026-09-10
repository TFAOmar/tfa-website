import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { advisors } from "@/data/advisors";

export interface PreferredPartner {
  id: string;
  slug: string;
  name: string;
  company: string | null;
  category: string;
  title: string | null;
  city: string | null;
  state: string | null;
  bio: string | null;
  specialties: string[];
  phone: string | null;
  email: string | null;
  website_url: string | null;
  photo_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/** Falls back to the bundled advisor headshot when no photo has been uploaded. */
export const partnerPhoto = (partner: Pick<PreferredPartner, "slug" | "photo_url">) => {
  if (partner.photo_url) return partner.photo_url;
  const advisor = advisors.find((a) => String(a.id) === partner.slug);
  return advisor?.image;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const usePreferredPartners = (opts?: { includeUnpublished?: boolean }) =>
  useQuery({
    queryKey: ["preferred-partners", opts?.includeUnpublished ?? false],
    queryFn: async () => {
      let query = supabase
        .from("preferred_partners")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (!opts?.includeUnpublished) query = query.eq("is_published", true);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as PreferredPartner[];
    },
  });

export const usePreferredPartner = (slug?: string) =>
  useQuery({
    queryKey: ["preferred-partner", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preferred_partners")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return (data as PreferredPartner) ?? null;
    },
  });

type PartnerInput = Partial<PreferredPartner> & { name: string; category: string };

export const useSavePartner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PartnerInput) => {
      const payload = {
        slug: input.slug || slugify(input.name),
        name: input.name,
        company: input.company || null,
        category: input.category,
        title: input.title || null,
        city: input.city || null,
        state: input.state || null,
        bio: input.bio || null,
        specialties: input.specialties ?? [],
        phone: input.phone || null,
        email: input.email || null,
        website_url: input.website_url || null,
        photo_url: input.photo_url || null,
        display_order: input.display_order ?? 0,
        is_published: input.is_published ?? true,
      };

      if (input.id) {
        const { error } = await supabase
          .from("preferred_partners")
          .update(payload)
          .eq("id", input.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("preferred_partners").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["preferred-partners"] });
      qc.invalidateQueries({ queryKey: ["preferred-partner"] });
    },
  });
};

export const useDeletePartner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("preferred_partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preferred-partners"] }),
  });
};

export const useUploadPartnerPhoto = () =>
  useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `preferred-partners/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("advisor-photos")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("advisor-photos").getPublicUrl(path);
      return data.publicUrl;
    },
  });
