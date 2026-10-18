/* Institute-specific feeder evidence, separate from the NEET-SS seat baseline. */
window.renderSSFeederComparison = (data, subjectId, esc) => {
  const research = data.ss_feeders;
  const rows = research?.rows.filter(row => row.subject_id === subjectId) || [];
  if (!rows.length) return '';
  const e = value => esc(String(value ?? ''));
  const sources = new Map(research.sources.map(source => [source.id, source]));
  const highlights = research.highlights.filter((_, i) => subjectId === 'pathology' ? i > 0 : i === 0 || i === 2);
  const sourceLinks = ids => ids.map(id => {
    const source = sources.get(id);
    if (!source) return '';
    return `<p><a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.title)}</a><br><small>${e(source.locator)}. Retrieved ${e(source.retrieved)}. ${e(source.access_note)}</small></p>`;
  }).join('');
  const status = value => `<span class="ss-status ${value === 'Yes' ? 'ss-yes' : value === 'No' ? 'ss-no' : 'ss-check'}">${e(value)}</span>`;
  return `<section class="ss-feeder-panel" aria-label="INI-SS versus NEET-SS feeder comparison">
    <h3>INI-SS vs NEET-SS: feeder restrictions</h3>
    <p><strong>${e(rows[0].parent)} · MD and DNB checked separately.</strong> ${e(research.name_note)}</p>
    <p class="shortlist-warning">${e(research.cycle_note)}</p>
    <ul>${highlights.map(item => `<li>${e(item)}</li>`).join('')}</ul>
    <div class="actions shortlist-downloads"><a href="exports/ss-feeder-comparison.xlsx" download>Feeder comparison workbook</a><a href="exports/ss-feeder-comparison.md" download>Readable comparison</a><a href="exports/ss-feeder-comparison.csv" download>Matrix CSV</a><a href="exports/ss-feeder-comparison.json" download>Evidence JSON</a></div>
    <details class="ss-matrix"><summary>Compare all ${rows.length} institute/course rules for this parent branch</summary>
      <p>“No” means this parent branch is absent from the listed feeder row. “Not listed” means the destination itself was absent from the checked NEET-SS bulletin. Eligibility does not establish an offered seat. AIIMS entries refer to the institute family; check the exact campus.</p>
      <div class="ss-table-wrap" tabindex="0" role="region" aria-label="Scrollable feeder matrix"><table><thead><tr><th>Destination / award</th><th>INI institute</th><th>${e(research.neet_cycle)}<br>MD / DNB</th><th>${e(research.ini_cycle)}<br>MD</th><th>${e(research.ini_cycle)}<br>DNB</th><th>NEET question paper</th><th>Exact rule & sources</th></tr></thead><tbody>${rows.map(row => `<tr data-ss-rule="${e(row.ini_code + '-' + row.ini_institute)}"><th scope="row">${e(row.destination)}<small>INI: ${e(row.ini_award)}${row.neet_awards ? ' · NEET: ' + e(row.neet_awards) : ''}</small></th><td>${e(row.ini_institute)}</td><td>${status(row.neet_md_status)}</td><td>${status(row.ini_md_status)}</td><td>${status(row.ini_dnb_status)}</td><td>${e(row.neet_group)}</td><td><details class="ss-rule-evidence"><summary>Part A p.${e(row.ini_page)} · ${e(row.ini_code)}</summary><p><strong>INI feeder wording:</strong> ${e(row.ini_feeder_wording)}</p><p>${e(row.note)}</p>${sourceLinks(row.source_ids)}</details></td></tr>`).join('')}</tbody></table></div>
    </details>
    <details class="ss-system"><summary>Other differences: assessment, age, degree completion and seats</summary>${research.system_comparison.map(item => `<article><h4>${e(item.aspect)}</h4><p><strong>NEET-SS:</strong> ${e(item.neet)}</p><p><strong>INI-SS:</strong> ${e(item.ini)}</p></article>`).join('')}</details>
    <details class="ss-legend"><summary>Status definitions and source register</summary><dl>${Object.entries(research.status_legend).map(([label, meaning]) => `<dt>${e(label)}</dt><dd>${e(meaning)}</dd>`).join('')}</dl>${sourceLinks(research.sources.map(source => source.id))}<p>Checked ${e(research.as_of)}. This focused matrix covers two parent specialties; other branches have not been audited here.</p></details>
  </section>`;
};
