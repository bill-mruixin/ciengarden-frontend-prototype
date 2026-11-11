/* ==========================================================
   慈恩園 前台雛形 模擬資料（依後台規格書用語）
   來源：5.3.1 申請單總覽、5.7 系統設定（規費）、10_附錄（權狀編號規則、代碼）
   注意：人名、身分證、電話皆為虛構
   ========================================================== */

window.ZN = window.ZN || {};

/* ---------- 申請項目（異動手續）與規費 ----------
   scope：適用產品 T=塔位 L=蓮位 C=禮儀
   fee：規費（元）；feeRule：計費說明
   docs：需拍照上傳之證明文件
   needSign：完成後需「資料領取與簽收」
   needUsed：需已晉塔/安奉                                  */
ZN.APPLY_ITEMS = [
  { code: 'A01', key: 'transfer', name: '轉讓', scope: 'TLC', fee: 1000, feeRule: '每張 1,000 元', form: 'ZN001', docs: ['受讓人身分證正反面', '切結書'], fields: ['受讓人'], desc: '將權狀轉給他人持有' },
  { code: 'A02', key: 'inherit', name: '繼承', scope: 'TLC', fee: 1000, feeRule: '每 5 張 1,000 元（依繼承人×被繼承人分組）', form: 'ZN001', docs: ['死亡證明書正本', '除戶謄本正本', '關係證明', '繼承切結書'], fields: ['被繼承人', '繼承人'], desc: '原持有人往生，由繼承人承接' },
  { code: 'E01', key: 'reissue', name: '遺失補發', scope: 'TLC', fee: 1000, feeRule: '每張 1,000 元', form: 'ZN004', docs: ['持有人身分證正反面'], needSign: true, desc: '權狀遺失，補發新權狀（換新號碼）' },
  { code: 'E03', key: 'damage', name: '破損換發', scope: 'TLC', fee: 1000, feeRule: '每張 1,000 元', form: 'ZN004', docs: ['破損權狀正本'], needSign: true, desc: '權狀破損，換發新權狀（號碼不變）' },
  { code: 'B03', key: 'name_seal', name: '姓名暨印鑑變更', scope: 'TLC', fee: 600, feeRule: '每 10 張 600 元', form: 'ZN007-1', docs: ['戶籍謄本正本', '新印鑑卡'], fields: ['新姓名', '新印鑑'], desc: '持有人改名並更換印鑑' },
  { code: 'B02', key: 'seal', name: '印鑑變更', scope: 'TLC', fee: 200, feeRule: '每次 200 元', form: 'ZN007-1', docs: ['新印鑑卡'], fields: ['新印鑑'], desc: '更換留存印鑑' },
  { code: 'B04', key: 'id_change', name: '身分證變更', scope: 'TLC', fee: 100, feeRule: '每次 100 元', form: 'ZN007-1', docs: ['新身分證正反面'], desc: '身分證字號異動' },
  { code: 'D01', key: 'exchange', name: '換位', scope: 'TL', fee: 1000, feeRule: '每張 1,000 元', form: 'ZN002', fields: ['新位置'], desc: '更換為其他位置' },
  { code: 'D02', key: 'refit', name: '換裝', scope: 'T', fee: 2000, feeRule: '每次 2,000 元', form: 'ZN005', fields: ['換裝方式'], needSign: true, desc: '個人位與夫妻位互換（1換2／2換1）' },
  { code: 'C01', key: 'enshrine', name: '晉塔安奉申請', scope: 'TL', fee: 0, feeRule: '依規定（遷出後再晉塔 2,000 元/人）', form: 'ZN003', docs: ['死亡證明書'], fields: ['往生者'], desc: '安排往生者晉塔或蓮位安奉' },
  { code: 'C03', key: 'moveout', name: '遷出申請', scope: 'TL', fee: 0, feeRule: '免規費', form: 'ZN027', docs: ['遷出切結書'], desc: '將骨灰（骸）遷出' },
  { code: 'E02', key: 'storage_cert', name: '存放證補發', scope: 'T', fee: 100, feeRule: '每筆 100 元', form: 'ZN009', needUsed: true, desc: '補發存放證（需已晉塔）' },
  { code: 'F03', key: 'nameplate', name: '名條變更', scope: 'T', fee: 100, feeRule: '每筆 100 元', needUsed: true, fields: ['新名條內容'], desc: '變更塔位名條（需已晉塔）' },
  { code: 'F04', key: 'tablet_engrave', name: '蓮位重刻', scope: 'L', fee: 2000, feeRule: 'A11/B3R/B6 為 1,000 元，其餘 2,000 元', needUsed: true, fields: ['牌位內容'], desc: '重新刻製蓮位牌位（需已安奉）' },
  { code: 'G01', key: 'prepay_fee', name: '預繳管理費申請', scope: 'TL', fee: 0, feeRule: '依管理費金額', desc: '提前繳納下一期管理費' },
  { code: 'F01', key: 'refund_fee', name: '管理費退費申請', scope: 'TL', fee: 0, feeRule: '免規費', desc: '遷出後退還未使用期數管理費' },
  { code: 'H01', key: 'executor', name: '執行人變更', scope: 'C', fee: 0, feeRule: '免規費', fields: ['新執行人'], desc: '禮儀契約執行人變更' },
  { code: 'H02', key: 'user_change', name: '使用人變更', scope: 'C', fee: 0, feeRule: '免規費', fields: ['新使用人'], desc: '禮儀契約使用人變更' },
  { code: 'H03', key: 'privacy', name: '非本人不得查詢權限申請', scope: 'TL', fee: 0, feeRule: '免規費', desc: '設定位置資料不對外公開查詢' },
];

