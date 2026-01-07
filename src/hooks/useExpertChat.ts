import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ExpertConversation {
  id: string;
  user_id: string;
  expert_type: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ExpertMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export function useExpertConversations(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["expert-conversations", userId],
    queryFn: async (): Promise<ExpertConversation[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("expert_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const createConversation = useMutation({
    mutationFn: async (input: { userId: string; expertType: string; title: string }) => {
      const { data, error } = await supabase
        .from("expert_conversations")
        .insert({ user_id: input.userId, expert_type: input.expertType, title: input.title, status: "active" })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expert-conversations"] }),
  });

  return { conversations: query.data || [], isLoading: query.isLoading, createConversation };
}

export function useExpertMessages(conversationId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["expert-messages", conversationId],
    queryFn: async (): Promise<ExpertMessage[]> => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from("expert_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId,
  });

  const sendMessage = useMutation({
    mutationFn: async (input: { conversationId: string; role: string; content: string }) => {
      const { data, error } = await supabase
        .from("expert_messages")
        .insert({ conversation_id: input.conversationId, role: input.role, content: input.content })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expert-messages"] }),
  });

  return { messages: query.data || [], isLoading: query.isLoading, sendMessage };
}
