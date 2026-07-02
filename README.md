# Mon Cahier de Budget

Application de suivi de budget personnel, simple et privée : toutes les données restent sur votre appareil (aucun serveur, aucun compte requis).

**Votre historique 2024-2025-2026 (2189 opérations) est déjà intégré** dans ce fichier `app.js`. Il se charge automatiquement la toute première fois que vous ouvrez le site, dans le navigateur que vous utilisez à ce moment-là.

⚠️ **Si vous avez déjà testé une version précédente de l'app et ajouté une opération manuellement**, videz les données de ce site avant de mettre en ligne la nouvelle version, sinon l'historique importé ne se chargera pas (l'app détecte des données existantes et ne les écrase pas, pour ne jamais effacer votre travail). Pour cela : clic droit sur la page → Inspecter → onglet "Application" (ou "Stockage") → "Local Storage" → supprimer l'entrée `cahierBudget_v1`. Dites-moi si vous préférez que je vous simplifie cette étape.

## Mettre le site en ligne avec GitHub Pages (aucune installation, aucun terminal)

1. Allez sur **github.com**, ouvrez votre dépôt (ou créez-en un nouveau : bouton vert **"New"** en haut à droite → donnez-lui un nom, par ex. `mon-budget` → **Create repository**).
2. Dans le dépôt, cliquez sur **"Add file" → "Upload files"**.
3. Glissez-déposez les 3 fichiers : `index.html`, `style.css`, `app.js`.
4. En bas de page, cliquez sur **"Commit changes"** (le bouton vert).
5. Allez ensuite dans **"Settings"** (onglet en haut du dépôt) → menu **"Pages"** dans la colonne de gauche.
6. Sous **"Build and deployment"**, à **"Branch"**, choisissez **`main`** et dossier **`/ (root)`**, puis **Save**.
7. Attendez 1 à 2 minutes, puis rafraîchissez la page : une adresse apparaît en haut, du type
   `https://votre-nom-utilisateur.github.io/mon-budget/`
   C'est votre application, accessible depuis n'importe quel appareil (Mac, téléphone…).

## Mettre à jour l'application plus tard

Quand je vous donnerai des fichiers modifiés (nouvelles fonctionnalités), il suffira de refaire l'étape **"Add file" → "Upload files"** en re-glissant les fichiers mis à jour : GitHub les remplacera automatiquement.

## Important à savoir

- Les données (vos dépenses, vos catégories) sont stockées **dans le navigateur**, sur l'appareil que vous utilisez. Si vous ouvrez le site depuis votre téléphone ET votre ordinateur, ce sont deux historiques séparés pour l'instant (on pourra synchroniser plus tard si besoin).
- Si vous videz le cache / les données de navigation de votre navigateur, l'historique sera perdu — pensez à ne pas le faire sur ce site, ou dites-le moi pour qu'on ajoute un export/import de secours.
