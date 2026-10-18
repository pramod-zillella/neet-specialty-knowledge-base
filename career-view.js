/* Dated career-route evidence. Event handling and routing belong to app.js. */
window.createCareerView = ({data, state, esc, subjects}) => {
  const careers = data.careers || {};
  const branches = careers.branches || [];
  const sources = new Map((careers.sources || []).map(s => [s.id, s]));
  const e = value => esc(String(value ?? ''));
  const list = value => Array.isArray(value) ? value : value ? [value] : [];
  const text = value => list(value).filter(Boolean).join(' ');
  const subject = id => subjects instanceof Map ? subjects.get(id) : Array.isArray(subjects) ? subjects.find(s => s.id === id) : subjects?.[id];
  const name = id => subject(id)?.name || id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const integer = value => typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-IN') : 'Not established';
  const cash = value => typeof value === 'number' && Number.isFinite(value) ? 'INR ' + value.toLocaleString('en-IN', {maximumFractionDigits: 0}) : null;
  const safeUrl = url => /^https?:\/\//i.test(url || '') ? url : '#';
  const norm = value => String(value || '').toLowerCase().replace(/paediatric/g, 'pediatric').replace(/neuro\s+surgery/g, 'neurosurgery').replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
  const bullets = items => list(items).length ? `<ul>${list(items).map(item => `<li>${e(typeof item === 'string' ? item : item.text || item.note || item.description || '')}</li>`).join('')}</ul>` : '';
  const note = (title, body, tone = '') => `<aside class="career-note ${tone}"><strong>${e(title)}</strong><p>${e(body)}</p></aside>`;
  function refs(ids, title) {
    const unique = [...new Set(list(ids))];
    if (!unique.length) return '<p class="career-gap">No linked primary source establishes this item.</p>';
    return `<details class="career-evidence"><summary>${e(title || `Read ${unique.length === 1 ? 'the source' : unique.length + ' sources'}`)}</summary><div>${unique.map(id => {
      const s = sources.get(id);
      if (!s) return `<p class="career-gap">Source record unavailable: ${e(id)}.</p>`;
      return `<article class="career-source"><h5><a href="${e(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${e(s.title || id)}</a></h5><dl><div><dt>Publisher</dt><dd>${e(s.publisher || 'Not supplied')}</dd></div><div><dt>Published</dt><dd>${e(s.published || 'Undated in consulted copy')}</dd></div><div><dt>Retrieved</dt><dd>${e(s.retrieved || careers.as_of || 'Not supplied')}</dd></div><div><dt>Source type</dt><dd>${e(s.kind || 'Not supplied')}</dd></div><div><dt>Where to look</dt><dd>${e(s.locator || 'See original document')}</dd></div></dl>${s.evidence ? `<blockquote>${e(s.evidence)}</blockquote>` : ''}${s.limitations ? `<p class="career-source-limit"><strong>Limits:</strong> ${e(text(s.limitations))}</p>` : ''}</article>`;
    }).join('')}</div></details>`;
  }
  function heading(title, description) {
    return `<div class="career-section-head"><h3>${e(title)}</h3>${description ? `<p>${e(description)}</p>` : ''}</div>`;
  }
  function stats(b) {
    const s = b.seats || {};
    return `<div class="career-stats" aria-label="Verified post-PG NEET-SS options"><article><strong>${integer(s.destination_subject_count)}</strong><span>Destination specialties</span><small>Distinct subjects in the verified feeder list</small></article><article><strong>${integer(s.award_option_count)}</strong><span>Subject + award options</span><small>DM and DrNB count separately</small></article><article><strong>${integer(s.listed_seat_total)}</strong><span>Seats in the dated baseline</span><small>Shared with other eligible feeders</small></article></div>`;
  }
  function findRoute(b, course) {
    return (b.superspecialties || []).find(r => norm(r.name) === norm(course.name) && String(r.award || '').split(/[\/,]/).map(x => norm(x)).includes(norm(course.award)));
  }
  function routes(b) {
    const ss = b.superspecialties || [], fellowships = b.fellowships || [];
    return heading('Start with the work after MD / MS / DNB', b.overview)
      + `<div class="career-work-grid">${(b.after_md_ms || []).map(r => `<article class="career-card"><h4>${e(r.role)}</h4><p class="career-meta">${e(r.setting)}</p><p>${e(r.description)}</p>${refs(r.source_ids)}</article>`).join('')}</div>`
      + heading('Recognized superspecialty entry routes', 'A verified feeder is permission to apply under the cited rules. It does not establish an available seat, selection, procedure privileges or higher income.')
      + `<div class="career-route-list">${ss.map(r => `<article class="career-card"><div class="career-card-heading"><h4>${e(r.name)}</h4><span class="career-badge">${e(r.award)}</span></div><p class="career-eligibility">${e(r.eligibility_status)}</p><p>${e(r.eligibility_note)}</p><dl class="career-fields"><div><dt>Entry</dt><dd>${e(r.entry_route)}</dd></div><div><dt>Duration</dt><dd>${e(r.duration)}</dd></div></dl>${refs(r.source_ids)}</article>`).join('') || '<p class="career-empty">No directly eligible superspecialty route was established in the cited records.</p>'}</div>`
      + heading('FNB and named institutional fellowships', 'Compare the exact award, eligible qualification and hands-on training. FET/FNB and institutional skills programmes are separate from NEET-SS DM/MCh/DrNB.')
      + note('Check recognition for the job you want', 'The cited FNB notice distinguishes its qualification from recognised medical qualifications for teaching-faculty purposes. Verify the exact award and current rules before using a fellowship as an academic promotion plan.') + refs(['route-b-fnb-status'])
      + `<p class="career-count">${fellowships.length} sourced programme examples for this branch. This is a researched set of options, not a complete national directory or a list of open admissions.</p>`
      + `<div class="career-fellowships">${fellowships.map(r => `<details class="career-fellowship"><summary><span><strong>${e(r.name)}</strong><small>${e(r.provider)} &middot; ${e(r.award_type)} &middot; ${e(r.duration)}</small></span><span class="career-expand" aria-hidden="true">+</span></summary><div class="career-fellowship-body"><dl class="career-fields"><div><dt>Selection</dt><dd>${e(r.entry_route)}</dd></div><div><dt>Eligibility</dt><dd>${e(r.eligibility)}</dd></div><div><dt>Duration</dt><dd>${e(r.duration)}</dd></div></dl><p class="career-credential"><strong>Credential and limits:</strong> ${e(r.recognition_note)}</p>${refs(r.source_ids)}</div></details>`).join('') || '<p class="career-empty">No named fellowship was verified for this branch in the current research.</p>'}</div>`
      + ((b.other_routes || []).length ? heading('Other directions and credential boundaries') + `<div class="career-work-grid">${b.other_routes.map(r => `<article class="career-card"><h4>${e(r.name)}</h4><p>${e(r.description)}</p>${refs(r.source_ids)}</article>`).join('')}</div>` : '')
      + `<p class="career-next">See <button type="button" data-career-tab="seats">seats and eligible awards</button> alongside these route descriptions.</p>`;
  }
  function seats(b) {
    const s = b.seats || {}, m = careers.seat_methodology || {}, courses = s.verified_courses || [];
    const methodology = list(m.methodology), excluded = list(m.excluded);
    return heading('Seats for each eligible subject and award', `${m.cycle || 'NEET-SS 2025'} · ${m.matrix_label || 'Initial Round 1 matrices published March 2026'}`)
      + note('Admission cycle matters', `${m.session || 'Academic session 2025, with admissions during 2026.'} ${m.latest_cycle_note || 'A complete official NEET-SS 2026 bulletin and matrix was not established; 2026 counts are unavailable.'}`, 'career-note-amber')
      + stats(b)
      + `<p class="career-count">These are initial published capacity counts, not current vacancies or final allotments. Parent-branch totals overlap: the same destination seat may accept several feeder specialties. Do not add branch totals together.</p>`
      + `<div class="career-table-scroll" role="region" aria-label="Verified superspecialty seats by award; scroll horizontally if needed" tabindex="0"><table class="career-table career-seat-table"><caption>${e(name(b.subject_id))}: eligible routes in the ${e(m.matrix_date || '11 March 2026')} baseline</caption><thead><tr><th scope="col">Destination / award</th><th scope="col">Listed seats</th><th scope="col">Entry and duration</th><th scope="col">Evidence and limits</th></tr></thead><tbody>${courses.map(c => {
        const r = findRoute(b, c);
        return `<tr><th scope="row">${e(c.name)}<span class="career-badge">${e(c.award)}</span><small>${e(list(c.matrix_course_codes).join(', '))}</small></th><td class="career-number">${integer(c.seat_count)}${c.seat_count === null || c.seat_count === undefined ? '<small>Not located in baseline; not zero</small>' : `<small>${integer(c.listed_rows)} source rows</small>`}</td><td><p>${e(c.entry_route)}</p>${r ? `<p class="career-meta">${e(r.duration)}</p><details class="career-row-note"><summary>Exact feeder note</summary><p>${e(r.eligibility_note)}</p></details>` : '<p class="career-gap">Confirm duration in the current admitting prospectus.</p>'}</td><td>${bullets(c.notes)}${refs([...(c.feeder_source_ids || []), ...(c.seat_source_ids || []), ...(r?.source_ids || [])])}</td></tr>`;
      }).join('') || '<tr><td colspan="4">No course-level seat matrix was established. Missing data is not a zero-seat finding.</td></tr>'}</tbody></table></div>`
      + ((s.unverified_or_ineligible || []).length ? `<section class="career-boundaries"><h4>Do not infer these routes</h4>${s.unverified_or_ineligible.map(r => `<article><strong>${e(r.name)}</strong><p>${e(r.note)}</p>${refs(r.source_ids)}</article>`).join('')}</section>` : '')
      + ((s.notes || []).length ? `<div class="career-note">${bullets(s.notes)}</div>` : '')
      + `<details class="career-method"><summary>How these counts were assembled and what is excluded</summary>${m.matrix_date ? `<p><strong>Matrix date:</strong> ${e(m.matrix_date)}</p>` : ''}${methodology.length ? `<h4>Method</h4>${bullets(methodology)}` : ''}${excluded.length ? `<h4>Excluded from the totals</h4>${bullets(excluded)}` : ''}${m.counts?.all_source_totals_reconciled ? `<p>Extracted source totals reconcile with both published matrix totals.</p>` : ''}<p><a href="exports/ss-seat-rows.csv" download>Download all source rows with PDF page references</a></p></details>`;
  }
  function pay(r) {
    const low = cash(r.pay_low), high = cash(r.pay_high);
    if (!low && !high) return '<strong>Not disclosed</strong>';
    if(r.basis === 'Pay-matrix basic' && r.pay_high > r.pay_low) return `<strong>${e(low)} entry / minimum basic</strong><span>per month; allowances separate</span><small>Full published pay-matrix scale: ${e(low)} to ${e(high)}. The upper endpoint reflects progression; it is not a starting offer.</small>`;
    const range = low && high && r.pay_low !== r.pay_high ? `${low} – ${high}` : low || high;
    const label = r.period === 'year' ? 'per year' : r.period === 'month' ? 'per month' : r.period || 'period not supplied';
    let equivalent = '';
    if (r.period === 'year' && (low || high)) {
      const a = typeof r.pay_low === 'number' ? cash(r.pay_low / 12) : null;
      const z = typeof r.pay_high === 'number' ? cash(r.pay_high / 12) : null;
      equivalent = `<small>Monthly equivalent: ${e(a && z && r.pay_low !== r.pay_high ? `${a} – ${z}` : a || z)} (annual figure ÷ 12; not a monthly offer)</small>`;
    }
    return `<strong>${e(range)}</strong><span>${e(label)}</span>${equivalent}`;
  }
  function stipend() {
    const s = careers.stipend_reference;
    if (!s) return '';
    return `<details class="career-method career-stipend"><summary>Training stipend reference: DrNB and FNB</summary><p>${e(s.basis)}</p>${note('Training pay has a different purpose', 'These are the cited NBEMS basic floors and comparison rules. They are not consultant salaries, universal take-home amounts or proof of what a particular institution paid.')}
      <div class="career-table-scroll" role="region" aria-label="NBEMS training stipend by training year" tabindex="0"><table class="career-table"><caption>INR per month; higher applicable state / central comparisons may apply</caption><thead><tr><th scope="col">Programme</th><th scope="col">Year 1</th><th scope="col">Year 2</th><th scope="col">Year 3</th></tr></thead><tbody>${(s.programmes || []).map(p => `<tr><th scope="row">${e(p.name)}</th><td>${p.year_1 == null ? 'Not applicable / not supplied' : e(cash(p.year_1))}</td><td>${p.year_2 == null ? 'Not applicable / not supplied' : e(cash(p.year_2))}</td><td>${p.year_3 == null ? 'Not applicable / not supplied' : e(cash(p.year_3))}</td></tr>`).join('')}</tbody></table></div><h4>Application rules</h4>${bullets(s.application_rules)}<h4>What this does not establish</h4>${bullets(s.not_established)}${refs(s.source_ids)}</details>`;
  }
  function salary(b) {
    const records = (careers.salary_records || []).filter(r => list(r.subject_ids).some(id => id === '*' || id === b.subject_id));
    const sectors = [...new Set(records.map(r => r.sector).filter(Boolean))].sort();
    const tiers = [...new Set(records.map(r => r.tier).filter(Boolean))].sort();
    const rows = records.filter(r => (!state.careerSector || r.sector === state.careerSector) && (!state.careerTier || r.tier === state.careerTier));
    const filter = (id, label, values, selected, allLabel) => `<div><label for="${id}">${label}</label><select id="${id}"><option value="">${allLabel}</option>${[...new Set([...values, ...(selected && !values.includes(selected) ? [selected] : [])])].map(v => `<option value="${e(v)}" ${v === selected ? 'selected' : ''}>${e(v)}</option>`).join('')}</select></div>`;
    const employment=records.filter(r=>r.subject_ids[0]!=='*' && !/stipend/i.test(r.basis));
    const numeric=employment.filter(r=>typeof r.pay_low==='number');
    const coveredTiers=[...new Set(numeric.map(r=>r.tier))];
    return heading('Published pay evidence', 'Read the role, qualification, date and pay basis together. A government basic pay scale, a training stipend and a private advertisement describe different things.')
      + note('Evidence coverage for this branch', `${employment.length} branch-specific employment records; ${numeric.length} publish an amount. ${coveredTiers.length?'Numeric examples cover '+coveredTiers.join(', ')+'.':'No branch-specific numeric employment offer was verified.'} Training and shared stipend-policy rows are counted separately. This sample does not establish a full city-by-stage salary range.`, 'career-note-amber')
      + note('Use individual offers with their context', 'Government basic pay excludes allowances and deductions unless the source says otherwise. Private job advertisements are examples of asking offers, not representative specialty salary benchmarks or guarantees. No owner-profit or automatic superspecialty income uplift is inferred.', 'career-note-amber')
      + `<div class="career-filters">${filter('career-sector', 'Employment sector', sectors, state.careerSector || '', 'All sectors')}${filter('career-tier', 'City / market category', tiers, state.careerTier || '', 'All categories')}</div><p class="career-count" role="status">${rows.length} pay records match ${e(name(b.subject_id))} and the current filters. Shared recruitment records are included only when tagged for this branch or all branches.</p>`
      + `<div class="career-table-scroll" role="region" aria-label="Published pay records with exact employment context" tabindex="0"><table class="career-table career-salary-table"><caption>Dated role examples; compare the written terms before comparing amounts</caption><thead><tr><th scope="col">Role and employer</th><th scope="col">Location and sector</th><th scope="col">Stage and requirements</th><th scope="col">Published pay</th><th scope="col">Context and primary source</th></tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${e(r.role)}<small>${e(r.employer)}</small></th><td>${e(r.city || 'City not specified')}<small>${e(r.tier || 'Market category not assigned')}</small><small>${e(r.sector || 'Sector not specified')}</small></td><td><p>${e(r.career_stage || 'Stage not specified')}</p><p class="career-meta"><strong>Qualification:</strong> ${e(r.qualification || 'Not supplied')}</p><p class="career-meta"><strong>Experience:</strong> ${e(r.experience || 'Not supplied')}</p></td><td class="career-pay">${pay(r)}<small><strong>Basis:</strong> ${e(r.basis || 'Not established')}</small></td><td>${list(r.notes).length ? bullets(r.notes) : '<p class="career-gap">Read the full source terms.</p>'}${refs(r.source_ids)}</td></tr>`).join('') || '<tr><td colspan="5">No published pay record matches these filters. This is an evidence gap, not evidence of no jobs or zero salary. Choose All sectors and All categories to widen the view.</td></tr>'}</tbody></table></div>`
      + `<details class="career-method"><summary>How to interpret the salary evidence</summary>${bullets(careers.salary_methodology)}<p>City categories describe the record context; they do not establish a measured city premium. Annual figures divided by 12 remain arithmetic equivalents, not take-home monthly pay. Undisclosed amounts remain undisclosed.</p></details>`
      + stipend();
  }
  function shortlist(b) {
    const s = b.saturation || {};
    const guide=careers.decision_guide || {}, plan=guide.branches?.[b.subject_id];
    const routeIds = [...new Set([...(b.after_md_ms || []).flatMap(r => r.source_ids || []), ...(b.superspecialties || []).flatMap(r => r.source_ids || [])])];
    return heading('Is this work and training path a good fit?', 'Editorial decision prompts based on the sourced routes. These are questions to verify in your intended location, not personal recommendations or measured outcomes.')
      + (plan ? note('My shortlisting view · editorial interpretation',plan.positioning)
        + heading('Career stages and earning opportunities')
        + `<div class="career-stage-grid">${plan.career_stages.map(r=>`<article class="career-card"><h4>${e(r.stage)}</h4><p>${e(r.focus)}</p></article>`).join('')}</div><section class="career-shortlist-notes"><h4>What could distinguish your work</h4>${bullets(plan.earnings_levers)}<h4>Verify before choosing</h4>${bullets(plan.verify)}</section>` : '')
      + `<section class="career-market"><h4>What can be said about saturation?</h4><p class="career-market-verdict">${e(s.assessment || 'A representative saturation estimate was not established.')}</p><p>${e(s.evidence_limits || 'Training capacity and patient need do not by themselves establish funded jobs or practice income.')}</p><h4>Check the local market</h4>${bullets(s.practical_checks)}${refs(s.source_ids)}</section>`
      + heading('Compare the next career stage')
      + `<div class="career-stage-grid"><article class="career-card"><span class="career-stage-number">01</span><h4>Work after the broad specialty</h4><p>Compare the actual clinic, ward, operating or laboratory duties with your core training. Ask about supervision, hours, registration, privileges and a written offer. An MD/MS/DNB can be a career endpoint within its scope; the curriculum is not a vacancy guarantee.</p></article><article class="career-card"><span class="career-stage-number">02</span><h4>Commit to DM / MCh / DrNB</h4><p>Start with the exact feeder and award, then compare entrance preparation, training years, patient population, seat access and opportunity cost. An additional qualification alone does not establish an earnings premium.</p></article><article class="career-card"><span class="career-stage-number">03</span><h4>Choose a focused fellowship</h4><p>Name the skill gap it should fill. Verify personal case access, graded responsibility, trainer feedback, award recognition, stipend or fees and graduate destinations. A shorter certificate is not automatically equivalent to a recognized superspecialty.</p></article><article class="career-card"><span class="career-stage-number">04</span><h4>Consider independent practice</h4><p>Compare referral access, paying demand, staff, facilities and emergency backup in the intended catchment. Separate a hospital bill, a consultation receipt, salaried pay and net owner profit. Obtain real local costs before modelling a return.</p></article></div><p class="career-meta">These stage comparisons are editorial interpretation; the underlying work and eligibility documents are linked below.</p>${refs(routeIds, 'Inspect the branch work and entry evidence')}`
      + ((b.shortlist_notes || []).length ? `<section class="career-shortlist-notes"><h4>Keep these branch-specific points in view</h4>${bullets(b.shortlist_notes)}</section>` : '')
      + ((b.gaps || []).length ? `<section class="career-gaps"><h4>Evidence still to collect</h4>${bullets(b.gaps)}</section>` : '')
      + (guide.sections||[]).map(section=>`<details class="career-method"><summary>${e(section.title)}</summary>${bullets(section.points)}</details>`).join('')
      + `<div class="career-crosslinks"><a href="#overview/${e(b.subject_id)}">Read ${e(name(b.subject_id))} interview themes</a><a href="#conclusions/${e(b.subject_id)}/advice">Open the editorial shortlist</a></div>`;
  }
  return () => {
    if (!branches.length) return '<section class="careers-view"><h2>Career routes</h2><p>Career research has not been loaded.</p></section>';
    const b = branches.find(b => b.subject_id === state.careerBranch) || branches.find(b => b.subject_id === 'radiology') || branches[0];
    const tab = ['routes', 'seats', 'salary', 'shortlist'].includes(state.careerTab) ? state.careerTab : 'routes';
    return `<div class="careers-view"><p class="eyebrow">Work, further training and the evidence behind them</p><h2>Career routes and pay</h2><p class="career-intro">Compare what you can do after MD / MS / DNB, which higher courses accept your qualification, and what published seats and pay records actually establish.</p><div class="career-topbar"><div><label for="career-branch">Choose a branch</label><select id="career-branch">${branches.map(r => `<option value="${e(r.subject_id)}" ${r.subject_id === b.subject_id ? 'selected' : ''}>${e(name(r.subject_id))}</option>`).join('')}</select></div><p>Research checked ${e(careers.as_of || 'date not supplied')}<br><span>Programme eligibility, capacity and published pay are separate evidence.</span></p></div><nav class="career-tabs" aria-label="Career research sections">${[['routes', 'Work and training routes'], ['seats', 'NEET-SS seats'], ['salary', 'Salary and stipends'], ['shortlist', 'Shortlisting checks']].map(([id, title]) => `<button type="button" data-career-tab="${id}" aria-pressed="${tab === id}">${title}</button>`).join('')}</nav><section class="career-content" aria-label="${e(name(b.subject_id))} career research">${({routes, seats, salary, shortlist}[tab])(b)}</section><footer class="career-downloads"><strong>Take the evidence with you</strong><a href="exports/career-guide.md" download>Readable guide</a><a href="exports/career-routes.csv" download>Routes CSV</a><a href="exports/career-salaries.csv" download>Pay records CSV</a><a href="exports/ss-seat-rows.csv" download>Seat source rows CSV</a><a href="exports/career-research.json" download>Research JSON</a></footer></div>`;
  };
};
