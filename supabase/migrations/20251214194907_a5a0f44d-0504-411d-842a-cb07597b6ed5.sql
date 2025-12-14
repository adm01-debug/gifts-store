-- Create enum for quote status
CREATE TYPE public.quote_status AS ENUM ('draft', 'pending', 'sent', 'approved', 'rejected', 'expired');

-- Create personalization techniques table
CREATE TABLE public.personalization_techniques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT UNIQUE,
  min_quantity INTEGER DEFAULT 1,
  setup_cost NUMERIC(10,2) DEFAULT 0,
  unit_cost NUMERIC(10,2) DEFAULT 0,
  estimated_days INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.bitrix_clients(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status quote_status NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  valid_until DATE,
  bitrix_deal_id TEXT,
  bitrix_quote_id TEXT,
  synced_to_bitrix BOOLEAN DEFAULT false,
  synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote items table
CREATE TABLE public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  color_name TEXT,
  color_hex TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote item personalizations (link items to techniques)
CREATE TABLE public.quote_item_personalizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_item_id UUID NOT NULL REFERENCES public.quote_items(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES public.personalization_techniques(id) ON DELETE RESTRICT,
  colors_count INTEGER DEFAULT 1,
  positions_count INTEGER DEFAULT 1,
  area_cm2 NUMERIC(8,2),
  setup_cost NUMERIC(10,2) DEFAULT 0,
  unit_cost NUMERIC(10,2) DEFAULT 0,
  total_cost NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to generate quote number
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.quote_number := 'ORC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create sequence for quote numbers
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;

-- Create trigger for auto quote number
CREATE TRIGGER set_quote_number
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL OR NEW.quote_number = '')
  EXECUTE FUNCTION public.generate_quote_number();

-- Create trigger for updated_at on quotes
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on quote_items
CREATE TRIGGER update_quote_items_updated_at
  BEFORE UPDATE ON public.quote_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on personalization_techniques
CREATE TRIGGER update_personalization_techniques_updated_at
  BEFORE UPDATE ON public.personalization_techniques
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.personalization_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_item_personalizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for personalization_techniques (read by all authenticated, managed by admins)
CREATE POLICY "Authenticated users can view techniques"
  ON public.personalization_techniques FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage techniques"
  ON public.personalization_techniques FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quotes
CREATE POLICY "Sellers can view their own quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can create quotes"
  ON public.quotes FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their own quotes"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can delete their draft quotes"
  ON public.quotes FOR DELETE
  TO authenticated
  USING ((seller_id = auth.uid() AND status = 'draft') OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quote_items (inherit from quote access)
CREATE POLICY "Users can view items of accessible quotes"
  ON public.quote_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q 
      WHERE q.id = quote_id 
      AND (q.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can manage items of their quotes"
  ON public.quote_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes q 
      WHERE q.id = quote_id 
      AND (q.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes q 
      WHERE q.id = quote_id 
      AND (q.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- RLS Policies for quote_item_personalizations
CREATE POLICY "Users can view personalizations of accessible items"
  ON public.quote_item_personalizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quote_items qi
      JOIN public.quotes q ON q.id = qi.quote_id
      WHERE qi.id = quote_item_id
      AND (q.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can manage personalizations of their items"
  ON public.quote_item_personalizations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quote_items qi
      JOIN public.quotes q ON q.id = qi.quote_id
      WHERE qi.id = quote_item_id
      AND (q.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quote_items qi
      JOIN public.quotes q ON q.id = qi.quote_id
      WHERE qi.id = quote_item_id
      AND (q.seller_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Create indexes for performance
CREATE INDEX idx_quotes_client_id ON public.quotes(client_id);
CREATE INDEX idx_quotes_seller_id ON public.quotes(seller_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quotes_bitrix_deal_id ON public.quotes(bitrix_deal_id);
CREATE INDEX idx_quote_items_quote_id ON public.quote_items(quote_id);
CREATE INDEX idx_quote_item_personalizations_item_id ON public.quote_item_personalizations(quote_item_id);
CREATE INDEX idx_quote_item_personalizations_technique_id ON public.quote_item_personalizations(technique_id);