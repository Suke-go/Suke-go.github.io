"""Build the Projects hub and one page per project, in English and Japanese, from projects.json.

Run from anywhere:  python projects/generate.py
Outputs (committed, served as static files):
  projects/index.html            projects/ja/index.html
  projects/<slug>/index.html     projects/<slug>/ja/index.html
  short demo URLs listed as `alias` on links (redirect pages)
"""
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
SITE_ROOT = ROOT.parent
SITE = 'https://ksk432.com'
SELF = 'Kosuke Shimizu'
LANGS = ('en', 'ja')

data = json.loads((ROOT / 'projects.json').read_text(encoding='utf-8'))
THREADS = data['threads']
PEOPLE = data['people']
ADJACENT_JA = data['adjacent_ja']

UI = {
    'en': {
        'hub_title': 'KSK432 - Projects',
        'hub_description': 'Research, art, and community projects by Kosuke Shimizu, with their papers, demos, and sites.',
        'hub_lead': 'Research, artworks, and activities, each gathered with the papers, demos, and sites that came out of it.',
        'threads': 'Research Threads',
        'period': 'Period', 'threads_dt': 'Threads', 'team': 'Team', 'links': 'Links',
        'demo': 'Demo', 'structure': 'Structure', 'publications': 'Publications',
        'related': 'Related, by Collaborators',
        'preview': 'Preview', 'close_preview': 'Close', 'open': 'Open ↗', 'load_preview': 'Load live preview',
        'ongoing': 'Ongoing', 'switch': 'JP',
        'category': {'research': 'Research', 'art': 'Art', 'community': 'Community', 'engineering': 'Engineering'},
        'deck': {'prev': 'Previous slide', 'next': 'Next slide', 'slide': 'Slide', 'full': 'Fullscreen'},
        'status': {},
    },
    'ja': {
        'hub_title': 'KSK432 - プロジェクト',
        'hub_description': '清水紘輔の研究・作品・活動を、論文・デモ・サイトとあわせてまとめたページです。',
        'hub_lead': '研究と作品、活動を、そこから生まれた論文・デモ・サイトとあわせてまとめています。',
        'threads': '研究テーマ',
        'period': '期間', 'threads_dt': '研究テーマ', 'team': 'メンバー', 'links': 'リンク',
        'demo': 'デモ', 'structure': '構成', 'publications': '発表',
        'related': '共同研究者による関連研究',
        'preview': 'プレビュー', 'close_preview': '閉じる', 'open': '開く ↗', 'load_preview': 'サイトを読み込む',
        'ongoing': '継続中', 'switch': 'EN',
        'category': {'research': '研究', 'art': '作品', 'community': 'コミュニティ', 'engineering': '技術支援'},
        'deck': {'prev': '前のスライド', 'next': '次のスライド', 'slide': 'スライド', 'full': '全画面表示'},
        'status': {'Forthcoming': '掲載予定', 'In press': '印刷中'},
    },
}


def e(text):
    return escape(str(text), quote=True)


def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def fmt_date(date):
    return date.replace('-', '.')


def tx(node, key, lang):
    """The Japanese variant of a field when building Japanese pages and one exists."""
    if lang == 'ja' and node.get(f'{key}_ja'):
        return node[f'{key}_ja']
    return node.get(key, '')


def resolve(url, prefix):
    """Data stores site-root-relative paths (image/..., research/...); pages sit at different depths."""
    return url if re.match(r'^(https?:)?//', url) else prefix + url


def anchor(url, label, prefix=''):
    target = ' target="_blank" rel="noopener"' if url.startswith('http') else ''
    return f'<a href="{e(resolve(url, prefix))}"{target}>{e(label)}</a>'


def hub_path(lang):
    return 'projects/' if lang == 'en' else 'projects/ja/'


def project_path(slug, lang):
    return f'projects/{slug}/' if lang == 'en' else f'projects/{slug}/ja/'


def depth_prefix(path):
    return '../' * path.count('/')


# ----- tree helpers -----

def walk(node):
    yield node
    for child in node.get('children', []):
        yield from walk(child)


def all_dates(node):
    dates = []
    for n in walk(node):
        if n.get('date'):
            dates.append(n['date'])
        dates += [o['date'] for o in n.get('outputs', []) + n.get('related', [])]
    return sorted(dates)


