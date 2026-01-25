# OSA 6 Redux

### 6.1–6.2 Unicafe

- Redux-reducer Unicafe-sovellukselle (good / ok / bad)
- Reducerin testaus
- UI: Palautteen antaminen ja tilastojen nollaus

### 6.3-6.8 Anekdootit

- Anekdoottien äänestysmahdollisuus (äänet Redux-storessa)
- Uusien anekdoottien lisäys (ei-kontrolloitu lomake)
- Anekdootit järjestyksessä äänten mukaan
- Action creatorit reducerissa
- Komponentit eriytetty: AnecdoteForm ja AnecdoteList

### 6.9–6.13 Anekdootit jatkuu

- Suodatus Redux-storessa
- Redux Toolkit käyttöön
- Reducerit createSlice-muodossa
- Notifikaatiot äänestyksestä ja luomisesta

### 6.9–6.15 Anekdootit ja backend

- Json Server ja FetchAPI
- Anekdoottien tallenus backendiin
- Anekdoottien haku backendistä

### 6.16–6.19 Anekdootit ja Redux Thunk

- Asynkroniset actionit Redux Thunkilla
- Backend-kommunikointi siirretty action creatoreihin
- Äänestyksen ja luonnin tallennus backendiin
- Keskitetty notifikaatio thunk-actionilla

### 6.20–6.24 Anekdootit ja React Query

- Anekdoottien haku palvelimelta React Queryllä
- Uusien anekdoottien luonti ja äänestäminen mutaatioilla
- Automaattinen näkymän päivitys query invalidoinnilla
- Virhetilanteiden käsittely (backend ei saatavilla, liian lyhyt anekdootti)
- Notifikaatiot useReducerin ja contextin avulla
