# 🎯 My Hobbies — GitHub Pages Site

A personal hobby hub built with plain HTML/CSS/JS. All hobby data lives in **`hobbies.json`**, so you can add new hobbies and sub-items without touching any code.

## 🚀 Run locally

Because the site loads `hobbies.json` via `fetch`, open it through a local server (not by double-clicking the file):

```bash
python -m http.server 8000
```

Then visit: http://localhost:8000

## ➕ Add a new hobby

Open `hobbies.json` and append a new object to the array:

```json
{
  "id": "photography",
  "name": "Photography",
  "icon": "📷",
  "description": "Capturing moments and learning composition.",
  "items": [
    { "title": "Street Photography", "notes": "Practicing candid shots around the city." }
  ]
}
```

- `id` must be unique, lowercase, no spaces (used in the URL, e.g. `#hobby/photography`)
- `icon` is any emoji

## ➕ Add items under an existing hobby

Find the hobby in `hobbies.json` and add to its `items` array:

```json
{ "title": "Spanish", "notes": "Started Duolingo streak — 30 days!" }
```

## 🌐 Deploy to GitHub Pages

1. Create a repository on GitHub (e.g. `my-hobbies`)
2. Push these files to the repo:

```bash
git init
git add .
git commit -m "Initial hobby site"
git branch -M main
git remote add origin https://github.com/<your-username>/my-hobbies.git
git push -u origin main
```

3. Go to repo **Settings → Pages → Source: Deploy from a branch → main / (root)** → Save
4. Your site will be live at `https://<your-username>.github.io/my-hobbies/`

## 📁 Structure

```
├── index.html      # Main page
├── css/style.css   # Styling
├── js/main.js      # Rendering + hash routing
└── hobbies.json    # ← Edit this to manage hobbies & sub-items