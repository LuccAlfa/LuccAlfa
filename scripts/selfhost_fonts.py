#!/usr/bin/env python3
"""
scripts/selfhost_fonts.py

Usage:
  python3 scripts/selfhost_fonts.py /tmp/gf.css assets/fonts/fonts.css

- Reads the downloaded Google Fonts CSS (/tmp/gf.css)
- Rewrites woff/ttf URLs to local ./assets/fonts/<basename>
- Ensures each @font-face has font-display: swap;
- Writes the result to assets/fonts/fonts.css
"""
import sys
import re
from pathlib import Path

def main(argv):
    if len(argv) != 3:
        print("Usage: python3 scripts/selfhost_fonts.py <input_css> <output_css>", file=sys.stderr)
        return 2
    input_path = Path(argv[1])
    output_path = Path(argv[2])

    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 2

    txt = input_path.read_text(encoding='utf-8')

    # Replace remote urls with local assets/fonts/<basename>
    def repl_url(m):
        url = m.group(1).strip().strip('\'"')
        fname = url.split('/')[-1].split('?')[0]
        return f"url('./assets/fonts/{fname}')"
    txt = re.sub(r"url\((https?:[^)]+)\)", repl_url, txt)

    # Ensure font-display: swap; exists inside each @font-face block
    def ensure_fd(block):
        if 'font-display' in block:
            return block
        # add font-display: swap; before the closing brace
        return re.sub(r'\}\s*$', '  font-display: swap;\n}', block, flags=re.S)
    txt = re.sub(r'@font-face\s*\{[^}]*\}', lambda m: ensure_fd(m.group(0)), txt, flags=re.S)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(txt, encoding='utf-8')
    print(f"Wrote {output_path}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
