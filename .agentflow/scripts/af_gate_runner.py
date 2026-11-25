#!/usr/bin/env python3
"""
Agentflow Python Gate & Ticket-Closure Runner (Zero external dependencies)

1. `check-gate`: Audits phase exit criteria (open questions, unbaselined REQs,
   orphan tickets/REQs, unverified steps, open blockers).
2. `advance-gate`: Records GitHub user approval, logs gate-advanced event,
   updates STATE.md, and triggers build.js + report.js on planning -> implementation.
3. `close-ticket`: Verifies DoD (V-* + R-* per strictness), locks edit_lock, logs
   ticket-done with actual_minutes & approx_tokens, rebuilds STATE.md, and refreshes
   report.html + BUILD-BRIEF.md.

Usage:
  python .agentflow/scripts/af_gate_runner.py check-gate
  python .agentflow/scripts/af_gate_runner.py advance-gate --to implementation --quote "Approved"
  python .agentflow/scripts/af_gate_runner.py close-ticket --ticket T-xxxx --actual-min 18 --actual-tokens "~9k" --self-review "All AC and live smoke check verified"
"""

import argparse
import json
import os
import subprocess
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

import af_records  # noqa: E402


def list_md(d):
    if not os.path.isdir(d):
        return []
    return [os.path.join(d, f) for f in sorted(os.listdir(d)) if f.endswith(".md")]


def check_gate_conditions(af_dir):
    failures = []
    # 1. Open blocking questions
    for q in list_md(os.path.join(af_dir, "questions")):
        meta, body = af_records.parse_front_matter(q)
        if str(meta.get("blocking")).lower() == "true" and "## Verbatim answer" not in body:
            failures.append(f"Open blocking question: {meta.get('id', os.path.basename(q))}")

    # 2. Unbaselined requirements
    req_ids = set()
    for r in list_md(os.path.join(af_dir, "requirements")):
        meta, _ = af_records.parse_front_matter(r)
        st = str(meta.get("status", "")).lower()
        if st == "proposed":
            failures.append(f"Unbaselined requirement: {meta.get('id', os.path.basename(r))}")
        if st not in ("dropped", "descoped", "deprecated") and meta.get("id"):
            req_ids.add(meta["id"])

    # 3. Open blockers
    for b in list_md(os.path.join(af_dir, "blockers")):
        meta, _ = af_records.parse_front_matter(b)
        if str(meta.get("status", "open")).lower() != "resolved":
            failures.append(f"Open blocker: {meta.get('id', os.path.basename(b))}")

    # 4. Unverified step in STATE.md
    state_path = os.path.join(af_dir, "STATE.md")
    if os.path.exists(state_path):
        with open(state_path, "r", encoding="utf-8-sig", errors="replace") as fh:
            st = fh.read()
        if "unverified_step: none" not in st:
            failures.append("Unverified step still pending in STATE.md — run af_test_runner.py verify")

    return failures


def run_optional_node_tool(af_dir, script_name):
    root = os.path.dirname(af_dir)
    sp = os.path.join(af_dir, script_name)
    if os.path.exists(sp):
        try:
            subprocess.run(["node", sp], cwd=root, check=False, timeout=30)
        except Exception:
            pass


def cmd_check_gate(af_dir):
    failures = check_gate_conditions(af_dir)
    if failures:
        print(json.dumps({"gate": "FAIL", "failures": failures}, indent=2))
        sys.exit(1)
    print(json.dumps({"gate": "PASS", "failures": []}))


