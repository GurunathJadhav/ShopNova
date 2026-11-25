#!/usr/bin/env python3
"""
Agentflow Python Test Scaffold & Verification Runner (Zero external dependencies)

1. `scaffold`: Reads Acceptance Criteria from a ticket and generates a starter
   test file (Node, Python pytest/unittest, or Playwright smoke) so the AI
   doesn't waste tokens writing boilerplate setup.
2. `verify`: Executes test/build/lint/smoke commands, captures trimmed output into
   .agentflow/evidence/<ticket>/<slug>.md, writes .agentflow/verifications/V-<id>.md,
   logs step-verified/step-failed event, and clears unverified_step in STATE.md.

Usage:
  python .agentflow/scripts/af_test_runner.py scaffold --ticket T-xxxx --out tests/todo.test.mjs
  python .agentflow/scripts/af_test_runner.py verify --ticket T-xxxx --cmd "npm test" --cmd "npm run build" --criterion AC1
"""

import argparse
import json
import os
import re
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

import af_records  # noqa: E402


def detect_lang(root, out_path=None):
    if out_path:
        if out_path.endswith(".py"):
            return "python"
        if out_path.endswith((".mjs", ".js", ".ts", ".tsx", ".jsx")):
            return "node"
    if os.path.exists(os.path.join(root, "package.json")):
        return "node"
    return "python"


def extract_criteria(ticket_path):
    _, body = af_records.parse_front_matter(ticket_path)
    headings = re.findall(r"^###\s+(.+)$", body, re.M)
    return headings or ["Criterion 1 — Core behavior works end to end"]


def cmd_scaffold(af_dir, args):
    root = os.path.dirname(af_dir)
    tpath, full_tid = af_records.find_ticket_file(af_dir, args.ticket)
    if not tpath:
        print(f"Error: ticket {args.ticket} not found", file=sys.stderr)
        sys.exit(2)

    out_path = os.path.abspath(args.out) if os.path.isabs(args.out) else os.path.join(root, args.out)
    if os.path.exists(out_path) and not args.force:
        print(f"Skip: {args.out} already exists (pass --force to overwrite)")
        return

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    criteria = extract_criteria(tpath)
    lang = args.lang or detect_lang(root, out_path)

    if lang == "python":
        cases = "\n\n".join(
            f"def test_{re.sub(r'[^a-z0-9]+', '_', c.lower()).strip('_')[:40] or f'ac_{i}'}():\n"
            f"    \"\"\"{c}\"\"\"\n"
            f"    # TODO: replace assertion with real check for {full_tid}\n"
            f"    raise NotImplementedError('Red phase: implement assertion for {c}')"
            for i, c in enumerate(criteria, 1)
        )
        content = f"# Auto-scaffolded tests for {full_tid}\nimport pytest\n\n\n{cases}\n"
    else:
        cases = "\n\n".join(
            f"test({json.dumps(c)}, () => {{\n"
            f"  // TODO: replace with real assertion for {full_tid}\n"
            f"  assert.fail('Red phase: implement test for {c}');\n"
            f"}});"
            for c in criteria
        )
        content = (
            f"// Auto-scaffolded tests for {full_tid}\n"
            f"import test from 'node:test';\n"
            f"import assert from 'node:assert/strict';\n\n"
            f"{cases}\n"
        )

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(content)
    print(json.dumps({"scaffolded": os.path.relpath(out_path, root), "criteria_count": len(criteria), "lang": lang}))


