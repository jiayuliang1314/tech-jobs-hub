-- Supabase数据库表结构（可选方案）
-- 在Supabase SQL Editor中运行此脚本

-- 创建jobs表
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    greenhouse_id TEXT UNIQUE NOT NULL,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    url TEXT,
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 索引字段
    CONSTRAINT jobs_greenhouse_id_key UNIQUE (greenhouse_id)
);

-- 创建索引（提高查询速度）
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at DESC);

-- 全文搜索索引（可选）
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || COALESCE(location, '')));

-- 创建公司统计视图
CREATE OR REPLACE VIEW company_stats AS
SELECT 
    company,
    COUNT(*) as job_count,
    MAX(updated_at) as last_updated
FROM jobs
GROUP BY company
ORDER BY job_count DESC;

-- 启用Row Level Security (RLS) - 公开只读
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow public read access" 
ON jobs FOR SELECT 
TO public 
USING (true);

-- 只允许service_role写入（在后台脚本中使用）
CREATE POLICY "Allow authenticated insert" 
ON jobs FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 示例查询
-- 1. 搜索职位
-- SELECT * FROM jobs WHERE title ILIKE '%engineer%' LIMIT 20;

-- 2. 按公司查询
-- SELECT * FROM jobs WHERE company = 'airbnb' ORDER BY updated_at DESC;

-- 3. 统计
-- SELECT * FROM company_stats LIMIT 50;

-- 4. 全文搜索
-- SELECT * FROM jobs WHERE to_tsvector('english', title || ' ' || COALESCE(location, '')) @@ to_tsquery('software & engineer');

