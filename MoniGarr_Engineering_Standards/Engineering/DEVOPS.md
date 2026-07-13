# DEVOPS — CI/CD, Containers, Infrastructure, and Operations Wiring

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Products, Services, Repositories  
**Canonical Path:** `Engineering/DEVOPS.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`SECURITY.md`](SECURITY.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`TESTING.md`](TESTING.md) · [`ONCALL.md`](ONCALL.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Regulated readiness

When an inheriting project processes PHI/ePHI, CUI, sovereign/community-protected data, or accessibility-normative UI requirements, it **shall** adopt matching overlays via [`../AI/REGULATED_PROFILES.md`](../AI/REGULATED_PROFILES.md), map external authorities via [`../REFERENCES.md`](../REFERENCES.md), and follow the Regulated Operations Overlay in [`../Governance/MOM.md`](../Governance/MOM.md). MES documentation readiness is **not** certification, ATO, FedRAMP authorization, or HIPAA compliance evidence.

## Normative Language

| Term | Meaning |
|------|---------|
| **shall / must** | Mandatory for MES conformance |
| **should** | Strong default; deviation requires an ADR |
| **may** | Optional |
| **Example (CareerPilot)** | Illustrative only |

This standard is **company-wide**. Platform choices may vary by product, but the control intents below remain binding. Named tools (GitHub Actions, Render, Terraform, and peers) are **MES reference implementations / defaults with ADR escape**—not the only allowed stack.

---

## Purpose

DevOps under MES means making delivery **repeatable, observable, secure, and reversible**. It covers:

- Automated CI/CD with enforced gates  
- Container images and runtime hygiene  
- Deploy platforms (PaaS or cloud)  
- Infrastructure-as-code  
- Secrets management  
- Backups and restore proof  
- OpenTelemetry export wiring  

DevOps is not “whoever has prod SSH.” It is codified promotion with evidence.

---

## Normative Control Points

These controls are binding regardless of CI, PaaS, or IaC vendor:

| Control | Expectation |
|---------|-------------|
| Automated quality gates | Lint, types, unit/integration tests; fail the change on violation |
| Coverage evidence | Publish artifacts; enforce agreed floors toward deterministic 100% target |
| Security scans | SAST, secret scan, dependency/advisory scan before production |
| Eval gates | Required for AI-affecting release paths |
| Reproducible artifacts | Builds from protected branches/tags; immutable tags for production |
| Privileged deploy separation | Build ≠ deploy permissions; protected environments; least-privilege credentials |
| Fork / untrusted PR isolation | Untrusted pipelines **shall not** access production secrets |
| Secrets outside VCS | Per-environment secrets; rotation and revocation paths ([§ Secrets](#secrets-management)) |
| SBOM / image scan evidence | Required for production release images |
| Rollback readiness | Known prior artifact and procedure ([`RELEASE_PROCESS.md`](RELEASE_PROCESS.md)) |
| OTel (or ADR-equivalent) | Production services export traces/metrics/logs per [`OBSERVABILITY.md`](OBSERVABILITY.md) |
| Backup + restore proof | Defined RPO/retention; periodic restore evidence |
| Pipeline-as-code | Workflows/pipelines checked into the repository |

Workflows **shall** be reviewed like code. Prefer composable reusable pipelines over copy-paste sprawl. Do not echo secrets. Cache carefully; do not cache untrusted PR content into protected environments.

---

## Example Implementations (GitHub Actions, Render, Terraform)

The following are **reference defaults**. Projects **may** substitute equivalent platforms with an ADR that maps each normative control point above.

### CI/CD — GitHub Actions (reference)

MES default CI: **GitHub Actions**. Equivalent CI systems are acceptable under ADR.

| Job family | Expectation |
|------------|-------------|
| Lint / format / types | Fail PR on violation |
| Unit / integration tests | Fail PR on failure |
| Coverage report | Publish artifacts; enforce floors |
| Security scans | SAST, secret scan, dependency/advisory scan |
| Eval gates | Required for AI-affecting release paths |
| Build images / artifacts | Reproducible from main/release tags |
| Deploy | Only from approved environments/branches with protections |

Pin action versions to immutable refs when practical (`@sha` preferred over floating tags).

**Example (CareerPilot):** `ci.yml` runs lint/tests/evals on pull requests; `deploy-staging.yml` and `deploy-prod.yml` require environment approvals — illustrative only.

### Branch & Environment Protection

| Environment | Protection |
|-------------|------------|
| CI | Ephemeral; synthetic data |
| Staging | Deploy from main or release branches; restricted secrets |
| Production | Required reviewers / environment gates; tagged releases preferred |

Force-push to protected default branches is prohibited without explicit human process exception.

### Docker

Containerized services **shall**:

- Use minimal, maintained base images  
- Run as non-root when practical  
- Avoid baking secrets into layers  
- Set explicit `USER`, healthcheck, and resource guidance where platform allows  
- Produce SBOM/scan evidence for release images  
- Tag immutably (`git sha`, semver); avoid sole reliance on `latest` for production  

Multi-stage builds **should** keep final images free of compilers and test-only tools unless required.

Dockerfiles **shall** be reviewed like code: pin versions, document why base image was chosen, and avoid untrusted `curl | bash` install patterns.

### Render (PaaS) — reference deploy target

When using **Render** (or equivalent PaaS; ADR if different):

- Infrastructure intent **should** still be documented (services, env groups, disks, cron jobs).  
- Production services **shall** use health checks aligned with readiness.  
- Autoscale and instance sizing **should** map to published capacity assumptions.  
- Disks and datastores **shall** have backup posture defined.  
- Deploy hooks **should** emit release markers into observability backends.  
- Preview environments **may** be used for PRs with synthetic data only.

PaaS convenience does not remove MES requirements for secrets, observability, SBOM, or rollback.

### Terraform (IaC) — reference

Long-lived cloud resources **shall** prefer declarative IaC. **Terraform** is the MES reference; ADR-equivalent IaC is acceptable:

- Remote state with locking  
- Separate state per environment when blast radius requires  
- Plan reviewed before apply for production  
- Least-privilege provider credentials  
- No plaintext secrets in IaC files or broadly readable state  
- Modules versioned; avoid unreviewed community modules in prod without review  

Manual console changes (“ClickOps”) **shall** be reconciled back into IaC promptly or treated as incidents/debt with owners.

---

## Secrets Management

Secrets **shall** be stored in platform secret managers / environment secret stores / cloud secret stores — not in git.

Requirements:

- Distinct secrets per environment  
- Rotation procedure documented  
- Access audited where platform supports  
- Emergency revocation path for on-call  
- Agents and CI use short-lived credentials when available  

Application config loads secrets at runtime via env or native integrations ([`CODING_STANDARDS.md`](CODING_STANDARDS.md)).

---

## Backups & Restore

Durable data stores **shall** have:

| Control | Expectation |
|---------|-------------|
| Backup schedule | Defined RPO |
| Retention | Defined and enforced |
| Restore test | Periodic proof (not only backup-success metrics) |
| Access control | Restricted restore privileges |
| Encryption | At rest as platform/risk requires |

A backup that has never been restored is a hope, not a control. Critical systems **should** schedule restore drills and record evidence.

Point-in-time recovery **should** be enabled when the datastore and risk profile warrant it.

---

## OpenTelemetry (OTel) Wiring

Per [`OBSERVABILITY.md`](OBSERVABILITY.md), production services **shall** export telemetry via OTel (or ADR-equivalent):

- SDK instrumentation in services  
- Collector or platform-native OTLP ingest when applicable  
- Separate config for sampling in prod vs staging  
- Resource attributes: `service.name`, `service.version`, `deployment.environment`  
- Exporters for traces/metrics/logs as backend supports  

DevOps owns shared collectors and auth to backends; feature teams own span quality and attributes safety.

---

## Configuration Management

- Infrastructure and app config **should** be declarative.  
- Feature flags for risky changes.  
- Config changes to production **shall** go through review/promotion similar to code when they affect security or behavior.  
- Document required env vars and defaults.

---

## Networking & Exposure

- Prefer private connectivity for datastores.  
- Expose only required public ports.  
- TLS termination documented.  
- Admin interfaces restricted.  
- WAF/rate limits as risk warrants.

---

## Dependency & Image Patching

- Schedule base image rebuilds.  
- Monitor CVEs for runtime images and critical libs.  
- Define SLAs for critical/high patch application.  
- Rebuild and redeploy rather than SSH-patching containers.

---

## Developer Experience

DevOps **should** optimize for:

- One-command local bring-up where practical  
- Documented `make`/`task`/`npm`/`uv` entrypoints  
- Parity between local/CI images and prod bases when cost allows  
- Fast PR signal (fail fast on lint/unit before heavy suites)  

Agents rely on the same documented entrypoints as humans.

---

## Cost & Capacity Controls

- Tag resources for ownership and cost allocation.  
- Alert on spend anomalies for model providers and cloud.  
- Scale policies documented; panic scale without observability is discouraged.  
- Token budgets enforced in app control plane; infra quotas as backstop.

---

## Disaster Recovery Outline

Projects **shall** document:

- Critical dependencies  
- RTO/RPO targets  
- Failover/restore steps  
- Communication expectations  

DR depth scales with mission impact; silence is non-conformant for production data systems.

---

## Anti-Patterns

- Deploying from laptops with ad-hoc credentials  
- Unpinned CI actions / pipeline steps  
- Secrets in IaC variables committed to git  
- `latest` tags as the only production reference  
- No restore test  
- OTel planned “later” for AI systems already in production  
- Staging sharing production databases  
- Treating a vendor brand as mandatory without ADR when controls are met elsewhere  

---

## Conformance Checklist

- [ ] CI (reference: GitHub Actions, or ADR-equivalent) enforces quality and security gates  
- [ ] Docker images minimal, non-root when practical, scanned; SBOM evidence for prod images  
- [ ] Deploy platform (reference: Render/PaaS or cloud) documented with health checks  
- [ ] IaC (reference: Terraform, or ADR-equivalent) for long-lived infra when applicable  
- [ ] Secrets outside git; per-environment  
- [ ] Backups + restore proof cadence defined  
- [ ] OTel export wired for production services  
- [ ] Rollback path known  

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`SECURITY.md`](SECURITY.md) · [`ONCALL.md`](ONCALL.md)
