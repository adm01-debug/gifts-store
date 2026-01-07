import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface QuoteVersion {
  id: string;
  quote_id: string;
  version_number: number;
  snapshot: Record<string, unknown>;
  change_summary?: string;
  created_by: string;
  created_at: string;
  author?: {
    full_name: string;
  };
}

export function useQuoteVersions(quoteId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const versionsQuery = useQuery({
    queryKey: ["quote-versions", quoteId],
    queryFn: async () => {
      if (!quoteId) return [];
      
      const { data, error } = await supabase
        .from("quote_versions")
        .select(`
          *,
          author:profiles(full_name)
        `)
        .eq("quote_id", quoteId)
        .order("version_number", { ascending: false });

      if (error) {
        console.error("Erro ao buscar versões:", error);
        return [];
      }
      return data as QuoteVersion[];
    },
    enabled: !!quoteId,
  });

  const createVersion = useMutation({
    mutationFn: async ({ snapshot, changeSummary }: { snapshot: Record<string, unknown>; changeSummary?: string }) => {
      // Get next version number
      const currentVersions = versionsQuery.data || [];
      const nextVersion = currentVersions.length > 0 
        ? Math.max(...currentVersions.map(v => v.version_number)) + 1 
        : 1;

      const { data, error } = await supabase
        .from("quote_versions")
        .insert({
          quote_id: quoteId,
          version_number: nextVersion,
          snapshot,
          change_summary: changeSummary,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-versions", quoteId] });
      toast.success("Versão salva!");
    },
  });

  const restoreVersion = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versionsQuery.data?.find(v => v.id === versionId);
      if (!version) throw new Error("Versão não encontrada");

      // Update quote with snapshot data
      const { error } = await supabase
        .from("quotes")
        .update(version.snapshot)
        .eq("id", quoteId);

      if (error) throw error;

      // Create new version marking restoration
      await createVersion.mutateAsync({
        snapshot: version.snapshot,
        changeSummary: `Restaurado da versão ${version.version_number}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Versão restaurada!");
    },
  });

  return {
    versions: versionsQuery.data || [],
    currentVersion: versionsQuery.data?.[0],
    isLoading: versionsQuery.isLoading,
    createVersion,
    restoreVersion,
    refetch: versionsQuery.refetch,
  };
}
