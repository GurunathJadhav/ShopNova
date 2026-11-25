# Protected Paths

Policy file — changes require an approved `rule-change` (§S2.4).

Protected paths require explicit approval for any modification. Manifest approval covers
**only the exact protected paths listed in that manifest**.

---

## Default Protected Paths

| Path Pattern | Reason | Approval Requirement |
|---|---|---|
| `.env` | Secrets and environment config | Owner approval per access |
| `.env.*` | Secrets and environment config | Owner approval per access |
| `.env*` | Secrets and environment config wildcard | Owner approval per access |
| `secrets/` | Secrets and credentials directory | Owner approval per access |
| `secrets/*` | Secrets and credentials files | Owner approval per access |
| `private/` | Private and uncommitted directory | Owner approval per access |
| `private/*` | Private and uncommitted files | Owner approval per access |
| `*.pem` | Private keys and certificates | Owner approval per access |
| `*.key` | Private keys and certificates | Owner approval per access |
| `*.p12` | Private keys and certificates | Owner approval per access |
| `*.pfx` | Private keys and certificates | Owner approval per access |
| `.agentflow/project.md` | Framework policy file | Rule-change approval |
| `.agentflow/gates.md` | Framework policy file | Rule-change approval |
| `.agentflow/lanes.md` | Framework policy file | Rule-change approval |
| `.agentflow/safety.md` | Framework policy file | Rule-change approval |
| `.agentflow/protected.md` | Framework policy file | Rule-change approval |
| `.agentflow/workflow-map.md` | Framework policy file | Rule-change approval |
| `AGENTS.md` | Agent adapter (outside managed block) | Owner approval |
| `CLAUDE.md` | Agent adapter (outside managed block) | Owner approval |
| `.cursor/rules/*` | Agent adapter rules | Owner approval |
| `package.json` | Package manifest | Approver approval per manifest |
| `package-lock.json` | Lockfile | Approver approval per manifest |
| `yarn.lock` | Lockfile | Approver approval per manifest |
| `pnpm-lock.yaml` | Lockfile | Approver approval per manifest |
| `pnpm-lock.*` | Lockfile wildcard | Approver approval per manifest |
| `Gemfile.lock` | Lockfile | Approver approval per manifest |
| `Pipfile.lock` | Lockfile | Approver approval per manifest |
| `poetry.lock` | Lockfile | Approver approval per manifest |
| `go.sum` | Lockfile | Approver approval per manifest |
| `Cargo.lock` | Lockfile | Approver approval per manifest |
| `composer.lock` | Lockfile | Approver approval per manifest |
| `requirements.txt` | Dependency manifest | Approver approval per manifest |
| `Gemfile` | Dependency manifest | Approver approval per manifest |
| `Pipfile` | Dependency manifest | Approver approval per manifest |
| `pyproject.toml` | Dependency/project manifest | Approver approval per manifest |
| `Cargo.toml` | Dependency/project manifest | Approver approval per manifest |
| `go.mod` | Dependency manifest | Approver approval per manifest |
| `composer.json` | Dependency manifest | Approver approval per manifest |
| `*.dockerfile` | Container configuration | Approver approval |
| `Dockerfile` | Container configuration | Approver approval |
| `docker-compose*` | Container orchestration wildcard | Approver approval |
| `docker-compose*.yml` | Container orchestration | Approver approval |
| `docker-compose*.yaml` | Container orchestration | Approver approval |
| `.dockerignore` | Container configuration | Approver approval |
| `.github/` | GitHub configuration directory | Owner approval |
| `.github/*` | GitHub workflows and configuration | Owner approval |
| `.github/workflows/*` | CI/CD configuration | Owner approval |
| `.gitlab-ci.yml` | CI/CD configuration | Owner approval |
| `Jenkinsfile` | CI/CD configuration | Owner approval |
| `.circleci/*` | CI/CD configuration | Owner approval |
| `azure-pipelines.yml` | CI/CD configuration | Owner approval |
| `deploy/*` | Deployment scripts | Owner approval |
| `infra/` | Infrastructure as code directory | Owner approval |
| `infra/*` | Infrastructure as code files | Owner approval |
| `infrastructure/*` | Infrastructure as code | Owner approval |
| `terraform/*` | Infrastructure as code | Owner approval |
| `*.tf` | Terraform files | Owner approval |
| `k8s/` | Kubernetes configuration directory | Owner approval |
| `k8s/*` | Kubernetes manifests | Owner approval |
| `helm/*` | Helm charts | Owner approval |
| `migrations/` | Database migrations directory | Approver approval |
| `migrations/*` | Database migrations | Approver approval |
| `db/migrate/*` | Database migrations (Rails) | Approver approval |
| `alembic/*` | Database migrations (Python) | Approver approval |
| `prisma/migrations/*` | Database migrations (Prisma) | Approver approval |
| `LICENSE` | Project licence | Owner approval |
| `LICENSE*` | Project licence wildcard | Owner approval |
| `LICENCE` | Project licence | Owner approval |
| `LICENCE*` | Project licence wildcard | Owner approval |
| `.gitignore` | Git configuration | Approver approval |
| `.gitattributes` | Git configuration | Approver approval |
| `coverage/` | Test coverage directory | Approver approval |
| `coverage/*` | Test coverage reports | Approver approval |
| `jest.config.*` | Test configuration | Approver approval |
| `vitest.config.*` | Test configuration | Approver approval |
| `pytest.ini` | Test configuration | Approver approval |
| `setup.cfg` [test] | Test configuration | Approver approval |
| `.nycrc*` | Coverage configuration | Approver approval |
| `.c8rc*` | Coverage configuration | Approver approval |
| `.coveragerc` | Coverage configuration | Approver approval |
| `tsconfig.json` | TypeScript configuration | Approver approval per manifest |
| `.eslintrc*` | Linter configuration | Approver approval |
| `eslint.config.*` | Linter configuration | Approver approval |
| `.prettierrc*` | Formatter configuration | Approver approval |
| `dist/` | Build output directory (do not edit) | Never — generated |
| `dist/*` | Build output (do not edit) | Never — generated |
| `build/` | Build output directory (do not edit) | Never — generated |
| `build/*` | Build output (do not edit) | Never — generated |
| `out/` | Build output directory (do not edit) | Never — generated |
| `out/*` | Build output (do not edit) | Never — generated |
| `generated/` | Generated code directory (do not edit) | Never — generated |
| `generated/*` | Generated code files (do not edit) | Never — generated |
| `*.generated.*` | Generated files | Never — generated |
| `*.min.js` | Minified files | Never — generated |
| `*.min.css` | Minified files | Never — generated |

---

## Frozen Paths (Done Tickets)

Code from **accepted tickets** is frozen. Modifying frozen code requires:
1. A new `change` or `bug` ticket
2. The new ticket's manifest explicitly lists the frozen files
3. Approval for the new manifest

A done ticket may only be reopened via `/af-reopen`, which requires a linked `bug` or `change` ticket.
Reopening unfreezes **only the manifest files of the fix**.

---

## Brownfield Code

In a brownfield project (existing codebase), **all existing code starts frozen**.
The `brownfield-survey` skill performs a read-only survey and records findings as verified facts.

Modifying existing code requires:
1. A ticket with the change as a recorded requirement or criterion
2. An approved manifest listing the exact files
3. The agent has read the current file and confirmed API/function existence (verify-before-edit checklist)

---

## User Additions

The owner may add additional protected paths via `/af-protect`. Each addition is recorded as an event
and added to this list. Removing a protected path is a rule-change (weakening) and requires high-risk approval.

<!-- User-added protected paths will be appended below this line -->
