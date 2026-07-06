#!/usr/bin/env python3
"""Inject preconnect + Open Graph tags into HTML pages."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OG_IMAGE = "https://pvarshh.me/src/favicon/android-chrome-512x512.png"
SITE = "https://pvarshh.me"

PAGE_META = {
    "index.html": {
        "url": "/",
        "title": "Pranav Varshney",
        "description": "Tune between compute, reflection, culture, and connection — an interactive personal site.",
        "type": "website",
    },
    "pages/writing/life.html": {
        "title": "Three Pillars — Pranav Varshney",
        "description": "Money, friends, and family — what I value in life.",
    },
    "pages/writing/ego.html": {
        "title": "No Ceiling — Pranav Varshney",
        "description": "On ego as fuel, not just downfall — Icarus and refusing someone else's ceiling.",
    },
    "pages/writing/2nd-pick.html": {
        "title": "The Second Pick — Pranav Varshney",
        "description": "Linsanity, Dame Time, and the quiet staging ground of being overlooked.",
    },
    "pages/writing/martyr.html": {
        "title": "The Martyr Complex — Pranav Varshney",
        "description": "When sacrifice becomes currency for connection.",
    },
    "pages/writing/index.html": None,
    "pages/resume.html": {
        "title": "Resume — Pranav Varshney",
        "description": "Resume — Pranav Varshney",
    },
    "pages/find-me.html": {
        "title": "Find Me — Pranav Varshney",
        "description": "Find the Parney — a mini-game by Pranav Varshney",
    },
}

DEFAULT_DESCRIPTION = "Pranav Varshney — CS @ UMich, writing, favorites, experience."

PRECONNECT = """    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
"""

OG_TEMPLATE = """    <meta property="og:site_name" content="Pranav Varshney">
    <meta property="og:type" content="{og_type}">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{image}">
    <meta name="twitter:card" content="summary">
"""


def title_from_html(text: str) -> str:
    m = re.search(r"<title>([^<]+)</title>", text, re.I)
    return m.group(1).strip() if m else "Pranav Varshney"


def description_from_html(text: str) -> str:
    m = re.search(r'<meta name="description" content="([^"]*)"', text, re.I)
    return m.group(1).strip() if m else DEFAULT_DESCRIPTION


def rel_path(path: Path) -> str:
    return str(path.relative_to(ROOT)).replace("\\", "/")


def inject_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    rel = rel_path(path)
    if rel in PAGE_META and PAGE_META[rel] is None:
        return False

    changed = False

    if "rel=\"preconnect\" href=\"https://fonts.googleapis.com\"" not in text:
        text = text.replace(
            '    <link rel="stylesheet" href="https://fonts.googleapis.com',
            PRECONNECT + '    <link rel="stylesheet" href="https://fonts.googleapis.com',
            1,
        )
        if PRECONNECT.strip() not in text:
            text = text.replace(
                "<head>",
                "<head>\n" + PRECONNECT,
                1,
            )
        changed = True

    if 'property="og:title"' not in text:
        meta = PAGE_META.get(rel, {})
        title = meta.get("title") or title_from_html(text)
        description = meta.get("description") or description_from_html(text)
        og_type = meta.get("type", "article" if rel.startswith("pages/") else "website")
        url_path = meta.get("url", "/" + rel if rel != "index.html" else "/")
        og_block = OG_TEMPLATE.format(
            og_type=og_type,
            url=SITE + url_path,
            title=title.replace('"', "&quot;"),
            description=description.replace('"', "&quot;"),
            image=OG_IMAGE,
        )
        anchor = '<link rel="manifest" href="/site.webmanifest">'
        if anchor in text:
            text = text.replace(anchor, anchor + "\n\n" + og_block.rstrip(), 1)
        else:
            text = text.replace("</head>", og_block + "</head>", 1)
        changed = True

    if changed:
        path.write_text(text, encoding="utf-8")
    return changed


def main():
    count = 0
    for path in sorted(ROOT.rglob("*.html")):
        if "node_modules" in path.parts:
            continue
        if inject_file(path):
            count += 1
            print("updated", path.relative_to(ROOT))
    print(f"done — {count} files updated")


if __name__ == "__main__":
    main()
