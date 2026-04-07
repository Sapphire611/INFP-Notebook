-- 纪念日表创建脚本
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

CREATE TABLE IF NOT EXISTS anniversaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES wechat_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL DEFAULT 'past' CHECK (type IN ('past', 'future')),
  icon TEXT DEFAULT '🎂',
  is_yearly_repeat BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anniversaries_user_id ON anniversaries(user_id);
CREATE INDEX IF NOT EXISTS idx_anniversaries_date ON anniversaries(date);

CREATE TRIGGER update_anniversaries_updated_at
    BEFORE UPDATE ON anniversaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户访问自己的纪念日" ON anniversaries
    FOR ALL
    USING (true)
    WITH CHECK (true);

GRANT ALL ON anniversaries TO anon;
GRANT ALL ON anniversaries TO authenticated;
GRANT ALL ON anniversaries TO service_role;

DO $$
BEGIN
    RAISE NOTICE 'anniversaries 表创建成功！';
END $$;
