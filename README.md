# Bausteinaktion – Pfadfinder*innengruppe Völs

Website und Bestellsystem für die Bausteinaktion der Pfadis Völs: Verkauf von handsignierten Kunstdrucken zur Finanzierung des neuen Pfadiheimsdachs.

**Live:** [baustein.pfadivoels.at](https://baustein.pfadivoels.at)

## Tech Stack

- **Frontend:** Statisches HTML/CSS/JS (zweisprachig DE/EN)
- **Backend:** Cloudflare Pages Functions (Workers)
- **Datenbank:** Cloudflare D1 (SQLite)
- **E-Mail:** Mailjet (transaktionale E-Mails)
- **Spam-Schutz:** Cloudflare Turnstile

## Lokale Entwicklung

```bash
npm install
npm run db:init    # Lokale DB initialisieren
npm run dev        # Dev-Server auf http://localhost:8788
```

Lokale Secrets in `.dev.vars` (nicht im Repo):
```
ADMIN_TOKEN=admin
```

## Deployment

```bash
npx wrangler pages deploy public --branch production
```

Siehe [DEPLOYMENT.md](DEPLOYMENT.md) für die vollständige Ersteinrichtung.

## Dokumentation

- [DEPLOYMENT.md](DEPLOYMENT.md) – Setup & Deployment-Anleitung
- [BENUTZERHANDBUCH.md](BENUTZERHANDBUCH.md) – Admin-Verwaltung Bedienungsanleitung