/* ---------- 異動項目卡控（同一申請單、同一權狀內；雛形示意，正式依 5.7.6 設定） ----------
   custLevel  ：客戶層級異動，不進權狀鏈，套用至該客戶所有權狀
   custExclusive：客戶層級互斥
   notAfter   ：鏈上「前面」已有這些項目時不可選（轉讓↔繼承互斥；遷出後不可再辦位置類）
   autoAfter  ：塔位已使用時，辦理這些項目後自動接「存放證補發」
   autoBefore ：「晉塔安奉申請」前自動加「預繳管理費申請」，刪除時一併移除            */
ZN.ITEM_RULES = {
  custLevel: ['B03', 'B02', 'B04'],
  custExclusive: [['B03', 'B02']],
  notAfter: {
    A01: ['A02', 'C03'], A02: ['A01', 'C03'],
    E01: ['E03'], E03: ['E01'],
    D01: ['C03'], D02: ['C03'], E02: ['C03'], F03: ['C03'], F04: ['C03'], H03: ['C03'],
  },
  autoAfter: { trigger: ['A01', 'A02', 'D01', 'D02'], add: 'E02' },
  autoBefore: { trigger: 'C01', add: 'G01' },
};

/* ---------- 客戶（持有人） ---------- */
ZN.CUSTOMERS = [
  { id: 'C0001024', name: '王大明', idNo: 'A123456789', phone: '0912345678', email: 'daming.wang@example.com', zip: '231', addr: '新北市新店區北新路三段 100 號 5 樓', notify: 'Email+簡訊', seal: '王大明印', status: '正常', lineBound: true },
  { id: 'C0001388', name: '林秀英', idNo: 'F223344556', phone: '0933222111', email: 'hsiuying.lin@example.com', zip: '106', addr: '臺北市大安區和平東路二段 50 號', notify: '簡訊通知', seal: '林秀英印', status: '正常', lineBound: false },
  { id: 'C0002051', name: '陳志豪', idNo: 'H120987654', phone: '0955666777', email: 'chihao.chen@example.com', zip: '330', addr: '桃園市桃園區中正路 1200 號 8 樓之 2', notify: 'Email通知', seal: '陳志豪印', status: '正常', lineBound: false },
];

/* ---------- 資產（塔位／蓮位／禮儀契約） ----------
   pos：位置號碼（樓別+區+號-層），如 A9C121-1
   usage：未使用／申請中／已使用／遷出                     */
