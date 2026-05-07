import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type EstatePlanningStatus = Database["public"]["Enums"]["estate_planning_status"];

export interface EstatePlanningApplication {
  id: string;
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  spouse_name: string | null;
  advisor_id: string | null;
  advisor_name: string | null;
  advisor_email: string | null;
  status: EstatePlanningStatus;
  current_step: number;
  form_data: Record<string, unknown>;
  source_url: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

const KEY = ["admin-estate-planning-applications"];

export const useAdminEstatePlanningApplications = () => {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<EstatePlanningApplication[]> => {
      const { data, error } = await supabase
        .from("estate_planning_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((a) => ({ ...a, form_data: a.form_data as Record<string, unknown> }));
    },
  });
};

export const useUpdateEstatePlanningStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EstatePlanningStatus }) => {
      const { error } = await supabase
        .from("estate_planning_applications")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useDeleteEstatePlanningApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("estate_planning_applications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
