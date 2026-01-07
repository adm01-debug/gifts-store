-- Create table for product view analytics
CREATE TABLE public.product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_sku TEXT,
  product_name TEXT NOT NULL,
  seller_id UUID NOT NULL,
  view_type TEXT NOT NULL DEFAULT 'detail', -- 'detail', 'card', 'compare', 'favorite'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for search analytics
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  seller_id UUID NOT NULL,
  filters_used JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX idx_product_views_created_at ON public.product_views(created_at DESC);
CREATE INDEX idx_product_views_seller_id ON public.product_views(seller_id);
CREATE INDEX idx_search_analytics_created_at ON public.search_analytics(created_at DESC);
CREATE INDEX idx_search_analytics_search_term ON public.search_analytics(search_term);

-- Enable RLS
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_views
CREATE POLICY "Sellers can create their own views"
ON public.product_views
FOR INSERT
WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Admins can view all product views"
ON public.product_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can view their own views"
ON public.product_views
FOR SELECT
USING (seller_id = auth.uid());

-- RLS Policies for search_analytics
CREATE POLICY "Sellers can create their own searches"
ON public.search_analytics
FOR INSERT
WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Admins can view all searches"
ON public.search_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can view their own searches"
ON public.search_analytics
FOR SELECT
USING (seller_id = auth.uid());