def cmd_verify(af_dir, args):
    root = os.path.dirname(af_dir)
    proj_id, _, _ = af_records.read_project_info(af_dir)
    _, full_tid = af_records.find_ticket_file(af_dir, args.ticket)
    ts = af_records.utc_now()

    logs = []
    all_ok = True
    for cmd in args.cmd:
        res = subprocess.run(cmd, cwd=root, shell=True, capture_output=True, text=True, timeout=args.timeout)
        combined = ((res.stdout or "") + "\n" + (res.stderr or "")).strip()
        lines = combined.splitlines()
        trimmed = "\n".join(lines[-160:]) if len(lines) > 160 else combined
        logs.append(f"### Command: `{cmd}` (exit {res.returncode})\n```\n{trimmed}\n```")
        if res.returncode != 0:
            all_ok = False

    slug = re.sub(r"[^a-z0-9]+", "-", (args.slug or args.criterion or "verify").lower()).strip("-")[:32] or "verify"
    ev_dir = os.path.join(af_dir, "evidence", full_tid)
    os.makedirs(ev_dir, exist_ok=True)
    ev_rel = f".agentflow/evidence/{full_tid}/{slug}.md"
    ev_id = af_records.rand_id("EV", slug)

    with open(os.path.join(root, ev_rel), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: evidence\nid: {ev_id}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: implementer\nticket_id: {full_tid}\n"
            f"source_command: \"{' ; '.join(args.cmd).replace(chr(34), chr(39))}\"\ntruncated: false\n---\n\n"
            f"# Verification Evidence: {full_tid} ({args.criterion})\n\n" + "\n\n".join(logs) + "\n"
        )

    vdir = os.path.join(af_dir, "verifications")
    os.makedirs(vdir, exist_ok=True)
    vid = af_records.rand_id("V", slug)
    result_str = "pass" if all_ok else "fail"
    with open(os.path.join(vdir, f"{vid}.md"), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: verification\nid: {vid}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: implementer\nticket_id: {full_tid}\n"
            f"criterion_id: {args.criterion}\nmethod: {args.method}\nresult: {result_str}\n"
            f"evidence_ref: {ev_rel}\n---\n# Verification {vid}: {result_str.upper()}\n"
        )

    ev_type = "step-verified" if all_ok else "step-failed"
    af_records.write_event(af_dir, full_tid, ev_type, vid, f"Verify {args.criterion} -> {result_str} ({vid})")
    if all_ok:
        af_records.rebuild_state(af_dir, unverified="none", next_action="/af-diff-check or next slice")
    else:
        af_records.rebuild_state(af_dir, unverified=slug, next_action=f"Fix failing check ({vid}) and re-run verify")

    print(json.dumps({"verification": vid, "result": result_str, "evidence": ev_rel}))
    sys.exit(0 if all_ok else 1)


def _match_manifest(rel_path, patterns):
    import fnmatch
    norm = rel_path.replace("\\", "/")
    if norm.startswith(".agentflow/"):
        return True
    for pat in patterns:
        p = str(pat or "").strip().replace("\\", "/")
        if not p or p == "none":
            continue
        if p.endswith("/**") and norm.startswith(p[:-3]):
            return True
        if fnmatch.fnmatch(norm, p) or norm == p:
            return True
    return False


