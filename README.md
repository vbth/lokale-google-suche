# Lokale Google Suche

Ein lokales Werkzeug zur Simulation von Google-Suchanfragen aus verschiedenen Ländern, Sprachen und auf verschiedenen Geräten.

## Funktionen

*   **Lokale Suche**: Simuliere Suchanfragen, als wärst du in einem anderen Land (z.B. USA, Japan, Frankreich).
*   **Sprachwahl**: Wähle die Sprache der Suchergebnisse.
*   **Google Domains**: Unterstützung für über 150 Google-Domains (z.B. `google`, `google.com`).
*   **Geräte-Simulation**:
    *   **Desktop**: Standard-Suche mit klickbaren Links.
    *   **Mobil**: Simuliert ein iPhone (User Agent), um mobile Suchergebnisse zu sehen.
    *   **AdTest Modus**: Optional zuschaltbar für exakte Mobile-Simulation (Hinweis: Links sind in diesem Modus oft nicht klickbar).
*   **Präziser Standort (UULE)**: Gib eine Stadt ein (z.B. "Berlin"), und das Tool generiert den exakten Standort-Parameter für Google.
*   **Such-Verlauf**: Speichert deine letzten Einstellungen (Query, Land, Gerät, etc.) lokal im Browser.
*   **Datenschutz**: Alles läuft 100% lokal in deinem Browser. Es werden keine Daten an Dritte gesendet (außer natürlich die Suchanfrage an Google selbst).

## Installation & Nutzung

### Option 1: Lokal nutzen
Einfach die Datei `index.html` in deinem Browser öffnen.

### Option 2: Hosting (Kostenlos)
Dieses Tool besteht nur aus statischen Dateien (HTML, CSS, JS) und kann sehr einfach online gestellt werden:
## Lizenz

Dieses Projekt steht unter der [CC0 1.0 Universal](LICENSE) Lizenz. Es ist gemeinfrei, du kannst den Code also nach Belieben kopieren, verändern und nutzen.
*   **Netlify**: Ziehe den Projektordner einfach in den "Drop"-Bereich auf netlify.com.
*   **GitHub Pages**: Lade den Code auf GitHub hoch und aktiviere "Pages" in den Einstellungen.

## Dateien
*   `index.html`: Die Benutzeroberfläche.
*   `script.js`: Die Logik für URL-Generierung, Verlauf und Einstellungen.
*   `data.js`: Listen für Länder, Sprachen und Domains.
*   `style.css`: Das Design (inkl. Dark Mode).

## Lizenz
Creative Commons Zero v1.0 Universal