-- Create products table for synced products from external database
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 1,
  category_id INTEGER,
  category_name TEXT,
  subcategory TEXT,
  supplier_id TEXT,
  supplier_name TEXT,
  stock INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'in-stock',
  is_kit BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  on_sale BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  materials TEXT[] DEFAULT '{}',
  tags JSONB DEFAULT '{}'::jsonb,
  kit_items JSONB DEFAULT '[]'::jsonb,
  variations JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product sync logs table
CREATE TABLE public.product_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending',
  products_received INTEGER DEFAULT 0,
  products_created INTEGER DEFAULT 0,
  products_updated INTEGER DEFAULT 0,
  products_failed INTEGER DEFAULT 0,
  error_message TEXT,
  source TEXT DEFAULT 'n8n',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (readable by all authenticated, manageable by service/admins)
CREATE POLICY "Authenticated users can view products"
  ON public.products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can manage products"
  ON public.products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for sync logs
CREATE POLICY "Admins can view sync logs"
  ON public.product_sync_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can manage sync logs"
  ON public.product_sync_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_external_id ON public.products(external_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_stock_status ON public.products(stock_status);
CREATE INDEX idx_products_featured ON public.products(featured);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();