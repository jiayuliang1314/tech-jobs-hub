# 🚀 Greenhouse Jobs Scraper - 零成本方案

**目标：** 抓取3000家公司的Greenhouse职位，完全免费存储和运行

---

## 💰 成本分析（100%免费）

| 项目 | 方案 | 费用 | 额度 |
|------|------|------|------|
| **运行环境** | GitHub Actions | $0 | 2000分钟/月 (免费) |
| **存储方案** | GitHub仓库 | $0 | 无限空间 |
| **数据库** | Supabase免费版 | $0 | 500MB (可选) |
| **域名** | 不需要 | $0 | - |
| **CDN** | GitHub Pages | $0 | 100GB流量/月 |
| **总计** | | **$0/月** | ✅ |

---

## 📁 存储方案对比

### **方案1：GitHub仓库（推荐）**

```
优点：
✅ 完全免费，无限空间
✅ 自动版本控制（可查看历史数据）
✅ 自动备份
✅ 可通过GitHub Pages直接访问JSON
✅ 可用Git LFS存储大文件

缺点：
⚠️ 单文件最大100MB（用LFS可到2GB）
⚠️ 每次push有文件大小限制

适用场景：
- 3000家公司，每家平均100个职位
- 简化数据后约 3000 × 100 × 2KB = 600MB
- 完全可行！
```

**存储结构：**
```
data/
├── airbnb.json          (单个公司)
├── stripe.json
├── notion.json
├── ...                  (3000个文件)
├── _stats.json          (统计信息)
└── all_jobs.json        (合并文件，可选)
```

---

### **方案2：Supabase免费版（备用）**

```
免费额度：
- 数据库：500MB
- 存储：1GB
- 带宽：2GB/月
- API请求：50,000/月

优点：
✅ 提供PostgreSQL数据库
✅ 自动RESTful API
✅ 实时订阅
✅ 更适合网站查询

缺点：
⚠️ 500MB数据库可能不够存3000家公司
⚠️ 需要设计表结构

适用场景：
- 存储精简字段（id, title, location, url）
- 估算：3000 × 100 × 0.5KB = 150MB ✅ 可行
```

---

### **方案3：Cloudflare R2（最佳扩展性）**

```
免费额度：
- 存储：10GB
- Class A操作：100万次/月
- Class B操作：1000万次/月
- 出站流量：免费！

优点：
✅ 比S3便宜（出站流量免费）
✅ 10GB足够存储
✅ 全球CDN加速
✅ 可设置公开URL

月成本：
- 0-10GB：$0
- 超过后：$0.015/GB

3000家公司约600MB < 10GB
成本：$0/月 ✅
```

---

## 🚀 快速开始

### **Step 1: 准备公司列表**

创建 `companies.txt`，每行一个board token：

```txt
airbnb
stripe
notion
shopee
coupang
# ... 你的3000家公司
```

### **Step 2: 本地测试**

```bash
# 安装依赖（无需额外库，用Python标准库）
python3 fetch_greenhouse_jobs.py --companies companies.txt

# 测试前10家
head -10 companies.txt > test.txt
python3 fetch_greenhouse_jobs.py --companies test.txt --output test_data
```

### **Step 3: 部署到GitHub Actions（完全免费）**

```bash
# 1. 创建GitHub仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/greenhouse-jobs.git
git push -u origin main

# 2. GitHub Actions会自动运行
# 每天凌晨3点自动抓取更新

# 3. 手动触发（可选）
# 在GitHub仓库页面：Actions -> Scrape Greenhouse Jobs -> Run workflow
```

---

## ⏱️ 时间预估

```
3000家公司 × 2秒/公司 = 6000秒 = 100分钟

GitHub Actions免费额度：2000分钟/月
每天运行一次：100分钟 × 30天 = 3000分钟

解决方案：
1. 分批运行（每天抓500家，6天抓完一轮）
2. 增量更新（只抓有变化的公司）
3. 使用多个GitHub账号（每个2000分钟）
```

### **优化：分批脚本**

