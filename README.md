# 🔍 claude-consultant

Ever feel like your Claude Code setup has... gremlins? 🪲 A `CLAUDE.md` that drifted out of date, the same correction typed for the fifth time, mystery permissions creeping in, sessions burning tokens on nothing.

**claude-consultant** is the read-only second opinion that hunts them all down — then hands you a ranked, copy-paste **"do these 3 things"** list. It looks, it advises, and it **never touches your code.** ✋

---

## Why you'll like it

- 🎯 **A real action plan, not a vague audit.** Every finding is ranked by impact and effort, with a copy-paste fix you can apply in seconds.
- 🧠 **It learns from your actual history.** Beyond your files, it reads your real session transcripts — the steps you keep repeating, the corrections you keep making, the prompts you keep clicking *allow* on — and turns them into fixes.
- 🚀 **It levels up how you work.** Friendly nudges from prompt-and-pray toward a real agentic flow: plan mode, subagents, parallel worktrees, automated review.
- ♻️ **It remembers.** Next run it notices what you already fixed and only bugs you about what's left.
- 🔒 **Safe & private.** Read-only toward your repo, working from your local files + history — the only thing it reaches out for is public Claude docs, to keep its advice current.

## Quickstart — ~60 seconds to your first report ⏱️

Inside any Claude Code session, paste these three lines:

```
/plugin marketplace add osotorrio/claude-consultant
/plugin install claude-consultant@claude-consultant
/reload-plugins
```

(You'll get a quick trust prompt while installing — normal for any plugin, just accept it.)

Now open the project you want reviewed and run:

```
/claude-consultant:audit
```

That's it! 🎉 It'll ask to peek at your local history, interview you for a minute, and hand back your report. Run it again anytime — it picks up right where it left off.

## A peek at what you get 👀

> *Example — yours will reflect your own project:*

```
## Top priorities (do these first)
1. Slim down CLAUDE.md (320 → ~150 lines)            impact: high · effort: S
   Why: it loads every turn, eating context and diluting the rules that matter.
2. Turn your 4-step pytest ritual into a /test skill  impact: high · effort: S
   Why: you've typed it by hand in 6 of the last 10 sessions.
3. Tighten Bash(*) → Bash(npm:*, git:*)              impact: med  · effort: S
   Why: a broad permission you never actually use that wide.
```

## Safe by design 🛡️

- **Won't modify your repo.** The analysis runs with no write tools, the report-writer only writes to its own folder, and a guard blocks repo writes during a run — so your `git status` stays clean.
- **Works from local data.** It reads your files and local session history, right on your machine. Don't want history read? Just say **"skip history."**
- **Only reaches out for docs.** The single thing it fetches is public Claude Code documentation, to keep its advice current — never your project data.
- **Keeps its notes to itself.** Reports and memory live under `~/.claude/…`, never in your project. *(It's a Claude Code plugin, so a run uses your normal Claude session.)*

## FAQ

- **Will it change my code?** Nope. It only writes a report — you decide what to apply.
- **What does it read?** Your project files, your local session history, and your interview answers — plus public Claude Code docs, to stay current.
- **Update or remove it?** `/plugin marketplace update claude-consultant` · `/plugin uninstall claude-consultant@claude-consultant`
- **Does it work on any project?** Any project you open in local Claude Code (CLI, desktop, or IDE) — wherever your code lives.

---

🧩 *Requirements:* Claude Code with plugin support + Node.js (both bundled with Claude Code).
🛠️ *Hacking on it?* `claude --plugin-dir /path/to/claude-consultant`
📄 *License:* [PolyForm Noncommercial 1.0.0](LICENSE) © 2026 Óscar Sotorrío — free for non-commercial use; commercial use needs a separate license.
