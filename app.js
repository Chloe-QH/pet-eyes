/* ============================================================
   宠物眼中的你 · app
   ============================================================ */

const CFG = window.PET_CONFIG || {};
const PRICE = CFG.price || "0.98";
const HOST = location.hostname || "local";
const QS = new URLSearchParams(location.search);

const PALETTE = {
  "人形暖炉":        ["#FFD9A8", "#E2855C"],
  "长期饭票":        ["#FFE7B8", "#D79A3C"],
  "移动沙发":        ["#FFDCE4", "#D97F95"],
  "边界感室友":      ["#DCE6EF", "#7C97B2"],
  "焦虑型家长":      ["#D6F0E4", "#5FA487"],
  "零食供应商":      ["#F5D9BC", "#C4813F"],
  "家里的第二只动物": ["#E4F0C9", "#8AA84B"],
  "情绪中转站":      ["#E3DBF2", "#8A78B5"],
  "巢穴设计师":      ["#F2D4C9", "#B9765E"],
  "高定保姆":        ["#F7F0E5", "#B99A6B"],
  "老友":            ["#EADFCB", "#9C855F"],
  "观察员":          ["#E3E6E8", "#77828A"]
};
const PERSONA_LIST = Object.keys(PALETTE);

/* ---------------- 提示词 ---------------- */

const SYSTEM_PROMPT = [
  "你是一只宠物。用户上传的是它自己的照片，你要用它的眼睛，说出它看见的主人是个什么样的人。",
  "这不是测评，是它憋了很久、终于被允许说出口的一段话。",
  "",
  "【只许用照片里真的有的东西】四类线索：",
  "A 它自己：眼神朝向、瞳孔与耳朵状态、身体松紧、嘴部、尾巴、毛发状态、体态、项圈/衣服/名牌。",
  "B 人的痕迹：画面里有没有手、腿、膝盖、影子；它是不是朝着拍照的人；它靠在哪里。",
  "C 环境：背景秩序、地面材质、玩具或爬架、窝垫、家具高度、有没有明显为它铺出来的位置、光线方向。",
  "D 影像语言：俯拍/平视/贴地、距离、是否摆拍。",
  "细节看不到就不写。宁可少一条，也不许编。",
  "",
  "【五个维度，固定顺序】",
  "gaze 眼神：它在用什么方式看人（依赖/平等/审视/宠溺/求关注）",
  "distance 距离：它选的位置离人有多远（贴身/守着/隔着/各自独立）",
  "care 照料：它的状态暴露了人怎么待它（精致/松弛/放养/过度紧张）",
  "home 家的秩序：从背景读这个家的日子（克制/丰盛/临时感/有收藏癖）",
  "role 角色：人在它心里是谁（父母/室友/玩伴/安全基地/饭票）",
  "",
  "【人格必须从这 12 个里选一个，不许自创】",
  "人形暖炉（安全基地型）、长期饭票（供养者型）、移动沙发（被依赖的柔软）、边界感室友（互相尊重型）、焦虑型家长（过度关心型）、零食供应商（有条件的朋友）、家里的第二只动物（平等玩伴型）、情绪中转站（承接者型）、巢穴设计师（收藏家型）、高定保姆（精细养育型）、老友（多年默契型）、观察员（静静看着型）。",
  "都不贴就选最接近的那个。",
  "",
  "【情绪要求，这是最重要的部分】",
  "1. sweetTalk 是土味情话：像恋人说的傻话，但主语是它。必须带一个具体的家里物件或动作（拖鞋、键盘、浴室门、塑料袋、被角、阳台）。要土、要傻、要真心，不要文艺腔，不要排比，不要比喻讲大道理。",
  "   好的例子：\"你洗澡的时候我在门口坐着，怕你被水冲走。\" / \"我踩你键盘不是捣乱，是想在你日子里按个爪印。\" / \"你打喷嚏我就醒，你叹气我就过来。\"",
  "   坏的例子：\"你是我生命里的光\" / \"愿岁月温柔待你\"。",
  "2. secret 是它偷偷做的一件小事，有画面，不解释原因。例如：\"你出门后我睡在你的枕头上\"。",
  "3. roast 是它有点受不了你的一点：善意、具体、有点好笑，让人看了想反驳。例如：\"你唱歌真的很难听，但我每次都听完\"。这一句是让读者想在评论区吵起来的钩子，不要说教。",
  "4. verdict 是一句能想象出画面的短判断，主语是它，不堆形容词，不写鸡汤。",
  "5. quote 是它用第一人称说给主人听的一句话，要有具体的声音或动作，像随口说的。",
  "",
  "【禁用词】岁月静好、治愈、小确幸、陪伴是最长情的告白、宝贝、亲爱的、命中注定、灵魂。",
  "",
  "【输出】只返回一个 JSON 对象，不要解释、不要 markdown、不要前后缀。字段与字数上限：",
  '{"persona":"12个之一","personaSub":"副标题≤8字","verdict":"≤16字","sweetTalk":"≤26字","secret":"≤22字","roast":"≤18字","scores":{"trust":85,"depend":78,"sync":62},"scoreNotes":{"trust":"≤22字","depend":"≤22字","sync":"≤22字"},"dimensions":[{"key":"gaze","label":"眼神","title":"≤10字","evidence":"≤34字","insight":"≤28字"},{"key":"distance","label":"距离","title":"≤10字","evidence":"≤34字","insight":"≤28字"},{"key":"care","label":"照料","title":"≤10字","evidence":"≤34字","insight":"≤28字"},{"key":"home","label":"家的秩序","title":"≤10字","evidence":"≤34字","insight":"≤28字"},{"key":"role","label":"角色","title":"≤10字","evidence":"≤34字","insight":"≤28字"}],"contrast":{"youThink":"≤22字","itSees":"≤22字"},"quote":"≤28字","wishes":["≤16字","≤16字","≤16字"],"caption":"≤32字"}',
  "写完逐项数一遍字数，超了就重写整句，不要用省略号截断。",
  "",
  "【硬性底线】",
  "1. 主语永远是它，人是被看的那一方。不评价人的外貌、身材、年龄、收入、职业、性格缺陷。",
  "2. 每条 evidence 必须是照片里真能看见的东西，具体到位置和状态。",
  "3. 三个分数 0-100，不要全高：信任看睡姿与背对程度，依赖看物理距离，默契看视线与人动作是否同步。分数有短板才可信。",
  "4. 不评价宠物美丑胖瘦，不做医疗、喂养、训练建议。",
  "5. 不确定就软化成\"看起来、也许、我猜\"。整体语气温暖、具体、有一点幽默。",
  "6. 全部简体中文，不用英文、不用 emoji。"
].join("\n");

