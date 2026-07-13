# ONCALL — Incident Response, Severity, and Escalation

**MES Version:** 1.1.0  
**Status:** Engineering Standard  
**Owner:** MoniGarr Engineering  
**Applies To:** All Production Products and Services  
**Canonical Path:** `Engineering/ONCALL.md`  
**See Also:** [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) · [`../Governance/MOM.md`](../Governance/MOM.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md) · [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`SECURITY.md`](SECURITY.md) · [`DEVOPS.md`](DEVOPS.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`DOCUMENTATION_STANDARDS.md`](DOCUMENTATION_STANDARDS.md) · [`../SYSTEM_CONTEXT.md`](../SYSTEM_CONTEXT.md) · [`../GLOSSARY.md`](../GLOSSARY.md)

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

This standard is **company-wide**. Product-specific contact rosters live in project repos; severity and escalation intent do not.

---

## Purpose

On-call is the operational duty to detect, diagnose, mitigate, and learn from production incidents. MES requires systems to be operable by humans who may not have written the last change — and by AI agents that assist under human authority.

---

## On-Call Principles

1. **User impact first** — mitigate before perfect root cause.  
2. **Humans accountable** — agents may draft; humans decide external comms and risky remediations.  
3. **Evidence over lore** — use telemetry, not guesswork ([`OBSERVABILITY.md`](OBSERVABILITY.md)).  
4. **Reversible preferred** — rollback when safe and faster than speculative fixes.  
5. **Blameless learning** — fix systems and processes, not people.  
6. **Sustainable rotation** — burnout creates incidents.

---

## Severity Model

| Severity | Definition (typical) | Response expectation |
|----------|----------------------|----------------------|
| **Sev-1** | Critical user/mission impact; major outage, data loss risk, active security breach | Immediate page; continuous work until mitigated |
| **Sev-2** | Significant impact; core journey degraded; high error rates; serious security concern | Rapid response; same-day mitigation target |
| **Sev-3** | Limited impact; workaround exists; non-critical feature broken | Business-hours response; scheduled fix |
| **Sev-4** | Minor / cosmetic / low risk | Backlog; no page |

Projects **may** refine definitions for domain impact (e.g., safety, payments) via ADR, but **shall** keep a four-level (or clearer) model mapped to paging policy.

**Example (CareerPilot):** Total failure of job-match API for all tenants is Sev-1; degraded recommendation quality below eval SLO for a subset may be Sev-2 if user trust is impacted — illustrative only.

---

## Roles

| Role | Responsibility |
|------|----------------|
| Primary on-call | First responder; owns mitigation coordination |
| Secondary on-call | Escalation backup; shadows as needed |
| Incident commander (IC) | For large incidents: coordinates people, comms, decisions |
| Subject-matter expert | Deep system knowledge |
| Security lead | Security incidents, forensics, notification counsel |
| Communications owner | Customer/status updates (human) |

Small teams may combine roles; accountability **shall** remain explicit on the roster.

---

## Rotation & Handoff

- Publish roster and timezone coverage in the project repo or ops doc.  
- Handoffs **shall** include: active incidents, risky releases, silenced alerts, pending migrations.  
- Paging device setup and escalation tree **shall** be tested periodically.  
- Follow-the-sun **may** be used; gaps **shall** be documented.

---

## Alert Hygiene

Alerts that page on-call **shall** be:

- Actionable  
- Tied to user/system impact or security  
- Linked to a runbook  
- Owned  

Noisy alerts **shall** be tuned or downgraded. Silent failure of critical journeys is worse than noisy pages — but chronic noise destroys response quality.

See [`OBSERVABILITY.md`](OBSERVABILITY.md) for telemetry and alert design.

---

## Incident Lifecycle

### 1. Detect

Via alert, customer report, synthetic check, or eval/quality cliff.

### 2. Triage

- Assign severity  
- Page additional help if Sev-1/2  
- Start incident timeline (chat thread / doc)  

### 3. Mitigate

Preferred order when applicable:

1. Feature flag off / traffic shed  
2. Rollback to last known good artifact  
3. Failover / restart with caution  
4. Forward fix with tight scope  
5. Data restore (controlled)  

### 4. Communicate

- Internal updates on a cadence matching severity  
- External status updates per product policy  
- Never speculate about legal liability in public channels  

### 5. Resolve

- Confirm mitigation with metrics and smoke checks  
- Clear or downgrade pages  
- Capture follow-ups  

### 6. Learn

- Post-incident review for Sev-1/Sev-2 (and recurring Sev-3)  
- Track corrective actions to completion  

---

## Runbooks

Each paging alert class **should** have a runbook stating:

