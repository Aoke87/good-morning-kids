# Stimme für die Ansagen: Web Speech vs. vorgerenderte Audiodateien

Stand: 08.10.2026. Ziel ist, die roboterhafte `speechSynthesis`-Ausgabe aus `src/sound.ts` (`speak()`, erste `de`-Stimme, Pitch 1.25, Rate 0.95) durch eine natürlichere Stimme zu ersetzen. Die App läuft als PWA in Chrome auf einem Android-Tablet und muss offline funktionieren.
Was sich nicht aus einer Primärquelle belegen ließ, ist als **nicht verifiziert** markiert. Mit **Einschätzung** markierte Aussagen sind subjektive Bewertungen und keine Fakten.

## 0. Ausgangslage: die festen Sätze

Alle Ansagen sind fest in `src/constants.ts` hinterlegt: 12 × `TASK_CATALOG[].speech` plus `SPEECH.WAKE_UP`, `SPEECH.ALL_DONE` und `SPEECH.TIME_TO_GO`. Das sind **15 Sätze mit zusammen 490 Zeichen** (inkl. Leerzeichen, per Skript gezählt). Aufgerufen wird `speak()` an vier Stellen in `src/App.tsx` (Zeilen 71, 95, 100 und 113).

## 1. Web Speech API auf Android-Chrome

### Welche „Stimmen“ liefert `getVoices()`?

