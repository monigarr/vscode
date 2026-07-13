# Author & Organization

**Document:** `AUTHOR_ORGANIZATION.md`  
**Purpose:** Record who owns, authors, and escalates for this repository.  
**MES Version:** 1.1.1  
**Status:** Template — fill before first review  
**Created:** 2026-07-12  
**Last Updated:** 2026-07-12  

---

## Organization

| Field | Value |
|---|---|
| Legal / trading name | `[ORGANIZATION_NAME]` |
| Division / product line | `[DIVISION_OR_PRODUCT_LINE]` |
| Primary site / HQ | `[LOCATION]` |
| Public contact | `[URL_OR_EMAIL]` |

---

## Ownership

| Role | Name | Contact |
|---|---|---|
| Document owner | `[OWNER_NAME]` | `[OWNER_EMAIL]` |
| Engineering lead | `[ENG_LEAD]` | `[EMAIL]` |
| Security contact | `[SEC_CONTACT]` | `[EMAIL]` |
| Privacy / data steward | `[PRIVACY_CONTACT]` | `[EMAIL]` |
| On-call / operations | `[ONCALL_CONTACT]` | `[EMAIL_OR_PAGER]` |

---

## Authors

| Author | Affiliation | Role on this repo |
|---|---|---|
| `[AUTHOR_NAME]` | `[ORG]` | `[ROLE]` |

---

## Escalation

| Severity | First contact | Escalate to | Target response |
|---|---|---|---|
| Sev-1 (production / safety) | `[ONCALL]` | `[ENG_LEAD]` → `[OWNER]` | `[e.g. 15 min]` |
| Sev-2 (degraded / security) | `[ONCALL]` | `[ENG_LEAD]` | `[e.g. 1 hour]` |
| Sev-3 (non-urgent) | `[OWNER_EMAIL]` | — | `[e.g. next business day]` |

---

## Notes

- Keep contacts current; stale ownership is a governance defect.  
- If this file cannot be completed for a given repo, mark **Not Applicable** with rationale — do not leave blank placeholders in an approved tree.
