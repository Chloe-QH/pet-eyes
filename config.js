/**
 * 配置。
 * 方式 A（推荐，线上）：把 endpoint 指向你的代理地址（Cloudflare Worker），Key 存在代理里，前端不暴露。
 *    endpoint: "https://pet-eyes.xxx.workers.dev/v1/chat/completions"
 * 方式 B（本地自测）：endpoint 留空，用页面右下角的调试入口填 Key，会直连阿里云百炼。
 * 两者都没有时：进入演示模式，用本地样例生成完整结果，页面依然可完整演示。
 */
window.PET_CONFIG = {
  endpoint: "",

  // 阿里云百炼（DashScope）OpenAI 兼容地址
  directEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",

  // 推荐模型：qwen-vl-max-latest（中文 + 图像理解在这类"看图说人"任务上表现稳）
  model: "qwen-vl-max-latest",

  // 不要把 Key 写在这里（会随网页公开）。留空即可。
  apiKey: ""
};