ZN.ASSETS = [
  { certNo: 'VIP1140803', owner: 'C0001024', type: '塔位', spec: 'A09御璽型個人', pos: 'A9C121-1', ownership: '個人', usage: '已使用', feeExpire: '2034-12-31', feeYears: '20 年', contract: '舊合約',
    deceased: [{ uid: '塔00012031', name: '王陳月娥', relation: '父母', title: '顯妣', birth: '1938-03-12', death: '2021-09-03', enshrine: '2021-10-15', religion: '佛教', privacy: false }] },
  { certNo: 'ZPA870112', owner: 'C0001024', type: '塔位', spec: 'A03吉祥', pos: 'A3B156-1', ownership: '夫妻', usage: '未使用', feeExpire: '2045-12-31', feeYears: '一次性', contract: '新合約', deceased: [] },
  { certNo: 'LOT1146007', owner: 'C0001024', type: '蓮位', spec: 'B3R御品型個人', pos: 'B3RA032-2', ownership: '個人', usage: '已使用', feeExpire: '2026-12-31', feeYears: '20 年', contract: '舊合約',
    deceased: [{ uid: '蓮00004410', name: '王氏歷代祖先', relation: '祖父母', title: '堂上歷代祖考妣', birth: null, death: null, enshrine: '2025-04-02', religion: '民間信仰', privacy: false }] },
  { certNo: 'ZPA880230', owner: 'C0001024', type: '塔位', spec: 'A03吉祥', pos: 'A3B157-1', ownership: '個人', usage: '未使用', feeExpire: '2045-12-31', feeYears: '一次性', contract: '新合約', deceased: [],
    lockedBy: 'APP-20261101-007（轉讓 辦理中）' },
  { certNo: 'NS-1130921-1', owner: 'C0001024', type: '禮儀', spec: '圓滿禮儀專案', pos: null, ownership: '個人', usage: '未使用', contract: '禮儀契約', executor: '王小華', deceased: [] },
  { certNo: 'ZPB1135042', owner: 'C0001388', type: '塔位', spec: 'B03富貴型左右', pos: 'B3D052-1', ownership: '夫妻', usage: '已使用', feeExpire: '2043-12-31', feeYears: '20 年', contract: '舊合約',
    deceased: [{ uid: '塔00018872', name: '林金水', relation: '配偶', title: '顯考', birth: '1945-11-02', death: '2023-02-17', enshrine: '2023-03-26', religion: '道教', privacy: true }] },
  { certNo: 'MVP730215', owner: 'C0002051', type: '塔位', spec: 'A05尊榮型家族', pos: 'A5E083-4', ownership: '家族', usage: '已使用', feeExpire: '2025-12-31', feeYears: '20 年', contract: '舊合約',
    deceased: [
      { uid: '塔00020011', name: '陳阿土', relation: '祖父母', title: '顯祖考', birth: '1920-06-30', death: '2008-12-01', enshrine: '2009-01-11', religion: '民間信仰', privacy: false },
      { uid: '塔00020012', name: '陳林罔市', relation: '祖父母', title: '顯祖妣', birth: '1925-01-15', death: '2015-07-22', enshrine: '2015-08-30', religion: '民間信仰', privacy: false },
    ] },
];

/** 位置號碼 → 白話說明。A9C121-1 → 「A 棟 9 樓 C 區 第 121 號 第 1 層」（棟樓解析規則為雛形假設） */
ZN.posText = function (pos) {
  if (!pos) return '-';
  const m = pos.match(/^([A-Z])(\d+)(R?)([A-Z])(\d{3})-(\d+)$/);
  if (!m) return pos;
  const [, bld, fl, r, area, no, lv] = m;
  return `${bld} 棟 ${fl}${r ? 'R' : ''} 樓 ${area} 區 第 ${Number(no)} 號 第 ${lv} 層`;
};

/* ---------- 申請單（後台已建立，供 iPad 資料領取簽收） ---------- */
ZN.APPLICATIONS = [
  { no: 'APP-20261028-012', owner: 'C0001024', date: '2026-10-28', items: ['遺失補發'], certs: ['VIP1140803'], newCert: 'VIP1141B021', status: '已完成', sign: '未簽收', fee: 1000 },
  { no: 'APP-20261030-004', owner: 'C0001388', date: '2026-10-30', items: ['換裝'], certs: ['ZPB1135042'], newCert: 'ZPB1141B003', status: '已完成', sign: '未簽收', fee: 2000 },
  { no: 'APP-20261015-021', owner: 'C0002051', date: '2026-10-15', items: ['破損換發'], certs: ['MVP730215'], newCert: 'MVP730215', status: '已完成', sign: '已簽收', fee: 1000, signedAt: '2026-10-20' },
  { no: 'APP-20261102-002', owner: 'C0001024', date: '2026-11-02', items: ['印鑑變更'], certs: ['VIP1140803', 'ZPA870112'], status: '待會計審核', sign: '免簽收', fee: 200 },
];

/* ---------- 管理費（會員專區繳費通知） ---------- */
ZN.FEE_BILLS = [
  { id: 'FEE-115-0031', certNo: 'MVP730215', owner: 'C0002051', item: '管理費（20 年）', period: '第 2 期', amount: 30000, due: '2026-12-31', status: '待繳費' },
  { id: 'FEE-115-0047', certNo: 'LOT1146007', owner: 'C0001024', item: '管理費（20 年）', period: '第 2 期', amount: 18000, due: '2026-12-31', status: '待繳費' },
  { id: 'FEE-114-0102', certNo: 'VIP1140803', owner: 'C0001024', item: '管理費（20 年）', period: '第 1 期', amount: 36000, due: '2014-12-31', status: '已繳費', paidAt: '2014-11-20' },
];
ZN.BANK = { name: '台灣銀行 新店分行', code: '004', account: '0480-01-012345-6', holder: '慈恩園寶塔誠業股份有限公司' };