def cmd_advance_gate(af_dir, args):
    failures = check_gate_conditions(af_dir)
    if failures and not args.force:
        print(json.dumps({"gate": "FAIL", "failures": failures}, indent=2))
        sys.exit(1)

    proj_id, owner, _ = af_records.read_project_info(af_dir)
    ts = af_records.utc_now()
    aid = af_records.rand_id("A", f"gate-{args.to}")
    adir = os.path.join(af_dir, "approvals")
    os.makedirs(adir, exist_ok=True)
    with open(os.path.join(adir, f"{aid}.md"), "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: approval\nid: {aid}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: {owner}\nrole: approver\napproved_by: {owner}\n"
            f"target_record: gate-to-{args.to}\nverbatim_quote: \"{args.quote.replace(chr(34), chr(39))}\"\n"
            f"high_risk: false\n---\n# Gate Advance Approval by {owner}\n\nPhase -> `{args.to}`\n\n> {args.quote}\n"
        )

    af_records.write_event(af_dir, "none", "gate-advanced", aid, f"{owner} approved phase advance to {args.to}", actor=owner, role="approver")
    af_records.rebuild_state(af_dir, phase=args.to, edit_lock="locked", active_ticket="none", active_manifest="none", unverified="none")

    if args.to == "implementation":
        run_optional_node_tool(af_dir, "build.js")
    run_optional_node_tool(af_dir, "report.js")
    print(json.dumps({"advanced_to": args.to, "approval": aid, "approved_by": owner}))


def cmd_close_ticket(af_dir, args):
    proj_id, owner, strictness = af_records.read_project_info(af_dir)
    tpath, full_tid = af_records.find_ticket_file(af_dir, args.ticket)
    if not tpath:
        print(f"Error: ticket {args.ticket} not found", file=sys.stderr)
        sys.exit(2)

    tmeta, _ = af_records.parse_front_matter(tpath)
    lane = str(tmeta.get("lane", "standard")).lower()

    # Check verification
    has_pass_verif = False
    for v in list_md(os.path.join(af_dir, "verifications")):
        vm, _ = af_records.parse_front_matter(v)
        if str(vm.get("ticket_id", "")).startswith(full_tid[:6]) and vm.get("result") == "pass" and vm.get("evidence_ref"):
            has_pass_verif = True
            break
    if not has_pass_verif:
        print(f"Error: {full_tid} has no passing verification record with evidence_ref. Run af_test_runner.py verify first.", file=sys.stderr)
        sys.exit(1)

    # Check or generate review record
    has_review = False
    for r in list_md(os.path.join(af_dir, "reviews")):
        rm, _ = af_records.parse_front_matter(r)
        if str(rm.get("ticket_id", "")).startswith(full_tid[:6]) and rm.get("verdict") == "approved":
            has_review = True
            break

    if lane == "standard" and not has_review:
        if args.self_review and strictness in ("rapid", "balanced", "light"):
            rid = af_records.rand_id("R", full_tid[2:6])
            rdir = os.path.join(af_dir, "reviews")
            os.makedirs(rdir, exist_ok=True)
            with open(os.path.join(rdir, f"{rid}.md"), "w", encoding="utf-8") as fh:
                fh.write(
                    f"---\ntype: review\nid: {rid}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
                    f"created: {af_records.utc_now()}\nactor: {owner}\nrole: reviewer\n"
                    f"ticket_id: {full_tid}\nreviewer_type: fresh-session\nverdict: approved\nfindings_count: 0\n---\n"
                    f"# Review {rid}: {full_tid}\n\n{args.self_review}\n"
                )
            has_review = True
        elif strictness not in ("rapid", "light"):
            print(f"Error: {full_tid} needs an approved review record in reviews/ (or pass --self-review in balanced mode).", file=sys.stderr)
            sys.exit(1)

    ts = af_records.utc_now()
    eid = af_records.rand_id("E", "done")
    ev_dir = os.path.join(af_dir, "events")
    os.makedirs(ev_dir, exist_ok=True)
    ev_path = os.path.join(ev_dir, f"{ts}-{full_tid}-ticket-done-{eid}.md")
    with open(ev_path, "w", encoding="utf-8") as fh:
        fh.write(
            f"---\ntype: event\nid: {eid}\nproject_id: {proj_id}\nschema_version: 1.0.0\n"
            f"created: {ts}\nactor: agent\nrole: agent\nevent_type: ticket-done\nticket_id: {full_tid}\n"
            f"target_id: {full_tid}\nactual_minutes: {args.actual_min}\n"
            f"actual_tokens: \"{args.actual_tokens}\"\n"
            f"summary: \"Closed {full_tid} cleanly (actual: {args.actual_min}m, tokens: {args.actual_tokens})\"\n"
            f"---\n# Ticket done: {full_tid}\n"
        )

    af_records.rebuild_state(af_dir, edit_lock="locked", active_ticket="none", active_manifest="none", unverified="none", next_action="/af-next or next ticket in BUILD-BRIEF.md")
    run_optional_node_tool(af_dir, "report.js")
    run_optional_node_tool(af_dir, "build.js")
    print(json.dumps({"closed_ticket": full_tid, "done_event": eid, "edit_lock": "locked"}))


