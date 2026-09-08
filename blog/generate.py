#!/usr/bin/env python3
"""Build the static blog from UTF-8 Markdown files in posts/."""

from datetime import date
from html import escape
from math import ceil
from pathlib import Path
import re
from string import Template
from urllib.parse import urlsplit

import markdown
from markdown.extensions.toc import slugify_unicode


ROOT = Path(__file__).resolve().parent

PAGE = Template('''<!DOCTYPE html>
<html lang="$lang">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="$description">
  <meta name="theme-color" content="#f2f0e6">
  <meta property="og:type" content="$og_type">
  <meta property="og:title" content="$title">
  <meta property="og:description" content="$description">
  <meta property="og:site_name" content="KSK432 — Blog">
  <title>$title — KSK432</title>
  <link rel="stylesheet" href="blog.css">
</head>
<body id="top">
  <a class="skip-link" href="#main">本文へスキップ</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="wordmark" href="../ja/summary.html" aria-label="KSK432 ホーム">KSK432<span> / JOURNAL</span></a>
      <nav aria-label="メインナビゲーション">
        <a href="../ja/summary.html">Home</a>
        <a href="../en/works.html">Works</a>
        <a href="../en/publications.html">Publications</a>
        <a href="index.html" aria-current="page">Blog</a>
        <a href="../en/index.html">Terminal</a>
      </nav>
    </div>
  </header>
  <main id="main" class="$page_class">
$content
  </main>
  <footer class="site-footer">
    <a class="wordmark" href="../ja/summary.html">KSK432</a>
    <span>Research, making, and the thoughts in between.</span>
    <a href="#top">ページの先頭へ <span aria-hidden="true">↑</span></a>
  </footer>
</body>
</html>
''')

ARTICLE = Template('''    <div class="article-breadcrumb"><a href="index.html">Blog</a><span aria-hidden="true">/</span><span>$category</span></div>
    <article>
      <header class="article-header">
        <p class="eyebrow">$category <span class="label-rule"></span> $date_display</p>
        <h1>$heading</h1>
        <div class="article-meta"><a href="../ja/summary.html">清水 紘輔 <span lang="en">/ Kosuke Shimizu</span></a><span class="meta-divider" aria-hidden="true"></span><time datetime="$date">$date_display</time><span>約$reading_minutes分で読めます</span></div>
        <div class="tags">$tags</div>
      </header>
      <div class="article-layout">
        <aside class="article-aside">
          <details class="contents" open>
            <summary>目次 <span lang="en">CONTENTS</span></summary>
            $toc
          </details>
          <a class="aside-back" href="index.html"><span aria-hidden="true">←</span> すべての記事</a>
        </aside>
        <div class="article-body">
$publication
$body
          <div class="article-end" aria-hidden="true"><span></span><i></i><span></span></div>
          <footer class="article-footer"><p>清水 紘輔 <span lang="en">/ Kosuke Shimizu</span></p><p>身体・記憶・現実感をめぐるインターフェースの研究と制作。</p><a href="../ja/summary.html">プロフィール <span aria-hidden="true">↗</span></a></footer>
        </div>
      </div>
    </article>
    <div class="article-return"><a href="index.html"><span aria-hidden="true">←</span> ブログ一覧に戻る</a><span class="eyebrow">KSK432 / BLOG</span></div>''')

INDEX = Template('''    <header class="journal-intro">
      <div class="intro-topline"><p class="eyebrow">Blog / Field notes</p><span class="eyebrow">BY KOSUKE SHIMIZU</span></div>
      <h1>思考の余白<span>。</span></h1>
      <div class="intro-bottomline"><p>研究と制作のあいだで、<br>考えたこと、立ち止まったことを書き留める。</p><span class="intro-topics">HUMAN / EXPERIENCE / TECHNOLOGY</span></div>
    </header>
    <section class="journal-entries" aria-labelledby="entries-title">
      <div class="section-label"><h2 id="entries-title">記事一覧 <span>ENTRIES</span></h2><span>$count</span></div>
      <ol class="entry-list">
$entries
      </ol>
    </section>
    <aside class="journal-note"><span class="eyebrow">ABOUT THIS NOTEBOOK</span><p>論文になる前の問いも、<br>制作のあとに残る考えも。</p><a href="../ja/summary.html">書き手について <span aria-hidden="true">↗</span></a></aside>''')

ENTRY = Template('''        <li>
          <article class="entry">
            <div class="entry-copy">
              <p class="eyebrow"><span>$number</span><span class="label-rule"></span>$category</p>
              <h3><a href="$slug.html">$heading</a></h3>
              <p class="entry-description">$description</p>
              <div class="entry-meta"><time datetime="$date">$date_display</time><span>約$reading_minutes分</span></div>
              <a class="read-link" href="$slug.html" aria-label="$title を読む">続きを読む <span aria-hidden="true">↗</span></a>
            </div>
            <a class="entry-cover" href="$slug.html" tabindex="-1" aria-hidden="true">
              <span class="cover-topline">$cover_caption <span>FIELD NOTE / $number</span></span>
              <span class="cover-mark">$cover_mark<span class="cover-orbit"></span></span>
              <span class="cover-bottomline">$cover_note<span>↗</span></span>
            </a>
          </article>
        </li>''')