- **Pro Sprache gibt es genau eine Stimme, nicht mehrere.** Chromium fragt auf Android nicht die einzelnen Android-`Voice`-Objekte ab. Stattdessen geht es alle `Locale.getAvailableLocales()` durch und legt für jede Locale, für die `isLanguageAvailable(locale) > 0` gilt, einen Eintrag an. Als Name dient `getDisplayLanguage()` plus `getDisplayCountry()`, als `lang` dient `locale.toString()` ([TtsPlatformImpl.java, Z. 161–172](https://github.com/chromium/chromium/blob/e017e5572f0fca35f5920ed4161367bd58824ab3/content/public/android/java/src/org/chromium/content/browser/TtsPlatformImpl.java#L161-L172)).
  - Ein deutscher Eintrag heißt deshalb je nach Systemsprache z. B. „Deutsch Deutschland“ und hat `lang` = `de_DE`, also mit Unterstrich.
  - Varianten wie männlich/weiblich tauchen nicht als eigene Einträge auf. Locales mit Variant werden sogar übersprungen (`if (!locale.getVariant().isEmpty()) continue;`, ebd.).
- **`voiceURI` ist gleich `name`**, und `localService` wird aus `!remote` gebildet ([speech_synthesis_impl.cc, Z. 110–113](https://github.com/chromium/chromium/blob/e017e5572f0fca35f5920ed4161367bd58824ab3/content/browser/speech/speech_synthesis_impl.cc#L110-L113)).
  - `remote` steht standardmäßig auf `false` ([tts_controller_impl.cc, Z. 144](https://github.com/chromium/chromium/blob/e017e5572f0fca35f5920ed4161367bd58824ab3/content/browser/speech/tts_controller_impl.cc#L144)), und der Android-Pfad setzt nur `native = true` ([tts_android.cc, Z. 124–141](https://github.com/chromium/chromium/blob/e017e5572f0fca35f5920ed4161367bd58824ab3/content/browser/speech/tts_android.cc#L124-L141)).
  - **Damit meldet Chrome auf Android `localService: true`, auch wenn die Engine intern eine Netzwerkstimme verwendet.** Laut Spec soll das Flag lokale und entfernte Stimmen unterscheiden ([MDN localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService)). Auf Android ist es dafür also nicht aussagekräftig.
- **Die Web-App kann den Klang nicht steuern.** Beim Sprechen ruft Chromium nur `setLanguage(...)`, `setSpeechRate` und `setPitch` auf ([Z. 213–235](https://github.com/chromium/chromium/blob/e017e5572f0fca35f5920ed4161367bd58824ab3/content/public/android/java/src/org/chromium/content/browser/TtsPlatformImpl.java#L213-L235)).
  - `setLanguage` setzt laut Android-Doku „the current voice to the default one for the given Locale“ ([AOSP TextToSpeech.java, Z. 1563–1578](https://github.com/aosp-mirror/platform_frameworks_base/blob/main/core/java/android/speech/tts/TextToSpeech.java#L1563-L1578)).
  - Welche Stimme tatsächlich spricht, bestimmen also die **Android-Einstellungen** (Bedienungshilfen → Text-in-Sprache: Engine, Sprache, Rate, Tonhöhe, Sprachdaten installieren, [Google-Hilfe](https://support.google.com/accessibility/android/answer/6006983?hl=en)).
  - Eine Auswahl per `voice.name` im Code bringt auf Android nichts.
- Android selbst kennt pro Stimme die Qualität (`QUALITY_VERY_LOW` = 100 … `QUALITY_VERY_HIGH` = 500) und `isNetworkConnectionRequired()` ([Voice.java](https://github.com/aosp-mirror/platform_frameworks_base/blob/main/core/java/android/speech/tts/Voice.java#L35-L47)). **Chrome reicht diese Werte nicht an die Web-API weiter** (siehe oben).
- Ob die Google-Sprachdienste online eine Netzwerkstimme bevorzugen und offline auf eine lokale zurückfallen, ist **nicht verifiziert**. Google dokumentiert das nicht öffentlich.
- **Asynchrones Laden:** Unter Android füllt Chromium die Liste in einem `AsyncTask` und löst danach `voicesChanged` aus ([Z. 152–198](https://github.com/chromium/chromium/blob/e017e5572f0fca35f5920ed4161367bd58824ab3/content/public/android/java/src/org/chromium/content/browser/TtsPlatformImpl.java#L152-L198)). Ein früher Aufruf von `getVoices()` kann deshalb leer sein. MDN zeigt dafür das Muster mit `onvoiceschanged` ([MDN getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)).
  - Für `speak()` ist das unkritisch: Die App setzt zusätzlich `utterance.lang = 'de-DE'`, und `voice.lang.startsWith('de')` passt auch auf `de_DE`.

**Fazit Web Speech:** Mehr Qualität lässt sich im Code nicht herausholen. Man kann nur am Tablet in den Android-Einstellungen die beste deutsche Google-Stimme auswählen und die Sprachdaten herunterladen. Als **Fallback** bleibt Web Speech sinnvoll.

## 2. Sätze einmal vorrendern und als Audiodateien ausliefern

Die Idee: Die 15 Sätze werden einmal am Rechner erzeugt, als Dateien unter `public/voice/` abgelegt und vom Service Worker vorab gecacht. Danach funktioniert die Ausgabe offline, ist auf jedem Gerät identisch und hängt nicht mehr von den Android-TTS-Einstellungen ab.

### 2.1 Piper TTS (lokal, Open Source)

- Die Entwicklung ist von `rhasspy/piper` nach [OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl) umgezogen ([alte README](https://github.com/rhasspy/piper)). Das Programm steht unter GPL-3.0 ([COPYING](https://github.com/OHF-Voice/piper1-gpl/blob/main/COPYING)).
  - Installation: `pip install piper-tts`. Auf PyPI gibt es ein `win_amd64`-Wheel ([PyPI piper-tts 1.8.0](https://pypi.org/project/piper-tts/)).
  - Aufruf: `python -m piper -m <voice> -f out.wav -- 'Text'` ([CLI.md](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/CLI.md)).
  - Ob die GPL auch für erzeugte Audiodateien gilt, regelt das Repo nicht: **nicht verifiziert**. Üblicherweise erfasst die GPL nur die Software.
- Hörproben: [piper-samples](https://rhasspy.github.io/piper-samples). Das Repo [rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices) ist als `license: mit` markiert ([README](https://huggingface.co/rhasspy/piper-voices/blob/main/README.md)). **Maßgeblich ist aber die Datensatz-Lizenz im jeweiligen MODEL_CARD.**

Deutsche Stimmen laut [voices.json](https://huggingface.co/rhasspy/piper-voices/blob/main/voices.json) und den MODEL_CARDs:

| Stimme | Qualität / Samplerate | Datensatz-Lizenz | Anmerkung |
|---|---|---|---|
| [thorsten](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/high/MODEL_CARD) | low, medium, **high** (22,05 kHz) | **CC0** | männlich ([Thorsten-Voice](https://github.com/thorstenMueller/Thorsten-Voice)) |
| [thorsten_emotional](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten_emotional/medium/MODEL_CARD) | medium, 8 Emotionen (u. a. `amused`, `surprised`, `neutral`) | **CC0** | männlich; „amused“ klingt eventuell freundlicher (**Einschätzung**) |
| [kerstin](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/kerstin/low/MODEL_CARD) | nur low (16 kHz) | **CC0** | die einzige weibliche Stimme mit klarer Lizenz |
| [mls](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/mls/medium/MODEL_CARD) | medium, 236 Sprecher | CC-BY 4.0 (Namensnennung) | Hörbuch-Sprecher |
| [ramona](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/ramona/low/MODEL_CARD), [eva_k](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/eva_k/x_low/MODEL_CARD) | low / x_low | M-AILABS, „See URL“ | Lizenz **nicht verifiziert** (caito.de nicht erreichbar) |
| [karlsson](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/karlsson/low/MODEL_CARD) | low | M-AILABS, „See URL“ | Lizenz **nicht verifiziert** |
| [pavoque](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/pavoque/low/MODEL_CARD) | low | **CC BY-NC-SA 4.0** | nicht-kommerziell und Share-Alike |

Bewertung: Piper läuft komplett offline, kostet nichts und hat für thorsten und kerstin eine saubere Lizenz. Die Stimmen klingen hörbar weniger natürlich als die Cloud-Stimmen in 2.3/2.4 (**Einschätzung**). Gute weibliche Stimmen gibt es nur in low-Qualität, eine Kinderstimme gibt es nicht.

### 2.2 Microsoft-Edge-„Vorlesen“ über `edge-tts`

- [`edge-tts`](https://github.com/rany2/edge-tts) (LGPLv3, [setup.cfg](https://github.com/rany2/edge-tts/blob/master/setup.cfg)) ruft den Online-Vorlesedienst von Microsoft Edge auf: `edge-tts --voice de-DE-KatjaNeural --text "…" --write-media x.mp3`. Eigenes SSML erlaubt der Dienst nicht, nur Rate, Lautstärke und Tonhöhe ([README](https://github.com/rany2/edge-tts#custom-ssml)).
- Live-Abfrage am 08.10.2026 mit `edge-tts --list-voices` (v7.2.8). Verfügbar sind nur: de-DE **Katja, Amala, Seraphina-Multilingual** (weiblich), **Conrad, Killian, Florian-Multilingual** (männlich), de-AT Ingrid/Jonas, de-CH Leni/Jan.
  - **GiselaNeural (Kinderstimme) bietet der Edge-Endpunkt nicht an**, sie gibt es nur in Azure (2.3).
- **Rechtsstatus:** Es gibt keine offizielle API. Das Paket gibt sich als Edge-Erweiterung aus: Es nutzt einen eingebetteten `TRUSTED_CLIENT_TOKEN`, setzt `Origin: chrome-extension://…` und einen Edge-User-Agent ([constants.py](https://github.com/rany2/edge-tts/blob/master/src/edge_tts/constants.py)).
  - Der [Microsoft-Servicevertrag](https://www.microsoft.com/en-us/servicesagreement) verbietet u. a. „circumvent any restrictions on access to, usage, or availability of the Services“ (§3.a.vi) und, Software zu „emulate … or reverse engineer“ (§8.b).
  - Eine Lizenz für die erzeugten Audiodateien wird nirgends erteilt.
  - **Einschätzung (keine Rechtsberatung):** Das ist eine Grauzone. Für Dateien, die man in ein öffentliches Repo committet, rate ich davon ab. Außerdem kann der Dienst jederzeit abgeschaltet oder geändert werden.

### 2.3 Azure AI Speech, Free Tier (F0)

- Im F0-Tarif sind für Neural-Stimmen **„0.5 million characters free per month“** enthalten ([Preisseite](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)). Bei 490 Zeichen ist das ein Bruchteil von 1 %. Ob HD/MAI-Stimmen im F0 enthalten sind, ist **nicht verifiziert**.
- Deutsche Stimmen ([Language support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)):
  - Standard: Katja, Amala, Elke, Klarissa, Louisa, Maja, Tanja (w); Conrad, Bernd, Christoph, Kasper, Killian, Klaus, Ralf (m).
  - **de-DE-GiselaNeural ist als „Female, Child“ gelistet** und die einzige deutsche Kinderstimme.
  - Dazu kommen Seraphina/Florian (Multilingual und DragonHD) sowie Mia/Klaus `MAI-Voice-2` mit den Stilen `happy`, `joyful`, `excited`, `softvoice` u. a.
  - Unter den Standardstimmen hat nur **Conrad** die Stile `cheerful` und `sad`.
- SSML: Mit `mstts:express-as style="cheerful" styledegree="0.01–2"` lässt sich der Stil steuern, mit `prosody rate/pitch` das Tempo und die Tonhöhe ([SSML-Doku](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice)).
- Zugang über REST `POST https://<region>.tts.speech.microsoft.com/cognitiveservices/v1` mit `Ocp-Apim-Subscription-Key`. Ausgabeformate u. a. `audio-24khz-48kbitrate-mono-mp3` und `ogg-24khz-16bit-mono-opus` ([REST-Referenz](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech)).
- Bedingungen: Der [Code of Conduct](https://learn.microsoft.com/en-us/legal/ai-code-of-conduct) verlangt, offenzulegen, dass die Stimme synthetisch ist, sodass niemand getäuscht wird. Hier genügt ein Satz im README.
  - Laut den Disclosure-Guidelines kann die Offenlegung minimal ausfallen, wenn der Kontext klar ist ([Guidelines](https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/speech-service/text-to-speech/concepts-disclosure-guidelines)).
  - Eine ausdrückliche Klausel, die das Weiterverbreiten der Audiodateien in einem öffentlichen Repo erlaubt, habe ich nicht gefunden: **nicht verifiziert**. Ein ausdrückliches Verbot habe ich ebenfalls nicht gefunden.
- Aufwand: Azure-Konto anlegen, eine Speech-Ressource (F0) erstellen und ein kleines Skript (PowerShell oder Node) schreiben. Ob für das Konto eine Kreditkarte nötig ist: **nicht verifiziert**.

### 2.4 Google Cloud Text-to-Speech

- Freikontingent pro Monat ([Preisseite](https://cloud.google.com/text-to-speech/pricing)): **Chirp 3: HD 1 Mio. Zeichen**, Neural2/Studio/Polyglot je 1 Mio., Standard/WaveNet je 4 Mio.
  - Abrechnungskonto ist Pflicht: „You must enable billing to use Text-to-Speech“.
  - SSML-Tags zählen mit, außer `<mark>`.
- Deutsche Stimmen ([Voice-Liste](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types)): **30 × Chirp3-HD** (z. B. Aoede, Kore, Leda w; Charon, Fenrir m), 3 × Chirp-HD, je 2 × Neural2/WaveNet/Studio/Standard, Polyglot-1. Alle sind nur als MALE/FEMALE geführt, **eine Kinderstimme gibt es nicht**.
- Bedingungen: Für Generative-AI-Dienste gilt „Generated Output is Customer Data … Google does not assert any ownership rights“ ([Service Terms §20](https://cloud.google.com/terms/service-terms)). Ob TTS in diese Kategorie fällt, ist **nicht verifiziert**. Untersagt ist, Output zum Trainieren konkurrierender Modelle zu verwenden (§17).

### 2.5 Offene Modelle mit Deutsch (kurz)

- **Kokoro-82M:** Apache-2.0. **Kein Deutsch.** Die Stimmenliste umfasst nur EN, JA, ZH, ES, FR, HI, IT und PT-BR ([VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)).
- **Coqui XTTS-v2:** kann Deutsch und Voice-Cloning, steht aber unter **CPML**: „allows only non-commercial use of a machine learning model and its outputs“ ([Model Card](https://huggingface.co/coqui/XTTS-v2), [LICENSE](https://huggingface.co/coqui/XTTS-v2/blob/main/LICENSE.txt)). Für ein privates Projekt ist das zulässig, die Lizenz ist aber restriktiv.
- **F5-TTS:** Der Code steht unter MIT, die **vortrainierten Modelle unter CC-BY-NC** ([README](https://github.com/SWivid/F5-TTS#license)). Deutsch gibt es nur über Community-Finetunes (**nicht verifiziert**).
- **Chatterbox Multilingual V3** (Resemble AI): **MIT**, 23 Sprachen inkl. Deutsch, Voice-Cloning über einen etwa 10 s langen Referenzclip. Jede Ausgabe trägt ein unhörbares PerTh-Wasserzeichen ([README](https://github.com/resemble-ai/chatterbox)). Für gute Ergebnisse braucht man eine GPU (**Einschätzung**).

### 2.6 Eltern sprechen selbst

Machbar mit Browser-Bordmitteln: `getUserMedia` plus `MediaRecorder` liefert die Aufnahme als `Blob`-Chunks über `dataavailable` ([MDN MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)). Die Blobs lassen sich in IndexedDB speichern ([MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)). Für 3- bis 5-Jährige ist das vermutlich die wärmste Stimme überhaupt (**Einschätzung**). Allerdings braucht es dafür eine Aufnahme-UI in den Eltern-Einstellungen, und die Aufnahmen landen nur auf diesem einen Gerät. Sinnvoll als spätere Erweiterung, nicht als erster Schritt.

## 3. Vergleich

| Option | Stimme(n) | Qualität | Kinderfreundlich | Lizenz/Kosten | Offline | Aufwand |
|---|---|---|---|---|---|---|
| Web Speech (Status quo) | eine pro Sprache, Wahl nur in den Android-Einstellungen | gering bis mittel, geräteabhängig | mäßig | kostenlos | ja, wenn die Sprachdaten installiert sind | keiner |
| Piper thorsten-high / kerstin-low | m (gut) / w (low) | mittel (**Einschätzung**) | mittel; thorsten_emotional „amused“ | CC0, kostenlos | ja | gering (pip, ein Skript) |
| edge-tts | Katja, Amala, Seraphina, Conrad … | hoch | gut, aber keine Kinderstimme | inoffiziell, ToS-Grauzone | ja (Dateien) | sehr gering |
| **Azure F0** | 14 Standardstimmen + **Gisela (Kind)** + HD/MAI | hoch | **sehr gut** (Kinderstimme, `cheerful`/`joyful`) | 0,5 Mio. Zeichen/Monat gratis, offizielle API | ja (Dateien) | gering bis mittel (Konto + Skript) |
| Google Cloud TTS | 30 × Chirp3-HD u. a. | hoch | gut, keine Kinderstimme | 1 Mio. Zeichen/Monat gratis, Abrechnungskonto nötig | ja (Dateien) | mittel |
| XTTS-v2 / F5 / Chatterbox | Voice-Cloning | hoch, schwankend | je nach Referenz | NC (XTTS, F5) bzw. MIT (Chatterbox) | ja (Dateien) | hoch (GPU, Python) |
| Eltern-Aufnahme | eigene Stimme | natürlich | **maximal** | kostenlos | ja | mittel (UI + IndexedDB) |

## 4. Empfehlung für diese App

**Vorrendern mit Azure AI Speech F0, Fallback auf `speechSynthesis`.** Die Gründe:

- Es ist eine offizielle API mit klaren Bedingungen. Mit 490 Zeichen pro Durchlauf bleibt man selbst bei vielen Probedurchläufen weit unter 0,5 Mio.
- Azure hat die einzige deutsche **Kinderstimme (Gisela)**. Für die Rolle „Erzählerin“ gibt es außerdem warme Erwachsenenstimmen (Katja, Amala), und mit SSML-Stilen lässt sich Fröhlichkeit dosieren.
  - Vorgehen: zwei oder drei Kandidaten (Gisela, Katja, MAI-Mia mit `joyful`) mit dem Kind probehören und dann festlegen.
- **Alternative ganz ohne Konto:** Piper `de_DE-thorsten-high` oder `thorsten_emotional` (CC0, Windows-Wheel vorhanden). Die Integration ist identisch, nur die Dateien kommen aus einer anderen Quelle.

Integration (minimal):

1. **Dateien:** `public/voice/task-<id>.mp3` für jede Task-ID, dazu `greeting.mp3`, `all-done.mp3` und `time-to-go.mp3`.
   - Das Präfix `task-` ist nötig, weil es die Task-ID `wakeUp` gibt und `SPEECH.WAKE_UP` sonst kollidieren würde.
   - Format: `audio-24khz-48kbitrate-mono-mp3`. MP3 spielt überall ([MDN Audio codecs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs)). Opus wäre kleiner, Chrome unterstützt es ab Version 33 (ebd.).
   - Größe grob 15 × 2–3 s × 6 KB/s ≈ 200–300 KB (**Schätzung**).
2. **Precache:** In `vite.config.ts` muss `globPatterns` um `mp3` erweitert werden. **Der Wert ersetzt den Default**, es müssen also alle Muster drinstehen ([vite-plugin-pwa static assets](https://vite-pwa-org.netlify.app/guide/static-assets.html)). Die Dateien aus `public/` landen im Build-Ordner und werden damit vom Muster erfasst.
3. **Wiedergabe:** über den bestehenden `AudioContext` in `sound.ts`. Die Datei wird per `fetch()` geladen, mit `ctx.decodeAudioData()` dekodiert ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData)), in einer `Map` gepuffert und als `AudioBufferSourceNode` an den vorhandenen `master`-Knoten gehängt.
   - Vorteile: Der Sound-Schalter (`enabled`), `unlockAudio()` und das Resume nach Standby greifen automatisch. Ein separates `<audio>`-Element bräuchte eigene Behandlung für Autoplay und Stummschalten.
4. **API:** `speak(text)` → `speak(key, fallbackText)`. Die vier Aufrufe in `App.tsx` übergeben den Dateischlüssel und den Text. Schlägt das Laden oder Dekodieren fehl, ruft `speak` wie bisher `speechSynthesis` mit dem Text auf.
5. **Erzeugung:** Ein kleines Node-Skript (z. B. `scripts/render-voice.mjs`) liest `TASK_CATALOG`/`SPEECH` und schreibt die Dateien. Es läuft nur bei Textänderungen, der Azure-Key kommt aus einer Umgebungsvariable und wird nicht committet. Die erzeugten MP3s werden committet.
6. **Hinweis im README:** „Sprachausgabe synthetisch erzeugt mit Azure AI Speech“ (Offenlegung laut Code of Conduct).

Übersprungen: Eltern-Aufnahme (2.6). Lohnt sich erst, wenn die synthetische Stimme beim Kind nicht ankommt.