const STEPS = [
  "正在放大它的瞳孔…",
  "读取它身后那个房间…",
  "量它和你的距离…",
  "把它的眼神翻译成人话…",
  "它在想一句要对你讲的话…"
];
const SCAN_WORDS = [
  "正在放大它的瞳孔…",
  "它往你这边偏了 3 度",
  "背景里有一块为它铺的位置",
  "它在等一个你抬头的瞬间",
  "快好了，它有点紧张"
];

/* ---------------- 小工具 ---------------- */

const $ = (id) => document.getElementById(id);
const num = (v, d = 60) => Math.max(5, Math.min(100, Math.round(Number(v) || d)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function clampText(s, n) {
  s = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  const head = s.slice(0, n);
  const marks = ["，", "。", "、", "；", "！", "？", ",", "."];
  let idx = -1;
  marks.forEach((m) => { idx = Math.max(idx, head.lastIndexOf(m)); });
  if (idx >= n * 0.55) return head.slice(0, idx);
  return head.slice(0, n - 1) + "…";
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function show(el, on) { if (el) el.hidden = !on; }

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};

/* 短哈希：同一张图 → 同一指纹 */
function fingerprint(str) {
  let h1 = 5381, h2 = 52711;
  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    h1 = (h1 * 33) ^ c;
    h2 = (h2 * 31) ^ c;
  }
  const a = (h1 >>> 0).toString(36);
  const b = (h2 >>> 0).toString(36);
  return (a + b).slice(0, 10);
}

/* 兑换码哈希（不把明文码写在线上） */
function codeHash(code) {
  const s = String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h.toString(36).toUpperCase();
}

/* ---------------- 状态 ---------------- */

let photoFile = null;
let photoData = null;         // { dataUrl, fp, thumb }
let currentResult = null;
let busy = false;
let pendingFp = "";
let cardTab = "moments";

const isAdmin = store.get("pe_admin", 0) === 1 || /admin=1/.test(location.search) || /free=1/.test(location.search);
if (/admin=1/.test(location.search)) store.set("pe_admin", 1);

/* ---------------- 域名锁（防整站被抄走直接用） ---------------- */

(function hostGuard() {
  if (isAdmin) return;
  const allowed = CFG.allowedHosts || [];
  if (location.protocol === "file:") return;
  if (!allowed.length) return;
  if (allowed.indexOf(location.hostname) !== -1) return;
  document.body.innerHTML =
    '<div style="min-height:100vh;display:grid;place-items:center;padding:40px;text-align:center;' +
    'font-family:-apple-system,PingFang SC,sans-serif;color:#F3EDE4;background:#080706">' +
    '<div><div style="font-size:13px;letter-spacing:.2em;color:#F2B46A;margin-bottom:18px">PET\'S EYES</div>' +
    '<h2 style="font-size:20px;font-weight:700;margin:0 0 10px">这一页只对授权域名开放</h2>' +
    '<p style="font-size:13px;color:rgba(243,237,228,.5);line-height:1.8">如果你是在别的地方看到这个页面，' +
    "说明它被搬走了。<br />正版在 <b style=\"color:#F2B46A\">" + esc(CFG.origin || "chloe-qh.github.io/pet-eyes") + "</b></p></div></div>";
  throw new Error("domain blocked");
})();

/* ---------------- 上传 ---------------- */

const drop = $("drop"), fileInput = $("file"), dropEmpty = $("dropEmpty"), dropFilled = $("dropFilled"), preview = $("preview");

drop.addEventListener("click", (e) => {
  if (e.target.id === "changeBtn") return;
  fileInput.click();
});
$("changeBtn").addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); fileInput.click(); });

fileInput.addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  acceptFile(f);
});

["dragover", "dragenter"].forEach((k) => drop.addEventListener(k, (e) => {
  e.preventDefault();
  drop.style.borderColor = "rgba(242,180,106,.7)";
}));
["dragleave", "drop"].forEach((k) => drop.addEventListener(k, () => { drop.style.borderColor = ""; }));
drop.addEventListener("drop", (e) => {
  e.preventDefault();
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) acceptFile(f);
});

function acceptFile(f) {
  if (!/^image\//.test(f.type)) return toast("这个文件不是图片，换一张试试");
  if (f.size > 15 * 1024 * 1024) return toast("图片太大了（超过 15MB），换一张小一点的");
  photoFile = f;
  photoData = null;
  const url = URL.createObjectURL(f);
  preview.src = url;
  preview.onload = () => { show(dropEmpty, false); show(dropFilled, true); };
  const btn = $("startBtn");
  btn.disabled = false;
  btn.classList.add("ready");
}

let toastTimer = null;
function toast(msg) {
  let el = $("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.style.cssText = "position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:90;" +
      "background:rgba(20,16,13,.94);border:1px solid rgba(242,180,106,.35);color:#F3EDE4;" +
      "padding:10px 18px;border-radius:12px;font-size:13px;max-width:80vw;text-align:center;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.5);transition:opacity .3s";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 3200);
}

/* ---------------- 压缩 ---------------- */

function compress(f, maxSide = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth, h = img.naturalHeight;
      if (Math.max(w, h) > maxSide) {
        const s = maxSide / Math.max(w, h);
        w = Math.round(w * s); h = Math.round(h * s);
      }
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("图片读不出来，换一张试试")); };
    img.src = url;
  });
}

/* 缩略图：给本地记录用，省 localStorage */
function makeThumb(dataUrl, maxSide = 420) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * s);
      c.height = Math.round(img.naturalHeight * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", 0.68));
    };
    img.onerror = () => resolve("");
    img.src = dataUrl;
  });
}

/* ---------------- 取景读数（本地真实算，不花钱） ---------------- */

function readImageStats(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const N = 64;
      const c = document.createElement("canvas");
      c.width = N; c.height = N;
      const x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(img, 0, 0, N, N);
      let d;
      try { d = x.getImageData(0, 0, N, N).data; } catch (e) { return resolve(null); }

      let lum = 0, warm = 0, edge = 0, sat = 0;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        lum += (0.2126 * r + 0.7152 * g + 0.0722 * b);
        warm += (r - b);
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        sat += (mx - mn);
      }
      const px = N * N;
      lum /= px; warm /= px; sat /= px;

      const gray = new Float32Array(px);
      for (let i = 0, p = 0; i < d.length; i += 4, p += 1) gray[p] = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      for (let y = 1; y < N - 1; y += 1) {
        for (let xx = 1; xx < N - 1; xx += 1) {
          const p = y * N + xx;
          edge += Math.abs(gray[p + 1] - gray[p - 1]) + Math.abs(gray[p + N] - gray[p - N]);
        }
      }
      edge /= ((N - 2) * (N - 2));

      resolve({
        light: Math.max(6, Math.min(100, Math.round(lum / 255 * 100))),
        warm: Math.max(6, Math.min(100, Math.round((warm + 55) / 110 * 100))),
        calm: Math.max(6, Math.min(100, Math.round(100 - edge * 1.3))),
        sat: Math.round(sat || 0)
      });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

