#!/usr/bin/env python3
"""
将抓取的JSON数据导入Supabase（可选方案）
需要先安装：pip install supabase
"""

import json
from pathlib import Path
import os

# 需要先: pip install supabase
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Please install: pip install supabase")
    exit(1)

# 配置（从环境变量读取）
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'your-anon-key')

def init_supabase() -> Client:
    """初始化Supabase客户端"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def import_jobs(data_dir='data', batch_size=1000):
    """导入职位数据到Supabase"""
    supabase = init_supabase()
    data_path = Path(data_dir)
    
    total_jobs = 0
    total_companies = 0
    
    # 批量插入buffer
    batch = []
    
    for company_file in data_path.glob('*.json'):
        if company_file.name.startswith('_'):
            continue
        
        with open(company_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            company = data['company']
            
            for job in data.get('jobs', []):
                batch.append({
                    'greenhouse_id': str(job['id']),
                    'company': company,
                    'title': job['title'],
                    'location': job['location'],
                    'url': job['url'],
                    'updated_at': job.get('updated_at')
                })
                
                # 批量插入
                if len(batch) >= batch_size:
                    try:
                        supabase.table('jobs').upsert(batch).execute()
                        print(f"✅ Inserted {len(batch)} jobs")
                        total_jobs += len(batch)
                        batch = []
                    except Exception as e:
                        print(f"❌ Error inserting batch: {e}")
        
        total_companies += 1
        if total_companies % 100 == 0:
            print(f"📊 Processed {total_companies} companies, {total_jobs} jobs")
    
    # 插入剩余的
    if batch:
        try:
            supabase.table('jobs').upsert(batch).execute()
            total_jobs += len(batch)
        except Exception as e:
            print(f"❌ Error inserting final batch: {e}")
    
    print(f"\n🎉 Import complete!")
    print(f"Companies: {total_companies}")
    print(f"Jobs: {total_jobs}")

if __name__ == '__main__':
    print("📤 Importing jobs to Supabase...")
    print(f"URL: {SUPABASE_URL}")
    
    if SUPABASE_URL == 'https://your-project.supabase.co':
        print("\n⚠️  Please set SUPABASE_URL and SUPABASE_KEY environment variables")
        print("Example:")
        print("  export SUPABASE_URL='https://xxx.supabase.co'")
        print("  export SUPABASE_KEY='eyJxxx...'")
        exit(1)
    
    import_jobs()

