/* Source-reported department experiences. Per-department n remains unknown. */
'use strict';
window.createResidentExperienceView = function ({esc}) {
  const data = window.RESIDENT_EXPERIENCE;
  const filters = {priority:'', state:'', institution:'', specialty:'', program:'', verdict:'', hours:'', stipend:'', dutyBand:'', completeness:'', query:''};
  const sortOrders = {ratings:'state-asc', institutions:'state-asc'};
  let tab = 'ratings', timer, advancedOpen = false;
  const e = esc;
  const unique = values => [...new Set(values)].sort((a,b) => a.localeCompare(b));
  const link = (url,label,download=false) => `<a href="${e(url)}" ${download?'download':'target="_blank" rel="noopener noreferrer"'}>${e(label)}</a>`;
  const label = {Environment:'Environment',Hands_on:'Hands-on',Academics:'Academics',Faculty:'Faculty',Senior_resident:'Senior experience',Work_life:'Work-life',Mental_health:'Mental health',Stipend_on_time:'Stipend on time',Safety:'Safety'};
  const collator = new Intl.Collator(undefined, {numeric:true, sensitivity:'base'});
  const stipendBands = ['Under Rs 40k','Rs 40-60k','Rs 60-80k','Over Rs 80k'];
  const dutyBands = ['Under 14 hrs','14-16 hrs','16-18 hrs','Over 18 hrs'];
  const rangeMetrics = [{key:'Published_score',title:'Published score',max:100,step:0.1},
    {key:'Recommend_pct',title:'Recommend (%)',max:100,step:1},
    ...(data?.domains || []).map(key=>({key,title:label[key],max:10,step:0.1}))];
  const ranges = Object.fromEntries(rangeMetrics.map(({key})=>[key,{min:'',max:''}]));
  const ratingSorts = [
    {key:'state',title:'State / institution',get:r=>r.State},
    {key:'institution',title:'Institution',get:r=>r.Institution},
    {key:'specialty',title:'Specialty',get:r=>r.Specialty},
    {key:'program',title:'Program label',get:r=>r.Program_label},
    {key:'score',title:'Published score (higher = worse)',get:r=>r.Published_score,numeric:true},
    {key:'recommend',title:'Recommend (%)',get:r=>r.Recommend_pct,numeric:true},
    {key:'stipend',title:'Stipend band',get:r=>bandRank(stipendBands,r.Stipend_band_as_printed),numeric:true},
    {key:'duty',title:'JR1 duty-hours band',get:r=>bandRank(dutyBands,r.JR1_duty_hours_band),numeric:true},
    ...(data?.domains || []).map(key=>({key,title:label[key]+' (higher = better)',get:r=>r[key],numeric:true})),
    {key:'source',title:'Source PDF page',get:r=>r.PDF_page,numeric:true}];
  const directorySorts = [
    {key:'state',title:'State',get:r=>r.State},
    {key:'institution',title:'Institution',get:r=>r.Institution_as_printed},
    {key:'departments',title:'Matching department rows',get:r=>r.matched.length,numeric:true},
    {key:'specialty',title:'Matching specialties',get:r=>unique(r.matched.map(x=>x.Specialty)).join(', ')},
    {key:'source',title:'Source PDF page',get:r=>r.First_PDF_page,numeric:true}];
  const number = value => value === null ? '<span class="rx-unknown">Not reported</span>' : value.toFixed(1);
  const percent = value => value === null ? '<span class="rx-unknown">Not reported</span>' : Math.round(value*100)+'%';

  function bandRank(bands,value) {const index=bands.indexOf(value);return index<0?null:index;}
  function sortDefinitions() {return tab==='institutions'?directorySorts:ratingSorts;}
  function sortSelection() {
    const value=sortOrders[tab], direction=value.endsWith('-desc')?'desc':'asc';
    return {key:value.slice(0,-direction.length-1),direction};
  }
  function rangeValue(row,key) {return key==='Recommend_pct'&&row[key]!==null?row[key]*100:row[key];}
  function rangeCount() {return Object.values(ranges).filter(r=>r.min!==''||r.max!=='').length;}
  function rangeError() {
    for(const metric of rangeMetrics){
      const bound=ranges[metric.key];
      for(const edge of ['min','max'])if(bound[edge]!==''&&(!Number.isFinite(Number(bound[edge]))||Number(bound[edge])<0||Number(bound[edge])>metric.max))return `${metric.title}: enter a value from 0 to ${metric.max}.`;
      if(bound.min!==''&&bound.max!==''&&Number(bound.min)>Number(bound.max))return `${metric.title}: the minimum must not exceed the maximum.`;
    }
    return '';
  }

  function matching() {
    const query = filters.query.toLocaleLowerCase().trim();
    return data.ratings.filter(r => (!filters.priority || r.State_preference===filters.priority)
      && (!filters.state || r.State===filters.state) && (!filters.institution || r.Institution_ID===filters.institution)
      && (!filters.specialty || r.Specialty===filters.specialty) && (!filters.program || r.Program_label===filters.program)
      && (!filters.verdict || r.Published_verdict===filters.verdict)
      && (!filters.hours || (filters.hours==='estimated' ? r.Duty_hours_estimated : !r.Duty_hours_estimated && r.JR1_duty_hours_band!=='Not reported'))
      && (!filters.stipend || r.Stipend_band_as_printed===filters.stipend)
      && (!filters.dutyBand || r.JR1_duty_hours_band===filters.dutyBand)
      && (!filters.completeness || (filters.completeness==='missing'?Boolean(r.Missing_domains):!r.Missing_domains))
      && rangeMetrics.every(({key})=>{
        const bound=ranges[key];
        if(bound.min===''&&bound.max==='')return true;
        const value=rangeValue(r,key);
        return value!==null&&value!==undefined&&Number.isFinite(value)
          && (bound.min===''||value>=Number(bound.min))&&(bound.max===''||value<=Number(bound.max));
      })
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
      <div><label for="rx-sort">Sort ${tab==='institutions'?'institutions':'department ratings'}</label><select id="rx-sort" data-rx-filter="sort">${sortDefinitions().map(field=>`<optgroup label="${e(field.title)}">${['asc','desc'].map(direction=>{
        const value=field.key+'-'+direction, order=field.numeric?(direction==='asc'?'Low to high':'High to low'):(direction==='asc'?'A–Z':'Z–A');
        return `<option value="${e(value)}" ${sortOrders[tab]===value?'selected':''}>${e(field.title)}: ${order}</option>`;
      }).join('')}</optgroup>`).join('')}</select></div>
      <button type="button" data-rx-reset>Reset filters</button></div>
      <details class="rx-advanced" id="rx-advanced" ${advancedOpen?'open':''}><summary>Rating ranges, stipend & workload <span data-rx-range-count>${rangeCount()?`(${rangeCount()} rating ranges applied)`:''}</span></summary>
        <p class="muted">Combine ranges to compare the aspects that matter to you. Published score: 0–100, higher is worse. Domain ratings: 0–10, higher is better. Blank limits include all values; an active range excludes unreported ratings.</p>
        <div class="rx-filters rx-extra-filters">${select('stipend','Stipend band',[...stipendBands,'Not reported'])}${select('dutyBand','JR1 duty-hours band',[...dutyBands,'Not reported'])}${select('completeness','Domain data',[['complete','All nine domains reported'],['missing','At least one domain missing']])}</div>
        <div class="rx-range-grid">${rangeMetrics.map(metric=>`<fieldset class="rx-range"><legend>${e(metric.title)} <small>0–${metric.max}</small></legend><div class="rx-range-inputs">${['min','max'].map(edge=>`<div><label for="rx-range-${metric.key}-${edge}">${edge==='min'?'Minimum':'Maximum'}</label><input id="rx-range-${metric.key}-${edge}" type="number" inputmode="decimal" min="0" max="${metric.max}" step="${metric.step}" placeholder="Any" value="${e(ranges[metric.key][edge])}" data-rx-range="${e(metric.key)}" data-rx-bound="${edge}" aria-describedby="rx-range-error"></div>`).join('')}</div></fieldset>`).join('')}</div>
      </details><p id="rx-range-error" class="rx-range-error" role="alert" hidden></p>`;
  }
  function sorted(rows,definitions=ratingSorts) {
    const selection=sortSelection(), field=definitions.find(f=>f.key===selection.key)||definitions[0];
    return [...rows].sort((a,b) => {
      const av=field.get(a),bv=field.get(b), aMissing=av===null||av===undefined,bMissing=bv===null||bv===undefined;
      if(aMissing!==bMissing)return aMissing?1:-1;
      const compared=aMissing?0:field.numeric?av-bv:collator.compare(av,bv);
      return compared*(selection.direction==='desc'?-1:1)
        || collator.compare(a.State,b.State)
        || collator.compare(a.Institution||a.Institution_as_printed,b.Institution||b.Institution_as_printed)
        || collator.compare(a.Specialty||'',b.Specialty||'')
        || collator.compare(a.Program_label||'',b.Program_label||'');
    });
  }
  function header(key,title,note='') {
    const selection=sortSelection(),active=selection.key===key;
    const direction=active&&selection.direction==='asc'?'desc':'asc';
    return `<th scope="col" aria-sort="${active?(selection.direction==='asc'?'ascending':'descending'):'none'}"><button type="button" class="rx-sort-button" data-rx-sort="${e(key)}" aria-label="${e('Sort by '+title+', '+(direction==='asc'?'ascending':'descending'))}">${e(title)} <span aria-hidden="true">${active?(selection.direction==='asc'?'↑':'↓'):'↕'}</span></button>${note?`<small>${e(note)}</small>`:''}</th>`;
  }
  function ratingTable(rows) {
    return `<div class="rx-table-wrap" tabindex="0" role="region" aria-label="Department ratings, scroll vertically and horizontally"><table class="rx-table"><caption>Published resident aggregates. Higher index score is worse; higher domain ratings are better. Department sample sizes are not disclosed. Click a column heading to sort; unreported values stay last. All matching rows appear in one continuous table.</caption><thead><tr>${header('state','State / institution')}${header('specialty','Specialty / program')}${header('score','Published score','Higher = worse')}${header('recommend','Recommend')}${header('stipend','Stipend band')}${header('duty','JR1 duty hours')}${data.domains.map(k=>header(k,label[k],'Higher = better')).join('')}${header('source','Source')}</tr></thead><tbody>${sorted(rows).map(r=>`<tr data-rx-row="${e(r.Institution_ID)}"><td><small>${e(r.State)}</small><strong>${e(r.Institution)}</strong></td><td><strong>${e(r.Specialty)}</strong><small>${e(r.Program_label)}</small>${r.Missing_domains?'<span class="rx-flag">Missing domain rating</span>':''}${r.Program_label.includes(',')?'<span class="rx-flag">Combined program aggregate</span>':''}</td><td><strong>${r.Published_score.toFixed(1)}</strong><small>${e(r.Published_verdict)}</small></td><td>${percent(r.Recommend_pct)}</td><td>${e(r.Stipend_band_as_printed)}</td><td>${e(r.JR1_duty_hours_band)}<small class="${r.Duty_hours_estimated?'rx-estimated':''}">${r.JR1_duty_hours_band==='Not reported'?'':r.Duty_hours_estimated?'Estimated from another report':'Department-reported'}</small></td>${data.domains.map(k=>`<td class="rx-domain ${r[k]!==null&&r[k]<=3?'rx-domain-low':''}">${number(r[k])}</td>`).join('')}<td>${link(data.downloads.source+'#page='+r.PDF_page,'PDF p. '+r.PDF_page)}<small>Printed p. ${r.Printed_page}</small></td></tr>`).join('')}</tbody></table></div>`;
  }
  function institutionTable(rows) {
    const groups = new Map();
    for(const row of rows){if(!groups.has(row.Institution_ID))groups.set(row.Institution_ID,[]);groups.get(row.Institution_ID).push(row);}
    const institutions=data.institutions.filter(i=>groups.has(i.Institution_ID)).map(i=>({...i,matched:groups.get(i.Institution_ID)}));
    return `<div class="rx-table-wrap" tabindex="0" role="region" aria-label="Institution directory, continuous scrolling"><table class="rx-table rx-directory"><caption>Institutions named in this PDF. Counts describe listed department aggregates, not response counts. Specialty and program details reflect the current filters. Click a column heading to sort.</caption><thead><tr>${header('state','State')}${header('institution','Institution')}${header('departments','Listed department rows','Matching / total')}${header('specialty','Matching specialties / programs')}${header('source','Source')}</tr></thead><tbody>${sorted(institutions,directorySorts).map(i=>{
      const matched=i.matched;
      return `<tr data-rx-institution="${e(i.Institution_ID)}"><td>${e(i.State)}<small>${e(i.State_preference)} preference</small></td><td><strong>${e(i.Institution_as_printed)}</strong>${i.Campus_unclear_as_printed?'<span class="rx-flag">Campus unclear in source</span>':''}</td><td>${matched.length} / ${i.Departments_listed}</td><td>${unique(matched.map(r=>r.Specialty)).map(e).join(', ')}<small>${unique(matched.map(r=>r.Program_label)).map(e).join(', ')}</small></td><td>${link(data.downloads.source+'#page='+i.First_PDF_page,'PDF p. '+i.First_PDF_page)}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  function refresh() {
    if(!document.getElementById('rx-results'))return;
    const scrollLeft=document.querySelector('#rx-results .rx-table-wrap')?.scrollLeft||0;
    const error=rangeError(), errorNode=document.getElementById('rx-range-error');
    errorNode.textContent=error;errorNode.hidden=!error;
    document.querySelector('[data-rx-range-count]').textContent=rangeCount()?`(${rangeCount()} rating ranges applied)`:'';
    if(error){document.getElementById('rx-count').textContent='Check the rating ranges below.';document.getElementById('rx-results').innerHTML='';return;}
    const rows=matching(), count=new Set(rows.map(r=>r.Institution_ID)).size;
    const applied=Object.values(filters).filter(Boolean).length+rangeCount();
    document.getElementById('rx-count').textContent=`${rows.length.toLocaleString()} of ${data.ratings.length.toLocaleString()} department rows · ${count.toLocaleString()} of ${data.institutions.length.toLocaleString()} institutions${applied?` · ${applied} filters applied`:''}`;
    document.getElementById('rx-results').innerHTML=rows.length ? tab==='institutions'?institutionTable(rows):ratingTable(rows) : '<p class="empty">No entries match these filters. Reset filters or broaden your search.</p>';
    const table=document.querySelector('#rx-results .rx-table-wrap');if(table)table.scrollLeft=scrollLeft;
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
    return tab==='assessment' ? assessment() : `${controls()}<p id="rx-count" class="rx-count" role="status"></p><p class="muted rx-scroll-note">Click column headings to sort in either direction, or use the sort menu. Stipend and duty-hour bands sort by their reported band, not an exact amount or duration. Scroll continuously and sideways for all nine domains. Low domain ratings of 3/10 or below are highlighted as a reading aid, not a validated threshold.</p><div id="rx-results"></div>`;
  }
  document.addEventListener('toggle',event=>{if(event.target.id==='rx-advanced')advancedOpen=event.target.open;},true);
  function updateRange(input) {
    const bound=ranges[input.dataset.rxRange],edge=input.dataset.rxBound;
    if(!bound||!['min','max'].includes(edge))return;
    bound[edge]=input.value;
  }
  document.addEventListener('change',event=>{
    if(event.target.dataset.rxRange){updateRange(event.target);clearTimeout(timer);refresh();return;}
    const key=event.target.dataset.rxFilter;
    if(!key)return;
    clearTimeout(timer);
    if(key==='sort')sortOrders[tab]=event.target.value;
    else filters[key]=event.target.value;
    if(key==='priority'){filters.state='';filters.institution='';}
    if(key==='state')filters.institution='';
    if(key==='priority'||key==='state'){
      document.getElementById('rx-body').innerHTML=content();
    }
    refresh();
  });
  document.addEventListener('input',event=>{
    if(event.target.dataset.rxRange){updateRange(event.target);clearTimeout(timer);timer=setTimeout(refresh,180);return;}
    if(event.target.id!=='rx-query')return;
    filters.query=event.target.value;
    clearTimeout(timer);timer=setTimeout(refresh,180);
  });
  document.addEventListener('click',event=>{
    const sortButton=event.target.closest('[data-rx-sort]');
    if(sortButton){
      const key=sortButton.dataset.rxSort,current=sortSelection();
      sortOrders[tab]=key+'-'+(current.key===key&&current.direction==='asc'?'desc':'asc');
      document.getElementById('rx-sort').value=sortOrders[tab];clearTimeout(timer);refresh();
      document.querySelector(`[data-rx-sort="${CSS.escape(key)}"]`)?.focus({preventScroll:true});return;
    }
    const button=event.target.closest('[data-rx-tab],[data-rx-reset]');
    if(!button)return;
    if(button.hasAttribute('data-rx-reset')){
      for(const key of Object.keys(filters))filters[key]='';
      for(const bound of Object.values(ranges)){bound.min='';bound.max='';}
      sortOrders.ratings='state-asc';sortOrders.institutions='state-asc';
    }
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
