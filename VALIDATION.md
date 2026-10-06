# Validation record — 2026-10-06

## Automated verification

`npm test`: 22 JavaScript tests and 9 independent Python tests passed. Checks cover bilingual curriculum completeness, stable references and IDs, six routes, 12-question diagnostics, all 78 appendix-G answer keys and 100-point paper totals, shared visual materials, exact-set grading, saved deadlines, review intervals, backup round trips and invalid imports, unavailable storage, sorting/search/traversal, metrics, convolution, K-means and numeric input validation. The Python worker load-error path is exercised with an intentionally unavailable HTTPS import in Node.

Independent Python calculations check eleven book code snippets, image/grid questions, probabilities, gradient descent, model outputs and CNN parameters. JavaScript syntax checks passed. The existing MIT LICENSE remains unchanged.

## Browser verification

- English/Chinese switching in lessons and active single/multiple-choice attempts preserved selections. Checked answers remained locked after reload.
- Timed E answers and flags persisted; countdown retained its deadline. Two correct five-point answers produced 10/100. A valid backup containing an expired, fully answered E paper resumed and submitted at 100/100.
- Invalid backup upload was rejected; valid upload displayed counts and a replacement confirmation before importing. JSON serialization and complete-state round trips passed automated checks.
- Python supplied input produced 15 for summing 1–5. NumPy axes, Pandas missing-value replacement, scikit-learn regression (slope 2, bias 1, prediction 11) and Matplotlib image output ran in the browser. Stop terminated an infinite loop and enabled another run.
- The server was stopped after caching; reload, lesson navigation, an adjustable metrics lab/reset and a 12-question diagnostic still worked. Static root and `/academy/` subpath hosting both loaded successfully.
- Desktop 1440×1000 and mobile 390×844 layouts were inspected. Mobile English and Chinese dashboards had no page-wide horizontal overflow. Dark mode and keyboard skip-to-main worked. Inputs use associated labels, graphical labs have textual results, and reduced-motion styling is supplied.
- Optional WebMCP lesson search, summary and navigation tools were checked, including rejection of an invalid section.

## Verification limits

This is a browser study resource, not an official syllabus or certification predictor. Content uses book v0.9; human editorial review remains useful before broad redistribution. Screen-reader labels were inspected, but no full assistive-technology/device matrix was run. Storage failure was tested with a failing storage provider rather than changing browser privacy settings. Runtime loading failure was tested at worker level rather than forcing a CDN outage in the browser.

The embedded browser did not expose a completed download to automation. Export uses the standard Blob/download mechanism; exported JSON was validated independently, and upload/import was exercised. Confirm the backup file is saved before clearing site data. Matplotlib currently emits upstream deprecation warnings during rendering, while successfully producing its plot. First Python/package downloads require connectivity; offline readiness guarantees core learning, not those external downloads.
