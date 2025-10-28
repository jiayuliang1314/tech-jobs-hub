# 🚀 一步一步部署指南

## 📍 当前状态

✅ Demo已运行（http://localhost:8000）
✅ 抓取脚本已准备
✅ 网站代码已完成
✅ 搜索功能已实现

---

## 🎯 接下来的步骤

### Step 1: 准备3000家公司列表（现在）

**格式要求：**
```
每行一个board token
例如：
airbnb
stripe
shopee
coupang
notion
...
```

**提供方式：**
1. 直接粘贴到 companies.txt 文件
2. 或提供文件路径
3. 或提供URL列表（我帮你提取token）

**准备好后告诉我！**

---

### Step 2: 批量抓取职位数据（我来执行）

```bash
# 预计时间：
3000家 × 2秒 = 100分钟 = 1.7小时

# 策略：
- 分批抓取（避免超时）
- 自动重试（404跳过）
- 保存进度（断点续传）
```

---

### Step 3: 构建搜索索引

```bash
# 将抓取的数据构建成搜索索引
python3 build_search_index.py --data data --output html-demo
```

---

### Step 4: 本地预览效果

```bash
# 查看抓取到的实际职位
http://localhost:8000/search-demo.html
```

---

### Step 5: 推送到GitHub

```bash
git init
git add .
git commit -m "Add 3000 companies data"
git push
```

---

### Step 6: 部署到Vercel

```bash
cd web
vercel --prod
```

---

### Step 7: 申请联盟账号

```
1. Indeed: https://www.indeedpublishers.com/
2. ZipRecruiter: https://www.ziprecruiter.com/affiliates
3. CJ Affiliate: https://www.cj.com/
```

---

### Step 8: 配置环境变量并上线

```
在Vercel添加联盟ID
重新部署
开始赚钱！
```

---

## 📌 现在：等待你的3000家公司列表

**请提供：**
- 公司board token列表
- 或完整URL列表（我帮你提取）
- 或Excel/CSV文件

**格式示例：**
```txt
airbnb
stripe
shopee
coupang
notion
figma
databricks
...
```

准备好了吗？把列表给我！ 🚀
