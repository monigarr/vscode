# [PROJECT_NAME] — API Specification Template

**MES Version:** 1.1.1  
**Document:** `API.md` (instantiate from this file — filename `API_SPEC.md` → project `API.md`)  
**Status:** Template  
**See Also:** [`../Engineering/DOCUMENTATION_STANDARDS.md`](../Engineering/DOCUMENTATION_STANDARDS.md) · [`../Architecture/ARCHITECTURE.md`](../Architecture/ARCHITECTURE.md) Part XIII · [`DATA_MODEL.md`](DATA_MODEL.md) · [`EVENT_MODEL.md`](EVENT_MODEL.md)

Instantiate when the project exposes HTTP/gRPC or cross-team APIs. Not every greenfield requires all of `DOMAIN_MODEL` / `API` / `DATA_MODEL` / `EVENT_MODEL`.

---

## Foundation

> MoniGarr Engineering exists to create durable software systems that compound in value over time. We measure success by customer outcomes, engineering quality, and the ability of future humans and AI agents to understand, extend, and confidently operate every system we build.

**Factory maxim:** AI accelerates. Deterministic systems prove. Humans remain accountable. Systems remain governable.

---

## Overview

| Field | Value |
|-------|-------|
| Base URL | `[BASE_URL]` |
| Auth scheme | `[OAuth2 / JWT / mTLS / API key — details]` |
| Public versioning | SemVer + URL or header version `[v1]` |
| Machine-readable schema | `docs/openapi.yaml` (OpenAPI 3.x) or equivalent |
| Owner | `[TEAM]` |

## Authentication & Authorization

- Authn mechanism: `[...]`  
- Authz model: `[RBAC / ABAC / policy engine]`  
- Service-to-service auth: `[...]`  
- Agent/tool callers: allowlisted principals only; see project `AI_GUIDELINES.md`  

## Endpoints

| Method | Path | Purpose | Auth | Side effects | Classification | Notes |
|--------|------|---------|------|--------------|----------------|-------|
| GET | `/health` | Liveness | none | read | public | |
| GET | `/ready` | Readiness | none | read | public | |
| [METHOD] | `[PATH]` | [PURPOSE] | [AUTH] | read \| write | [class] | |

## Error Envelope

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "human-safe message",
    "request_id": "trace-compatible-id",
    "details": {}
  }
}
```

Document HTTP status mapping and which errors are safe to return to clients vs operators.

## Idempotency & Rate Limits

- Idempotency keys required for: `[POST/PUT mutations]`  
- Rate limits: `[per principal / tenant]`  
- Retry guidance: `[...]`  

## Pagination & Filtering

- Default page size / max: `[...]`  
- Sort / filter parameters: `[...]`  
- Cursor vs offset: `[...]`  

## Contracts

- Prefer OpenAPI 3.x (AsyncAPI for events — see `EVENT_MODEL.md`).  
- Breaking changes require major version bump and CHANGELOG entry.  
- Consumer contract tests **should** exist for published APIs.  

## AI-Related Endpoints

| Concern | Requirement |
|---------|-------------|
| Tool exposure | Map to MES Part XIII; schema + authZ + audit |
| Idempotency | Required for write tools |
| Audit | Record actor, tool, args hash, outcome |
| Risk Class | Declare R0–R4 for agent-callable mutations |

## Data Classification per Route

Mark routes that accept or return PII, CUI, PHI, or sovereign data. Link `PRIVACY_DATA_GOVERNANCE.md` when applicable.

## Conformance

- External APIs → MES Part XIII when endpoints expose tools to agents.  
- Align field names with `DATA_MODEL.md`.  
- MDES-evaluate material API doc changes.  
