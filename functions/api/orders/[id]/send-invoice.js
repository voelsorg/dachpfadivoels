import { sendMailjet } from '../../../lib/mail.js';

const PRICE = 30;
const FROM_EMAIL = 'baustein@pfadivoels.at';
const FROM_NAME = 'Pfadis Völs – Bausteinaktion';

const SHIP_LABELS = {
  versand_at: 'Versand Österreich (€ 5)',
  versand_eu: 'Versand EU (€ 11)',
  versand_welt: 'Versand Weltweit',
  abholung: 'Selbstabholung in Völs',
};

const SHIP_LABELS_EN = {
  versand_at: 'Shipping Austria (€ 5)',
  versand_eu: 'Shipping EU (€ 11)',
  versand_welt: 'Worldwide Shipping',
  abholung: 'Pick-up in Völs',
};

export async function onRequestPost(context) {
  const { env, params } = context;
  const id = parseInt(params.id);
  if (!id) return Response.json({ error: "Ungültige ID" }, { status: 400 });

  const order = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(id).first();

  if (!order) return Response.json({ error: "Nicht gefunden" }, { status: 404 });
  if (!order.email) return Response.json({ error: "Keine E-Mail-Adresse hinterlegt" }, { status: 400 });
  if (!order.invoice_token) return Response.json({ error: "Kein Rechnungs-Token vorhanden" }, { status: 400 });
  if (order.zustellung === 'versand_welt' && (!order.versand || order.versand <= 0)) {
    return Response.json({ error: "Bitte zuerst Versandkosten eintragen (Bestellung bearbeiten)" }, { status: 400 });
  }

  const artTotal = order.anzahl * PRICE;
  const versand = order.versand || 0;
  const gesamt = artTotal + versand;
  const nr = 'BA-2026-' + String(order.id).padStart(3, '0');
  const shipLabel = SHIP_LABELS[order.zustellung] || order.zustellung;
  const shipLabelEn = SHIP_LABELS_EN[order.zustellung] || order.zustellung;
  const invoiceUrl = `https://baustein.pfadivoels.at/rechnung.html?token=${order.invoice_token}`;

  const addrLine = order.adresse ? '\nAdresse: ' + order.adresse + (order.land ? ', ' + order.land : '') : '';
  const addrLineEn = order.adresse ? '\nAddress: ' + order.adresse + (order.land ? ', ' + order.land : '') : '';

  const messages = [{
    From: { Email: FROM_EMAIL, Name: FROM_NAME },
    To: [{ Email: order.email, Name: `${order.vorname} ${order.nachname}` }],
    Subject: `Rechnung – Bausteinaktion Pfadis Völs (${nr})`,
    TextPart: `[English version below]

Hallo ${order.vorname},

hier ist deine Rechnung für deine Bestellung bei der Bausteinaktion der Pfadfinder*innengruppe Völs:

Bestellnr.: ${nr}
Anzahl: ${order.anzahl}× Kunstdruck BiPi
Zustellung: ${shipLabel}${addrLine}
Kunstdruck: € ${artTotal},–${versand > 0 ? '\nVersand: € ' + versand + ',–' : ''}
Gesamt: € ${gesamt},–

Deine Rechnung mit QR-Code zur Bezahlung per Banküberweisung findest du hier:
${invoiceUrl}

Die Drucke werden gesammelt einmal im Monat versendet.

Gut Pfad!
Pfadfinder*innengruppe Völs
baustein.pfadivoels.at

---

Hello ${order.vorname},

Here is your invoice for your order from the Scout Group Völs fundraiser:

Order no.: ${nr}
Quantity: ${order.anzahl}× Art Print BiPi
Delivery: ${shipLabelEn}${addrLineEn}
Art print: € ${artTotal},–${versand > 0 ? '\nShipping: € ' + versand + ',–' : ''}
Total: € ${gesamt},–

You can find your invoice with a QR code for bank transfer payment here:
${invoiceUrl}

Prints are shipped collectively once a month.

Yours in Scouting,
Scout Group Völs
baustein.pfadivoels.at`,
  }];

  await sendMailjet(env, messages);
  return Response.json({ ok: true });
}
