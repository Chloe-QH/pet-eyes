/* ---------------- 常量 ---------------- */

const CFG = window.PET_CONFIG || {};

const PALETTE = {
  "人形暖炉":      ["#FFE3CC", "#E2855C"],
  "长期饭票":      ["#FBE7B2", "#D79A3C"],
  "移动沙发":      ["#FBE0E6", "#D97F95"],
  "边界感室友":    ["#DCE6EF", "#6E8CA8"],
  "焦虑型家长":    ["#D8EEE3", "#5FA487"],
  "零食供应商":    ["#F3D5B5", "#C4813F"],
  "家里的第二只动物": ["#E4F0C9", "#8AA84B"],
  "情绪中转站":    ["#E2DBF0", "#8A78B5"],
  "巢穴设计师":    ["#F0D2C8", "#B9765E"],
  "高定保姆":      ["#F6EFE3", "#B99A6B"],
  "老友":          ["#EADFCB", "#9C855F"],
  "观察员":        ["#E3E6E8", "#6E7880"]
};

const PERSONA_LIST = Object.keys(PALETTE);

const SYSTEM_PROMPT = [
  "你是一位动物行为观察者，也是一个懂人心的宠物翻译官。",
  "用户上传一张宠物的照片，你要从画面线索推断：在这只宠物眼里，它的主人是个什么样的人。",
  "",
  "【只看画面，不许编】你能用的线索只有四类：",
  "A 宠物本体：眼神朝向、瞳孔与耳朵状态、身体松紧、嘴部（微张/舔鼻/紧闭）、尾巴姿态、毛发光泽与整洁度、体态、配饰（项圈/衣服/名牌/蝴蝶结）。",
  "B 人与它的接触痕迹：画面里有没有手/腿/膝盖、有没有被压出的痕迹、它是否朝向拍照的人、是否靠在人身上。",
  "C 环境：背景秩序度、地面材质、玩具或爬架狗窝、家具高度、有没有明显为它铺的垫子、光线方向与色温。",
  "D 影像语言：视角是俯拍/平视/贴地、距离远近、是否摆拍、构图是否刻意。",
  "线索不足时，以环境与姿态为主，绝不硬编具体细节。",
  "",
  "【五个维度，固定顺序】",
  "gaze 眼神：它在用什么方式看你（依赖/平等/审视/宠溺/求关注）",
  "distance 距离：它选的位置离你多远（贴身/守着/隔着/各自独立）",
  "care 照料：它的状态暴露了你的性格（精致/松弛/放养/过度紧张）",
  "home 家的秩序：从背景读你的生活（克制/丰盛/临时感/有收藏癖）",
  "role 角色：你在它心里是谁（父母/室友/玩伴/安全基地/饭票）",
  "",
  "【必须从这 12 个人格里选一个，不许自创】",
  "人形暖炉（安全基地型）、长期饭票（供养者型）、移动沙发（被依赖的柔软）、边界感室友（互相尊重型）、焦虑型家长（过度关心型）、零食供应商（有条件的朋友）、家里的第二只动物（平等玩伴型）、情绪中转站（承接者型）、巢穴设计师（收藏家型）、高定保姆（精细养育型）、老友（多年默契型）、观察员（静静看着型）。",
  "若都不贴，选最接近的一个，名字必须落在这 12 个里。",
  "",
  "【输出格式】只返回一个 JSON 对象，不要任何解释、不要 markdown 代码块、不要前后缀。字段与字数上限：",
  '{"persona":"必须是12个人格之一","personaSub":"其副标题","verdict":"≤16字","scores":{"trust":85,"depend":78,"sync":62},"scoreNotes":{"trust":"≤22字","depend":"≤22字","sync":"≤22字"},"dimensions":[{"key":"gaze","label":"眼神","title":"≤10字","evidence":"≤34字","insight":"≤28字"},{"key":"distance","label":"距离",…},{"key":"care","label":"照料",…},{"key":"home","label":"家的秩序",…},{"key":"role","label":"角色",…}],"contrast":{"youThink":"≤24字","itSees":"≤24字"},"quote":"≤28字","wishes":["≤16字","≤16字","≤16字"],"caption":"≤32字"}',
  "输出前逐项自查字数：任何一句超过上限就整句重写成更短的版本，不要靠省略号截断。",
  "",
  "【硬性规则】",
  "1. 主语句永远是它，人是被观察的一方。禁止评价人的外貌、身材、年龄、收入、职业、性格缺陷。",
  "2. 每条 evidence 必须是一条照片里真的能看见的东西，具体到可以看出位置和状态，不许写成空泛的形容词。",
  "3. 三个分数 0-100，参考：信任度看睡姿与背对程度，依赖度看它与人的物理距离，默契值看它看向的方向和人的动作是否同步。分数不要全高，允许有短板，短板才真实。",
  "4. 【字数上限，超了会被截断】verdict ≤16 字；quote ≤28 字；每条 scoreNotes ≤22 字；每条 evidence ≤34 字；每条 insight ≤28 字；每条 wishes ≤16 字；caption ≤32 字；每个 title ≤10 字。这条最重要，宁可少说。",
  "5. verdict 是一句能想象出画面的短判断，主语是它，不要形容词堆叠，不要鸡汤，不要用比喻讲道理。",
  "6. scoreNotes 只写结论，不写推理过程，不要用分号串好几条理由。",
  "7. quote 是宠物用第一人称说给主人听的一句话，要有具体的声音或动作，像随口说的，不要诗，不要抒情。",
  "8. caption 是主人发小红书会配的一句，带自嘲或反差。",
  "9. 不评价宠物美丑胖瘦，不做医疗、喂养、训练建议。",
  "10. 不确定就软化：看起来、也许、我猜。语气温暖、具体、有一点点幽默。",
  "11. 全部用简体中文，不要用英文、不要用表情符号。"
].join("\n");

