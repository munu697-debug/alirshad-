-- Run this once in the Supabase SQL Editor.
-- Brings an older database up to date with what the app expects.
-- Safe to run multiple times.

-- 1. Issues table (magazine editions)
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT NOT NULL,
  edition_label TEXT DEFAULT 'Pocket Edition',
  description TEXT,
  published_date TEXT,
  is_published BOOLEAN DEFAULT true,
  is_latest BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'issues'
  ) THEN
    CREATE POLICY "Published issues viewable by everyone" ON public.issues FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Missing columns on posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS issue_id UUID REFERENCES public.issues(id) ON DELETE SET NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_cover_story BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS read_time TEXT DEFAULT '5 min read';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 3. Make Supabase's API see the new columns immediately
NOTIFY pgrst, 'reload schema';
