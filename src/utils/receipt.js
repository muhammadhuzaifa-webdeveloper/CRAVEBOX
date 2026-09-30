const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Opens a clean printable bill in a new window
export function printReceipt(order) {
  const rows = (order.items || [])
    .map(
      (i) => `<tr><td>${esc(i.title)} x${i.quantity}</td><td style="text-align:right">${money(i.price * i.quantity)}</td></tr>`
    )
    .join("");

  const html = `<!doctype html><html><head><title>${esc(order.orderNumber || order.id)}</title>
  <style>
    body{font-family:Arial,sans-serif;width:300px;margin:0 auto;padding:16px;color:#111;font-size:13px}
    h1{font-size:20px;text-align:center;margin:0}
    .c{text-align:center;color:#555;margin:2px 0 10px}
    table{width:100%;border-collapse:collapse}
    td{padding:4px 0}
    .line{border-top:1px dashed #999;margin:8px 0}
    .tot td{font-weight:bold;font-size:15px}
  </style></head><body>
    <h1>CraveBox</h1>
    <p class="c">${esc(order.orderNumber || order.id)}<br/>${new Date(order.createdAt || order.date || Date.now()).toLocaleString()}</p>
    <div>Customer: ${esc(order.customerName || order.customer)}</div>
    ${order.phone ? `<div>Phone: ${esc(order.phone)}</div>` : ""}
    <div>Type: ${esc(order.orderType || "Delivery")} | Payment: ${esc(order.paymentMethod || "Cash")}</div>
    ${order.address ? `<div>Address: ${esc(order.address)}</div>` : ""}
    <div class="line"></div>
    <table>${rows}</table>
    <div class="line"></div>
    <table>
      <tr><td>Subtotal</td><td style="text-align:right">${money(order.subtotal)}</td></tr>
      <tr><td>Delivery</td><td style="text-align:right">${money(order.deliveryFee)}</td></tr>
      ${order.discount ? `<tr><td>Discount</td><td style="text-align:right">- ${money(order.discount)}</td></tr>` : ""}
      <tr class="tot"><td>Total</td><td style="text-align:right">${money(order.total)}</td></tr>
    </table>
    <div class="line"></div>
    <p class="c">Thank you for ordering with CraveBox!</p>
    <script>window.onload=function(){window.print();}</script>
  </body></html>`;

  const w = window.open("", "_blank", "width=380,height=600");
  if (!w) return alert("Please allow pop-ups to print the receipt.");
  w.document.write(html);
  w.document.close();
}
