-- Create rewards store table
CREATE TABLE public.store_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  icon TEXT NOT NULL DEFAULT '🎁',
  coin_cost INTEGER NOT NULL DEFAULT 100,
  reward_type TEXT NOT NULL DEFAULT 'cosmetic',
  reward_data JSONB DEFAULT '{}',
  stock INTEGER DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user purchased rewards table
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.store_rewards(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, reward_id)
);

-- Enable RLS
ALTER TABLE public.store_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Store rewards policies (read-only for authenticated users)
CREATE POLICY "Anyone authenticated can view active rewards"
  ON public.store_rewards FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- User rewards policies
CREATE POLICY "Users can view their own rewards"
  ON public.user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase rewards"
  ON public.user_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
  ON public.user_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert initial rewards
INSERT INTO public.store_rewards (code, name, description, category, icon, coin_cost, reward_type, reward_data, sort_order) VALUES
  ('avatar_gold_frame', 'Moldura Dourada', 'Uma moldura dourada exclusiva para seu avatar', 'avatar', '👑', 500, 'cosmetic', '{"frame_color": "gold"}', 1),
  ('avatar_diamond_frame', 'Moldura Diamante', 'Uma moldura de diamante brilhante para seu avatar', 'avatar', '💎', 1000, 'cosmetic', '{"frame_color": "diamond"}', 2),
  ('badge_top_seller', 'Badge Top Vendedor', 'Exiba o badge de Top Vendedor no seu perfil', 'badge', '🏆', 750, 'badge', '{"badge_type": "top_seller"}', 3),
  ('badge_expert', 'Badge Especialista', 'Badge de especialista em produtos', 'badge', '🎯', 500, 'badge', '{"badge_type": "expert"}', 4),
  ('badge_streak_master', 'Badge Streak Master', 'Para quem mantém sequências impressionantes', 'badge', '🔥', 600, 'badge', '{"badge_type": "streak_master"}', 5),
  ('theme_dark_gold', 'Tema Escuro Dourado', 'Tema exclusivo dark com detalhes em dourado', 'theme', '🌙', 1500, 'theme', '{"theme_id": "dark_gold"}', 6),
  ('theme_ocean', 'Tema Oceano', 'Tema relaxante com tons de azul', 'theme', '🌊', 1200, 'theme', '{"theme_id": "ocean"}', 7),
  ('boost_xp_24h', 'Boost XP 24h', 'Ganhe 2x XP por 24 horas', 'boost', '⚡', 300, 'boost', '{"boost_type": "xp", "multiplier": 2, "duration_hours": 24}', 8),
  ('boost_coins_24h', 'Boost Coins 24h', 'Ganhe 2x moedas por 24 horas', 'boost', '💰', 400, 'boost', '{"boost_type": "coins", "multiplier": 2, "duration_hours": 24}', 9),
  ('title_legend', 'Título: Lenda', 'Exiba o título "Lenda" no seu perfil', 'title', '⭐', 2000, 'title', '{"title": "Lenda"}', 10),
  ('title_champion', 'Título: Campeão', 'Exiba o título "Campeão" no seu perfil', 'title', '🏅', 1500, 'title', '{"title": "Campeão"}', 11),
  ('title_master', 'Título: Mestre', 'Exiba o título "Mestre" no seu perfil', 'title', '🎖️', 1000, 'title', '{"title": "Mestre"}', 12);