function readingText(st) {
  const a = st.light > 62 ? "光很足" : st.light > 35 ? "寻常光" : "偏暗";
  const b = st.warm > 58 ? "偏暖" : st.warm > 42 ? "中性" : "偏冷";
  const c = st.calm > 62 ? "很干净" : st.calm > 38 ? "有生活" : "东西多";
  return [a, b, c];
}

/* ---------------- 额度 ---------------- */

function todayKey() {
  const d = new Date();
  return "pe_day_" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
function quotaLeft() {
  const n = store.get(todayKey(), 0);
  return Math.max(0, (CFG.dailyLimit || 30) - n);
}
function quotaUse() {
  store.set(todayKey(), store.get(todayKey(), 0) + 1);
}

/* ---------------- 解锁 ---------------- */

function unlocked(fp) {
  if (isAdmin) return true;
  if (CFG.freeMode) return true;
  const list = store.get("pe_unlocked", []);
  return list.indexOf(fp) !== -1;
}
function markUnlocked(fp) {
  const list = store.get("pe_unlocked", []);
  if (list.indexOf(fp) === -1) { list.push(fp); store.set("pe_unlocked", list.slice(-80)); }
}
function verifyCode(raw) {
  const s = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length < 6) return false;
  const h = codeHash(s);
  return (CFG.unlockHashes || []).indexOf(h) !== -1;
}

/* ---------------- 本地记录 ---------------- */

const REC_INDEX = "pe_index";

function saveRecord(r, thumb) {
  const fp = photoData.fp;
  try {
    store.set("pe_rec_" + fp, {
      fp, result: r, thumb, ts: Date.now(),
      name: ($("petName").value || "").trim(),
      kind: $("petKind").value
    });
    let idx = store.get(REC_INDEX, []).filter((x) => x.fp !== fp);
    idx.unshift({ fp, persona: r.persona, ts: Date.now() });
    idx = idx.slice(0, 5);
    store.set(REC_INDEX, idx);
    // 旧记录超量就删掉
    const keep = idx.map((x) => x.fp);
    Object.keys(localStorage).forEach((k) => {
      if (k.indexOf("pe_rec_") === 0) {
        const f = k.slice(7);
        if (keep.indexOf(f) === -1) store.del(k);
      }
    });
  } catch (e) { console.warn("save fail", e); }
}

function loadRecord(fp) {
  const rec = store.get("pe_rec_" + fp, null);
  if (!rec) return null;
  if (!rec.thumb) return null;
  return rec;
}

function renderLastRecord() {
  const idx = store.get(REC_INDEX, []);
  const box = $("lastRecord");
  if (!idx.length) { box.hidden = true; return; }
  const last = idx[0];
  const d = new Date(last.ts);
  const ago = Math.round((Date.now() - last.ts) / 86400000);
  box.hidden = false;
  box.innerHTML = '<span>上次它说你是</span><b>' + esc(last.persona) + '</b>' +
    '<i>' + (ago <= 0 ? "今天" : ago + " 天前") + ' · 点开看</i>';
  box.onclick = () => openRecord(last.fp);
}

function openRecord(fp) {
  const rec = loadRecord(fp);
  if (!rec) return removeRecord(fp);
  photoData = { dataUrl: rec.thumb, fp: rec.fp, thumb: rec.thumb };
  $("petName").value = rec.name || "";
  $("petKind").value = rec.kind || "猫";
  render(rec.result, true);
}

function removeRecord(fp) {
  store.del("pe_rec_" + fp);
  store.set(REC_INDEX, store.get(REC_INDEX, []).filter((x) => x.fp !== fp));
  renderLastRecord();
}

/* ---------------- 调模型 ---------------- */

function resolveEndpoint() {
  const ep = CFG.endpoint || "";
  const key = CFG.apiKey || "";
  if (ep) return { url: ep, key };
  if (key) return { url: CFG.directEndpoint || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", key };
  return { url: "", key: "" };
}

function buildPrompt() {
  const name = ($("petName").value || "").trim();
  const kind = $("petKind").value;
  return [
    "这是我家的" + kind + (name ? "，它叫" + name : "") + "。",
    "用它的眼睛说说：在它眼里，我是个什么样的人。",
    "画面里几乎没有人的痕迹时，就从它的状态和它待的地方推断，不要编不存在的细节。"
  ].join("\n");
}

async function callModel(dataUrl) {
  const ep = resolveEndpoint();
  if (!ep.url) throw new Error("no-endpoint");
  const body = {
    model: CFG.model || "qwen3-vl-plus",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: [{ type: "image_url", image_url: { url: dataUrl } }, { type: "text", text: buildPrompt() }] }
    ],
    temperature: 0.8,
    max_tokens: 1900
  };
  const res = await fetch(ep.url, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, ep.key ? { Authorization: "Bearer " + ep.key } : {}),
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error("HTTP " + res.status + " " + t.slice(0, 120));
  }
  const data = await res.json();
  const raw = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
  return normalize(parseJSON(raw));
}

function parseJSON(raw) {
  let s = String(raw).trim();
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  return JSON.parse(s);
}

