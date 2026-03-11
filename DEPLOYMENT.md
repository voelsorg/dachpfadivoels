# Deployment-Anleitung: Bausteinaktion Pfadis Völs

## Was du brauchst

- **Cloudflare-Account** (gratis): https://dash.cloudflare.com/sign-up
- **Node.js** (Version 18+): https://nodejs.org/ → LTS-Version installieren
- **Terminal/Kommandozeile** (macOS: Terminal, Windows: PowerShell, Linux: Terminal)

Kreditkarte ist NICHT nötig. Der Free Tier reicht locker.

---

## Schritt 1: Cloudflare-Account erstellen

1. Geh auf https://dash.cloudflare.com/sign-up
2. E-Mail + Passwort eingeben
3. E-Mail bestätigen
4. Fertig – du brauchst keinen Plan auswählen, Free reicht

---

## Schritt 2: Node.js installieren (falls noch nicht vorhanden)

Teste ob Node.js schon installiert ist:

```bash
node --version
```

Falls nicht → https://nodejs.org/ → LTS-Version herunterladen und installieren.

---

## Schritt 3: Projekt entpacken und einrichten

```bash
# 1. In dein Arbeitsverzeichnis wechseln (z.B. Desktop oder Projekte-Ordner)
cd ~/Desktop

# 2. Archiv entpacken
tar xzf baustein-cf.tar.gz

# 3. In den Projektordner wechseln
cd baustein-cf

# 4. Dependencies installieren
npm install
```

---

## Schritt 4: Bei Cloudflare einloggen (CLI)

```bash
npx wrangler login
```

Das öffnet deinen Browser → bei Cloudflare einloggen → "Allow" klicken → fertig.

---

## Schritt 5: D1-Datenbank erstellen

```bash
npx wrangler d1 create baustein-db
```

Die Ausgabe sieht ungefähr so aus:

```
✅ Successfully created DB 'baustein-db'

[[d1_databases]]
binding = "DB"
database_name = "baustein-db"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**WICHTIG:** Kopiere die `database_id` und trage sie in `wrangler.toml` ein:

```bash
# wrangler.toml öffnen (mit deinem Editor)
# z.B.:
nano wrangler.toml
# oder:
code wrangler.toml
```

Ersetze die leere Zeile:
```toml
database_id = ""
```
mit deiner ID:
```toml
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

Speichern und schließen.

---

## Schritt 6: Datenbank-Schema anlegen

```bash
# Schema auf die Remote-Datenbank anwenden
npx wrangler d1 execute baustein-db --remote --file=schema.sql
```

Ausgabe sollte so aussehen:
```
🌀 Executing on remote database baustein-db:
🌀 To execute on your local development database, remove the --remote flag.
✅ OK
```

---

## Schritt 7: Projekt deployen

```bash
npx wrangler pages deploy public --branch production
```

Beim **ersten Mal** fragt Wrangler:
```
? Enter the name of your new project: › baustein-pfadivoels
? Enter the production branch name: › main
```

Einfach "baustein-pfadivoels" und "main" eingeben (oder Enter für den Default).

Wenn alles klappt:
```
✨ Deployment complete!
  https://baustein-pfadivoels.pages.dev
```

**Teste die Seite jetzt im Browser!**
Die Bestellseite sollte unter der angezeigten URL erreichbar sein.

---

## Schritt 8: D1-Binding im Dashboard verknüpfen

Das ist der Schritt, den viele vergessen – ohne das kann die API nicht auf die Datenbank zugreifen!

1. Geh auf https://dash.cloudflare.com/
2. Links auf **"Workers & Pages"** klicken
3. Dein Projekt **"baustein-pfadivoels"** anklicken
4. Oben auf **"Settings"** klicken
5. Links auf **"Bindings"** klicken
6. Unter **"D1 database bindings"** auf **"Add binding"** klicken:
   - **Variable name:** `DB`
   - **D1 database:** `baustein-db` auswählen
7. **"Save"** klicken

---

## Schritt 9: Admin-Passwort setzen

Zurück im Terminal:

```bash
npx wrangler pages secret put ADMIN_TOKEN --project-name baustein-pfadivoels
```

