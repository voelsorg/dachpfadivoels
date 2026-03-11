export async function onRequestGet(context) {
  const { env, params } = context;
  const id = parseInt(params.id);
  if (!id) return Response.json({ error: "Ungültige ID" }, { status: 400 });

  const row = await env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(id)
    .first();

  if (!row) return Response.json({ error: "Nicht gefunden" }, { status: 404 });
  return Response.json(row);
}

export async function onRequestPatch(context) {
  const { env, params, request } = context;
  const id = parseInt(params.id);
  if (!id) return Response.json({ error: "Ungültige ID" }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const allowed = [
    "vorname", "nachname", "email", "anzahl", "zustellung",
    "versand", "preis", "adresse", "land", "status", "anmerkung",
  ];

  // Mindestpreis validieren
  if (body.preis !== undefined) {
    const p = parseFloat(body.preis);
    if (!p || p < 30) {
      return Response.json({ error: "Mindestpreis ist € 30" }, { status: 400 });
    }
  }
  const updates = [];
  const values = [];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (updates.length === 0) {
    return Response.json({ error: "Keine Änderungen" }, { status: 400 });
  }

  values.push(id);
  const result = await env.DB.prepare(
    `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
  }
  return Response.json({ ok: true });
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  const id = parseInt(params.id);
  if (!id) return Response.json({ error: "Ungültige ID" }, { status: 400 });

  const result = await env.DB.prepare("DELETE FROM orders WHERE id = ?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Bestellung nicht gefunden" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
