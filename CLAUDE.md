# CLAUDE.md — rules for every agent and person working in this repository

Owner: Varrick (Njabulo Dlamini). This repository is **public**. Read this file before any work.

## Before every push (agents and people)

Run these checks in order. Do not push if any check fails. Fix it first.

1. **Hidden characters.** Scan for invisible Unicode (zero-width and direction-control characters). The scan must print nothing:
   ```
   LC_ALL=C.UTF-8 grep -rnP '[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{FEFF}]' --exclude-dir=.git --exclude-dir=node_modules .
   ```
   If it finds a hit, remove the character and push only after the scan is clean.
   Tested 22 Nov 2026: it flags a test file with a zero-width space and finds nothing in this repo.
2. **Secrets.** No key, token, password, connection string with a password, or `.env` file goes into git. The repository is public. If a secret was ever committed, treat it as leaked: rotate it first, then clean the history.
3. **Add files by name.** Use `git add <file>`. Never `git add -A` or `git add .`.
4. **Read the diff.** Run `git diff --staged` and check every line before committing.
5. **Truthful docs.** Do not change a result in `SECURITY_AUDIT.md` or `ARCHITECTURE_AUDIT.md` unless the check ran in the current session and the output can be quoted.

## AI disclosure stays

This project is built with AI tools, and it says so. The pitch is stronger when it is accurate.

- Keep the `Co-Authored-By` and session lines in commit messages.
- Do not strip, hide or rewrite AI provenance: no removing metadata, content credentials or watermarks, and no rewriting text to avoid detection.
- The `/remove-ai-marks` skill is **not** part of the push routine, because it does exactly that. Step 1 above removes only invisible junk characters, which can break code and search.
- If the owner decides to change this rule, he edits this section himself.

## Working rules

1. Inspect first, then plan, then build one feature at a time, then test, then document.
2. Do not touch the legacy NutriTale app except to read it.
3. Ask the owner before spending money, posting, deploying, deleting data or touching keys.
4. Needs Tony's accounts (Cortex Synapse: Supabase, Lovable)? Say so. It is a blocker.
5. Reports use the checklist layout and status words DONE, FAILED, UNABLE, WAITING, CONFIRM?, NEEDS YOUR YES, UNKNOWN.