Du wirst nach dem Wert gefragt – tippe dein gewünschtes Admin-Passwort ein, z.B.:
```
? Enter a secret value: › GutPfad2026!
```

(Die Eingabe ist unsichtbar, das ist normal.)

Alternativ im Dashboard:
1. Workers & Pages → baustein-pfadivoels → Settings
2. **"Environment variables"** → "Add variable"
3. Name: `ADMIN_TOKEN`, Value: dein Passwort
4. Auf **"Encrypt"** klicken → Save

---

## Schritt 10: Nochmal deployen (damit Bindings greifen)

```bash
npx wrangler pages deploy public --branch production
```

---

## Schritt 11: Testen!

### Öffentliche Seite testen
1. Öffne `https://baustein-pfadivoels.pages.dev`
2. Fülle das Bestellformular aus und sende ab
3. Erfolgsmeldung sollte erscheinen

### Admin-Seite testen
1. Öffne `https://baustein-pfadivoels.pages.dev/verwaltung.html`
2. Dein Admin-Passwort eingeben
3. Die Testbestellung sollte in der Liste auftauchen
4. Trage deine Bankdaten ein (IBAN, BIC)
5. Klick auf 🧾 bei einer Bestellung → Rechnung mit QR-Code sollte erscheinen

---

## Schritt 12: Custom Domain einrichten (baustein.pfadivoels.at)

### Option A: pfadivoels.at wird BEREITS über Cloudflare verwaltet
Super einfach:
1. Dashboard → Workers & Pages → baustein-pfadivoels → Custom domains
2. "Set up a custom domain" klicken
3. `baustein.pfadivoels.at` eingeben
4. Cloudflare setzt den DNS-Eintrag automatisch
5. Fertig! (SSL-Zertifikat wird auch automatisch erstellt)

### Option B: pfadivoels.at liegt bei einem ANDEREN DNS-Provider
1. Dashboard → Workers & Pages → baustein-pfadivoels → Custom domains
2. `baustein.pfadivoels.at` eingeben
3. Cloudflare zeigt dir einen CNAME-Eintrag an, z.B.:
   ```
   baustein   CNAME   baustein-pfadivoels.pages.dev
   ```
4. Diesen CNAME-Eintrag bei eurem DNS-Provider setzen
   (z.B. bei All-Inkl, Strato, Hetzner, wo auch immer die Domain liegt)
5. Warten bis der DNS-Eintrag propagiert (kann bis zu 24h dauern, meist 5-30 Min)
6. SSL-Zertifikat wird automatisch erstellt

### Wo liegt pfadivoels.at?
Falls du nicht weißt, wo die Domain verwaltet wird, kannst du das rausfinden:
```bash
# Im Terminal:
dig pfadivoels.at NS
```
oder online: https://www.whatsmydns.net/#NS/pfadivoels.at

---

## Zusammenfassung: Die wichtigsten Befehle

```bash
# Lokal testen
npm run dev                    # → http://localhost:8788

# Deployen
npx wrangler pages deploy public --branch production

# Datenbank anschauen
npx wrangler d1 execute baustein-db --remote --command "SELECT * FROM orders"

# Logs ansehen (bei Problemen)
npx wrangler pages deployment tail --project-name baustein-pfadivoels
```

---

## Problembehandlung

### "Error: D1_ERROR" oder leere Bestellliste
→ D1-Binding vergessen! Schritt 8 nochmal prüfen.

### "401 Nicht autorisiert" auf der Admin-Seite
→ ADMIN_TOKEN nicht gesetzt oder falsches Passwort. Schritt 9 wiederholen.

### Bestellformular zeigt Fehler
→ Öffne die Browser-Konsole (F12 → Console) und schau nach der Fehlermeldung.

### Seite lädt, aber keine Bilder
→ Prüfe ob bp-artwork.jpeg und pfadiheim.jpeg im public/ Ordner liegen.

### Custom Domain zeigt "DNS not configured"
→ CNAME-Eintrag prüfen. Kann bis zu 24h dauern.

---

## Spätere Änderungen deployen

Wenn du Texte, Bilder oder Code änderst:

```bash
# Einfach nochmal deployen
cd baustein-cf
npx wrangler pages deploy public --branch production
```

Das wars – Cloudflare ersetzt die alte Version automatisch.
