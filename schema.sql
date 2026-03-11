CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT    DEFAULT (datetime('now')),
  vorname    TEXT    NOT NULL,
  nachname   TEXT    NOT NULL,
  email      TEXT,
  anzahl     INTEGER NOT NULL DEFAULT 1,
  zustellung TEXT    NOT NULL DEFAULT 'versand_at',
  preis      REAL    NOT NULL DEFAULT 30,
  versand    REAL    DEFAULT 0,
  adresse    TEXT,
  land       TEXT,
  status     TEXT    DEFAULT 'offen',
  anmerkung  TEXT,
  invoice_token TEXT
);
