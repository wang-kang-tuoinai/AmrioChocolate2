# 哆啦A梦道具大全 🎯

一个精美的哆啦A梦道具展示网站，支持搜索、筛选、管理员编辑等功能。

![哆啦A梦道具大全](https://c-ssl.duitang.com/uploads/item/201610/14/20161014172408_WkHMy.jpeg)

## ✨ 功能特性

### 🎨 用户功能
- **🔍 智能搜索** - 支持道具名称和功能搜索
- **🏷️ 分类筛选** - 按道具类型快速筛选
- **📱 响应式设计** - 完美适配手机、平板、电脑
- **🎭 精美界面** - 现代化UI设计，毛玻璃效果
- **📖 详细信息** - 点击查看道具完整信息
- **📍 出现位置** - 显示道具在动画中的出现位置

### 🔧 管理员功能
- **🔐 密码保护** - 管理员密码：`doraemon2024`
- **➕ 添加道具** - 新增哆啦A梦道具
- **✏️ 编辑道具** - 修改道具信息
- **🗑️ 删除道具** - 删除不需要的道具
- **💾 数据持久化** - 自动保存到本地存储

### 🎯 道具分类
- 🚗 交通工具
- 🏠 生活用品
- ⚔️ 战斗道具
- 🎮 娱乐道具
- 📚 学习道具
- 🏥 医疗道具
- ⏰ 时空道具

## 🚀 快速开始

### 方法一：直接打开
1. 下载所有文件到本地文件夹
2. 双击 `index.html` 即可在浏览器中打开

### 方法二：本地服务器
```bash
# 使用Python启动本地服务器
python -m http.server 8000

# 然后在浏览器中访问
http://localhost:8000
```

## 🌐 在线部署

### GitHub Pages（推荐）
1. 创建GitHub仓库
2. 上传项目文件
3. 在仓库设置中启用Pages功能
4. 访问 `https://你的用户名.github.io/仓库名`

### Netlify
1. 访问 [Netlify.com](https://netlify.com)
2. 拖拽项目文件夹到部署区域
3. 等待部署完成

### Vercel
1. 访问 [Vercel.com](https://vercel.com)
2. 导入GitHub仓库或上传文件
3. 自动部署完成

## 📁 项目结构

```
doraemon-tools/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── README.md           # 项目说明
├── deploy.md           # 详细部署指南
├── deploy.bat          # Windows部署脚本
└── 密码.txt            # 管理员密码
```

## 🎨 技术栈

- **HTML5** - 语义化标签，现代化结构
- **CSS3** - Flexbox/Grid布局，毛玻璃效果，响应式设计
- **JavaScript ES6+** - 模块化代码，本地存储，动态交互
- **Google Fonts** - 中文字体优化

## 🔧 自定义配置

### 修改管理员密码
在 `script.js` 文件中找到：
```javascript
const ADMIN_PASSWORD = "doraemon2024";
```
修改为你想要的密码。

### 更换背景图片
在 `styles.css` 文件中找到：
```css
background-image: url('你的图片链接');
```

### 添加新道具分类
在 `index.html` 和 `script.js` 中添加新的分类选项。

## 📱 移动端适配

网站完全支持移动端：
- 📱 手机屏幕（480px以下）
- 📱 平板屏幕（768px以下）
- 💻 桌面屏幕（768px以上）

## 🔐 管理员使用指南

1. 点击页面底部的"管理员登录"按钮
2. 输入密码：`doraemon2024`
3. 登录后可以：
   - 添加新道具
   - 编辑现有道具
   - 删除道具
   - 管理出现位置信息

## 🎯 道具数据结构

```javascript
{
    id: 1,
    name: "竹蜻蜓",
    category: "交通工具",
    description: "戴在头上就能飞行的神奇道具...",
    image: "图片链接",
    features: ["飞行", "便携", "易用"],
    appearances: [
        { type: "season", value: "第1季", episode: "第1集" },
        { type: "movie", value: "大雄的恐龙", year: "1980" }
    ]
}
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢哆啦A梦的创作者藤子·F·不二雄
- 感谢所有提供图片资源的网站
- 感谢开源社区的支持

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至：[你的邮箱]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！ 