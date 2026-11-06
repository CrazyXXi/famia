# FamIA

Application d'information et d'aide à la planification familiale (React + Vite).
Un seul parcours, cinq espaces : **Accueil**, **Discuter**, **Jouer**, **Les centres**, **Rendez-vous**.

```bash
npm install
cp .env.example .env   # puis renseigne ANTHROPIC_API_KEY
npm run server         # API + Claude, http://localhost:8787 (terminal 1)
npm run dev            # http://localhost:5173 (terminal 2)
npm test               # tests unitaires
npm run build          # production -> dist/
```

## Fonctionnalités

- **Discuter** : assistant anonyme (texte ou voix), réponses dans la langue choisie, voix désactivée par défaut.
- **Jouer** : vrai ou faux, quiz éclair, « Le bon choix » (mises en situation), points, niveaux et badges (pensé pour les élèves de 3ème).
- **Les centres** : 541 centres de santé du Bénin (OpenStreetMap), carte, distance, itinéraire.
- **Rendez-vous** : réservation sans nom, avec un code à présenter à l'accueil (démonstration : le centre n'est pas encore relié).

## Architecture

- `src/components/app/` : AppShell (cadre + navigation), Chat, Games, Pages (accueil, centres, rendez-vous), Widgets (carte, réservation).
- `src/lib/guard.js` : anonymisation, requêtes à risque, contrôle de sortie. `src/lib/engine.js` : repli local.
- `src/lib/game.js` + `src/context/GameContext.jsx` : points, niveaux, badges (stockés sur l'appareil).
- `src/data/` : base de connaissances (`kb.js`), cartes, contenu du jeu (`game.js`), centres (`centres-bj.json`, régénérable avec `node scripts/fetch-centres.mjs`).
- `server/` : proxy sécurisé vers Claude (clé API côté serveur), prompt, repli sur la base locale.

## À valider avant déploiement

- Tout le contenu médical et éducatif (`kb.js`, `cards.js`, `game.js`) par un professionnel de santé.
- Les données des centres (incomplètes : peu de téléphones et d'horaires).
- La réservation réelle nécessite une convention avec les centres et un service de réservation.

## Licences et sources

- Données des centres de santé : © contributeurs OpenStreetMap (licence ODbL), carte © OpenStreetMap.
- Polices (hébergées dans `public/fonts/`) : Unbounded, Figtree, Share Tech Mono, licence SIL Open Font License.
- Horizon et TT Norms (payantes) ne sont pas incluses : voir `public/fonts/LISEZ-MOI.txt`.