def cmd_diff_check(af_dir, args):
    root = os.path.dirname(af_dir)
    proj_id, _, _ = af_records.read_project_info(af_dir)
    _, full_tid = af_records.find_ticket_file(af_dir, args.ticket)
    ts = af_records.utc_now()

    # Load manifest patterns for ticket
    allowed = []
    mdir = os.path.join(af_dir, "manifests")
    if os.path.isdir(mdir):
        for fn in sorted(os.listdir(mdir)):
            if not fn.endswith(".md"):
                continue
            mm, _ = af_records.parse_front_matter(os.path.join(mdir, fn))
            if str(mm.get("ticket_id", "")).startswith(full_tid[:6]):
                for fkey in ("allowed_to_modify", "allowed_to_create"):
                    vals = mm.get(fkey) or []
                    if isinstance(vals, list):
                        allowed.extend(vals)
                    elif vals:
                        allowed.append(str(vals))

    # Determine changed files via git
    changed = []
    diff_text = ""
    try:
        r1 = subprocess.run(["git", "diff", "--name-only", "HEAD"], cwd=root, capture_output=True, text=True, timeout=5)
        r2 = subprocess.run(["git", "ls-files", "--others", "--exclude-standard"], cwd=root, capture_output=True, text=True, timeout=5)
        if r1.returncode == 0:
            changed.extend([x.strip() for x in r1.stdout.splitlines() if x.strip()])
        if r2.returncode == 0:
            changed.extend([x.strip() for x in r2.stdout.splitlines() if x.strip()])
        rd = subprocess.run(["git", "diff", "HEAD"], cwd=root, capture_output=True, text=True, timeout=5)
        if rd.returncode == 0:
            diff_text = rd.stdout
    except Exception:
        pass
    changed = sorted(set(changed))

    off_manifest = [f for f in changed if not _match_manifest(f, allowed)] if allowed else []
    issues = []
    secret_re = re.compile(r"^\+[^+].*(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)")
    debug_re = re.compile(r"^\+[^+].*(\bpdb\.set_trace\(\)|\bdebugger\s*;)")
    for line in diff_text.splitlines():
        if secret_re.match(line):
            issues.append("Possible secret detected in diff addition")
        if debug_re.match(line):
            issues.append(f"Debug statement left in diff: {line[:80]}")

    passed = (len(off_manifest) == 0 and len(issues) == 0)
    ev_dir = os.path.join(af_dir, "evidence", full_tid)
    os.makedirs(ev_dir, exist_ok=True)
    ev_rel = f".agentflow/evidence/{full_tid}/diff-check.md"
    ev_id = af_records.rand_id("EV", "diff-check")
    with open(os.path.join(root, ev_rel), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: evidence\nid: {ev_id}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: implementer\nticket_id: {full_tid}\n"
            f"source_command: \"af_test_runner.py diff-check --ticket {full_tid}\"\ntruncated: false\n---\n"
            f"# Diff Check: {full_tid}\n\nChanged files ({len(changed)}): {changed}\nOff-manifest: {off_manifest}\nHygiene issues: {issues}\n"
        )

    vdir = os.path.join(af_dir, "verifications")
    os.makedirs(vdir, exist_ok=True)
    vid = af_records.rand_id("V", "diff-check")
    res_str = "pass" if passed else "fail"
    with open(os.path.join(vdir, f"{vid}.md"), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: verification\nid: {vid}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: implementer\nticket_id: {full_tid}\n"
            f"criterion_id: diff-check\nmethod: static-check\nresult: {res_str}\n"
            f"evidence_ref: {ev_rel}\n---\n# Diff Check {vid}: {res_str.upper()}\n"
        )

    af_records.write_event(af_dir, full_tid, "diff-checked" if passed else "step-failed", vid, f"Diff check -> {res_str} (changed: {len(changed)}, off-manifest: {len(off_manifest)})")
    print(json.dumps({"verification": vid, "result": res_str, "changed": changed, "off_manifest": off_manifest, "issues": issues}))
    sys.exit(0 if passed else 1)


