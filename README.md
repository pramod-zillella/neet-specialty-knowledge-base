# Specialty Knowledge Base

A local and GitHub Pages notebook for choosing medical specialties and investigating colleges, based on interviews from [The Nachiket Bhatia Show](https://www.youtube.com/@TheNachiketBhatiaShow).

**Open `Open Dashboard.cmd` or double-click `index.html`.** No installation or API key is needed to use the dashboard. The page works offline; source video links require internet access.

## Current collection

- 134 distinct videos catalogued from the **Videos tab, four playlists and a requested new-video update**. This is not the entire channel: its header displays about 1K total videos, and Shorts have not been inventoried.
- **132 timestamped transcripts cached**, covering **117.08 hours of video**. Two items shorter than two minutes were intentionally skipped.
- Provider track labels: 60 English (`en`) and 72 Hindi (`hi`). Mixed speech and English written in Devanagari occur; labels do not establish the language of every sentence.
- **85 curated notes across 49 specialty and career topics**, drawn from selected windows in 49 episodes.
- Navigation topics include postgraduate branches, advanced specialties, other career paths, and explicit coverage gaps. Related viewing is distinguished from a dedicated episode. Full-caption discoveries also add or correct specialty mappings.
<!-- REVIEW_PROGRESS_START -->
- **132 of 132 cached videos have full-caption reviews**, covering **3834 source-linked main themes**. **No partial briefs remain.** Every saved caption part of the 130 added reviews was displayed and reviewed; the original two complete reviews are retained.
<!-- REVIEW_PROGRESS_END -->
- These are **caption-text reviews, not audio verification**. A full-caption summary does not prove that captions contain every spoken word or that the speaker’s claims are correct.

Collection snapshot: October 17, 2026. `exports/knowledge-base.json` records the build time and current counts.

## What the dashboard provides

- **Branch themes:** decision cards separate fit and daily work, benefits, trade-offs, training and college checks, money/jobs/practice, culture/safety/ethics, and future claims to verify. Each point expands to its reasoning, speaker, timestamp, caveats and editorial question. The first three points draw across source videos when possible; remaining points expand continuously. Authored tags classify perspectives, without automatic sentiment scoring or claims of consensus. The twelve-aspect source index remains available below, with shared training discussions and related viewing kept separate. Earlier excerpt notes sit in a separate expandable section. Primary-video review coverage and gaps stay explicit.
- **Video summaries and highlights:** short takeaway cards first, then expandable source sections, an “Important sections only” filter, search within the video, expand/collapse controls and direct timestamp links. Complete reviews include the overview and main themes; partial briefs explicitly describe their limited scope. Context checks remain visible alongside takeaways. Chapter navigation is retained separately as metadata. Readable full-review and partial-brief Markdown downloads are separate.
- **Compare:** up to four branches or career topics in adjacent columns, with the same decision groups and expandable source evidence. Perspective and aspect filters apply to full-review themes; original excerpt cards remain available. Missing evidence is labelled; there are no invented branch scores.
- **Episode library:** the 134 catalogued videos, caption availability, full-caption versus selected-excerpt review status and timestamped chapter links. Chapters are navigation metadata, not reviewed findings.
- **Conclusions:** editorial shortlisting advice, work-preference profiles, eight explicitly defined 1–5 attribute ratings and written assessments across all twelve decision aspects for every listed topic. Every scored assessment has a reason and reviewed-theme references. Higher means more of the named attribute, not better. No overall branch score is calculated; insufficient evidence, coverage gaps and incomparable career routes remain not rated. Advice is AI-assisted synthesis rather than a clinician-authored assessment, validated outcome model or channel consensus. Distinguish residency from established work, salaried roles from ownership, and base branches from advanced pathways.
- **College observations within Conclusions:** named institutions in decision-relevant passages, filterable by branch, sector, observation type and text. Explicit preferences remain separate from training experiences, concerns and comparisons. Sector labels are editorial context, not a quality ranking or recognition check. Historical and disputed accounts retain speaker attribution and caveats. This is a curated set of observations, not an exhaustive name index. The Conclusions downloads are included in the hosting ZIP.
- **College worksheet:** branch-specific due-diligence questions and your own college shortlist, evidence and follow-up notes. It does not rank universities from podcast anecdotes.
- **Personal notebook:** save topics, reflections, comparison choices and college worksheets in browser storage. Export/import JSON to back up or transfer your work. Imported notes overwrite matching saved notes; new topics and colleges merge.
- Continuous scrolling, responsive layouts, CSV/JSON/Markdown downloads and no third-party frontend dependencies.

Browser storage is specific to the browser and site address. Moving from a local file to GitHub Pages does not transfer it automatically. Export your notebook first; then import it on the hosted site. If browser storage is blocked, export before closing the page.

## Read and search the actual transcripts locally

Open **`Open Transcript Reader.cmd`**, or `private/transcript-review.html`.

The reader searches the saved caption text in English or Hindi, displays surrounding caption windows and links to the original moment. Select one episode with an empty query to browse its captions. Search results are capped at 250 visible windows; narrow the query to inspect more precisely. Phrases can match across two adjacent captions; this is literal text search, not semantic search.

The private reader and full transcripts are intentionally excluded from the hosting ZIP and Git tracking. Keep them locally. The public site contains curated paraphrases, short supporting anchors and public video metadata only.

## Method and limits

1. Public channel metadata was collected and episodes manually mapped to specialties and career topics. An episode may be relevant to several topics; related mentions are distinguished from dedicated coverage.
2. Supadata **native** mode retrieved the original 131 timestamped caption tracks. The new Rajesh Malhotra interview was retrieved using `youtube-transcript-api` without spending Supadata credits. Its watch metadata labels the native track English auto-generated. Older provider tracks do not specify manual versus automatic origin. Neither source supplies reliable speaker labels. The new track has an approximately 17-second caption gap near 43:56 and some unclear passages; full-caption review does not mean every spoken word is available.
3. Complete video summaries are written after reading the **entire saved caption text**. `scripts/full_review.py` displays every caption in bounded numbered parts and records a private ledger pinned to the source checksum. Authored reviews in `scripts/full_reviews/VIDEO_ID.json` record the overview, main themes, exact anchors, caveats, editorial questions and manually assigned decision tags. The original two reviews remain in `scripts/episode_summaries.py`; `scripts/full_review_store.py` loads later reviews. Partial highlights retain separate status until a full review replaces them. A changed checksum requires review. All use **AI-assisted curation**, English paraphrases/translations and contextual attribution; audio was not independently checked.
4. `scripts/build.py` checks note/theme anchors within their source windows, topic/episode references, timestamp order, source checksums, full-caption reading-range coverage and the displayed-part ledger for new reviews. It validates the decision-tag vocabulary and any theme-specific branch scope. Exact caption links resolve to the segment containing the beginning of the anchor; separate discussion links preserve context. These checks establish traceability, not truth, speaker diarization or completeness of spoken content. The ledger records displayed caption text; code cannot prove that a reviewer understood it.
5. The twelve aspects are fit, clinical work, training, lifestyle, earnings, practice setup, employment/location, future/research, college selection, culture/safety, ethics/law and international pathways. A missing aspect or missing Pro/Con is a **review gap**, not evidence of absence.
6. Branch overviews group source perspectives; they do not automatically turn repetition into consensus, silently reconcile disagreements or infer a university ranking. Questions and college checklists are editorial prompts. Guest experiences, salary anecdotes and predictions are not universal outcomes, official recognition rules or current university assessments. Evaluate MD/MS/DNB and advanced routes using current NMC/NBEMS and institution documents. Dental and nonclinical pathways are labelled separately.

No universal pay or work-hours claims, headline income promises, unsupported university rankings or guaranteed AI forecasts are adopted. Important decisions should be checked against the original video and current independent evidence. This is a career-study aid, not medical or legal advice.

## Credits and credentials

The added credits were visible: the last confirmed account allowance was **325**. The collector recorded **131 successful requests**, with one billed credit per request, giving **194 calculated credits remaining**. This is calculated from the allowance and response billing headers; unrelated account use or subsequent changes can alter the balance. Private usage snapshots and the request ledger remain in `private/`.

Only native caption retrieval was used. AI audio generation and subscription upgrades were not used. Successful transcripts are cached and skipped on later collection runs.

The real API key is **not stored in the project or public artifacts**. The collector reads `SUPADATA_API_KEY` from its process environment. Never add the key to frontend JavaScript, an HTML page, a committed `.env`, a public workflow or a GitHub issue.

## Update and rebuild

Python 3.10+ is sufficient for the builder. Collection additionally requires `requests`:

```powershell
python -m pip install -r requirements.txt
```

The free `youtube-transcript-api` option was blocked during the original collection but succeeded for the new Rajesh Malhotra interview on October 17. The bounded Supadata collector remains available for authorised future retrieval. No paid request was needed for this update. The free package does not bypass paid-collector stop rules.

Preview the collection plan without making requests:

```powershell
python scripts/fetch_transcripts.py --all --min-seconds 120 --plan
```

With the key available in the process environment, fetch a bounded number of missing native transcripts:

```powershell
python scripts/fetch_transcripts.py --all --min-seconds 120 --max-requests 3
```

The request cap bounds requests made by that invocation. Cached successes are skipped. The collector stops on authorization, payment, rate-limit, unfinished-job or exception conditions rather than making uncontrolled retries. Do not change to `auto` or `generate` without checking the different per-minute costs and explicitly authorizing them.

To extend the knowledge systematically:

1. Keep public metadata in `catalogue.json` and ignored `sources/`. Review new episode mappings in `scripts/taxonomy.py`.
2. Run `python scripts/full_review.py info VIDEO_ID`, then `python scripts/full_review.py read VIDEO_ID --part N` for **every** numbered part. Use the private transcript reader or `find` action to check a passage. Chapter labels and selected windows alone are insufficient for a full review.
3. Write `scripts/full_reviews/VIDEO_ID.json` with the pinned checksum, complete reading range, overview and all main themes. Cover changing opinions, host challenges, costs, qualifications and limitations as well as attractive claims. Keep general preparation and personal conversation separate from branch findings. Each theme needs its exact caption anchor and time window, decision tags and relevant aspects. An optional theme `subject_ids` list restricts a theme to the relevant reviewed branch in multi-topic interviews. For excerpt notes only, keep partial status. Do not manufacture a Pro or Con; recheck important names and claims against audio.
4. Rebuild from the project folder:

```powershell
python scripts/build.py
```

Run `python scripts/check_summaries.py --require-complete` to require every cached video to have a full review and check citation/review-status regressions. Run `node scripts/check_ui.cjs` for browser checks of every topic, reading page and Conclusions controls (Chrome or Edge and Node 22+). The build also validates every assessment, score source and institutional reference against reviewed themes.

The build makes **no API requests**. It regenerates the public dataset/exports, private transcript reader/data, validation report and hosting ZIP. It does not alter your browser notebook. Reviewing the 132 already-cached transcripts needs **no further Supadata credits**.

`exports/review-queue.csv` lists all catalogued videos with their actual summary status. `exports/video-briefs.md` lists any remaining partial briefs and becomes empty of briefs once all are promoted. Important-section emphasis is an editorial navigation aid, not a guest claim or branch ranking. `exports/video-summaries.md` contains the completed reviews; `exports/branch-themes.md` organises decision groups, shared training and the twelve-aspect index for every navigation topic. Shorts collection remains a separate scope.

The public JSON uses schema version 5. Each branch stores canonical `source_points` keyed by stable IDs; its decision and aspect groups list `point_ids`, and general training has separate `shared_training_point_ids`. Conclusions contain the rubric, authored topic assessments, preference profiles and attributed institution observations; evidence references use existing video/theme IDs. The frontend resolves references. Personal notebook version 1 remains compatible.

Raw sources and caption caches are required to rebuild. The hosting ZIP alone is sufficient to serve the finished site, but does not contain those private source materials.

## Host on GitHub Pages

1. Create a public repository, for example `neet-specialty-knowledge-base`.
2. **Extract** `neet-specialty-knowledge-base-site.zip` on your computer. Upload the **extracted contents**, not the ZIP itself, to the repository root. `index.html`, `app.js`, `reading-view.js`, `branch-view.js`, `conclusions-view.js`, `styles.css` and `knowledge-data.js` must sit directly at the root, with `exports/` beside them. Include `.nojekyll` if your file picker shows it.
3. Commit the upload to `main`.
4. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
5. Wait for the Pages deployment to finish in the **Actions** tab. Use the exact published URL shown by **Settings → Pages**. With the example name and your account it should be `https://pramod-zillella.github.io/neet-specialty-knowledge-base/`.

If it returns 404, confirm the Pages deployment succeeded, the URL includes the repository name, and `index.html` is at the selected publishing root rather than inside an extra extracted folder. Uploading only the ZIP does not create a website. Update the site by rebuilding and replacing the extracted public files.

The ZIP is an explicit allowlist: static frontend, public curated dataset, public exports and this README. It excludes API credentials, `.deps/`, `sources/`, `transcripts/`, `private/` and personal browser notes. Nothing has been published automatically.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js`, `reading-view.js`, `branch-view.js`, `conclusions-view.js` | Public dashboard, reading pages, branch views and Conclusions |
| `knowledge-data.js` | Embedded public curated data, works with local files |
| `exports/curated-notes.csv` | Spreadsheet-friendly notes with source links and limits |
| `exports/knowledge-base.json` | Public structured catalogue, taxonomy and curated notes |
| `exports/specialty-guide.md` | Earlier excerpt-note guide; complete decision themes are in `branch-themes.md` |
| `exports/video-summaries.md` | Complete timestamped caption-text reviews |
| `exports/video-briefs.md` | Partial selected-caption briefs; full review remains pending |
| `exports/branch-themes.md` | Available source perspectives and gaps, grouped by branch and decision aspect |
| `exports/review-queue.csv` | Complete status list for the 134 catalogued videos |
| `exports/conclusions.md`, `exports/specialty-assessments.csv` | Editorial conclusions and eight attribute ratings with reasons and sources |
| `exports/institution-observations.md` | Attributed institution preferences, experiences and concerns |
| `scripts/conclusions_rubric.json`, `scripts/conclusions_parts/*.json`, `scripts/conclusions_builder.py` | Authored rating definitions, evidence-linked assessments and validation/export |
| `scripts/taxonomy.py` | Reviewed primary/related topic mappings and college prompts |
| `scripts/curation.py` | AI-assisted notes from reviewed caption windows |
| `scripts/episode_summaries.py` | Detailed full-caption reviews with pinned source checksums and theme anchors |
| `scripts/full_reviews/*.json`, `scripts/full_review_store.py` | Authored full-caption reviews and validated loader |
| `scripts/full_review.py` | Bounded complete-caption reader and private checksum-pinned display ledger |
| `scripts/summary_builder.py` | Summary validation, exact anchor timing, branch grouping and exports |
| `scripts/brief_notes.py`, `scripts/brief_sources.json` | Reviewed English excerpt highlights and pinned source windows/checksums |
| `scripts/brief_builder.py` | Partial-brief validation, editorial emphasis and readable export |
| `scripts/review_packets.py` | Private, bounded caption-window reading packets; never declares a full read |
| `scripts/build.py` | Offline validation and artifact generation |
| `scripts/fetch_transcripts.py` | Bounded, cached Supadata native-caption collector |
| `scripts/collect_channel.py` | Public channel metadata collector |
| `private/transcript-review.html` | Local full-caption reader; never included in public ZIP |
| `private/collection_report.json` | Local collection and credit totals |

This is an independent notebook. The channel and guests are not affiliated with or endorsing this project. Original videos and captions belong to their respective rights holders. Keep full transcript caches private; the public notebook provides source-linked commentary and short evidence anchors.
