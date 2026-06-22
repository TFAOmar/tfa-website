## Goal

Eliminate the critical `jspdf` path-traversal advisory (GHSA-f8cm-6447-x5h2), which affects all versions `<= 3.0.4`. The fix is shipped in `jspdf@4.0.0`.

## Approach

Bump `jspdf` from `^3.0.4` to `^4.0.0` in `package.json` and reinstall. Per the jsPDF maintainers, v4.0.0 has **no breaking API changes** — it only restricts Node.js filesystem access by default. Our usage is browser-side PDF generation (`src/lib/lifeInsurancePdfGenerator.ts`, `src/lib/calculatorPdfGenerator.ts`, `src/lib/brandGuidelinesPdf.ts`, `src/lib/salesContestPdf.ts`) plus one Deno edge function (`supabase/functions/resend-life-insurance-pdf/index.ts`) that imports `jspdf@2.5.1` from esm.sh — none use `loadFile`, `addFont`, or filesystem paths, so behavior is unchanged.

As a bonus, this same bump also clears the other two open jspdf findings reported by the scanner:
- High: AcroFormChoiceField PDF injection + BMP DoS
- Medium: XMP injection + addJS race condition

(all three advisories are remediated in the 4.x line)

## Steps

1. Update `package.json`: `"jspdf": "^4.0.0"`.
2. Run `bun install` to refresh the lockfile.
3. Build to confirm the browser PDF generators still compile against the v4 typings.
4. Smoke-check one PDF code path (e.g. the life-insurance PDF generator) to confirm no runtime regressions.
5. Optionally bump the Deno import in `supabase/functions/resend-life-insurance-pdf/index.ts` from `jspdf@2.5.1` to `jspdf@4.0.0` for consistency (the edge function runs in Deno, not Node, so it isn't directly affected by the Node-build LFI, but staying current is good hygiene).
6. Mark the three `vulnerable_dependencies_*` findings as fixed after the install succeeds.

## Risk

Low. jsPDF 4.0.0 is documented as a semver-major release only because of the Node filesystem default change; the JS API surface is unchanged. Browser bundles (which is what every call site here uses) behave identically.
