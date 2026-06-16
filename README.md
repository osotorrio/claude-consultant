# claude-consultant

> An on-demand, **read-only** Claude Code consultant. It studies how your project uses Claude
> Code and writes a prioritized, copy-pasteable report of improvements — then remembers across runs.

It addresses two things at once:

1. **Optimizing your Claude setup** — CLAUDE.md / rules / auto-memory health, permissions and
   settings, skills & subagents you could add, MCP, hooks, and token/context economy.
2. **Moving you up the agentic-flow ladder** — from prompt/response toward durable, delegated
   workflows (plan mode, subagents, worktrees, automated review, GitHub integration, headless runs).

It learns from three sources every run: your **project files**, your **local session history**,
and a short **interview** for the things code can't show (deployment, remote services, team
conventions, pain points, goals).

## Install

**Local / quick try** (works today):

```bash
claude --plugin-dir /path/to/claude-consultant
```

**Via a marketplace** (for sharing): once published to the community marketplace, install with
`/plugin install claude-consultant@claude-community`. To self-host, add a marketplace that lists
this repo, then `/plugin install claude-consultant`.

## Usage

```
/claude-consultant:audit
```

Run it whenever you want a fresh read on your setup. Each run reconciles against the last:
recommendations you've applied are auto-detected and marked done; only the rest are revisited.

## Read-only guarantee

The consultant **never creates, edits, or deletes anything in your repo.** This is enforced in
depth, not by instructions alone:

- The **analysis subagent** that crawls your project has only `Read/Grep/Glob/WebFetch` — it
  physically cannot write.
- The **orchestrator** has no `Edit` and no `Bash`; its only write tool is `Write`, used solely
  for its own store.
- A **session-scoped guard hook** (`hooks/guard.js`) blocks repo writes *only while an audit is
  actively running in that repo*. It's inert at all other times, and **fails open** — if it ever
  errors, it allows the write, so it can never break your normal editing.

Everything it persists lives **outside your repo**, under:

```
~/.claude/projects/<repo>/memory/consultant/
```

plus a tiny lock file at `~/.claude/consultant-audit.lock`. Your repo's `git status` stays clean.
If you want a recommendation applied, you apply it — the consultant only advises.

## Privacy (session history)

Each run reads **this project's** local Claude Code transcripts
(`~/.claude/projects/<repo>/*.jsonl`) to spot patterns — repeated manual steps, recurring
corrections, permission churn, context bloat. This is **disclosed every run**, and you can opt
out by saying **"skip history"**. Nothing leaves your machine.

## Memory

Stored as plain Markdown you can read, edit, or delete:

```
~/.claude/projects/<repo>/memory/consultant/
├── MEMORY.md            # concise index
├── recommendations.md   # each rec + impact/effort + status + how it's verified
├── interview.md         # dated invisible-context learnings
├── digests.md           # rolling history-signal digests
└── reports/             # report-<timestamp>.md + latest.md
```

## Requirements

- Claude Code with plugin support.
- **Node.js** for the guard hook (ships with Claude Code).

## How it's built

A small, self-exemplifying plugin: a **skill** (the on-demand entry point), a **read-only
subagent** (heavy analysis in its own context window), a **guard hook**, and a per-project
**memory** store. It practices the agentic setup it recommends.

## License

MIT © Óscar Sotorrío
