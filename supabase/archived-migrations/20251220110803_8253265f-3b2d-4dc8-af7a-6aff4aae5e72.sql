-- Create table for quote templates
CREATE TABLE public.quote_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  template_data JSONB NOT NULL DEFAULT '{}',
  items_data JSONB NOT NULL DEFAULT '[]',
  discount_percent NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  payment_terms TEXT,
  delivery_time TEXT,
  validity_days INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Sellers can view their own templates" 
ON public.quote_templates 
FOR SELECT 
USING (seller_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sellers can create their own templates" 
ON public.quote_templates 
FOR INSERT 
WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their own templates" 
ON public.quote_templates 
FOR UPDATE 
USING (seller_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sellers can delete their own templates" 
ON public.quote_templates 
FOR DELETE 
USING (seller_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_quote_templates_updated_at
BEFORE UPDATE ON public.quote_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();