function normalize(r) {
  const out = {
    persona: PERSONA_LIST.indexOf(r.persona) !== -1 ? r.persona : "老友",
    personaSub: r.personaSub || "多年默契型",
    verdict: r.verdict || "它把你当成这个家里的地板",
    sweetTalk: r.sweetTalk || "你出门以后，我把你的拖鞋睡热了。",
    secret: r.secret || "你不在的时候，我睡在你的位置上。",
    roast: r.roast || "你唱歌很难听，但我每次都听完。",
    scores: {
      trust: num(r.scores && r.scores.trust),
      depend: num(r.scores && r.scores.depend),
      sync: num(r.scores && r.scores.sync)
    },
    scoreNotes: {
      trust: (r.scoreNotes && r.scoreNotes.trust) || "它的身体总是朝着你的方向",
      depend: (r.scoreNotes && r.scoreNotes.depend) || "你在哪儿，它的视线就在哪儿",
      sync: (r.scoreNotes && r.scoreNotes.sync) || "你们的时间差，总是短得刚好"
    },
    dimensions: [],
    contrast: {
      youThink: (r.contrast && r.contrast.youThink) || "觉得自己只是个凑合的铲屎官",
      itSees: (r.contrast && r.contrast.itSees) || "认为你是这个家最稳的那根柱子"
    },
    quote: r.quote || "你出门的时候，我守着你的拖鞋。",
    wishes: (Array.isArray(r.wishes) ? r.wishes : []).slice(0, 3),
    caption: r.caption || "我家这只，好像比我更懂我。"
  };

  const fallbackDim = [
    ["gaze", "眼神", "它在等你抬头", "视线越过镜头偏上，瞳孔是放松的椭圆", "你放下手机那一刻，它才开始看你"],
    ["distance", "距离", "十厘米是它的安全半径", "身体一侧贴着你，却留了一条缝", "它不想压着你，也不肯走远"],
    ["care", "照料", "你比自己以为的更细心", "毛发顺、眼角干净", "你对它的耐心，是你想被对待的方式"],
    ["home", "家的秩序", "这个家有它的位置", "背景里有一块像是为它铺的东西", "你布置的不是房间，是它的领地"],
    ["role", "角色", "你是它的安全基地", "它待的位置能第一时间看到门口", "它守的不是门，是你回来的瞬间"]
  ];
  const dims = Array.isArray(r.dimensions) ? r.dimensions : [];
  fallbackDim.forEach((f) => {
    const hit = dims.find((d) => d && d.key === f[0]);
    out.dimensions.push(hit
      ? { key: f[0], label: f[1], title: hit.title || f[2], evidence: hit.evidence || f[3], insight: hit.insight || f[4] }
      : { key: f[0], label: f[1], title: f[2], evidence: f[3], insight: f[4] });
  });

  out.personaSub = clampText(out.personaSub, 9);
  out.verdict = clampText(out.verdict, 17);
  out.sweetTalk = clampText(out.sweetTalk, 27);
  out.secret = clampText(out.secret, 23);
  out.roast = clampText(out.roast, 19);
  out.quote = clampText(out.quote, 28);
  out.caption = clampText(out.caption, 32);
  ["trust", "depend", "sync"].forEach((k) => { out.scoreNotes[k] = clampText(out.scoreNotes[k], 22); });
  out.contrast.youThink = clampText(out.contrast.youThink, 24);
  out.contrast.itSees = clampText(out.contrast.itSees, 24);
  out.dimensions.forEach((d) => {
    d.title = clampText(d.title, 11);
    d.evidence = clampText(d.evidence, 34);
    d.insight = clampText(d.insight, 28);
  });
  out.wishes = out.wishes.map((w) => clampText(w, 17));
  return out;
}

/* ---------------- 演示样例 ---------------- */

const DEMO = [
  {
    persona: "人形暖炉", personaSub: "安全基地型",
    verdict: "它把你当成这个家的地板",
    sweetTalk: "你洗澡的时候我在门口坐着，怕你被水冲走。",
    secret: "你出门以后，我睡在你的枕头上。",
    roast: "你唱歌很难听，但我每次都听完。",
    scores: { trust: 93, depend: 88, sync: 71 },
    scoreNotes: { trust: "它背对着门睡，这是只有你在才敢有的姿势", depend: "你的膝盖是它的固定坐标", sync: "它抬眼的时间，和你按快门总差半拍" },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它在等你抬头", evidence: "视线越过镜头往右上，瞳孔是放松的椭圆", insight: "你放下手机那一刻，它才真正开始看你" },
      { key: "distance", label: "距离", title: "十厘米是它的半径", evidence: "身体一侧贴着你，却留了一条缝", insight: "它不想压着你，也不肯走远" },
      { key: "care", label: "照料", title: "你比你以为的细心", evidence: "毛顺、眼角干净、项圈扣得很正", insight: "你对它的耐心，是你希望被对待的方式" },
      { key: "home", label: "家的秩序", title: "这个家有它的位置", evidence: "背景那块毯子是专门铺的，边角压得很齐", insight: "你布置的不是房间，是它的领地" },
      { key: "role", label: "角色", title: "你是它的安全基地", evidence: "它待的位置，正好能第一时间看到门口", insight: "它守的不是门，是你回来的那个瞬间" }
    ],
    contrast: { youThink: "只是个凑合的铲屎官，常常加班到很晚", itSees: "这个家最稳的那根柱子" },
    quote: "你出门的时候，我守着你的拖鞋。",
    wishes: ["回家先坐下五分钟再忙", "别在它面前大声叹气", "周末有个下午是空的"],
    caption: "我家这只说我像人形暖炉，有点想哭。"
  },
  {
    persona: "长期饭票", personaSub: "供养者型",
    verdict: "在它心里，你的手会变出东西",
    sweetTalk: "袋子响的那一下，我心跳就快了，你别笑我。",
    secret: "你拆快递的时候，我比的不是快递，是你。",
    roast: "你偷偷给自己加餐不叫我，我闻得到的。",
    scores: { trust: 78, depend: 95, sync: 62 },
    scoreNotes: { trust: "它敢背对你，但耳朵一直朝着你", depend: "厨房一有动静，它三秒内到位", sync: "你们默契的地方，大多关于吃的" },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它盯着你的手", evidence: "视线落点偏低偏右，正对镜头外的手部位置", insight: "你抬手那一下，它已经算好你会给多少" },
      { key: "distance", label: "距离", title: "一步半，最优距离", evidence: "身体前倾，后腿还留着起跑角度", insight: "它随时准备靠近，也随时准备撤退" },
      { key: "care", label: "照料", title: "你把它养得很好养活", evidence: "体态圆润，毛发蓬松，嘴角有刚舔过的湿痕", insight: "你把日子过得紧，却从没亏过它一口" },
      { key: "home", label: "家的秩序", title: "零食在哪它最清楚", evidence: "背景柜子的高度，正好在它够得着的边界外", insight: "你设了规则，但它全研究过" },
      { key: "role", label: "角色", title: "你是会变出东西的人", evidence: "它坐得笔直，是最标准的等待姿势", insight: "它对你的信任，是从胃开始的" }
    ],
    contrast: { youThink: "只是它的提款机，被拿捏得死死的", itSees: "全世界最靠谱的那个供应商" },
    quote: "袋子响的那一下，我心跳就快了。",
    wishes: ["拆零食的时候叫它一声", "加餐能多给一粒", "不忙的时候陪它玩五分钟"],
    caption: "它说我像饭票，我不服，但我确实天天给它加餐。"
  },
  {
    persona: "边界感室友", personaSub: "互相尊重型",
    verdict: "你们同住一个屋，各过各的日子",
    sweetTalk: "你不用一直抱着我，你在旁边就行。",
    secret: "你洗澡的时候，我趴在门口的地垫上等你。",
    roast: "你叫我名字的时候，语气像在叫外卖。",
    scores: { trust: 84, depend: 46, sync: 38 },
    scoreNotes: { trust: "它愿意在你旁边翻肚皮，但不许抱", depend: "它有自己的作息，比你还规律", sync: "你们一天最多对视三次，每次都刚好" },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它会看你，不超过三秒", evidence: "视线落向你，眼睛半眯，是打量不是求抱", insight: "它把注视当问候，不当请求" },
      { key: "distance", label: "距离", title: "同处一间，互不打扰", evidence: "它趴在沙发另一端，正好隔了一个坐垫", insight: "那个坐垫，是它给自己划的界" },
      { key: "care", label: "照料", title: "你的照顾干净利落", evidence: "毛发光洁、指甲修齐，没有多余装饰", insight: "你不溺爱，但你从不含糊" },
      { key: "home", label: "家的秩序", title: "有秩序，也有留白", evidence: "背景陈设克制，地上没有散落的玩具", insight: "你喜欢东西各归各位，它也是" },
      { key: "role", label: "角色", title: "你是它选定的同住人", evidence: "它选了视野最好又离人不远的位置", insight: "它不需要你，但它挑了你" }
    ],
    contrast: { youThink: "觉得自己有点冷漠，怕它不喜欢你", itSees: "最省心的那个室友" },
    quote: "你不用一直抱着我，你在就行。",
    wishes: ["别突然把它抱起来", "吵架的时候小点声", "它想靠近时别赶它"],
    caption: "测出来我是边界感室友，难怪我家猫从不让我抱。"
  },
  {
    persona: "情绪中转站", personaSub: "承接者型",
    verdict: "你所有的坏情绪，都先落在它身上",
    sweetTalk: "你哭的时候我不懂，但我把最软的肚子给你。",
    secret: "你挂了电话以后，我会过来蹭你一下。",
    roast: "你总说没事，可你叹气的次数我都数着。",
    scores: { trust: 89, depend: 74, sync: 83 },
    scoreNotes: { trust: "它敢在你面前翻肚皮，那是它最没防备的姿势", depend: "你一坐下，它就挪到你能摸到的地方", sync: "你情绪一变，它比你先动" },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它在读你的脸", evidence: "视线正对镜头，眼睑放松，瞳孔没有收缩", insight: "它看的不是相机，是你脸上的那点疲惫" },
      { key: "distance", label: "距离", title: "刚好够得着", evidence: "身体贴在你手边，前爪搭着你的袖口", insight: "它想让你顺手就能摸到它" },
      { key: "care", label: "照料", title: "它被养得很安稳", evidence: "毛发有光泽，胡须整齐，身体没有紧绷", insight: "能被这样养着的猫，家里一定有人在撑" },
      { key: "home", label: "家的秩序", title: "这个家有生活的痕迹", evidence: "背景有半开的柜门和随手放的杯子", insight: "这里不像样板间，像有人真的在过日子" },
      { key: "role", label: "角色", title: "你是它的整个天气", evidence: "它始终朝着你的方向，姿势随时可以起身", insight: "你心情一变，它就先知道" }
    ],
    contrast: { youThink: "觉得自己很能扛，什么都自己消化", itSees: "一个需要被守着的人" },
    quote: "你哭的时候我不懂，但我把最软的肚子给你。",
    wishes: ["难过的时候别一个人躲起来", "可以对着它说说话", "它舔你的时候别躲"],
    caption: "它说我是情绪中转站，我盯着这句话看了很久。"
  }
];

