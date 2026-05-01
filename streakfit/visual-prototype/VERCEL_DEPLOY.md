# Deploying StreakFit To Vercel

## Option A: Import The GitHub Repo Root

Use this if you import `https://github.com/smb1947/vibing/` directly into Vercel.

The repo-level `vercel.json` is already configured to:

- install dependencies in `prototype/visual-prototype`
- run the Vite build
- deploy `prototype/visual-prototype/dist`

Vercel should use:

- Framework preset: `Other` or auto-detected
- Build command: handled by `vercel.json`
- Output directory: handled by `vercel.json`

## Option B: Set Root Directory To The App

Use this if Vercel asks for the app folder.

Set:

- Root directory: `prototype/visual-prototype`
- Framework preset: `Vite`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

The app-level `vercel.json` also includes the SPA rewrite to `index.html`.

## Local Build Check

From `prototype/visual-prototype`:

```bash
npm ci
npm run build
```