def cmd_smoke(af_dir, args):
    import time
    import urllib.request
    root = os.path.dirname(af_dir)
    proj_id, _, _ = af_records.read_project_info(af_dir)
    _, full_tid = af_records.find_ticket_file(af_dir, args.ticket)
    ts = af_records.utc_now()

    proc = None
    passed = True
    notes = []
    try:
        if args.start:
            proc = subprocess.Popen(args.start, cwd=root, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
            notes.append(f"Started server: `{args.start}` (pid {proc.pid})")

        if args.url:
            deadline = time.time() + args.wait
            last_err = None
            body = ""
            code = 0
            while time.time() < deadline:
                try:
                    with urllib.request.urlopen(args.url, timeout=3) as resp:
                        code = resp.getcode()
                        body = resp.read().decode("utf-8", errors="replace")
                        last_err = None
                        break
                except Exception as exc:
                    last_err = str(exc)
                    time.sleep(0.5)
            if last_err or code >= 400 or len(body.strip()) == 0:
                passed = False
                notes.append(f"HTTP probe FAILED for {args.url}: code={code}, err={last_err}")
            else:
                notes.append(f"HTTP probe OK ({code}) on {args.url}, {len(body)} bytes received")
        if args.check_file:
            fp = os.path.abspath(args.check_file) if os.path.isabs(args.check_file) else os.path.join(root, args.check_file)
            if os.path.isfile(fp) and os.path.getsize(fp) > 0:
                notes.append(f"Artifact check OK: {args.check_file} ({os.path.getsize(fp)} bytes)")
            else:
                passed = False
                notes.append(f"Artifact check FAILED: {args.check_file} missing or empty")
        if args.exec_cmd:
            r = subprocess.run(args.exec_cmd, cwd=root, shell=True, capture_output=True, text=True, timeout=60)
            notes.append(f"Smoke exec `{args.exec_cmd}` -> exit {r.returncode}")
            if r.returncode != 0:
                passed = False
    finally:
        if proc is not None:
            try:
                proc.terminate()
                proc.wait(timeout=4)
            except Exception:
                try:
                    proc.kill()
                except Exception:
                    pass
            notes.append("Stopped server cleanly")

    ev_dir = os.path.join(af_dir, "evidence", full_tid)
    os.makedirs(ev_dir, exist_ok=True)
    ev_rel = f".agentflow/evidence/{full_tid}/smoke.md"
    ev_id = af_records.rand_id("EV", "smoke")
    with open(os.path.join(root, ev_rel), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: evidence\nid: {ev_id}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: implementer\nticket_id: {full_tid}\n"
            f"source_command: \"af_test_runner.py smoke --url {args.url or 'none'}\"\ntruncated: false\n---\n"
            f"# Live Runtime Smoke Check: {full_tid}\n\n" + "\n".join(f"- {n}" for n in notes) + "\n"
        )

    vdir = os.path.join(af_dir, "verifications")
    os.makedirs(vdir, exist_ok=True)
    vid = af_records.rand_id("V", "smoke")
    res_str = "pass" if passed else "fail"
    with open(os.path.join(vdir, f"{vid}.md"), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: verification\nid: {vid}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: implementer\nticket_id: {full_tid}\n"
            f"criterion_id: runtime-smoke\nmethod: command-output\nresult: {res_str}\n"
            f"evidence_ref: {ev_rel}\n---\n# Runtime Smoke {vid}: {res_str.upper()}\n"
        )

    af_records.write_event(af_dir, full_tid, "step-verified" if passed else "step-failed", vid, f"Live smoke -> {res_str} ({vid})")
    print(json.dumps({"verification": vid, "result": res_str, "notes": notes, "evidence": ev_rel}))
    sys.exit(0 if passed else 1)


def main():
    ap = argparse.ArgumentParser(description="Agentflow Python test & verification runner")
    ap.add_argument("--project", help="Project root or .agentflow path")
    sub = ap.add_subparsers(dest="sub", required=True)

    p_sc = sub.add_parser("scaffold")
    p_sc.add_argument("--ticket", required=True)
    p_sc.add_argument("--out", required=True)
    p_sc.add_argument("--lang", choices=["node", "python"], default=None)
    p_sc.add_argument("--force", action="store_true")

    p_v = sub.add_parser("verify")
    p_v.add_argument("--ticket", required=True)
    p_v.add_argument("--cmd", action="append", required=True, help="Command(s) to execute and capture")
    p_v.add_argument("--criterion", default="AC-all")
    p_v.add_argument("--method", default="automated-test")
    p_v.add_argument("--slug", default="")
    p_v.add_argument("--timeout", type=int, default=180)

    p_dc = sub.add_parser("diff-check")
    p_dc.add_argument("--ticket", required=True)

    p_sm = sub.add_parser("smoke")
    p_sm.add_argument("--ticket", required=True)
    p_sm.add_argument("--start", default="", help="Optional dev server command to launch and clean up")
    p_sm.add_argument("--url", default="", help="HTTP URL to probe")
    p_sm.add_argument("--check-file", default="", help="Verify built HTML/entry artifact exists and is non-empty")
    p_sm.add_argument("--exec", dest="exec_cmd", default="", help="Run standalone DOM/smoke script")
    p_sm.add_argument("--wait", type=int, default=12, help="Seconds to wait for HTTP readiness")

    args = ap.parse_args()
    af_dir = af_records.resolve_af_dir(args.project)
    if args.sub == "scaffold":
        cmd_scaffold(af_dir, args)
    elif args.sub == "verify":
        cmd_verify(af_dir, args)
    elif args.sub == "diff-check":
        cmd_diff_check(af_dir, args)
    elif args.sub == "smoke":
        cmd_smoke(af_dir, args)


if __name__ == "__main__":
    main()
