# Devies Reads Frontend

En frontend-applikation byggd med **React**, **Vite** och **Tailwind CSS** för att konsumera Devies Reads backend. 

## Funktioner

- **Utforska böcker**  
  Lista alla böcker med sortering på namn, mest lästa, högst betyg med mera.  
- **Bokdetaljer**  
  Se titel, omslagsbild, genre, beskrivning och genomsnittligt betyg.  
- **Personlig bokhylla**  
  Lägg till böcker i tre statusar: Vill läsa, Läser, Läst.  
- **Betygsättning**  
  Ge varje bok ett eget betyg 1–5 och se både ditt betyg och genomsnittsbetyget.  
- **Autentisering**  
  Registrera konto och logga in via JWT; sessionen sparas lokalt i `localStorage`.  
- **Sida “Mina böcker”**  
  Visa alla böcker du lagt till i din personliga bokhylla.

## Kom igång

1. Klona projektet  
  
    git clone git@github.com:sebholmqvist/devies-reads-frontend.git
    cd devies-reads-frontend
  

2. Installera beroenden  
  
    npm install


3. Starta utvecklingsservern  
  
    npm run dev


4. Öppna i webbläsaren  
    Gå till `http://localhost:5173/`

## Bygga för produktion

För att skapa en optimerad produktionsbuild:

npm run build
