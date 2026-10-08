# disco.games

Startsida för disco.games: en lista över spelen och en informationssida per spel.
Ren statisk HTML och CSS, ingen build.

- `index.html` – startsidan (www.disco.games)
- `guess-the-career.html` – informationssida för Guess the Career (/guess-the-career)
- `style.css` – delad stil
- `sitemap.xml`, `robots.txt` – för sökmotorer
- `vercel.json` – rena adresser (utan .html)

## Lägga till ett nytt spel
1. Kopiera `guess-the-career.html` till en ny fil och byt texten, titel, beskrivning, canonical-adress och JSON-LD.
2. Lägg till ett kort i `index.html` (och i ItemList-listan i JSON-LD).
3. Lägg till sidan i `sitemap.xml`.
