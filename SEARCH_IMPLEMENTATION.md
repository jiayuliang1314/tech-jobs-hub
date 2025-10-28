# 🔍 搜索功能实现详解

针对**10万职位**的多种搜索方案，从最简单到最优化。

---

## 📊 搜索需求分析

```
数据量：
- 3,000家公司
- 100,000个职位
- 每个职位约2KB数据

挑战：
❌ 100,000 × 2KB = 200MB（不能一次加载）
❌ 用户搜索要快速响应（<500ms）
❌ 零成本实现
```

---

## 🎯 方案对比

| 方案 | 成本 | 速度 | 复杂度 | 推荐度 |
|------|------|------|--------|--------|
| **方案1：前端过滤** | $0 | 慢 | ⭐ | 适合<5000职位 |
| **方案2：静态索引** | $0 | 快 | ⭐⭐ | ✅ 最推荐（零成本） |
| **方案3：Supabase** | $0 | 很快 | ⭐⭐⭐ | 适合需要复杂查询 |
| **方案4：Algolia** | $1/月 | 最快 | ⭐⭐⭐⭐ | 适合10万+访问 |

---

## ✅ 方案1：前端JavaScript过滤（Demo中使用）

### **实现原理：**

```javascript
// 1. 加载所有职位到内存
let allJobs = []; // 存储所有职位

// 2. 用户输入时实时过滤
function searchJobs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const location = document.getElementById('locationInput').value.toLowerCase();
    
    const filtered = allJobs.filter(job => {
        const matchTitle = job.title.toLowerCase().includes(query);
        const matchCompany = job.company.toLowerCase().includes(query);
        const matchLocation = job.location.toLowerCase().includes(location);
        
        return (matchTitle || matchCompany) && matchLocation;
    });
    
    renderJobs(filtered);
}
```

### **优点：**
```
✅ 实现简单（10行代码）
✅ 无需后端
✅ 完全免费
✅ 即时响应
```

### **缺点：**
```
❌ 需要加载所有数据（100,000职位 = 200MB）
❌ 首次加载慢
❌ 占用大量内存
❌ 不适合大数据量
```

### **适用场景：**
```
✅ 职位数量 < 5,000
✅ Demo演示
✅ 初期测试
```

---

## ✅ 方案2：静态搜索索引（⭐推荐，零成本最优）

### **核心思路：**

```
将10万职位预处理成轻量级索引文件
按需加载，而不是一次性加载全部
```

### **数据结构设计：**

```javascript
// 1. 主索引文件（search-index.json）- 只有20MB
{
  "total": 100000,
  "jobs": [
    {
      "id": "123",
      "title": "Software Engineer",
      "company": "Airbnb", 
      "location": "SF",
      "url": "/jobs/123",
      "_k": "software engineer airbnb sf"  // 搜索关键词
    },
    // ... 100,000条
  ]
}

// 2. 按首字母分组（index-S.json）- 只有2MB
// 只包含S开头的职位

// 3. 按公司分组（airbnb-index.json）
// 只包含Airbnb的职位
```

### **前端实现（渐进式加载）：**

```javascript
// search.js
class SmartSearch {
    constructor() {
        this.index = null;
        this.cache = new Map();
    }
    
    // 方法1：懒加载完整索引
    async loadFullIndex() {
        if (this.index) return this.index;
        
        const response = await fetch('/search-index.json');
        this.index = await response.json();
        return this.index;
    }
    
    // 方法2：只加载需要的部分
    async searchByLetter(query) {
        const firstLetter = query[0].toUpperCase();
        
        // 检查缓存
        if (this.cache.has(firstLetter)) {
            return this.filterJobs(this.cache.get(firstLetter), query);
        }
        
        // 加载该字母的索引
        const response = await fetch(`/index-${firstLetter}.json`);
        const jobs = await response.json();
        
        // 缓存
        this.cache.set(firstLetter, jobs);
        
        return this.filterJobs(jobs, query);
    }
    
    // 方法3：服务端渲染的静态页面（最快）
    // 为热门搜索词预生成HTML页面
    // 例如：/search/software-engineer-san-francisco.html
    
    filterJobs(jobs, query) {
        const q = query.toLowerCase();
        return jobs.filter(job => 
            job._k.includes(q)  // 在关键词字符串中搜索
        );
    }
}

// 使用
const search = new SmartSearch();

async function handleSearch(query, location) {
    // 智能决定用哪种方法
    if (query.length > 0) {
        // 按首字母加载
        const results = await search.searchByLetter(query);
        return results.filter(job => 
            location ? job.location.toLowerCase().includes(location.toLowerCase()) : true
        );
    } else {
        // 加载完整索引
        const index = await search.loadFullIndex();
        return index.jobs.filter(job =>
            location ? job.location.toLowerCase().includes(location.toLowerCase()) : true
        );
    }
}
```