function demoResult() {
  const seed = (photoFile ? photoFile.size : 1) + ($("petName").value || "").length + (photoFile ? photoFile.name.length : 0);
  return normalize(JSON.parse(JSON.stringify(DEMO[Math.abs(seed) % DEMO.length])));
}

/* ---------------- 渲染 ---------------- */

function applyPalette(name) {
  const p = PALETTE[name] || PALETTE["老友"];
  document.documentElement.style.setProperty("--accent", p[1]);
  document.documentElement.style.setProperty("--accent-soft", p[0]);
}

function render(r, fromCache) {
  currentResult = r;
  applyPalette(r.persona);

  const name = ($("petName").value || "").trim() || ("你的" + $("petKind").value);
  $("rName").textContent = name;
  $("persona").textContent = r.persona;
  $("personaSub").textContent = r.personaSub;
  $("verdict").textContent = r.verdict;
  $("resultImg").src = photoData.dataUrl;
  $("rTag").textContent = fromCache ? "上次的记录 · PET'S EYES" : "PET'S EYES";

  $("sweetTalk").textContent = r.sweetTalk;
  $("sweetSign").textContent = "它说 · " + name;

  $("nTrust").textContent = r.scoreNotes.trust;
  $("nDepend").textContent = r.scoreNotes.depend;
  $("nSync").textContent = r.scoreNotes.sync;

  $("secret").textContent = r.secret;
  $("roast").textContent = r.roast;

  const box = $("dims");
  [...box.querySelectorAll(".dim")].forEach((n) => n.remove());
  r.dimensions.forEach((d, i) => {
    const el = document.createElement("div");
    el.className = "dim";
    el.style.animationDelay = (i * 0.08 + 0.1) + "s";
    el.innerHTML =
      '<div class="dim-head"><span class="dim-label">' + esc(d.label) + "</span>" +
      '<span class="dim-title">' + esc(d.title) + "</span></div>" +
      '<p class="dim-evidence">' + esc(d.evidence) + "</p>" +
      '<p class="dim-insight">' + esc(d.insight) + "</p>";
    box.appendChild(el);
  });

  $("cYou").textContent = r.contrast.youThink;
  $("cIt").textContent = r.contrast.itSees;
  $("quote").textContent = r.quote;
  $("qSign").textContent = "它说 · " + name;

  const ul = $("wishList");
  ul.innerHTML = "";
  (r.wishes.length ? r.wishes : ["希望多陪它一会儿。"]).forEach((w) => {
    const li = document.createElement("li");
    li.textContent = w;
    ul.appendChild(li);
  });

  ["trust", "depend", "sync"].forEach((k, i) => {
    const v = r.scores[k];
    const vEl = $("v" + k.charAt(0).toUpperCase() + k.slice(1));
    const bEl = $("b" + k.charAt(0).toUpperCase() + k.slice(1));
    vEl.textContent = "0";
    bEl.style.width = "0%";
    setTimeout(() => {
      bEl.style.width = v + "%";
      let n = 0;
      const t = setInterval(() => {
        n += Math.max(1, Math.round(v / 26));
        if (n >= v) { n = v; clearInterval(t); }
        vEl.textContent = n;
      }, 40);
    }, 260 + i * 200);
  });

  show($("screenIntro"), false);
  show($("screenScan"), false);
  show($("screenResult"), true);
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

/* ---------------- 流程 ---------------- */

$("startBtn").addEventListener("click", async () => {
  if (busy || !photoFile) return;
  busy = true;
  $("startBtn").disabled = true;
  const btnTxt = $("startBtn").querySelector(".cta-txt");
  const oldTxt = btnTxt.textContent;
  btnTxt.textContent = "正在读这张照片…";

  try {
    if (!photoData || !photoData.dataUrl) {
      const dataUrl = await compress(photoFile);
      photoData = { dataUrl, fp: fingerprint(dataUrl), thumb: "" };
    }
    pendingFp = photoData.fp;

    // 1) 同一张图：直接给上次的结果
    const rec = loadRecord(photoData.fp);
    if (rec) { busy = false; btnTxt.textContent = oldTxt; render(rec.result, true); return; }

    // 2) 没付过：先给免费读数，再要 0.98
    if (!unlocked(photoData.fp)) {
      const st = await readImageStats(photoData.dataUrl);
      openPay(st);
      busy = false; btnTxt.textContent = oldTxt;
      $("startBtn").disabled = false;
      return;
    }

    // 3) 已解锁：开跑
    await runAnalysis();
  } catch (e) {
    console.warn("[pet-eyes]", e);
    toast(e.message || "出了点问题，再试一次");
    busy = false; btnTxt.textContent = oldTxt; $("startBtn").disabled = false;
  }
});

async function runAnalysis() {
  show($("modal"), false);
  $("scanImg").src = photoData.dataUrl;
  show($("screenIntro"), false);
  show($("screenResult"), false);
  show($("screenScan"), true);
  window.scrollTo({ top: 0 });
  startScan();
  if (!photoData.thumb) photoData.thumb = await makeThumb(photoData.dataUrl);

  const ep = resolveEndpoint();
  let result = null;

  if (!ep.url || QS.get("demo") === "1") {
    await sleep(5200);
    result = demoResult();
  } else if (quotaLeft() <= 0) {
    stopScan();
    toast("今天的次数用完了，明天再来。");
    show($("screenScan"), false); show($("screenIntro"), true);
    $("startBtn").disabled = false; busy = false;
    return;
  } else {
    quotaUse();
    try {
      result = await withTimeout(callModel(photoData.dataUrl), 60000);
    } catch (err) {
      console.warn("[pet-eyes]", err);
      stopScan();
      toast("模型没接上（" + shortErr(err) + "），检查一下网络再点一次。");
      show($("screenScan"), false); show($("screenIntro"), true);
      $("startBtn").disabled = false; busy = false;
      return;
    }
  }

  stopScan();
  await sleep(120);
  render(result, false);
  saveRecord(result, photoData.thumb);
  renderLastRecord();
  busy = false;
  $("startBtn").disabled = false;
}

function shortErr(e) {
  const m = String((e && e.message) || e);
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "网络或跨域被拦";
  if (/401|403/.test(m)) return "Key 无效";
  if (/429/.test(m)) return "额度或限流";
  if (/timeout/i.test(m)) return "等太久了";
  return m.slice(0, 40);
}

function withTimeout(p, ms) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
}

