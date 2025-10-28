# 🚀 Tech Jobs Hub - Next.js Website

完整的职位聚合网站，基于Greenhouse数据 + 联盟营销盈利。

---

## 📊 项目概览

```
数据来源：3000家Greenhouse公司职位
网站框架：Next.js + TypeScript + Tailwind CSS
盈利模式：Indeed/ZipRecruiter/Glassdoor联盟
托管方案：Vercel（免费100GB流量）
成本：$0/月
收入潜力：$2,000-10,000/月
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd web
npm install
```

### 2. 配置环境变量

```bash
# 复制模板
cp env.template .env.local

# 编辑 .env.local，填入你的联盟ID
```

### 3. 本地运行

```bash
npm run dev
```

访问 http://localhost:3000

---

## 🔑 联盟账号申请

### Step 1: Indeed Publisher Program

```
申请地址：https://www.indeedpublishers.com/

审核时间：1-3天
要求：有真实网站
佣金：$0.50-1.50 per click

获取ID后填入：
INDEED_PUBLISHER_ID=your_id
```

### Step 2: ZipRecruiter Affiliate

```
申请地址：https://www.ziprecruiter.com/affiliates

审核时间：3-5天
要求：有流量的网站
佣金：$5-15 per registration

获取ID后填入：
ZIPRECRUITER_AID=your_aid
```

### Step 3: CJ Affiliate (Glassdoor)

```
申请地址：https://www.cj.com/

步骤：
1. 注册CJ账号
2. 搜索"Glassdoor"
3. 申请加入计划
4. 审核通过后获得ID

获取ID后填入：
CJ_AFFILIATE_ID=your_cj_id
```

---

## 📦 部署到Vercel（免费）

### 方法1：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/greenhouse-jobs)

### 方法2：命令行部署

```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 设置环境变量（在Vercel Dashboard）
# Settings -> Environment Variables
# 添加：
# - INDEED_PUBLISHER_ID
# - ZIPRECRUITER_AID
# - CJ_AFFILIATE_ID
# - GITHUB_DATA_URL

# 5. 重新部署
vercel --prod
```

---

## 📁 项目结构

```
web/
├── pages/
│   ├── index.tsx              # 首页（搜索框）
│   ├── jobs/
│   │   ├── index.tsx          # 职位列表
│   │   └── [id].tsx           # 职位详情（核心盈利页面）
│   ├── companies/
│   │   └── [name].tsx         # 公司页面
│   └── api/
│       └── track.ts           # 点击追踪API
├── components/                 # 组件（待添加）
├── utils/
│   └── affiliates.ts          # 联盟链接生成器
├── styles/
│   └── globals.css            # 全局样式
└── public/                    # 静态资源
```

---

## 💰 盈利页面详解

### 职位详情页 (`pages/jobs/[id].tsx`)

这是**核心盈利页面**，每个职位页面有3个联盟链接：

```
1. Indeed联盟按钮
   → 点击赚 $0.75
   → 预期点击率：35%

2. ZipRecruiter联盟按钮
   → 注册赚 $10
   → 预期注册率：2%（点击后）

3. Glassdoor联盟按钮
   → 点击赚 $1.50
   → 预期点击率：15%
```

**收入计算（100访问/页面）：**
```
Indeed:    35点击 × $0.75 = $26.25
ZipRec:    5注册 × $10 = $50.00
Glassdoor: 15点击 × $1.50 = $22.50
━━━━━━━━━━━━━━━━━━━━━━━━━━
总计：$98.75 per 100访问
```

---

## 📊 数据集成

### 从GitHub加载职位数据

数据结构假设：
```
https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs/main/data/
├── airbnb.json
├── stripe.json
├── notion.json
└── ... (3000个公司)
```

每个JSON文件格式：
```json
{
  "company": "airbnb",
  "fetched_at": "2024-01-01T00:00:00Z",
  "job_count": 127,
  "jobs": [
    {
      "id": "7353690",
      "title": "Software Engineer - Backend",
      "location": "San Francisco, CA",
      "url": "https://careers.airbnb.com/positions/7353690",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 实现数据加载

在 `utils/dataLoader.ts` 中实现：

```typescript
export async function loadCompanyJobs(company: string) {
  const url = `${process.env.GITHUB_DATA_URL}/${company}.json`
  const response = await fetch(url)
  return response.json()
}

export async function loadAllJobs() {
  // 加载所有公司的职位
  // 可以并行加载多个文件
}
```

---

## 🎨 定制化

### 修改配色

编辑 `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        600: '#YOUR_COLOR',
        700: '#YOUR_COLOR',
      }
    }
  }
}
```

### 添加Google Analytics

```typescript
// pages/_app.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        })
      }
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
```

---

## 🔧 开发脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

---

## 📈 SEO优化

### 已实现的SEO功能

1. **每个页面的Meta标签**
   - 标题优化
   - 描述优化
   - Open Graph标签

2. **语义化URL**
   - `/jobs/airbnb-software-engineer-sf-12345`
   - `/companies/airbnb`

3. **结构化数据**
   - JobPosting Schema（待添加）

### 需要补充

在 `pages/jobs/[id].tsx` 添加：

```typescript
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location
      }
    }
  })}
</script>
```

---

## 📊 收入追踪

### 在联盟后台查看

```
Indeed Publisher Dashboard:
→ 查看点击数、CPC、收入

ZipRecruiter Affiliate Dashboard:
→ 查看注册数、转化率、收入

CJ Affiliate Dashboard:
→ 查看Glassdoor点击、佣金
```

### 自建追踪（可选）

使用 `/api/track` 端点记录：
- 哪个职位被点击最多
- 哪个联盟平台转化最好
- 优化策略

---

## 🚀 上线检查清单

```
□ 联盟账号申请完成
□ 环境变量配置正确
□ 数据源连接成功
□ 本地测试通过
□ 联盟链接正常跳转
□ 部署到Vercel
□ 域名配置（可选）
□ Google Analytics设置
□ 提交Google Search Console
□ 开始推广获取流量
```

---

## 💡 下一步优化

### 功能增强

- [ ] 添加职位收藏功能
- [ ] 邮件订阅提醒
- [ ] AI职位匹配
- [ ] 薪资数据展示
- [ ] 公司评分系统

### 性能优化

- [ ] 静态页面生成（SSG）
- [ ] 图片优化
- [ ] CDN缓存
- [ ] 数据分页加载

### 盈利优化

- [ ] A/B测试按钮文案
- [ ] 热力图分析
- [ ] 转化率优化
- [ ] 添加Pro订阅功能

---

## 📞 支持

有问题？查看：
- [完整企划书](../MONETIZATION_GUIDE.md)
- [零成本方案](../ZERO_COST.md)
- [快速启动指南](../QUICKSTART.md)

---

**开始赚钱吧！** 🚀💰

