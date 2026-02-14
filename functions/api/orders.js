import { sendMailjet } from '../lib/mail.js';

const SHIP_COSTS = {
  versand_at: 5,
  versand_eu: 11,
  versand_welt: 0,
  abholung: 0,
};

const SHIP_LABELS = {
  versand_at: 'Versand Österreich (€ 5)',
  versand_eu: 'Versand EU (€ 11)',
  versand_welt: 'Versand Weltweit (auf Anfrage)',
  abholung: 'Selbstabholung in Völs',
};

const SHIP_LABELS_EN = {
  versand_at: 'Shipping Austria (€ 5)',
  versand_eu: 'Shipping EU (€ 11)',
  versand_welt: 'Worldwide Shipping (on request)',
  abholung: 'Pick-up in Völs',
};

const PRICE = 30;
const NOTIFY_EMAIL = 'baustein@pfadivoels.at';
const FROM_EMAIL = 'baustein@pfadivoels.at';
const FROM_NAME = 'Pfadis Völs – Bausteinaktion';

async function sendMails(env, order, orderId, invoiceToken) {
  const versand = SHIP_COSTS[order.zustellung] ?? 0;
  const artTotal = order.anzahl * PRICE;
  const gesamt = artTotal + versand;
  const nr = 'BA-2026-' + String(orderId).padStart(3, '0');
  const shipLabel = SHIP_LABELS[order.zustellung] || order.zustellung;
  const shipLabelEn = SHIP_LABELS_EN[order.zustellung] || order.zustellung;
  const isWelt = order.zustellung === 'versand_welt';

  const addrLine = order.adresse ? '\nAdresse: ' + order.adresse + (order.land ? ', ' + order.land : '') : '';
  const addrLineEn = order.adresse ? '\nAddress: ' + order.adresse + (order.land ? ', ' + order.land : '') : '';
  const noteLine = order.anmerkung ? '\nAnmerkung: ' + order.anmerkung : '';
  const noteLineEn = order.anmerkung ? '\nNote: ' + order.anmerkung : '';

  const invoiceUrl = `https://baustein.pfadivoels.at/rechnung.html?token=${invoiceToken}`;

  let customerText;

  if (isWelt) {
    // Weltweit: keine Kosten, kein Rechnungslink
    customerText = `[English version below]

Hallo ${order.vorname},

vielen Dank für deine Bestellung! Wir haben folgende Daten erhalten:

Bestellnr.: ${nr}
Name: ${order.vorname} ${order.nachname}
E-Mail: ${order.email}
Anzahl: ${order.anzahl}× Kunstdruck BiPi
Zustellung: Versand Weltweit (auf Anfrage)${addrLine}${noteLine}

Die Versandkosten für den weltweiten Versand werden wir dir in einer separaten E-Mail mitteilen.

Gut Pfad!
Pfadfinder*innengruppe Völs
baustein.pfadivoels.at

---

Hello ${order.vorname},

Thank you for your order! We have received the following details:

Order no.: ${nr}
Name: ${order.vorname} ${order.nachname}
Email: ${order.email}
Quantity: ${order.anzahl}× Art Print BiPi
Delivery: Worldwide Shipping (on request)${addrLineEn}${noteLineEn}

The shipping costs for worldwide delivery will be communicated to you in a separate email.

Yours in Scouting,
Scout Group Völs
baustein.pfadivoels.at`;
  } else {
    // Nicht-Weltweit: Kosten + Rechnungslink
    customerText = `[English version below]

Hallo ${order.vorname},

vielen Dank für deine Bestellung! Wir haben folgende Daten erhalten:

Bestellnr.: ${nr}
Name: ${order.vorname} ${order.nachname}
E-Mail: ${order.email}
Anzahl: ${order.anzahl}× Kunstdruck BiPi
Zustellung: ${shipLabel}${addrLine}
Kunstdruck: € ${artTotal},–${versand > 0 ? '\nVersand: € ' + versand + ',–' : ''}
Gesamt: € ${gesamt},–${noteLine}

Deine Rechnung mit QR-Code zur Bezahlung per Banküberweisung findest du hier:
${invoiceUrl}

Die Drucke werden gesammelt einmal im Monat versendet.

Gut Pfad!
Pfadfinder*innengruppe Völs
baustein.pfadivoels.at

---

Hello ${order.vorname},

Thank you for your order! We have received the following details:

Order no.: ${nr}
Name: ${order.vorname} ${order.nachname}
Email: ${order.email}
Quantity: ${order.anzahl}× Art Print BiPi
Delivery: ${shipLabelEn}${addrLineEn}
Art print: € ${artTotal},–${versand > 0 ? '\nShipping: € ' + versand + ',–' : ''}
Total: € ${gesamt},–${noteLineEn}

You can find your invoice with a QR code for bank transfer payment here:
${invoiceUrl}

Prints are shipped collectively once a month.

Yours in Scouting,
Scout Group Völs
baustein.pfadivoels.at`;
  }

  // Admin-Benachrichtigung (unverändert, nur deutsch)
  const orderDetails = `
Bestellnr.: ${nr}
Name: ${order.vorname} ${order.nachname}
E-Mail: ${order.email}
Anzahl: ${order.anzahl}× Kunstdruck BiPi
Zustellung: ${shipLabel}${addrLine}
Kunstdruck: € ${artTotal},–${versand > 0 ? '\nVersand: € ' + versand + ',–' : ''}${isWelt ? '\nVersand: auf Anfrage' : ''}
Gesamt: € ${gesamt},–${isWelt ? ' + Versand' : ''}${noteLine}`.trim();

  const messages = [
    {
      From: { Email: FROM_EMAIL, Name: FROM_NAME },
      To: [{ Email: order.email, Name: `${order.vorname} ${order.nachname}` }],
      Subject: `Bestellbestätigung – Bausteinaktion Pfadis Völs (${nr})`,
      TextPart: customerText,
    },
    {
      From: { Email: FROM_EMAIL, Name: FROM_NAME },
      To: [{ Email: NOTIFY_EMAIL, Name: 'Bausteinaktion Verwaltung' }],
      Subject: `Neue Bestellung ${nr}: ${order.anzahl}× BiPi – ${order.vorname} ${order.nachname}`,
      TextPart: `Neue Bestellung eingegangen!\n\n${orderDetails}\n\n→ Verwaltung: https://baustein.pfadivoels.at/verwaltung.html`,
    },
  ];

  await sendMailjet(env, messages);
}