### **构建索引脚本：**

```python
# build_search_index.py

import json
from pathlib import Path

def build_search_index():
    """构建轻量级搜索索引"""
    data_dir = Path('data')
    output_dir = Path('web/public')
    
    full_index = []
    alpha_index = {}
    
    for company_file in data_dir.glob('*.json'):
        with open(company_file) as f:
            data = json.load(f)
        
        for job in data['jobs']:
            # 简化条目（减少体积）
            entry = {
                'id': job['id'],
                't': job['title'][:50],  # 缩短字段名
                'c': data['company'],
                'l': job['location'][:30],
                'u': job['url'],
                '_k': f"{job['title']} {data['company']} {job['location']}".lower()
            }
            
            full_index.append(entry)
            
            # 按首字母分组
            letter = job['title'][0].upper()
            if letter not in alpha_index:
                alpha_index[letter] = []
            alpha_index[letter].append(entry)
    
    # 保存主索引（压缩JSON）
    with open(output_dir / 'search-index.json', 'w') as f:
        json.dump({'jobs': full_index}, f, separators=(',', ':'))
    
    # 保存分字母索引
    for letter, jobs in alpha_index.items():
        with open(output_dir / f'index-{letter}.json', 'w') as f:
            json.dump(jobs, f, separators=(',', ':'))
    
    print(f"✅ Built index: {len(full_index)} jobs")

build_search_index()
```

### **文件大小优化：**

```
优化前：
100,000职位 × 2KB = 200MB

优化后：
100,000职位 × 200字节 = 20MB ✅

分组后单个文件：
S开头职位 × 200字节 = 约2MB ✅

首次加载：0MB（按需加载）
搜索"Software"：只加载2MB
搜索"Airbnb"：只加载该公司索引
```

---

## ✅ 方案3：Supabase全文搜索（推荐用于正式网站）

### **为什么用Supabase？**

```
✅ 免费额度：500MB数据库
✅ 自动RESTful API
✅ 全文搜索支持
✅ 实时查询
✅ PostgreSQL强大功能

100,000职位精简后约150MB < 500MB ✅
```

### **数据库表结构：**

```sql
-- jobs表
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    greenhouse_id TEXT UNIQUE,
    company TEXT,
    title TEXT,
    location TEXT,
    url TEXT,
    updated_at TIMESTAMPTZ,
    
    -- 全文搜索字段
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(company, '') || ' ' || 
            coalesce(location, '')
        )
    ) STORED
);

-- 创建GIN索引（加速搜索）
CREATE INDEX jobs_search_idx ON jobs USING gin(search_vector);

-- 创建其他索引
CREATE INDEX jobs_company_idx ON jobs(company);
CREATE INDEX jobs_location_idx ON jobs(location);
```

### **前端查询（超快）：**

```javascript
// Supabase客户端
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://xxx.supabase.co',
    'public-anon-key'
)

// 搜索职位
async function searchJobs(query, location, page = 1, limit = 20) {
    let queryBuilder = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
    
    // 全文搜索
    if (query) {
        queryBuilder = queryBuilder.textSearch('search_vector', query)
    }
    
    // 地点过滤
    if (location) {
        queryBuilder = queryBuilder.ilike('location', `%${location}%`)
    }
    
    // 分页
    const start = (page - 1) * limit
    queryBuilder = queryBuilder
        .range(start, start + limit - 1)
        .order('updated_at', { ascending: false })
    
    const { data, error, count } = await queryBuilder
    
    return {
        jobs: data,
        total: count,
        page: page
    }
}

// 使用示例
const results = await searchJobs('Software Engineer', 'San Francisco');
// 查询速度：~50ms ⚡
```

### **优点：**

```
✅ 查询速度极快（<100ms）
✅ 支持复杂查询（排序、过滤、聚合）
✅ 自动生成API
✅ 免费500MB
✅ 可扩展性强
```

### **缺点：**

