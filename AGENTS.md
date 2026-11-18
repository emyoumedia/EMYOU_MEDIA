# emyou-media: rules for AI agents

**Cloud session (phone, claude.ai/code)?** If `~/.claude/CLAUDE.md` with Rohith's global rules isn't there, first do
`prompts/cloud-session.md` from github.com/rohithsofficial/playbook ("cloud start"): connect or clone the playbook to
`../playbook`, follow its `global/CLAUDE.md`, save playbook items there and push (fallback: `docs/playbook-inbox.md`).

<!-- about-rohith:start (kept in sync from playbook/templates/project/about-rohith.md; edit it there, not here) -->
## Who you are working with
- **Rohith S Moolya**, full-stack developer and designer in Bangalore. Builds websites, CRMs, CMSs, dashboards,
  Shopify themes, Python tools and AI features, mostly alone, with Claude Code (PC, laptop, phone and cloud).
- He often dictates by voice: understand the intent and ignore typos. Reply short, in plain English.
- His way of working is in his playbook: github.com/rohithsofficial/playbook (private). If you can read it, follow it.
  If not, these rules are enough.

## How to work with him
- **Start:** read this file and `docs/STATUS.md` (and the latest `docs/log/` entry) before changing anything.
- **During:** read before editing, follow the repo's patterns, one branch per task, Conventional Commits with a "why".
  Run the checks (type check, lint, tests, build) before saying done, and say what wasn't verified.
- **Ask first:** database migrations or writes to a live database, deleting data, deploys, pushing to `main`,
  new paid services, new dependencies, anything that sends messages or costs money.
- **Never:** put secrets or `.env` contents in code, docs, logs or chat; invent client facts (prices, reviews,
  people, claims, photos); mix this project's details into other projects.
- **End** (or when he says "end session"): update `docs/STATUS.md` (current state, next steps, traps) and add about
  5 lines to `docs/log/YYYY-MM.md` (done, learned, blocked, next). Commit and push. A lesson that applies to every
  project goes in the playbook as well, without this project's private details.
- If the same kind of task is done by hand a second time, suggest making it a skill or script.
<!-- about-rohith:end -->

## This project
- Group: **emyou**. Keep its details inside this repo.
- Where it stands and what's next: `docs/STATUS.md`. Session history: `docs/log/`.
- What it is and how to run it: `README.md`.
