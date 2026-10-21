# Specialty Knowledge Base

A local and GitHub Pages notebook for choosing medical specialties and investigating colleges, based on interviews from [The Nachiket Bhatia Show](https://www.youtube.com/@TheNachiketBhatiaShow).

**Open `Open Dashboard.cmd` or double-click `index.html`.** No installation or API key is needed to use the dashboard. The page works offline; source video links require internet access.

## Institution accreditations and quality credentials

Open **Accreditations** in the dashboard. The register covers all **1,634 campus/code records in the existing seat matrices** for the 18 requested states/UTs (**1,533 present in the supplied 2026 files**), supplemented by historical allotment-only identities and earlier research profiles. It covers every input record; **it is not an exhaustive, fully verified audit of every accreditation held**. Unresolved aliases remain separate source records, so the larger register count must not be called a count of unique institutions. The supplied datasets do not necessarily cover every state-counselling institution.

- Filter by state, credential body, scope/type, published validity, evidence status, supplied matrix route, year status and NMC-reported management where established. DNB is a qualification route, not a private-ownership classification.
- Compare up to four source/campus records. Results scroll continuously. Expand a campus for its exact named entity, scope, certificate number, dates, official links, match method and department-research links.
- **Course permission comes first.** NMC recognition/permission wording and NBEMS specialty/qualification records are retained separately from hospital accreditation. A row or an old permission does not establish unrestricted current admission rights; INI routes require their applicable statutory/prospectus checks.
- **Full NABH/JCI** are useful hospital-system quality signals; **NABL ISO 15189/CAP** are particularly relevant laboratory-quality signals for Pathology/Biochemistry; **NAAC** supplies academic context for the named HEI and cycle. Entry-level, targeted certifications, digital-health credentials and insurer empanelment remain distinct. None establishes training autonomy, a non-toxic department or safe resident accommodation.
- Live NAAC/JCI directory checks were unavailable. Selected institution-hosted certificates and university/hospital claims are clearly labelled; a parent HEI grade is never assigned as a separate medical-college/department grade. Missing evidence means **not established**, not **not accredited**. Published expiry does not prove renewal was refused.
- **Expanded JCI coverage:** the user supplied an extract from the [official JCI India directory](https://www.jointcommission.org/en/about-us/recognizing-excellence/find-accredited-international-organizations?rfkid_7:content_filters=country:eq:India) with **70 organisations / 71 programme decisions**: 60 Hospital, 1 Academic Medical Center Hospital, 7 Ambulatory Care, 1 Medical Transport, 1 Enterprise and 1 Sustainability certification. **38 organisations / 39 decisions** have reviewed matches to existing matrix campuses; **32 organisations** remain outside the requested states, pending campus confirmation or unmatched. All 71 decisions are readable in the dashboard and workbook and downloadable in the [supplied JCI extract CSV](exports/jci-india-directory-extract.csv). This is the supplied extract count, not an independently verified complete India total. Both direct and normal-browser requests from this session returned HTTP 403 / maintenance. Records therefore explicitly say **user-supplied directory extract; live recheck pending**. The two earlier hospital claims remain separate sources for the same hospitals, not two additional hospitals. **Effective Date is not expiry or the latest renewal date.** Enterprise, transport, ambulatory care and sustainability scopes remain distinct; chain names and shared addresses do not transfer accreditation to other hospitals or courses.

Downloads: [research workbook](exports/institution-accreditations.xlsx), [credential guide and coverage](exports/institution-accreditations.md), [matched campus evidence](exports/institution-accreditations.csv), [all source records](exports/accreditation-institution-register.csv), [pending identity matches](exports/accreditation-pending-matches.csv), [state coverage](exports/accreditation-state-coverage.csv), [source register](exports/accreditation-sources.csv), and [structured evidence](exports/institution-accreditations.json).

The workbook includes a blank written-confirmation tracker. Approximate name suggestions are only a research queue; they are not counted or displayed as credentials held. Full raw directories, individual contact information, temporary/signed links and private collection files are excluded from the hosting ZIP. Sources were checked on **18 October 2026**; consult live status and the applicable admission-year documents before choice locking.

For hosting, upload **all extracted files**, including `accreditation-data.js`, every `accreditation-records-*.js` file and the complete `exports/` folder. The data is split to keep each public file below 25 MB for GitHub browser uploads. The structured accreditation JSON lists relative `record_parts`; concatenate those arrays to reconstruct its complete records. `exports/knowledge-base.json` points to that separate accreditation export.

## Resident experience survey and filterable Excel

Open **Resident experience** in the dashboard, or use the `#residents` link. The view contains **1,748 department ratings across 662 institutions in 30 states/UTs**, transcribed from the supplied Resident-Rated Department Toxicity Index, branded The Nachiket Bhatia Show, with a revised data cutoff of **6 October 2026**. Filter by state preference, state, institution, specialty, program label, published verdict and duty-hours source; search by college/city/branch. Expand **Rating ranges, stipend & workload** to filter stipend/hour bands, domain completeness and simultaneous minimum/maximum ranges for the published score, recommendation percentage and all nine domains. Active numeric ranges exclude unreported values; unknowns are never treated as zero. Invalid ranges display an error. Click table headings to toggle ascending/descending sorting, or use the sort menu for institution, program and other fields. Numeric values sort numerically, bands sort in their reported order, and unreported values remain last in both directions. The Institution directory sorts by state, name, matching department count, matching specialties or source page; its counts reflect all current filters. Both tables retain continuous scrolling, and sorting preserves horizontal position. The directory lists institutions in this PDF, rather than their affiliating universities.

Download the **[filterable Excel workbook](exports/resident-toxicity2026/Resident-Rated-Toxicity-Index-filterable.xlsx)**, [institution list](exports/resident-toxicity2026/institutions.csv), [all department ratings](exports/resident-toxicity2026/department-ratings.csv), [detailed assessment](exports/resident-toxicity2026/README.md) or [complete research pack](exports/Resident-Rated-Toxicity-Index-research-pack.zip). Every row links to its page in the supplied source PDF. The public data and downloads contain institution/department aggregates, not individual respondent records.

**These are unverified anonymous resident aggregates, not an institutional safety finding or a validated ranking.** Per-department sample sizes are absent; the report says most departments have one or two responses. All 1,710 complete rows reproduce the score within displayed rounding; 38 rows have missing domain ratings. Arithmetic consistency does not establish representativeness. **577 duty-hour entries are estimates from other reports**, explicitly labelled and independently filterable. Individual domain ratings run higher-is-better; the composite runs higher-is-worse. Safety has only 5% weight, so a low aggregate can conceal an important concern. Source verdict labels, unknown values, mixed program labels and unclear campuses remain explicit.

**Metrics & credibility** explains these limits and the conflicting old/revised cover totals. No specific Reddit thread or comment was verified because public access was blocked and search results were unusable; the clearly labelled Reddit links are search routes only. The source PDF, workbook, assessment and aggregate exports are included in the hosting ZIP. Full transcripts, private caches and credentials remain excluded. The public snapshot can be rebuilt with `python scripts/resident_experience.py`.

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
- **Institution shortlists:** dated research for all 21 requested course forms (12 subjects), including MD/MS, DNB and the two direct six-year DrNB courses. Search institutions/cities and filter by qualification, state preference, state, institution type and admission group. INI-CET appears separately. Compare up to four departments across courses with expandable evidence. Selection lasts for this session; use the workbook for a durable copy.
- **Career routes & salaries:** 15 requested postgraduate branches, including Radiation Oncology and General Surgery, with post-PG work, exact NEET-SS feeders and award-specific seat counts, 137 sourced fellowship/focused-training examples, government/private/corporate pay observations with dates and evidence limits, and branch-specific career-stage and saturation checks. Radio-diagnosis is the default when no in-scope branch is selected. Work/routes, seats, salary/stipends and shortlisting checks have separate tabs and continuous scrolling. Salary filters cover sector and named city categories. Published facts and editorial planning advice remain distinct.
- **Personal notebook:** save topics, reflections, comparison choices and college worksheets in browser storage. Export/import JSON to back up or transfer your work. Imported notes overwrite matching saved notes; new topics and colleges merge.
- Continuous scrolling, responsive layouts, CSV/JSON/Markdown downloads and no third-party frontend dependencies.

Browser storage is specific to the browser and site address. Moving from a local file to GitHub Pages does not transfer it automatically. Export your notebook first; then import it on the hosted site. If browser storage is blocked, export before closing the page.

## Institution research: how to shortlist

**Focused working list: Ophthalmology (OPTH) and ENT.** Start with the [readable list](exports/ophth-ent-research-list.md) or [Excel research workbook](exports/ophth-ent-research-list.xlsx): 8 Ophthalmology and 9 ENT programme/campus entries, arranged as local/nearby enquiries, outstation comparisons and separate INI-CET options. The workbook includes detailed evidence, known fee/stipend records and an editable verification tracker. This reuses the 18 October evidence snapshot; it is not a fresh live vacancy/accreditation check or an institution quality ranking. [CSV list](exports/ophth-ent-research-list.csv).

**Resident and alumni interviews:** open Ophthalmology or ENT under Institution shortlists, then expand the interviews panel. Six additional public videos are separately classified: three first-hand resident/alumnus accounts, one second-hand visitor report, one applicant choice discussion and one alumna interview whose captions are unusable. Ten timestamped paraphrases connect to practical department checks. Speakers' roles, dates, commercial/friendship context, caption limits and evidence gaps remain visible. None establishes a current first-hand review of an exact programme/campus in the focused 17; Sir Ganga Ram feedback needs corroboration, and the historical Yashoda lead does not resolve its exact unit. These videos do not change the main channel's catalogue/full-review totals. Full captions stay private. [Interview evidence JSON](exports/ophth-ent-resident-reviews.json).

**Focused Radiation Oncology and Pathology research:** [research guide](exports/radiation-pathology-research-list.md), [Excel workbook](exports/radiation-pathology-research-list.xlsx) and [CSV list](exports/radiation-pathology-research-list.csv) cover 25 programme/campus enquiries: 12 Radiation Oncology and 13 Pathology. The dashboard adds practical enquiry groups, branch-specific training checks, evidence from three already reviewed podcasts and dated employer/expansion sources. The workbook includes 300 verification prompts and a blank 20-city/branch local-jobs tracker. These are research candidates, not a certified quality ranking or verified current vacancies. Institution evidence reuses the 18 October snapshot, including outstanding recognition/renewal and seat-offer checks.

**Jobs and saturation:** first-party evidence includes September 2026 AIIMS Raebareli six-month ad-hoc SR advertisements for both branches, experienced Pathologist recruitment at Metropolis, and HCG service expansion with doctors onboarded. These establish bounded recruitment/expansion activity; they do not measure nationwide net job creation, fresh-MD placement rates or saturation. The Raebareli posts listed only SC/ST vacancies for these departments. HCG doctor onboarding has no published specialty split or headcount here, and district day-care cancer centres must not be counted as radiotherapy units or Radiation Oncologist posts. Podcast growth/salary opinions remain attributed separately.

**INI-SS versus NEET-SS feeders:** open either focused institution page, or the branch's Work and training routes tab. The [comparison workbook](exports/ss-feeder-comparison.xlsx), [readable matrix](exports/ss-feeder-comparison.md) and [CSV](exports/ss-feeder-comparison.csv) compare **Radiation Oncology/Radiotherapy and Pathology only**, with 15 institute/course rules and 30 parent-branch rows. MD and DNB status stay separate. NEET-SS 2025 and INI-SS January 2027 are explicitly different cycles, not a same-year seat comparison. INI-SS is separate from INI-CET. Part A and the relevant Part B PDFs were checked; source filenames, locators and checksums are retained. Temporary signed PDF links are excluded; use the official advertisement page to open each named document.

Feeder differences matter: Radiation Oncology can enter NEET-SS Medical Oncology, but is not listed for AIIMS Medical Oncology in the checked INI rules; JIPMER explicitly accepts MD/DNB Radiotherapy and PGIMER names MD Radiotherapy or equivalent. Pathology can enter NEET-SS Clinical Haematology but is not listed for the checked INI AIIMS/PGIMER version. NEET-SS Medical Genetics accepts any MD/MS/DNB broad specialty, while the checked INI lists exclude these two parents. Pathology retains specific INI laboratory routes. “MD or equivalent” remains conditional for DNB where it is not explicitly named. Feeder permission is separate from actual offered seats, age/completion conditions, assessment and selection; intended-session notices can change the rules before a new PG entrant graduates.

**Service years for your MCC All India Quota route:** open **State bonds** for all 18 preferred states/UTs. A prominent **AIQ service-years column** distinguishes current explicit AIQ rules, older college forms, conditional schemes and unresolved terms. Filter by state, preference, AIQ evidence or wider state evidence, with continuous scrolling. Download the [comparison workbook](exports/state-bond-comparison.xlsx), [readable guide](exports/state-bond-comparison.md), [CSV](exports/state-bond-comparison.csv) or [evidence JSON](exports/state-bond-comparison.json). Start with the workbook's **MCC AIQ years** sheet; the wider state context stays separate. Its college tracker leaves actual contract confirmation blank for all 122 researched programme profiles.

**Delhi correction:** MAMC's circular dated 7 August 2025 introduces **one year of compulsory service / Rs20 lakh PG bond from 2025–26 onwards**, including AIQ and state quota. Its primary circular was checked on a secondary host, with that provenance disclosed. DU's 2026 **Rs10 lakh course-exit surety** is a separate obligation. Neither DU affiliation nor a silent upload establishes exemption from service. Other Delhi colleges, central/INI institutions and DNB hospitals retain separate confirmation requirements.

Bond research checked **18 October 2026** uses **30 dated sources**. Three 2026 prospectuses explicitly include AIQ: **Tamil Nadu 2 years, Kerala 1 year minimum, Maharashtra 1 year**. Other durations retain their document date and scope. **Andhra Pradesh's current one-year / Rs40 lakh Annexure A explicitly names State/CQ seats; it does not establish either a one-year obligation or an exemption for AIQ.** Puducherry's current campus/route terms remain unresolved. These two AIQ numeric fields stay blank, never zero.

New primary evidence resolves **Odisha to 2 years** in SCB's MCC bond and **Rajasthan to 2 years** in Dr SN Jodhpur's explicit AIQ/non-service undertaking. Rajasthan's five-year clause is for in-service entrants; penalties vary by specialty. Burdwan's service bond specifies **Rs10 lakh per defaulting year** across three years, separately from course exit. Kerala allows conditional relief for certain regular government appointments and separate SS-degree deferment; fellowship is excluded from that relief. Uttarakhand's older two-year hill-service scheme is linked to opting for subsidised tuition; its mixed forms do not establish every current campus's full-fee option. Karnataka's reported three-year obligation credits an already completed statutory year, rather than automatically adding to four; the operative 2026 order remains unverified.

The guide includes **16 college/route exception and confirmation groups**, including SVIMS, Delhi colleges, BHU/AMU, Kerala appointment relief, Bihar's limited already-employed AIQ exception, and **AFMS Priority-V civilian entrants' separate five-year service**. MCC also counsels central, deemed and DNB seats: these are not all state-government 50% AIQ seats, and INI-CET is separate. Five wider state rows have no single fixed numeric service principal. No aggregate liability or legal enforceability is inferred. Run `python scripts/check_state_bonds.py` after rebuilding; browser checks cover AIQ filters, AP unknowns, Rajasthan/Odisha durations, Delhi service versus exit, deep links and mobile scrolling.

Research snapshot: **18 October 2026**. Open **Institution shortlists**. Start with a course, compare the local Hyderabad candidates against departments with documented training breadth, then investigate the listed gaps. Read the [complete research guide](exports/institution-guide.md), [Excel workbook](exports/institution-shortlists.xlsx), [shortlist CSV](exports/institution-shortlist.csv), [source register](exports/institution-sources.csv), [supplied matrix evidence](exports/institution-matrix-evidence.csv) or [research JSON](exports/institution-research.json).

Each card separates programme evidence, department services, patient load, faculty, establishment history, resident welfare, cost, language and travel. Sources carry retrieval dates and limitations. Institutional workload is not resident-level exposure. No safe/toxic rating or aggregate institution score is invented. Recommendations mean research priority, not certification that every standard is met. Coverage is selective: absence is not a negative judgment, and every preferred state is not covered for every branch.

All fee levels are retained. Joined fee records preserve annual/first-year/other bases, additional charges, escalation uncertainty and source dates. Joined stipend records preserve frequency—including **not stated**—and training years. Unknowns are never zero. Map links are travel searches, not verified distance or flight claims. For a woman relocating from Hyderabad, the checklist includes current women residents' feedback, duty/rest, hostel access, night transport and usable grievance support.

Direct six-year programmes are post-MBBS routes, kept separate from post-MS NEET-SS. Verify the exact campus, accreditation cycle, current offered seats, qualification, bonds and eligibility before choosing. INI-CET, MCC and state routes are not interchangeable. No admission chances are inferred without rank, category and domicile.

The hosting ZIP includes the complete public research and workbook; it excludes downloaded pages/PDFs, credentials and private caches. Updating this local ZIP does not publish to GitHub automatically.

## Career research: units and admission cycle

Research snapshot: **17 October 2026**. Open **Career routes & salaries** in the dashboard, then choose a branch. Download the complete [readable career guide](exports/career-guide.md), [route table](exports/career-routes.csv), [salary evidence](exports/career-salaries.csv), [eligible SS options](exports/career-ss-options.csv), [source register](exports/career-sources.csv) or [research JSON](exports/career-research.json).

- **Seats:** the complete initial final Round 1 **NEET-SS 2025** MCC matrices were published **11 March 2026**; academic session 2025 started **10 April 2026**. Both parsed totals reconcile: DM/MCh **4,312**, DrNB **3,267**, total **7,579**, across **2,873 source rows**. This is a reproducible initial baseline, not current vacancies or a final revised intake. Later additions/withdrawals, retained seats outside these matrices, INI-SS and FNB are excluded. No complete NEET-SS 2026 bulletin/matrix was located; missing 2026 data is not zero.
- **Eligibility:** 123 verified subject-and-award options across the 15 feeder branches. Parent-branch totals deliberately overlap and must not be added. The same destination seat can accept several feeders. DM Paediatric Critical Care and MCh Paediatric Cardiothoracic Vascular Surgery are eligible but absent from this baseline; their counts stay null. The bulletin's paediatric award-label discrepancies remain documented. Medical Genetics has a broad any-MD/MS/DNB feeder; this does not open other Medical Group courses to every branch.
- **Fellowships:** FET/FNB, institutional fellowships, PDCC/PDAF and recognised DM/MCh/DrNB retain separate credentials, feeder conditions and selection routes. These 137 examples are not an exhaustive national fellowship register, a count of seats or a list of open applications. Recognition for teaching-faculty purposes and procedure privileges require exact current checks. Unverified INI-SS routes and general DM/MCh duration claims are explicitly left for the admitting prospectus.
- **Salary:** records retain INR per month versus year and identify pay-matrix basic, consolidated pay, training stipend or advertised remuneration. Annual/12 is labelled a monthly equivalent, not an offered monthly wage or take-home pay. A government pay-scale ceiling is not an entry salary. Advertised portal budgets are not verified offers, and conflicting fields stay visible. The nuclear medicine numeric example from 2023 is explicitly historical. Current undisclosed amounts remain null.
- **Stages and location:** every observation names its role, qualification, experience, city, date and source. There is no fabricated uniform salary ladder or automatic fellowship/SS uplift. City tiers are editorial comparison categories, not government HRA classifications. Corporate-chain examples identify the employer where published; an agency's unnamed client is not a verified chain employer. Reliable branch-by-city-by-stage pay remains incomplete, especially for Palliative, Family and Geriatric Medicine; gaps stay visible.
- **Saturation:** source-linked branch assessments and practical checks do not claim to measure national unemployment. Seat growth, portal listings, healthcare need and podcast warnings are different evidence. Use current written offers and local graduate outcomes before deciding.

The offline build validates branch coverage, source references, salary units and exact agreement between route awards and eligible seat rows. The hosting ZIP includes these public guides/data and excludes full transcripts, downloaded research PDFs, caches and credentials.

### Radiation Oncology update

Open [Radiation Oncology career routes](index.html#careers/radiation-oncology/routes), [eligible seats](index.html#careers/radiation-oncology/seats), [salary evidence](index.html#careers/radiation-oncology/salary) or [shortlisting advice](index.html#careers/radiation-oncology/shortlist). It remains separate from Radio-diagnosis and Nuclear Medicine. Research retrieved **17 October 2026**.

- **After MD/DNB:** supported SR/consultant practice, academic work, focused radiation/brachytherapy services, palliative oncology and research. A further DM is not automatically required for the parent specialty; actual competence, registration and privileges still apply.
- **NEET-SS 2025:** Medical Oncology has **160 DM + 200 DrNB seats**; Medical Genetics has **9 DM + 4 DrNB seats** in the selected initial MCC matrices. These **373 seats** accept other eligible feeders too. Medical Oncology requires its own question-paper group; Medical Genetics uses the Medical Group. These are not NEET-SS 2026 counts or current vacancies.
- **Focused programmes:** CMC Vellore's one-year Advanced Gynaecologic Brachytherapy fellowship; SGPGI's one-year PDCCs in Advance Techniques in Radiation Oncology and Palliative Oncology. Each has explicit feeder evidence. Certificates, DM/DrNB and clinical privileges remain distinct.
- **Government pay:** dated AIIMS/SGPGI SR examples list **INR 67,700 monthly basic**, plus applicable allowances. AIIMS Raebareli's Radiation Oncology Associate Professor vacancy has **INR 138,300 entry basic** with progression in the published scale, or a separate **INR 188,000 monthly contractual** remuneration; full faculty experience/selection rules apply.
- **Private adverts:** Jaipur's MD/DNB Radiation Oncology consultant listing advertises **INR 25-32.5 lakh/year**, with 1-7 years' experience. Other early-career adverts span different amounts and have weaker qualification fields. Publication dates were not exposed in the consulted copies; these are unverified retrieval-dated observations, not confirmed 2026 offers or a measured salary range. A senior head-role listing discloses no pay. No verified named-chain pay or post-fellowship/SS premium is established.
- **Editorial judgement:** shortlist for an interest in cancer care and precise treatment planning, with willingness to work where a functioning service and funded role exist. Compare supervision, actual case/procedure logs, physics support, equipment uptime, patient continuity and recent graduate employment before prioritising a college's ownership or machine brand. No representative national saturation estimate was found.

### General Surgery update

Open [General Surgery career routes](index.html#careers/general-surgery/routes), [eligible seats](index.html#careers/general-surgery/seats), [salary evidence](index.html#careers/general-surgery/salary) or [shortlisting advice](index.html#careers/general-surgery/shortlist). Research retrieved **17 October 2026**.

- **After MS/DNB:** supported SR/consultant work, a parent-specialty General Surgery career, academia, trauma/acute care, focused training or eligible superspecialty entry. Independent clinical privileges and operating readiness must be checked; an MCh is not automatically required for every General Surgery job.
- **NEET-SS 2025:** **14 destination subjects, 23 award options and 2,677 listed seats** in the initial MCC matrices. The destinations are Plastic/Reconstructive Surgery, Surgical Gastroenterology, HPB Surgery, Urology, Vascular Surgery, Cardiovascular/Thoracic Surgery, Thoracic Surgery, Paediatric Cardiothoracic Vascular Surgery, Neurosurgery, Paediatric Surgery, Surgical Oncology, Head/Neck Surgery, Endocrine Surgery and Medical Genetics. The Paediatric Cardiothoracic Vascular Surgery MCh count is not listed and remains null. Most routes use Surgical Group; Head/Neck needs ENT Group and Genetics needs Medical Group. Counts are shared with other eligible feeders and are not current vacancies or NEET-SS 2026 totals.
- **18 focused programmes:** ten FNB route examples, five CMC institutional fellowships and three SGPGI PDCCs. Seven FNBs permit General Surgery directly or with specified experience; three require a prior GI Surgery/Urology/Paediatric Surgery superspecialty. Bariatric FNB requires three years' post-PG General/Minimal Access Surgery experience; the General Surgery route to Renal Transplant FNB requires three years at an approved renal-transplant centre. A fresh MS alone does not qualify for those conditional routes or Liver Transplant FNB. Programme examples are not available-seat counts.
- **Government pay:** dated SR examples give **INR 67,700 monthly basic plus applicable allowances**. AIIMS Raebareli's General Surgery Associate Professor and Professor vacancies have separate experience-based basic scales and contractual remuneration. PDCC/FNB/DrNB and TMC MCh stipends are training pay, not subsequent consultant income.
- **Private salary evidence:** a Rajahmundry role advertises **INR 25-30 lakh/year** with 2-3 years' experience. Other adverts show material conflicts: Satna's header and body give different annual budgets; Palakkad's hours and duties disagree; a Mumbai listing has a weak qualification field. MCh Urology adverts are labelled post-SS, not MS-only salaries; one planned-centre listing has conflicting pay fields, while another discloses no pay. No average or automatic fellowship/MCh salary increment is inferred.
- **Editorial judgement:** prioritise liking operative/perioperative work, supervised primary-operator case logs, decision-making and complication rescue. Compare anaesthesia/ICU/blood-bank support, allocation among trainees and alumni employment across central/state/deemed/private departments. A robot, hospital brand or large SS seat pool does not establish your operating access or future earnings. Representative saturation data and a verified named corporate-chain salary grid remain gaps.

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

Run `python scripts/check_careers.py` after rebuilding to check the 15 career profiles, 123 eligible awards, salary units/nulls, all source CSV totals and current hosting-ZIP contents. Browser checks also exercise all 15 branches across the four career tabs, salary filters, deep links and mobile layouts.

The build makes **no API requests**. It regenerates the public dataset/exports, private transcript reader/data, validation report and hosting ZIP. It does not alter your browser notebook. Reviewing the 132 already-cached transcripts needs **no further Supadata credits**.

`exports/review-queue.csv` lists all catalogued videos with their actual summary status. `exports/video-briefs.md` lists any remaining partial briefs and becomes empty of briefs once all are promoted. Important-section emphasis is an editorial navigation aid, not a guest claim or branch ranking. `exports/video-summaries.md` contains the completed reviews; `exports/branch-themes.md` organises decision groups, shared training and the twelve-aspect index for every navigation topic. Shorts collection remains a separate scope.

The public JSON uses schema version 6. Each branch stores canonical `source_points` keyed by stable IDs; its decision and aspect groups list `point_ids`, and general training has separate `shared_training_point_ids`. Conclusions contain the rubric, authored topic assessments, preference profiles and attributed institution observations; evidence references use existing video/theme IDs. `careers` adds dated branch routes, seat methodology, salary observations, a source register and labelled editorial planning. The frontend resolves references. Personal notebook version 1 remains compatible.

Raw sources and caption caches are required to rebuild. The hosting ZIP alone is sufficient to serve the finished site, but does not contain those private source materials.

## Host on GitHub Pages

For this growing site, **GitHub Desktop is the recommended upload method**. The complete extracted package exceeds 100 MB even though every public file is below GitHub's 25 MiB browser limit per file. A browser commit can fail when uploading the complete package together. Do not upload the full research workspace: private research PDFs can exceed GitHub's 100 MiB Git file limit and are not part of the public site.

### Recommended: GitHub Desktop

1. In GitHub Desktop, choose **File > Clone repository > URL** and enter `https://github.com/pramod-zillella/neet-specialty-knowledge-base`. Clone the existing repository rather than creating another repository.
2. Extract `neet-specialty-knowledge-base-site.zip`. Copy **its contents** into the cloned repository folder, replacing matching files. `index.html` must remain directly beside the clone's `.git` directory, with `exports/` below it.
3. Review **Changes**, enter a commit summary such as `Update specialty knowledge base`, and choose **Commit to main**, then **Push origin**. The public package does not require Git LFS.
4. Check **Settings > Pages** and select **Deploy from a branch > main > / (root)**. Wait for the Pages deployment in **Actions** before checking the published site.

### Browser alternative: smaller commits

If a browser upload fails with “The file is too large and cannot be uploaded”, prepare smaller batches locally:

```powershell
python scripts/package_github_upload.py
```

The command makes a fresh ignored `private/github-upload-.../` folder and prints its location. It copies only the existing public hosting ZIP, verifies every file, and creates `site-files/`, `browser-batches/`, individual batch ZIPs and a manifest. Each browser batch contains at most 20 MB of extracted files and fewer than 100 files. This packaging command makes no network requests and does not publish anything.

For **each** numbered folder under `browser-batches/`, open the GitHub repository **root**, choose **Add file > Upload files**, drag that numbered folder's **contents** into GitHub, and commit. Include the `exports` folder wherever present. Repeat from the repository root for every batch. Do not upload the numbered parent folders, the ZIPs, or the instructions/manifest files. Finish all batches before checking the complete site.

### Basic Pages setup

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