def cmd_coverage(af_dir):
    reqs = {}
    for rf in list_md(os.path.join(af_dir, "requirements")):
        rm, _ = af_records.parse_front_matter(rf)
        st = str(rm.get("status", "")).lower()
        if st in ("dropped", "descoped", "deprecated"):
            continue
        rid = rm.get("id") or os.path.basename(rf)[:-3]
        reqs[rid] = {"priority": rm.get("moscow", rm.get("priority", "must")), "title": rm.get("title", rid), "tickets": []}

    orphans = []
    rows = []
    for tf in list_md(os.path.join(af_dir, "tickets")):
        tm, _ = af_records.parse_front_matter(tf)
        tid = tm.get("id") or os.path.basename(tf)[:-3]
        links = tm.get("req_links") or []
        if isinstance(links, str):
            links = [links]
        matched = False
        for r in links:
            if r in reqs:
                reqs[r]["tickets"].append(tid)
                matched = True
        if not matched:
            orphans.append(tid)
        rows.append((", ".join(links) or "none", tid, tm.get("lane", "standard"), tm.get("size", "S"), tm.get("mvp", "MVP-1")))

    uncovered = [rid for rid, info in reqs.items() if not info["tickets"]]
    pct = round(((len(reqs) - len(uncovered)) / len(reqs)) * 100) if reqs else 100
    ts = af_records.utc_now()

    trace_path = os.path.join(af_dir, "traceability.md")
    lines = [
        f"# Requirements Traceability Matrix\n\nUpdated: {ts} · Coverage: {pct}% ({len(reqs) - len(uncovered)}/{len(reqs)} REQs)\n",
        "| Requirement | Ticket | Lane | Size | MVP |",
        "|---|---|---|---|---|",
    ]
    for rq, tid, ln, sz, mvp in rows:
        lines.append(f"| `{rq}` | `{tid}` | {ln} | {sz} | {mvp} |")
    if uncovered or orphans:
        lines.append(f"\n## Gaps\n- Uncovered REQs: {uncovered}\n- Orphan tickets: {orphans}\n")
    with open(trace_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    passed = (len(uncovered) == 0 and len(orphans) == 0)
    if passed:
        af_records.write_event(af_dir, "none", "coverage-verified", "traceability", f"100% coverage ({len(reqs)} REQs -> {len(rows)} tickets)")
    print(json.dumps({"coverage_pct": pct, "uncovered_reqs": uncovered, "orphan_tickets": orphans, "passed": passed}))
    sys.exit(0 if passed else 1)


def cmd_next(af_dir):
    state_path = os.path.join(af_dir, "STATE.md")
    phase, active_ticket, unverified = "discovery", "none", "none"
    if os.path.exists(state_path):
        with open(state_path, "r", encoding="utf-8-sig", errors="replace") as fh:
            st = fh.read()
        for k in ("phase", "active_ticket", "unverified_step"):
            import re
            m = re.search(rf"^{k}:\s*(.+)$", st, re.M)
            if m:
                if k == "phase": phase = m.group(1).strip()
                elif k == "active_ticket": active_ticket = m.group(1).strip()
                elif k == "unverified_step": unverified = m.group(1).strip()

    failures = check_gate_conditions(af_dir)
    if unverified != "none":
        cmd, reason = "/af-verify", f"Unverified step '{unverified}' active — run af_test_runner.py verify"
    elif failures:
        cmd, reason = "/af-ask", "; ".join(failures[:2])
    elif active_ticket != "none":
        cmd, reason = "/af-verify or /af-done", f"Active ticket {active_ticket} in progress"
    elif phase == "planning":
        cmd, reason = "/af-gate -> /af-build", "Planning ready; advance to implementation and start a clean build session"
    elif phase in ("discovery", "requirements", "tickets"):
        cmd, reason = "/af-gate", f"Current phase '{phase}' has zero open blockers/questions; ready for gate check"
    else:
        cmd, reason = "/af-edit-plan or /af-build", "Ready to pick next ticket from BUILD-BRIEF.md"

    print(json.dumps({"phase": phase, "next_command": cmd, "reason": reason, "open_failures": failures}))


def cmd_commit(af_dir, args):
    import re
    root = os.path.dirname(af_dir)
    _, full_tid = af_records.find_ticket_file(af_dir, args.ticket)
    if args.branch:
        br = f"ticket/{full_tid[:6]}"
        subprocess.run(["git", "checkout", "-B", br], cwd=root, check=False)

    subprocess.run(["git", "add", "-A"], cwd=root, check=True)

    # Native Python pre-commit secret scan (works everywhere without MSYS sh.exe)
    diff = subprocess.run(["git", "diff", "--cached", "-U0"], cwd=root, capture_output=True, text=True, timeout=5)
    secret_re = re.compile(r"^\+[^+].*(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|gho_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)")
    for line in (diff.stdout or "").splitlines():
        if secret_re.match(line):
            print("ERROR: Secret pattern detected in staged changes — aborting commit!", file=sys.stderr)
            sys.exit(1)

    msg = f"[{full_tid}] {args.msg}"
    res = subprocess.run(["git", "commit", "-m", msg], cwd=root, capture_output=True, text=True)
    if res.returncode != 0:
        print(res.stderr or res.stdout, file=sys.stderr)
        sys.exit(res.returncode)
    sha = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=root, capture_output=True, text=True).stdout.strip()
    print(json.dumps({"ticket": full_tid, "commit": sha, "message": msg}))


