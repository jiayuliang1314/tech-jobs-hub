#!/usr/bin/env python3
"""
Greenhouse Jobs Scraper - 零成本方案
支持3000家公司批量抓取，使用免费GitHub Actions运行
"""

import json
import time
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime
import sys

class GreenHouseScraper:
    def __init__(self, output_dir='data'):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.base_url = 'https://boards-api.greenhouse.io/v1/boards/{}/jobs'
        self.single_job_url = 'https://boards-api.greenhouse.io/v1/boards/{}/jobs/{}'
        self.stats = {
            'success': 0,
            'failed': 0,
            'total_jobs': 0,
            'errors': []
        }
    
    def fetch_company_jobs(self, board_token, retry=3):
        """抓取单个公司的职位"""
        url = self.base_url.format(board_token)
        
        for attempt in range(retry):
            try:
                # 设置User-Agent避免被拦截
                req = urllib.request.Request(
                    url,
                    headers={'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'}
                )
                
                with urllib.request.urlopen(req, timeout=30) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    jobs = data.get('jobs', [])
                    
                    if jobs:
                        self.stats['success'] += 1
                        self.stats['total_jobs'] += len(jobs)
                        print(f"✅ {board_token}: {len(jobs)} jobs")
                        return jobs
                    else:
                        print(f"⚠️  {board_token}: 0 jobs")
                        return []
                        
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    print(f"❌ {board_token}: Not found (404)")
                    self.stats['failed'] += 1
                    self.stats['errors'].append({'company': board_token, 'error': '404'})
                    return None
                elif attempt < retry - 1:
                    time.sleep(2 ** attempt)  # 指数退避
                    continue
                else:
                    print(f"❌ {board_token}: HTTP {e.code}")
                    self.stats['failed'] += 1
                    return None
                    
            except Exception as e:
                if attempt < retry - 1:
                    time.sleep(2)
                    continue
                else:
                    print(f"❌ {board_token}: {str(e)[:50]}")
                    self.stats['failed'] += 1
                    self.stats['errors'].append({'company': board_token, 'error': str(e)[:100]})
                    return None
        
        return None
    
    def fetch_job_details(self, board_token, job_id, retry=2):
        """获取单个职位的完整信息（包括描述）"""
        url = self.single_job_url.format(board_token, job_id)
        
        for attempt in range(retry):
            try:
                req = urllib.request.Request(
                    url,
                    headers={'User-Agent': 'Mozilla/5.0 (compatible; JobAggregator/1.0)'}
                )
                
                with urllib.request.urlopen(req, timeout=20) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    return data
                    
            except Exception as e:
                if attempt < retry - 1:
                    time.sleep(1)
                    continue
                else:
                    return None
        
        return None
    
    def save_jobs(self, board_token, jobs, fetch_details=False):
        """保存职位到JSON文件
        
        Args:
            board_token: 公司标识
            jobs: 职位列表
            fetch_details: 是否获取详情（默认False，懒加载）
        """
        if not jobs:
            return
        
        # 获取每个职位的完整信息
        full_jobs = []
        total = len(jobs)
        
        if not fetch_details:
            # 快速模式：只保存基本信息（懒加载）
            print(f"      💨 Fast mode: saving {total} jobs (details will be lazy-loaded)")
            full_jobs = jobs
        else:
            # 完整模式：获取所有详情
            for i, job in enumerate(jobs):
                job_id = job.get('id')
                
                # 先检查是否已有content
                if job.get('content'):
                    # 已经有完整数据
                    full_jobs.append(job)
                else:
                    # 需要获取完整数据
                    print(f"      Fetching details for job {i+1}/{total}... ", end='', flush=True)
                    full_job = self.fetch_job_details(board_token, job_id)
                    
                    if full_job:
                        full_jobs.append(full_job)
                        print("✓")
                    else:
                        # 失败则保存基本信息
                        full_jobs.append(job)
                        print("✗")
                    
                    # 避免请求过快
                    if i < total - 1:
                        time.sleep(0.5)
        
        # 按公司保存到单独文件
        company_file = self.output_dir / f"{board_token}.json"
        with open(company_file, 'w', encoding='utf-8') as f:
            json.dump({
                'company': board_token,
                'fetched_at': datetime.now().isoformat(),
                'job_count': len(full_jobs),
                'jobs': full_jobs
            }, f, ensure_ascii=False, indent=2)
    
    def scrape_batch(self, companies, start_idx=0, batch_size=100, delay=1.5, fetch_details=False):
        """批量抓取（支持断点续传）
        
        Args:
            companies: 公司列表
            start_idx: 开始索引
            batch_size: 批次大小（未使用）
            delay: 请求延迟
            fetch_details: 是否获取详情（默认False）
        """
        total = len(companies)
        
        for i in range(start_idx, total):
            company = companies[i].strip()
            if not company:
                continue
            
            print(f"\n[{i+1}/{total}] Processing: {company}")
            
            jobs = self.fetch_company_jobs(company)
            if jobs is not None:  # None表示404或错误
                self.save_jobs(company, jobs, fetch_details=fetch_details)
            
            # 避免被限流：每个请求间隔1.5秒
            if i < total - 1:
                time.sleep(delay)
            
            # 每100个公司输出进度
            if (i + 1) % batch_size == 0:
                self.print_stats()
                print(f"\n💾 Progress saved at index {i+1}")
        
        # 最终统计
        self.print_stats()
        self.save_stats()
    
    def print_stats(self):
        """打印统计信息"""
        print(f"\n{'='*50}")
        print(f"✅ Success: {self.stats['success']}")
        print(f"❌ Failed: {self.stats['failed']}")
        print(f"📊 Total Jobs: {self.stats['total_jobs']}")
        print(f"{'='*50}\n")
    
    def save_stats(self):
        """保存统计信息"""
        stats_file = self.output_dir / '_stats.json'
        with open(stats_file, 'w', encoding='utf-8') as f:
            json.dump({
                **self.stats,
                'timestamp': datetime.now().isoformat()
            }, f, indent=2)
        print(f"📊 Stats saved to {stats_file}")
    
    def merge_all_jobs(self, output_file='all_jobs.json'):
        """合并所有职位到一个大文件（可选）"""
        all_jobs = []
        company_count = 0
        
        for company_file in self.output_dir.glob('*.json'):
            if company_file.name.startswith('_'):
                continue
            
            with open(company_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for job in data.get('jobs', []):
                    job['company'] = data['company']
                    all_jobs.append(job)
                company_count += 1
        
        output_path = self.output_dir / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'total_companies': company_count,
                'total_jobs': len(all_jobs),
                'generated_at': datetime.now().isoformat(),
                'jobs': all_jobs
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ Merged {len(all_jobs)} jobs from {company_count} companies")
        print(f"📄 Saved to {output_path}")
        return output_path


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Greenhouse Jobs Scraper')
    parser.add_argument('--companies', '-c', type=str, 
                       help='Companies file (one per line) or comma-separated list')
    parser.add_argument('--output', '-o', default='data',
                       help='Output directory (default: data)')
    parser.add_argument('--start', type=int, default=0,
                       help='Start index (for resume)')
    parser.add_argument('--delay', type=float, default=1.5,
                       help='Delay between requests (seconds)')
    parser.add_argument('--fetch-details', action='store_true',
                       help='Fetch full job details (slow, use for complete data)')
    parser.add_argument('--merge', action='store_true',
                       help='Merge all jobs into single file')
    
    args = parser.parse_args()
    
    # 读取公司列表
    companies = []
    if args.companies:
        if Path(args.companies).exists():
            # 从文件读取
            with open(args.companies, 'r') as f:
                companies = [line.strip() for line in f if line.strip()]
        else:
            # 逗号分隔的列表
            companies = [c.strip() for c in args.companies.split(',')]
    else:
        # 默认示例公司
        companies = ['airbnb', 'stripe', 'notion', 'figma', 'databricks']
    
    print(f"🚀 Starting scraper for {len(companies)} companies")
    print(f"📁 Output directory: {args.output}")
    print(f"⏱️  Delay: {args.delay}s between requests\n")
    
    scraper = GreenHouseScraper(output_dir=args.output)
    scraper.scrape_batch(companies, start_idx=args.start, delay=args.delay, 
                        fetch_details=args.fetch_details)
    
    if args.merge:
        scraper.merge_all_jobs()


if __name__ == '__main__':
    main()

