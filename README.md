# 📚 Elementari - App Compiti

Un'app divertente e colorata per aiutare i bambini delle elementari con i compiti!

Costruita con **Expo** (React Native) — funziona su iOS, Android e Web.

## 🎯 Materie

| Materia | Attività | Contenuti |
|---------|----------|-----------|
| 🔢 Matematica | 13 | Tabelline, operazioni, divisioni, problemi, geometria, equivalenze, numeri romani, orologio, confronta, doppio/metà |
| 📖 Italiano | 12+ | 7 ortografia, grammatica (4 topic), dettato, descrizione guidata, poesie |
| 🦕 Storia | 4 | Animali preistorici, storia d'Italia (timeline), 2 quiz |
| 🔬 Scienze | 3 | Sistema Solare (9), corpo umano (5 organi), quiz |
| 🌍 Geografia | 2 | 20 regioni d'Italia, quiz |
| 🇬🇧 Inglese | 2 | 95+ parole in 9 categorie, quiz |
| 🏛️ Ed. Civica | 3 | Diritti dei bambini, regole civili, quiz |
| 📝 Compiti | 1 | Checklist giornaliera con salvataggio locale |

**Totale: 40+ schermate interattive!**

## 🚀 Come usare

```bash
# Installa le dipendenze
npm install

# Avvia con Expo Go
npx expo start

# Export per web
npx expo export --platform web
```

## 🛠️ Tecnologie

- Expo SDK 55 + expo-router
- React Native con Animated API
- AsyncStorage per persistenza locale
- Nessun modulo nativo — funziona con Expo Go!

## 🎨 Design

- UI completamente in italiano 🇮🇹
- Colori vivaci per materia
- Pulsanti grandi e aree touch ampie
- Emoji e animazioni per feedback
- Pensato per bambini di 9 anni

## 📁 Struttura

```
app/
  index.js              # Home screen
  compiti.js            # Checklist compiti
  matematica/           # 13 attività matematica
  italiano/             # Ortografia, grammatica, dettato, poesie
  storia/               # Preistoria, timeline, quiz
  scienze/              # Pianeti, corpo umano, quiz
  geografia/            # Regioni, quiz
  inglese/              # Vocabolario, quiz
  civica/               # Diritti, regole, quiz
constants/
  theme.js              # Colori e stili
data/
  *.js                  # Dati per ogni materia
```