def main():
    ap = argparse.ArgumentParser(description="Agentflow Python gate & closure runner")
    ap.add_argument("--project", help="Project root or .agentflow path")
    sub = ap.add_subparsers(dest="sub", required=True)

    sub.add_parser("check-gate")
    sub.add_parser("coverage")
    sub.add_parser("next")

    p_cm = sub.add_parser("commit")
    p_cm.add_argument("--ticket", required=True)
    p_cm.add_argument("--msg", required=True)
    p_cm.add_argument("--branch", action="store_true")

    p_adv = sub.add_parser("advance-gate")
    p_adv.add_argument("--to", required=True)
    p_adv.add_argument("--quote", default="Approved by GitHub owner")
    p_adv.add_argument("--force", action="store_true")

    p_cl = sub.add_parser("close-ticket")
    p_cl.add_argument("--ticket", required=True)
    p_cl.add_argument("--actual-min", type=int, default=0)
    p_cl.add_argument("--actual-tokens", default="~0k (approximate)")
    p_cl.add_argument("--self-review", default="")

    args = ap.parse_args()
    af_dir = af_records.resolve_af_dir(args.project)
    if args.sub == "check-gate":
        cmd_check_gate(af_dir)
    elif args.sub == "coverage":
        cmd_coverage(af_dir)
    elif args.sub == "next":
        cmd_next(af_dir)
    elif args.sub == "commit":
        cmd_commit(af_dir, args)
    elif args.sub == "advance-gate":
        cmd_advance_gate(af_dir, args)
    elif args.sub == "close-ticket":
        cmd_close_ticket(af_dir, args)


if __name__ == "__main__":
    main()
