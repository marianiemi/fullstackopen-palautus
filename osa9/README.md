# Osa 9 Typescript

## CALCULATOR

### 9.1-9.7 Calculators

    - BMI-laskuri (CLI + HTTP)
    - Exercise calculator (CLI + HTTP)
    - Express + TypeScript
    - ESLint + strict TypeScript -asetukset

## PATIENTOR

### 9.8.-9.9 Patientor backend

    - TypeScript-projekti (tsc)
    - ESLint konfiguroitu kurssin materiaalin mukaisesti (ESLint 9, flat config)
    - Express-backend
    - Ping-endpoint frontendin testausta varten

### 9.10-9.11

    - Lisätty data data/diagnoses.ts ja data/patients.ts
    - GET /api/diagnoses (Diagnosis-tyyppi, latin?)
    - GET /api/patients palauttaa potilaat ilman ssn-kenttää (Omit<Patient, "ssn">)
    - Rakenne materiaalin mukaisesti: src/types, src/services, src/routes

### 9.12-9.13

    - POST /api/patients potilaan lisäämistä varten
    - Potilaille generoidaan uuid-pohjainen string-id backendissä
    - Request body -parsinta ja validointi (unknown, type narrowing, type guardit)
    - Gender refaktoroitu enum-tyypiksi

### 9.14

    - POST /api/patients -request body validoidaan Zodilla

    - Manuaalinen validointi korvattu schema + .parse() -ratkaisulla
    - .strict() estää ylimääräiset kentät
    - Virheissä palautetaan 400 + Zod issues

## HALF-STACK

### 9.15

    - Luotu Vite React + TypeScript -sovellus
    - Jaettu App kolmeen komponenttiin (Header, Content, Total)
    - Props-tyypitys TypeScriptilla

### 9.16

    - Määritelty CoursePart discriminated union (kind)
    - Poistettu duplikaatio base-rajapinnan avulla
    - Renderöinti switch + type narrowing
    - Exhaustive check assertNever
    - Lisätty uusi special-tyyppi

## FLIGHT DIARY

### 9.17

    - GET /api/diaries → NonSensitiveDiaryEntry[]
    - Axios-service + useEffect-haku
    - Diaryt renderöity listana
    - CORS käyttöön backendissä
    - TypeScript + ESLint kunnossa
