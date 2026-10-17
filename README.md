# 市井烟火 · 百味人间

> 六点四十七分，这条街先于城市醒来。

课程网页设计大作业。一个可以走进去的武汉老街：从清晨菜市场，到午后老街，再到深夜烧烤摊。沿街点亮八段普通人的故事，收齐八枚「烟火碎片」，带走一句属于自己的市井记忆。

不是美食攻略，也不是传统展示页。

## 功能

- **点火序章**：拖动火柴点燃炉火，走进老街（支持点击、回车点火）
- **横向漫游**：桌面端拖拽平移、滚轮缩放、方向键行走；移动端自动切换为纵向滚动
- **八处热点**：三家早点摊、修表摊、旧海报、檐下的猫、烧烤摊、糖水铺
- **烟火碎片**：点击热点阅读故事并收集碎片，碎片册实时显示进度；集齐八枚触发片尾
- **时间光影**：漫游进度驱动天空、日光/月光、雾气、窗灯与炭火，从 06:47 平滑走到 23:30
- **Canvas 粒子**：清晨雾粒、午后浮尘、夜晚火星，按设备性能与 `prefers-reduced-motion` 降级
- **留言墙**：写下记忆里的味道，保存在浏览器本地
- **本地持久化**：收集进度、留言、音效设置刷新不丢失
- **环境音接口**：音频系统与静音按钮已就绪，素材接入方式见 `public/audio/README.md`
- **IE 降级**：旧浏览器自动进入 `legacy.html` 静态阅读模式

## 快速开始

要求 Node.js >= 20.19（当前开发环境为 Node 24）。

```bash
npm install
npm run dev
```

开发服务器默认开启局域网访问，可以用同一 Wi-Fi 下的手机打开终端里显示的 Network 地址，验证移动端纵向漫游。

### 常用命令

| 命令                   | 用途                           |
| ---------------------- | ------------------------------ |
| `npm run dev`          | 启动开发服务器                 |
| `npm run build`        | TypeScript 类型检查 + 生产构建 |
| `npm run preview`      | 预览生产构建                   |
| `npm run lint`         | Oxlint 静态检查                |
| `npm run format`       | Prettier 格式化                |
| `npm run format:check` | 检查格式                       |

## 技术栈

- Vite 8 + React 19 + TypeScript
- Zustand（场景状态 + `persist` 本地持久化）
- Framer Motion（点火、拖拽、转场）
- 原生 Pointer Events / `requestAnimationFrame`（相机平移与惯性）
- Canvas 2D（氛围粒子）
- 原生 localStorage（带隐私模式与配额降级）

## 目录结构

```text
src/
  components/
    Hotspot.tsx          # 通用交互热点
    Stall.tsx            # 纯 CSS 摊位插画
    props/               # 猫、旧海报等小景
    StoryCard.tsx        # 故事卡与碎片落章
    FragmentPanel.tsx    # 碎片册
    MessageWall.tsx      # 本地留言墙
    Hud.tsx              # 顶部状态与工具
    StreetProgress.tsx   # 底部时间轴
    ParticlesCanvas.tsx  # Canvas 粒子
    Modal.tsx            # 通用弹层（焦点陷阱/Esc）
    MatchStick.tsx       # 可拖拽火柴
    Skyline.tsx          # 天际线
    StallRow.tsx         # 序章三摊
    Stove.tsx            # 炉子与点火目标
  content/
    hotspots.ts          # 八处热点、故事与碎片文案
    zones.ts             # 三段时间与光影关键帧
  hooks/
    useStreetCamera.ts   # 拖拽/缩放/键盘/纵向滚动
    useFocusTrap.ts      # 弹层焦点管理
    useMediaQuery.ts
  lib/
    ambience.ts          # 环境音控制器（当前为空实现）
    storage.ts           # 安全的 localStorage 封装
  scenes/
    IntroScene.tsx       # 点火序章
    RoamScene.tsx        # 老街漫游
    StreetScene.tsx      # 场景路由
  stores/game.ts         # 阶段、收集、留言、音效、持久化
  index.css              # 主题、场景美术、布局与动效
public/
  legacy.html            # IE / 旧浏览器降级阅读页
  audio/README.md        # 环境音素材接入说明
docs/
  项目策划案.md          # 早期产品策划（部分内容已被本版本取代）
```

## 内容与实现约定

- 故事文案集中在 `src/content/hotspots.ts`，组件只读数据，不硬编码叙事。
- 人物、摊位为虚构复合创作；使用真实采风素材需征得同意并记录授权。
- 相机逐帧只修改 `transform` 与 CSS 变量，不触发 React 重新渲染。
- 移动端与桌面端共用同一份 DOM 与内容，仅通过 820px 断点切换定位与滚动方式。
- 所有 localStorage 访问都有异常兜底，损坏数据会回退到默认值。
- 尊重 `prefers-reduced-motion`：关闭惯性、粒子与装饰动画。

## IE / 旧浏览器说明

React 19 + ES Module 无法在 IE 中运行，因此采用约定好的降级策略：

- `index.html` 中的 `<script nomodule>` 会把旧浏览器（IE11 会执行该脚本）跳转到 `legacy.html`
- `legacy.html` 是纯静态阅读页，包含三段时间与八段完整故事，不依赖 JavaScript
- 现代浏览器不受影响，保留完整交互

## 环境音

当前没有音频素材，`src/lib/ambience.ts` 中的 `AMBIENCE_ENABLED = false`，不会发出声音或发起请求。
接入方法见 [public/audio/README.md](public/audio/README.md)。

## 部署

`vite.config.ts` 使用相对 `base`，产物可以直接放到任意静态服务器的根目录或子目录：

```bash
npm run build
# 将 dist/ 部署到静态托管（如 GitHub Pages）
```

## 文档

- [项目策划案](docs/项目策划案.md)
