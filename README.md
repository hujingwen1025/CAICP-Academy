# CAICP Academy

Independent English / Simplified Chinese learning for CAICP E, J and S. Built as portable static HTML, CSS and JavaScript; no build, account, backend or API key.

## Run locally

Serve this folder over HTTP (opening index.html directly with file:// cannot load the modules or offline cache):

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://localhost:4173. Node users can also run `npm run serve`. Run automated checks with `npm test` (Node 20 or newer).

## Included

- 38 bilingual section lessons in eight chapters, with 126 structured concept/review blocks, stable concept navigation, source pages, accessible diagrams, comparison tables, expandable detail and 168 retrieval prompts. Objectives, prerequisites and common mistakes remain available.
- 59 original cited educational videos mapped to 118 concept placements. Main concept cards and expandable detail supplements use click-to-load YouTube players. Guidance is bilingual; audio remains in its stated language. Video watching is optional and never changes completion or scores. Provider/region access may differ; every card retains an original-source link. See [VIDEO-RESEARCH.md](VIDEO-RESEARCH.md).
- Six E/J/S first/second-round reading routes based on book v0.9 appendix A/C. All sections remain accessible. A section includes material at several levels; follow the corresponding skills rather than assuming all its material is required at the earliest tagged level.
- 114 original true/false topic checks, a route diagnostic, a mistake notebook and spaced review at 1, 3, 7, 14 and 30 days. A wrong response resets the next review to one day. Practice uses one recorded response per question per attempt; checking locks the answer. Retrying starts a new attempt.
- All 78 translated/adapted questions in three book mock papers: each 26 questions, 100 points, 90 minutes, all-or-nothing multiple-select grading. Shared materials and image-dependent information are preserved in accessible text/diagrams. These are independent book papers, not official examination papers.
- 13 interactive labs: execution tracing; four sorting methods; binary search; BFS/DFS; vectors/matrices; probability/Bayes; regression; gradient descent; KNN; K-means; neurons; convolution/pooling; confusion-matrix metrics.
- Optional worker-based Python exercises, including NumPy, Pandas, Matplotlib and scikit-learn. Runtime v314.0.7 and packages load from jsDelivr when Run is chosen. The worker is terminated by Stop, recovering even from infinite loops. Next run reloads the runtime. Package availability and first-load performance depend on the network and device. Matplotlib figures are captured as images; exceptions appear in output.
- Local progress, notes, bookmarks, attempt history, code drafts, theme/language preferences, daily goals and focus timer. Completion is separate from question performance; results do not predict certification outcomes.

## Static hosting

Upload the project to any static HTTP(S) host, including GitHub Pages. Deploy index.html and its sibling directories without flattening them. Paths are relative and routes use hashes, so no server route rewrites are needed; both a domain root and a repository subpath work. Serve JavaScript and JSON with standard MIME types. No server execution is required.

HTTPS (or localhost) is required for service workers and reliable worker functionality. The service worker caches all core learning assets after initial installation. Python runtime downloads are excluded from this guarantee. Allow the first cache to finish before going offline. The interface reports cache readiness. Expanded text, diagrams, glossary, video metadata and prompts are cached. Video streams require connectivity and are never part of the offline cache. Core study has no CDN dependency.

For a new release, change the cache version in sw.js. An update waits for the user to choose Update now; active attempts must be completed first. Cache activation removes only this app's old caches, keeping browser progress intact.

## Progress and backups

Browser localStorage key: `caicp-academy-v1`. Progress belongs to an origin and browser profile; another domain, profile or private browsing session does not share it. Clearing site data may remove it. There is no cloud sync or telemetry.

Settings → Export downloads a versioned JSON record including answers, notes and drafts. Import validates the complete record, previews counts and asks before replacement. Current progress downloads first as a safety backup. Unsupported versions, malformed values, unknown references, oversized files and prototype keys are rejected without changing state. Browser download settings can affect saving, so retain the exported file. Imported notes are displayed as text, never HTML.

An unavailable or invalid browser store produces a visible warning. In-memory work remains exportable. Timed attempts keep an absolute deadline; expiry submits saved answers, including after reload. As a browser-only study tool, device clock changes can affect timers; it is not a proctored exam system.

## Content structure

`data/curriculum.json` contains chapters, 38 lessons, route IDs, a bilingual glossary and original questions. `data/exams.json` contains paper metadata and adapted questions. `data/lesson-content.json` stores structured bilingual concept blocks and Appendix C study guidance. `data/videos.json` stores original source/creator metadata, verification records, concept placements, bilingual prompts and segment evidence. `data/coverage.json` is the page-by-page coverage inventory; [COVERAGE.md](COVERAGE.md) provides a readable review index. IDs remain stable across translations and releases. Questions contain localized prompts/options/explanations, zero-based answer arrays, types, points, lesson links, level/round/skill tags, source and license metadata. Shared stimuli belong to each applicable question so they remain available during review.

Each block can contain paragraphs, formulas, tables, diagrams, code/output, lab links and retrieval checks. Keep concept IDs stable. Video placements reference a concept ID and catalog video ID; use verified seconds for start/end, or the full video. Keep both guidance languages and a source caption. Do not add autoplay, unverified timestamps or rehost external videos.

To add content: add both en/zh strings; assign stable unique IDs; add valid prerequisite and question references; update routes and source/license metadata; run tests; bump the service worker cache version. A saved-data version change requires an explicit migration or a documented incompatibility; do not silently reinterpret IDs.

## Licensing

Application code: MIT, Copyright (c) 2026 WilliamH (existing LICENSE retained).

Educational content: CC BY-NC-SA 4.0. Source: 陈峥, 从零开始学人工智能：中学生CAICP学习指南, public preview v0.9, September 29, 2026, https://github.com/UESTC1010/CAICP_Book. This is a translated, restructured, interactive adaptation with original educational additions, not the author's original edition. See CONTENT-LICENSE.md and THIRD-PARTY-NOTICES.md. The code license does not permit commercial reuse of book-derived educational content.

The platform is independent, with no official endorsement. The curriculum baseline is versioned; check the organizer for current certification requirements.

## Validation

See [VALIDATION.md](VALIDATION.md) for automated and browser checks and their practical limits.

## Expanded-content verification

`npm test` includes the expanded source/reference and video checks, plus standard-library lesson starter execution. For all29 starters including numerical libraries and plotting, install the optional packages in `requirements-validation.txt` into a temporary Python environment and run `python tests/verify_learning_examples.py`. These packages are solely for validation; serving the site needs no package installation. Missing optional libraries produce an explicit skipped test.
