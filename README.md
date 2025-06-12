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
- `summary.html` – English summary page
- `summary-ja.html` – Japanese introduction page
- `style.css` – common styles
- `script.js` – standalone script for lightbox functionality
- `blog/` – simple markdown-based blog framework

## Blog framework

The `blog/` directory contains a minimal system for writing posts in Markdown.
Add new posts in `blog/posts/` using the following front matter:

```markdown
---
title: My Post Title
date: 2025-01-01
---

Your content here.
```

Run `python3 blog/generate.py` to convert all Markdown files into HTML and
update `blog/index.html`.

