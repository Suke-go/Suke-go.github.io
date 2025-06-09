# Suke-go.github.io

This repository contains the sources for the KSK432 personal website. The main `index.html` page features a loading screen followed by a terminal-like interface.

## Running locally

For the JavaScript terminal to work properly, serve the files through a simple HTTP server. One option is Python's built-in server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` in your browser. The page will show the loading messages and automatically switch to the terminal after the sequence completes.

## Repository contents

- `index.html` – main page with embedded JavaScript
- `works.html` – list of works
- `summary.html` – plain summary page
- `style.css` – common styles
- `script.js` – standalone script for lightbox functionality

