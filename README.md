# 宠物眼中的你 · PET'S EYES

上传一张宠物的照片，AI 从它的眼神、姿态、还有它身后的房间，推断"在它眼里，你是个什么样的人"。

纯静态站点，无后端、无构建步骤，直接扔到 GitHub Pages 就能跑。

## 目录

```
pet-eyes/
├── index.html          页面
├── style.css           样式
├── app.js              交互 + 调模型 + 分享卡绘制
├── config.js           接口配置（唯一需要改的文件）
├── assets/
│   ├── sample-cat.jpg  预览用样例照片
│   └── og.jpg          （可选）分享缩略图
├── docs/
│   └── 测评结果设计.md  结果体系设计文档
└── deploy/
    └── worker.js       Cloudflare Worker 网关（藏 Key 用）
```

## 三种接入模式

**模式 A · 自己玩（最快）**
打开页面，点页脚的「演示模式 · 接入模型」，粘贴百炼 Key。Key 只存在本机浏览器 localStorage，不会上传。刷新后生效，直连百炼（已确认百炼支持浏览器跨域）。

**模式 B · 给别人用（推荐）**
部署 `deploy/worker.js` 到 Cloudflare Workers，把 Key 放在 Worker 的 Secret 里，然后修改 `config.js`：

```js
window.PET_CONFIG = {
  endpoint: "https://pet-eyes.xxx.workers.dev/v1/chat/completions",
  ...
};
```

前端不再持有 Key，谁都能用，也能防止被刷额度（Worker 内有单 IP 每分钟 6 次的限流）。

**模式 C · 偷懒（有风险）**
把 Key 直接写进 `config.js` 的 `apiKey`。仓库是公开的，等于公开 Key。只建议临时演示，且务必给 Key 设额度上限。

**没有任何配置时**：自动进入演示模式，用本地三套样例结果轮换，页面功能（含分享卡）全部可用。

## 本地预览

```bash
cd pet-eyes
python -m http.server 8765
# 打开 http://127.0.0.1:8765
```

预览彩蛋（仅本地）：`?dev=1` 自动载入样例照片，`&auto=1` 直接跑完，`&card=1` 自动弹出分享卡，`&qa=1` 关掉动画方便截图。

## 部署到 GitHub Pages

1. 新建仓库 `pet-eyes`
2. 推上去（根目录就是站点根目录）
3. Settings → Pages → Source 选 `Deploy from a branch` → `main` / `root`
4. 访问 `https://<用户名>.github.io/pet-eyes/`

不要把 `config.js` 里的 Key 提交进公开仓库；用模式 B。

## 模型

默认 `qwen3-vl-plus`（阿里云百炼，OpenAI 兼容接口）。实测该账号下 `qwen-vl-max-latest` 返回 403、`qwen-vl-plus` 返回 404，所以默认用了 `qwen3-vl-plus`。改模型只需动 `config.js` 的 `model` 字段。备选供应商：智谱 `glm-4.5v`，同样兼容 OpenAI 格式，改 endpoint 与 model 即可。

## 已知取舍

- 图片在浏览器内压到 1280px、JPEG 0.82 再上传，既省流量也避开大图超限。
- 模型返回不是合法 JSON 时，前端做容错解析 + 缺字段回填，结果页永远有内容。
- 模型调用失败（超时、限流、跨域）会自动降级到演示结果，并提示原因，不会白屏。
- 分享卡是 Canvas 手绘 1080×1440，不依赖任何图片库。
