/* ==========================================================
   慈恩園 前台雛形 共用工具（Alpine.js 3）
   載入順序：mock.js → common.js → alpine（defer）
   ========================================================== */

window.ZN = window.ZN || {};

/** 民國日期：Date | 'YYYY-MM-DD' → '115/11/03' */
ZN.roc = function (d) {
  if (!d) return '-';
  const dt = typeof d === 'string' ? new Date(d.replace(/-/g, '/')) : d;
  if (isNaN(dt)) return d;
  const y = dt.getFullYear() - 1911;
  const p = n => String(n).padStart(2, '0');
  return `${y < 1 ? '民國前' + (1 - y) : y}/${p(dt.getMonth() + 1)}/${p(dt.getDate())}`;
};
/** 民國日期（中文）：'115 年 11 月 3 日' */
ZN.rocLong = function (d) {
  if (!d) return '-';
  const dt = typeof d === 'string' ? new Date(d.replace(/-/g, '/')) : d;
  return `民國 ${dt.getFullYear() - 1911} 年 ${dt.getMonth() + 1} 月 ${dt.getDate()} 日`;
};
ZN.money = n => (n == null ? '-' : 'NT$ ' + Number(n).toLocaleString('zh-TW'));
ZN.today = () => new Date();

/** 個資遮罩：王小明 → 王○明；A123456789 → A12****789；0912345678 → 0912***678 */
ZN.maskName = s => !s ? '-' : s.length <= 2 ? s[0] + '○' : s[0] + '○'.repeat(s.length - 2) + s[s.length - 1];
ZN.maskId = s => !s ? '-' : s.slice(0, 3) + '****' + s.slice(-3);
ZN.maskPhone = s => !s ? '-' : s.slice(0, 4) + '***' + s.slice(-3);

/** 狀態 → 徽章顏色（對齊後台 5.0 通用元件） */
ZN.badge = function (status) {
  const map = {
    '待辦理': 'yellow', '辦理中': 'gray', '已完成': 'green', '已作廢': 'red',
    '待會計審核': 'purple', '待文件交付': 'blue', '待領取': 'blue', '已簽收': 'green',
    '未使用': 'gray', '使用中': 'green', '已預約': 'blue', '已遷出': 'red',
    '已繳費': 'green', '待繳費': 'yellow', '逾期未繳': 'red', '對帳中': 'purple',
    '報名成功': 'green', '待付款': 'yellow', '已取消': 'red', '已額滿': 'red', '報名中': 'blue', '已截止': 'gray',
    '有效': 'green', '已失效': 'red', '待綁定': 'yellow', '已啟用': 'green',
  };
  return 'zn-badge zn-badge-' + (map[status] || 'gray');
};

/* ---------- 全域 Toast ---------- */
document.addEventListener('alpine:init', () => {
  Alpine.store('toast', {
    items: [],
    show(msg, type = 'success') {
      const id = Date.now() + Math.random();
      this.items.push({ id, msg, type });
      setTimeout(() => (this.items = this.items.filter(i => i.id !== id)), 2800);
    },
  });

  /* ---------- 簽名板：<canvas x-data="signPad()" ...> ---------- */
  Alpine.data('signPad', (key = 'sign') => ({
    drawing: false, hasInk: false, ctx: null,
    init() {
      const c = this.$el.tagName === 'CANVAS' ? this.$el : this.$el.querySelector('canvas');
      this.canvas = c;
      const fit = () => {
        const r = c.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        c.width = r.width * ratio; c.height = r.height * ratio;
        this.ctx = c.getContext('2d');
        this.ctx.scale(ratio, ratio);
        this.ctx.lineWidth = 3; this.ctx.lineCap = 'round'; this.ctx.lineJoin = 'round'; this.ctx.strokeStyle = '#0f172a';
        this.hasInk = false;
      };
      this.$nextTick(fit);
      const pos = e => { const r = c.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return [t.clientX - r.left, t.clientY - r.top]; };
      const start = e => { e.preventDefault(); this.drawing = true; const [x, y] = pos(e); this.ctx.beginPath(); this.ctx.moveTo(x, y); };
      const move = e => { if (!this.drawing) return; e.preventDefault(); const [x, y] = pos(e); this.ctx.lineTo(x, y); this.ctx.stroke(); if (!this.hasInk) { this.hasInk = true; this.$dispatch('signed', { key, value: true }); } };
      const end = () => (this.drawing = false);
      c.addEventListener('mousedown', start); c.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
      c.addEventListener('touchstart', start, { passive: false }); c.addEventListener('touchmove', move, { passive: false }); c.addEventListener('touchend', end);
    },
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.hasInk = false; this.$dispatch('signed', { key, value: false });
    },
  }));
});

/* ---------- 模擬相機拍照（雛形用：產生示意圖） ---------- */
ZN.fakePhoto = function (label = '拍攝影像', color = '#61b0db') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
    <rect width="480" height="320" fill="#f1f5f9"/>
    <rect x="24" y="24" width="432" height="272" rx="16" fill="#fff" stroke="${color}" stroke-width="3" stroke-dasharray="10 8"/>
    <circle cx="240" cy="140" r="46" fill="none" stroke="${color}" stroke-width="5"/>
    <circle cx="240" cy="140" r="18" fill="${color}"/>
    <text x="240" y="236" font-size="24" text-anchor="middle" fill="#334155" font-family="Microsoft JhengHei">${label}</text>
    <text x="240" y="268" font-size="16" text-anchor="middle" fill="#94a3b8" font-family="Microsoft JhengHei">（雛形示意圖）</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

/** 模擬印鑑圖 */
ZN.fakeSeal = function (text = '王小明印', color = '#c0262d') {
  const chars = text.replace(/\s/g, '').slice(0, 4).padEnd(4, '印').split('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
    <rect width="220" height="220" fill="#fff"/>
    <rect x="30" y="30" width="160" height="160" rx="8" fill="none" stroke="${color}" stroke-width="9"/>
    <g font-family="DFKai-SB, BiauKai, KaiTi, serif" font-size="62" fill="${color}" text-anchor="middle" font-weight="700">
      <text x="148" y="100">${chars[0]}</text><text x="148" y="172">${chars[1]}</text>
      <text x="72" y="100">${chars[2]}</text><text x="72" y="172">${chars[3]}</text>
    </g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

/** 簡易 QR 示意圖（非真實 QR，雛形用；以字串雜湊產生固定圖樣） */
ZN.fakeQR = function (seed = 'ZION', size = 25) {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296);
  const cell = 8, pad = 16, w = size * cell + pad * 2;
  let rects = '';
  const finder = (x, y) => {
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      const on = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
      if (on) rects += `<rect x="${pad + (x + i) * cell}" y="${pad + (y + j) * cell}" width="${cell}" height="${cell}"/>`;
    }
  };
  const inFinder = (i, j) => (i < 8 && j < 8) || (i >= size - 8 && j < 8) || (i < 8 && j >= size - 8);
  for (let i = 0; i < size; i++) for (let j = 0; j < size; j++)
    if (!inFinder(i, j) && rnd() > 0.52) rects += `<rect x="${pad + i * cell}" y="${pad + j * cell}" width="${cell}" height="${cell}"/>`;
  finder(0, 0); finder(size - 7, 0); finder(0, size - 7);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" viewBox="0 0 ${w} ${w}"><rect width="${w}" height="${w}" fill="#fff"/><g fill="#0f172a">${rects}</g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
