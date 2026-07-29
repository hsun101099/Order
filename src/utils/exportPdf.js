import { PORTIONS_PER_PERSON, findDrink, findMeal } from '../data/menu.js';
import { APP_NAME } from '../config.js';

/** A4 橫式，以 96dpi 換算的像素寬度，讓截圖比例與 PDF 一致。 */
const PAGE = { widthMm: 297, heightMm: 210, widthPx: 1123, paddingPx: 44 };

const COLOR = {
  ink: '#0F172A',
  body: '#334155',
  muted: '#94A3B8',
  line: '#E2E8F0',
  hairline: '#F1F5F9',
  surface: '#F8FAFC',
};

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );

/** ['soda','soda'] → '汽水 ×2' */
const describe = (ids = [], finder) => {
  const counted = ids.reduce((acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }), {});
  return Object.entries(counted)
    .map(([id, quantity]) => `${finder(id)?.name ?? id}${quantity > 1 ? ` ×${quantity}` : ''}`)
    .join('、');
};

const formatPrintedAt = () =>
  new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

/** 兩頁共用的頁首。 */
const header = ({ title, subtitle, tally }) => `
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:16px;border-bottom:2px solid ${COLOR.ink};">
    <div>
      <div style="font-size:24px;font-weight:700;letter-spacing:-0.4px;">${escapeHtml(title)}</div>
      <div style="margin-top:6px;font-size:12px;color:${COLOR.muted};">${escapeHtml(subtitle)}</div>
    </div>
    <div style="text-align:right;white-space:nowrap;">
      <div style="font-size:11px;color:${COLOR.muted};">每人 ${PORTIONS_PER_PERSON} 份餐、${PORTIONS_PER_PERSON} 杯飲料</div>
      <div style="margin-top:2px;font-size:20px;font-weight:700;">
        ${tally.people} 人<span style="color:${COLOR.muted};font-weight:400;margin:0 6px;">·</span>${tally.portions} 份
      </div>
    </div>
  </div>`;

const sectionLabel = (text) =>
  `<div style="font-size:12px;font-weight:700;color:${COLOR.muted};letter-spacing:1px;">${text}</div>`;

/** 名單的一欄；橫式版面用兩欄併排，同樣的高度可以多放一倍的人。 */
const personColumn = (orders, startIndex) => `
  <table style="flex:1;min-width:0;border-collapse:collapse;">
    <tbody>
      ${orders
        .map(
          (order, index) => `
            <tr>
              <td style="padding:10px 8px 10px 0;border-top:1px solid ${COLOR.hairline};width:26px;font-size:11px;color:${COLOR.muted};vertical-align:top;">
                ${startIndex + index + 1}
              </td>
              <td style="padding:10px 12px 10px 0;border-top:1px solid ${COLOR.hairline};width:86px;font-size:13px;font-weight:700;color:${COLOR.ink};vertical-align:top;">
                ${escapeHtml(order.customerName)}
              </td>
              <td style="padding:10px 0;border-top:1px solid ${COLOR.hairline};font-size:13px;color:${COLOR.body};line-height:1.5;">
                ${escapeHtml(describe(order.meals, findMeal))}
                <span style="color:${COLOR.muted};"> · </span>
                ${escapeHtml(describe(order.drinks, findDrink))}
              </td>
            </tr>`
        )
        .join('')}
    </tbody>
  </table>`;

