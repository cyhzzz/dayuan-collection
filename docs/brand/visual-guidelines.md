# 大元藏馆 · 视觉设计规范

> Dayuan Collection — Visual Design Guidelines  
> 版本：v1.0 · 2026年4月  
> Logo：圆融山水（Circular Landscape）

---

## 1. 品牌概述

| 项目 | 内容 |
|------|------|
| 品牌名称 | 大元藏馆 |
| 品牌定位 | 天台县收藏家大元的私人收藏展示平台 |
| 品牌调性 | 中式文雅、沉稳内敛、文化底蕴 |
| 收藏领域 | 玉器、瓷器、铜器、木器花板、钱币等 |
| 目标用户 | 收藏爱好者、文化研究者、天台本地文化关注者 |
| 网站地址 | https://github.com/cyhzzz/dayuan-collection |

---

## 2. Logo 规范

**定稿方案**：圆融山水（Circular Landscape）

- 圆形构图内天台山水极简呈现，远山、主山、近山层层递进，水纹横贯底部
- 「大元」竖排于右侧，旁有小方印「藏」字点睛
- 圆融东方意境，如一幅掌中画卷

### 使用规范

| 规则 | 说明 |
|------|------|
| 最小尺寸 | 32×32px（favicon） |
| 安全区域 | Logo 周围保留 ≥1/4 logo 宽度的留白 |
| 深色背景 | 使用白色/米白版本 |
| 浅色背景 | 使用沉稳棕 `#5C3D2E` 版本 |
| 不可拉伸 | 保持 1:1 比例 |
| 不可改色 | 不得更改主色与强调色的比例关系 |
| 不可加特效 | 不添加投影、描边、发光等效果 |

**文件**：`dayuan_logo_05_circular_landscape.svg`

---

## 3. 色彩系统

### 3.1 主色（Primary）

| 名称 | 色值 | 预览 | 用途 |
|------|------|------|------|
| 沉稳棕 | `#5C3D2E` | 🟫 | 主文字、标题、Logo 主色 |
| 古铜色 | `#B87333` | 🟠 | 强调色、链接、装饰元素 |
| 米白色 | `#F5F0E8` | ⬜ | 页面背景、大面积留白 |

### 3.2 辅助色（Secondary）

| 名称 | 色值 | 预览 | 用途 |
|------|------|------|------|
| 浅棕 | `#8B7355` | 🟤 | 次要文字、说明文字 |
| 暖灰 | `#E0D6C2` | 🔲 | 边框、分隔线 |
| 深棕 | `#654321` | 🟫 | 导航栏渐变终点 |
| 浅米 | `#D2B48C` | 🟡 | 标签背景、次要装饰 |

### 3.3 功能色（Functional）

| 名称 | 色值 | 用途 |
|------|------|------|
| 成功 | `#4A7C59` | 成功提示 |
| 警告 | `#C19A6B` | 警告提示 |
| 错误 | `#8B4513` | 错误提示 |

### 3.4 色彩使用规则

- 主色占比约 **60%**，辅助色 **30%**，强调色 **10%**
- 同一页面主色不超过 **3 种**
- 深色背景上文字使用 `#F5F0E8`，浅色背景上使用 `#5C3D2E`
- 卡片背景统一使用 `#FFFFFF`

---

## 4. 字体系统

### 4.1 字体栈

| 用途 | 字体 | 字重 | 备注 |
|------|------|------|------|
| 标题/品牌 | `ZCOOL XiaoWei` | 400 | 中文标题、品牌名、Hero |
| 正文 | `Noto Serif SC` | 400/500/600/700 | 正文、说明、详情 |
| 辅助 | `Noto Sans SC` | 300/400/500 | 按钮、标签、辅助信息 |

```css
--font-serif: 'ZCOOL XiaoWei', 'Noto Serif SC', serif;
--font-sans: 'ZCOOL XiaoWei', 'Noto Sans SC', sans-serif;
--font-calligraphy: 'ZCOOL XiaoWei', cursive;
```

### 4.2 字号层级

