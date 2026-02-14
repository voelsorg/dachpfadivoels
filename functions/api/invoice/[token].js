import { BANK } from '../../lib/config.js';

export async function onRequestGet(context) {
  const { env, params } = context;
  const token = params.token;
  if (!token) return Response.json({ error: "Token fehlt" }, { status: 400 });

  const row = await env.DB.prepare(
    "SELECT id, created_at, vorname, nachname, email, anzahl, zustellung, versand, adresse, land, anmerkung FROM orders WHERE invoice_token = ?"
  ).bind(token).first();

  if (!row) return Response.json({ error: "Nicht gefunden" }, { status: 404 });
  return Response.json({ ...row, bank: BANK });
}
