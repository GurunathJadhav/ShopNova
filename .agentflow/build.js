#!/usr/bin/env node
/**
 * Agentflow Clean-Context Build Brief & Loop Prompt Generator
 *
 * Distills discovery/requirements/design/tickets into a compact, zero-pollution
 * .agentflow/BUILD-BRIEF.md and outputs a copy-pasteable starter prompt
 * (.agentflow/BUILD-PROMPT.txt) to run the build loop in a brand-new clean
 * agent session.
 *
 * Usage:
 *   node tools/agentflow-build.js <project> [--batch=2] [--ticket=T-xxxx]
 *   node .agentflow/build.js [--batch=2] [--ticket=T-xxxx]
 */

"use strict";

const fs = require("fs");
const path = require("path");

function stripBom(s) {
  return String(s || "").replace(/^\uFEFF/, "");
}

function unquote(s) {
  const t = String(s || "").trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseFrontMatter(filePath) {
  let raw = "";
  try {
    raw = stripBom(fs.readFileSync(filePath, "utf8"));
  } catch {
    return { meta: {}, body: "" };
  }
  const m = raw.match(/(?:^|\n)---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  let currentKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const listMatch = line.match(/^\s+-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(unquote(listMatch[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      const k = kv[1];
      const v = kv[2].trim();
      if (v === "") {
        currentKey = k;
        if (!(k in meta)) meta[k] = [];
      } else if (v === "[]") {
        meta[k] = [];
        currentKey = k;
      } else {
        meta[k] = unquote(v);
        currentKey = null;
      }
    }
  }
  return { meta, body: m[2] };
}

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ name: f, path: path.join(dir, f) }));
}

function ticketAliases(id) {
  const s = String(id || "");
  const parts = s.split("-");
  const out = [s];
  if (parts.length >= 2 && parts[0].toUpperCase() === "T") out.push(parts.slice(0, 2).join("-"));
  return out;
}

