#!/usr/bin/env python3
"""Cheap browser control for agents. One command in, a few lines out.

Why: a browser MCP sends every screenshot and page tree back into the
agent's context, which burns tokens. This script runs the browser itself
and prints only what the agent needs: a short report, or the path of a
saved screenshot that a person (or the agent, if it must) can open.

Setup on the owner's PC (once, ask the owner first):
    pip install playwright
    python -m playwright install chromium

Commands:
    python scripts/browser.py check <url>                 # status, title, console errors, failed requests, a11y counts
    python scripts/browser.py text  <url> [--max 2000]    # visible text only
    python scripts/browser.py shot  <url> <out.png>       # phone-size screenshot (390x844)
    python scripts/browser.py run   <steps.json>          # several steps in one browser session

Options for every command: --desktop (1280x800 instead of phone size), --dark.

steps.json example:
    [{"goto": "http://localhost:8081"},
     {"click": "text=Create free account"},
     {"fill": ["input[name=email]", "test@example.com"]},
     {"wait": 500},
     {"shot": "out/register.png"},
     {"check": true}]

Rules: never type a real password, card number or ID number with this
script. Use test values from the project's seed or example files only.
"""
import argparse
import json
import sys

from playwright.sync_api import sync_playwright

PHONE = {"width": 390, "height": 844}
DESKTOP = {"width": 1280, "height": 800}

A11Y_JS = """() => {
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const taps = [...document.querySelectorAll('a,button,[role=button],input,select,textarea')].filter(vis);
  const small = taps.filter(e => { const r = e.getBoundingClientRect(); return r.width < 44 || r.height < 44; });
  const noName = taps.filter(e => !(e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || e.getAttribute('placeholder') || '').trim());
  const imgs = [...document.querySelectorAll('img')].filter(e => !e.hasAttribute('alt'));
  const overflow = document.documentElement.scrollWidth > window.innerWidth;
  return {tap_targets: taps.length, under_44px: small.length,
          no_accessible_name: noName.length, img_without_alt: imgs.length,
          horizontal_scroll: overflow,
          examples_under_44px: small.slice(0, 3).map(e => (e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30))};
}"""


def new_page(browser, args):
    ctx = browser.new_context(
        viewport=DESKTOP if args.desktop else PHONE,
        color_scheme="dark" if args.dark else "light",
        device_scale_factor=1,
    )
    page = ctx.new_page()
    page._errors = []
    page._failed = []
    page.on("console", lambda m: m.type == "error" and page._errors.append(m.text[:200]))
    page.on("pageerror", lambda e: page._errors.append(str(e)[:200]))
    page.on("requestfailed", lambda r: page._failed.append(f"{r.method} {r.url[:120]}"))
    return page


def goto(page, url):
    resp = page.goto(url, wait_until="networkidle", timeout=30000)
    return resp.status if resp else None


def report(page, status=None):
    out = {"url": page.url, "title": page.title()}
    if status is not None:
        out["status"] = status
    out["console_errors"] = page._errors[:5]
    out["failed_requests"] = page._failed[:5]
    out["a11y"] = page.evaluate(A11Y_JS)
    return out


def visible_text(page, limit):
    text = page.inner_text("body")
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    joined = "\n".join(lines)
    return joined[:limit] + ("\n[...cut]" if len(joined) > limit else "")


def run_steps(page, steps, limit):
    for i, step in enumerate(steps, 1):
        (key, val), = step.items()
        if key == "goto":
            print(f"{i} goto {val} -> {goto(page, val)}")
        elif key == "click":
            page.click(val, timeout=10000)
            print(f"{i} click {val} ok")
        elif key == "fill":
            page.fill(val[0], val[1], timeout=10000)
            print(f"{i} fill {val[0]} ok")
        elif key == "wait":
            page.wait_for_timeout(int(val))
        elif key == "shot":
            page.screenshot(path=val, full_page=True)
            print(f"{i} shot {val}")
        elif key == "text":
            print(f"{i} text:\n{visible_text(page, limit)}")
        elif key == "check":
            print(f"{i} check {json.dumps(report(page))}")
        else:
            print(f"{i} UNKNOWN step {key}")
            return 2
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("cmd", choices=["check", "text", "shot", "run"])
    p.add_argument("target")
    p.add_argument("out", nargs="?")
    p.add_argument("--max", type=int, default=2000)
    p.add_argument("--desktop", action="store_true")
    p.add_argument("--dark", action="store_true")
    args = p.parse_args()

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = new_page(browser, args)
        try:
            if args.cmd == "run":
                with open(args.target, encoding="utf-8") as f:
                    return run_steps(page, json.load(f), args.max)
            status = goto(page, args.target)
            if args.cmd == "check":
                print(json.dumps(report(page, status), indent=1))
            elif args.cmd == "text":
                print(visible_text(page, args.max))
            elif args.cmd == "shot":
                if not args.out:
                    print("shot needs an output path", file=sys.stderr)
                    return 2
                page.screenshot(path=args.out, full_page=True)
                print(f"saved {args.out} ({'desktop' if args.desktop else 'phone'} size)")
        except Exception as e:  # one short line, not a stack trace
            print(f"FAILED {type(e).__name__}: {str(e).splitlines()[0][:200]}")
            return 1
        finally:
            browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
