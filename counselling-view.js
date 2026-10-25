/* Official-source snapshot. Personal choices/checks remain in this browser. */
window.createCounsellingView = ({esc, state, render}) => {
  const data = window.COUNSELLING_GUIDE;
  const e = value => esc(String(value ?? ''));
  const key = 'neet-counselling-planner-v1';
  const validStatus = ['unselected', 'float', 'freeze', 'allotted'];
  let personal = {status: 'unselected', scenario: 'upgrade', checked: []};
  let storageOK = true;
  try {
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    if (raw && validStatus.includes(raw.status) && data.scenarios.some(s => s.id === raw.scenario)) {
      personal = {status: raw.status, scenario: raw.scenario, checked: Array.isArray(raw.checked) ? raw.checked.filter(n => Number.isInteger(n) && n >= 0 && n < data.checklist.length) : []};
    }
  } catch { storageOK = false; }
  const sourceMap = new Map((data?.sources || []).map(s => [s.id, s]));
  const routeMap = new Map((data?.routes || []).map(r => [r.id, r]));
  let query = '', category = '', deadlineRoute = '', includePast = false;
  const save = () => {
    try { localStorage.setItem(key, JSON.stringify(personal)); } catch { storageOK = false; }
  };
  const sourceLinks = refs => `<span class="cg-citations">${refs.map(ref => {
    const s = sourceMap.get(ref.source);
    const base = s.file || s.url;
    const page = /^(\d+)/.exec(ref.pages || '')?.[1];
    return `<a href="${e(base + (page && s.file ? '#page=' + page : ''))}" target="_blank" rel="noopener noreferrer">${e(s.title)}${ref.pages ? ' · PDF p. ' + e(ref.pages) : ''}</a>`;
  }).join('')}</span>`;
  const money = amount => amount == null ? 'To confirm' : '₹' + Number(amount).toLocaleString('en-IN');
  const fmtDate = value => value ? new Intl.DateTimeFormat('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'}).format(new Date(value + 'T12:00:00+05:30')) : 'Not yet established';
  const istToday = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Kolkata', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date());
  const eventStatus = row => {
    if (!row.end) return {label: 'Await notice', className: 'pending'};
    const today = istToday();
    if (row.time_ist) {
      const deadline = new Date(row.end + 'T' + row.time_ist + ':00+05:30');
      if (Date.now() > deadline.getTime()) return {label: 'Deadline passed', className:'past'};
    } else if (row.end < today) return {label:'Window passed', className:'past'};
    if (row.start <= today) return {label: row.start === row.end ? 'Today' : 'In published window', className:'current'};
    return {label:'Upcoming', className:'upcoming'};
  };
  const pill = (label, cls = '') => `<span class="cg-pill ${e(cls)}">${e(label)}</span>`;
  const downloads = () => `<div class="cg-downloads"><a class="button" href="exports/counselling-2026/Counselling-rules-deadlines-fees-2026.xlsx" download>Download Excel guide</a><a class="button" href="exports/counselling-2026/deadlines.ics" download>Add dates to calendar</a><a href="exports/counselling-2026/README.md" download>Readable guide</a><button type="button" data-cg-print>Print this tab / save PDF</button></div><p class="cg-small">Calendar and downloads are snapshots. Calendar imports do not update when an authority changes its schedule.</p>`;
  function schedule(route = '') {
    let rows = data.deadlines.filter(row => (!route || row.route === route) && (!deadlineRoute || route || row.route === deadlineRoute));
    if (!includePast) rows = rows.filter(row => eventStatus(row).className !== 'past');
    rows = rows.slice().sort((a,b) => (a.end || '9999').localeCompare(b.end || '9999') || (a.time_ist || '').localeCompare(b.time_ist || ''));
    return `<section class="cg-section"><div class="cg-section-head"><div><p class="eyebrow">All deadlines in IST · ${e(data.cycle)}</p><h3>Dates to watch</h3></div><label class="cg-checkbox"><input type="checkbox" id="cg-past" ${includePast ? 'checked' : ''}> Include past dates</label></div>
      ${!route ? `<label for="cg-deadline-route">Counselling route</label><select id="cg-deadline-route"><option value="">All four routes</option>${data.routes.map(r => `<option value="${e(r.id)}" ${r.id === deadlineRoute ? 'selected' : ''}>${e(r.short)}</option>`).join('')}</select>` : ''}
      <div class="cg-table-scroll" tabindex="0" role="region" aria-label="Counselling deadlines, India Standard Time"><table class="cg-table cg-dates"><thead><tr><th scope="col">Deadline / window</th><th scope="col">Event</th><th scope="col">What to do</th></tr></thead><tbody>${rows.map(row => {
        const status = eventStatus(row);
        return `<tr data-cg-event="${e(row.id)}"><td>${pill(status.label,status.className)}<strong>${e(fmtDate(row.end))}</strong>${row.start && row.start !== row.end ? `<small>Opens ${e(fmtDate(row.start))}</small>` : ''}${row.time_ist ? `<span class="cg-time">${e(row.time_ist)} IST</span>` : row.end ? '<small>No exact cut-off time specified here</small>' : ''}${row.tentative ? '<small>MCC tentative schedule</small>' : ''}</td><th scope="row"><span class="cg-route-label">${e(routeMap.get(row.route).short)}</span>${e(row.title)}</th><td>${e(row.note)}${row.previous ? `<small class="cg-replaced">Superseded: ${e(row.previous)}</small>` : ''}${sourceLinks(row.refs)}</td></tr>`;
      }).join('') || '<tr><td colspan="3">No dates match this selection.</td></tr>'}</tbody></table></div>
      <p class="cg-small">Status reflects the published dates against your current clock in India time, not a live portal check. National state-coordination dates do not replace KNRUHS or Rajasthan’s own phase notices.</p></section>`;
  }
  function seatTable(route = '') {
    const rows = data.seats.filter(r => !route || r.route === route);
    return `<section class="cg-section"><h3>How the seats are divided</h3><p class="cg-small">Percentages describe a pool, not a current branch seat count. Horizontal reservations operate within seats; they do not add extra seats.</p><div class="cg-seat-grid">${rows.map(row => `<article><p class="cg-route-label">${e(routeMap.get(row.route).short)}</p><h4>${e(row.pool)}</h4><p class="cg-seat-split">${e(row.split)}</p><p>${e(row.implication)}</p>${sourceLinks(row.refs)}</article>`).join('')}</div></section>`;
  }
  function finance(route = '') {
    const rows = data.money.filter(r => (!route || r.route === route) && !r.name.startsWith('MGMC Jaipur'));
    const table = rows => `<div class="cg-table-scroll" tabindex="0" role="region" aria-label="Fees, deposits and their different refund rules"><table class="cg-table"><thead><tr><th>Payment</th><th>Amount / basis</th><th>When and what it means</th></tr></thead><tbody>${rows.map(row => `<tr><th scope="row"><span class="cg-route-label">${e(routeMap.get(row.route).short)}</span>${e(row.name)}</th><td><strong>${e(money(row.amount_inr))}</strong><small>${e(row.type)}</small>${row.status !== 'Verified current' ? pill(row.status,'pending') : ''}</td><td><b>${e(row.timing)}</b><p>${e(row.note)}</p>${sourceLinks(row.refs)}</td></tr>`).join('')}</tbody></table></div>`;
    return `<section class="cg-section"><h3>Keep the payments separate</h3><p>An application fee, refundable security, university fee, annual tuition and course-exit bond have different rules. One payment does not cover another authority’s liability.</p>${table(rows)}${!route || route === 'raj' ? `<details class="cg-details"><summary>MGMC Jaipur: verified 2026 annual fees and hostel examples</summary><p>From the Board’s private-college disclosure. AI-nature tuition is for the Rajasthan-administered open-private route; seat availability and eligibility still need the current matrix.</p>${table(data.money.filter(r => r.name.startsWith('MGMC Jaipur')))}</details>` : ''}</section>`;
  }
  function riskTable(route = '') {
    return `<section class="cg-section"><h3>Round-by-round exit and deposit risk</h3><div class="cg-callout danger"><strong>A deposit is not the maximum possible loss.</strong><p>Joined-course tuition, discontinuation penalties, stipend recovery and service bonds can apply separately. An exit must also be permitted under that authority’s current notice.</p></div><div class="cg-table-scroll" tabindex="0" role="region" aria-label="Round-wise withdrawal and security risk"><table class="cg-table"><thead><tr><th>Route / round</th><th>If allotted but not joined</th><th>If already joined / retained</th><th>What happens next</th></tr></thead><tbody>${data.rounds.filter(row => !route || row.route === route).map(row => `<tr><th scope="row"><span class="cg-route-label">${e(routeMap.get(row.route).short)}</span>${e(row.round)}</th><td>${e(row.nonjoin)}</td><td>${e(row.joined)}</td><td>${e(row.next)}${sourceLinks(row.refs)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function rules(route) {
    const all = data.rules.filter(row => row.route === route);
    const categories = [...new Set(all.map(row => row.category))];
    const q = query.toLocaleLowerCase();
    const shown = all.filter(row => (!category || row.category === category) && (!q || (row.title+' '+row.text+' '+row.category).toLocaleLowerCase().includes(q)));
    return `<section class="cg-section"><h3>Important rules, with the source beside them</h3><div class="cg-filter-grid"><div><label for="cg-rule-search">Find a rule</label><input type="search" id="cg-rule-search" value="${e(query)}" placeholder="Try Float, women, NRI, penalty…"></div><div><label for="cg-rule-category">Topic</label><select id="cg-rule-category"><option value="">All rule topics</option>${categories.map(v => `<option ${v===category ? 'selected' : ''}>${e(v)}</option>`).join('')}</select></div></div><p class="cg-small" role="status">${shown.length} of ${all.length} reviewed rules</p><div class="cg-rule-list">${shown.map(row => `<article class="cg-rule ${row.level === 'critical' ? 'cg-important' : ''}" data-cg-rule="${e(row.id)}"><div>${pill(row.category)}${row.level === 'critical' ? pill('Decision warning','warning') : ''}</div><h4>${e(row.title)}</h4><p>${e(row.text)}</p>${row.status !== 'Verified current rule' ? `<p class="cg-small"><strong>${e(row.status)}</strong></p>` : ''}${sourceLinks(row.refs)}</article>`).join('') || '<p>No rules match. Clear the search or change the topic.</p>'}</div></section>`;
  }
  function planner() {
    const scenario = data.scenarios.find(s => s.id === personal.scenario) || data.scenarios[0];
    const statusLabels = {unselected:'Choose your status',float:'Joined Round 1 — Float / upgrade',freeze:'Joined Round 1 — Freeze',allotted:'Allotted Round 1 — not joined yet'};
    return `<section class="cg-section cg-planner"><p class="eyebrow">Your decision guide</p><h3>I have an MCC Round 1 allotment. What now?</h3><p>Choose the situation to see the sequence and the points that need confirmation. Personal selections and checklist ticks stay in this browser.</p><div class="cg-filter-grid"><div><label for="cg-status">My current MCC status</label><select id="cg-status">${validStatus.map(id => `<option value="${id}" ${personal.status===id?'selected':''}>${e(statusLabels[id])}</option>`).join('')}</select></div><div><label for="cg-scenario">What I am considering</label><select id="cg-scenario">${data.scenarios.map(s => `<option value="${e(s.id)}" ${s.id===personal.scenario?'selected':''}>${e(s.title)}</option>`).join('')}</select></div></div>
      ${personal.status === 'unselected' ? '<div class="cg-callout"><strong>Select your current status before relying on the sequence.</strong><p>The steps below explain the selected scenario; they do not verify your portal record or eligibility.</p></div>' : personal.status === 'allotted' ? '<div class="cg-callout warning"><strong>You have not joined yet.</strong><p>To retain the seat for upgrading, complete the 2026 Float online joining and institute verification within the reporting window. Free exit without joining gives up the Round 1 seat.</p></div>' : personal.status === 'freeze' ? '<div class="cg-callout warning"><strong>You selected Freeze.</strong><p>Float-only steps below do not automatically apply. Freeze joining and resignation require physical institute formalities; confirm whether any requested change to willingness is allowed.</p></div>' : '<div class="cg-callout"><strong>Joined with Float: confirm the institute has approved it.</strong><p>Check provisional admission, uploaded-document approval and upgrade willingness. A submitted Float option with unresolved verification is not the same as a confirmed joined seat.</p></div>'}
      <article class="cg-scenario"><p class="cg-route-label">${e(scenario.risk)}</p><h4>${e(scenario.title)}</h4><ol>${scenario.steps.map(s => `<li>${e(s)}</li>`).join('')}</ol><div class="cg-callout"><strong>Money and deposit consequence</strong><p>${e(scenario.money)}</p></div><div class="cg-callout warning"><strong>Confirm before acting</strong><p>${e(scenario.gap)}</p></div>${sourceLinks(scenario.refs)}</article>
      <details class="cg-details"><summary>My reporting and payment checklist · ${personal.checked.length}/${data.checklist.length}</summary><div class="cg-checklist">${data.checklist.map((text,i) => `<label><input type="checkbox" data-cg-check="${i}" ${personal.checked.includes(i)?'checked':''}><span>${e(text)}</span></label>`).join('')}</div></details><p class="cg-small" role="status">${storageOK ? 'Saved only in this browser. Checklist and status are not included in public downloads.' : 'Browser storage is unavailable. Changes last only for this page session.'}</p></section>`;
  }
  function changes() {
    return `<section class="cg-section"><h3>What changed, and what is simply being carried forward</h3><div class="cg-rule-list">${data.changes.map(row => `<article class="cg-rule"><h4>${e(row.title)}</h4><p>${e(row.text)}</p>${sourceLinks(row.refs)}</article>`).join('')}</div><p class="cg-small">This is a verified current-rule guide with selected documented changes, not an exhaustive legal comparison of every prior-year amendment.</p></section>`;
  }
  function sources() {
    return `<details class="cg-details cg-section"><summary>Official documents, source dates and known gaps</summary><div class="cg-callout warning"><strong>Still needs an official answer</strong><ul>${data.gaps.map(g=>`<li>${e(g)}</li>`).join('')}</ul></div><div class="cg-source-list">${data.sources.map(s => `<article><h4><a href="${e(s.url)}" target="_blank" rel="noopener noreferrer">${e(s.title)}</a></h4><p>${e(s.kind)} · ${e(s.year)} · checked ${e(s.checked)}${s.pages ? ' · '+s.pages+' PDF pages' : ''}</p>${s.file ? `<a href="${e(s.file)}" target="_blank" rel="noopener noreferrer">Open saved official PDF</a>` : ''}</article>`).join('')}</div><p class="cg-small">PDF citations use the file’s PDF page number. Saved documents preserve the checked version; live notices may supersede them. Candidate lists and personal receipts are not included.</p></details>`;
  }
  function overview() {
    return `<div class="cg-callout cg-start"><p class="eyebrow">Start here</p><h3>Your MCC Float seat can be a fallback while you explore</h3><p>Keep its online joining and document verification complete. Register separately for each state route, compare only seats you are eligible for, and check the resignation window before changing authorities.</p><a class="button primary" href="#counselling/scenario">Open my MCC Round 1 scenarios →</a></div><div class="cg-route-grid">${data.routes.map(r => `<a class="cg-route-card" href="#counselling/${r.id}"><span>${e(r.authority)}</span><h3>${e(r.short)}</h3><p class="cg-card-status">${e(r.headline)}</p><p>${e(r.summary)}</p><b>Open rules, fees and dates →</b></a>`).join('')}</div>${schedule()}${riskTable()}${seatTable()}<details class="cg-details"><summary>Compare application fees, security, tuition and university fees</summary>${finance()}</details>${changes()}`;
  }
  document.addEventListener('change', event => {
    const target = event.target;
    if (target.id === 'cg-status') { personal.status = validStatus.includes(target.value)?target.value:'unselected'; save(); render(); }
    if (target.id === 'cg-scenario') { if(data.scenarios.some(s=>s.id===target.value))personal.scenario=target.value; save(); render(); }
    if (target.id === 'cg-past') { includePast=target.checked; render(); }
    if (target.id === 'cg-deadline-route') { deadlineRoute=target.value; render(); }
    if (target.id === 'cg-rule-category') { category=target.value; render(); }
    if (target.matches('[data-cg-check]')) {
      const id=Number(target.dataset.cgCheck);
      personal.checked=personal.checked.filter(n=>n!==id); if(target.checked)personal.checked.push(id); save();
      const summary=target.closest('details')?.querySelector('summary');if(summary)summary.textContent=`My reporting and payment checklist · ${personal.checked.length}/${data.checklist.length}`;
    }
  });
  document.addEventListener('input', event => {
    if (event.target.id !== 'cg-rule-search') return;
    query=event.target.value;const start=event.target.selectionStart;render();
    const el=document.getElementById('cg-rule-search');if(el){el.focus();el.setSelectionRange(start,start);}
  });
  document.addEventListener('click', event => {
    if(event.target.closest('[data-cg-print]'))window.print();
    if(event.target.closest('.cg-tabs a')){query='';category='';}
  });
  return () => {
    if (!data) return '<h2>Counselling guide unavailable</h2>';
    const tab=state.counsellingTab||'overview';const route=routeMap.get(tab);
    const daysOld=Math.max(0,Math.floor((new Date(istToday()+'T12:00:00+05:30')-new Date(data.as_of+'T12:00:00+05:30'))/86400000));
    return `<section class="counselling-view"><header class="cg-header"><p class="eyebrow">Four routes · one place to check · academic year ${e(data.cycle)}</p><h2>Counselling, clearly.</h2><p>Deadlines, eligibility, fees and the decisions that can cost a seat or deposit.</p><div class="cg-snapshot">${pill('Checked 25 October 2026')}${pill('All times IST')}${pill('Static snapshot','pending')}${daysOld>0?pill(daysOld+' days since source check','warning'):''}</div><p class="cg-small">Recheck official notices before acting. Status badges follow the saved dates; this site does not monitor portals automatically.</p></header>
      <nav class="cg-tabs" aria-label="Counselling guide sections">${[['overview','At a glance'],...data.routes.map(r=>[r.id,r.short]),['scenario','My MCC scenarios']].map(([id,label])=>`<a href="#counselling/${id}" ${id===tab?'aria-current="page"':''}>${e(label)}</a>`).join('')}</nav>
      ${downloads()}${route ? `<section class="cg-route-intro"><p class="eyebrow">${e(route.authority)}</p><h3>${e(route.name)}</h3><p class="cg-card-status">${e(route.headline)} · checked ${e(data.as_of)}</p><p>${e(route.summary)}</p><div class="cg-downloads"><a class="button" href="${e(route.application)}" target="_blank" rel="noopener noreferrer">Official counselling portal ↗</a><a href="${e(route.portal)}" target="_blank" rel="noopener noreferrer">Check latest notices</a></div><ul class="cg-critical-list">${route.critical.map(s=>`<li>${e(s)}</li>`).join('')}</ul><div class="cg-jump"><a href="#counselling/scenario">Switching from an MCC seat? Open the decision guide →</a></div></section>${schedule(route.id)}${riskTable(route.id)}${seatTable(route.id)}${finance(route.id)}${rules(route.id)}` : tab==='scenario' ? planner() : overview()}${sources()}</section>`;
  };
};
