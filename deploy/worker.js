/**
 * 「宠物眼中的你」API 网关（Cloudflare Worker）
 *
 * 作用：把百炼的 Key 藏在服务端，前端只认这个地址。
 * 部署步骤：
 *   1. Cloudflare 控制台 → Workers & Pages → Create → Worker，粘贴本文件内容
 *   2. Settings → Variables and Secrets → 新增 Secret：DASHSCOPE_API_KEY = 你的百炼 Key
 *   3. 记下 worker 域名（形如 https://pet-eyes.xxx.workers.dev），填到前端 config.js 的 endpoint
 */

const UPSTREAM = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const ALLOW_MODELS = ["qwen3-vl-plus", "qwen3-vl-max", "qwen-vl-max-latest"];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Max-Age": "86400"
};

// 极简限流：同一 IP 每分钟最多 6 次（进程内，冷启动会重置，够挡刷量）
const buckets = new Map();

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const now = Date.now();
    const b = buckets.get(ip) || { t: now, n: 0 };
    if (now - b.t > 60_000) { b.t = now; b.n = 0; }
    b.n++;
    buckets.set(ip, b);
    if (b.n > 6) return json({ error: "too_many_requests" }, 429);

    const raw = await request.text();
    if (raw.length > 8 * 1024 * 1024) return json({ error: "too_large" }, 413);

    let body;
    try { body = JSON.parse(raw); } catch (e) { return json({ error: "bad_json" }, 400); }

    // 只允许本产品用到的参数，防止被当成通用代理刷额度
    const safe = {
      model: ALLOW_MODELS.includes(body.model) ? body.model : ALLOW_MODELS[0],
      messages: body.messages,
      temperature: Math.min(Math.max(Number(body.temperature) || 0.7, 0), 1),
      max_tokens: Math.min(Number(body.max_tokens) || 1600, 2000)
    };
    if (!Array.isArray(safe.messages) || safe.messages.length > 3) {
      return json({ error: "bad_messages" }, 400);
    }

    const res = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + env.DASHSCOPE_API_KEY
      },
      body: JSON.stringify(safe)
    });

    return new Response(await res.text(), {
      status: res.status,
      headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" }
    });
  }
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" }
  });
}