- Symptoms and impact  
- Immediate checks (dashboards, traces, logs)  
- Mitigation steps  
- Escalation contacts  
- Rollback notes  
- Related recent releases  

Runbooks live in-repo. AI agents **may** draft updates; humans verify after incidents.

---

## AI Systems On-Call Notes

AI outages and quality cliffs are first-class incidents:

| Symptom | Typical checks |
|---------|----------------|
| Provider latency/errors | Dependency dashboard; circuit breakers |
| Hallucination spike | Eval dashboard; retrieval miss rate; prompt/model version drift |
| Cost runaway | Token accounting; budget breaker; abusive traffic |
| Tool misuse | AuthZ denials; prompt-injection signals |

Do not “just bump the model” without eval evidence during an incident unless it is a controlled mitigation with owner approval.

---

## Security Incidents

Suspected breach, credential leak, or abuse:

- Follow [`SECURITY.md`](SECURITY.md)  
- Preserve evidence  
- Rotate secrets  
- Escalate to security owner immediately  
- External notifications are human-owned  

Treat data exfiltration via agent tools as security incidents, not mere product bugs.

### Regulated Customers — Notification Timelines

For government, healthcare, or other regulated customers, **customer/contract notification clocks** (breach, privacy, regulatory) live in **project** `SECURITY.md`, `PRIVACY_DATA_GOVERNANCE.md`, and related artifacts. This company on-call standard does **not** invent regulatory notification timelines. On-call **shall** escalate to the security/privacy owner rather than inventing clocks from MES.

---

## Escalation Tree (Template)

Projects **shall** publish a concrete tree. Logical order:

1. Primary on-call  
2. Secondary on-call  
3. Engineering owner / tech lead  
4. Security owner (if security)  
5. Product/executive stakeholders for prolonged Sev-1  

Escalation timeouts **should** be explicit (e.g., no ack in 5/15 minutes).

---

## War Room Practices

For Sev-1:

- Single IC voice for decisions  
- Parallel workstreams with clear owners  
- Timeline of actions and hypotheses  
- Avoid uncoordinated production changes  

---

## Post-Incident Review (PIR)

Sev-1 and Sev-2 **shall** produce a written review including:

- Summary and severity  
- Timeline  
- Impact  
- Root contributing factors (5 whys / causal graph as useful)  
- What went well / poorly  
- Action items with owners and due dates  

When the incident involves AI paths, PIRs **shall** also record (or mark N/A):

- Prompt / model / router / index versions in use  
- Eval suite status at time of incident (golden gate pass/fail if known)  
- Whether HITL or dual-control was bypassed or insufficient  
- Retrieval / tool / memory contamination indicators  
- Kill-switch use (triggered / available / missing)  

PIRs are blameless and stored where the team can find them. Chat threads are not sufficient archive.

---

## Mentoring & Shadowing

New on-call engineers **should** shadow a rotation before primary duty. Runbook gaps discovered during shadowing **shall** be fixed, not normalized.

---

## Tooling Expectations

On-call **shall** have access to:

- Dashboards and log/trace backends  
- Deploy/rollback capability appropriate to role  
- Secret rotation paths (or break-glass procedure)  
- Status communication channel  
- Incident documentation template  

Access reviews **should** occur when staff leave rotations.

---

## SLO & Error Budget Interaction

When error budgets burn rapidly:

- Increase caution on releases  
- Prioritize reliability work  
- Avoid feature pressure that ignores user impact  

Error budgets inform prioritization; they do not excuse Sev-1 neglect.

---

## Anti-Patterns

- Hero culture without runbooks  
- Paging on every warning metric  
- Changing prod without timeline notes  
- Skipping PIR because “we’re busy”  
- Leaving AI quality regressions unowned  
- Expecting agents to approve customer breach notices  

---

## Conformance Checklist

- [ ] Severity model documented for the product  
- [ ] Roster and escalation tree published  
- [ ] Paging alerts have runbooks  
- [ ] Observability access verified for on-call  
- [ ] Rollback path known ([`RELEASE_PROCESS.md`](RELEASE_PROCESS.md))  
- [ ] PIR process for Sev-1/2  
- [ ] Security escalation path defined  

---

## See Also

- [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md)  
- [`../Governance/MOM.md`](../Governance/MOM.md)  
- [`OBSERVABILITY.md`](OBSERVABILITY.md) · [`SECURITY.md`](SECURITY.md) · [`RELEASE_PROCESS.md`](RELEASE_PROCESS.md) · [`DEVOPS.md`](DEVOPS.md) · [`ENGINEERING_STANDARDS.md`](ENGINEERING_STANDARDS.md)
