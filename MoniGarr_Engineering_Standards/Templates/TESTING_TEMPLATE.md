# [PROJECT_NAME] — Testing Template

**MES Version:** 1.1.1  
**Document:** `TESTING.md`  
**Status:** Template  
**Parent:** suite [`Engineering/TESTING.md`](../Engineering/TESTING.md)

---

## Strategy

| Regime | Approach |
|--------|----------|
| Deterministic | Critical-path ~100%; exclusions documented |
| AI / probabilistic | Golden evals gate release; continuous eval supplements |

## How to run

```bash
# unit
[CMD]
# integration
[CMD]
# evals
[CMD]
```

## Coverage floors

| Suite | Floor / target | Notes |
|-------|----------------|-------|
| Unit | [%] | |
| Integration | [%] | |
| Golden evals | thresholds in `evals/` | block release |

## Release gate hierarchy

1. Golden evals **block** AI-affecting releases  
2. Continuous eval supplements when authorized in `VERIFY.md`  
3. Online sampling ≠ pre-release proof  

## Fixtures

- Location: `[tests/fixtures, evals/]`  
- PII/PHI policy: synthetic / redacted only unless authorized  

## Evidence

Link CI artifacts and eval reports into release Evidence Packs.