export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT * FROM orders ORDER BY id DESC"
  ).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const { env, request } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const { vorname, nachname, email, anzahl, zustellung, adresse, land, anmerkung } = body;

  if (!vorname?.trim() || !nachname?.trim()) {
    return Response.json({ error: "Name ist Pflichtfeld" }, { status: 400 });
  }
  if (!email?.trim() || !email.includes("@")) {
    return Response.json({ error: "Gültige E-Mail erforderlich" }, { status: 400 });
  }
  const n = parseInt(anzahl);
  if (!n || n < 1 || n > 99) {
    return Response.json({ error: "Ungültige Anzahl" }, { status: 400 });
  }
  const validZustellung = ["versand_at", "versand_eu", "versand_welt", "abholung"];
  if (!validZustellung.includes(zustellung)) {
    return Response.json({ error: "Ungültige Zustellungsoption" }, { status: 400 });
  }

  const versand = SHIP_COSTS[zustellung] ?? 0;
  const invoiceToken = crypto.randomUUID();

  const result = await env.DB.prepare(
    `INSERT INTO orders (vorname, nachname, email, anzahl, zustellung, versand, adresse, land, anmerkung, invoice_token)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      vorname.trim(),
      nachname.trim(),
      email.trim(),
      n,
      zustellung,
      versand,
      adresse?.trim() || null,
      land?.trim() || null,
      anmerkung?.trim() || null,
      invoiceToken
    )
    .run();

  context.waitUntil(sendMails(env, body, result.meta.last_row_id, invoiceToken));

  return Response.json(
    { ok: true, id: result.meta.last_row_id },
    { status: 201 }
  );
}
