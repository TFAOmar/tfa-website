import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PrequalificationApplication {
  id: string;
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  advisor_id: string | null;
  advisor_name: string | null;
  advisor_email: string | null;
  status: string;
  current_step: number;
  form_data: Record<string, unknown>;
  source_url: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

const KEY = ["admin-prequalification-applications"];

export const useAdminPrequalifications = () => {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<PrequalificationApplication[]> => {
      const { data, error } = await supabase
        .from("prequalification_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((a) => ({ ...a, form_data: a.form_data as Record<string, unknown> }));
    },
  });
};

export const useUpdatePrequalificationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("prequalification_applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useDeletePrequalification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prequalification_applications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