/* ---------- 會員帳號 ---------- */
ZN.MEMBERS = [
  { id: 'M00031', login: '0912345678', via: '手機', customer: 'C0001024', status: '已啟用', lineName: '大明' },
  { id: 'M00058', login: 'hsiuying.lin@example.com', via: 'Email', customer: null, status: '待綁定' },
  { id: 'M00059', login: 'U4af4980629...', via: 'LINE', customer: null, status: '待綁定', lineName: '志豪 Chen' },
];

/* ---------- 法會（雛形假設：規格書尚無法會細節，名稱與費用為示意） ---------- */
ZN.CEREMONIES = [
  { id: 'CR11501', name: '116 年清明祈福法會', date: '2027-03-28', date2: '2027-04-04', place: '慈恩園 大殿', deadline: '2027-03-10', status: '報名中', cover: 'spring',
    desc: '清明時節，為往生親人誦經祈福，祝願蓮品增上、闔家平安。', quota: 800, taken: 512,
    options: [
      { key: 'chao', name: '超薦往生牌位', price: 1200, unit: '位', note: '超薦往生親人，需填寫往生者姓名' },
      { key: 'zuxian', name: '歷代祖先牌位', price: 1200, unit: '位', note: '填寫「○氏歷代祖先」' },
      { key: 'yuanqin', name: '冤親債主牌位', price: 800, unit: '位', note: '化解冤結，填寫陽上報恩人' },
      { key: 'xiaozai', name: '消災祈福延生', price: 600, unit: '位', note: '為在世親友祈福，填寫祈福者姓名' },
    ] },
  { id: 'CR11502', name: '116 年中元普度法會', date: '2027-08-20', date2: '2027-08-22', place: '慈恩園 大殿', deadline: '2027-08-05', status: '即將開放', cover: 'summer',
    desc: '農曆七月普度眾生，超薦先亡、普濟幽冥。', quota: 1000, taken: 0, options: [] },
  { id: 'CR11409', name: '115 年冬至報恩法會', date: '2026-12-20', date2: '2026-12-21', place: '慈恩園 大殿', deadline: '2026-11-30', status: '報名中', cover: 'winter',
    desc: '冬至感念祖德，報恩祈福。', quota: 300, taken: 297,
    options: [
      { key: 'chao', name: '超薦往生牌位', price: 1000, unit: '位' },
      { key: 'zuxian', name: '歷代祖先牌位', price: 1000, unit: '位' },
    ] },
];
ZN.CEREMONY_REGS = [
  { no: 'CE-115-000123', ceremony: 'CR11501', name: '王大明', phone: '0912345678', items: [{ key: 'chao', name: '超薦往生牌位', qty: 1, target: '王陳月娥', yang: '王大明' }], amount: 1200, status: '待付款', at: '2026-11-01' },
  { no: 'CE-115-000098', ceremony: 'CR11501', name: '林秀英', phone: '0933222111', items: [{ key: 'chao', name: '超薦往生牌位', qty: 1, target: '林金水', yang: '林秀英' }, { key: 'xiaozai', name: '消災祈福延生', qty: 2, target: '林小芬、林小傑', yang: '林秀英' }], amount: 2400, status: '對帳中', at: '2026-10-29', report: { last5: '33851', date: '2026-10-30', amount: 2400 } },
  { no: 'CE-115-000077', ceremony: 'CR11501', name: '陳志豪', phone: '0955666777', items: [{ key: 'zuxian', name: '歷代祖先牌位', qty: 1, target: '陳氏歷代祖先', yang: '陳志豪' }], amount: 1200, status: '報名成功', at: '2026-10-25', report: { last5: '90215', date: '2026-10-25', amount: 1200 } },
];

/* ---------- 服務處資訊（位置查詢、法會頁共用） ---------- */
ZN.SITE = {
  name: '慈恩園',
  tel: '(02) 2000-0000',
  hours: '每日 08:30 – 17:00（除夕、春節依公告）',
  addr: '新北市○○區○○路 ○ 號',
  service: '一樓服務處櫃檯',
};

/* ---------- 查詢工具 ---------- */
ZN.customerOf = id => ZN.CUSTOMERS.find(c => c.id === id);
ZN.assetsOf = id => ZN.ASSETS.filter(a => a.owner === id);
ZN.assetByCert = no => ZN.ASSETS.find(a => a.certNo === no);
ZN.itemsFor = assetType => ZN.APPLY_ITEMS.filter(i => i.scope.includes({ 塔位: 'T', 蓮位: 'L', 禮儀: 'C' }[assetType]));
