# 🎉 Demo已启动！立即查看效果

## 🌐 访问地址

**在浏览器中打开这些链接：**

### 1. 首页
```
http://localhost:8000/index.html
```
- 看到搜索功能
- 热门公司列表
- 最新职位展示

---

### 2. 职位详情（⭐⭐⭐ 核心盈利页面）
```
http://localhost:8000/job-detail.html
```

**重点测试：**
1. 点击 "Apply via Indeed ⭐" 按钮
   → 弹窗显示：💰 You earn $0.75 from this click!
   
2. 点击 "Apply via ZipRecruiter" 按钮
   → 弹窗显示：💰 You earn $10 if user registers!
   
3. 点击 "View on Glassdoor" 按钮
   → 弹窗显示：💰 You earn $1.50 from this click!

**这就是你的盈利方式！** 每个点击都能赚钱。

---

### 3. 公司页面
```
http://localhost:8000/company.html?name=airbnb
```
- 查看公司所有职位
- Glassdoor集成卡片
- 统计数据

---

## 💰 盈利演示说明

### 在职位详情页面你会看到：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Apply to this job

[✅ Apply Directly on Airbnb Career Page]
   ↑ 你不赚钱，但建立信任

[⭐ Apply via Indeed]
   💰 Also browse 1,000+ similar jobs
   ↑ 点击赚 $0.75

[Apply via ZipRecruiter]
   💰 One-click apply to multiple jobs
   ↑ 注册赚 $10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before you apply, learn more about Airbnb

⭐ Employee Reviews
💰 Salary Data  
💼 Interview Tips

[View on Glassdoor →]
   ↑ 点击赚 $1.50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 收入计算（演示）

```
100个用户访问这个页面：

30人点击 Greenhouse → 你赚 $0
35人点击 Indeed → 35 × $0.75 = $26.25
20人点击 ZipRecruiter（5人注册）→ 5 × $10 = $50
15人点击 Glassdoor → 15 × $1.50 = $22.50

总计：$98.75 per 100访问
平均：$0.99 per 访客
```

---

## 🎯 测试要点

### 1. 用户体验测试
```
□ 首页搜索是否友好？
□ 职位信息是否清晰？
□ 按钮设计是否吸引人？
□ 移动端是否正常显示？
```

### 2. 联盟链接测试
```
□ 点击Indeed按钮，看弹窗提示
□ 点击ZipRecruiter按钮，看收入说明
□ 点击Glassdoor按钮，看联盟URL
□ 检查URL是否包含联盟ID
```

### 3. 盈利逻辑验证
```
□ 理解为什么用户会点击联盟链接
□ 理解为什么也要保留原始链接
□ 理解多个按钮策略
□ 理解收入计算逻辑
```

---

## 📊 查看效果后的思考

### 问自己：

```
1. 这个页面设计能让用户点击联盟链接吗？
   → 如果能，转化率可能是多少？

2. 我的3000家公司 × 平均30个职位 = 90,000个这样的页面
   → 每个页面平均5访问/月
   → 450,000访问/月
   → 收入潜力是多少？

3. 我需要改进什么？
   → 按钮文案？
   → 颜色设计？
   → 价值主张？

4. 准备好上线了吗？
   → 是 → 继续部署到Vercel
   → 否 → 先优化设计
```

---

## 🔧 自定义Demo

### 修改公司名称

编辑 `job-detail.html`，搜索并替换：
```javascript
// 把 Airbnb 改成你想测试的公司
const job = {
    title: '你的职位标题',
    company: '你的公司名',
    location: '你的地点'
};
```

### 添加真实数据

把抓取到的JSON数据加载进来：

```javascript
// 在index.html中添加
fetch('../data/airbnb.json')
    .then(r => r.json())
    .then(data => {
        renderJobs(data.jobs);
    });
```

---

## 🚀 满意Demo后的下一步

### Option 1: 部署HTML版本（最简单）

```bash
# 1. 推送到GitHub
git add html-demo/
git commit -m "Add HTML demo"
git push

# 2. 启用GitHub Pages
# Settings -> Pages -> Source: main -> /html-demo

# 3. 访问
https://YOUR_USERNAME.github.io/greenhouse-jobs/index.html

成本：$0
时间：10分钟
```

### Option 2: 升级到Next.js（更专业）

```bash
# 1. 安装Node.js（如果还没有）
# macOS: brew install node
# 或下载：https://nodejs.org/

# 2. 安装依赖
cd ../web
npm install

# 3. 运行
npm run dev

# 4. 访问
http://localhost:3000
```

---

## 💡 Demo设计亮点

### 为什么这个设计能赚钱？

```
✅ 1. 给用户多个选择
   - 不强制跳转
   - 用户有控制感

✅ 2. 突出联盟链接价值
   - "Also browse 1,000+ similar jobs"
   - "One-click apply"
   - "See reviews & salary"

✅ 3. 视觉层次清晰
   - 绿色原始链接最显眼（建立信任）
   - 蓝色⭐Indeed次显眼（主要收入）
   - 其他联盟按钮作为补充

✅ 4. 心理暗示
   - ⭐符号 = 推荐
   - 💰符号 = 额外价值
   - 明确说明好处
```

---

## 📞 查看Demo后告诉我

1. 你觉得设计怎么样？
2. 你认为转化率会是多少？
3. 需要修改什么？
4. 准备好部署上线了吗？

**先体验Demo，然后我们继续！** 🚀