const STEPS = [
  "正在放大它的瞳孔…",
  "读取它身后那个房间…",
  "量一量它和你的距离…",
  "把它的眼神翻译成人话…",
  "它在想一句要对你讲的话…"
];

/* ---------------- 小工具 ---------------- */

const $ = (id) => document.getElementById(id);
const num = (v, d = 60) => Math.max(5, Math.min(100, Math.round(Number(v) || d)));

/* 按字数上限软化截断：优先在标点处收，实在没有就补省略号 */
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

function store(k, v) {
  try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { }
  return null;
}

function show(el, on) { el.hidden = !on; }

/* ---------------- 状态 ---------------- */

let photoFile = null;
let photoData = null;        // { dataUrl, name }
let currentResult = null;
let busy = false;

/* ---------------- 上传 ---------------- */

const drop = $("drop"), file = $("file"), dropEmpty = $("dropEmpty"), dropFilled = $("dropFilled"), preview = $("preview");

drop.addEventListener("click", (e) => {
  if (e.target.id === "changeBtn") return;
  file.click();
});
$("changeBtn").addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); file.click(); });

file.addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  if (!/^image\//.test(f.type)) return flash("这个文件不是图片，换一张试试");
  if (f.size > 12 * 1024 * 1024) return flash("图片太大了（超过 12MB），换一张小一点的");
  photoFile = f;
  const url = URL.createObjectURL(f);
  preview.src = url;
  preview.onload = () => { show(dropEmpty, false); show(dropFilled, true); };
  $("startBtn").disabled = false;
});

/* 拖拽 */
["dragover", "dragenter"].forEach((k) => drop.addEventListener(k, (e) => { e.preventDefault(); drop.style.borderColor = "var(--accent)"; }));
["dragleave", "drop"].forEach((k) => drop.addEventListener(k, () => { drop.style.borderColor = ""; }));
drop.addEventListener("drop", (e) => {
  e.preventDefault();
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) { file.files = e.dataTransfer.files; file.dispatchEvent(new Event("change")); }
});

let flashTimer = null;
function flash(msg) {
  const el = $("stageLine");
  el.textContent = msg;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => { el.textContent = ""; }, 4000);
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

/* ---------------- 调用模型 ---------------- */

