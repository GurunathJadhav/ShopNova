#!/usr/bin/env node
/**
 * Agentflow HTML Project Status Dashboard Generator
 *
 * Zero-dependency script that reads .agentflow/ Markdown records and generates
 * a self-contained, interactive HTML dashboard (.agentflow/report.html) with
 * inline SVG pie/donut charts, grouped bar charts, MVP waves, user stories,
 * estimated vs actual timings, token consumption, and quality gate metrics.
 *
 * Usage:
 *   node tools/agentflow-report.js <project-path> [--out=<file>]
 *   node .agentflow/report.js                       (when installed in project)
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ─── Parsers & Helpers ────────────────────────────────────────────────────────

function stripBom(s) {
  return String(s || "").replace(/^\uFEFF/, "");
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    // Fallback for files with leading comment before ---
    const m2 = raw.match(/(?:^|\n)---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m2) return { meta: {}, body: raw };
    return { meta: parseYamlLines(m2[1]), body: m2[2] };
  }
  return { meta: parseYamlLines(m[1]), body: m[2] };
}

function parseYamlLines(yamlBlock) {
  const meta = {};
  const lines = yamlBlock.split(/\r?\n/);
  let currentKey = null;
  let currentObject = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    // List item under currentKey
    const listMatch = line.match(/^\s+-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      meta[currentKey].push(unquote(listMatch[1]));
      currentObject = null;
      continue;
    }

    // Nested key: value under currentObject (e.g., effort_budget:)
    const nestedMatch = line.match(/^  +([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nestedMatch && currentObject) {
      if (typeof meta[currentObject] !== "object" || meta[currentObject] === null || Array.isArray(meta[currentObject])) {
        meta[currentObject] = {};
      }
      meta[currentObject][nestedMatch[1]] = unquote(nestedMatch[2]);
      continue;
    }

    // Top-level key: value
    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kvMatch) {
      const k = kvMatch[1];
      const v = kvMatch[2].trim();
      if (v === "") {
        currentKey = k;
        currentObject = k;
        if (!(k in meta)) meta[k] = [];
      } else if (v === "[]") {
        meta[k] = [];
        currentKey = k;
        currentObject = null;
      } else {
        meta[k] = unquote(v);
        currentKey = null;
        currentObject = null;
      }
    }
  }
  return meta;
}

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ name: f, path: path.join(dir, f) }));
}

function parseCompactUtc(ts) {
  const m = String(ts || "").trim().match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!m) return null;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

function formatUtcHuman(ts) {
  const ms = parseCompactUtc(ts);
  if (!ms) return ts || "—";
  const d = new Date(ms);
  return d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function parseTokens(val) {
  if (val === undefined || val === null) return null;
  const s = String(val).toLowerCase().replace(/,/g, "");
  const m = s.match(/(\d+(?:\.\d+)?)\s*([km])?/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  if (m[2] === "k") n *= 1000;
  else if (m[2] === "m") n *= 1000000;
  return Math.round(n);
}

function parseMinutes(val) {
  if (val === undefined || val === null || val === "") return null;
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  const s = String(val).toLowerCase().trim();
  const hMatch = s.match(/(\d+(?:\.\d+)?)\s*h/);
  const mMatch = s.match(/(\d+(?:\.\d+)?)\s*m/);
  if (hMatch || mMatch) {
    return Math.round((hMatch ? parseFloat(hMatch[1]) * 60 : 0) + (mMatch ? parseFloat(mMatch[1]) : 0));
  }
  const num = parseFloat(s);
  return Number.isNaN(num) ? null : Math.round(num);
}

function formatDuration(mins) {
  if (mins === null || mins === undefined || Number.isNaN(mins)) return "—";
  const m = Math.max(0, Math.round(mins));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function formatTokens(n) {
  if (!n) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

function ticketAliases(id) {
  const s = String(id || "");
  const parts = s.split("-");
  const out = [s];
  if (parts.length >= 2 && parts[0].toUpperCase() === "T") {
    out.push(parts.slice(0, 2).join("-"));
  }
  return out;
}

const SIZE_BASELINE_MIN = { S: 25, M: 60, L: 120 };
const SIZE_BASELINE_TOKENS = { S: 12000, M: 30000, L: 65000 };

// ─── Data Aggregation ─────────────────────────────────────────────────────────

function collectProjectData(targetRoot) {
  const afDir = path.join(targetRoot, ".agentflow");
  if (!fs.existsSync(afDir)) {
    throw new Error(`.agentflow/ directory not found in ${targetRoot}`);
  }

  const projMeta = parseFrontMatter(path.join(afDir, "project.md")).meta;
  let stateText = "";
  try {
    stateText = stripBom(fs.readFileSync(path.join(afDir, "STATE.md"), "utf8"));
  } catch {
    stateText = "";
  }

  const extractStateField = (key) => {
    const m = stateText.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : "unknown";
  };

  const project = {
    name: (projMeta.name && !String(projMeta.name).includes("<") ? projMeta.name : null) || path.basename(targetRoot),
    id: projMeta.project_id || "unknown",
    owner: (projMeta.owner && !String(projMeta.owner).includes("<") ? projMeta.owner : ""),
    description: (projMeta.description && !String(projMeta.description).includes("<") ? projMeta.description : "") || "",
    phase: extractStateField("phase"),
    editLock: extractStateField("edit_lock"),
    tier: extractStateField("tier"),
    strictness: projMeta.strictness || extractStateField("strictness") || "balanced",
    guidance: projMeta.guidance || extractStateField("guidance") || "expert",
    activeTicket: extractStateField("active_ticket"),
    profile: (() => {
      try {
        const pTxt = stripBom(fs.readFileSync(path.join(afDir, "project.md"), "utf8"));
        const pm = pTxt.match(/^profile:\s*(.+)$/m);
        return pm ? pm[1].trim() : "generic";
      } catch {
        return "generic";
      }
    })(),
  };

  // Parse events first for statuses, timings, rework, and timeline
  const events = [];
  const ticketStatusByAlias = {};
  const ticketStartMs = {};
  const ticketDoneMs = {};
  const ticketEventStats = {}; // retries, reopens, reverts, reported tokens/minutes

  for (const f of listMd(path.join(afDir, "events"))) {
    const { meta, body } = parseFrontMatter(f.path);
    let ts = meta.created;
    let fileTicket = null;
    let fileType = null;

    const fnMatch = f.name.match(/^(\d{8}T\d{6}Z|ts-unknown)-([A-Za-z0-9-]+?)-(ticket-[a-z-]+|status-change|step-verified|step-failed|done|pass|fail|gate-advanced)-(.+)\.md$/);
    if (fnMatch) {
      if (!ts) ts = fnMatch[1];
      fileTicket = fnMatch[2] === "none" ? null : fnMatch[2];
      fileType = fnMatch[3];
    }

    const evType = String(meta.event_type || fileType || "event").toLowerCase();
    const tid = meta.ticket_id && meta.ticket_id !== "none" ? String(meta.ticket_id) : fileTicket;
    const ms = parseCompactUtc(ts);

    events.push({
      file: f.name,
      id: meta.id || f.name.replace(/\.md$/, ""),
      created: ts || "",
      ms: ms || 0,
      eventType: evType,
      ticketId: tid,
      actor: meta.actor || "agent",
      summary: meta.summary || evType,
    });

    if (tid) {
      const aliases = ticketAliases(tid);
      let mappedStatus = null;
      if (evType === "ticket-created") mappedStatus = "backlog";
      else if (evType === "ticket-ready") mappedStatus = "ready";
      else if (evType === "ticket-claimed" || evType === "ticket-started" || evType === "ticket-in-progress") mappedStatus = "in-progress";
      else if (evType === "ticket-in-review") mappedStatus = "in-review";
      else if (evType === "ticket-done" || evType === "done") mappedStatus = "done";
      else if (evType === "ticket-blocked") mappedStatus = "blocked";
      else if (evType === "ticket-reopened") mappedStatus = "reopened";
      else if (evType === "ticket-cancelled") mappedStatus = "cancelled";
      else if (evType === "ticket-deferred") mappedStatus = "deferred";

      for (const a of aliases) {
        if (mappedStatus) ticketStatusByAlias[a] = mappedStatus;
        if (!ticketEventStats[a]) ticketEventStats[a] = { retries: 0, reopens: 0, reverts: 0, actualMinutes: null, actualTokens: null };
        if ((evType === "ticket-started" || evType === "ticket-in-progress") && ms && !ticketStartMs[a]) {
          ticketStartMs[a] = ms;
        }
        if ((evType === "ticket-done" || evType === "done") && ms) {
          ticketDoneMs[a] = ms;
        }
        if (evType === "step-failed" || evType === "verification-fail" || evType === "fail") {
          ticketEventStats[a].retries += 1;
        }
        if (evType === "ticket-reopened") ticketEventStats[a].reopens += 1;
        if (evType === "revert-recorded") ticketEventStats[a].reverts += 1;

        const evMin = parseMinutes(meta.actual_minutes);
        if (evMin !== null) ticketEventStats[a].actualMinutes = evMin;
        const evTok = parseTokens(meta.actual_tokens || meta.tokens_used);
        if (evTok !== null) ticketEventStats[a].actualTokens = evTok;
      }
      void body;
    }
  }

  events.sort((a, b) => a.ms - b.ms);

  // Verifications & Reviews index
  const verificationsByAlias = {};
  let verifPass = 0;
  let verifFail = 0;
  for (const f of listMd(path.join(afDir, "verifications"))) {
    const { meta } = parseFrontMatter(f.path);
    const tid = meta.ticket_id;
    const res = String(meta.result || "").toLowerCase();
    if (res === "pass") verifPass++;
    else if (res === "fail") verifFail++;
    if (tid) {
      for (const a of ticketAliases(tid)) {
        if (!verificationsByAlias[a]) verificationsByAlias[a] = [];
        verificationsByAlias[a].push({ id: meta.id || f.name, result: res || "unknown", method: meta.method || "check" });
      }
    }
  }

  const reviewsByAlias = {};
  for (const f of listMd(path.join(afDir, "reviews"))) {
    const { meta } = parseFrontMatter(f.path);
    const tid = meta.ticket_id;
    if (tid) {
      for (const a of ticketAliases(tid)) {
        if (!reviewsByAlias[a]) reviewsByAlias[a] = [];
        reviewsByAlias[a].push({ id: meta.id || f.name, verdict: meta.verdict || "approved" });
      }
    }
  }

  // Requirements & MVPs
  const requirements = [];
  for (const f of listMd(path.join(afDir, "requirements"))) {
    const { meta } = parseFrontMatter(f.path);
    requirements.push({
      id: meta.id || f.name.replace(/\.md$/, ""),
      title: meta.title || f.name.replace(/\.md$/, ""),
      moscow: String(meta.moscow || meta.priority || "must").toLowerCase(),
      status: String(meta.status || "proposed").toLowerCase(),
      mvp: meta.mvp || meta.milestone || null,
    });
  }

  // Tickets / User Stories
  const tickets = [];
  for (const f of listMd(path.join(afDir, "tickets"))) {
    const { meta } = parseFrontMatter(f.path);
    const id = String(meta.id || f.name.replace(/\.md$/, ""));
    const aliases = ticketAliases(id);

    let status = "backlog";
    for (const a of aliases) {
      if (ticketStatusByAlias[a]) { status = ticketStatusByAlias[a]; break; }
    }
    if (meta.status && status === "backlog") status = String(meta.status).toLowerCase();

    const size = String(meta.size || "M").toUpperCase();
    const moscow = String(meta.moscow || meta.priority || "must").toLowerCase();
    const tType = String(meta.ticket_type || "story").toLowerCase();
    const lane = String(meta.lane || "standard").toLowerCase();

    // MVP wave assignment: explicit `mvp` or `milestone`, else derived from MoSCoW
    let mvp = meta.mvp || meta.milestone || null;
    if (!mvp) {
      if (moscow === "must") mvp = "MVP 1 · Core";
      else if (moscow === "should") mvp = "MVP 2 · Enhancements";
      else mvp = "MVP 3 · Future / Nice-to-Have";
    }

    const budget = (typeof meta.effort_budget === "object" && meta.effort_budget) ? meta.effort_budget : {};
    const explicitEstMin = parseMinutes(meta.est_minutes || meta.estimated_minutes || budget.est_minutes);
    const estMin = explicitEstMin !== null ? explicitEstMin : (SIZE_BASELINE_MIN[size] || 45);
    const estSource = explicitEstMin !== null ? "explicit" : "size-baseline";

    // Actual minutes: explicit on ticket -> explicit on done event -> timestamp delta (started..done)
    let actualMin = parseMinutes(meta.actual_minutes || budget.actual_minutes);
    let actualSource = actualMin !== null ? "explicit" : "none";

    let stats = { retries: 0, reopens: 0, reverts: 0, actualMinutes: null, actualTokens: null };
    let sMs = null;
    let dMs = null;
    for (const a of aliases) {
      if (ticketEventStats[a]) {
        stats.retries = Math.max(stats.retries, ticketEventStats[a].retries);
        stats.reopens = Math.max(stats.reopens, ticketEventStats[a].reopens);
        stats.reverts = Math.max(stats.reverts, ticketEventStats[a].reverts);
        if (stats.actualMinutes === null) stats.actualMinutes = ticketEventStats[a].actualMinutes;
        if (stats.actualTokens === null) stats.actualTokens = ticketEventStats[a].actualTokens;
      }
      if (!sMs && ticketStartMs[a]) sMs = ticketStartMs[a];
      if (!dMs && ticketDoneMs[a]) dMs = ticketDoneMs[a];
    }

    if (actualMin === null && stats.actualMinutes !== null) {
      actualMin = stats.actualMinutes;
      actualSource = "event";
    }
    if (actualMin === null && sMs && dMs && dMs >= sMs) {
      const diffMins = Math.max(1, Math.round((dMs - sMs) / 60000));
      // Only use wall-clock event span when reasonable (< 48h active span)
      if (diffMins <= 2880) {
        actualMin = diffMins;
        actualSource = "timestamps";
      }
    }
    if (actualMin === null && status === "done") {
      actualMin = estMin;
      actualSource = "estimated";
    }

    const explicitBudgetTok = parseTokens(budget.approx_tokens || meta.approx_tokens);
    const budgetTokens = explicitBudgetTok !== null && explicitBudgetTok > 0
      ? explicitBudgetTok
      : (SIZE_BASELINE_TOKENS[size] || 25000);
    const explicitActualTok = parseTokens(meta.actual_tokens || budget.actual_tokens) || stats.actualTokens;
    const actualTokens = explicitActualTok !== null
      ? explicitActualTok
      : (status === "done" ? budgetTokens : (status === "in-progress" || status === "in-review" ? Math.round(budgetTokens * 0.6) : 0));
    const tokenSource = explicitActualTok !== null ? "reported" : "approx-budget";

    let verifs = [];
    let revs = [];
    for (const a of aliases) {
      if (verificationsByAlias[a] && verifs.length === 0) verifs = verificationsByAlias[a];
      if (reviewsByAlias[a] && revs.length === 0) revs = reviewsByAlias[a];
    }

    const reqLinks = Array.isArray(meta.req_links) ? meta.req_links : (meta.req_links ? [meta.req_links] : []);

    tickets.push({
      id,
      title: meta.title || id,
      type: tType,
      lane,
      moscow,
      mvp,
      size,
      status,
      reqLinks,
      created: meta.created || "",
      estMin,
      estSource,
      actualMin: actualMin || 0,
      actualSource,
      budgetTokens,
      actualTokens,
      tokenSource,
      retries: stats.retries,
      reopens: stats.reopens,
      reverts: stats.reverts,
      verified: verifs.some((v) => v.result === "pass"),
      reviewed: revs.length > 0,
    });
  }

  // Questions, Blockers, Risks, Waivers
  let openBlockingQuestions = 0;
  let totalQuestions = 0;
  for (const f of listMd(path.join(afDir, "questions"))) {
    totalQuestions++;
    const { meta, body } = parseFrontMatter(f.path);
    if (String(meta.blocking) === "true" && !body.includes("## Verbatim answer")) {
      openBlockingQuestions++;
    }
  }

  const blockers = [];
  for (const f of listMd(path.join(afDir, "blockers"))) {
    const { meta } = parseFrontMatter(f.path);
    if (String(meta.status || "open").toLowerCase() !== "resolved") {
      blockers.push({ id: meta.id || f.name, summary: meta.title || meta.summary || f.name });
    }
  }

  const risks = listMd(path.join(afDir, "risks")).length;
  const waivers = listMd(path.join(afDir, "waivers")).length;
  const decisions = listMd(path.join(afDir, "decisions")).length;

  // Aggregates
  const statusCounts = { done: 0, "in-progress": 0, "in-review": 0, ready: 0, backlog: 0, blocked: 0, other: 0 };
  const typeCounts = { story: 0, task: 0, bug: 0, spike: 0, change: 0 };
  const sizeCounts = { S: 0, M: 0, L: 0 };
  const mvpMap = new Map();

  let totalEstMin = 0;
  let totalActualMin = 0;
  let completedEstMin = 0;
  let completedActualMin = 0;
  let totalBudgetTokens = 0;
  let totalActualTokens = 0;
  let doneVerified = 0;
  let doneReviewed = 0;
  let totalRework = 0;

  for (const t of tickets) {
    if (t.status in statusCounts) statusCounts[t.status]++;
    else statusCounts.other++;

    if (t.type in typeCounts) typeCounts[t.type]++;
    if (t.size in sizeCounts) sizeCounts[t.size]++;

    if (!mvpMap.has(t.mvp)) {
      mvpMap.set(t.mvp, { name: t.mvp, total: 0, done: 0, inProgress: 0, blocked: 0, estMin: 0, actualMin: 0, tokens: 0 });
    }
    const mv = mvpMap.get(t.mvp);
    mv.total++;
    if (t.status === "done") mv.done++;
    if (t.status === "in-progress" || t.status === "in-review") mv.inProgress++;
    if (t.status === "blocked") mv.blocked++;
    mv.estMin += t.estMin;
    mv.actualMin += t.actualMin;
    mv.tokens += t.actualTokens || t.budgetTokens;

    totalEstMin += t.estMin;
    totalActualMin += t.actualMin;
    if (t.status === "done") {
      completedEstMin += t.estMin;
      completedActualMin += t.actualMin;
      if (t.verified) doneVerified++;
      if (t.reviewed) doneReviewed++;
    }
    totalBudgetTokens += t.budgetTokens;
    totalActualTokens += t.actualTokens;
    totalRework += t.retries + t.reopens + t.reverts;
  }

  const mvps = Array.from(mvpMap.values());
  const mvpsDone = mvps.filter((m) => m.total > 0 && m.done === m.total).length;
  const totalStories = tickets.filter((t) => t.type === "story").length;
  const doneStories = tickets.filter((t) => t.type === "story" && t.status === "done").length;

  const firstMs = events.length ? events[0].ms : 0;
  const lastMs = events.length ? events[events.length - 1].ms : 0;
  const projectSpanDays = firstMs && lastMs && lastMs > firstMs
    ? Math.max(1, Math.ceil((lastMs - firstMs) / 86400000))
    : 1;

  return {
    generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
    project,
    requirements,
    tickets,
    mvps,
    events: events.slice(-15).reverse(),
    blockers,
    counts: {
      totalTickets: tickets.length,
      totalStories,
      doneStories,
      mvpsTotal: mvps.length,
      mvpsDone,
      status: statusCounts,
      type: typeCounts,
      size: sizeCounts,
      openBlockingQuestions,
      totalQuestions,
      risks,
      waivers,
      decisions,
      verifPass,
      verifFail,
      doneVerified,
      doneReviewed,
      totalRework,
      eventsTotal: events.length,
    },
    timings: {
      totalEstMin,
      totalActualMin,
      completedEstMin,
      completedActualMin,
      varianceMin: completedActualMin - completedEstMin,
      avgActualMin: statusCounts.done > 0 ? Math.round(completedActualMin / statusCounts.done) : 0,
      projectSpanDays,
    },
    tokens: {
      totalBudgetTokens,
      totalActualTokens,
      avgTokensPerDone: statusCounts.done > 0 ? Math.round(totalActualTokens / statusCounts.done) : 0,
    },
  };
}

// ─── SVG Chart Builders ───────────────────────────────────────────────────────

function buildDonutSvg(slices, centerTop, centerBottom) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = 100;
  const cy = 100;
  const r = 74;
  const inner = 48;

  if (total === 0) {
    return `
      <svg viewBox="0 0 200 200" class="donut-svg" role="img" aria-label="Empty chart">
        <circle cx="${cx}" cy="${cy}" r="${(r + inner) / 2}" fill="none" stroke="var(--border)" stroke-width="${r - inner}" opacity="0.5"/>
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" class="donut-center-val">0%</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-center-lbl">No data yet</text>
      </svg>`;
  }

  let angle = -Math.PI / 2;
  const paths = [];
  const activeSlices = slices.filter((s) => s.value > 0);

  if (activeSlices.length === 1) {
    const s = activeSlices[0];
    paths.push(`<circle cx="${cx}" cy="${cy}" r="${(r + inner) / 2}" fill="none" stroke="${s.color}" stroke-width="${r - inner}" data-tip="${escapeHtml(s.label)}: ${s.value} (100%)" class="chart-hover"/>`);
  } else {
    for (const s of activeSlices) {
      const frac = s.value / total;
      const sweep = frac * Math.PI * 2;
      const a1 = angle;
      const a2 = angle + sweep;
      angle = a2;
      const large = sweep > Math.PI ? 1 : 0;

      const x1o = cx + r * Math.cos(a1);
      const y1o = cy + r * Math.sin(a1);
      const x2o = cx + r * Math.cos(a2);
      const y2o = cy + r * Math.sin(a2);

      const x2i = cx + inner * Math.cos(a2);
      const y2i = cy + inner * Math.sin(a2);
      const x1i = cx + inner * Math.cos(a1);
      const y1i = cy + inner * Math.sin(a1);

      const pct = Math.round(frac * 100);
      const d = [
        `M ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
        `A ${r} ${r} 0 ${large} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)}`,
        `L ${x2i.toFixed(2)} ${y2i.toFixed(2)}`,
        `A ${inner} ${inner} 0 ${large} 0 ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
        "Z",
      ].join(" ");

      paths.push(`<path d="${d}" fill="${s.color}" stroke="var(--surface)" stroke-width="2" data-tip="${escapeHtml(s.label)}: ${s.value} (${pct}%)" class="chart-hover"/>`);
    }
  }

  return `
    <svg viewBox="0 0 200 200" class="donut-svg" role="img" aria-label="${escapeHtml(centerBottom)}">
      ${paths.join("\n")}
      <text x="${cx}" y="${cy - 2}" text-anchor="middle" class="donut-center-val">${escapeHtml(centerTop)}</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-center-lbl">${escapeHtml(centerBottom)}</text>
    </svg>`;
}

function buildGroupedBarSvg(items, seriesA, seriesB, formatFn) {
  if (!items.length) {
    return `<div class="chart-empty">No ticket data recorded yet. Create tickets with <code>/af-ticket</code> to populate charts.</div>`;
  }

  const shown = items.slice(0, 10);
  const w = 640;
  const h = 230;
  const pad = { top: 18, right: 16, bottom: 48, left: 48 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const maxRaw = Math.max(1, ...shown.flatMap((it) => [it.a || 0, it.b || 0]));
  const maxY = Math.ceil(maxRaw * 1.15);

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxY * i) / 4);
    const y = pad.top + plotH - (plotH * i) / 4;
    gridLines.push(`
      <line x1="${pad.left}" y1="${y.toFixed(1)}" x2="${w - pad.right}" y2="${y.toFixed(1)}" stroke="var(--border)" stroke-dasharray="${i === 0 ? "none" : "3 4"}" opacity="${i === 0 ? "0.9" : "0.55"}"/>
      <text x="${pad.left - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="axis-lbl">${escapeHtml(formatFn(val))}</text>
    `);
  }

  const groupW = plotW / shown.length;
  const barW = Math.min(22, Math.max(8, (groupW - 14) / 2));
  const bars = [];

  shown.forEach((it, idx) => {
    const gx = pad.left + idx * groupW + groupW / 2;
    const hA = ((it.a || 0) / maxY) * plotH;
    const hB = ((it.b || 0) / maxY) * plotH;
    const yA = pad.top + plotH - hA;
    const yB = pad.top + plotH - hB;
    const shortId = it.label.length > 9 ? it.label.slice(0, 8) + "…" : it.label;

    bars.push(`
      <rect x="${(gx - barW - 2).toFixed(1)}" y="${yA.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(1, hA).toFixed(1)}" rx="3" fill="${seriesA.color}" class="chart-hover" data-tip="${escapeHtml(it.fullLabel)} · ${escapeHtml(seriesA.label)}: ${escapeHtml(formatFn(it.a || 0))}"/>
      <rect x="${(gx + 2).toFixed(1)}" y="${yB.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(1, hB).toFixed(1)}" rx="3" fill="${seriesB.color}" class="chart-hover" data-tip="${escapeHtml(it.fullLabel)} · ${escapeHtml(seriesB.label)}: ${escapeHtml(formatFn(it.b || 0))}"/>
      <text x="${gx.toFixed(1)}" y="${h - 24}" text-anchor="middle" class="axis-lbl">${escapeHtml(shortId)}</text>
    `);
  });

  return `
    <svg viewBox="0 0 ${w} ${h}" class="bar-svg" role="img" aria-label="${escapeHtml(seriesA.label)} vs ${escapeHtml(seriesB.label)}">
      ${gridLines.join("\n")}
      ${bars.join("\n")}
    </svg>`;
}

// ─── HTML Renderer ────────────────────────────────────────────────────────────

function renderHtml(data) {
  const { project, counts, timings, tokens, mvps, tickets, requirements, events, blockers } = data;
  const pctDone = counts.totalTickets > 0 ? Math.round((counts.status.done / counts.totalTickets) * 100) : 0;

  const statusSlices = [
    { label: "Done", value: counts.status.done, color: "#10b981" },
    { label: "In Progress", value: counts.status["in-progress"] + counts.status["in-review"], color: "#6366f1" },
    { label: "Ready / Backlog", value: counts.status.ready + counts.status.backlog, color: "#94a3b8" },
    { label: "Blocked", value: counts.status.blocked, color: "#f43f5e" },
  ];

  const mvpPalette = ["#6366f1", "#0ea5e9", "#f59e0b", "#8b5cf6", "#10b981"];
  const mvpSlices = mvps.map((m, idx) => ({
    label: m.name,
    value: m.total,
    color: mvpPalette[idx % mvpPalette.length],
  }));

  const timingItems = tickets.map((t) => ({
    label: t.id.split("-").slice(0, 2).join("-"),
    fullLabel: `${t.id} (${t.title})`,
    a: t.estMin,
    b: t.actualMin,
  }));

  const tokenItems = tickets.map((t) => ({
    label: t.id.split("-").slice(0, 2).join("-"),
    fullLabel: `${t.id} (${t.title})`,
    a: t.budgetTokens,
    b: t.actualTokens,
  }));

  const doneCount = counts.status.done || 0;
  const gateScore = doneCount > 0 ? Math.round((counts.doneVerified / doneCount) * 100) : 100;
  const varianceText = timings.completedEstMin > 0
    ? (timings.varianceMin > 0 ? `+${formatDuration(timings.varianceMin)} over est` : timings.varianceMin < 0 ? `${formatDuration(Math.abs(timings.varianceMin))} ahead` : "On estimate")
    : "No completed est yet";

  const mvpOptions = Array.from(new Set(tickets.map((t) => t.mvp)));

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(project.name)} — Agentflow Project Status Dashboard</title>
  <style>
    :root, [data-theme="dark"] {
      --bg: #0b0f19;
      --surface: #111827;
      --surface-2: #192234;
      --border: #263147;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --accent: #6366f1;
      --accent-soft: rgba(99, 102, 241, 0.16);
      --green: #10b981;
      --green-soft: rgba(16, 185, 129, 0.16);
      --amber: #f59e0b;
      --amber-soft: rgba(245, 158, 11, 0.16);
      --rose: #f43f5e;
      --rose-soft: rgba(244, 63, 94, 0.16);
      --sky: #0ea5e9;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    [data-theme="light"] {
      --bg: #f8fafc;
      --surface: #ffffff;
      --surface-2: #f1f5f9;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
      --accent: #4f46e5;
      --accent-soft: rgba(79, 70, 229, 0.1);
      --green: #059669;
      --green-soft: rgba(5, 150, 105, 0.12);
      --amber: #d97706;
      --amber-soft: rgba(217, 119, 6, 0.12);
      --rose: #e11d48;
      --rose-soft: rgba(225, 29, 72, 0.12);
      --sky: #0284c7;
      --shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.85em;
      background: var(--surface-2);
      padding: 2px 6px;
      border-radius: 5px;
      border: 1px solid var(--border);
    }
    .container { max-width: 1320px; margin: 0 auto; padding: 24px 20px 64px; }

    /* Top Header */
    .topbar {
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start;
      gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 24px;
    }
    .brand { display: flex; flex-direction: column; gap: 6px; }
    .brand-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    h1 { margin: 0; font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; }
    .subtitle { color: var(--muted); font-size: 0.92rem; max-width: 72ch; }
    .pill {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px;
      border-radius: 999px; font-size: 0.76rem; font-weight: 600;
      border: 1px solid var(--border); background: var(--surface-2); color: var(--text);
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .pill.accent { background: var(--accent-soft); border-color: rgba(99,102,241,0.35); color: var(--accent); }
    .pill.green { background: var(--green-soft); border-color: rgba(16,185,129,0.35); color: var(--green); }
    .pill.amber { background: var(--amber-soft); border-color: rgba(245,158,11,0.35); color: var(--amber); }
    .pill.rose { background: var(--rose-soft); border-color: rgba(244,63,94,0.35); color: var(--rose); }

    .actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .meta-time { color: var(--muted); font-size: 0.8rem; }
    .btn {
      cursor: pointer; background: var(--surface); color: var(--text); border: 1px solid var(--border);
      border-radius: 8px; padding: 7px 12px; font-size: 0.84rem; font-weight: 600;
      transition: border-color 0.15s, background 0.15s;
    }
    .btn:hover { border-color: var(--accent); background: var(--surface-2); }
    .btn:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    /* KPI Bento Grid */
    .kpi-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px; margin-bottom: 24px;
    }
    .kpi {
      background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
      padding: 16px 18px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 6px;
    }
    .kpi-label { font-size: 0.78rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .kpi-value { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em; }
    .kpi-sub { font-size: 0.82rem; color: var(--muted); }

    /* Cards & Charts */
    .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-bottom: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin-bottom: 20px; }
    @media (max-width: 980px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }

    .card {
      background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
      padding: 18px 20px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 14px;
    }
    .card-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
    .card-title { margin: 0; font-size: 1rem; font-weight: 650; }
    .card-note { font-size: 0.78rem; color: var(--muted); }

    .donut-wrap { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
    .donut-svg { width: 170px; height: 170px; flex-shrink: 0; }
    .donut-center-val { fill: var(--text); font-size: 26px; font-weight: 700; }
    .donut-center-lbl { fill: var(--muted); font-size: 11px; font-weight: 500; }

    .legend { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 150px; }
    .legend-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 0.86rem; }
    .legend-left { display: flex; align-items: center; gap: 8px; }
    .dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
    .legend-inline { display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.8rem; color: var(--muted); }
    .legend-inline span { display: inline-flex; align-items: center; gap: 6px; }

    .bar-svg { width: 100%; height: auto; display: block; }
    .axis-lbl { fill: var(--muted); font-size: 11px; }
    .chart-hover { cursor: pointer; transition: opacity 0.15s; }
    .chart-hover:hover { opacity: 0.82; }
    .chart-empty { padding: 32px 12px; text-align: center; color: var(--muted); font-size: 0.9rem; border: 1px dashed var(--border); border-radius: 10px; }

    /* Progress Bars */
    .progress-list { display: flex; flex-direction: column; gap: 12px; }
    .prog-item { display: flex; flex-direction: column; gap: 5px; }
    .prog-top { display: flex; justify-content: space-between; font-size: 0.86rem; gap: 8px; }
    .prog-track { height: 9px; border-radius: 999px; background: var(--surface-2); overflow: hidden; border: 1px solid var(--border); }
    .prog-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }

    /* Filters & Table */
    .filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
    .input, .select {
      background: var(--surface-2); color: var(--text); border: 1px solid var(--border);
      border-radius: 8px; padding: 7px 11px; font-size: 0.85rem;
    }
    .input { min-width: 220px; flex: 1; }
    .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap; }
    th { background: var(--surface-2); color: var(--muted); font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.04em; cursor: pointer; user-select: none; }
    td.wrap { white-space: normal; min-width: 220px; max-width: 380px; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(99, 102, 241, 0.04); }

    /* Activity & Health */
    .event-list { display: flex; flex-direction: column; gap: 8px; max-height: 290px; overflow-y: auto; }
    .event-row { display: flex; justify-content: space-between; gap: 10px; padding: 8px 10px; background: var(--surface-2); border-radius: 8px; font-size: 0.82rem; border: 1px solid var(--border); }
    .event-ts { color: var(--muted); font-family: ui-monospace, monospace; font-size: 0.76rem; white-space: nowrap; }

    /* Tooltip */
    #tooltip {
      position: fixed; pointer-events: none; z-index: 999; display: none;
      background: #0f172a; color: #f8fafc; border: 1px solid #334155;
      padding: 6px 10px; border-radius: 7px; font-size: 0.78rem; font-weight: 500;
      box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    }
    footer { margin-top: 28px; text-align: center; color: var(--muted); font-size: 0.8rem; }
  </style>
