# osa 5 Blogilista frontendin päivitys ja testit

## 5.1–5.4

- Kirjautuminen frontendissä
- Tokenin tallennus sovelluksen tilaan
- Kirjautumisen pysyvyys localStoragen avulla
- Notifikaatiot onnistuneille ja epäonnistuneille toiminnoille

## 5.5–5.6

- Uuden blogin luontilomake näytetään vain painikkeesta
- Lomake eriytetty omaksi komponentikseen
- Lomakkeen tila siirretty komponentin vastuulle

## 5.7–5.8

- Blogien yksityiskohtainen näkymä (view / hide)
- Like-toiminnallisuus PUT-pyynnöllä backendille

## 5.9

- Korjattu blogin lisänneen käyttäjän katoaminen like-operaation jälkeen

## 5.10

- Blogit järjestetty likejen mukaan laskevaan järjestykseen

## 5.11

- Blogien poistaminen
- Poiston varmistus
- Poistonappi näkyy vain blogin lisänneelle käyttäjälle

## 5.12

- Lisätty ESLint ja korjattu virheet

### 5.12

- ESLint konfiguroitu ja lint-virheet korjattu

### 5.13–5.16

- Blog-komponentin testit (näkyvyys, view, like)
- BlogForm-komponentin testi
- Vitest + React Testing Library käytössä

### 5.17–5.20
- End-to-end-testit Playwrightilla
- Testattu:
  - kirjautuminen onnistuneilla ja virheellisillä tunnuksilla
  - uuden blogin luominen
  - blogin likettäminen


## Käynnistys

Asenna riippuvuudet:

```bash
npm install
Käynnistä sovellus kehitystilassa:

bash
Kopioi koodi
npm run dev
Aja frontendin yksikkötestit:

bash
Kopioi koodi
npm test
Aja end-to-end-testit:

bash
Kopioi koodi
npm run test:e2e

## Käynnistys

```bash
npm install
npm run dev
```
