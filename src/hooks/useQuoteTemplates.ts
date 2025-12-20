import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface QuoteTemplateItem {
  productId?: string;
  productSku?: string;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  colorName?: string;
  colorHex?: string;
  personalizations?: {
    techniqueId: string;
    techniqueName: string;
    colorsCount?: number;
    positionsCount?: number;
    unitCost?: number;
    setupCost?: number;
  }[];
}

export interface QuoteTemplate {
  id: string;
  seller_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  template_data: Record<string, unknown>;
  items_data: QuoteTemplateItem[];
  discount_percent: number;
  discount_amount: number;
  notes?: string;
  internal_notes?: string;
  payment_terms?: string;
  delivery_time?: string;
  validity_days: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  is_default?: boolean;
  items_data?: QuoteTemplateItem[];
  discount_percent?: number;
  discount_amount?: number;
  notes?: string;
  internal_notes?: string;
  payment_terms?: string;
  delivery_time?: string;
  validity_days?: number;
}

export function useQuoteTemplates() {
  const [templates, setTemplates] = useState<QuoteTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<QuoteTemplate[]>([]);
  const [sellers, setSellers] = useState<{ id: string; full_name: string | null; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("quote_templates")
        .select("*")
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Transform the data to ensure proper typing
      const transformedData = (data || []).map((item) => ({
        ...item,
        items_data: Array.isArray(item.items_data) 
          ? item.items_data as unknown as QuoteTemplateItem[]
          : [],
        template_data: typeof item.template_data === 'object' && item.template_data !== null
          ? item.template_data as Record<string, unknown>
          : {},
      }));

      setTemplates(transformedData);
    } catch (err) {
      console.error("Error fetching quote templates:", err);
      setError("Erro ao carregar templates");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch all templates (for admins to clone between sellers)
  const fetchAllTemplates = useCallback(async () => {
    if (!user || !isAdmin) {
      setAllTemplates([]);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("quote_templates")
        .select("*")
        .order("seller_id")
        .order("updated_at", { ascending: false });

      if (fetchError) throw fetchError;

      const transformedData = (data || []).map((item) => ({
        ...item,
        items_data: Array.isArray(item.items_data) 
          ? item.items_data as unknown as QuoteTemplateItem[]
          : [],
        template_data: typeof item.template_data === 'object' && item.template_data !== null
          ? item.template_data as Record<string, unknown>
          : {},
      }));

      setAllTemplates(transformedData);
    } catch (err) {
      console.error("Error fetching all templates:", err);
    }
  }, [user, isAdmin]);

  // Fetch all sellers (for admin cloning)
  const fetchSellers = useCallback(async () => {
    if (!user || !isAdmin) {
      setSellers([]);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .order("full_name");

      if (fetchError) throw fetchError;

      // Also get emails from auth (via user_roles as a proxy since we can't query auth.users directly)
      const sellersWithInfo = (data || []).map((profile) => ({
        id: profile.user_id,
        full_name: profile.full_name,
        email: profile.full_name || 'Vendedor'
      }));

      setSellers(sellersWithInfo);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    }
  }, [user, isAdmin]);

  const createTemplate = useCallback(async (input: CreateTemplateInput) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar templates",
        variant: "destructive",
      });
      return null;
    }

    try {
      // If setting as default, unset other defaults first
      if (input.is_default) {
        await supabase
          .from("quote_templates")
          .update({ is_default: false })
          .eq("seller_id", user.id)
          .eq("is_default", true);
      }

      const { data, error: insertError } = await supabase
        .from("quote_templates")
        .insert({
          seller_id: user.id,
          name: input.name,
          description: input.description || null,
          is_default: input.is_default || false,
          items_data: JSON.parse(JSON.stringify(input.items_data || [])),
          discount_percent: input.discount_percent || 0,
          discount_amount: input.discount_amount || 0,
          notes: input.notes || null,
          internal_notes: input.internal_notes || null,
          payment_terms: input.payment_terms || null,
          delivery_time: input.delivery_time || null,
          validity_days: input.validity_days || 30,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Template criado",
        description: `Template "${input.name}" salvo com sucesso`,
      });

      await fetchTemplates();
      return data;
    } catch (err) {
      console.error("Error creating template:", err);
      toast({
        title: "Erro",
        description: "Não foi possível criar o template",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast, fetchTemplates]);

  const updateTemplate = useCallback(async (
    id: string, 
    updates: Partial<CreateTemplateInput>
  ) => {
    if (!user) return null;

    try {
      // If setting as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from("quote_templates")
          .update({ is_default: false })
          .eq("seller_id", user.id)
          .eq("is_default", true)
          .neq("id", id);
      }

      // Prepare update payload, converting items_data to JSON compatible format
      const updatePayload: Record<string, unknown> = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      if (updates.items_data) {
        updatePayload.items_data = JSON.parse(JSON.stringify(updates.items_data));
      }

      const { data, error: updateError } = await supabase
        .from("quote_templates")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({
        title: "Template atualizado",
        description: "Alterações salvas com sucesso",
      });

      await fetchTemplates();
      return data;
    } catch (err) {
      console.error("Error updating template:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o template",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast, fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from("quote_templates")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      toast({
        title: "Template excluído",
        description: "Template removido com sucesso",
      });

      await fetchTemplates();
      return true;
    } catch (err) {
      console.error("Error deleting template:", err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o template",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, fetchTemplates]);

  const setDefaultTemplate = useCallback(async (id: string) => {
    return updateTemplate(id, { is_default: true });
  }, [updateTemplate]);

  const duplicateTemplate = useCallback(async (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return null;

    return createTemplate({
      name: `${template.name} (Cópia)`,
      description: template.description,
      is_default: false,
      items_data: template.items_data,
      discount_percent: template.discount_percent,
      discount_amount: template.discount_amount,
      notes: template.notes,
      internal_notes: template.internal_notes,
      payment_terms: template.payment_terms,
      delivery_time: template.delivery_time,
      validity_days: template.validity_days,
    });
  }, [templates, createTemplate]);

  // Clone template to another seller (admin only)
  const cloneTemplateToSeller = useCallback(async (templateId: string, targetSellerId: string) => {
    if (!user || !isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem clonar templates entre vendedores",
        variant: "destructive",
      });
      return null;
    }

    // Find template in allTemplates
    const template = allTemplates.find((t) => t.id === templateId);
    if (!template) {
      toast({
        title: "Erro",
        description: "Template não encontrado",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from("quote_templates")
        .insert({
          seller_id: targetSellerId,
          name: `${template.name} (Clonado)`,
          description: template.description || null,
          is_default: false,
          items_data: JSON.parse(JSON.stringify(template.items_data || [])),
          template_data: JSON.parse(JSON.stringify(template.template_data || {})),
          discount_percent: template.discount_percent || 0,
          discount_amount: template.discount_amount || 0,
          notes: template.notes || null,
          internal_notes: template.internal_notes || null,
          payment_terms: template.payment_terms || null,
          delivery_time: template.delivery_time || null,
          validity_days: template.validity_days || 30,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const targetSeller = sellers.find((s) => s.id === targetSellerId);
      toast({
        title: "Template clonado",
        description: `Template "${template.name}" clonado para ${targetSeller?.full_name || 'vendedor'} com sucesso`,
      });

      await fetchAllTemplates();
      return data;
    } catch (err) {
      console.error("Error cloning template:", err);
      toast({
        title: "Erro",
        description: "Não foi possível clonar o template",
        variant: "destructive",
      });
      return null;
    }
  }, [user, isAdmin, allTemplates, sellers, toast, fetchAllTemplates]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllTemplates();
      fetchSellers();
    }
  }, [isAdmin, fetchAllTemplates, fetchSellers]);

  return {
    templates,
    allTemplates,
    sellers,
    loading,
    error,
    isAdmin,
    fetchTemplates,
    fetchAllTemplates,
    fetchSellers,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    duplicateTemplate,
    cloneTemplateToSeller,
  };
}
