/* Source-reported department experiences. Per-department n remains unknown. */
'use strict';
window.createResidentExperienceView = function ({esc}) {
  const data = window.RESIDENT_EXPERIENCE;
  const filters = {priority:'', state:'', institution:'', specialty:'', program:'', verdict:'', hours:'', query:'', sort:'institution'};
  let tab = 'ratings', timer;
  const e = esc;
  const unique = values => [...new Set(values)].sort((a,b) => a.localeCompare(b));
  const link = (url,label,download=false) => `<a href="${e(url)}" ${download?'download':'target="_blank" rel="noopener noreferrer"'}>${e(label)}</a>`;
  const label = {Environment:'Environment',Hands_on:'Hands-on',Academics:'Academics',Faculty:'Faculty',Senior_resident:'Senior experience',Work_life:'Work-life',Mental_health:'Mental health',Stipend_on_time:'Stipend on time',Safety:'Safety'};
  const number = value => value === null ? '<span class="rx-unknown">Not reported</span>' : value.toFixed(1);
  const percent = value => value === null ? '<span class="rx-unknown">Not reported</span>' : Math.round(value*100)+'%';

  function matching() {
    const query = filters.query.toLocaleLowerCase().trim();
    return data.ratings.filter(r => (!filters.priority || r.State_preference===filters.priority)
      && (!filters.state || r.State===filters.state) && (!filters.institution || r.Institution_ID===filters.institution)
      && (!filters.specialty || r.Specialty===filters.specialty) && (!filters.program || r.Program_label===filters.program)
      && (!filters.verdict || r.Published_verdict===filters.verdict)
      && (!filters.hours || (filters.hours==='estimated' ? r.Duty_hours_estimated : !r.Duty_hours_estimated && r.JR1_duty_hours_band!=='Not reported'))
      && (!query || [r.Institution,r.State,r.Department_as_printed].join(' ').toLocaleLowerCase().includes(query)));
  }
  function select(key,title,options) {
    return `<div><label for="rx-${key}">${e(title)}</label><select id="rx-${key}" data-rx-filter="${key}"><option value="">All</option>${options.map(option => {
      const [value,text] = Array.isArray(option) ? option : [option,option];
      return `<option value="${e(value)}" ${filters[key]===value?'selected':''}>${e(text)}</option>`;
    }).join('')}</select></div>`;
  }
  function controls() {
    const institutions = data.institutions.filter(r => (!filters.state || r.State===filters.state) && (!filters.priority || r.State_preference===filters.priority));
    return `<div class="rx-filters">
      <div class="rx-search"><label for="rx-query">Search institution, city or branch</label><input id="rx-query" type="search" placeholder="Try Manipal, ENT or Hyderabad" value="${e(filters.query)}"></div>
      ${select('priority','Your state preference',['Primary','Secondary','Other'])}
      ${select('state','State / UT',unique(data.ratings.filter(r=>!filters.priority||r.State_preference===filters.priority).map(r=>r.State)))}
      ${select('institution','Institution',institutions.map(r=>[r.Institution_ID,r.Institution_as_printed]))}
      ${select('specialty','Specialty',unique(data.ratings.map(r=>r.Specialty)))}
      ${select('program','Program label',unique(data.ratings.map(r=>r.Program_label)))}
      ${select('verdict','Published verdict',['Very healthy','Healthy','Mixed','Concerning','High','Severe'])}
      ${select('hours','Duty-hours source',[['department','Department-reported hours'],['estimated','Estimated hours only']])}
      <div><label for="rx-sort">Order results</label><select id="rx-sort" data-rx-filter="sort">${[['institution','State and institution'],['specialty','Specialty'],['score-asc','Published score: low to high'],['score-desc','Published score: high to low']].map(([value,text])=>`<option value="${value}" ${filters.sort===value?'selected':''}>${text}</option>`).join('')}</select></div>
      <button type="button" data-rx-reset>Reset filters</button></div>`;
  }
  function sorted(rows) {
    return [...rows].sort((a,b) => {
      if(filters.sort==='score-asc')return a.Published_score-b.Published_score || a.Institution.localeCompare(b.Institution);
      if(filters.sort==='score-desc')return b.Published_score-a.Published_score || a.Institution.localeCompare(b.Institution);
      if(filters.sort==='specialty')return a.Specialty.localeCompare(b.Specialty) || a.Institution.localeCompare(b.Institution);
      return a.State.localeCompare(b.State) || a.Institution.localeCompare(b.Institution) || a.Specialty.localeCompare(b.Specialty);
    });
  }
  function ratingTable(rows) {
    return `<div class="rx-table-wrap" tabindex="0" role="region" aria-label="Department ratings, scroll vertically and horizontally"><table class="rx-table"><caption>Published resident aggregates. Higher index score is worse; higher domain ratings are better. Department sample sizes are not disclosed. All matching rows appear in one continuous table.</caption><thead><tr><th scope="col">State / institution</th><th scope="col">Specialty / program</th><th scope="col">Published score<br>Higher = worse</th><th scope="col">Recommend</th><th scope="col">Stipend band</th><th scope="col">JR1 duty hours</th>${data.domains.map(k=>`<th scope="col">${e(label[k])}<br><small>Higher = better</small></th>`).join('')}<th scope="col">Source</th></tr></thead><tbody>${sorted(rows).map(r=>`<tr data-rx-row="${e(r.Institution_ID)}"><td><small>${e(r.State)}</small><strong>${e(r.Institution)}</strong></td><td><strong>${e(r.Specialty)}</strong><small>${e(r.Program_label)}</small>${r.Missing_domains?'<span class="rx-flag">Missing domain rating</span>':''}${r.Program_label.includes(',')?'<span class="rx-flag">Combined program aggregate</span>':''}</td><td><strong>${r.Published_score.toFixed(1)}</strong><small>${e(r.Published_verdict)}</small></td><td>${percent(r.Recommend_pct)}</td><td>${e(r.Stipend_band_as_printed)}</td><td>${e(r.JR1_duty_hours_band)}<small class="${r.Duty_hours_estimated?'rx-estimated':''}">${r.JR1_duty_hours_band==='Not reported'?'':r.Duty_hours_estimated?'Estimated from another report':'Department-reported'}</small></td>${data.domains.map(k=>`<td class="rx-domain ${r[k]!==null&&r[k]<=3?'rx-domain-low':''}">${number(r[k])}</td>`).join('')}<td>${link(data.downloads.source+'#page='+r.PDF_page,'PDF p. '+r.PDF_page)}<small>Printed p. ${r.Printed_page}</small></td></tr>`).join('')}</tbody></table></div>`;
  }
  function institutionTable(rows) {
    const groups = new Map();
    for(const row of rows){if(!groups.has(row.Institution_ID))groups.set(row.Institution_ID,[]);groups.get(row.Institution_ID).push(row);}
    return `<div class="rx-table-wrap" tabindex="0" role="region" aria-label="Institution directory, continuous scrolling"><table class="rx-table rx-directory"><caption>Institutions named in this PDF. Counts describe listed department aggregates, not response counts. Specialty and program details reflect the current filters.</caption><thead><tr><th scope="col">State</th><th scope="col">Institution</th><th scope="col">Listed department rows<br>Matching / total</th><th scope="col">Matching specialties / programs</th><th scope="col">Source</th></tr></thead><tbody>${data.institutions.filter(i=>groups.has(i.Institution_ID)).map(i=>{
      const matched=groups.get(i.Institution_ID);
      return `<tr data-rx-institution="${e(i.Institution_ID)}"><td>${e(i.State)}<small>${e(i.State_preference)} preference</small></td><td><strong>${e(i.Institution_as_printed)}</strong>${i.Campus_unclear_as_printed?'<span class="rx-flag">Campus unclear in source</span>':''}</td><td>${matched.length} / ${i.Departments_listed}</td><td>${unique(matched.map(r=>r.Specialty)).map(e).join(', ')}<small>${unique(matched.map(r=>r.Program_label)).map(e).join(', ')}</small></td><td>${link(data.downloads.source+'#page='+i.First_PDF_page,'PDF p. '+i.First_PDF_page)}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  function refresh() {
    if(!document.getElementById('rx-results'))return;
    const rows=matching(), count=new Set(rows.map(r=>r.Institution_ID)).size;
    document.getElementById('rx-count').textContent=`${rows.length.toLocaleString()} of 1,748 department rows · ${count.toLocaleString()} of 662 institutions`;
    document.getElementById('rx-results').innerHTML=rows.length ? tab==='institutions'?institutionTable(rows):ratingTable(rows) : '<p class="empty">No entries match these filters. Reset filters or broaden your search.</p>';
  }
  function assessment() {
    return `<section class="rx-assessment"><h3>How much confidence should you place in this index?</h3><p>The questions cover useful aspects of resident experience. The supplied report supports an arithmetic check; it does not establish a validated toxicity measure or representative department rankings.</p>
      <div class="rx-findings"><article><strong>1,710 complete rows checked</strong><p>All reproduce the score within displayed rounding. Thirty-eight rows lack at least one domain rating.</p></article><article><strong>Department n is unknown</strong><p>The report says most departments have one or two responses. A 100% recommendation could reflect one person.</p></article><article><strong>Safety can be diluted</strong><p>Safety carries 5% weight. Inspect safety and mental health directly, even when the overall score is low.</p></article><article><strong>577 estimated-hours rows</strong><p>One-third of duty-hour entries use another department or specialty report. The hours-source filter keeps these separate.</p></article></div>
      ${data.metrics_review.map(r=>`<details class="rx-review"><summary>${e(r.Metric_or_issue)} — ${e(r.Assessment)}</summary><p>${e(r.Evidence_or_reason)}</p><p><strong>For your shortlist:</strong> ${e(r.Practical_implication)}</p><p class="muted">${e(r.Basis)}</p></details>`).join('')}
      <h3>Reddit discussion: access and credibility</h3><p><strong>No specific thread or comment was verified.</strong> Reddit blocked public access, and search results were unusable on 20 October 2026. The following links are search routes, not reviewed thread evidence.</p><ul>${data.reddit_searches.map(r=>`<li>${link(r.URL,r.Topic)}<br><span class="muted">${e(r.Finding)}</span></li>`).join('')}</ul>
      <p>For a future thread, check the exact department and campus, firsthand role, PG year, dates, specific roster or training details, and independent corroboration. Upvotes do not verify a claim. A general residency anecdote does not validate or refute this exact index.</p>
      <p>Speak separately with current residents in several years and recent alumni. Ask current women residents about night transport, accommodation, reporting support and retaliation concerns, and ask about local-language support for a Telugu/Hindi/English speaker.</p>
      <p class="muted">Source revised cutoff: ${e(data.source_cutoff)}. The original file also retains older headline totals. The extracted table matches the revised 662 institutions / 1,748 departments / 30 states and UTs. Institution names and recognition have not been independently verified.</p></section>`;
  }
  function content() {
    return tab==='assessment' ? assessment() : `${controls()}<p id="rx-count" class="rx-count" role="status"></p><p class="muted rx-scroll-note">Scroll continuously through the table; scroll sideways for all nine domains. Low domain ratings of 3/10 or below are highlighted as a reading aid, not a validated threshold.</p><div id="rx-results"></div>`;
  }
  document.addEventListener('change',event=>{
    const key=event.target.dataset.rxFilter;
    if(!key)return;
    filters[key]=event.target.value;
    if(key==='priority'){filters.state='';filters.institution='';}
    if(key==='state')filters.institution='';
    if(key==='priority'||key==='state'){
      document.getElementById('rx-body').innerHTML=content();
    }
    refresh();
  });
  document.addEventListener('input',event=>{
    if(event.target.id!=='rx-query')return;
    filters.query=event.target.value;
    clearTimeout(timer);timer=setTimeout(refresh,180);
  });
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-rx-tab],[data-rx-reset]');
    if(!button)return;
    if(button.hasAttribute('data-rx-reset')){for(const key of Object.keys(filters))filters[key]=key==='sort'?'institution':'';}
    else {tab=button.dataset.rxTab;document.querySelectorAll('[data-rx-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.rxTab===tab)));}
    clearTimeout(timer);
    document.getElementById('rx-body').innerHTML=content();refresh();
  });
  return function renderResidentExperience() {
    if(!data)return '<p class="empty">Resident experience data did not load. Reload the page or download the workbook from the site exports.</p>';
    requestAnimationFrame(refresh);
    return `<section class="resident-experience-view"><p class="eyebrow">Resident-reported department experiences</p><h2>Resident experience</h2><p class="rx-intro">Explore 1,748 department ratings across 662 institutions in 30 states and UTs. Source: ${e(data.publisher)} · revised data through ${e(data.source_cutoff)}.</p>
      <aside class="rx-warning"><strong>Use this to guide resident conversations.</strong> Department sample sizes are not disclosed; the source says most have one or two responses. Published verdicts are survey labels, not verified safety findings. Compare the individual domains and current resident accounts before shortlisting.</aside>
      <div class="actions rx-downloads">${link(data.downloads.excel,'Download filterable Excel',true)}${link(data.downloads.institutions,'Institution list CSV',true)}${link(data.downloads.ratings,'All ratings CSV',true)}${link(data.downloads.pack,'Complete research pack',true)}${link(data.downloads.source,'Original PDF')}</div>
      <div class="rx-tabs" role="group" aria-label="Resident experience sections">${[['ratings','Department ratings'],['institutions','Institution directory'],['assessment','Metrics & credibility']].map(([value,title])=>`<button type="button" data-rx-tab="${value}" aria-pressed="${tab===value}">${title}</button>`).join('')}</div>
      <div id="rx-body">${content()}</div></section>`;
  };
};
