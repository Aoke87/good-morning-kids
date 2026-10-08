# Guten Morgen ☀️

Die Morgenroutine als Sonnenaufgang-Spiel für das Tablet im Querformat.

Die Sonne wandert auf einem Punkte-Bogen bis über die Haustür: Jeder Punkt steht für 5 Minuten, steht die Sonne über der Tür, geht es los. Jede erledigte Aufgabe weckt ein Tier auf der Wiese. Sind alle wach, gibt es ein Finale.

## Bedienung

| Wer | Was | Wie |
|---|---|---|
| Kind | Aufgabe erledigt | Plättchen antippen |
| Kind/Eltern | Versehentlich abgehakt | Gelbes Plättchen **lange drücken**, bis der Ring voll ist |
| Eltern | Einstellungen | Zahnrad oben links |
| Morgens | App starten | Schlafende Sonne antippen (schaltet Ton, Vollbild und „Bildschirm bleibt an“ ein) |

Der Fortschritt wird jeden Tag automatisch zurückgesetzt. An abgeschalteten Wochentagen zeigt die App nur eine ruhige Wiese.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173, auch im WLAN erreichbar (--host)
npm test         # Zeit-/Tageslogik
npm run build
```

> Hinweis: Auf diesem Rechner leiten die Umgebungsvariablen `NPM_CONFIG_REGISTRY`/`NPM_CONFIG__AUTH` npm auf den Firmen-Nexus um. Für dieses private Projekt vorher in der Shell `unset NPM_CONFIG_REGISTRY NPM_CONFIG_AUTH NPM_CONFIG__AUTH` ausführen; die Projekt-`.npmrc` zeigt dann auf npmjs.org.

## Auf das Tablet bringen (GitHub Pages)

1. Neues Repository auf GitHub anlegen und den Code auf `main` pushen.
2. Im Repository: **Settings → Pages → Source: GitHub Actions**.
3. Jeder Push auf `main` testet, baut und veröffentlicht automatisch (`.github/workflows/deploy.yml`). Die Adresse steht danach unter Settings → Pages, z. B. `https://<name>.github.io/<repo>/`.
4. Auf dem Android-Tablet die Adresse in **Chrome** öffnen → Menü ⋮ → **App installieren** (oder „Zum Startbildschirm hinzufügen“).
5. Optional gegen Rauswischen: Android-Einstellungen → Sicherheit → **App-Fixierung** (Bildschirm anheften) aktivieren und die App anheften.

Die App läuft danach offline. Updates kommen beim nächsten Öffnen mit Internet automatisch.

## Aufbau

```
src/
  App.tsx              Spielzustand, Ereignisse (Abhaken, Finale, Abfahrt)
  time.ts              Zeitfenster, Phasen (Nacht, Morgen, Los, Frei), Tageswechsel
  settings.ts          Einstellungen, Validierung gespeicherter Daten
  sound.ts             Web-Audio-Synthesizer, Vogel-Atmo, Tierrufe
  constants.ts         Alle Texte, Aufgabenkatalog, Zeiten
  components/          Plättchen, Tier-Hülle, Konfetti, Start-Ritual, Einstellungen
  themes/sunrise/      Alles Theme-spezifische: Szene, Tiere, Icons, Farben, CSS
```

Ein weiteres Theme ist ein neuer Ordner unter `themes/` mit denselben Exporten (`Scene`, `Sun`, `ANIMALS`, `TASK_ICONS`). Einen Theme-Wechsler in den Einstellungen gibt es erst, wenn es ein zweites Theme gibt.
