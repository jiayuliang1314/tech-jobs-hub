# 🚀 快速启动指南

## 零成本方案总览

```
成本：$0/月
存储：GitHub仓库（无限）
运行：GitHub Actions（2000分钟/月免费）
网站：Vercel（100GB流量/月免费）
数据库：Supabase（500MB免费，可选）
```

---

## 📋 准备工作（5分钟）

### 1. 准备你的3000家公司列表

编辑 `companies.txt`，每行一个board token：

```bash
# 方法1：从浏览器URL提取
# https://boards.greenhouse.io/shopee -> shopee
# https://boards.greenhouse.io/airbnb -> airbnb

# 方法2：如果你有完整URL列表
cat your_urls.txt | sed 's|https://boards.greenhouse.io/||g' > companies.txt
```

---

## 🏃 本地测试（10分钟）

```bash
# 1. 测试脚本（抓取5家公司）
head -5 companies.txt > test.txt
python3 fetch_greenhouse_jobs.py --companies test.txt --output test_data

# 2. 查看结果
ls -lh test_data/
cat test_data/_stats.json

# 3. 如果成功，继续下一步
```

---

## ☁️ 部署到GitHub（免费自动化）

### Step 1: 创建GitHub仓库

```bash
# 1. 在GitHub创建新仓库（私有或公开都可以）
# https://github.com/new
# 仓库名：greenhouse-jobs-data

# 2. 推送代码
git init
git add .
git commit -m "Initial commit: Greenhouse scraper"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/greenhouse-jobs-data.git
git push -u origin main
```

### Step 2: 等待自动运行

```
✅ GitHub Actions会在这些时间自动运行：
- 每天凌晨3点UTC
- 或手动触发：Actions -> Scrape Greenhouse Jobs -> Run workflow
```

### Step 3: 查看结果

```
运行完成后，数据会自动提交到仓库的data/目录：
- data/airbnb.json
- data/stripe.json
- data/...
- data/_stats.json
```

---

## 🌐 访问数据（3种方式）

### 方式1：直接从GitHub读取

```javascript
// 任何人都可以访问
const response = await fetch(
  'https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs-data/main/data/airbnb.json'
)
const data = await response.json()
console.log(data.jobs)
```

### 方式2：GitHub Pages（更快）

```bash
# 1. 启用GitHub Pages
# 仓库 Settings -> Pages -> Source: main branch -> /data folder

# 2. 访问（会有CDN加速）
https://YOUR_USERNAME.github.io/greenhouse-jobs-data/airbnb.json
```

### 方式3：导入到Supabase（可选，适合做网站）

```bash
# 1. 创建Supabase项目（免费）
# https://supabase.com/dashboard

# 2. 运行SQL建表
# 复制 supabase_schema.sql 内容到SQL Editor运行

# 3. 导入数据
export SUPABASE_URL='https://xxx.supabase.co'
export SUPABASE_KEY='eyJxxx...'
pip install supabase
python3 import_to_supabase.py
```

---

## 💰 开始盈利（搭建网站）

### 最简单的方案：Vercel + Next.js

```bash
# 1. 创建Next.js项目
npx create-next-app@latest my-job-site --typescript --tailwind

cd my-job-site

# 2. 安装依赖
npm install

# 3. 创建职位页面
# pages/jobs/index.tsx
```

```typescript
// pages/jobs/index.tsx
import { useState, useEffect } from 'react'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  
  useEffect(() => {
    // 从GitHub读取数据
    fetch('https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs-data/main/data/airbnb.json')
      .then(r => r.json())
      .then(data => setJobs(data.jobs))
  }, [])
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Tech Jobs</h1>
      
      {jobs.map(job => (
        <div key={job.id} className="bg-white shadow rounded p-6 mb-4">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600">{job.location}</p>
          
          {/* 联盟链接 */}
          <div className="mt-4 flex gap-3">
            <a href={job.url} className="bg-green-600 text-white px-6 py-2 rounded">
              Apply Directly
            </a>
            <a 
              href={`https://www.indeed.com/jobs?q=${job.title}&from=YOUR_INDEED_ID`}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Apply via Indeed (💰 你赚$0.75/点击)
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
```

```bash
# 4. 部署到Vercel（完全免费）
npm install -g vercel
vercel

# 5. 完成！你的网站已上线
# https://your-site.vercel.app
```

---

## 📊 收入预估

```
每月8,000访问 × 20% Indeed点击率 × $0.75 = $1,200
每月8,000访问 × 0.6% ZR注册率 × $10 = $480
每月8,000访问 × 2% Glassdoor点击 × $1.50 = $240

总计：$1,920/月
成本：$0
利润：$1,920 🎉
```

---

## 🔧 常见问题

**Q: 3000家公司要多久抓完？**
A: 100分钟（2秒/家），可以分6批运行，每批17分钟。

**Q: 会超出GitHub Actions免费额度吗？**
A: 不会。分批运行，每批17分钟 × 6 = 102分钟/天 < 2000分钟/月。

**Q: 数据多久更新一次？**
A: 每天一次，凌晨3点UTC自动更新。

**Q: 如果某些公司404怎么办？**
A: 脚本会自动跳过并记录在_stats.json中。

---

## 📞 下一步

1. ✅ 完成上述部署
2. ✅ 申请Indeed/ZipRecruiter联盟账号
3. ✅ 搭建Next.js网站
4. ✅ 开始赚钱！

有问题随时问！🚀
