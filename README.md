# Suke-go.github.io

This repository contains the sources for the KSK432 personal website. The root
`index.html` now acts as a language selector. The full English site with the
terminal interface lives under `en/`, while Japanese pages are placed under
`ja/`.

## Running locally

For the JavaScript terminal to work properly, serve the files through a simple HTTP server. One option is Python's built-in server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/en/index.html` in your browser. The page will show the loading messages and automatically switch to the terminal after the sequence completes.

## Repository contents

- `index.html` – language selector page
- `en/index.html` – English terminal interface
- `en/works.html` – works list (English)
- `en/summary.html` – English summary page
- `ja/summary.html` – Japanese introduction page
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

Install `blog/requirements.txt`, then run `python3 blog/generate.py` to convert
Markdown files into HTML and update `blog/index.html`. The generated files are
committed so GitHub Pages serves them without a server or JavaScript build.

```bash
python3 -m pip install -r blog/requirements.txt
python3 blog/generate.py
```

The blog uses its own `blog/blog.css` for a responsive reading layout, an
automatically generated table of contents, reading-time estimates, and print
styles. Article dates are required (`YYYY-MM-DD`); the index lists the newest
articles first. Optional front matter includes `lang` (`ja` or `en`), `category`,
`tags` (comma-separated), `description`, `title_lines` (optional title breaks
separated by `|`; the parts must reproduce the title), `cover_mark`, `cover_caption`, and
`cover_note`. `unlisted: true` hides an entry from the index while keeping its
URL accessible; it is not a private draft. The original Hello World sample is
unlisted.

For a paper introduction, copy `blog/templates/research-note.md` into
`blog/posts/` with a new filename. Fill in `publication_title`,
`publication_venue`, and either `doi` or `publication_url` to display a paper
reference panel above the article. Keep the discussion in the Markdown body;
the template itself is not published. Images can live under `blog/images/` and
be referenced as `![Description](images/example.png)`.


## Command line shortcuts

To quickly open specific websites from the terminal, source the hidden
`.web_aliases` file from your shell configuration. This enables:

- `comtech` – opens <http://ksk432.com/ComTech.github.io/>
- `mkomg` – opens <https://mkomg.lol>
- `shinitai` – opens <https://shinitai.shop>

Add the following line to your `~/.bashrc` or `~/.zshrc`:

```bash
source /path/to/repo/.web_aliases
```

The file name begins with a dot so it will not appear in a plain `ls` listing.