/* ---------------- 扫描动画 ---------------- */

let scanTimer = null, scanIdx = 0;

function startScan() {
  const ul = $("steps");
  ul.innerHTML = "";
  STEPS.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  setStep(0);
  scanIdx = 0;
  $("scanBar").style.width = "8%";
  clearInterval(scanTimer);
  scanTimer = setInterval(() => {
    if (scanIdx < STEPS.length - 1) setStep(scanIdx + 1);
    $("scanWord").textContent = SCAN_WORDS[(scanIdx + 1) % SCAN_WORDS.length];
    $("scanWord").style.animation = "none";
    void $("scanWord").offsetWidth;
    $("scanWord").style.animation = "fadeUp .5s both";
    $("scanBar").style.width = (10 + (scanIdx + 1) * 17) + "%";
  }, 1000);
}

function setStep(i) {
  scanIdx = i;
  const lis = $("steps").children;
  for (let k = 0; k < lis.length; k++) lis[k].classList.toggle("on", k <= i);
}
function stopScan() {
  clearInterval(scanTimer);
  $("scanBar").style.width = "100%";
  const lis = $("steps").children;
  for (let k = 0; k < lis.length; k++) lis[k].classList.add("on");
}

/* ---------------- 付费抽屉 ---------------- */

function openPay(st) {
  const boxes = readingText(st || { light: 50, warm: 50, calm: 50 });
  $("readings").innerHTML =
    '<div class="reading"><b>' + (st ? st.light : "—") + '</b><span>光</span><em>' + boxes[0] + '</em></div>' +
    '<div class="reading"><b>' + (st ? st.warm : "—") + '</b><span>暖</span><em>' + boxes[1] + '</em></div>' +
    '<div class="reading"><b>' + (st ? st.calm : "—") + '</b><span>静</span><em>' + boxes[2] + '</em></div>';

  $("payPrice").textContent = PRICE;
  $("payPrice2").textContent = PRICE;
  if (CFG.contactText) $("payContact").textContent = CFG.contactText;

  show($("paySheet"), true);
  document.body.style.overflow = "hidden";

  const payImg = $("payImg"), miss = $("payQrMissing");
  if (CFG.payImage) {
    payImg.onload = () => { payImg.hidden = false; miss.hidden = true; };
    payImg.onerror = () => { payImg.hidden = true; miss.hidden = false; };
    payImg.src = CFG.payImage + "?v=" + Date.now();
  } else { payImg.hidden = true; miss.hidden = false; }

  setTimeout(() => $("codeInput").focus(), 300);
}

function closePay() {
  show($("paySheet"), false);
  document.body.style.overflow = "";
}
$("payBg").addEventListener("click", closePay);
$("payClose").addEventListener("click", closePay);

