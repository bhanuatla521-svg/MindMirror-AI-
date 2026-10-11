-- ====================================================================
-- MINDMIRROR AI — POSTGRESQL SCHEMA WITH ROW-LEVEL SECURITY (SUPABASE)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS PROFILE & PREFERENCES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'theme-claude' CHECK (theme IN ('theme-ultra-minimal', 'theme-pure-bw', 'theme-claude')),
  color_mode TEXT DEFAULT 'light' CHECK (color_mode IN ('light', 'dark', 'system')),
  active_dimensions INT[] DEFAULT '{1,2,4,6,8,9,11,13,17,18,20,22,26,27,29,30}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DIARY ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_of_week TEXT,
  title TEXT,
  content TEXT NOT NULL,
  word_count INT DEFAULT 0,
  mood INT CHECK (mood BETWEEN 1 AND 5),
  energy INT CHECK (energy BETWEEN 1 AND 10),
  stress INT CHECK (stress BETWEEN 1 AND 10),
  sleep_hours NUMERIC(4, 1) DEFAULT 7.0,
  sleep_quality TEXT DEFAULT 'Good' CHECK (sleep_quality IN ('Poor', 'Fair', 'Good', 'Restorative')),
  social_interactions TEXT,
  events TEXT,
  successes TEXT,
  difficulties TEXT,
  lessons TEXT,
  gratitude TEXT,
  priorities_tomorrow TEXT,
  tags TEXT[] DEFAULT '{}',
  is_analyzed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. AI DAILY REVIEWS TABLE (Stored independently with foreign key cascade)
CREATE TABLE IF NOT EXISTS public.ai_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_used TEXT NOT NULL,
  model_used TEXT NOT NULL,
  latency_ms INT,
  day_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
  what_went_well JSONB NOT NULL DEFAULT '[]'::jsonb,
  mistakes_and_improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
  emotional_reflection JSONB NOT NULL DEFAULT '{}'::jsonb,
  thinking_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  social_interaction_review JSONB NOT NULL DEFAULT '{}'::jsonb,
  action_plan JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_and_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_feedback JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entry_id)
);

-- 5. PERSONAL DEVELOPMENT INDICATORS
CREATE TABLE IF NOT EXISTS public.user_dimension_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dimension_id INT NOT NULL,
  current_score INT CHECK (current_score BETWEEN 0 AND 100),
  confidence_score INT CHECK (confidence_score BETWEEN 0 AND 100),
  sample_size INT DEFAULT 1,
  evidence_level TEXT DEFAULT 'Developing',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dimension_id)
);

CREATE TABLE IF NOT EXISTS public.dimension_evidence_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dimension_id INT NOT NULL,
  entry_id UUID REFERENCES public.diary_entries(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  explanation TEXT NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HABITS AND HABIT LOGS
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT DEFAULT 'daily',
  target_days INT DEFAULT 7,
  connected_dimension TEXT,
  obstacle_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  UNIQUE(habit_id, date)
);

-- 7. GOALS AND ACTIONS
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reason TEXT,
  target_date DATE,
  status TEXT DEFAULT 'in_progress',
  small_next_action TEXT,
  progress_percentage INT DEFAULT 0,
  obstacles TEXT,
  lessons_learned TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tracked_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_review_id UUID REFERENCES public.ai_reviews(id) ON DELETE SET NULL,
  action_text TEXT NOT NULL,
  target_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  did_help_rating TEXT CHECK (did_help_rating IN ('helped', 'neutral', 'unhelpful')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI USAGE, LATENCY & BUDGET AUDIT LOG
-- (Notice: never stores sensitive raw diary content!)
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'daily_review' | 'chat_coach'
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  latency_ms INT NOT NULL,
  status TEXT NOT NULL, -- 'success' | 'rate_limited' | 'error' | 'fallback'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dimension_evidence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policy
CREATE POLICY "Users can view and edit own profile"
  ON public.profiles FOR ALL USING (auth.uid() = id);

-- 2. Diary Entries Policy
CREATE POLICY "Users can CRUD own diary entries"
  ON public.diary_entries FOR ALL USING (auth.uid() = user_id);

-- 3. AI Reviews Policy
CREATE POLICY "Users can CRUD own AI reviews"
  ON public.ai_reviews FOR ALL USING (auth.uid() = user_id);

-- 4. Dimensions Policy
CREATE POLICY "Users can view own dimension scores"
  ON public.user_dimension_scores FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own evidence logs"
  ON public.dimension_evidence_logs FOR ALL USING (auth.uid() = user_id);

-- 5. Habits Policy
CREATE POLICY "Users can manage own habits"
  ON public.habits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own habit completions"
  ON public.habit_completions FOR ALL USING (auth.uid() = user_id);

-- 6. Goals & Actions Policy
CREATE POLICY "Users can manage own goals"
  ON public.goals FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tracked actions"
  ON public.tracked_actions FOR ALL USING (auth.uid() = user_id);

-- 7. AI Usage Logs Policy
CREATE POLICY "Users can view own AI usage logs"
  ON public.ai_usage_logs FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_diary_user_date ON public.diary_entries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_reviews_entry ON public.ai_reviews(entry_id);
CREATE INDEX IF NOT EXISTS idx_tracked_actions_user ON public.tracked_actions(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs(user_id, created_at DESC);
