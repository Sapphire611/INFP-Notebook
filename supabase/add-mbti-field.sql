-- 为 wechat_users 表添加 mbti 字段
-- 在 Supabase SQL Editor 中运行此脚本

ALTER TABLE wechat_users
ADD COLUMN IF NOT EXISTS mbti TEXT;

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_wechat_users_mbti ON wechat_users(mbti);

-- 添加注释
COMMENT ON COLUMN wechat_users.mbti IS '用户的 MBTI 人格类型';