def year_span(node, lang):
    if node.get('period') == 'ongoing':
        return UI[lang]['ongoing']
    dates = all_dates(node)
    if not dates:
        return ''
    first, last = dates[0][:4], dates[-1][:4]
    return first if first == last else f'{first}–{last}'


def start_date(node):
    """When a node entered the record: its own date if given, else its first output."""
    outputs = sorted(o['date'] for o in node.get('outputs', []))
    return node.get('date') or (outputs[0] if outputs else '')


def latest(project):
    # An ongoing activity sorts with this year's work, after anything dated to a month.
    return '2026' if project.get('period') == 'ongoing' else all_dates(project)[-1]


def numbered(nodes, base=''):
    """Pair each node with its outline number: 01, 02, then 01.1, 01.2 below."""
    for i, node in enumerate(sorted(nodes, key=start_date), 1):
        yield (f'{base}.{i}' if base else f'{i:02d}'), node


# ----- shared fragments -----

def nav(prefix, lang, counterpart):
    home = 'en/summary.html' if lang == 'en' else 'ja/summary.html'
    pubs = 'en/publications.html' if lang == 'en' else 'ja/publications.html'
    items = [
        (home, 'Home', False), (hub_path(lang), 'Projects', True), (pubs, 'Publications', False),
        ('blog/index.html', 'Blog', False), ('en/index.html', 'Terminal', False),
        (counterpart, UI[lang]['switch'], False),
    ]
    links = '\n'.join(
        f'      <li><a class="menu-link{" active" if active else ""}" href="{prefix}{href}">{label}</a></li>'
        for href, label, active in items
    )
    return f'  <nav id="navbar" class="projects-nav">\n    <ul>\n{links}\n    </ul>\n  </nav>'


