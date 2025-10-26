#!/usr/bin/env python3
"""
构建搜索索引 - 零成本方案
将100,000个职位转换为轻量级搜索索引（20MB）
支持前端快速搜索，无需后端数据库
"""

import json
from pathlib import Path
from datetime import datetime
import re

class SearchIndexBuilder:
    def __init__(self, data_dir='test_data', output_dir='html-demo'):
        self.data_dir = Path(data_dir)
        self.output_dir = Path(output_dir)
        self.stats = {
            'total_jobs': 0,
            'total_companies': 0,
            'index_size': 0
        }
    
    def build_index(self):
        """构建搜索索引"""
        
        print("🔨 Building search index...")
        print(f"📁 Data dir: {self.data_dir}")
        print(f"📁 Output dir: {self.output_dir}\n")
        
        # 完整索引
        full_index = []
        
        # 按字母分组（优化加载）
        alpha_indexes = {}
        
        # 公司列表（用于自动完成）
        companies = set()
        
        # 地点列表（用于自动完成）
        locations = set()
        
        # 遍历所有公司文件
        for company_file in sorted(self.data_dir.glob('*.json')):
            if company_file.name.startswith('_'):
                continue
            
            try:
                with open(company_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                company = data.get('company', company_file.stem)
                jobs = data.get('jobs', [])
                
                companies.add(company)
                
                for job in jobs:
                    # 创建轻量级索引条目
                    entry = {
                        'id': str(job['id']),
                        'title': job['title'],
                        'company': company,
                        'location': job['location'],
                        'url': job['url'],
                        # 搜索关键词（小写，用于快速匹配）
                        '_k': self.generate_keywords(job['title'], company, job['location'])
                    }
                    
                    full_index.append(entry)
                    
                    # 按首字母分组
                    first_letter = job['title'][0].upper() if job['title'] else 'Z'
                    if not first_letter.isalpha():
                        first_letter = 'Z'
                    
                    if first_letter not in alpha_indexes:
                        alpha_indexes[first_letter] = []
                    alpha_indexes[first_letter].append(entry)
                    
                    # 收集地点
                    city = job['location'].split(',')[0].strip()
                    locations.add(city)
                    
                    self.stats['total_jobs'] += 1
                
                self.stats['total_companies'] += 1
                
                if self.stats['total_jobs'] % 500 == 0:
                    print(f"  ⏳ Processed {self.stats['total_jobs']} jobs...")
                    
            except Exception as e:
                print(f"  ❌ Error processing {company_file.name}: {e}")
        
        print(f"\n✅ Indexed {self.stats['total_jobs']} jobs from {self.stats['total_companies']} companies")
        
        # 保存索引
        self.save_indexes(full_index, alpha_indexes, companies, locations)
        
        return self.stats
    
    def generate_keywords(self, title, company, location):
        """生成搜索关键词"""
        # 合并所有文本
        text = f"{title} {company} {location}".lower()
        
        # 移除标点符号
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # 移除多余空格
        text = ' '.join(text.split())
        
        return text
    
    def save_indexes(self, full_index, alpha_indexes, companies, locations):
        """保存索引文件"""
        
        print("\n💾 Saving indexes...\n")
        
        # 1. 主搜索索引（压缩JSON）
        main_index_path = self.output_dir / 'search-index.json'
        with open(main_index_path, 'w', encoding='utf-8') as f:
            json.dump({
                'total': len(full_index),
                'generated_at': datetime.now().isoformat(),
                'jobs': full_index
            }, f, ensure_ascii=False, separators=(',', ':'))
        
        size_mb = main_index_path.stat().st_size / 1024 / 1024
        print(f"  ✅ Main index: {main_index_path.name} ({size_mb:.1f}MB)")
        self.stats['index_size'] = size_mb
        
        # 2. 按字母分组的索引（可选，优化首次加载）
        alpha_dir = self.output_dir / 'indexes'
        alpha_dir.mkdir(exist_ok=True)
        
        for letter, jobs in alpha_indexes.items():
            letter_path = alpha_dir / f'{letter}.json'
            with open(letter_path, 'w', encoding='utf-8') as f:
                json.dump(jobs, f, ensure_ascii=False, separators=(',', ':'))
        
        print(f"  ✅ Alpha indexes: {len(alpha_indexes)} files in indexes/")
        
        # 3. 公司列表（用于自动完成）
        companies_path = self.output_dir / 'companies-list.json'
        with open(companies_path, 'w', encoding='utf-8') as f:
            json.dump(sorted(list(companies)), f, ensure_ascii=False)
        
        print(f"  ✅ Companies list: {len(companies)} companies")
        
        # 4. 地点列表（用于自动完成）
        locations_path = self.output_dir / 'locations-list.json'
        with open(locations_path, 'w', encoding='utf-8') as f:
            json.dump(sorted(list(locations)), f, ensure_ascii=False)
        
        print(f"  ✅ Locations list: {len(locations)} locations")
        
        # 5. 元数据
        meta_path = self.output_dir / 'search-meta.json'
        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump({
                'total_jobs': self.stats['total_jobs'],
                'total_companies': self.stats['total_companies'],
                'total_locations': len(locations),
                'index_size_mb': round(size_mb, 2),
                'generated_at': datetime.now().isoformat(),
                'files': {
                    'main': 'search-index.json',
                    'alpha': 'indexes/{A-Z}.json',
                    'companies': 'companies-list.json',
                    'locations': 'locations-list.json'
                }
            }, f, indent=2)
        
        print(f"  ✅ Metadata: search-meta.json")
        print(f"\n🎉 Search index built successfully!")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Build search index')
    parser.add_argument('--data', default='test_data', help='Data directory')
    parser.add_argument('--output', default='html-demo', help='Output directory')
    
    args = parser.parse_args()
    
    builder = SearchIndexBuilder(data_dir=args.data, output_dir=args.output)
    stats = builder.build_index()
    
    print(f"\n📊 Final Stats:")
    print(f"  Jobs: {stats['total_jobs']:,}")
    print(f"  Companies: {stats['total_companies']}")
    print(f"  Index size: {stats['index_size']:.2f}MB")
    print(f"\n💡 Next: Integrate search-index.json into your website")

if __name__ == '__main__':
    main()