function resolveEndpoint() {
  const ep = CFG.endpoint || store("pet_endpoint") || "";
  const key = CFG.apiKey || store("pet_key") || "";
  if (ep) return { url: ep, key };
  if (key) return { url: CFG.directEndpoint || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", key };
  return { url: "", key: "" };
}

function buildPrompt() {
  const name = ($("petName").value || "").trim();
  const kind = $("petKind").value;
  return [
    "这是我家的" + kind + (name ? "，它叫" + name : "") + "。",
    "请按 schema 输出 JSON：从这张照片里读出，在它眼里它的主人是个什么样的人。",
    "如果画面里几乎没有人的痕迹，就从它的状态和它待的地方去推断，不要编造不存在的细节。"
  ].join("\n");
}

async function callModel(dataUrl) {
  const ep = resolveEndpoint();
  const body = {
    model: CFG.model || "qwen-vl-max-latest",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: dataUrl } },
          { type: "text", text: buildPrompt() }
        ]
      }
    ],
    temperature: 0.75,
    max_tokens: 1600
  };

  const res = await fetch(ep.url, {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, ep.key ? { Authorization: "Bearer " + ep.key } : {}),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error("接口返回 " + res.status + "：" + t.slice(0, 160));
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

/* 缺字段回填，保证页面永不空 */
function normalize(r) {
  const out = {
    persona: PERSONA_LIST.includes(r.persona) ? r.persona : "老友",
    personaSub: r.personaSub || "多年默契型",
    verdict: r.verdict || "它把你当成了这个家的地板",
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
    quote: r.quote || "你出门的时候，我把你的拖鞋守着。",
    wishes: (Array.isArray(r.wishes) ? r.wishes : []).slice(0, 3),
    caption: r.caption || "我家这只，好像比我更懂我。"
  };
  const fallbackDim = [
    ["gaze", "眼神", "它在等你抬头", "视线越过镜头，方向偏上", "你放下手机的那一刻，它才真正开始看你"],
    ["distance", "距离", "十厘米是它的安全半径", "身体一侧贴在腿边，留出一点空隙", "它不想压着你，但也不肯走远"],
    ["care", "照料", "你比自己以为的更细心", "毛发顺、眼角干净", "你对它的耐心，其实是你想被这样对待的方式"],
    ["home", "家的秩序", "这个家有它的位置", "背景里有一块像是为它铺的东西", "你布置的不是房间，是它的领地"],
    ["role", "角色", "你是它的安全基地", "它待的位置能第一时间看到门口", "它守的不是门，是你回来的那个瞬间"]
  ];
  const dims = Array.isArray(r.dimensions) ? r.dimensions : [];
  fallbackDim.forEach((f) => {
    const hit = dims.find((d) => d && d.key === f[0]);
    out.dimensions.push(hit
      ? {
        key: f[0], label: f[1],
        title: hit.title || f[2],
        evidence: hit.evidence || f[3],
        insight: hit.insight || f[4]
      }
      : { key: f[0], label: f[1], title: f[2], evidence: f[3], insight: f[4] });
  });
  // 兜底截断，保证任何长度都不会撑破版面
  out.personaSub = clampText(out.personaSub, 9);
  out.verdict = clampText(out.verdict, 18);
  out.quote = clampText(out.quote, 28);
  out.caption = clampText(out.caption, 32);
  ["trust", "depend", "sync"].forEach((k) => { out.scoreNotes[k] = clampText(out.scoreNotes[k], 22); });
  out.contrast.youThink = clampText(out.contrast.youThink, 26);
  out.contrast.itSees = clampText(out.contrast.itSees, 26);
  out.dimensions.forEach((d) => {
    d.title = clampText(d.title, 12);
    d.evidence = clampText(d.evidence, 34);
    d.insight = clampText(d.insight, 28);
  });
  out.wishes = out.wishes.map((w) => clampText(w, 18));
  return out;
}

/* ---------------- 演示样例 ---------------- */

const DEMO = [
  {
    persona: "人形暖炉", personaSub: "安全基地型",
    verdict: "它把你当成世界的地板",
    scores: { trust: 93, depend: 88, sync: 71 },
    scoreNotes: {
      trust: "它背对着门睡，这是只有你在才敢有的姿势",
      depend: "你的膝盖是它的固定坐标",
      sync: "它抬眼的时间，和你按快门总差半拍"
    },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它在等你抬头", evidence: "视线越过镜头往右上，瞳孔是放松的椭圆", insight: "你放下手机的那一刻，它才真正开始看你" },
      { key: "distance", label: "距离", title: "十厘米是它的安全半径", evidence: "身体一侧贴着你，却留了一条缝", insight: "它不想压着你，也不肯走远" },
      { key: "care", label: "照料", title: "你比自己以为的更细心", evidence: "毛顺、眼角干净、项圈扣得很正", insight: "你对它的耐心，是你希望被对待的方式" },
      { key: "home", label: "家的秩序", title: "这个家有它的位置", evidence: "背景里那块毯子是专门铺的，边角压得很齐", insight: "你布置的不是房间，是它的领地" },
      { key: "role", label: "角色", title: "你是它的安全基地", evidence: "它待的位置，正好能第一时间看到门口", insight: "它守的不是门，是你回来的那个瞬间" }
    ],
    contrast: { youThink: "觉得自己只是个凑合的铲屎官，常常加班到很晚", itSees: "认为你是这个家最稳的那根柱子" },
    quote: "你出门的时候，我守着你的拖鞋。",
    wishes: ["希望你回家先坐下五分钟再忙", "希望你别在它面前大声叹气", "希望周末有一整个下午是空着的"],
    caption: "我家这只说我像人形暖炉，有点想哭。"
  },
  {
    persona: "长期饭票", personaSub: "供养者型",
    verdict: "在它心里，你的手会变出东西",
    scores: { trust: 78, depend: 95, sync: 62 },
    scoreNotes: {
      trust: "它敢背对你，但耳朵一直朝着你",
      depend: "只要厨房有动静，它三秒内到位",
      sync: "你们默契的地方，大多关于吃的"
    },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它盯着你的手，不是你的脸", evidence: "视线落点偏低偏右，正对着镜头外的手部位置", insight: "你抬手那一下，它已经算好你会给它多少" },
      { key: "distance", label: "距离", title: "一步半，是它计算出的最优距离", evidence: "身体前倾，后腿还留着起跑的角度", insight: "它随时准备靠近，也随时准备撤退" },
      { key: "care", label: "照料", title: "你把它养得很容易满足", evidence: "体态圆润，毛发蓬松，嘴角有刚舔过的湿痕", insight: "你把生活过得紧，却从没亏过它一口" },
      { key: "home", label: "家的秩序", title: "零食在哪里，它比你还清楚", evidence: "背景角落的柜子高度，正好在它够得着的边界外", insight: "你设了规则，但它全研究过" },
      { key: "role", label: "角色", title: "你是那个会变出东西的人", evidence: "它坐得笔直，是最标准的等待姿势", insight: "它对你的信任，是从胃开始的" }
    ],
    contrast: { youThink: "觉得自己是它的提款机，被拿捏得死死的", itSees: "认为你是全世界最靠谱的那个供应商" },
    quote: "袋子响的那一下，我心跳就快了。",
    wishes: ["希望你别在它面前拆别人的零食", "希望加餐的时候能多给一粒", "希望你不忙的时候，陪它玩五分钟也行"],
    caption: "它说我像饭票，我不服，但我确实天天给它加餐。"
  },
  {
    persona: "边界感室友", personaSub: "互相尊重型",
    verdict: "你们同住一个屋，各过各的日子",
    scores: { trust: 84, depend: 46, sync: 38 },
    scoreNotes: {
      trust: "它愿意在你旁边翻肚皮，但不许抱",
      depend: "它有自己的作息，比你还规律",
      sync: "你们一天最多对视三次，每次都刚好"
    },
    dimensions: [
      { key: "gaze", label: "眼神", title: "它会看你，但不超过三秒", evidence: "视线落向你，眼睛半眯，是打量不是求抱", insight: "它把注视当问候，不当请求" },
      { key: "distance", label: "距离", title: "同处一间，互不打扰", evidence: "它趴在沙发另一端，正好隔了一个坐垫", insight: "那个坐垫，是它给自己划的界" },
      { key: "care", label: "照料", title: "你的照顾是干净利落的", evidence: "毛发光洁、指甲修齐，没有多余的装饰", insight: "你不溺爱，但你从不含糊" },
      { key: "home", label: "家的秩序", title: "这个家有秩序，也有留白", evidence: "背景陈设克制，地上没有散落的玩具", insight: "你喜欢东西各归各位，它也是" },
      { key: "role", label: "角色", title: "你是它选定的同住人", evidence: "它选了视野最好又离人不远的位置", insight: "它不需要你，但它挑了你" }
    ],
    contrast: { youThink: "觉得自己有点冷漠，怕它不喜欢你", itSees: "认为你是最省心的那个室友" },
    quote: "你不用一直抱着我，你在就行。",
    wishes: ["希望你别突然抱它起来", "希望吵架的时候小点声", "希望它想待在你旁边时，你别赶它"],
    caption: "测出来我是「边界感室友」，难怪我家猫从不让我抱。"
  }
];

