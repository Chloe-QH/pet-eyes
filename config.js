/**
 * 配置。
 *
 * 当前上线状态：前端直连百炼（Key 在下方 apiKey）。
 * 这是临时方案 —— 站点是公开的，Key 等于公开。要收回去，只要换掉 apiKey 即可，
 * 或者部署 deploy/worker.js，把 endpoint 指向 Worker，再把 apiKey 清空。
 */
window.PET_CONFIG = {
  endpoint: "",

  // 阿里云百炼（DashScope）OpenAI 兼容地址
  directEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",

  // 默认模型：qwen3-vl-plus（实测该账号下可用；qwen-vl-max-latest 返回 403、qwen-vl-plus 返回 404）
  model: "qwen3-vl-plus",

  // 站点专用 Key。被蹭就删掉重发一个，换这一行即可。
  apiKey: "sk-ws-H.XDDRIHY.cWWE.MEQCIE4zHF9SFp9ebmB5Rs0k1DQuVxIBUdkk4pUwChGH6ZTjAiAoGP_MHHHaVsYxo0xP-UZKeY3I4IHvpn73QP_HlaMjiw"
};