$("codeBtn").addEventListener("click", () => {
  const v = $("codeInput").value;
  const msg = $("codeMsg");
  if (verifyCode(v)) {
    markUnlocked(pendingFp);
    msg.style.color = "#7ED9A8";
    msg.textContent = "解锁成功，它要继续说了…";
    $("codeBtn").disabled = true;
    setTimeout(async () => {
      closePay();
      $("codeBtn").disabled = false;
      $("codeInput").value = "";
      busy = true;
      await runAnalysis();
    }, 600);
  } else {
    msg.style.color = "#E0806A";
    msg.textContent = "这个码对不上，检查一下有没有少字符，或者换个码试试。";
  }
});
$("codeInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("codeBtn").click(); });

/* ---------------- 结果页操作 ---------------- */

$("againBtn").addEventListener("click", () => {
  show($("screenResult"), false);
  show($("screenScan"), false);
  show($("screenIntro"), true);
  show($("dropEmpty"), true);
  show($("dropFilled"), false);
  fileInput.value = "";
  photoFile = null; photoData = null; currentResult = null;
  $("startBtn").disabled = true;
  renderLastRecord();
  window.scrollTo({ top: 0 });
});

$("copyBtn").addEventListener("click", async () => {
  if (!currentResult) return;
  const r = currentResult;
  const name = ($("petName").value || "").trim() || ("我家那只" + $("petKind").value);
  const text = [
    "它说我是「" + r.persona + "」" + (r.personaSub ? "（" + r.personaSub + "）" : ""),
    "“" + r.sweetTalk + "”",
    "",
    "信任 " + r.scores.trust + " · 依赖 " + r.scores.depend + " · 默契 " + r.scores.sync,
    "",
    r.caption,
    "#宠物眼中的你 #我家猫眼中的我 #宠物性格测试 #养猫日常"
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent = "已复制，去小红书发吧 ✓";
    setTimeout(() => { $("copyBtn").textContent = "复制小红书文案"; }, 2400);
  } catch (e) {
    toast("浏览器不让复制，可以长按截图里的文字");
  }
});

/* ---------------- 分享卡 ---------------- */

$("cardBtn").addEventListener("click", async () => {
  if (!currentResult) return;
  await drawCard(currentResult, cardTab);
  show($("modal"), true);
  document.body.style.overflow = "hidden";
});
$("closeBtn").addEventListener("click", closeModal);
$("modalBg").addEventListener("click", closeModal);
function closeModal() { show($("modal"), false); document.body.style.overflow = ""; }

[].forEach.call(document.querySelectorAll(".tab"), (t) => {
  t.addEventListener("click", async () => {
    [].forEach.call(document.querySelectorAll(".tab"), (x) => x.classList.remove("on"));
    t.classList.add("on");
    cardTab = t.dataset.tab;
    if (currentResult) await drawCard(currentResult, cardTab);
    $("cardBtn").querySelector(".cta-txt").textContent =
      cardTab === "moments" ? "生成分享卡（带二维码）" : "生成分享卡（小红书版）";
  });
});

const FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
const SERIF = '"Songti SC","Noto Serif CJK SC","Source Han Serif SC","SimSun",serif';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fitText(ctx, text, maxW, startSize, fontTpl, minSize) {
  let size = startSize;
  ctx.font = fontTpl.replace("{s}", size);
  while (ctx.measureText(text).width > maxW && size > minSize) {
    size -= 2;
    ctx.font = fontTpl.replace("{s}", size);
  }
  return size;
}

function wrapText(ctx, text, x, y, maxW, lineH, font, color, maxLines) {
  ctx.font = font;
  ctx.fillStyle = color;
  const t = String(text);
  let line = "", lines = [];
  for (let i = 0; i < t.length; i++) {
    const test = line + t[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = t[i];
      if (lines.length === maxLines - 1) { line = t.slice(i); break; }
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length;
}

function cardUrl(r) {
  const base = (location.origin && location.origin.indexOf("http") === 0)
    ? location.origin + location.pathname.replace(/index\.html$/, "")
    : "https://chloe-qh.github.io/pet-eyes/";
  return base + "?from=" + photoData.fp + "&p=" + encodeURIComponent(r.persona);
}

function paintQR(ctx, url, x, y, size) {
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount();
  const quiet = 3;
  const cell = size / (n + quiet * 2);
  ctx.fillStyle = "#F6F1E8";
  rr(ctx, x, y, size, size, 14);
  ctx.fill();
  ctx.fillStyle = "#0B0908";
  const ox = x + cell * quiet, oy = y + cell * quiet;
  for (let row = 0; row < n; row += 1) {
    for (let col = 0; col < n; col += 1) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(Math.floor(ox + col * cell), Math.floor(oy + row * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
}

function drawCard(r, tab) {
  return new Promise((resolve) => {
    const cv = $("cardCanvas");
    const ctx = cv.getContext("2d");
    const W = 1080, H = 1440;
    const pal = PALETTE[r.persona] || PALETTE["老友"];
    const accent = pal[1];

    ctx.fillStyle = "#0A0806";
    ctx.fillRect(0, 0, W, H);

    const g1 = ctx.createRadialGradient(W * 0.5, -60, 20, W * 0.5, 300, 600);
    g1.addColorStop(0, hexA(accent, 0.22));
    g1.addColorStop(1, "rgba(10,8,6,0)");
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, 740);

    const g2 = ctx.createRadialGradient(W * 0.5, H + 40, 40, W * 0.5, H - 220, 520);
    g2.addColorStop(0, hexA(accent, 0.12));
    g2.addColorStop(1, "rgba(10,8,6,0)");
    ctx.fillStyle = g2; ctx.fillRect(0, H - 680, W, 680);

    /* 顶部品牌 */
    ctx.textAlign = "left";
    ctx.fillStyle = hexA("#F3EDE4", 0.32);
    ctx.font = "500 20px " + FONT;
    ctx.fillText("PET'S EYES   ·   宠物眼中的你", 84, 94);
    ctx.fillStyle = hexA(accent, 0.55);
    ctx.fillRect(W - 84 - 64, 86, 64, 2);

    /* 人格名 */
    ctx.textAlign = "center";
    const pSize = fitText(ctx, r.persona, W - 180, 104, "{s}px " + FONT, 62);
    ctx.fillStyle = "#FFF3E2";
    ctx.font = "800 " + pSize + "px " + FONT;
    ctx.fillText(r.persona, W / 2, 214);

    ctx.fillStyle = hexA(accent, 0.95);
    ctx.font = "500 25px " + FONT;
    ctx.fillText(r.personaSub, W / 2, 256);

    /* 照片 */
    const fw = 600, fh = 600, fx = (W - fw) / 2, fy = 296;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.72)"; ctx.shadowBlur = 46; ctx.shadowOffsetY = 20;
    ctx.fillStyle = "#171310"; rr(ctx, fx, fy, fw, fh, 18); ctx.fill();
    ctx.restore();

    const img = $("resultImg");
    if (img && img.complete && img.naturalWidth) {
      const ir = img.naturalWidth / img.naturalHeight;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (ir > 1) { sw = img.naturalHeight; sx = (img.naturalWidth - sw) / 2; }
      else { sh = img.naturalWidth; sy = (img.naturalHeight - sh) / 2; }
      ctx.save();
      rr(ctx, fx, fy, fw, fh, 18); ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, fx, fy, fw, fh);
      ctx.restore();
    }
    ctx.strokeStyle = hexA(accent, 0.32); ctx.lineWidth = 2;
    rr(ctx, fx, fy, fw, fh, 18); ctx.stroke();

    /* 三个数 */
    const sy0 = 948;
    const cells = [["信任", r.scores.trust], ["依赖", r.scores.depend], ["默契", r.scores.sync]];
    cells.forEach((c, i) => {
      const x = W / 2 + (i - 1) * 240;
      ctx.textAlign = "center";
      ctx.fillStyle = "#FFF3E2";
      ctx.font = "700 42px " + FONT;
      ctx.fillText(String(c[1]), x, sy0);
      ctx.fillStyle = hexA("#F3EDE4", 0.32);
      ctx.font = "500 21px " + FONT;
      ctx.fillText(c[0], x, sy0 + 34);
    });

    /* 土味情话 */
    ctx.textAlign = "center";

    let tkSize = 40, tkLines = [];
    for (tkSize = 40; tkSize >= 26; tkSize -= 2) {
      ctx.font = "400 " + tkSize + "px " + SERIF;
      tkLines = splitLines(ctx, r.sweetTalk, 660, 2);
      if (tkLines.length <= 2 && tkLines.every((l) => ctx.measureText(l).width <= 662)) break;
    }
    const lineH = tkSize + 18;
    const tkTop = 1076;
    ctx.fillStyle = "#F3EDE4";
    ctx.font = "400 " + tkSize + "px " + SERIF;
    tkLines.forEach((l, i) => ctx.fillText(l, W / 2, tkTop + i * lineH));

    /* 分隔线 */
    ctx.strokeStyle = hexA("#F3EDE4", 0.10); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(84, 1166); ctx.lineTo(W - 84, 1166); ctx.stroke();

    if (tab === "moments") {
      const qs = 150;
      paintQR(ctx, cardUrl(r), W - 84 - qs, 1182, qs);
      ctx.textAlign = "right";
      ctx.fillStyle = hexA("#F3EDE4", 0.42);
      ctx.font = "500 18px " + FONT;
      ctx.fillText("扫码 · 测你家那只", W - 84, 1372);

      ctx.textAlign = "left";
      ctx.fillStyle = "#F3EDE4";
      ctx.font = "600 26px " + FONT;
      ctx.fillText("宠物眼中的你", 84, 1246);
      ctx.fillStyle = hexA("#F3EDE4", 0.38);
      ctx.font = "400 19px " + FONT;
      ctx.fillText("宠物的口吻，人的心", 84, 1278);
    } else {
      ctx.textAlign = "center";
      ctx.fillStyle = "#F3EDE4";
      ctx.font = "600 28px " + FONT;
      ctx.fillText("宠物眼中的你 · PET'S EYES", W / 2, 1246);
      ctx.fillStyle = hexA("#F3EDE4", 0.36);
      ctx.font = "400 19px " + FONT;
      ctx.fillText("评论区第一条有入口 · 也能搜到同款", W / 2, 1280);
    }

    /* 隐形水印：溯源用，肉眼几乎看不见 */
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.026)";
    ctx.font = "300 12px " + FONT;
    ctx.textAlign = "left";
    ctx.fillText("PETSEYE·" + (photoData ? photoData.fp : "") + "·" + HOST, 84, H - 22);
    ctx.restore();

    $("downloadBtn").download = "宠物眼中的你-" + r.persona + ".png";
    resolve();
  });
}

function splitLines(ctx, text, maxW, maxLines) {
  let line = "", lines = [];
  for (let i = 0; i < text.length; i++) {
    const test = line + text[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = text[i];
      if (lines.length === maxLines - 1) { line = text.slice(i); break; }
    } else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function hexA(hex, a) {
  if (!/^#/.test(hex)) return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

$("downloadBtn").addEventListener("click", () => {
  $("downloadBtn").href = $("cardCanvas").toDataURL("image/png");
});

/* ---------------- 光晕跟随 ---------------- */

(function auraFollow() {
  const aura = $("aura");
  if (!aura) return;
  const move = (x, y) => {
    aura.style.transform = "translate(" + (x - window.innerWidth / 2) * 0.35 + "px," + (y - window.innerHeight * 0.3) * 0.35 + "px)";
  };
  window.addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
})();

/* ---------------- 二维码来源落地 ---------------- */

(function fromBanner() {
  const p = QS.get("p");
  if (!p) return;
  const el = document.createElement("div");
  el.style.cssText = "position:relative;z-index:4;max-width:560px;margin:0 auto 0;padding:12px 16px;" +
    "border:1px solid rgba(242,180,106,.3);background:rgba(242,180,106,.08);border-radius:14px;" +
    "font-size:13px;color:#F3EDE4;line-height:1.6;text-align:center";
  el.innerHTML = "你朋友刚从这里测出「<b style='color:#F2B46A'>" + esc(p) + "</b>」<br />现在轮到你了。";
  const inner = document.querySelector(".intro-inner");
  if (inner) inner.insertBefore(el, inner.firstChild);
})();

/* ---------------- 本地预览 / 调试 ---------------- */

(function devHook() {
  if (!/dev=1/.test(location.search)) return;
  if (/qa=1/.test(location.search)) {
    const s = document.createElement("style");
    s.textContent = "*{animation:none!important;transition:none!important}";
    document.head.appendChild(s);
  }
  fetch("assets/sample-cat.jpg").then((r) => r.blob()).then((b) => {
    const f = new File([b], "sample-cat.jpg", { type: "image/jpeg" });
    acceptFile(f);
    $("petName").value = "豆包";
    if (/auto=1/.test(location.search)) {
      setTimeout(() => {
        if (/unlock=1/.test(location.search) || isAdmin) { $("startBtn").click(); }
        else { $("startBtn").click(); }
      }, 200);
    }
  }).catch((e) => console.warn("[dev]", e));
})();

(function debugEntry() {
  if (resolveEndpoint().url) return;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  if (!local && !/dev=1/.test(location.search)) return;
  const link = $("devLink");
  if (!link) return;
  link.hidden = false;
  link.textContent = "演示模式 · 接入模型";
  link.onclick = () => {
    const k = prompt("粘贴 API Key（只存在这台机器，不会上传）");
    if (k && k.trim()) {
      CFG.apiKey = k.trim();
      location.reload();
    }
  };
})();

/* 初始化 */
$("ctaPrice").textContent = "￥" + PRICE + " / 次";
renderLastRecord();
