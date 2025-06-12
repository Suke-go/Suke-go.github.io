#!/usr/bin/env python3
import os
import glob
from datetime import datetime
import markdown

# Directory paths
POSTS_DIR = os.path.join(os.path.dirname(__file__), 'posts')
OUTPUT_DIR = os.path.dirname(__file__)

POST_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <nav id="navbar">
    <ul>
      <li><a class="menu-link" href="../en/index.html">Home</a></li>
      <li><a class="menu-link" href="../en/works.html">Works</a></li>
      <li><a class="menu-link" href="../en/summary.html">Summary</a></li>
      <li><a class="menu-link active" href="index.html">Blog</a></li>
    </ul>
  </nav>
  <main class="container">
    <article>
      <h1>{title}</h1>
      <p><em>{date}</em></p>
      {content}
    </article>
  </main>
  <footer>
    <p>&copy; 2025 ksk432. All Rights Reserved.</p>
  </footer>
</body>
</html>'''

INDEX_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blog</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <nav id="navbar">
    <ul>
      <li><a class="menu-link" href="../en/index.html">Home</a></li>
      <li><a class="menu-link" href="../en/works.html">Works</a></li>
      <li><a class="menu-link" href="../en/summary.html">Summary</a></li>
      <li><a class="menu-link active" href="index.html">Blog</a></li>
    </ul>
  </nav>
  <main class="container">
    <section>
      <h1>Blog</h1>
      <ul>
        {items}
      </ul>
    </section>
  </main>
  <footer>
    <p>&copy; 2025 ksk432. All Rights Reserved.</p>
  </footer>
</body>
</html>'''


def parse_post(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
    meta = {}
    body_lines = lines
    if lines and lines[0].strip() == '---':
        end = lines.index('---', 1)
        for line in lines[1:end]:
            if ':' in line:
                key, val = line.split(':', 1)
                meta[key.strip()] = val.strip()
        body_lines = lines[end+1:]
    title = meta.get('title', os.path.basename(path))
    date = meta.get('date', datetime.now().strftime('%Y-%m-%d'))
    body_html = markdown.markdown('\n'.join(body_lines))
    slug = os.path.splitext(os.path.basename(path))[0]
    return {
        'title': title,
        'date': date,
        'slug': slug,
        'content': body_html
    }


def build_posts():
    posts = [parse_post(p) for p in sorted(glob.glob(os.path.join(POSTS_DIR, '*.md')))]
    # Write each post
    for post in posts:
        out_path = os.path.join(OUTPUT_DIR, f"{post['slug']}.html")
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(POST_TEMPLATE.format(**post))
    # Build index
    items = ['<li><a href="{slug}.html">{title}</a> <small>{date}</small></li>'.format(**p) for p in posts]
    index_html = INDEX_TEMPLATE.format(items='\n        '.join(items))
    with open(os.path.join(OUTPUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(index_html)


if __name__ == '__main__':
    build_posts()
