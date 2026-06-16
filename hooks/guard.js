#!/usr/bin/env node
/*
 * claude-consultant read-only guard (PreToolUse hook).
 *
 * Blocks Write/Edit-family tool calls that target a path INSIDE the project
 * repo, but ONLY while a consultant audit is actively running in that same
 * repo. Inert otherwise.
 *
 * Fails OPEN: on any error, ambiguity, or missing signal it ALLOWS the call,
 * so this hook can never break normal editing in your other work.
 *
 * Lifecycle: the audit skill writes ~/.claude/consultant-audit.lock
 *     { "active": true, "cwd": "<repo root>", "ts": <epoch ms> }
 * at the start of a run and sets "active": false at the end.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const LOCK_TTL_MS = 30 * 60 * 1000; // self-heal if a run never cleared the lock

function allow() {
  process.exit(0);
}

function deny(target) {
  const reason =
    'claude-consultant is read-only toward the project. An audit is in ' +
    'progress in this repo, so writing to "' + target + '" is blocked. The ' +
    'consultant only writes to its store under ' +
    '~/.claude/projects/<repo>/memory/consultant/. To apply a recommendation, ' +
    'apply it yourself or run it outside an audit.';
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

function norm(p) {
  let r = path.resolve(p);
  if (process.platform === 'win32') r = r.toLowerCase();
  return r;
}

function isInside(dir, target) {
  const d = norm(dir);
  const t = norm(target);
  if (d === t) return true;
  const rel = path.relative(d, t);
  return rel.length > 0 && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function main() {
  let raw;
  try {
    raw = fs.readFileSync(0, 'utf8'); // stdin
  } catch (e) {
    return allow();
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch (e) {
    return allow();
  }

  const target = input && input.tool_input && input.tool_input.file_path;
  if (!target) return allow(); // nothing path-like to guard

  const projectDir = process.env.CLAUDE_PROJECT_DIR || (input && input.cwd);
  if (!projectDir) return allow();

  // Is an audit active in THIS repo?
  let lock;
  try {
    const lockPath = path.join(os.homedir(), '.claude', 'consultant-audit.lock');
    lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (e) {
    return allow(); // no lock => not auditing
  }

  if (!lock || lock.active !== true) return allow();
  if (typeof lock.ts !== 'number' || Date.now() - lock.ts > LOCK_TTL_MS) return allow();
  if (!lock.cwd || norm(lock.cwd) !== norm(projectDir)) return allow(); // a different repo

  if (isInside(projectDir, target)) return deny(target);
  return allow();
}

try {
  main();
} catch (e) {
  allow(); // fail open, always
}