| 层级 | 字号 | 行高 | 用途 |
|------|------|------|------|
| H1 | `3.5rem` (56px) | 1.2 | Hero 标题 |
| H2 | `2.5rem` (40px) | 1.3 | 页面标题 |
| H3 | `1.75rem` (28px) | 1.4 | 区块标题 |
| H4 | `1.5rem` (24px) | 1.4 | 卡片标题 |
| Body | `1rem` (16px) | 1.6 | 正文 |
| Small | `0.9rem` (14px) | 1.5 | 辅助文字 |
| Tiny | `0.85rem` (13px) | 1.4 | 标签、元信息 |

### 4.3 字间距

| 场景 | 值 |
|------|------|
| 品牌名 | `letter-spacing: 2px` |
| Hero 标题 | `letter-spacing: 0.4em` |
| 区块标题 | `letter-spacing: 0.15em` |
| 正文 | `letter-spacing: 0` |

---

## 5. 间距系统

基于 **8pt 网格**，以 `0.5rem` 递增：

| Token | 值 | 用途 |
|------|------|------|
| `--spacing-xs` | `0.5rem` (8px) | 元素内间距 |
| `--spacing-sm` | `1rem` (16px) | 卡片内间距 |
| `--spacing-md` | `2rem` (32px) | 区块间距 |
| `--spacing-lg` | `3rem` (48px) | 大区块间距 |
| `--spacing-xl` | `5rem` (80px) | 页面级间距 |

---

## 6. 圆角系统

| Token | 值 | 用途 |
|------|------|------|
| `--radius-sm` | `8px` | 按钮、标签 |
| `--radius-md` | `12px` | 卡片、输入框 |
| `--radius-lg` | `20px` | Hero 区、大容器 |

---

## 7. 阴影系统

| Token | 值 | 用途 |
|------|------|------|
| `--shadow` | `0 10px 30px rgba(139, 69, 19, 0.1)` | 卡片默认 |
| `--shadow-hover` | `0 15px 40px rgba(139, 69, 19, 0.15)` | 卡片悬停 |

> 阴影使用棕色系（`rgba(139, 69, 19, ...)`），与品牌主色统一，避免灰色默认阴影。

---

## 8. 组件规范

### 8.1 导航栏（Header）

- **高度**：auto（padding `1.5rem 0`）
- **背景**：`linear-gradient(135deg, #8b4513, #654321)`
- **文字**：`#ffffff`
- **Logo 尺寸**：80×80px
- **品牌名**：`2.5rem`，ZCOOL XiaoWei，`letter-spacing: 2px`
- **导航按钮**：背景 `rgba(255,255,255,0.1)`，边框 `rgba(255,255,255,0.2)`，圆角 `8px`
- **激活状态**：白色背景，主色文字
- **底部装饰**：云纹波浪线 SVG
- **定位**：`position: sticky; top: 0; z-index: 100`

### 8.2 Hero 区域

- **背景**：`linear-gradient(135deg, #d2b48c, #c19a6b)`
- **内边距**：`5rem 0`
- **圆角**：`20px`
- **标题**：`3.5rem`，ZCOOL XiaoWei，白色，`letter-spacing: 0.4em`
- **副标题**：`1.25rem`，白色 90% 透明度
- **装饰**：云纹背景纹理 + 内边框（10px 内缩）
- **阴影**：`0 10px 30px rgba(139, 69, 19, 0.1)`

### 8.3 分类卡片（Category Card）

- **背景**：`#ffffff`
- **圆角**：`12px`
- **阴影**：`--shadow`
- **图片高度**：`250px`，`object-fit: cover`
- **悬停**：`translateY(-10px)`，图片 `scale(1.1)`，阴影升级为 `--shadow-hover`
- **角落装饰**：四角 `20px` 边框线，`opacity: 0.3` → hover `0.8`
- **标题**：`1.5rem`，主色，`font-weight: 700`
- **标签**：背景 `#d2b48c`，文字 `#8b4513`，圆角 `20px`，hover 反转

### 8.4 藏品卡片（Item Card）

- **背景**：`#ffffff`
- **圆角**：`12px`
- **图片高度**：`200px`
- **悬停**：`translateY(-8px)`
- **角落装饰**：`15px`（比分类卡片略小）
- **标题**：`1.25rem`，主色，`font-weight: 600`

