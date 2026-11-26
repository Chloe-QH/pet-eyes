/**
 * 配置 —— 唯一需要改的文件
 *
 * 一、模型
 *   现在前端直连百炼（Key 就在下面）。站点公开 = Key 公开，这是已知取舍。
 *   被蹭光了就换掉 apiKey，或者以后接一个网关（见 README）。
 *
 * 二、收款
 *   payImage 指向你的收款码图片，放 assets/pay.png。
 *   没有这张图时，页面会提示"收款码还没放进来"，不会崩。
 *
 * 三、兑换码
 *   unlockHashes 是 200 个兑换码的哈希（不是明文）。明文在本地 codes.txt 里，
 *   别把它传到 GitHub，客服发码时从 codes.txt 里复制。
 *   一次性发完想再补：本地跑一遍 codegen 脚本，把新哈希追加进数组即可。
 *
 * 四、防抄
 *   allowedHosts：只允许这些域名跑。别人把你的文件抄走换个域名，页面会直接显示"未授权"。
 *   加了自己的新域名记得写进来。
 */
window.PET_CONFIG = {

  /* ---- 模型 ---- */
  provider: "zhipu",                   // zhipu = 智谱（视觉模型免费，推荐）；dashscope = 百炼（按量付费）
  apiKey: "",                          // 填智谱 Key：open.bigmodel.cn → API Keys（形如 xxxxxxxx.yyyyyyyy）
  endpoint: "",                        // 留空 = 前端直连；填了就走网关
  providers: {
    zhipu: {
      endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      model: "glm-4.6v-flash"          // 免费视觉模型；更准的付费版是 glm-4.6v（1元/百万输入）
    },
    dashscope: {
      endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      model: "qwen3-vl-plus"
    }
  },

  /* ---- 价格与收款 ---- */
  price: "0.98",
  payMode: "after",                    // after = 先把结果跑出来、正文打码、付费解锁（推荐）
                                       // before = 上传后先收费再跑模型
  payImage: "assets/pay.png",          // 你的微信/支付宝收款码
  contactText: "付款后把截图发到小红书私信，看到就回你一个兑换码（几小时内，不用等太久）。",
  autoCodeUrl: "",                     // 有发卡平台（面包多/爱发电/易支付）商品页就填这里，付款后自动拿码

  /* ---- 额度 ---- */
  dailyLimit: 30,                      // 同一台设备每天最多调用模型 30 次（缓存命中不计数）
  freeMode: false,                     // 改成 true = 全场免费（自己压测时用）

  /* ---- 防抄 ---- */
  origin: "chloe-qh.github.io/pet-eyes",
  allowedHosts: [
    "chloe-qh.github.io",
    "localhost",
    "127.0.0.1"
  ],

  /* ---- 兑换码哈希（200 个） ---- */
  unlockHashes: [
    "PXDWJC",
    "1XHAYT8",
    "4V5B4G",
    "TZ6EYE",
    "EHC1FK",
    "1GC8WGK",
    "172AA0",
    "1B0PZHS",
    "1WML8I0",
    "QA2M14",
    "888CNK",
    "76TMDS",
    "1WZ2X5S",
    "V680S9",
    "1KSC9CO",
    "MXA5MV",
    "HMPS8J",
    "1584MHG",
    "OQXXLE",
    "1T9MJ88",
    "D95RF8",
    "1H51JVK",
    "1ISEKEW",
    "T5KEF8",
    "123KBDS",
    "3NURPG",
    "1Q1OUK0",
    "HPR9JW",
    "Y5F2XC",
    "1PQJZLG",
    "1YVXQ1G",
    "1VJRK7E",
    "5I6WTA",
    "I637EK",
    "1NR8YFW",
    "T90NVR",
    "1EXYDTO",
    "TLC0LU",
    "1TML7IS",
    "13LXQC4",
    "1V79BYI",
    "185Y0WS",
    "16R8ZWW",
    "TSITG0",
    "1928UBK",
    "XNUE2G",
    "ZXIYPI",
    "GA6K54",
    "15FWPKC",
    "1N2I1A0",
    "D5L0WG",
    "SD9KK8",
    "7OEGAQ",
    "50WJXK",
    "167VNCG",
    "1IQPSX8",
    "9AGABS",
    "1USLOCK",
    "10CSXYS",
    "1YGZLXG",
    "1Q9H1AW",
    "1D8JN9K",
    "1RFB8IS",
    "1HAB7WO",
    "1WHMZ3W",
    "1M5IEP0",
    "FX28RO",
    "MKIYXD",
    "AL8QZ4",
    "Y712ZK",
    "1B68OGK",
    "7TIMVI",
    "E0ONAW",
    "X41XR8",
    "6T4AE8",
    "1Q84KP8",
    "71EJY4",
    "1RSJUNU",
    "BVJTEG",
    "1SR9GTC",
    "11GOAVK",
    "1ZHF2G",
    "VX5H3N",
    "EHBBXK",
    "1Q3RACY",
    "1CS79N4",
    "1W8IWKW",
    "ZFUEMK",
    "1O4C380",
    "185IYC8",
    "DBZQHR",
    "63WS1C",
    "U6M6L8",
    "1BHO88",
    "MIHATG",
    "1D5ILSJ",
    "122B1LQ",
    "C18U0W",
    "1XKXQEZ",
    "E7JKN8",
    "1IACIOK",
    "DBIMLC",
    "92LIK0",
    "1CAWS1X",
    "XGE3LW",
    "13IOWSE",
    "1ELPF8",
    "10LFC9P",
    "ARTN3A",
    "IWVG3C",
    "1X8VI4K",
    "1XC7E40",
    "13YHWQ3",
    "1TIT3M8",
    "XJWIX5",
    "VZC8GS",
    "HE5KJK",
    "1YZWVRU",
    "11B92AY",
    "17TVMC",
    "MK5HKK",
    "SOPH2O",
    "YI5G63",
    "FABPSD",
    "1FAPY2K",
    "XBFTBH",
    "1QG162C",
    "1FYU6GC",
    "1GZMETG",
    "1VPD4A5",
    "14S05I4",
    "IWBC4O",
    "K4GA4E",
    "1M4X70W",
    "1R0O9XA",
    "15D1PS8",
    "1DASNHW",
    "1H18F58",
    "27YB6G",
    "ECDI08",
    "HKOM20",
    "17JAIK5",
    "179YOGC",
    "1NEC494",
    "PXSV3C",
    "UDU8SA",
    "SZEW08",
    "14RWW20",
    "G4ZD04",
    "98ZDDK",
    "L8J4JK",
    "1BCF6MS",
    "1G8W939",
    "1UPQ3UG",
    "1V4IOAK",
    "12RA4XN",
    "HRJ79W",
    "1ZNH3K",
    "1KPHX7K",
    "78MO4O",
    "3GJX48",
    "XEWSR0",
    "FN1C3O",
    "117VXAW",
    "138U3VQ",
    "1JXUNGK",
    "18W5V8N",
    "X3MK7K",
    "11MQBZ8",
    "1W8YCTC",
    "1CT63WG",
    "BNJY4J",
    "1HBT6H4",
    "CN4BTO",
    "1AQ9CI8",
    "15KCYSK",
    "1I6FJMW",
    "1O4N4SF",
    "12XISS8",
    "1DTO00O",
    "1D51YAW",
    "T1QI2S",
    "V1THT4",
    "IWN2BK",
    "1QBHZ1I",
    "1O5PWG",
    "1KALQXS",
    "1TE8W54",
    "1PDWDMW",
    "JV0W5S",
    "BQE7VS",
    "1L6T85C",
    "YE4V4A",
    "4XU5ZK",
    "Y4P1EJ",
    "QN8JZC",
    "1MFRV2O",
    "1MT6C30",
    "1SXQ4MI",
    "1BP71CG"
  ]
};
