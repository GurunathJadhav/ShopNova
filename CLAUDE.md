<!-- agentflow:begin v1.0.0 -->
@AGENTS.md

## Claude Code — Agentflow Wiring
- Commands live in `.agentflow/commands/<name>.md`; optionally mirror them into `.claude/commands/` for native slash commands. Type `/af-*` and follow the referenced command file.
- Skills live in `.agentflow/skills/<name>/SKILL.md`; load on demand as the router (`using-agentflow`) directs.
- Path-scoped rules are supported via `.claude/rules/*.md` (optional `paths:` front matter) if you want extra enforcement reminders.

## Recommended Permission Settings
- Auto-approve / bypass modes OFF (never `--dangerously-skip-permissions`).
- Require confirmation for shell commands outside the project allowlist.
- Reject writes or edits outside the actively approved Edit Manifest.
- Bypass modes undermine human approvals: Agentflow's approvals are only as strong as these settings.
<!-- agentflow:end -->