### 8.5 藏品详情（Item Detail）

- **布局**：双栏 `grid-template-columns: 1fr 1fr`
- **背景**：`#ffffff`
- **圆角**：`20px`
- **边框**：`1px solid #e0d6c2`
- **内边框**：`15px` 内缩装饰线
- **图片最大高度**：`500px`，`object-fit: contain`
- **印章**：80×80px 圆形，背景 `rgba(139,69,19,0.8)`，旋转 `15deg`

### 8.6 面包屑导航（Breadcrumb）

- **字号**：`0.9rem`
- **链接颜色**：`#8b4513`，hover 加下划线
- **分隔符**：`/`，颜色 `#666666`

### 8.7 搜索控件

- **输入框**：`border: 1px solid #e0d6c2`，圆角 `8px`
- **搜索按钮**：背景 `#8b4513`，白色文字

### 8.8 中式分隔线

- 虚线 + 中心圆点装饰
- 线色 `#d2b48c`，点色 `#8b4513`

### 8.9 页脚（Footer）

- **三栏布局**
- **标题**：`1rem`，白色
- **正文**：`0.9rem`，白色 80%

---

## 9. 动效规范

| 属性 | 值 |
|------|------|
| 过渡时间 | `0.3s` |
| 缓动函数 | `cubic-bezier(0.4, 0, 0.2, 1)` |
| 卡片悬停位移 | `-8px` ~ `-10px` |
| 图片悬停缩放 | `scale(1.1)` |
| 导航按钮悬停 | `translateY(-2px)` |
| 入场动画 | `fade-in-up` |

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 10. 装饰元素

| 元素 | 说明 | 使用位置 |
|------|------|---------|
| 云纹波浪线 | SVG 波浪路径 | 导航栏底部、分隔线 |
| 中式角落装饰 | 四角边框线（::before/::after） | 分类卡片、藏品卡片 |
| 回纹边框 | 双线边框（外+内15px缩） | 详情页、关于页 |
| 宣纸纹理 | SVG 圆点纹理 + 渐变叠加 | body 背景 |
| 金色光晕 | `radial-gradient` 两角光斑 | body::before |
| 印章效果 | 圆形半透明背景 + 旋转 | 藏品详情页图片区 |

---

## 11. 响应式断点

| 断点 | 宽度 | 调整 |
|------|------|------|
| Desktop | `> 1200px` | 默认布局 |
| Tablet | `768px - 1200px` | 双栏→单栏，Hero 缩小 |
| Mobile | `< 768px` | 单栏，字号缩小，导航折叠 |

---

## 12. CSS 变量速查

```css
:root {
  /* 颜色 */
  --primary-color: #8b4513;
  --secondary-color: #d2b48c;
  --accent-color: #c19a6b;
  --text-color: #333333;
  --text-light: #666666;
  --background-color: #faf7f2;
  --card-bg: #ffffff;
  --border-color: #e0d6c2;
  --shadow: 0 10px 30px rgba(139, 69, 19, 0.1);
  --shadow-hover: 0 15px 40px rgba(139, 69, 19, 0.15);

  /* 字体 */
  --font-serif: 'ZCOOL XiaoWei', 'Noto Serif SC', serif;
  --font-sans: 'ZCOOL XiaoWei', 'Noto Sans SC', sans-serif;
  --font-calligraphy: 'ZCOOL XiaoWei', cursive;

  /* 间距 */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 3rem;
  --spacing-xl: 5rem;

  /* 圆角 */
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 20px;

  /* 动画 */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 13. 文件结构

```
dayuan-collection/
├── index.html              # 首页
├── setting.html            # 设置页
├── css/
│   └── style.css           # 主样式（视觉规范实现）
├── js/
│   ├── data.js             # 数据层
│   └── app.js              # 应用逻辑
├── assets/
│   └── logo.svg            # 圆融山水 Logo
├── images/                 # 藏品图片
└── docs/
    └── dayuan-visual-guidelines.md   # 本文档
```

---

> 配套 HTML 演示页：`dayuan-visual-guidelines.html`（在浏览器中打开即可预览所有色板、字体、组件效果）