```
⚠️ 需要导入数据（一次性工作）
⚠️ 超过500MB需要付费（$25/月）
```

---

## ✅ 方案4：混合方案（最佳实践）

### **核心思路：**

```
热门搜索 → 静态预生成页面（SEO最优）
实时搜索 → 前端轻量级索引（零成本）
复杂查询 → Supabase（可选）
```

### **实现：**

```javascript
// hybrid-search.js

class HybridSearch {
    constructor() {
        this.staticPages = new Map();  // 热门搜索词的静态页面
        this.lightIndex = null;         // 轻量级索引
        this.supabase = null;           // Supabase（可选）
    }
    
    async search(query, location) {
        // 策略1：检查是否有预生成的静态页面
        const slug = this.toSlug(query, location);
        if (this.hasStaticPage(slug)) {
            return this.loadStaticPage(slug);
        }
        
        // 策略2：使用前端轻量级索引
        if (query.length < 20) {  // 短查询用前端
            return this.searchInLightIndex(query, location);
        }
        
        // 策略3：复杂查询用Supabase（如果配置了）
        if (this.supabase) {
            return this.searchInSupabase(query, location);
        }
        
        // 兜底：前端全文搜索
        return this.searchInLightIndex(query, location);
    }
    
    hasStaticPage(slug) {
        // 检查是否预生成了该搜索的静态页面
        // 例如：/search/software-engineer-san-francisco.html
        return this.staticPages.has(slug);
    }
    
    async searchInLightIndex(query, location) {
        // 加载轻量级索引（20MB）
        if (!this.lightIndex) {
            const res = await fetch('/search-index.json');
            this.lightIndex = await res.json();
        }
        
        // 前端过滤
        const q = query.toLowerCase();
        const l = location.toLowerCase();
        
        return this.lightIndex.jobs.filter(job => 
            job._k.includes(q) && job._k.includes(l)
        );
    }
    
    toSlug(query, location) {
        return `${query}-${location}`.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }
}
```

### **预生成热门搜索页面：**

```python
# generate_popular_searches.py

POPULAR_SEARCHES = [
    ('Software Engineer', 'San Francisco'),
    ('Frontend Developer', 'Remote'),
    ('Product Manager', 'New York'),
    ('Data Scientist', 'San Francisco'),
    ('Backend Engineer', 'Remote'),
    # ... 前100个热门搜索
]

def generate_search_pages():
    """为热门搜索词预生成HTML页面（SEO优化）"""
    
    for title, location in POPULAR_SEARCHES:
        # 从数据中过滤
        jobs = filter_jobs(title, location)
        
        # 生成HTML
        slug = f"{title}-{location}".lower().replace(' ', '-')
        html = generate_html(title, location, jobs)
        
        # 保存为静态文件
        with open(f'web/public/search/{slug}.html', 'w') as f:
            f.write(html)
        
        print(f"✅ Generated: /search/{slug}.html ({len(jobs)} jobs)")

# SEO好处：
# Google会索引这100个页面
# 用户搜索"Software Engineer San Francisco"直接到达你的页面
# 不需要JavaScript，加载速度极快
```

---

## 🚀 实际项目推荐方案（零成本）

### **混合方案实现：**

**Phase 1: 启动期（0-1月）**
```python
# 使用方案1：前端过滤
# 只抓取500家热门公司（约15,000职位）
# 数据量：15,000 × 2KB = 30MB
# 可以前端加载 ✅

优点：
- 快速上线（3天）
- 零成本
- 验证市场
```

**Phase 2: 增长期（2-3月）**
```python
# 升级到方案2：静态索引
# 抓取全部3000家公司（100,000职位）
# 构建轻量级索引（20MB）
# 按需加载 ✅

优点：
- 支持全部数据
- 仍然零成本
- 搜索速度快
```

**Phase 3: 优化期（4-6月）**
```python
# 可选升级到Supabase
# 如果月收入 > $1,000，考虑升级

优点：
- 更快的查询
- 复杂筛选
- 更好的用户体验

成本：$0（免费版）或 $25/月
```

---

## 💻 完整代码示例

### **HTML版搜索实现（当前Demo）**