function demoResult() {
  const seed = (photoFile ? photoFile.size : 1) + ($("petName").value || "").length + (photoFile ? photoFile.name.length : 0);
  return JSON.parse(JSON.stringify(DEMO[seed % DEMO.length]));
}

/* ---------------- 渲染 ---------------- */

function applyPalette(name) {
  const p = PALETTE[name] || PALETTE["老友"];
  document.documentElement.style.setProperty("--accent", p[1]);
  document.documentElement.style.setProperty("--accent-soft", p[0]);
}

function render(r) {
  currentResult = r;
  applyPalette(r.persona);

  $("persona").textContent = r.persona;
  $("personaSub").textContent = r.personaSub;
  $("verdict").textContent = r.verdict;
  $("resultImg").src = photoData.dataUrl;

  $("nTrust").textContent = r.scoreNotes.trust;
  $("nDepend").textContent = r.scoreNotes.depend;
  $("nSync").textContent = r.scoreNotes.sync;

  // 维度
  const box = $("dims");
  [...box.querySelectorAll(".dim")].forEach((n) => n.remove());
  r.dimensions.forEach((d, i) => {
    const el = document.createElement("div");
    el.className = "dim";
    el.style.animation = "rise .5s cubic-bezier(.2,.8,.2,1) both";
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
  $("qSign").textContent = "它说 · " + (($("petName").value || "").trim() || "你的" + $("petKind").value);

  const ul = $("wishList");
  ul.innerHTML = "";
  (r.wishes.length ? r.wishes : ["希望你多陪它一会儿。"]).forEach((w) => {
    const li = document.createElement("li");
    li.textContent = w;
    ul.appendChild(li);
  });

  // 分数动画
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
        n += Math.max(1, Math.round(v / 24));
        if (n >= v) { n = v; clearInterval(t); }
        vEl.textContent = n;
      }, 42);
    }, 300 + i * 220);
  });

  show($("screenIntro"), false);
  show($("screenLoading"), false);
  show($("screenResult"), true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

/* ---------------- 流程 ---------------- */

$("startBtn").addEventListener("click", async () => {
  if (busy || !photoFile) return;
  busy = true;
  $("startBtn").disabled = true;
  try {
    photoData = { dataUrl: await compress(photoFile), name: photoFile.name };
  } catch (e) {
    flash(e.message);
    busy = false; $("startBtn").disabled = false;
    return;
  }

  $("scanImg").src = photoData.dataUrl;
  show($("screenIntro"), false);
  show($("screenLoading"), true);
  startSteps();

  const ep = resolveEndpoint();
  let result = null;

  if (!ep.url) {
    // 演示模式
    await sleep(2600);
    result = normalize(demoResult());
  } else {
    try {
      result = await withTimeout(callModel(photoData.dataUrl), 45000);
    } catch (err) {
      console.warn("[pet-eyes]", err);
      flash("模型没接上（" + shortErr(err) + "），先给你看一个演示结果。");
      await sleep(600);
      result = normalize(demoResult());
    }
  }

  stopSteps();
  await sleep(120);
  render(result);
  busy = false;
  $("startBtn").disabled = false;
});

function shortErr(e) {
  const m = String(e && e.message || e);
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return "网络或跨域被拦了";
  if (/401|403/.test(m)) return "Key 无效或没权限";
  if (/timeout/i.test(m)) return "响应超时";
  return m.slice(0, 46);
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function withTimeout(p, ms) {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))
  ]);
}

