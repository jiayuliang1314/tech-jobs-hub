# 🎨 HTML Demo - 立即查看效果

**无需安装Node.js，立即在浏览器查看！**

---

## 🚀 运行Demo（2步）

### Step 1: 启动本地服务器

```bash
cd /Volumes/T7Shield/boss/wavely_code/greenhouse-demo/html-demo
./run-demo.sh
```

或者直接运行：

```bash
python3 -m http.server 8000
```

### Step 2: 打开浏览器

访问：**http://localhost:8000**

---

## 📄 页面预览

### 1. 首页 (index.html)
```
http://localhost:8000/index.html

功能：
✅ 职位搜索
✅ 热门公司展示
✅ 最新职位列表
✅ 响应式设计
```

### 2. 职位详情 (job-detail.html) ⭐核心盈利页面
```
http://localhost:8000/job-detail.html

功能：
✅ 完整职位信息
💰 3个联盟按钮（Indeed/ZipRecruiter/Glassdoor）
💰 Glassdoor公司洞察卡片
✅ 点击收入演示

**点击任何联盟按钮查看盈利演示！**
```

### 3. 公司页面 (company.html)
```
http://localhost:8000/company.html?name=airbnb

功能：
✅ 公司所有职位
💰 Glassdoor集成
✅ 统计数据
```

---

## 💰 盈利演示

### 在job-detail.html中：

点击任何联盟按钮会显示：
```
💰 You earn $0.75 from this click!  (Indeed)
💰 You earn $10 if user registers!  (ZipRecruiter)
💰 You earn $1.50 from this click!  (Glassdoor)
```

并显示生成的联盟链接URL。

---

## 🎯 重点关注

### 职位详情页的3个按钮

1. **绿色按钮** - Greenhouse原始链接
   - 你不赚钱
   - 但建立用户信任 ✅

2. **蓝色⭐按钮** - Indeed联盟
   - 💰 每点击赚 $0.75
   - 预期点击率：35%

3. **蓝色边框按钮** - ZipRecruiter联盟
   - 💰 用户注册赚 $10
   - 预期注册率：2%

4. **紫色卡片** - Glassdoor联盟
   - 💰 每点击赚 $1.50
   - 预期点击率：15%

---

## 📊 收入计算演示

打开浏览器Console（F12）查看：
```javascript
// 每次点击联盟按钮都会console.log：
💰 Affiliate Click Tracked: {
  platform: "indeed",
  job: "Senior Software Engineer",
  company: "Airbnb",
  timestamp: "2024-01-01T00:00:00Z"
}
```

---

## 🔧 自定义配置

### 修改联盟ID（测试用）

编辑任何HTML文件，找到：

```javascript
const INDEED_PUBLISHER_ID = 'YOUR_INDEED_ID';
const ZIPRECRUITER_AID = 'YOUR_ZR_ID';
const CJ_AFFILIATE_ID = 'YOUR_CJ_ID';
```

替换成你申请到的真实ID。

---

## 📝 文件说明

```
html-demo/
├── index.html          # 首页
├── job-detail.html     # 职位详情（核心盈利页面）⭐⭐⭐
├── company.html        # 公司页面
└── run-demo.sh         # 启动脚本
```

---

## 🚀 下一步

### 看完Demo后：

**选项1：直接用HTML版本上线**
```bash
# HTML可以直接部署到：
- GitHub Pages（免费）
- Netlify（免费）
- Vercel（免费）

优点：
✅ 无需Node.js
✅ 加载速度快
✅ 零学习成本

缺点：
⚠️ 无法动态加载数据
⚠️ SEO不够完善
```

**选项2：升级到Next.js版本**
```bash
# 安装Node.js后：
cd ../web
npm install
npm run dev

优点：
✅ 动态数据加载
✅ 更好的SEO
✅ 更强大的功能
✅ 更专业
```

---

## 💡 立即体验

```bash
# 运行Demo
cd /Volumes/T7Shield/boss/wavely_code/greenhouse-demo/html-demo
./run-demo.sh

# 打开浏览器
# http://localhost:8000

# 点击职位 -> 点击联盟按钮 -> 查看盈利演示！
```

---

**开始吧！** 🚀