</head>
<body>
  <div id="tooltip"></div>
  <div class="container">
    <header class="topbar">
      <div class="brand">
        <div class="brand-row">
          <h1>${escapeHtml(project.name)}</h1>
          <span class="pill accent">${escapeHtml(project.phase)}</span>
          <span class="pill">${escapeHtml(project.strictness)} mode</span>
          <span class="pill ${project.editLock === "locked" ? "green" : "amber"}">edit lock: ${escapeHtml(project.editLock)}</span>
          <span class="pill">tier ${escapeHtml(project.tier)}</span>
        </div>
        <div class="subtitle">
          ${project.description ? escapeHtml(project.description) + " · " : ""}${project.owner ? `GitHub: <code>@${escapeHtml(project.owner)}</code> · ` : ""}Project ID: <code>${escapeHtml(project.id)}</code> · Profile: <code>${escapeHtml(project.profile)}</code>
          ${project.activeTicket && project.activeTicket !== "none" ? ` · Active: <code>${escapeHtml(project.activeTicket)}</code>` : ""}
        </div>
      </div>
      <div class="actions">
        <span class="meta-time">Updated ${escapeHtml(data.generatedAt)}</span>
        <button class="btn" id="themeBtn" type="button">Toggle Light/Dark</button>
      </div>
    </header>

    <!-- KPI Cards -->
    <section class="kpi-grid" aria-label="Key project metrics">
      <div class="kpi">
        <div class="kpi-label">Completion</div>
        <div class="kpi-value">${pctDone}%</div>
        <div class="kpi-sub">${counts.status.done} of ${counts.totalTickets} tickets done · ${counts.doneStories}/${counts.totalStories} stories</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">MVPs & Requirements</div>
        <div class="kpi-value">${counts.mvpsDone} / ${counts.mvpsTotal} MVPs</div>
        <div class="kpi-sub">${requirements.length} requirements · ${counts.decisions} ADRs logged</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Timings (Est vs Actual)</div>
        <div class="kpi-value">${formatDuration(timings.totalActualMin)}</div>
        <div class="kpi-sub">Est total: ${formatDuration(timings.totalEstMin)} · ${escapeHtml(varianceText)}</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Token Consumption (Approx)</div>
        <div class="kpi-value">${formatTokens(tokens.totalActualTokens)}</div>
        <div class="kpi-sub">Budget: ${formatTokens(tokens.totalBudgetTokens)} · ~${formatTokens(tokens.avgTokensPerDone)}/done ticket</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Quality & Verification</div>
        <div class="kpi-value">${gateScore}%</div>
        <div class="kpi-sub">${counts.verifPass} pass / ${counts.verifFail} fail · ${counts.totalRework} rework events</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Risks & Blockers</div>
        <div class="kpi-value" style="color: ${blockers.length + counts.openBlockingQuestions > 0 ? "var(--rose)" : "var(--green)"}">${blockers.length + counts.openBlockingQuestions}</div>
        <div class="kpi-sub">${blockers.length} blockers · ${counts.openBlockingQuestions} open Qs · ${counts.risks} risks · ${counts.waivers} waivers</div>
      </div>
    </section>

    <!-- Pie / Donut Charts -->
    <section class="grid-2">
      <article class="card">
        <div class="card-head">
          <h2 class="card-title">Tickets & User Stories by Status</h2>
          <span class="card-note">${counts.totalTickets} total items</span>
        </div>
        <div class="donut-wrap">
          ${buildDonutSvg(statusSlices, `${pctDone}%`, "Complete")}
          <div class="legend">
            ${statusSlices.map((s) => `
              <div class="legend-row">
                <span class="legend-left"><span class="dot" style="background:${s.color}"></span>${escapeHtml(s.label)}</span>
                <strong>${s.value}</strong>
              </div>`).join("")}
          </div>
        </div>
      </article>

      <article class="card">
        <div class="card-head">
          <h2 class="card-title">MVP Waves & Scope Distribution</h2>
          <span class="card-note">${counts.mvpsTotal} wave(s)</span>
        </div>
        <div class="donut-wrap">
          ${buildDonutSvg(mvpSlices, `${counts.mvpsDone}/${counts.mvpsTotal}`, "MVPs Done")}
          <div class="legend">
            ${mvps.length ? mvps.map((m, idx) => {
              const p = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0;
              return `
                <div class="prog-item">
                  <div class="prog-top">
                    <span><span class="dot" style="display:inline-block;margin-right:6px;background:${mvpPalette[idx % mvpPalette.length]}"></span>${escapeHtml(m.name)}</span>
                    <strong>${m.done}/${m.total} (${p}%)</strong>
                  </div>
                  <div class="prog-track"><div class="prog-fill" style="width:${p}%;background:${mvpPalette[idx % mvpPalette.length]}"></div></div>
                </div>`;
            }).join("") : `<div class="card-note">No tickets mapped to MVPs yet.</div>`}
          </div>
        </div>
      </article>
    </section>

    <!-- Bar Charts: Timings & Tokens -->
    <section class="grid-2">
      <article class="card">
        <div class="card-head">
          <h2 class="card-title">Estimated vs Actual Timing per Ticket</h2>
          <div class="legend-inline">
            <span><span class="dot" style="background:#94a3b8"></span>Estimated</span>
            <span><span class="dot" style="background:#10b981"></span>Actual</span>
          </div>
        </div>
        ${buildGroupedBarSvg(timingItems, { label: "Estimated", color: "#94a3b8" }, { label: "Actual", color: "#10b981" }, formatDuration)}
      </article>

      <article class="card">
        <div class="card-head">
          <h2 class="card-title">Token Consumption per Ticket (Approximate)</h2>
          <div class="legend-inline">
            <span><span class="dot" style="background:#6366f1"></span>Budget</span>
            <span><span class="dot" style="background:#f59e0b"></span>Used (approx)</span>
          </div>
        </div>
        ${buildGroupedBarSvg(tokenItems, { label: "Budget", color: "#6366f1" }, { label: "Approx Used", color: "#f59e0b" }, formatTokens)}
      </article>
    </section>

    <!-- Extra Insights: Breakdown + Activity + Health -->
    <section class="grid-3">
      <article class="card">
        <div class="card-head">
          <h2 class="card-title">Work Mix & Sizes</h2>
          <span class="card-note">${timings.projectSpanDays}d active span</span>
        </div>
        <div class="progress-list">
          ${[
            { label: "User Stories", val: counts.type.story, color: "#6366f1" },
            { label: "Tasks", val: counts.type.task, color: "#0ea5e9" },
            { label: "Bugs", val: counts.type.bug, color: "#f43f5e" },
            { label: "Spikes / Changes", val: counts.type.spike + counts.type.change, color: "#f59e0b" },
          ].map((x) => {
            const p = counts.totalTickets > 0 ? Math.round((x.val / counts.totalTickets) * 100) : 0;
            return `<div class="prog-item"><div class="prog-top"><span>${x.label}</span><strong>${x.val} (${p}%)</strong></div><div class="prog-track"><div class="prog-fill" style="width:${p}%;background:${x.color}"></div></div></div>`;
          }).join("")}
          <div class="card-note" style="margin-top:4px;">Sizes: <strong>S:</strong> ${counts.size.S} · <strong>M:</strong> ${counts.size.M} · <strong>L:</strong> ${counts.size.L} · Avg time/done: <strong>${formatDuration(timings.avgActualMin)}</strong></div>
        </div>
      </article>

      <article class="card">
        <div class="card-head">
          <h2 class="card-title">Quality & Governance Health</h2>
          <span class="card-note">${counts.eventsTotal} logged events</span>
        </div>
        <div class="progress-list">
          <div class="prog-item">
            <div class="prog-top"><span>Done Tickets Verified (V-*)</span><strong>${counts.doneVerified}/${doneCount}</strong></div>
            <div class="prog-track"><div class="prog-fill" style="width:${doneCount ? Math.round((counts.doneVerified / doneCount) * 100) : 100}%;background:#10b981"></div></div>
          </div>
          <div class="prog-item">
            <div class="prog-top"><span>Done Tickets Reviewed (R-*)</span><strong>${counts.doneReviewed}/${doneCount}</strong></div>
            <div class="prog-track"><div class="prog-fill" style="width:${doneCount ? Math.round((counts.doneReviewed / doneCount) * 100) : 100}%;background:#0ea5e9"></div></div>
          </div>
          <div class="card-note">Open questions: <strong>${counts.openBlockingQuestions}</strong> blocking / ${counts.totalQuestions} total · Active blockers: <strong>${blockers.length}</strong></div>
        </div>
      </article>

      <article class="card">
        <div class="card-head">
          <h2 class="card-title">Recent Activity</h2>
          <span class="card-note">Latest ${events.length}</span>
        </div>
        <div class="event-list">
          ${events.length ? events.map((e) => `
            <div class="event-row">
              <div><strong>${escapeHtml(e.eventType)}</strong>${e.ticketId ? ` <code>${escapeHtml(e.ticketId)}</code>` : ""}<div style="color:var(--muted)">${escapeHtml(e.summary)}</div></div>
              <span class="event-ts">${escapeHtml(formatUtcHuman(e.created))}</span>
            </div>`).join("") : `<div class="card-note">No events recorded yet.</div>`}
        </div>
      </article>
    </section>

    <!-- Interactive User Stories & Tickets Table -->
    <section class="card">
      <div class="card-head">
        <h2 class="card-title">User Stories & Tickets Explorer</h2>
        <div class="filters">
          <input id="qSearch" class="input" type="search" placeholder="Search ID or title..." aria-label="Search tickets" />
          <select id="qStatus" class="select" aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="done">Done</option>
            <option value="in-progress">In Progress</option>
            <option value="in-review">In Review</option>
            <option value="ready">Ready</option>
            <option value="backlog">Backlog</option>
            <option value="blocked">Blocked</option>
          </select>
          <select id="qMvp" class="select" aria-label="Filter by MVP">
            <option value="">All MVPs</option>
            ${mvpOptions.map((m) => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table id="ticketsTable">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Title</th>
              <th>MVP / Wave</th>
              <th>Type</th>
              <th>Status</th>
              <th>Size</th>
              <th>Est Time</th>
              <th>Actual Time</th>
              <th>Tokens (Approx)</th>
              <th>Checks</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.length ? tickets.map((t) => {
              const statusClass = t.status === "done" ? "green" : (t.status === "blocked" ? "rose" : (t.status === "in-progress" || t.status === "in-review" ? "accent" : ""));
              return `
                <tr data-status="${escapeHtml(t.status)}" data-mvp="${escapeHtml(t.mvp)}" data-text="${escapeHtml((t.id + " " + t.title).toLowerCase())}">
                  <td><code>${escapeHtml(t.id)}</code></td>
                  <td class="wrap">${escapeHtml(t.title)}</td>
                  <td>${escapeHtml(t.mvp)}</td>
                  <td>${escapeHtml(t.type)}</td>
                  <td><span class="pill ${statusClass}">${escapeHtml(t.status)}</span></td>
                  <td>${escapeHtml(t.size)}</td>
                  <td>${formatDuration(t.estMin)} <span class="card-note">(${escapeHtml(t.estSource)})</span></td>
                  <td>${t.actualMin ? formatDuration(t.actualMin) : "—"}</td>
                  <td>${formatTokens(t.actualTokens)} / ${formatTokens(t.budgetTokens)}</td>
                  <td>${t.verified ? "V✓" : "V·"} ${t.reviewed ? "R✓" : "R·"}</td>
                </tr>`;
            }).join("") : `<tr><td colspan="10" style="text-align:center;color:var(--muted);padding:24px;">No tickets created yet. Run <code>/af-ticket</code> to add your first user story.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>

    <footer>
      Generated by Agentflow Dashboard · Run <code>node .agentflow/report.js</code> or <code>agentflow report .</code> anytime to refresh from Markdown records.
    </footer>
  </div>

  <script>
    (function () {
      const root = document.documentElement;
      const saved = localStorage.getItem("af-report-theme");
      if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

      document.getElementById("themeBtn").addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("af-report-theme", next);
      });

      const tip = document.getElementById("tooltip");
      document.querySelectorAll("[data-tip]").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          tip.textContent = el.getAttribute("data-tip");
          tip.style.display = "block";
          tip.style.left = (e.clientX + 12) + "px";
          tip.style.top = (e.clientY + 12) + "px";
        });
        el.addEventListener("mouseleave", () => { tip.style.display = "none"; });
      });

      const qSearch = document.getElementById("qSearch");
      const qStatus = document.getElementById("qStatus");
      const qMvp = document.getElementById("qMvp");
      const rows = Array.from(document.querySelectorAll("#ticketsTable tbody tr[data-status]"));

      function applyFilter() {
        const txt = qSearch.value.trim().toLowerCase();
        const st = qStatus.value;
        const mvp = qMvp.value;
        for (const r of rows) {
          const okTxt = !txt || r.getAttribute("data-text").includes(txt);
          const okSt = !st || r.getAttribute("data-status") === st;
          const okMvp = !mvp || r.getAttribute("data-mvp") === mvp;
          r.style.display = (okTxt && okSt && okMvp) ? "" : "none";
        }
      }
      qSearch.addEventListener("input", applyFilter);
      qStatus.addEventListener("change", applyFilter);
      qMvp.addEventListener("change", applyFilter);
    })();
  </script>
</body>
</html>`;
}

// ─── Public API & CLI ─────────────────────────────────────────────────────────

function generateReport(targetRoot, outPath) {
  const resolved = path.resolve(targetRoot);
  const data = collectProjectData(resolved);
  const html = renderHtml(data);
  const dest = outPath ? path.resolve(outPath) : path.join(resolved, ".agentflow", "report.html");
  fs.writeFileSync(dest, html, "utf8");
  return { outFile: dest, data };
}

module.exports = { generateReport, collectProjectData, renderHtml };

if (require.main === module) {
  const args = process.argv.slice(2);
  let targetArg = null;
  let outArg = null;

  for (const a of args) {
    if (a.startsWith("--out=")) outArg = a.slice(6);
    else if (!a.startsWith("-")) targetArg = a;
  }

  // If invoked inside .agentflow/report.js without argument, infer project root as parent of .agentflow/
  if (!targetArg) {
    const parent = path.basename(__dirname) === ".agentflow"
      ? path.resolve(__dirname, "..")
      : process.cwd();
    targetArg = parent;
  }

  try {
    const res = generateReport(targetArg, outArg);
    console.log(`Agentflow HTML report generated: ${res.outFile}`);
    console.log(`  Tickets: ${res.data.counts.totalTickets} (${res.data.counts.status.done} done) | MVPs: ${res.data.counts.mvpsDone}/${res.data.counts.mvpsTotal} | Est: ${formatDuration(res.data.timings.totalEstMin)} | Actual: ${formatDuration(res.data.timings.totalActualMin)} | Approx Tokens: ${formatTokens(res.data.tokens.totalActualTokens)}`);
  } catch (e) {
    console.error(`Report error: ${e.message}`);
    process.exit(1);
  }
}