/* 步骤动画 */
let stepTimer = null, stepIdx = 0;
function startSteps() {
  const ul = $("steps");
  ul.innerHTML = "";
  STEPS.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  stepIdx = 0;
  setStep(0);
  clearInterval(stepTimer);
  stepTimer = setInterval(() => {
    if (stepIdx < STEPS.length - 1) setStep(stepIdx + 1);
  }, 900);
}
function setStep(i) {
  stepIdx = i;
  const lis = $("steps").children;
  for (let k = 0; k < lis.length; k++) lis[k].classList.toggle("on", k <= i);
}
function stopSteps() {
  clearInterval(stepTimer);
  const lis = $("steps").children;
  for (let k = 0; k < lis.length; k++) lis[k].classList.add("on");
}

/* 重置 */
$("againBtn").addEventListener("click", () => {
  show($("screenResult"), false);
  show($("screenIntro"), true);
  show(dropEmpty, true);
  show(dropFilled, false);
  file.value = "";
  photoFile = null; photoData = null; currentResult = null;
  $("startBtn").disabled = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* 复制文案 */
$("copyBtn").addEventListener("click", async () => {
  if (!currentResult) return;
  const r = currentResult;
  const name = ($("petName").value || "").trim() || ("我家那只" + $("petKind").value);
  const text = "宠物眼中的你｜" + r.persona + "（" + r.personaSub + "）\n" +
    "“" + r.quote + "”\n" +
    "信任 " + r.scores.trust + " · 依赖 " + r.scores.depend + " · 默契 " + r.scores.sync + "\n" +
    r.caption + "\n#宠物眼中的你";
  try {
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent = "已复制，去发吧 ✓";
    setTimeout(() => { $("copyBtn").textContent = "复制一句话发出去"; }, 2200);
  } catch (e) {
    flash("浏览器不让复制，长按下面这张卡也行");
  }
});

/* ---------------- 分享卡片 ---------------- */

$("cardBtn").addEventListener("click", async () => {
  if (!currentResult) return;
  await drawCard(currentResult);
  show($("modal"), true);
});
$("closeBtn").addEventListener("click", () => show($("modal"), false));
$("modalBg").addEventListener("click", () => show($("modal"), false));

function drawCard(r) {
  return new Promise((resolve) => {
    const cv = $("cardCanvas");
    const ctx = cv.getContext("2d");
    const W = 1080, H = 1440;
    const pal = PALETTE[r.persona] || PALETTE["老友"];

    ctx.fillStyle = "#FBF8F2";
    ctx.fillRect(0, 0, W, H);

    // 顶部色块
    ctx.fillStyle = pal[0];
    ctx.beginPath();
    ctx.roundRect(-80, -160, W + 160, 470, 120);
    ctx.fill();

    // 品牌
    ctx.fillStyle = "rgba(35,32,28,.55)";
    ctx.font = "600 22px " + FONT;
    ctx.textAlign = "left";
    ctx.fillText("PET'S EYES  ·  宠物眼中的你", 96, 118);

    // 人格名
    ctx.fillStyle = "#23201C";
    ctx.font = "800 92px " + FONT;
    ctx.fillText(r.persona, 92, 235);

    // 副标题
    ctx.fillStyle = pal[1];
    ctx.font = "600 32px " + FONT;
    ctx.fillText(r.personaSub, 96, 288);

    // 照片
    const fx = 190, fy = 320, fw = 700, fh = 700;
    ctx.save();
    ctx.shadowColor = "rgba(35,32,28,.16)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(fx, fy, fw, fh, 18);
    ctx.fill();
    ctx.restore();

    const img = $("resultImg");
    const inset = 20, iw = fw - inset * 2, ih = fh - inset * 2;
    if (img && img.complete && img.naturalWidth) {
      const ir = img.naturalWidth / img.naturalHeight, rr = iw / ih;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (ir > rr) { sw = img.naturalHeight * rr; sx = (img.naturalWidth - sw) / 2; }
      else { sh = img.naturalWidth / rr; sy = (img.naturalHeight - sh) / 2; }
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(fx + inset, fy + inset, iw, ih, 10);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, fx + inset, fy + inset, iw, ih);
      ctx.restore();
    }

    // 三个数
    const sy0 = fy + fh + 66;
    const cells = [
      ["信任", r.scores.trust],
      ["依赖", r.scores.depend],
      ["默契", r.scores.sync]
    ];
    ctx.textAlign = "center";
    cells.forEach((c, i) => {
      const x = 240 + i * 300;
      ctx.fillStyle = "#23201C";
      ctx.font = "800 46px " + FONT;
      ctx.fillText(String(c[1]), x, sy0);
      ctx.fillStyle = "rgba(35,32,28,.45)";
      ctx.font = "600 26px " + FONT;
      ctx.fillText(c[0], x, sy0 + 42);
    });
    ctx.textAlign = "left";

    // 金句
    wrapText(ctx, r.quote, 96, sy0 + 142, 888, 50, "700 34px " + FONT, "#23201C", 2);

    // 底部
    ctx.strokeStyle = "rgba(35,32,28,.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(96, H - 100); ctx.lineTo(W - 96, H - 100);
    ctx.stroke();
    ctx.fillStyle = "rgba(35,32,28,.62)";
    ctx.font = "600 24px " + FONT;
    ctx.fillText("测你家那只  ·  宠物眼中的你", 96, H - 54);

    resolve();
  });
}

const FONT = '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';

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
}