def page(lang, path, counterpart, title, description, body):
    prefix = depth_prefix(path)
    labels = UI[lang]
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <title>{e(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{e(description)}">
  <link rel="canonical" href="{SITE}/{path}">
  <link rel="alternate" hreflang="{lang}" href="{SITE}/{path}">
  <link rel="alternate" hreflang="{"ja" if lang == "en" else "en"}" href="{SITE}/{counterpart}">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{SITE}/{path}">
  <meta property="og:site_name" content="KSK432">
  <link rel="stylesheet" href="{prefix}style.css">
  <link rel="stylesheet" href="{prefix}projects/projects.css">
</head>
<body class="projects-body" data-preview-open="{e(labels["preview"])}" data-preview-close="{e(labels["close_preview"])}">
{nav(prefix, lang, counterpart)}

  <main class="stage">
{body}
  </main>

  <footer><p>&copy; 2026 ksk432. All Rights Reserved.</p></footer>
  <script src="{prefix}projects/projects.js"></script>
</body>
</html>
'''


def thread_tags(node, lang):
    tags = [f'<span class="thread-tag"><b>{t}</b>{e(THREADS[t][lang])}</span>' for t in node.get('threads', [])]
    tags += [
        f'<span class="thread-tag is-adjacent">{e(ADJACENT_JA.get(a, a) if lang == "ja" else a)}</span>'
        for a in node.get('adjacent', [])
    ]
    return ''.join(tags)


def authors(names):
    parts = []
    for name in names:
        if name == SELF:
            parts.append(f'<span class="self">{e(name)}</span>')
        elif PEOPLE.get(name):
            parts.append(anchor(PEOPLE[name], name))
        else:
            parts.append(e(name))
    return ', '.join(parts)


def pub_item(o, lang, prefix):
    venue = e(o['venue'])
    if o.get('status'):
        venue += f'<span class="status">{e(UI[lang]["status"].get(o["status"], o["status"]))}</span>'
    links = []
    if o.get('doi'):
        links.append('DOI ' + anchor(f'https://doi.org/{o["doi"]}', o['doi']))
    if o.get('url'):
        links.append(anchor(o['url'], o.get('url_label', 'Link'), prefix))
    if links:
        venue += ' · ' + ' · '.join(links)
    return (
        '<li class="pub">'
        f'<span class="pub-date">{fmt_date(o["date"])}<span>{e(o["kind"])}</span></span>'
        f'<span><strong class="pub-title">{e(o["title"])}</strong>'
        f'<span class="pub-line">{authors(o["authors"])}</span>'
        f'<span class="pub-line">{venue}</span></span>'
        '</li>'
    )


def pub_list(outputs, lang, prefix, related=False):
    items = '\n'.join(pub_item(o, lang, prefix) for o in sorted(outputs, key=lambda o: o['date']))
    return f'<ul class="pubs{" is-related" if related else ""}">\n{items}\n</ul>'


def link_items(node, lang, prefix):
    """Links, with the short ksk432.com path shown under links that have one."""
    items = []
    for l in node.get('links', []):
        url = l.get('alias', l['url'])
        target = ' target="_blank" rel="noopener"' if l.get('alias') or url.startswith('http') else ''
        path = f'<code>ksk432.com/{e(l["alias"])}</code>' if l.get('alias') else ''
        items.append(f'<li><a href="{e(resolve(url, prefix))}"{target}>{e(tx(l, "label", lang))}</a>{path}</li>')
    return items


def preview_label(node):
    for l in node.get('links', []):
        if l.get('alias') and l['url'] == node.get('preview'):
            return f'ksk432.com/{l["alias"]}'
    return re.sub(r'^https?://', '', node['preview']).rstrip('/')


def preview_panel(node, node_id, lang, poster=''):
    """Sub-project previews open from a toggle; a project's own preview shows a
    poster button in place and loads the site when clicked."""
    if not node.get('preview'):
        return ''
    url = node['preview']
    placeholder = ''
    if poster:
        placeholder = (
            f'<button type="button" class="preview-load" style="background-image: url(&quot;{e(poster)}&quot;)">'
            f'<span>{UI[lang]["load_preview"]}</span></button>'
        )
    return (
        f'<div class="preview" id="preview-{node_id}" data-src="{e(url)}" data-label="{e(node["title"])}"'
        f'{"" if poster else " hidden"}>'
        f'<div class="preview-bar"><span>{e(preview_label(node))}</span>{anchor(url, UI[lang]["open"])}</div>'
        f'<div class="preview-viewport">{placeholder}</div></div>'
    )


def media(node, lang, prefix):
    out = []
    if node.get('media'):
        m = node['media']
        out.append(
            f'<figure class="figure"><img src="{resolve(m["src"], prefix)}" alt="{e(m["alt"])}" loading="lazy">'
            f'<figcaption>{e(tx(m, "caption", lang))}</figcaption></figure>'
        )
    if node.get('video'):
        out.append(
            f'<iframe class="video" src="https://www.youtube-nocookie.com/embed/{e(node["video"])}" '
            f'title="{e(node.get("video_title", node["title"]))}" loading="lazy" '
            'referrerpolicy="strict-origin-when-cross-origin" '
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
            'allowfullscreen></iframe>'
        )
    out += [deck(s, lang, prefix) for s in node.get('slides', [])]
    return ''.join(out)


def deck(s, lang, prefix):
    """A slide deck shown one slide at a time (images rendered from the PDF);
    projects.js adds paging, the progress bar, and fullscreen."""
    labels = UI[lang]['deck']
    base = resolve(s['dir'], prefix)
    title = tx(s, 'title', lang)
    return f'''<figure class="deck" data-base="{e(base)}" data-count="{s["count"]}" aria-label="{e(title)}">
  <div class="deck-stage">
    <img class="deck-slide" src="{e(base)}01.jpg" alt="{e(title)} — 1 / {s["count"]}" width="1600" height="900" loading="lazy">
    <button type="button" class="deck-hit" data-act="prev" aria-label="{labels["prev"]}"></button>
    <button type="button" class="deck-hit" data-act="next" aria-label="{labels["next"]}"></button>
  </div>
  <div class="deck-bar">
    <button type="button" class="deck-btn" data-act="prev" aria-label="{labels["prev"]}">‹</button>
    <span class="deck-count"><b>1</b> / {s["count"]}</span>
    <button type="button" class="deck-btn" data-act="next" aria-label="{labels["next"]}">›</button>
    <input type="range" class="deck-range" min="1" max="{s["count"]}" value="1" aria-label="{labels["slide"]}">
    <a class="deck-link" href="{e(resolve(s["pdf"], prefix))}" download>PDF</a>
    <button type="button" class="deck-btn" data-act="full" aria-label="{labels["full"]}">⛶</button>
  </div>
  <figcaption>{e(title)}</figcaption>
</figure>'''


def tree_node(number, node, lang, prefix):
    node_id = slugify(node['title'])
    image = f'<img src="{resolve(node["image"], prefix)}" alt="{e(node.get("image_alt", ""))}" loading="lazy">' if node.get('image') else ''
    links = link_items(node, lang, prefix)
    if node.get('preview'):
        links.append(
            f'<li><button type="button" class="btn" aria-expanded="false" '
            f'aria-controls="preview-{node_id}">{UI[lang]["preview"]}</button></li>'
        )
    actions = f'<ul class="links node-actions">{"".join(links)}</ul>' if links else ''
    tags = thread_tags(node, lang)
    subtitle = tx(node, 'subtitle', lang)
    description = tx(node, 'description', lang)
    children = ''
    if node.get('children'):
        rows = '\n'.join(tree_node(n, c, lang, prefix) for n, c in numbered(node['children'], number))
        children = f'<ol class="tree">\n{rows}\n</ol>'
    return f'''<li class="node" id="{node_id}">
  <span class="node-no">{number}</span>
  <div>
    <div class="node-head"><h3>{e(tx(node, "title", lang))}</h3><time>{year_span(node, lang)}</time></div>
    {f'<p class="node-sub">{e(subtitle)}</p>' if subtitle else ''}
    {f'<p class="node-tags">{tags}</p>' if tags else ''}
    <div class="node-body{" has-image" if image else ""}">
      <div class="node-text">{f'<p>{e(description)}</p>' if description else ''}{actions}{preview_panel(node, node_id, lang)}{media(node, lang, prefix)}{pub_list(node["outputs"], lang, prefix) if node.get("outputs") else ""}</div>
      {image}
    </div>
    {children}
  </div>
</li>'''


def block(title, body, block_id=''):
    attr = f' id="{block_id}"' if block_id else ''
    return f'<section class="block"{attr}><h2>{title}</h2><div class="block-body">{body}</div></section>'


# ----- project page -----

def project_page(p, lang):
    labels = UI[lang]
    slug = p['slug']
    path = project_path(slug, lang)
    prefix = depth_prefix(path)
    other = 'ja' if lang == 'en' else 'en'
    title = tx(p, 'title', lang)
    fit = ' is-document' if p.get('image_fit') == 'contain' else ''

    meta = [f'<div><dt>{labels["period"]}</dt><dd>{year_span(p, lang)}</dd></div>']
    if p.get('threads') or p.get('adjacent'):
        meta.append(f'<div><dt>{labels["threads_dt"]}</dt><dd>{thread_tags(p, lang)}</dd></div>')
    if p.get('credits'):
        meta.append(f'<div><dt>{labels["team"]}</dt><dd class="pub-line">{authors(p["credits"])}</dd></div>')
    links = link_items(p, lang, prefix)
    if links:
        meta.append(f'<div><dt>{labels["links"]}</dt><dd><ul class="links">{"".join(links)}</ul></dd></div>')
    paragraphs = ''.join(f'<p>{e(t)}</p>' for t in tx(p, 'description', lang))

    sections = []
    if p.get('preview') or p.get('video') or p.get('media'):
        poster = resolve(p.get('preview_image', p['image']), prefix)
        sections.append(block(labels['demo'], f'<div class="stack">{preview_panel(p, slug, lang, poster=poster)}{media(p, lang, prefix)}</div>', 'demo'))
    if p.get('children'):
        rows = '\n'.join(tree_node(n, c, lang, prefix) for n, c in numbered(p['children']))
        sections.append(block(labels['structure'], f'<ol class="tree">\n{rows}\n</ol>', 'structure'))
    if p.get('partial'):
        sections.append((ROOT / p['partial'].format(lang=lang)).read_text(encoding='utf-8').replace('{root}', prefix))
    if p.get('outputs'):
        sections.append(block(labels['publications'], pub_list(p['outputs'], lang, prefix), 'publications'))
    if p.get('related'):
        sections.append(block(labels['related'], pub_list(p['related'], lang, prefix, related=True)))

    body = f'''    <header class="p-head">
      <p class="kicker"><a href="{prefix}{hub_path(lang)}">Projects</a> / {labels["category"][p["category"]]}</p>
      <h1>{e(title)}</h1>
      <p class="p-sub">{e(tx(p, "subtitle", lang))}</p>
    </header>
    <figure class="p-cover{fit}"><img src="{resolve(p["image"], prefix)}" alt="{e(p["image_alt"])}"></figure>
    <section class="block">
      <dl class="meta">{"".join(meta)}</dl>
      <div class="p-text">{paragraphs}</div>
    </section>
    {"".join(sections)}'''
    html = page(lang, path, project_path(slug, other), f'{title} — KSK432 Projects', tx(p, 'subtitle', lang), body)
    out = SITE_ROOT / path / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf-8')


def alias_pages(p):
    """Short ksk432.com/projects/... entry points for demos that live in other repositories."""
    for n in walk(p):
        for l in n.get('links', []):
            if not l.get('alias'):
                continue
            out = SITE_ROOT / l['alias'] / 'index.html'
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{e(n["title"])} — KSK432</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="{e(l["url"])}">
  <meta http-equiv="refresh" content="0; url={e(l["url"])}">
</head>
<body>
  <p><a href="{e(l["url"])}">{e(n["title"])}</a></p>
</body>
</html>
''', encoding='utf-8')


# ----- hub -----

def project_card(p, lang, prefix):
    labels = UI[lang]
    fit = ' is-document' if p.get('image_fit') == 'contain' else ''
    tree = ''
    if p.get('children'):
        rows = ''.join(f'<li>{e(tx(c, "title", lang))}</li>' for _, c in numbered(p['children']))
        tree = f'<ul class="pcard-tree">{rows}</ul>'
    return f'''      <a class="pcard" href="{prefix}{project_path(p["slug"], lang)}">
        <div class="pcard-img{fit}"><img src="{resolve(p["image"], prefix)}" alt="" loading="lazy"></div>
        <div class="pcard-meta"><span>{labels["category"][p["category"]]}</span><span>{year_span(p, lang)}</span></div>
        <h2>{e(tx(p, "title", lang))}</h2>
        <p>{e(tx(p, "subtitle", lang))}</p>
        {tree}
      </a>'''


def thread_entries(lang, prefix):
    """Every node tagged with a thread, oldest first. A project-level tag is listed
    only when none of its sub-projects already carries that thread."""
    entries = {t: [] for t in THREADS}
    for p in data['projects']:
        base = prefix + project_path(p['slug'], lang)
        for n in walk(p):
            for t in n.get('threads', []):
                if n is p and any(t in c.get('threads', []) for c in walk(p) if c is not p):
                    continue
                href = base if n is p else f'{base}#{slugify(n["title"])}'
                parent = '' if n is p else tx(p, 'title', lang)
                entries[t].append((start_date(n) or all_dates(n)[0], tx(n, 'title', lang), href, parent))
    return {t: sorted(v) for t, v in entries.items()}


def hub(lang):
    labels = UI[lang]
    path = hub_path(lang)
    prefix = depth_prefix(path)
    projects = sorted(data['projects'], key=latest, reverse=True)
    cards = '\n'.join(project_card(p, lang, prefix) for p in projects)
    columns = []
    for t, rows in thread_entries(lang, prefix).items():
        items = ''.join(
            f'<li><time>{fmt_date(d)}</time><span><a href="{href}">{e(title)}</a>'
            f'{f"<small>{e(parent)}</small>" if parent else ""}</span></li>'
            for d, title, href, parent in rows
        )
        columns.append(f'<div class="thread"><h3><span>{t}</span>{e(THREADS[t][lang])}</h3><ol>{items}</ol></div>')
    body = f'''    <header class="hub-head">
      <p class="kicker">Portfolio</p>
      <h1>Projects</h1>
      <p class="lead">{labels["hub_lead"]}</p>
    </header>
    <div class="pgrid">
{cards}
    </div>
    {block(labels["threads"], f'<div class="threads">{"".join(columns)}</div>', "threads")}'''
    other = 'ja' if lang == 'en' else 'en'
    html = page(lang, path, hub_path(other), labels['hub_title'], labels['hub_description'], body)
    out = SITE_ROOT / path / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf-8')


for project in data['projects']:
    alias_pages(project)
for lang in LANGS:
    for project in data['projects']:
        project_page(project, lang)
    hub(lang)
print(f'Built {len(data["projects"])} projects x {len(LANGS)} languages, plus both hubs')
