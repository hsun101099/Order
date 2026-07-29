import { PORTIONS_PER_PERSON, findDrink, findMeal } from '../data/menu.js';

/** A4 直式，以 96dpi 換算的像素寬度，讓截圖比例與 PDF 一致。 */
const PAGE = { widthMm: 210, heightMm: 297, widthPx: 794, paddingPx: 48 };

const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';

/** ['soda','soda'] → '汽水 ×2' */
const describe = (ids = [], finder) => {
  const counted = ids.reduce((acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }), {});
  return Object.entries(counted)
    .map(([id, quantity]) => `${finder(id)?.name ?? id}${quantity > 1 ? ` ×${quantity}` : ''}`)
    .join('、');
};

const summaryLine = (items) =>
  items
    .filter((item) => item.count > 0)
    .map((item) => `${item.name} ${item.count}`)
    .join('、') || '—';

const tallyRows = (items, unit) =>
  items
    .filter((item) => item.count > 0)
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;width:130px;font-weight:600;color:#0F172A;">
            ${escapeHtml(item.name)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;width:70px;color:#334155;">
            ${item.count} ${unit}
          </td>
        </tr>`
    )
    .join('');

const personRows = (orders) =>
  orders
    .map(
      (order, index) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;width:36px;color:#94A3B8;">${index + 1}</td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;width:110px;font-weight:600;color:#0F172A;">
            ${escapeHtml(order.customerName)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;color:#334155;">
            ${escapeHtml(describe(order.meals, findMeal))}
            <span style="color:#CBD5E1;"> · </span>
            ${escapeHtml(describe(order.drinks, findDrink))}
          </td>
        </tr>`
    )
    .join('');

/** 組出一張排版乾淨的單據，專供列印/匯出使用，不受畫面上的互動元素影響。 */
function buildDocumentNode({ orders, tally, title }) {
  const node = document.createElement('div');
  const printedAt = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

  Object.assign(node.style, {
    position: 'fixed',
    top: '0',
    left: '-10000px',
    width: `${PAGE.widthPx}px`,
    padding: `${PAGE.paddingPx}px`,
    boxSizing: 'border-box',
    background: '#FFFFFF',
    color: '#0F172A',
    font: `14px/1.6 ${FONT_STACK}`,
  });

  node.innerHTML = `
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding-bottom:18px;border-bottom:2px solid #0F172A;">
      <div>
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.3px;">${escapeHtml(title)}</div>
        <div style="margin-top:6px;font-size:12px;color:#94A3B8;">${escapeHtml(printedAt)} 匯出</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;color:#94A3B8;">總份數</div>
        <div style="font-size:22px;font-weight:700;">${tally.portions} 份</div>
      </div>
    </div>

    <div style="margin-top:20px;padding:16px 18px;background:#F8FAFC;border-radius:12px;font-size:13px;color:#334155;line-height:1.9;">
      <div><span style="color:#94A3B8;">人數　</span>${tally.people} 人（每人 ${PORTIONS_PER_PERSON} 份餐、${PORTIONS_PER_PERSON} 杯飲料）</div>
      <div><span style="color:#94A3B8;">餐點　</span>${escapeHtml(summaryLine(tally.meals))}</div>
      <div><span style="color:#94A3B8;">飲料　</span>${escapeHtml(summaryLine(tally.drinks))}</div>
    </div>

    <div style="margin-top:26px;font-size:13px;font-weight:700;">餐點</div>
    <table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:13px;">
      <tbody>${tallyRows(tally.meals, '份')}</tbody>
    </table>

    <div style="margin-top:24px;font-size:13px;font-weight:700;">飲料</div>
    <table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:13px;">
      <tbody>${tallyRows(tally.drinks, '杯')}</tbody>
    </table>

    <div style="margin-top:24px;font-size:13px;font-weight:700;">每個人點的</div>
    <table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:13px;">
      <tbody>${personRows(orders)}</tbody>
    </table>

    <div style="margin-top:18px;font-size:13px;font-weight:700;">
      合計 ${orders.length} 人 · ${tally.portions} 份
    </div>
  `;

  return node;
}

/**
 * 將統整內容匯出成可下載的 PDF。
 * 以自建的單據節點截圖，中文字型直接沿用系統字型，不需另外嵌入字型檔。
 */
export async function exportOrdersPdf({ orders, tally, title = '點餐統整' }) {
  if (orders.length === 0) return null;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const node = buildDocumentNode({ orders, tally, title });
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

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pxPerMm = canvas.width / PAGE.widthMm;
  const pageHeightPx = Math.floor(PAGE.heightMm * pxPerMm);

  let offset = 0;
  let page = 0;

  while (offset < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - offset);

    // 最後剩下不到一行的高度就不再多開一頁，避免出現空白頁。
    if (page > 0 && sliceHeight < pageHeightPx * 0.03) break;

    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceHeight;

    const context = slice.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    if (page > 0) pdf.addPage();
    pdf.addImage(
      slice.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      0,
      PAGE.widthMm,
      sliceHeight / pxPerMm
    );

    offset += sliceHeight;
    page += 1;
  }

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
