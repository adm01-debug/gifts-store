-- Tabela de gamificação do vendedor
CREATE TABLE public.seller_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_activities INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de conquistas disponíveis
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'trophy',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coins_reward INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL, -- 'xp', 'level', 'streak', 'activities', 'custom'
  requirement_value INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de conquistas do vendedor (junction)
CREATE TABLE public.seller_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.seller_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_gamification
CREATE POLICY "Users can view their own gamification" ON public.seller_gamification
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own gamification" ON public.seller_gamification
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert gamification" ON public.seller_gamification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for seller_achievements
CREATE POLICY "Users can view their own achievements" ON public.seller_achievements
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can earn achievements" ON public.seller_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_seller_gamification_updated_at
  BEFORE UPDATE ON public.seller_gamification
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (code, name, description, icon, xp_reward, coins_reward, category, requirement_type, requirement_value) VALUES
  ('first_login', 'Primeiro Acesso', 'Faça seu primeiro login no sistema', 'log-in', 50, 10, 'onboarding', 'custom', 1),
  ('streak_3', 'Consistente', 'Mantenha uma sequência de 3 dias', 'flame', 100, 25, 'streak', 'streak', 3),
  ('streak_7', 'Dedicado', 'Mantenha uma sequência de 7 dias', 'flame', 250, 50, 'streak', 'streak', 7),
  ('streak_30', 'Veterano', 'Mantenha uma sequência de 30 dias', 'flame', 1000, 200, 'streak', 'streak', 30),
  ('level_5', 'Aprendiz', 'Alcance o nível 5', 'star', 200, 50, 'level', 'level', 5),
  ('level_10', 'Profissional', 'Alcance o nível 10', 'star', 500, 100, 'level', 'level', 10),
  ('level_25', 'Expert', 'Alcance o nível 25', 'crown', 1500, 300, 'level', 'level', 25),
  ('activities_10', 'Ativo', 'Complete 10 atividades', 'activity', 100, 20, 'activities', 'activities', 10),
  ('activities_50', 'Engajado', 'Complete 50 atividades', 'activity', 300, 75, 'activities', 'activities', 50),
  ('activities_100', 'Produtivo', 'Complete 100 atividades', 'activity', 750, 150, 'activities', 'activities', 100),
  ('xp_1000', 'Mil XP', 'Acumule 1000 pontos de XP', 'zap', 100, 25, 'xp', 'xp', 1000),
  ('xp_5000', '5 Mil XP', 'Acumule 5000 pontos de XP', 'zap', 300, 75, 'xp', 'xp', 5000),
  ('xp_10000', '10 Mil XP', 'Acumule 10000 pontos de XP', 'zap', 750, 150, 'xp', 'xp', 10000);