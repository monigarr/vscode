# Open-Agent Engineering Standards (Project Overlay)

**Status:** Active
**Owner:** MoniGarr.com LLC
**Author:** Monica Peters \<monigarr@MoniGarr.com\>
**Canonical Path:** `docs/ENGINEERING_STANDARDS.md`
**See Also:** [`../MoniGarr_Engineering_Standards/Engineering/ENGINEERING_STANDARDS.md`](../MoniGarr_Engineering_Standards/Engineering/ENGINEERING_STANDARDS.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## Relationship to MES

This file is a **project overlay**. Normative company standards live in [`MoniGarr_Engineering_Standards/`](../MoniGarr_Engineering_Standards/). Open-Agent inherits MES; it does not redefine it.

Key MES entry points:

| Topic | MES path |
|-------|----------|
| System constitution | `SYSTEM_CONTEXT.md` |
| Agent operating contract | `CLAUDE.md` |
| Coding | `Engineering/CODING_STANDARDS.md` |
| Documentation | `Engineering/DOCUMENTATION_STANDARDS.md` |
| Testing | `Engineering/TESTING.md` |
| Security | `Engineering/SECURITY.md` |
| Code headers | `Templates/CODE_COMMENT_HEADER_TEMPLATE.md` |

## Open-Agent project rules

1. **Isolation:** Custom product code lives under `src/vs/workbench/contrib/openagent/` (see [ADR-0001](ADR/ADR-0001-openagent-contrib-isolation.md)).
2. **Docs dual-layer:** Update `docs/current/` when shipping behavior; update `docs/target/` when changing intent ([ADR-0002](ADR/ADR-0002-docs-current-vs-target.md)).
3. **Headers:** Every production/test `.ts` file under Open-Agent carries a MES header with AUTHOR `Monica Peters <monigarr@MoniGarr.com> / MoniGarr.com LLC` and a concrete `USAGE` block.
4. **Evidence:** Implementation claims require code; status claims require [`current/IMPLEMENTATION_STATUS.md`](current/IMPLEMENTATION_STATUS.md).
5. **No silent contract changes:** Gateway request shapes, tool ids, and feature flags change only with docs + tests.

## Decision hierarchy (agents)

When goals conflict during implementation, follow MES: Safety → Correctness → Security → Privacy → Determinism → Maintainability → Simplicity → Performance → Developer convenience.