function collectBuildState(targetRoot) {
  const afDir = path.join(targetRoot, ".agentflow");
  if (!fs.existsSync(afDir)) {
    throw new Error(`.agentflow/ not found in ${targetRoot}`);
  }

  let projText = "";
  try { projText = stripBom(fs.readFileSync(path.join(afDir, "project.md"), "utf8")); } catch {}
  const projMeta = parseFrontMatter(path.join(afDir, "project.md")).meta;
  const extractLine = (txt, key) => {
    const m = txt.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : "";
  };

  let stateText = "";
  try { stateText = stripBom(fs.readFileSync(path.join(afDir, "STATE.md"), "utf8")); } catch {}

  const project = {
    name: (projMeta.name && !String(projMeta.name).includes("<") ? projMeta.name : null) || path.basename(targetRoot),
    owner: (projMeta.owner && !String(projMeta.owner).includes("<") ? projMeta.owner : ""),
    description: (projMeta.description && !String(projMeta.description).includes("<") ? projMeta.description : "") || "",
    strictness: projMeta.strictness || extractLine(stateText, "strictness") || "balanced",
    phase: extractLine(stateText, "phase") || "discovery",
    profile: extractLine(projText, "profile") || "generic",
    stack: extractLine(projText, "stack") || "see decisions/",
    conventions: extractLine(projText, "conventions") || "",
  };

  // Event-derived ticket statuses
  const statusMap = {};
  for (const f of listMd(path.join(afDir, "events"))) {
    const { meta } = parseFrontMatter(f.path);
    const fnMatch = f.name.match(/^(\d{8}T\d{6}Z|ts-unknown)-([A-Za-z0-9-]+?)-(ticket-[a-z-]+|status-change|done)-(.+)\.md$/);
    const evType = String(meta.event_type || (fnMatch ? fnMatch[3] : "")).toLowerCase();
    const tid = meta.ticket_id && meta.ticket_id !== "none" ? String(meta.ticket_id) : (fnMatch && fnMatch[2] !== "none" ? fnMatch[2] : null);
    if (!tid) continue;
    let st = null;
    if (evType === "ticket-created") st = "backlog";
    else if (evType === "ticket-ready") st = "ready";
    else if (evType === "ticket-claimed" || evType === "ticket-started" || evType === "ticket-in-progress") st = "in-progress";
    else if (evType === "ticket-in-review") st = "in-review";
    else if (evType === "ticket-done" || evType === "done") st = "done";
    else if (evType === "ticket-blocked") st = "blocked";
    else if (evType === "ticket-cancelled") st = "cancelled";
    else if (evType === "ticket-deferred") st = "deferred";
    if (st) {
      for (const a of ticketAliases(tid)) statusMap[a] = st;
    }
  }

  // Distilled Requirements (excluding dropped/descoped)
  const reqs = [];
  for (const f of listMd(path.join(afDir, "requirements"))) {
    const { meta } = parseFrontMatter(f.path);
    const st = String(meta.status || "proposed").toLowerCase();
    if (st === "dropped" || st === "descoped") continue;
    reqs.push({
      id: meta.id || f.name.replace(/\.md$/, ""),
      title: meta.title || f.name.replace(/\.md$/, ""),
      moscow: String(meta.moscow || meta.priority || "must").toLowerCase(),
      status: st,
    });
  }

  // Distilled Decisions (ADRs)
  const decisions = [];
  for (const f of listMd(path.join(afDir, "decisions"))) {
    const { meta, body } = parseFrontMatter(f.path);
    const heading = (body.match(/^#\s+(.+)$/m) || [])[1] || "";
    decisions.push({
      id: meta.id || f.name.replace(/\.md$/, ""),
      title: meta.title || heading || f.name.replace(/\.md$/, ""),
      type: meta.decision_type || "two-way",
    });
  }

  // Environment / verification commands
  const envFacts = [];
  for (const f of listMd(path.join(afDir, "environment"))) {
    const { meta, body } = parseFrontMatter(f.path);
    const firstLine = body.split(/\r?\n/).find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("<!--")) || "";
    envFacts.push({
      name: meta.id || f.name.replace(/\.md$/, ""),
      note: meta.summary || firstLine.trim().slice(0, 140),
    });
  }

  // Tickets ordered cleanly: active/in-progress -> ready -> backlog, and MVP-1/must first
  const moscowWeight = { must: 1, should: 2, could: 3, wont: 4 };
  const statusWeight = { "in-progress": 0, "in-review": 1, ready: 2, backlog: 3, reopened: 2, blocked: 4 };

  const allTickets = [];
  for (const f of listMd(path.join(afDir, "tickets"))) {
    const { meta } = parseFrontMatter(f.path);
    const id = String(meta.id || f.name.replace(/\.md$/, ""));
    let st = "backlog";
    for (const a of ticketAliases(id)) {
      if (statusMap[a]) { st = statusMap[a]; break; }
    }
    const moscow = String(meta.moscow || meta.priority || "must").toLowerCase();
    const mvp = meta.mvp || meta.milestone || (moscow === "must" ? "MVP-1" : moscow === "should" ? "MVP-2" : "MVP-3");
    allTickets.push({
      id,
      file: f.name,
      title: meta.title || id,
      status: st,
      size: String(meta.size || "M").toUpperCase(),
      moscow,
      mvp,
      lane: String(meta.lane || "standard").toLowerCase(),
      deps: Array.isArray(meta.dependencies) ? meta.dependencies : (meta.dependencies ? [meta.dependencies] : []),
    });
  }

  const pendingTickets = allTickets
    .filter((t) => !["done", "cancelled", "deferred", "superseded"].includes(t.status))
    .sort((a, b) => {
      const sw = (statusWeight[a.status] ?? 5) - (statusWeight[b.status] ?? 5);
      if (sw !== 0) return sw;
      const mv = String(a.mvp).localeCompare(String(b.mvp));
      if (mv !== 0) return mv;
      return (moscowWeight[a.moscow] ?? 5) - (moscowWeight[b.moscow] ?? 5);
    });

  return { project, reqs, decisions, envFacts, allTickets, pendingTickets };
}

function renderBuildBrief(state) {
  const { project, reqs, decisions, envFacts, allTickets, pendingTickets } = state;
  const doneCount = allTickets.filter((t) => t.status === "done").length;
  const isUiProject = /web-app|mobile/i.test(project.profile);

  return [
    "# Clean Build Context Brief",
    "<!-- Auto-generated by .agentflow/build.js — compact fresh-session context (<1,000 tokens). Do NOT bulk-read old discovery Q&A or full event logs. -->",
    "",
    "## Project Snapshot",
    `- **Project:** ${project.name}${project.description ? " — " + project.description : ""}${project.owner ? " (GitHub: @" + project.owner + ")" : ""}`,
    `- **Mode (strictness):** \`${project.strictness}\` · **Phase:** \`${project.phase}\` · **Profile:** \`${project.profile}\``,
    `- **Stack:** ${project.stack}${project.conventions ? " · **Conventions:** " + project.conventions : ""}`,
    `- **Progress:** ${doneCount}/${allTickets.length} tickets done, ${pendingTickets.length} remaining`,
    "",
    `## Approved Requirements (${reqs.length})`,
    reqs.length ? reqs.slice(0, 20).map((r) => `- \`${r.id}\` [${r.moscow}/${r.status}] ${r.title}`).join("\n") : "- See `.agentflow/requirements/` (none recorded yet)",
    "",
    `## Architecture & Design Decisions (${decisions.length})`,
    decisions.length ? decisions.slice(0, 15).map((d) => `- \`${d.id}\` (${d.type}): ${d.title}`).join("\n") : "- Keep architecture lean (`lean-architecture`); record major one-way choices in `decisions/`",
    "",
    "## Environment & Verification Commands",
    envFacts.length ? envFacts.slice(0, 10).map((e) => `- **${e.name}:** ${e.note}`).join("\n") : "- Check `.agentflow/project.md` Quality Profile & `package.json`/project config for exact test, build, lint, and start commands.",
    "",
    `## Ordered Build Queue (${pendingTickets.length} remaining)`,
    pendingTickets.length ? pendingTickets.map((t, i) => `${i + 1}. \`${t.id}\` [${t.mvp} | ${t.size} | ${t.status}] — ${t.title} (\`.agentflow/tickets/${t.file}\`)`).join("\n") : "- All planned tickets are done! Run `/af-regression` and `/af-release-check`.",
    "",
    "## Fresh-Session Execution Rules (Anti-Context-Pollution)",
    `1. **Read ONLY:** \`.agentflow/STATE.md\`, \`.agentflow/BUILD-BRIEF.md\`, and the **1 active ticket file**${isUiProject ? " + `.agentflow/skills/frontend-and-ui-craft/SKILL.md`" : ""}. Never bulk-read old \`questions/\` or \`events/\`.`,
    `2. **Build in Vertical Slices:** In \`${project.strictness}\` mode, implement complete slice (logic + cohesive UI/styles + tests) inside the ticket manifest.`,
    "3. **Real Verification:** Run tests + build + lint + **live runtime smoke check** (zero console/runtime errors) via `/af-verify`.",
    "4. **Update Telemetry & Rotate Context:** On `/af-done`, record `actual_minutes` + `approx_tokens`, commit ticket cleanly, run `node .agentflow/report.js` + `node .agentflow/build.js`, and start a fresh session after the batch completes.",
    "",
  ].join("\n");
}

function renderLoopPrompt(state, opts = {}) {
  const { project, pendingTickets } = state;
  const batchSize = opts.batch || (project.strictness === "strict" ? 1 : 2);
  const targetTickets = opts.ticket
    ? pendingTickets.filter((t) => t.id === opts.ticket || t.id.startsWith(opts.ticket))
    : pendingTickets.slice(0, batchSize);

  const isUiProject = /web-app|mobile/i.test(project.profile);
  const ticketList = targetTickets.length
    ? targetTickets.map((t) => `  - ${t.id}: ${t.title} (.agentflow/tickets/${t.file})`).join("\n")
    : "  - (Pick the first ready ticket from .agentflow/BUILD-BRIEF.md, or run /af-regression if all tickets are done.)";

  return [
    `Start a CLEAN BUILD LOOP session for "${project.name}" (${project.strictness} mode).`,
    "",
    "CONTEXT HYGIENE (do NOT pollute context):",
    "- Read ONLY: .agentflow/STATE.md, .agentflow/BUILD-BRIEF.md, and the single active ticket file below.",
    `${isUiProject ? "- For UI craft standards, load .agentflow/skills/frontend-and-ui-craft/SKILL.md." : "- Load .agentflow/skills/tdd-implementation/SKILL.md before coding."}`,
    "- Do NOT read historical questions/, events/, or unrelated docs.",
    "",
    `TARGET TICKETS FOR THIS CLEAN SESSION (max ${batchSize} before context rotation):`,
    ticketList,
    "",
    "REPEAT THIS LOOP FOR EACH TICKET ABOVE:",
    "1. /af-edit-plan + /af-start-ticket -> create/verify manifest (SA1 applies in rapid/balanced for src/+tests), snapshot git baseline, create branch ticket/<id> if using branches.",
    "2. Build complete cohesive vertical slice (code + polished responsive styles/states + unit/integration tests).",
    "3. /af-verify -> run tests, build, lint, AND live runtime smoke check (start/render app, test user flow, confirm zero console errors).",
    "4. /af-diff-check -> /af-review (solo structured self-check + runtime re-verify in rapid/balanced; independent in strict) -> /af-done (log actual_minutes & approx_tokens).",
    "5. Refresh dashboard & next brief: run `node .agentflow/report.js` and `node .agentflow/build.js`, then commit ticket work cleanly.",
    "",
    "WHEN THIS BATCH FINISHES (or if context grows large):",
    "STOP coding, confirm clean git status, print the updated prompt from .agentflow/BUILD-PROMPT.txt, and ask me to open a new clean session for the next batch.",
  ].join("\n");
}

function generateBuildArtifacts(targetRoot, opts = {}) {
  const resolved = path.resolve(targetRoot);
  const afDir = path.join(resolved, ".agentflow");
  const state = collectBuildState(resolved);
  const brief = renderBuildBrief(state);
  const prompt = renderLoopPrompt(state, opts);

  const briefPath = path.join(afDir, "BUILD-BRIEF.md");
  const promptPath = path.join(afDir, "BUILD-PROMPT.txt");
  fs.writeFileSync(briefPath, brief, "utf8");
  fs.writeFileSync(promptPath, prompt + "\n", "utf8");

  return { briefPath, promptPath, brief, prompt, state };
}

module.exports = { generateBuildArtifacts, collectBuildState, renderBuildBrief, renderLoopPrompt };

if (require.main === module) {
  const args = process.argv.slice(2);
  let targetArg = null;
  let batch = null;
  let ticket = null;

  for (const a of args) {
    if (a.startsWith("--batch=")) batch = Math.max(1, parseInt(a.slice(8), 10) || 2);
    else if (a.startsWith("--ticket=")) ticket = a.slice(9).trim();
    else if (!a.startsWith("-")) targetArg = a;
  }

  if (!targetArg) {
    targetArg = path.basename(__dirname) === ".agentflow"
      ? path.resolve(__dirname, "..")
      : process.cwd();
  }

  try {
    const res = generateBuildArtifacts(targetArg, { batch, ticket });
    console.log(`\n✓ Generated clean build brief: ${res.briefPath}`);
    console.log(`✓ Generated loop prompt:       ${res.promptPath}`);
    console.log(`  Remaining tickets: ${res.state.pendingTickets.length} | Mode: ${res.state.project.strictness}`);
    console.log("\n" + "═".repeat(60));
    console.log("PASTE THIS INTO A BRAND-NEW CLEAN AGENT SESSION:");
    console.log("═".repeat(60) + "\n");
    console.log(res.prompt);
    console.log("\n" + "═".repeat(60) + "\n");
  } catch (e) {
    console.error(`Build handoff error: ${e.message}`);
    process.exit(1);
  }
}
