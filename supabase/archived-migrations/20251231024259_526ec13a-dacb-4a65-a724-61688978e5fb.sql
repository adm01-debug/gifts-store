
-- Tabela para solicitações de reset de senha pendentes
CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Qualquer pessoa pode criar uma solicitação (não autenticado)
CREATE POLICY "Anyone can create password reset request"
ON public.password_reset_requests
FOR INSERT
WITH CHECK (true);

-- Gestores e admins podem ver todas as solicitações
CREATE POLICY "Managers and admins can view all requests"
ON public.password_reset_requests
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.user_id = auth.uid() AND r.name IN ('admin', 'manager')
  )
);

-- Gestores e admins podem atualizar (aprovar/rejeitar)
CREATE POLICY "Managers and admins can update requests"
ON public.password_reset_requests
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.user_id = auth.uid() AND r.name IN ('admin', 'manager')
  )
);

-- Index para busca por email e status
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_email ON public.password_reset_requests(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_status ON public.password_reset_requests(status);
