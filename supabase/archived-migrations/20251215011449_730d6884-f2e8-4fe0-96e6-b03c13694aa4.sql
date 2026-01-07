-- Create table for storing generated mockups
CREATE TABLE public.generated_mockups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  client_id UUID REFERENCES public.bitrix_clients(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  technique_id UUID REFERENCES public.personalization_techniques(id) ON DELETE SET NULL,
  technique_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  mockup_url TEXT NOT NULL,
  position_x INTEGER DEFAULT 50,
  position_y INTEGER DEFAULT 50,
  logo_width_cm NUMERIC DEFAULT 5,
  logo_height_cm NUMERIC DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_generated_mockups_seller_id ON public.generated_mockups(seller_id);
CREATE INDEX idx_generated_mockups_client_id ON public.generated_mockups(client_id);
CREATE INDEX idx_generated_mockups_created_at ON public.generated_mockups(created_at DESC);

-- Enable RLS
ALTER TABLE public.generated_mockups ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own mockups
CREATE POLICY "Sellers can view their own mockups"
ON public.generated_mockups
FOR SELECT
USING (seller_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Sellers can create their own mockups
CREATE POLICY "Sellers can create their own mockups"
ON public.generated_mockups
FOR INSERT
WITH CHECK (seller_id = auth.uid());

-- Sellers can delete their own mockups
CREATE POLICY "Sellers can delete their own mockups"
ON public.generated_mockups
FOR DELETE
USING (seller_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));