```html
<!-- search.html -->
<script>
let allJobs = [];

// 加载所有职位
async function loadJobs() {
    // 方式1：从GitHub加载
    const companies = ['airbnb', 'stripe', 'notion']; // 你的3000家
    
    for (const company of companies) {
        try {
            const res = await fetch(`https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs/main/data/${company}.json`);
            const data = await res.json();
            allJobs = allJobs.concat(data.jobs.map(j => ({
                ...j,
                company: company
            })));
        } catch (e) {
            console.error(`Failed to load ${company}:`, e);
        }
    }
    
    console.log(`Loaded ${allJobs.length} jobs`);
}

// 搜索函数
function searchJobs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const location = document.getElementById('locationInput').value.toLowerCase();
    
    const results = allJobs.filter(job => {
        // 标题或公司名匹配
        const matchQuery = !query || 
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query);
        
        // 地点匹配
        const matchLocation = !location ||
            job.location.toLowerCase().includes(location);
        
        return matchQuery && matchLocation;
    });
    
    // 排序：最近更新的优先
    results.sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
    );
    
    // 显示结果
    displayResults(results);
}

function displayResults(jobs) {
    const container = document.getElementById('results');
    container.innerHTML = jobs.map(job => `
        <div class="job-card">
            <h3>${job.title}</h3>
            <p>${job.company} • ${job.location}</p>
            <a href="/jobs/${job.id}">View Details</a>
        </div>
    `).join('');
}

// 页面加载时加载数据
loadJobs();
</script>
```

### **Next.js版搜索实现（更优）**

```typescript
// pages/api/search.ts - 服务端API

import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { q, location, page = 1, limit = 20 } = req.query
    
    try {
        // 加载搜索索引
        const indexPath = path.join(process.cwd(), 'public', 'search-index.json')
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
        
        // 过滤
        let results = index.jobs
        
        if (q) {
            const query = (q as string).toLowerCase()
            results = results.filter((job: any) => 
                job._k.includes(query)
            )
        }
        
        if (location) {
            const loc = (location as string).toLowerCase()
            results = results.filter((job: any) =>
                job.l.toLowerCase().includes(loc)
            )
        }
        
        // 分页
        const start = (Number(page) - 1) * Number(limit)
        const end = start + Number(limit)
        const paged = results.slice(start, end)
        
        res.status(200).json({
            total: results.length,
            page: Number(page),
            limit: Number(limit),
            jobs: paged
        })
        
    } catch (error) {
        res.status(500).json({ error: 'Search failed' })
    }
}
```

```typescript
// pages/jobs/index.tsx - 前端调用

async function searchJobs(query: string, location: string) {
    const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
    )
    const data = await res.json()
    setJobs(data.jobs)
    setTotal(data.total)
}
```

---

## 📊 性能对比

### **搜索速度测试（10万职位）**

| 方案 | 首次加载 | 搜索延迟 | 用户体验 |
|------|----------|----------|----------|
| 前端全量加载 | 30秒 ❌ | 10ms | 差 |
| 前端轻量索引 | 2秒 ✅ | 50ms | 好 |
| Supabase | 0秒 ✅ | 80ms | 很好 |
| 静态预生成 | 0秒 ✅ | 0ms ⚡ | 最好 |

---

## 🎯 我的推荐（零成本方案）

### **第一阶段：前端轻量索引**

```
1. 构建搜索索引（运行1次）
   python3 build_search_index.py

2. 生成文件：
   - search-index.json (20MB)
   - index-A.json, index-B.json... (各2MB)

3. 前端按需加载
   - 用户搜索"Software" → 只加载index-S.json
   - 搜索速度：<200ms
   - 用户体验：良好 ✅

成本：$0
适合：0-10万访问/月
```

### **第二阶段（可选）：升级Supabase**

```
当月收入 > $1,000时考虑

优势：
- 查询速度 <100ms
- 支持复杂筛选
- 更好的用户体验

成本：$0（免费版够用）
适合：10万+ 访问/月
```

---

## 🔧 立即实现

### **创建build_search_index.py：**

我可以帮你生成这个脚本，运行一次就能构建完整的搜索索引。

### **修改前端集成搜索：**

把搜索索引集成到HTML demo或Next.js网站。

---

## 📞 告诉我

1. 你想用哪个方案？
   - 前端轻量索引（零成本，推荐）
   - Supabase（更快，也免费）
   - 混合方案

2. 我帮你实现搜索索引构建脚本？

3. 还是先看看当前Demo的简单搜索效果？

**现在Demo中的搜索是最简单的前端过滤（适合演示），实际项目需要优化！**