/** 統計小卡：品項名稱與份數，單獨成頁時字級放大。 */
const tallyCard = (label, items, unit, total) => `
  <div style="flex:1;min-width:0;background:${COLOR.surface};border-radius:16px;padding:22px 26px 10px;">
    <div style="display:flex;align-items:baseline;justify-content:space-between;">
      <span style="font-size:15px;font-weight:700;color:${COLOR.ink};">${label}</span>
      <span style="font-size:12px;color:${COLOR.muted};">共 ${total} ${unit}</span>
    </div>
    <table style="width:100%;margin-top:10px;border-collapse:collapse;">
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td style="padding:14px 0;border-top:1px solid ${COLOR.line};font-size:15px;color:${
                  item.count ? COLOR.body : COLOR.muted
                };">${escapeHtml(item.name)}</td>
                <td style="padding:14px 0;border-top:1px solid ${COLOR.line};text-align:right;font-size:22px;font-weight:700;color:${
                  item.count ? COLOR.ink : COLOR.muted
                };white-space:nowrap;">
                  ${item.count}<span style="font-size:12px;font-weight:400;color:${COLOR.muted};margin-left:4px;">${unit}</span>
                </td>
              </tr>`
          )
          .join('')}
      </tbody>
    </table>
  </div>`;

/** 建立一張離屏的 A4 橫式頁面節點。 */
function createPageNode(innerHtml) {
  const node = document.createElement('div');
  Object.assign(node.style, {
    position: 'fixed',
    top: '0',
    left: '-10000px',
    width: `${PAGE.widthPx}px`,
    padding: `${PAGE.paddingPx}px`,
    boxSizing: 'border-box',
    background: '#FFFFFF',
    color: COLOR.ink,
    font: `14px/1.6 ${FONT_STACK}`,
  });
  node.innerHTML = innerHtml;
  return node;
}

/** 第一頁：每個人點了什麼。 */
function buildPeoplePage({ orders, tally, title, printedAt }) {
  const half = Math.ceil(orders.length / 2);
  const left = orders.slice(0, half);
  const right = orders.slice(half);

  return createPageNode(`
    ${header({ title, subtitle: `${printedAt}　·　大家點的`, tally })}
    <div style="margin-top:26px;">
      ${sectionLabel('每個人點的')}
      <div style="display:flex;gap:36px;margin-top:6px;align-items:flex-start;">
        ${personColumn(left, 0)}
        ${right.length ? personColumn(right, half) : '<div style="flex:1;"></div>'}
      </div>
    </div>
  `);
}

/** 第二頁：份數統計。 */
function buildStatsPage({ tally, title, printedAt }) {
  return createPageNode(`
    ${header({ title, subtitle: `${printedAt}　·　統整`, tally })}
    <div style="margin-top:30px;">
      ${sectionLabel('統計')}
      <div style="display:flex;gap:24px;margin-top:12px;align-items:flex-start;">
        ${tallyCard('餐點', tally.meals, '份', tally.portions)}
        ${tallyCard('飲料', tally.drinks, '杯', tally.portions)}
      </div>
    </div>
  `);
}

/** 把單一節點畫進 PDF；內容過長時才於同一節點內分頁。 */
async function renderNode(pdf, node, html2canvas, state) {
  document.body.appendChild(node);
  let canvas;
  try {
    canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: '#FFFFFF',
      useCORS: true,
      windowWidth: PAGE.widthPx,
    });
  } finally {
    node.remove();
  }

  const pxPerMm = canvas.width / PAGE.widthMm;
  const pageHeightPx = Math.floor(PAGE.heightMm * pxPerMm);

  let offset = 0;
  let slices = 0;

  while (offset < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - offset);

    // 同一節點內剩下不到一行的高度就不再多開一頁，避免出現空白頁。
    if (slices > 0 && sliceHeight < pageHeightPx * 0.03) break;

    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceHeight;

    const context = slice.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    if (state.pages > 0) pdf.addPage();
    pdf.addImage(
      slice.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      0,
      PAGE.widthMm,
      sliceHeight / pxPerMm
    );

    offset += sliceHeight;
    slices += 1;
    state.pages += 1;
  }
}

/**
 * 匯出成兩頁的 PDF：第一頁是每個人點的，第二頁是份數統計。
 * 以自建的節點截圖，中文字型直接沿用系統字型，不需另外嵌入字型檔。
 */
export async function exportOrdersPdf({ orders, tally, title = APP_NAME }) {
  if (orders.length === 0) return null;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const printedAt = formatPrintedAt();
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const state = { pages: 0 };

  await renderNode(pdf, buildPeoplePage({ orders, tally, title, printedAt }), html2canvas, state);
  await renderNode(pdf, buildStatsPage({ tally, title, printedAt }), html2canvas, state);

  // 檔名使用 ASCII：部分瀏覽器／作業系統會丟棄含中文的下載檔名，連副檔名一起遺失。
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `order-summary-${stamp}.pdf`;

  // 自行觸發下載，確保檔名被保留。
  const url = URL.createObjectURL(pdf.output('blob'));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}