```yaml
# .github/workflows/scrape-batch.yml
name: Scrape Jobs (Batch)

on:
  schedule:
    # 每天分6次运行，每次500家
    - cron: '0 0 * * *'   # Batch 1: 0-499
    - cron: '0 4 * * *'   # Batch 2: 500-999
    - cron: '0 8 * * *'   # Batch 3: 1000-1499
    - cron: '0 12 * * *'  # Batch 4: 1500-1999
    - cron: '0 16 * * *'  # Batch 5: 2000-2499
    - cron: '0 20 * * *'  # Batch 6: 2500-2999

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Calculate batch
        id: batch
        run: |
          # 根据cron时间计算批次
          hour=$(date +%H)
          batch=$((hour / 4))
          start=$((batch * 500))
          echo "start=$start" >> $GITHUB_OUTPUT
      
      - name: Run scraper
        run: |
          # 每次只抓500家（约17分钟）
          python fetch_greenhouse_jobs.py \
            --companies <(sed -n '${{ steps.batch.outputs.start }},+500p' companies.txt) \
            --delay 2
```

---

## 📊 数据访问方式

### **方式1：直接从GitHub读取（免费CDN）**

```javascript
// 前端直接访问
const response = await fetch(
  'https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs/main/data/airbnb.json'
)
const jobs = await response.json()
```

### **方式2：GitHub Pages（更快）**

```bash
# 1. 在GitHub仓库设置中启用Pages
# Settings -> Pages -> Source: main branch -> /data folder

# 2. 访问
https://YOUR_USERNAME.github.io/greenhouse-jobs/airbnb.json
```

### **方式3：Supabase API（推荐用于网站）**

```javascript
// 先导入数据到Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// 查询职位
const { data } = await supabase
  .from('jobs')
  .select('*')
  .eq('company', 'airbnb')
```

---

## 💡 推荐方案（月入$2000目标）

### **完全免费的架构**

```
┌─────────────────────────────────────────┐
│  GitHub Actions (免费)                   │
│  - 每天自动抓取                           │
│  - 保存到GitHub仓库                       │
└─────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  GitHub仓库 (免费)                       │
│  - data/airbnb.json                      │
│  - data/stripe.json                      │
│  - ... (3000个文件)                      │
└─────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  Vercel/Netlify (免费托管)               │
│  - Next.js网站                           │
│  - 从GitHub读取JSON                      │
│  - 100GB流量/月                           │
└─────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│  联盟营销 (收入)                          │
│  - Indeed: $1,200/月                     │
│  - ZipRecruiter: $500/月                 │
│  - Glassdoor: $300/月                    │
│  = $2,000/月 ✅                          │
└─────────────────────────────────────────┘

总成本：$0/月
利润率：100%
```

---

## 📈 扩展到月入$5000

当流量增长后，可以升级：

```
GitHub仓库 (免费)
    ↓
升级到 Supabase Pro ($25/月)
    ↓ 
获得更快的查询速度和更多功能
    ↓
收入增长到 $5,000/月
    ↓
利润：$5,000 - $25 = $4,975/月
利润率：99.5%
```

---

## 🎯 立即行动清单

```bash
# 1. 克隆这个demo
cd greenhouse-demo

# 2. 添加你的3000家公司到companies.txt
vim companies.txt

# 3. 本地测试（抓取前10家）
head -10 companies.txt > test.txt
python3 fetch_greenhouse_jobs.py --companies test.txt

# 4. 创建GitHub仓库
git init
git add .
git commit -m "Initial setup"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 5. 等待GitHub Actions自动运行（或手动触发）

# 6. 搭建网站（下一步）
```

---

## ❓ FAQ

**Q: 3000家公司会不会太慢？**
A: 每家2秒 = 100分钟，可以分6批运行，每批17分钟。

**Q: GitHub仓库会不会太大？**
A: 600MB完全可以，而且可以用Git LFS存大文件。

**Q: 数据更新频率？**
A: 每天一次即可，职位变化不会太频繁。

**Q: 会被Greenhouse封IP吗？**
A: GitHub Actions每次运行用不同IP，而且我们加了延迟（2秒/请求），很安全。

**Q: 如果某些公司抓取失败？**
A: 脚本有自动重试和错误记录，可以手动补抓。

---

## 📞 下一步

我可以帮你：
1. ✅ 创建完整的Next.js网站模板
2. ✅ Supabase数据库schema和导入脚本
3. ✅ 联盟链接集成代码
4. ✅ SEO优化策略

告诉我你想从哪里继续！🚀

