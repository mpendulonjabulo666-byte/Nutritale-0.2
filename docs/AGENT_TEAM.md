# AGENT_TEAM.md: one team per page, fewer tokens

Owner: Varrick. Decided by the owner on 23 Nov 2026. This replaces the Builder, Designer and Reviewer roles in `docs/AGENT_JOBS_V1.md` for page work.

## The team for each page

| # | Agent | File | Model | Does |
|---|---|---|---|---|
| 0 | **Vex** (lead, she) | main session | owner's choice | Gives out the page, merges the two scout reports, approves when all four checks pass. |
| 1 | Scout 1, code | `.claude/agents/scout-code.md` | haiku | Finds the page's existing code. Read-only. |
| 2 | Scout 2, design | `.claude/agents/scout-design.md` | haiku | Reads the picture, brief and page list. Read-only. |
| 3 | Builder | `.claude/agents/builder.md` | sonnet | Builds the page from the two reports only. |
| 4 | Code checker | `.claude/agents/code-checker.md` | haiku | Typecheck, lint, hidden characters, secrets. Never fixes. |
| 5 | Tester | `.claude/agents/tester.md` | sonnet | Writes and runs tests, runs the browser script. |

The model names are a starting point. Vex can change them if a cheap model gives weak reports.

## Order of work (like crews on a site: nobody waits)

1. Vex starts **both scouts at the same time** for page N.
2. Scouts write their reports to `.agent-reports/<page>/` (not committed).
3. Vex hands the builder both reports. **At the same time, she starts the scouts for page N+1.**
4. When the builder hands off, Vex starts **the code checker and the tester at the same time**.
5. A FAILED check goes back to the builder with the report line. Nothing else is re-read.
6. When checks 1 and 2 pass, the owner does checks 3 and 4 on his phone. Then Vex marks the page DONE.

## The four checks (every page, before DONE)

| # | Check | Who | Pass when |
|---|---|---|---|
| 1 | Code | Code checker | Typecheck passes, lint passes (or is UNABLE, stated), hidden-character scan prints nothing, no secrets in the diff. |
| 2 | Tests | Tester | Page tests pass. Browser script: no console errors, `under_44px` is 0, `horizontal_scroll` is false. |
| 3 | Phone | Owner | Looks like its design target on the owner's Android phone. Every button works. |
| 4 | Accessibility | Owner | Still usable at the largest font size and with Remove animations on. |

If any check fails, the page is not done.

## Token rules

1. **Scouts read, the builder builds.** The builder opens only files the scouts named. Each report is 40 lines or fewer.
2. **Browser work goes through `scripts/browser.py`, never a browser tool.** It prints a short report instead of screenshots and page trees. Open a screenshot only when a check fails.
3. **Small diffs.** One page per job. The checker reads the diff, not the whole app.
4. **Say UNKNOWN instead of searching forever.** A scout that cannot find something in two searches writes UNKNOWN and stops.
5. **No new packages and no new features** without the owner's yes. Later features in `docs/PAGES_V1.md` stay out.

## Browser script

```
pip install playwright                           # once, ask the owner first
python -m playwright install chromium            # once
python scripts/browser.py check http://localhost:8081
python scripts/browser.py shot  http://localhost:8081 .agent-reports/welcome/phone.png
python scripts/browser.py text  http://localhost:3000 --max 1500
python scripts/browser.py run   steps.json
```

It works on any page a browser can open: the Next.js site, or the Expo app in web mode (`npx expo start --web`). It does not replace the real-phone test (checks 3 and 4). Tested 23 Nov 2026 against a local test page: `check`, `text`, `shot` and `run` all worked, and a bad address printed one FAILED line.

## Skills for each agent (if installed on the owner's PC)

Load only these. Extra skills cost tokens on every job.

| Agent | Skills |
|---|---|
| Scouts | `no-guessing` |
| Builder | `vercel:react-best-practices`, `frontend-design`, `no-guessing` |
| Code checker | `engineering:code-review`, `anthropic-skills:app-security-check` |
| Tester | `engineering:testing-strategy`, `design:accessibility-review` |

The Swift skills are for native iPhone apps. NutriTale is Expo and React Native, so they do not apply.
