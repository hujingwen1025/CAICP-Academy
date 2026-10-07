# Validation record — 2026-10-06

## LaTeX update — 2026-10-07

KaTeX 0.19.0 is bundled locally with its stylesheet, complete referenced font directory and original MIT license. The shared renderer supports explicit inline/display delimiters, HTML-and-MathML output, escaped ordinary text, disabled trusted commands and readable error fallbacks. Seven formula blocks now have structured TeX and bilingual fallbacks. The source conversion inventory records 516 distinct original/transcribed expression pairs; 2,507 delimited expressions occur across the authored bilingual data. Numerical labs additionally generate typeset computed results while retaining plain-text results. Python code, executable exam snippets, program output and personal notes remain plain text.

The update passed 35 JavaScript checks and 14 Python checks; one optional numerical-library/plot starter fixture was skipped because the current system Python lacks those validation packages. All eleven executable book snippets ran. Strict checks cover every authored expression, delimiter balance, conversion records, all seven formula blocks, disabled HTML/link commands, error fallbacks, lab rendering/reset/step/invalid-input cases and every locally cached font reference. Existing answers/scoring, deadline, review, backup and storage-failure checks passed. Structural comparisons against the prior committed data preserved IDs, code, sources, route/scoring metadata and saved-data version 1. The Chinese grid-distance explanation's extracted `√42 +32 =5` was transcribed as √(4²+3²)=5, consistent with the English question and independently verified distance.

Browser checks covered English/Chinese lessons, active-quiz selection and reload persistence, checked-answer explanations, both glossary languages and gradient-descent step/reset (first update w=0.6, gradient −4.8, loss 5.76). A browser DOM fixture verified that an already loaded local iframe remained attached with no reload while math and language changed, retaining expanded detail, focus, cursor and plain notes. This uses a local `srcdoc` player fixture; no external video streams were loaded for the math update. The fixture is reproducible at `/tests/math-browser.html` on the local Python server (tests are excluded from the Docker image).

Desktop 1440×1000 and mobile 360×800 math were inspected in light/dark themes. Eleven mathematical lessons, including opened derivations in five of them, showed no page-wide mobile overflow. Formula regions support keyboard focus and contained scrolling. Root and `/academy/` repository-subpath delivery loaded math and fonts. After the subpath server was stopped, reload, language switching and the vectors lab still rendered from cache. This server-stop check verifies offline local assets, not a full device/network or assistive-technology matrix.

Docker's MIME table needed an explicit `.mjs` rule; the server now delivers the KaTeX module as JavaScript and WOFF2 fonts as `font/woff2`. The container integration check includes those types and all cached math assets. Cache version 1.2.3 delivers the update through the existing explicit update flow. Math introduces no CDN, server-side LaTeX, account or saved-progress migration. No public deployment was performed.

## Docker support

Built and ran the Nginx 1.30.5 Alpine image locally using Docker Compose. The container health check passed, Nginx configuration validation passed, and the server ran as the `nginx` user (UID 101) with a read-only filesystem and writable temporary directory. The published port is bound to loopback at localhost:8080.

`python3 tests/verify_container.py http://localhost:8080` passed four integration checks: every service-worker core asset plus the worker script matched the checkout byte for byte; module/data/CSS/SVG MIME types were correct; missing paths, repository internals, tests and container configuration returned 404; and the embed-compatible referrer policy was present. Unversioned assets and the service worker use revalidation headers. These checks contact only the local server and do not load external videos or Python downloads.

The application and saved-data format remain unchanged. Cache version 1.1.7 makes the updated run instructions and third-party notices available through the existing explicit offline-update flow. Container validation establishes static delivery; earlier browser checks below cover the learning interface. Public Docker deployment and remote HTTPS proxy configuration were not performed.

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

## Expanded lessons and video update

The expanded run passed 29 JavaScript tests, the9 retained Python tests and6 expanded Python tests (44 checks). All29 lesson starters, including NumPy/Pandas, Matplotlib figure creation and the scikit-learn Iris workflow, ran with their expected results. Numerical checks independently cover statistics, conditional/Bayesian probabilities, regression, gradients/backpropagation, K-means, confusion matrices, CNN parameters and attention. The optional package check is explicitly skipped when those validation libraries are absent; the complete run used a temporary environment with them installed.

All38 lesson IDs,114 original scored checks,78 book-paper questions and six routes remain stable. Saved-data formatv1 remains unchanged. The existing exam, persistence, invalid-import, backup-round-trip, review-scheduling and storage-failure tests passed. MIT LICENSE and its existing copyright were not edited.

The source review index has752 entries covering all287 printed pages, teaching headings, code anchors and89 numbered figures/tables. Expanded content contains126 stable concept/review blocks and168 retrieval prompts. These supplementary prompts do not write quiz scores. Page references, bilingual text/table/check fields, lab/studio links, IDs, video mappings, citation fields and timestamp bounds passed checks. This index establishes review destinations, not an automated semantic-equivalence proof; see COVERAGE.md.

All59 videos returned oEmbed availability, watch statusOK and embed permissiontrue, with verified durations on2026-10-06. Publication dates are included only when supplied by the original provider. Three non-full-video segments follow the creator’s published Python chapter boundaries. Broader matches are labeled background. VIDEO-RESEARCH.md records original sources and practical verification limits.

In the refreshed preview, players were absent before activation. A main MIT BFS player loaded and played. During English/Chinese switching the playback time advanced from11.509 to11.799 seconds and playback stayed active. Its original controls/branding, source link and required referrer policy remained present. The DFS detail loaded only after its disclosure was opened and activated; closing it removed its iframe. Keyboard concept navigation opened the corresponding expandable block. Desktop1440×1000 and mobile360×800 English/Chinese layouts had no page-wide overflow; mobile notes stayed available. Root and /academy/ hosting loaded expanded data, diagrams and citations.

The local root server was stopped after caching: a reload, expanded logic/set lesson, accessible Venn diagram and language switch worked from cache. Connectivity failure before video activation is tested in both languages. This server-stop test checks cached local assets; it does not simulate loss of all internet connectivity or test every provider/regional restriction. All59 players were individually loaded and their Play controls activated, with initial media state recorded in data/video-player-checks.json. These immediate checks do not establish sustained stream playback. Full-video/transcript inspection and a complete assistive-technology matrix remain unverified. No external publishing was performed.