def publication_card(meta):
    if not meta.get('publication_title'):
        return ''
    title = escape(meta['publication_title'])
    venue = escape(meta.get('publication_venue', ''))
    url = meta.get('publication_url', '')
    if not url and meta.get('doi'):
        url = 'https://doi.org/' + meta['doi']
    link = ''
    if url:
        parsed = urlsplit(url)
        if parsed.scheme not in {'http', 'https'} or not parsed.netloc:
            raise ValueError('publication_url must be an HTTP(S) URL')
        link = f'<a href="{escape(url, quote=True)}" target="_blank" rel="noopener">論文を読む <span aria-hidden="true">↗</span></a>'
    return f'<aside class="publication-card" aria-label="紹介する論文"><p class="eyebrow">RESEARCH NOTE / PAPER</p><p class="paper-title">{title}</p><p class="paper-venue">{venue}</p>{link}</aside>'


def parse_post(path):
    source = path.read_text(encoding='utf-8-sig')
    lines = source.splitlines()
    meta = {}
    if lines and lines[0].strip() == '---':
        try:
            end = lines.index('---', 1)
        except ValueError as exc:
            raise ValueError(f'{path.name}: front matter is not closed') from exc
        for line in lines[1:end]:
            if ':' in line:
                key, value = line.split(':', 1)
                meta[key.strip()] = value.strip()
        body = '\n'.join(lines[end + 1:]).strip()
    else:
        body = source.strip()

    published = date.fromisoformat(meta['date'])
    lang = meta.get('lang', 'ja')
    if lang not in {'ja', 'en'}:
        raise ValueError(f'{path.name}: unsupported language {lang}')
    renderer = markdown.Markdown(extensions=['extra', 'toc'], extension_configs={'toc': {'slugify': slugify_unicode}})
    content = renderer.convert(body)
    plain = re.sub(r'<[^>]+>', '', content)
    reading_minutes = ceil(len(re.sub(r'\s', '', plain)) / 500) if lang == 'ja' else ceil(len(plain.split()) / 220)
    description = meta.get('description', re.sub(r'\s+', ' ', plain)[:120])
    title = meta.get('title', path.stem)
    title_lines = meta.get('title_lines', '').split('|') if meta.get('title_lines') else []
    if title_lines and ''.join(title_lines) != title:
        raise ValueError(f'{path.name}: title_lines must match title')
    heading = ''.join(f'<span class="title-line">{escape(line)}</span>' for line in title_lines) if title_lines else escape(title)
    return {
        'title': title,
        'heading': heading,
        'date': published.isoformat(),
        'date_display': published.strftime('%Y.%m.%d'),
        'slug': path.stem,
        'lang': lang,
        'category': meta.get('category', 'Note'),
        'description': description,
        'reading_minutes': max(1, reading_minutes),
        'body': content,
        'toc': renderer.toc if renderer.toc_tokens else '<p>短いノートです。</p>',
        'tags': ''.join(f'<span>{escape(tag.strip())}</span>' for tag in meta.get('tags', '').split(',') if tag.strip()),
        'cover_mark': meta.get('cover_mark', 'N'),
        'cover_caption': meta.get('cover_caption', 'RESEARCH & NOTES'),
        'cover_note': meta.get('cover_note', '問いの、その先へ。'),
        'publication': publication_card(meta),
        'unlisted': meta.get('unlisted', 'false').lower() == 'true',
    }


def escaped_fields(post):
    return {key: escape(str(value), quote=True) for key, value in post.items()}


def build_posts():
    posts = sorted((parse_post(path) for path in (ROOT / 'posts').glob('*.md')), key=lambda post: (post['date'], post['slug']), reverse=True)
    for post in posts:
        fields = escaped_fields(post)
        article = ARTICLE.substitute(fields | {key: post[key] for key in ('body', 'toc', 'tags', 'publication', 'heading')})
        page = PAGE.substitute(fields | {'og_type': 'article', 'page_class': 'article-page', 'content': article})
        (ROOT / f"{post['slug']}.html").write_text(page, encoding='utf-8', newline='\n')

    listed = [post for post in posts if not post['unlisted']]
    entries = '\n'.join(ENTRY.substitute(escaped_fields(post) | {'number': f'{index:02d}', 'heading': post['heading']}) for index, post in enumerate(listed, 1))
    content = INDEX.substitute(count=f'{len(listed):02d}', entries=entries)
    page = PAGE.substitute(lang='ja', title='Blog — 思考の余白。', description='清水紘輔のブログ。研究と制作のあいだで考えたこと、立ち止まったことを書き留める。', og_type='website', page_class='journal-page', content=content)
    (ROOT / 'index.html').write_text(page, encoding='utf-8', newline='\n')
    print(f'Built {len(posts)} posts; {len(listed)} listed on blog/index.html')


if __name__ == '__main__':
    build_posts()
