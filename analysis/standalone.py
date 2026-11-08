# Turns a prerendered kb page into one self-contained HTML file: CSS inlined, client JS removed.
# The page is fully rendered at build time, so it reads the same without its scripts.
import pathlib
import re
import sys

src = pathlib.Path(sys.argv[1])
html = src.read_text()


def inline_css(m):
    css = (src.parent / m.group(1)).resolve().read_text()
    return f"<style>{css}</style>"


html = re.sub(r'<link href="([^"]+\.css)" rel="stylesheet">', inline_css, html)
html = re.sub(r'<link[^>]+rel="modulepreload"[^>]*>', "", html)
html = re.sub(r"<script.*?</script>", "", html, flags=re.S)
pathlib.Path(sys.argv[2]).write_text(html)
