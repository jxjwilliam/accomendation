#!/usr/bin/env python3
"""
Download all images referenced in airbnb.html into the images/ folder.
Extracts img src URLs, deduplicates, and saves with sequential filenames.
"""

import re
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote

import requests

HTML_FILE = Path(__file__).resolve().parent / "airbnb.html"
OUTPUT_DIR = Path(__file__).resolve().parent / "images"

# Match src="http..." (skip data: and relative)
SRC_PATTERN = re.compile(r'src="(https?://[^"]+)"', re.IGNORECASE)


def extract_image_urls(html_path: Path) -> list[str]:
    """Extract unique image URLs from HTML file (img src attributes)."""
    text = html_path.read_text(encoding="utf-8", errors="replace")
    urls = SRC_PATTERN.findall(text)
    # Deduplicate while preserving order
    seen = set()
    unique = []
    for u in urls:
        if u not in seen and not u.strip().lower().startswith("data:"):
            seen.add(u)
            unique.append(u)
    return unique


def extension_from_url(url: str, content_type: str | None) -> str:
    """Determine file extension from URL or Content-Type."""
    path = urlparse(unquote(url)).path
    if path:
        ext = Path(path).suffix.lower()
        if ext in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"):
            return ext if ext != ".jpeg" else ".jpg"
    if content_type:
        ctype = content_type.split(";")[0].strip().lower()
        if "jpeg" in ctype or "jpg" in ctype:
            return ".jpg"
        if "png" in ctype:
            return ".png"
        if "gif" in ctype:
            return ".gif"
        if "webp" in ctype:
            return ".webp"
        if "svg" in ctype:
            return ".svg"
    return ".jpg"


def download_images(urls: list[str], out_dir: Path) -> tuple[int, int]:
    """Download each URL to out_dir. Returns (success_count, fail_count)."""
    out_dir.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    })
    success = 0
    failed = 0
    for i, url in enumerate(urls, start=1):
        try:
            resp = session.get(url, timeout=30)
            resp.raise_for_status()
            ext = extension_from_url(url, resp.headers.get("Content-Type"))
            path = out_dir / f"image_{i:03d}{ext}"
            path.write_bytes(resp.content)
            print(f"  [{i}/{len(urls)}] {path.name}")
            success += 1
        except Exception as e:
            print(f"  [{i}/{len(urls)}] FAILED {url[:60]}... -> {e}", file=sys.stderr)
            failed += 1
    return success, failed


def main() -> None:
    if not HTML_FILE.exists():
        print(f"Error: {HTML_FILE} not found.", file=sys.stderr)
        sys.exit(1)
    urls = extract_image_urls(HTML_FILE)
    print(f"Found {len(urls)} image URL(s) in {HTML_FILE.name}")
    if not urls:
        print("Nothing to download.")
        return
    print(f"Downloading to {OUTPUT_DIR} ...")
    ok, fail = download_images(urls, OUTPUT_DIR)
    print(f"Done: {ok} saved, {fail} failed.")


if __name__ == "__main__":
    main()
