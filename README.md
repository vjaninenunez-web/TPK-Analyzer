# TPK Analyzer

Mobile-first PWA to record and predict final board outcomes based on the first flip card. Casino-themed.

## Features
- Fast shorthand inputs (HC, 2P, 3K, FH)
- Mobile touchscreen UI
- Stores data in localStorage
- Offline-capable (service worker)

## Files
- `index.html` — main UI
- `style.css` — casino theme
- `script.js` — logic and storage
- `service-worker.js` — offline cache
- `manifest.json` — PWA manifest

## Quick deploy to GitHub Pages
1. Create a new public repo named `TPK-Analyzer` on GitHub.
2. `git init && git add . && git commit -m "Initial"`
3. `git remote add origin https://github.com/<your-username>/TPK-Analyzer.git`
4. `git push -u origin main`
5. In the repo settings -> Pages -> set the branch to `main` and folder `/ (root)` then Save.
6. After a minute your site will be available at `https://<your-username>.github.io/TPK-Analyzer/`.

## Install on iPhone
Open the site in Safari, tap Share → Add to Home Screen.

## Notes
- Data is stored per-browser (localStorage). If you clear site storage the records will be lost.
- If you want CSV export/import, I can add it.
