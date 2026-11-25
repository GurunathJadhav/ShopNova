---
name: node-typescript
description: "Use when the project uses Node.js with TypeScript (npm/pnpm/yarn, ESLint, Vitest/Jest, tsc builds)."
version: 1.0.0
last_verified: 2026-11-16
---

# Node.js + TypeScript Stack Pack

Stack packs are hints — verify against the project's actual versions and docs. A stack pack never overrides environment facts (`environment/<fact>.md`) or approved decisions. Record every command you actually ran via `/af-env`.

## Scope & Versions

- Checked against: Node.js 20 LTS and 22 LTS, npm 10.x, TypeScript 5.x, ESLint 9.x (flat config), Vitest 2.x/3.x, Jest 29.x.
- Not claimed: Bun, Deno, Node < 20, TypeScript < 5. Verify the project's own versions first (`node --version`, `npm --version`, the `engines` field).
- Package manager is a project decision: check for `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn) before running anything.

## Standard Commands

| Purpose | Command |
|---------|---------|
| Test | `npm test` (CI: `npm test -- --run` for Vitest) |
| Lint | `npx eslint .` |
| Typecheck | `npx tsc --noEmit` |
| Build | `npm run build` |
| Audit | `npm audit --omit=dev` |

Confirm each script exists in `package.json` first; use the lockfile's package manager for installs. Record verified commands in `environment/` via `/af-env`.

## Conventions

- Read `package.json` `scripts` before inventing commands; prefer project scripts over raw tool invocations.
- Match the project's module system: check `"type": "module"` and `tsconfig` `module`/`moduleResolution` before writing imports.
- Never hand-edit `package-lock.json` (or any lockfile); change `package.json` and reinstall via the project's package manager.
- TypeScript: fix types, do not add `any`, `@ts-ignore`, or `@ts-expect-error` without an approved decision.
- Run checks from the package root; monorepos scope with workspace flags (`npm test --workspaces`, `pnpm -r test`).
- Attach every check result to the ticket via `/af-verify`.

## Common Agent Mistakes

- Hand-editing `package-lock.json` to "fix" a version conflict instead of running the correct install command.
- Mixing ESM and CJS: `import` in a CJS package, or `require` in an ESM package; both fail at runtime, not at edit time.
- Forgetting `"type": "module"` when adding ESM-only dependencies or writing `.js` files with ESM syntax.
- Editing files under `node_modules/` or `dist/` — regenerated output and vendor code are never source.
- Running `npm install` (loose) instead of `npm ci` in CI-like contexts, silently bumping transitive versions.
- Passing tests but skipping `tsc --noEmit`; type errors hide behind `ts-jest`/`esbuild` transpile-only modes.
- Assuming global tools (`tsc`, `eslint`) match project devDependencies; always use the project-local binary.
- Committing `.env` files or reading secrets into test fixtures.

## Version Pitfalls

- ESLint 8 (`eslintrc`) and ESLint 9 (`eslint.config.js` flat config) are incompatible; check which config the repo has before editing lint settings.
- Node 18 is EOL; do not suggest `engines` bumps to unmaintained versions without an approved decision.
- `moduleResolution: "bundler"` differs from `"node16"`/`"nodenext"`; type-only imports and extension rules differ between them.
- Jest vs Vitest config and globals differ; do not port test helpers between them without checking.
- `"^"` ranges mean patch/minor drift between lockfile regenerations; treat lockfile churn in diffs as a finding.

## Stop and Ask the User If…

- The lockfile, `package.json`, and `node_modules/` disagree about dependency versions.
- The project pins an EOL runtime (Node < 20) or a beta TypeScript and the ticket implies an upgrade.
- No test or lint script exists and the ticket requires verification.
- Installing a new dependency is needed but no approved decision covers it.
