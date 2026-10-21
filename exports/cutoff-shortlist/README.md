# Cutoffs, fees and resident experience

**How to use** — Filter College/State/Branch/Quota; add choices to the shortlist. Save priority and notes; export an Excel workbook or a JSON backup. Browser choices stay private to that browser/site.

**Original export** — 2025 exported allotments, Open category only. Round ranks are historical ranks, not admission predictions. Keep institution address, programme, quota and category distinct.

**Your eight branches** — The supplied export also has Family Medicine and Geriatrics; they are retained and marked outside your stated eight. PMR has no input rows and has not been invented.

**Fee periods** — Separate 2025 and 2026 branch-specific listed fees, tuition components, fee periods and sources. First-year totals, annual tuition and annual academic fees are different amounts. No fee-change column or inferred total is used.

**MCC fee reference** — Live PG 2026 Annexure-C college-reported amounts are separate generic references. They are not verified branch/quota-specific tuition or confirmed 2025 fees. The board year and retrieval date do not prove when the college last updated its amounts. Confirm directly before choice filling.

**Missing/zero fees** — Zero and blank MCC fields are treated as unreported, never a free course. Missing values remain empty. Explicit fee text/ranges stay in fee evidence; generic figures do not fill branch-specific fee cells.

**Stipends** — First-, second- and third-year stipend amounts have separate source years, frequency, applicability and evidence. Institution disclosures and generic MCC profiles do not prove actual credited pay. A missing frequency is not assumed monthly. Survey stipend bands and payment-punctuality scores are separate evidence.

**NBEMS fees and stipends** — The 2025 and 2026 accreditation bulletins each prescribe annual tuition INR75,000 + library INR15,000 + appraisal INR15,000 + conditional accommodation INR20,000. Schedule sum is INR1.05 lakh without accommodation or INR1.25 lakh with it; electricity/consumables may be additional. These are prescribed policy components, not a hospital invoice. Post-MBBS DNB basic stipend is INR43,000/45,000/47,000 per month in PGY1/2/3; higher applicable state/central parity can govern. This base floor is not promised take-home pay. Do not transfer these rules to MD/MS or post-diploma DNB.

**Entire course** — A three-year total is included only where explicitly printed in a reviewed course-specific schedule. Do not multiply a first-year charge by three or deduct a survey stipend as guaranteed income.

**Toxicity evidence** — Anonymous resident aggregates, source cutoff 6 October 2026. Department response sizes are undisclosed; the report says many have 1-2 responses. These are not validated quality rankings or safety findings.

**Score directions** — Composite toxicity score: higher is worse (0-100). Nine domains: higher is better (0-10). Recommendation percentage: 0-100. Reported duty hours can be estimates; the source flag is retained.

**Programme matching** — MD/MS and DNB remain separate. Programme unspecified and combined MD/MS,DNB ratings are explicitly flagged. A different programme alone is not assigned to your choice. Missing or ambiguous ratings stay blank.

**Campus matching** — Only unique exact normalised campus/state matches and explicitly reviewed aliases assign ratings. Reused campus names and unclear report campuses stay pending. Fuzzy suggestions in the research queue do not populate ratings.

**Excel shortlist** — In the static workbook mark Selected = Yes in All choices. Excel 365/2021+ Shortlisted uses FILTER and fills automatically; older Excel: filter Selected = Yes or use the website export. The website export contains actual shortlisted rows, priorities and notes.

**Excel editing** — Website selections do not automatically synchronise with a downloaded workbook or other devices. Export/import the shortlist JSON to transfer choices. Public downloadable workbooks contain no personal selections.

**Fee coverage** — Fee collection is not a complete verified fee audit. Every input choice is included, including those needing a fee confirmation. Research queue lists missing course-year fees and unresolved ratings.

Coverage:

```json
{
  "input_rows": 1690,
  "college_labels": 710,
  "campus_address_records": 732,
  "in_scope_rows": 1619,
  "fees_2025_rows": 73,
  "fees_2026_rows": 98,
  "nbems_policy_rows": 586,
  "stipend_2025_rows": 51,
  "stipend_2026_rows": 117,
  "mcc_stipend_rows": 1519,
  "mcc_profiles_retrieved": 690,
  "mcc_positive_fee_rows": 753,
  "rating_rows": 130,
  "rating_match_status": {
    "Department or compatible programme not reported": 835,
    "Institution/campus match pending": 725,
    "Exact programme label": 124,
    "Programme unspecified in report": 6
  },
  "missing_requested_specialties": [
    "Physical Medicine & Rehabilitation"
  ]
}
```
