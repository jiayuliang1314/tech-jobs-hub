# 🚀 完整部署指南

从0到上线，20分钟完成部署。

---

## 📋 前提条件

```
✅ GitHub账号
✅ Vercel账号（用GitHub登录）
✅ 已完成Greenhouse职位抓取
```

---

## 🔧 Step 1: 准备数据（已完成）

```bash
# 确保数据已抓取到GitHub
cd /Volumes/T7Shield/boss/wavely_code/greenhouse-demo

# 查看数据
ls -lh data/*.json

# 应该看到：
# airbnb.json
# stripe.json
# coupang.json
# ...
```

---

## 🌐 Step 2: 部署网站到Vercel

### 选项A：自动部署（推荐）

```bash
cd web

# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署
vercel

# 根据提示操作：
# ? Set up and deploy "~/greenhouse-demo/web"? [Y/n] Y
# ? Which scope? [选择你的账号]
# ? Link to existing project? [N]
# ? What's your project's name? techjobs-hub
# ? In which directory is your code located? ./

# 4. 部署到生产环境
vercel --prod
```

### 选项B：Vercel Dashboard部署

```
1. 访问 https://vercel.com/new
2. 导入你的GitHub仓库
3. Framework Preset: Next.js
4. Root Directory: web
5. 点击 "Deploy"
```

---

## 🔑 Step 3: 配置环境变量

### 在Vercel Dashboard

```
1. 进入你的项目
2. Settings -> Environment Variables
3. 添加以下变量：

Name: INDEED_PUBLISHER_ID
Value: [你的Indeed Publisher ID]

Name: ZIPRECRUITER_AID
Value: [你的ZipRecruiter Affiliate ID]

Name: CJ_AFFILIATE_ID
Value: [你的CJ Affiliate ID]

Name: GITHUB_DATA_URL
Value: https://raw.githubusercontent.com/YOUR_USERNAME/greenhouse-jobs/main/data

4. 点击 "Save"
5. Deployments -> 最新部署 -> Redeploy
```

---

## 📊 Step 4: 验证部署

### 检查清单

```bash
# 1. 访问你的网站
https://techjobs-hub.vercel.app

# 2. 测试页面
□ 首页加载正常
□ 搜索功能工作
□ 职位详情页显示
□ 联盟链接正确跳转

# 3. 检查联盟链接
# 打开职位详情页，点击"Apply via Indeed"
# URL应该包含你的publisher_id：
# https://www.indeed.com/jobs?...&from=YOUR_ID

# 4. 测试追踪API
# 在浏览器Console查看网络请求
# 应该看到 POST /api/track 请求成功
```

---

## 🌍 Step 5: 配置自定义域名（可选）

### 如果你有域名

```
1. Vercel Dashboard -> Settings -> Domains
2. 添加你的域名：techjobs.com
3. 按提示配置DNS：
   
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

4. 等待DNS生效（5-30分钟）
5. SSL证书自动配置
```

### 使用免费域名

```
保持使用：
techjobs-hub.vercel.app

优点：
✅ 免费
✅ 自动SSL
✅ 全球CDN
✅ 够用了！
```

---

## 📈 Step 6: SEO设置

### Google Search Console

```
1. 访问 https://search.google.com/search-console
2. 添加属性：techjobs-hub.vercel.app
3. 验证所有权（Vercel自动验证）
4. 提交sitemap：
   https://techjobs-hub.vercel.app/sitemap.xml
```

### 生成Sitemap

创建 `web/public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://techjobs-hub.vercel.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://techjobs-hub.vercel.app/jobs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- 添加更多页面 -->
</urlset>
```

---

## 💰 Step 7: 申请联盟账号

### Indeed Publisher Program

```
1. 访问 https://www.indeedpublishers.com/
2. Sign Up
3. 填写信息：
   - Website: https://techjobs-hub.vercel.app
   - Description: "Job aggregator for tech positions"
   - Monthly visitors: 估算（可以说1000+）
4. 提交申请
5. 等待审核（1-3天）
6. 获得Publisher ID后更新Vercel环境变量
```

### ZipRecruiter Affiliate

```
1. 访问 https://www.ziprecruiter.com/affiliates
2. Apply Now
3. 填写表单
4. 审核通过后获得Affiliate ID
5. 更新Vercel环境变量
```

### CJ Affiliate (Glassdoor)

```
1. 访问 https://www.cj.com/
2. Sign Up -> Publisher
3. 账号激活后，搜索"Glassdoor"
4. 申请加入Glassdoor计划
5. 获得CJ ID后更新环境变量
```

---

## 🔄 Step 8: 自动化更新

### GitHub Actions已配置

数据会自动更新：
```
每天凌晨3点UTC:
1. GitHub Actions运行抓取脚本
2. 新数据推送到仓库
3. Vercel自动检测更新
4. 自动重新部署（可选）
```

### 启用Vercel自动部署

```
Vercel Dashboard -> Settings -> Git
✅ Production Branch: main
✅ Auto-deploy: Enabled
```

---

## 📊 Step 9: 监控和分析

### Google Analytics

```
1. 创建GA4属性
2. 获取Measurement ID
3. 添加到Vercel环境变量：
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
4. 重新部署
```

### Vercel Analytics

```
Vercel Dashboard -> Analytics
免费版提供：
- 页面浏览量
- 访问者数量
- Top pages
```

---

## 🚀 Step 10: 开始推广

### 免费流量来源

```
1. SEO优化
   □ Google Search Console提交
   □ 每个职位页面优化title/description
   □ 等待2-4周开始收录

2. Reddit发帖
   □ r/cscareerquestions
   □ r/forhire
   □ r/remotejs
   
3. Product Hunt
   □ 发布产品
   □ 获得首批用户

4. HackerNews
   □ Show HN: I built a tech jobs aggregator
```

---

## ✅ 上线检查清单

```
□ 网站部署成功
□ 环境变量配置正确
□ 所有页面正常工作
□ 联盟链接正确跳转
□ 追踪API正常
□ Google Search Console提交
□ 联盟账号申请（至少一个）
□ 开始推广获取流量
```

---

## 💸 预期时间线

```
Day 1-3:   部署网站 + 申请联盟账号
Day 4-14:  等待联盟审核 + SEO准备
Week 3-4:  首批流量到达
Week 5-8:  达到$100/月收入
Week 9-12: 优化到$500-1000/月
Month 4+:  持续增长到$2000+/月
```

---

## 🎯 成功指标

### 第一个月

```
目标：
- 100+ daily visitors
- 5+ affiliate clicks/day
- $50-100 revenue

关键动作：
- 完善SEO
- 发布3-5篇内容
- 社交媒体分享
```

### 第三个月

```
目标：
- 500+ daily visitors  
- 50+ affiliate clicks/day
- $500-800 revenue

关键动作：
- 分析top performing pages
- A/B测试按钮文案
- 添加新功能
```

---

需要帮助？查看：
- [完整README](web/README.md)
- [盈利指南](MONETIZATION_GUIDE.md)
- [零成本方案](ZERO_COST.md)

**开始部署吧！** 🚀