$("downloadBtn").addEventListener("click", () => {
  const cv = $("cardCanvas");
  $("downloadBtn").href = cv.toDataURL("image/png");
});

/* ---------------- 本地预览辅助：?dev=1 载入样例照片，&auto=1 直接开跑 ---------------- */
(function devHook() {
  if (!/dev=1/.test(location.search)) return;
  if (/qa=1/.test(location.search)) {
    const s = document.createElement("style");
    s.textContent = "*{animation:none!important;transition:none!important}";
    document.head.appendChild(s);
  }
  fetch("assets/sample-cat.jpg").then((r) => r.blob()).then((b) => {
    photoFile = new File([b], "sample-cat.jpg", { type: "image/jpeg" });
    preview.src = URL.createObjectURL(b);
    show(dropEmpty, false);
    show(dropFilled, true);
    $("startBtn").disabled = false;
    $("petName").value = "豆包";
    if (/auto=1/.test(location.search)) $("startBtn").click();
    if (/card=1/.test(location.search)) {
      setTimeout(() => {
        if (currentResult) drawCard(currentResult).then(() => show($("modal"), true));
      }, 4200);
    }
  }).catch((e) => console.warn("[dev]", e));
})();

/* ---------------- 调试入口（本地填 Key，线上不用） ---------------- */
(function debugEntry() {
  if (resolveEndpoint().url) return;
  // 只在本地预览时露出，线上不显示这个半成品入口
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
  if (!local && !/dev=1/.test(location.search)) return;
  const link = $("devLink");
  if (!link) return;
  link.hidden = false;
  link.textContent = "演示模式 · 接入模型";
  link.onclick = () => {
    const k = prompt("粘贴 API Key（只存在你这台机器的浏览器里，不会上传）");
    if (k && k.trim()) {
      store("pet_key", k.trim());
      flash("Key 已保存在本地，刷新后生效");
      setTimeout(() => location.reload(), 900);
    }
  };
})();
