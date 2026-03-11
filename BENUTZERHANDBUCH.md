# Benutzerhandbuch – Bausteinaktion Verwaltung

## Anmelden

1. Öffne **baustein.pfadivoels.at/verwaltung.html**
2. Gib das Admin-Passwort ein und klicke **Einloggen**

Das Passwort bleibt für die Browser-Sitzung gespeichert (bis du den Tab schließt).

---

## Übersicht

Nach dem Login siehst du:

- **Statistiken** oben: Anzahl Bestellungen, bestellte Drucke, bezahlte Bestellungen, Einnahmen
- **Bestelltabelle** mit allen Bestellungen (neueste zuerst)
- **Suchfeld** zum Filtern nach Name, E-Mail oder Anmerkung

---

## Bestellungen verwalten

Jede Bestellung hat rechts Aktions-Buttons:

| Button | Bedeutung | Wann sichtbar |
|--------|-----------|---------------|
| **✓** | Als **bezahlt** markieren | Nur bei offenen Bestellungen |
| **📦** | Als **versendet** markieren | Nur bei bezahlten Bestellungen |
| **🧾** | Rechnung **anzeigen/drucken** | Immer |
| **📧** | Rechnungs-E-Mail **senden** | Immer |
| **✏️** | Bestellung **bearbeiten** | Immer |
| **🗑️** | Bestellung **löschen** | Immer |

### Status-Ablauf einer Bestellung

```
Offen  →  Bezahlt  →  Versendet
 (✓)        (📦)
```

---

## Rechnung anzeigen / drucken (🧾)

1. Klicke **🧾** bei der gewünschten Bestellung
2. Die Rechnung wird mit QR-Code zum Bezahlen angezeigt
3. Klicke **Drucken / PDF** um sie zu drucken oder als PDF zu speichern
4. Zum Schließen: **Schließen** klicken oder **Esc** drücken

---

## Rechnungs-E-Mail senden (📧)

Sendet dem Kunden eine E-Mail mit einem Link zu seiner Online-Rechnung (inkl. QR-Code für Banküberweisung).

1. Klicke **📧** bei der gewünschten Bestellung
2. Bestätige mit **OK**
3. Der Kunde erhält eine zweisprachige E-Mail (Deutsch + Englisch) mit dem Rechnungslink

**Hinweis:** Der Button kann beliebig oft geklickt werden – die E-Mail wird jedes Mal neu gesendet (z.B. wenn der Kunde sie nicht bekommen hat).

---

## Weltweit-Bestellungen (Sonderfall)

Bei weltweitem Versand sind die Versandkosten **nicht automatisch bekannt**. Der Ablauf ist:

### 1. Bestellung geht ein
Der Kunde bekommt eine Bestätigungs-E-Mail **ohne Kosten** mit dem Hinweis: *„Die Versandkosten werden wir dir in einer separaten E-Mail mitteilen."*

### 2. Versandkosten eintragen
1. Klicke **✏️** (Bearbeiten) bei der Bestellung
2. Trage die ermittelten **Versandkosten** im Feld „Versandkosten (€)" ein
3. Klicke **Speichern**

### 3. Rechnungs-E-Mail senden
1. Klicke **📧** bei der Bestellung
2. Der Kunde erhält jetzt die Rechnung mit den korrekten Versandkosten

**Wichtig:** Der 📧-Button blockiert bei Weltweit-Bestellungen solange die Versandkosten noch 0 sind – damit nicht versehentlich eine Rechnung ohne Versandkosten verschickt wird.

---

## Bestellung bearbeiten (✏️)

Hier kannst du alle Felder einer Bestellung ändern:

- **Name, E-Mail, Anzahl** – Kundendaten korrigieren
- **Zustellung** – Versandart ändern (Versandkosten werden automatisch angepasst)
- **Stückpreis (€)** – Preis pro Druck anpassen (Mindestpreis: € 30). Nützlich wenn jemand mehr spenden möchte (z.B. € 100 statt € 30)
- **Versandkosten** – Manuell überschreiben (besonders für Weltweit-Bestellungen)
- **Adresse** – Lieferadresse
- **Status** – Offen / Bezahlt / Versendet
- **Anmerkung** – Interne Notizen

---

## Neue Bestellung manuell anlegen

1. Klicke **+ Neue Bestellung**
2. Fülle die Felder aus (Vor- und Nachname sind Pflicht, E-Mail ist optional)
3. Bei Bedarf den **Stückpreis** anpassen (z.B. € 100 für eine größere Spende)
4. Klicke **Speichern**

Wenn eine E-Mail-Adresse angegeben ist, werden Bestätigungs-E-Mails automatisch verschickt. Ohne E-Mail wird die Bestellung nur intern gespeichert.

---

## CSV Export

Klicke **📥 CSV Export** um alle Bestellungen als CSV-Datei herunterzuladen (z.B. für Excel oder die Buchhaltung).

---

## Was der Kunde sieht

### Bei Bestellung (automatisch)
- **Österreich / EU / Abholung:** E-Mail mit Bestelldetails, Kosten und Link zur Online-Rechnung
- **Weltweit:** E-Mail mit Bestelldetails, *ohne* Kosten, Hinweis auf separate E-Mail

### Bei Rechnungs-E-Mail (📧-Button)
- E-Mail mit Kostenübersicht und Link zur Online-Rechnung
- Die Online-Rechnung zeigt: Positionen, Gesamtbetrag, Bankdaten, QR-Code zum Bezahlen

Alle Kunden-E-Mails sind **zweisprachig** (Deutsch + Englisch).
