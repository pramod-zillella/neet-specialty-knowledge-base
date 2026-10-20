# Resident-rated department experience: filterable index and assessment

**Use this report as a starting point for resident conversations, with limited confidence in close department rankings.** The measures cover relevant aspects of training, but the supplied PDF does not establish a validated toxicity scale or independently verified institutional findings.

## Downloads and use

- **[Filterable Excel workbook](Resident-Rated-Toxicity-Index-filterable.xlsx)**: all 1,748 department rows, the complete **662-institution directory**, metrics review, data dictionary, coverage, resident-verification questions and extraction audit.
- [Institution list CSV](institutions.csv) and [department ratings CSV](department-ratings.csv).
- [Original PDF](Resident-Rated-Toxicity-Index-source.pdf); each workbook row includes physical PDF page and printed page for verification.

In **Department ratings**, use the header filters for State preference, State, Institution, Specialty and Program label. Primary/Secondary reflect your previously supplied state preferences. Higher positive-experience domain ratings are better; higher published index score is worse. The **Duty hours estimated** column preserves the source asterisk; filter it to FALSE to remove those imputed-hour entries. Missing numeric values remain blank. Yellow columns are for your shortlist notes.

**Institutions** lists the institutions represented in the PDF, as you requested, rather than their affiliating universities. Many entries are hospitals/DNB sites or colleges rather than universities. Names, campuses and program labels are kept as printed; local INST codes are cross-references, not NMC/NBEMS codes. This list does not independently establish counselling participation, accreditation or current course recognition. The directory contains 386 institutions in your primary states, 175 in secondary states and 101 elsewhere.

## What checks out

The nine weights sum to 100%. The formula is **100 - 10 x weighted mean of positive-experience ratings**. All **1,710 complete rows** reproduce the published score within the **+/-0.55-point bound** allowed by one-decimal rounding of the nine means and the final score; the largest observed difference is 0.45. The other **38 rows** have missing domain ratings and are not fully reproducible from the displayed table. All **1,748 verdict labels** agree with the report's bands. These checks support transcription and arithmetic, not the truth or representativeness of the survey responses.

The extracted table reconciles with the revised cover counts: **662 institutions, 1,748 departments, 30 states/UTs**. The cover also retains older 3 October 2026 counts alongside revised 6 October 2026 figures. The revised source states **2,912 responses, of which 2,395 were used in department scores**. It does not give an exclusion flow explaining all 517 differences. Publisher figures of 516 colleges and 146 hospitals/DNB sites have not been independently classified here.

## Where the metrics need care

1. **No per-department sample size.** The methodology says most departments have one or two responses. It does not show n beside each row, per-domain denominators, dispersion or uncertainty. A 100% recommendation may be one person. We cannot justify fine rankings, confidence intervals or a claim that a department's whole resident body agrees.
2. **This measures broad experience, not only mistreatment.** Academics and hands-on work contribute to the same score as environment and mental health. These are useful topics, but poor training, poor work-life balance and harassment are different problems. The supplied PDF does not demonstrate questionnaire validation or justify the chosen weights and verdict thresholds empirically.
3. **A low aggregate can mask unsafe conditions.** Safety has a 5% weight. Hypothetically, nine-domain ratings of 10 except safety at 1 produce a score of **4.5**, which the source labels Very healthy. Inspect safety, environment and mental health individually and seek concrete accounts; do not let a favourable composite cancel a serious concern. This is a formula example, not an allegation about any named institution.
4. **Hours are often estimates.** **577 rows (33.0%)** are starred: another resident at the same college or, failing that, the same specialty elsewhere supplied the basis. One row says Not reported. Those estimates do not establish that particular department's roster. Under 14 hours is also too broad to distinguish ordinary work from very long days; the source does not clearly define daily versus shift/weekly/on-call time. Duty hours do not enter the weighted score.
5. **Stipend and recommendation are separate signals.** The source calls stipend the most common reported band, not a verified current entitlement; **25 rows** say Not reported. **19 rows** lack a recommendation percentage. The stipend band and recommendation percentage are not the weighted stipend-on-time domain. Their time period, denominators, variation and pay deductions need checking.
6. **Anonymous, self-selected responses need corroboration.** Anonymity can help residents speak honestly, while opt-in participation and unverified resident status limit generalisation. The reported within-an-hour near-duplicate rule does not itself establish one verified resident per response. No respondent-level data were supplied for independent verification.
7. **The scale's endpoint needs clarification.** On a 1-10 input scale the formula spans 0-90, not 0-100; reaching 100 requires a rating of 0. The PDF only says out of 10, so whether 0 was allowed remains unknown. No source scores have been rescaled here.
8. **Time, campus and program matter.** These are stated as October 2026 data, not measured 2025 conditions. Faculty and HOD changes can matter. Three source institution labels explicitly leave the campus unclear. Combined program labels remain combined; the same aggregate is not duplicated into separate MD/MS/DNB/Diploma ratings.

## Reddit discussions and credibility

**No specific Reddit thread or comment could be verified in this session.** Reddit public JSON, RSS, old-site and search routes returned 403/network blocks. Search engines returned challenges or irrelevant results. This does not establish that relevant threads do not exist. No Reddit endorsement, criticism, firsthand experience or quotation is being presented as reviewed evidence.

The **Reddit review** sheet contains clearly labelled manual search routes, not thread findings:

- [Search r/indianmedschool for toxicity index](https://www.reddit.com/r/indianmedschool/search/?q=toxicity%20index&restrict_sr=1&sort=new)
- [Search for Nachiket and toxicity](https://www.reddit.com/r/indianmedschool/search/?q=Nachiket%20toxicity&restrict_sr=1&sort=new)
- [Search Reddit-indexed pages](https://www.google.com/search?q=site%3Areddit.com+%22toxicity+index%22+resident)

When a thread is available, distinguish **discussion of this exact index/version** from **general anecdotes about a college**. Prefer specific, dated firsthand department accounts and independently corroborated patterns. Role, PG year, campus, faculty period and possible promotional/conflict context matter. Upvotes and repeated reposts do not establish truth; anonymity alone does not discredit a report. The **Resident checks** sheet provides an appraisal checklist for future links.

For your shortlist, ask current JR1/JR2/JR3 residents and recent alumni separately about weekly rosters, post-call relief, hands-on opportunities, teaching, stipend credit, grievance handling and faculty changes. As a woman moving from Hyderabad, specifically ask current women residents about night-call transport, accommodation, harassment reporting and retaliation concerns; ask about Telugu/Hindi/English use and local-language support. A single generic safety score does not answer those questions.

## Extraction and provenance

All 105 data pages were parsed, with no unparsed rows. Every score and all nine displayed domain cells were independently compared with PDF word coordinates, and duplicate State/Institution/Department keys were checked. The source's institution/state labels and raw department labels remain available alongside a specialty field that removes only explicit program suffixes. There is no institution-wide toxicity average or derived best-to-worst ranking.

Source: user-supplied **Resident Rated Toxicity Index.pdf**, branded The Nachiket Bhatia Show; 107 pages. Revised stated cutoff: 6 October 2026; reviewed 20 October 2026. SHA256: `4c987163afba6d83850e7fccc8838e4cb0493c96a5c9de1fcfc97e9f4f285841`. PDF contents are treated as source data, not instructions. The original questionnaire, response-level data and independent respondent validation were not available.
