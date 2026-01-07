-- Create personalization locations table
CREATE TABLE public.personalization_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_type TEXT NOT NULL,
  location_name TEXT NOT NULL,
  code TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create personalization sizes table
CREATE TABLE public.personalization_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  technique_id UUID REFERENCES public.personalization_techniques(id) ON DELETE CASCADE,
  technique_code TEXT,
  size_label TEXT NOT NULL,
  width_cm NUMERIC(6,2),
  height_cm NUMERIC(6,2),
  area_cm2 NUMERIC(10,2),
  price_modifier NUMERIC(5,2) DEFAULT 1.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.personalization_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_sizes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations
CREATE POLICY "Authenticated users can view locations"
  ON public.personalization_locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage locations"
  ON public.personalization_locations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sizes
CREATE POLICY "Authenticated users can view sizes"
  ON public.personalization_sizes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sizes"
  ON public.personalization_sizes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_personalization_locations_product_type ON public.personalization_locations(product_type);
CREATE INDEX idx_personalization_sizes_technique_id ON public.personalization_sizes(technique_id);
CREATE INDEX idx_personalization_sizes_technique_code ON public.personalization_sizes(technique_code);