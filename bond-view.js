/* Dated state evidence, never an automatic campus-contract assignment. */
window.createBondView = ({data, state, esc, render}) => {
  const research = data.state_bonds;
  const e = value => esc(String(value ?? ''));
  const sources = new Map((research?.sources || []).map(s => [s.id, s]));
  const sourceLinks = ids => ids.map(id => {
    const s = sources.get(id);
    return s ? `<article class="bond-source"><a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)}</a><p>${e(s.evidence_type)} · ${e(s.cycle)} · checked ${e(s.retrieved)}</p><p>${e(s.locator)}</p><p>${e(s.limitation)}</p></article>` : '';
  }).join('');
  const links = `<div class="actions bond-downloads"><a href="exports/state-bond-comparison.xlsx" download>Bond comparison workbook</a><a href="exports/state-bond-comparison.md" download>Readable guide</a><a href="exports/state-bond-comparison.csv" download>State table CSV</a><a href="exports/state-bond-comparison.json" download>Evidence JSON</a></div>`;
  const select = (id, label, values, value) => `<div><label for="${id}">${label}</label><select id="${id}"><option value="">All</option>${values.map(v => `<option value="${e(v)}" ${v === value ? 'selected' : ''}>${e(v)}</option>`).join('')}</select></div>`;
  document.addEventListener('change', event => {
    if (event.target.id === 'bond-state') {
      const id = research.rows.find(r => r.state === event.target.value)?.id || '';
      const hash = '#bonds' + (id ? '/' + id : '');
      if (location.hash === hash) render(); else location.hash = hash;
    }
    if (event.target.id === 'bond-evidence') { state.bondEvidence = event.target.value; render(); }
    if (event.target.id === 'bond-priority') { state.bondPriority = event.target.value; render(); }
  });
  document.addEventListener('click', event => {
    if (event.target.closest('#bond-reset')) {
      state.bondEvidence = ''; state.bondPriority = ''; state.bondState = '';
      if (location.hash === '#bonds') render(); else location.hash = '#bonds';
    }
  });
  return () => {
    if (!research) return '<h2>State bond research unavailable</h2>';
    const shown = research.rows.filter(r => (!state.bondState || r.id === state.bondState)
      && (!state.bondPriority || r.priority === state.bondPriority)
      && (!state.bondEvidence || r.evidence_status === state.bondEvidence));
    const selected = research.rows.find(r => r.id === state.bondState)?.state || '';
    return `<section class="bond-view"><p class="eyebrow">Admission obligations · checked ${e(research.as_of)}</p><h2>State bonds after MD / MS</h2><p>${e(research.scope)}</p>
      <aside class="bond-delhi" aria-label="Delhi service bond finding"><h3>Delhi: check the college and admission year</h3><p><strong>MAMC: one year service / ₹20 lakh PG bond, from 2025–26 onwards.</strong> Its circular expressly includes AIQ and state quota. DU's 2026 ₹10 lakh surety covers course exit under specified triggers. They are separate obligations.</p><p>AIIMS, UCMS, LHMC, VMMC/Safdarjung and ABVIMS/RML each need their own applicable service policy. DU affiliation or a missing service-bond upload does not establish an exemption.</p><details><summary>MAMC circular and DU surety evidence</summary>${sourceLinks(['delhi-mamc-service-notice','du-pg2026','du-surety2026'])}</details></aside>
      ${links}<p class="shortlist-warning">${e(research.limitation)}</p>
      <div class="bond-definition-grid"><article><h3>After successful completion</h3><p>A service bond concerns work owed after graduating. Its default amount is a potential liability, not an annual fee automatically payable by every resident.</p></article><article><h3>Leaving before completion</h3><p>Exit penalties, remaining tuition and counselling deposits have different triggers. A surety or bank guarantee secures an obligation; count it once.</p></article></div>
      <details class="bond-method"><summary>Read the scope before comparing amounts</summary><ul>${research.definitions.map(t => `<li>${e(t)}</li>`).join('')}</ul></details>
      <div class="bond-filters">${select('bond-state','State / UT',research.rows.map(r => r.state),selected)}${select('bond-priority','Your state preference',['Primary','Secondary'],state.bondPriority)}${select('bond-evidence','Evidence status',[...new Set(research.rows.map(r => r.evidence_status))],state.bondEvidence)}<button type="button" id="bond-reset">Reset bond filters</button></div>
      <p role="status" id="bond-results">${shown.length} of ${research.rows.length} state / UT rows. Current prospectuses, older forms and unresolved terms are labelled separately. Continuous scrolling.</p>
      <p class="muted">The service amount below belongs only to the described course, quota and cohort. DNB/DrNB, direct six-year and in-service contracts need their own confirmation.</p>
      <div class="bond-table-wrap" tabindex="0" role="region" aria-label="Scrollable state bond comparison"><table><thead><tr><th>State / UT & evidence</th><th>Applies to</th><th>Service after completion</th><th>Service default liability</th><th>Separate course-exit terms</th><th>Exceptions, studies & sources</th></tr></thead><tbody>${shown.map(r => `<tr data-bond-state="${e(r.id)}"><th scope="row">${e(r.state)}<small>${e(r.priority)} preference</small><span class="bond-status">${e(r.evidence_status)}</span><small>${e(r.admission_cycle)}</small></th><td>${e(r.applicability)}</td><td>${e(r.service_requirement)}</td><td>${e(r.service_default_terms)}</td><td>${e(r.course_exit_terms)}</td><td><details class="bond-row-details"><summary>Check before choice locking</summary><p><strong>Exceptions / in-service:</strong> ${e(r.exceptions_and_in_service)}</p><p><strong>Higher studies:</strong> ${e(r.higher_studies)}</p><p><strong>Posting / release:</strong> ${e(r.posting_and_release)}</p>${r.source_ids.length ? sourceLinks(r.source_ids) : '<p>No current positive policy claim established. Obtain the applicable official rule.</p>'}</details></td></tr>`).join('')}</tbody></table></div>
      ${shown.length ? '' : '<p class="empty">No rows match these filters. Reset bond filters to see all states.</p>'}
      <details class="bond-method"><summary>Central / INI, private, DNB and Delhi college exceptions</summary>${research.institution_exceptions.map(item => `<article class="bond-exception"><h3>${e(item.institution_group)}</h3><p>${e(item.finding)}</p>${sourceLinks(item.source_ids)}</article>`).join('')}</details>
      <details class="bond-method"><summary>What to obtain in writing from each college</summary><ol>${research.checks.map(t => `<li>${e(t)}</li>`).join('')}</ol><p>The workbook includes a college confirmation tracker with the actual contract fields left blank for written verification.</p></details>
      <details class="bond-method"><summary>All ${research.sources.length} dated sources and limitations</summary>${sourceLinks(research.sources.map(s => s.id))}</details>
    </section>`;
  };
};
