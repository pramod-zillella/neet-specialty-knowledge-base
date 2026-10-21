/* Course/campus/quota choices and personal shortlist; entirely browser-local. */
window.createCutoffShortlistView=function({esc}){
  const data=window.CUTOFF_SHORTLIST_DATA, rows=data.rows, byId=new Map(rows.map(r=>[r['Choice ID'],r]));
  const KEY='fieldnotes-cutoff-shortlist-v1';let selections=new Map(),storageOK=true,notice='';
  const initial=()=>({tab:'all',scope:'eight',query:'',state:'',branch:'Radiodiagnosis',program:'',quota:'',verdict:'',coverage:'',maxScore:'',minSafety:'',feeYear:'2025',feeMax:'',sort:'College',direction:1});
  let filters=initial(),timer;
  const value=v=>v===null||v===undefined||v===''?'Not reported':Number(v).toLocaleString('en-IN',{maximumFractionDigits:1});
  const money=v=>v===null||v===undefined?'Not established':'₹'+(v/100000).toLocaleString('en-IN',{maximumFractionDigits:3})+' L';
  const own=r=>selections.get(r['Choice ID'])||{};
  function normalise(raw){
    if(!raw||raw.schema!=='fieldnotes-cutoff-shortlist-v1'||!Array.isArray(raw.choices))throw new Error('Use a cutoff-shortlist JSON backup from this view.');
    if(raw.choices.length>10000)throw new Error('Too many choices in the backup.');
    return raw.choices.filter(c=>c&&typeof c.id==='string'&&byId.has(c.id)).map(c=>({id:c.id,priority:Number.isInteger(c.priority)&&c.priority>=1&&c.priority<=9999?c.priority:null,notes:typeof c.notes==='string'?c.notes.slice(0,20000):''}));
  }
  try{const raw=localStorage.getItem(KEY);if(raw)selections=new Map(normalise(JSON.parse(raw)).map(c=>[c.id,c]));}catch{storageOK=false;notice='Saved choices could not be read. Export a backup before closing if storage is unavailable.';}
  function backup(){return {schema:'fieldnotes-cutoff-shortlist-v1',exported:new Date().toISOString(),dataset_sha256:data.input_sha256,choices:Array.from(selections.values())};}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(backup()));storageOK=true;}catch{storageOK=false;notice='Browser storage is unavailable. Export your shortlist JSON before closing.';}}
  function errors(){
    const a=[];
    for(const [key,min,max,label] of [['maxScore',0,100,'Toxicity ceiling'],['minSafety',0,10,'Safety minimum'],['feeMax',0,1000,'Annual fee ceiling']]){
      if(filters[key]!==''&&(!Number.isFinite(Number(filters[key]))||Number(filters[key])<min||Number(filters[key])>max))a.push(`${label} must be between ${min} and ${max}.`);
    }return a;
  }
  function visible(){
    if(errors().length)return [];
    const q=filters.query.trim().toLocaleLowerCase();
    return rows.filter(r=>{
      if(filters.tab==='saved'&&!selections.has(r['Choice ID']))return false;
      if(filters.scope==='eight'&&r['In my eight specialties']!=='Yes')return false;
      if(q&&![r.College,r.State,r['Institute address'],r.Branch].join(' ').toLocaleLowerCase().includes(q))return false;
      if(filters.state&&r.State!==filters.state||filters.branch&&r.Specialty!==filters.branch||filters.program&&r.Programme!==filters.program||filters.quota&&r['Allotted quota']!==filters.quota||filters.verdict&&r['Toxicity category']!==filters.verdict)return false;
      if(filters.coverage==='2025'&&!r['2025 fee source']||filters.coverage==='2026'&&!r['2026 fee source']||filters.coverage==='missing'&&(r['2025 fee source']||r['2026 fee source']))return false;
      if(filters.coverage==='rating'&&r['Toxicity score (higher worse)']===null||filters.coverage==='exact'&&r['Resident match status']!=='Exact programme label')return false;
      if(filters.maxScore!==''&&(r['Toxicity score (higher worse)']===null||r['Toxicity score (higher worse)']>Number(filters.maxScore)))return false;
      if(filters.minSafety!==''&&(r.Safety===null||r.Safety<Number(filters.minSafety)))return false;
      const annual=r[filters.feeYear+' fee period']==='Annual'?r[filters.feeYear+' listed fee INR']:r['NBEMS '+filters.feeYear+' annual schedule with accommodation INR'];
      if(filters.feeMax!==''&&(annual===null||annual===undefined||annual>Number(filters.feeMax)*100000))return false;
      return true;
    }).sort((a,b)=>{
      const key=filters.sort;
      const comparable=r=>{
        if(key==='Priority')return own(r).priority;
        if(r[key]!==null&&r[key]!==undefined)return r[key];
        if(/^(2025|2026) listed fee INR$/.test(key))return r['NBEMS '+key.slice(0,4)+' annual schedule with accommodation INR'];
        if(/^(2025|2026) stipend PGY1 INR$/.test(key))return r['NBEMS '+key.slice(0,4)+' basic stipend PGY1 monthly INR'];
        return r[key];
      };
      let x=comparable(a),y=comparable(b);
      const missing=v=>v===null||v===undefined||v==='';
      if(missing(x)!==missing(y))return missing(x)?1:-1;
      const cmp=missing(x)?0:typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),undefined,{numeric:true,sensitivity:'base'});
      return filters.direction*cmp||a.College.localeCompare(b.College)||a['Choice ID'].localeCompare(b['Choice ID']);
    });
  }
  function options(values,selected,all){return `<option value="">${esc(all)}</option>`+values.map(v=>`<option value="${esc(v)}"${selected===v?' selected':''}>${esc(v)}</option>`).join('');}
  function dropdown(key,label,values,all){return `<div><label for="cs-${key}">${esc(label)}</label><select id="cs-${key}" data-cs-filter="${key}">${options(values,filters[key],all)}</select></div>`;}
  const distinct=key=>Array.from(new Set(rows.map(r=>r[key]))).filter(Boolean).sort();
  function feeCell(r,year){const n=r[year+' listed fee INR'];if(n!==null)return `<strong>${money(n)}</strong><small>${esc(r[year+' fee period'])} · ${esc(r[year+' fee basis'])}</small>`;if(r['NBEMS '+year+' tuition schedule INR'])return '<strong>₹1.05–1.25 L</strong><small>NBEMS prescribed annual schedule; accommodation dependent, confirm hospital invoice</small>';return '<span class="cs-unknown">Not established</span>';}
  function stipendCell(r,year,mcc=false){
    const prefix=mcc?'MCC 2026':String(year),nums=[1,2,3].map(n=>r[prefix+' stipend PGY'+n+' INR']);
    if(nums.every(n=>n===null||n===undefined)&&!mcc&&r.Programme==='DNB')return '<strong>₹43,000 / 45,000 / 47,000</strong><small>PGY1/2/3 per month · NBEMS basic floor, higher parity may apply; not take-home pay</small>';
    if(nums.every(n=>n===null||n===undefined))return '<span class="cs-unknown">Not established</span>';
    return `<strong>${nums.map(n=>n===null||n===undefined?'?':'₹'+value(n)).join(' / ')}</strong><small>PGY1 / PGY2 / PGY3 · ${esc(mcc?r['MCC stipend frequency']:r[year+' stipend frequency'])}</small>`;
  }
  function stipendDetails(r){return `<h3>Stipend evidence</h3>${[2025,2026].map(year=>`<h4>${year} institution disclosure</h4><p>${stipendCell(r,year)}</p><p>${esc(r[year+' stipend period'])} ${esc(r[year+' stipend notes'])}</p><p>${sourceLink(r[year+' stipend source'],'Stipend source')} ${r[year+' stipend page']?'· PDF page '+esc(r[year+' stipend page']):''}</p>${r.Programme==='DNB'?`<p>${sourceLink(r['NBEMS '+year+' policy source'],'NBEMS '+year+' policy')} · Fee PDF pages ${esc(r['NBEMS '+year+' policy fee pages'])}; stipend PDF pages ${esc(r['NBEMS '+year+' policy stipend pages'])}. Annual tuition ₹75,000 + library ₹15,000 + appraisal ₹15,000; ₹20,000 accommodation only if provided. Electricity/consumables can be additional. Basic stipend floor ₹43,000/45,000/47,000 per month; applicable higher state/central parity governs. Confirm current rules and actual hospital deductions/payment.</p>`:''}`).join('')}<h4>MCC 2026 reported stipend</h4><p>${stipendCell(r,2026,true)}</p><p>${esc(r['MCC stipend status'])}. ${sourceLink(r['MCC stipend source'],'MCC stipend source')}. No assumed monthly frequency or net-fee calculation.</p>`;}
  function sourceLink(url,label){return url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`:'<span class="cs-unknown">No source matched</span>';}
  function details(r){
    const id=r['Choice ID'],s=own(r);
    return `<tr class="cs-detail" data-cs-detail="${esc(id)}" hidden><td colspan="${headings.length+2}"><div class="cs-detail-grid"><section><h3>My choice</h3><p>${esc(r.College)} · ${esc(r.Branch)} · ${esc(r['Allotted quota'])} · ${esc(r['Allotted category'])}</p><p class="muted">${esc(r['Institute address'])}</p>${selections.has(id)?`<label for="priority-${id}">My preference order (1 = first)</label><input type="number" id="priority-${id}" data-cs-priority="${id}" min="1" max="9999" step="1" value="${s.priority??''}"><label for="notes-${id}">My notes / confirmations</label><textarea id="notes-${id}" data-cs-notes="${id}" maxlength="20000">${esc(s.notes||'')}</textarea>`:'<p>Add this choice to save your priority and notes.</p>'}<h4>All cutoff columns</h4><table>${['Round 1','Round 2','Round 3','Stray'].map(round=>`<tr><th>${round}</th><td>Open ${value(r[round+' opening rank'])} · Close ${value(r[round+' closing rank'])} · ${value(r[round+' allotments'])} allotments</td></tr>`).join('')}</table></section><section><h3>Fee evidence</h3>${[2025,2026].map(year=>`<h4>${year} course-specific fee</h4><p>${feeCell(r,year)}</p><p>Tuition component: ${money(r[year+' tuition component INR'])}. Published course total: ${money(r[year+' published course total INR'])}.</p><p>${esc(r[year+' other charges'])} ${esc(r[year+' hostel'])}</p><p>${esc(r[year+' escalation'])} ${esc(r[year+' fee notes'])}</p><p>${sourceLink(r[year+' fee source'],'Fee source')} ${r[year+' fee page']?'· PDF page '+esc(r[year+' fee page']):''} · ${esc(r[year+' fee evidence'])}</p>`).join('')}<h4>MCC PG 2026 generic reference</h4><p>Annual: ${money(r['MCC generic annual fee INR'])}; admission: ${money(r['MCC generic admission amount INR'])}; first-year: ${money(r['MCC generic first-year amount INR'])}. These amounts may overlap; do not add them.</p><p>${esc(r['MCC profile fee status'])}. Retrieval: ${esc(r['MCC profile retrieved'])}. ${sourceLink(r['MCC profile source'],'College-reported MCC profile')}</p>${stipendDetails(r)}</section><section><h3>Resident experience</h3><p><strong>${esc(r['Resident match status'])}</strong>. ${esc(r['Resident institution'])} · ${esc(r['Resident programme label'])}</p><p>${esc(r['Resident institution match'])}</p><p>Composite: ${value(r['Toxicity score (higher worse)'])} / 100 (higher is worse). ${esc(r['Toxicity category'])}</p><dl class="cs-domain-list">${data.rating_evidence.length?['Environment','Hands_on','Academics','Faculty','Senior_resident','Work_life','Mental_health','Stipend_on_time','Safety'].map(k=>`<div><dt>${esc(k.replace(/_/g,' '))}</dt><dd>${value(r[k])} / 10</dd></div>`).join(''):''}</dl><p>All domains: higher is better. Recommendation: ${value(r['Recommend percent'])}%. Department sample size: undisclosed.</p><p>Hours: ${esc(r['JR1 duty hours band'])||'not reported'}${r['Duty hours estimated']==='True'?' · estimated from another report':''}. Survey stipend: ${esc(r['Survey stipend band'])||'not reported'} (not verified credited pay).</p><p>${esc(r['Resident evidence status'])}. ${esc(r['Resident verification flags'])} ${esc(r['Missing domains'])}</p><p>${sourceLink(r['Resident source'],'Source PDF page '+r['Resident PDF page'])}. Survey cutoff: 6 October 2026.</p></section></div></td></tr>`;
  }
  const headings=[['College','College / campus'],['Branch','Course / quota'],['2025 listed fee INR','2025 course fee'],['2026 listed fee INR','2026 course fee'],['2025 stipend PGY1 INR','2025 stipend / floor'],['2026 stipend PGY1 INR','2026 stipend / floor'],['MCC 2026 stipend PGY1 INR','MCC 2026 stipend'],['MCC generic annual fee INR','MCC 2026 generic annual'],...['Round 1','Round 2','Round 3','Stray'].map(v=>[v+' closing rank',v+' closing']),['Toxicity score (higher worse)','Toxicity ↑ worse'],['Toxicity category','Survey category'],['Safety','Safety ↑ better'],['Hands_on','Hands-on ↑ better'],['Academics','Academics ↑ better'],['Work_life','Work-life ↑ better'],['Recommend percent','Recommend %']];
  function results(){
    const list=visible();
    return `<p class="cs-count" role="status">${list.length.toLocaleString()} choices shown · ${selections.size} shortlisted${filters.tab==='saved'?' in total (filters still apply)':''}. All cutoff rows are Open category.</p>${errors().map(e=>`<p class="cs-warning" role="alert">${esc(e)}</p>`).join('')}<div class="actions cs-bulk"><button data-cs-action="add-visible"${!list.length?' disabled':''}>Add ${list.length} shown to shortlist</button><button data-cs-action="reset">Reset filters</button>${filters.tab==='saved'?'<button data-cs-action="show-all-saved">Show every saved choice</button>':''}</div><p class="muted">Continuous scrolling. Scroll horizontally for all rounds and metrics; open “Details &amp; notes” for all nine domains, fee sources and opening ranks.</p><div class="cs-table-wrap" tabindex="0" aria-label="Choice comparison, horizontally and vertically scrollable"><table class="cs-table"><thead><tr><th>Shortlist</th>${headings.map(([k,v])=>`<th${filters.sort===k?' aria-sort="'+(filters.direction===1?'ascending':'descending')+'"':''}><button type="button" data-cs-sort="${esc(k)}">${esc(v)}${filters.sort===k?(filters.direction===1?' ↑':' ↓'):''}</button></th>`).join('')}<th>Evidence &amp; notes</th></tr></thead><tbody>${list.map(r=>`<tr data-cs-row="${r['Choice ID']}"><td><label class="cs-add"><input type="checkbox" data-cs-select="${r['Choice ID']}"${selections.has(r['Choice ID'])?' checked':''} aria-label="Shortlist ${esc(r.College)}, ${esc(r.Branch)}, ${esc(r['Allotted quota'])}">${selections.has(r['Choice ID'])?'Added':'Add'}</label>${own(r).priority?`<small>My priority: ${own(r).priority}</small>`:''}</td><td><strong>${esc(r.College)}</strong><small>${esc(r.State)}</small></td><td><strong>${esc(r.Branch)}</strong><small>${esc(r['Allotted quota'])} · Open</small></td><td>${feeCell(r,2025)}</td><td>${feeCell(r,2026)}</td><td>${stipendCell(r,2025)}</td><td>${stipendCell(r,2026)}</td><td>${stipendCell(r,2026,true)}</td><td><strong>${money(r['MCC generic annual fee INR'])}</strong><small>College-wide reference; branch/quota unconfirmed</small></td>${['Round 1','Round 2','Round 3','Stray'].map(round=>`<td>${value(r[round+' closing rank'])}</td>`).join('')}<td>${value(r['Toxicity score (higher worse)'])}<small>${esc(r['Resident match status'])}</small></td><td>${esc(r['Toxicity category'])||'Not matched'}</td>${['Safety','Hands_on','Academics','Work_life','Recommend percent'].map(k=>`<td>${value(r[k])}</td>`).join('')}<td><button data-cs-details="${r['Choice ID']}" aria-expanded="false">Details &amp; notes</button></td></tr><tr class="cs-detail" data-cs-detail="${r['Choice ID']}" hidden><td colspan="${headings.length+2}"></td></tr>`).join('')||'<tr><td colspan="${headings.length+2}">No choices match. Try resetting filters or showing every saved choice.</td></tr>'}</tbody></table></div>`;
  }
  function view(){
    const summary=data.summary;
    return `<div id="cs-view"><p class="eyebrow">Your college choices · Cutoffs + cost + resident experience</p><h2>College choice shortlist</h2><p>${summary.input_rows.toLocaleString()} exported 2025 choices · ${summary.campus_address_records} college/address records (${summary.college_labels} distinct college labels). Compare all rounds, investigate costs and save your own preference list.</p><div class="cs-warning"><strong>Check the year, campus and programme.</strong> Course-specific fees cover ${summary.fees_2025_rows} rows for 2025 and ${summary.fees_2026_rows} for 2026. Another ${summary.nbems_policy_rows} DNB rows have prescribed fee/stipend schedules, not hospital invoices. MCC 2026 has reported stipend amounts for ${summary.mcc_stipend_rows} rows, with frequency unconfirmed. ${summary.rating_rows} rows have a linked resident aggregate, including unspecified/combined programmes. These anonymous ratings have undisclosed department sample sizes and are not validated safety findings.</div><p class="muted">PMR has no rows in the supplied export. Family Medicine and Geriatrics are preserved under “Full input.” ₹ L = lakh; fee basis varies. No fee-change column.</p><div class="actions cs-downloads"><a href="exports/cutoff-shortlist/College-cutoffs-fees-resident-experience.xlsx" download>Download master Excel</a><button data-cs-action="excel">Export Excel with my shortlist</button><button data-cs-action="json">Back up my shortlist JSON</button><label class="button secondary" for="cs-import">Import shortlist JSON</label><input id="cs-import" type="file" accept=".json,application/json" hidden><a href="exports/cutoff-shortlist/README.md" target="_blank" rel="noopener">Method &amp; coverage</a></div><p class="muted">Selections and notes stay in this browser and site address. Export JSON to move them to another device. The public master workbook starts with no personal choices.</p><p id="cs-notice" role="status">${esc(notice)}${storageOK?'':' Export a backup before closing.'}</p><div class="cs-tabs"><button data-cs-tab="all" aria-pressed="${filters.tab==='all'}">All choices</button><button data-cs-tab="saved" aria-pressed="${filters.tab==='saved'}">My shortlist (${selections.size})</button><button data-cs-tab="guide" aria-pressed="${filters.tab==='guide'}">How to interpret</button></div>${filters.tab==='guide'?data.guidance.map(g=>`<details class="cs-guide"><summary>${esc(g.Topic)}</summary><p>${esc(g.Guidance)}</p></details>`).join(''):`<div class="cs-filters"><div class="cs-search"><label for="cs-query">Find colleges / city</label><input id="cs-query" type="search" data-cs-filter="query" value="${esc(filters.query)}" placeholder="College, city or campus address"></div>${dropdown('state','State',distinct('State'),'All states')}${dropdown('branch','Specialty',distinct('Specialty'),'All specialties')}${dropdown('program','Programme',distinct('Programme'),'MD/MS + DNB')}${dropdown('quota','Allotted quota',distinct('Allotted quota'),'All quotas')}<div><label for="cs-scope">Input scope</label><select id="cs-scope" data-cs-filter="scope"><option value="eight"${filters.scope==='eight'?' selected':''}>My eight specialties</option><option value="all"${filters.scope==='all'?' selected':''}>Full input including extra specialties</option></select></div></div><details id="cs-advanced" class="cs-advanced"><summary>Fee limits, rating ranges &amp; sorting</summary><div class="cs-filters">${dropdown('verdict','Published toxicity category',distinct('Toxicity category'),'All / unreported')}<div><label for="cs-coverage">Evidence coverage</label><select id="cs-coverage" data-cs-filter="coverage">${[['','All coverage'],['2025','2025 course fee available'],['2026','2026 course fee available'],['missing','Course fees missing both years'],['rating','Any eligible resident rating'],['exact','Exact programme rating only']].map(([k,v])=>`<option value="${k}"${filters.coverage===k?' selected':''}>${v}</option>`).join('')}</select></div><div><label for="cs-maxScore">Toxicity maximum (0–100, lower = better)</label><input id="cs-maxScore" data-cs-filter="maxScore" type="number" min="0" max="100" step="0.1" value="${esc(filters.maxScore)}"></div><div><label for="cs-minSafety">Safety minimum (0–10, higher = better)</label><input id="cs-minSafety" data-cs-filter="minSafety" type="number" min="0" max="10" step="0.1" value="${esc(filters.minSafety)}"></div><div><label for="cs-feeYear">Annual fee filter year</label><select id="cs-feeYear" data-cs-filter="feeYear"><option${filters.feeYear==='2025'?' selected':''}>2025</option><option${filters.feeYear==='2026'?' selected':''}>2026</option></select></div><div><label for="cs-feeMax">Annual listed-fee ceiling (₹ lakh)</label><input id="cs-feeMax" data-cs-filter="feeMax" type="number" min="0" max="1000" step="0.1" value="${esc(filters.feeMax)}"><small>Annual course rates or the NBEMS INR 1.25 L schedule ceiling; excludes unknown and first-year-only totals. Does not include all living costs.</small></div><div><label for="cs-sort">Sort</label><select id="cs-sort" data-cs-filter="sort">${options(['College','State','Branch','Priority',...headings.slice(2).map(([k])=>k)],filters.sort,'Select a column')}</select></div><div><label for="cs-direction">Sort direction</label><select id="cs-direction" data-cs-filter="direction"><option value="1"${filters.direction===1?' selected':''}>Ascending (unknown last)</option><option value="-1"${filters.direction===-1?' selected':''}>Descending (unknown last)</option></select></div></div></details><div id="cs-results">${results()}</div>`}</div>`;
  }
  function rerender(){
    if(!document.getElementById('cs-view'))return;
    const active=document.activeElement,id=active?.id,selection=active?.selectionStart,wrap=document.querySelector('.cs-table-wrap'),left=wrap?.scrollLeft||0,top=wrap?.scrollTop||0;
    const advancedOpen=document.getElementById('cs-advanced')?.open;
    const expanded=Array.from(document.querySelectorAll('[data-cs-details][aria-expanded=true]')).map(b=>b.dataset.csDetails);
    document.getElementById('content').innerHTML=view();
    if(document.getElementById('cs-advanced'))document.getElementById('cs-advanced').open=Boolean(advancedOpen);
    for(const key of expanded){const el=document.querySelector(`[data-cs-detail="${key}"]`),button=document.querySelector(`[data-cs-details="${key}"]`);if(el){el.outerHTML=details(byId.get(key));document.querySelector(`[data-cs-detail="${key}"]`).hidden=false;}if(button)button.setAttribute('aria-expanded','true');}
    const next=document.getElementById(id);if(next){next.focus({preventScroll:true});if(selection!==null)try{next.setSelectionRange(selection,selection);}catch{}}
    const table=document.querySelector('.cs-table-wrap');if(table){table.scrollLeft=left;table.scrollTop=top;}
  }
  function download(name,blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function exportExcel(){
    const annotate=r=>({...r,Selected:selections.has(r['Choice ID'])?'Yes':'No',Priority:own(r).priority??null,'My notes':own(r).notes||''});
    const all=rows.map(annotate),short=all.filter(r=>r.Selected==='Yes').sort((a,b)=>(a.Priority??Infinity)-(b.Priority??Infinity)||a.College.localeCompare(b.College));
    const sheets=[{name:'Read me',rows:data.guidance},{name:'All choices',columns:data.columns,rows:all},{name:'Shortlisted',columns:data.columns,rows:short},{name:'Filtered choices',columns:data.columns,rows:visible().map(annotate)},{name:'Fee evidence',rows:data.fee_evidence},{name:'Stipend evidence',rows:data.stipend_evidence},{name:'Resident evidence',rows:data.rating_evidence},{name:'Research queue',rows:data.research_queue}];
    download('My-college-cutoffs-fees-shortlist.xlsx',window.SmallXlsx.workbook(sheets));
    notice=`Excel exported: ${all.length} total choices and ${short.length} shortlisted choices, including all saved choices outside current filters.`;
  }
  document.addEventListener('click',event=>{
    const el=event.target.closest('button');if(!el?.closest('#cs-view'))return;
    if(el.dataset.csTab){filters.tab=el.dataset.csTab;rerender();return;}
    if(el.dataset.csDetails){let row=document.querySelector(`[data-cs-detail="${el.dataset.csDetails}"]`);if(row.hidden){row.outerHTML=details(byId.get(el.dataset.csDetails));row=document.querySelector(`[data-cs-detail="${el.dataset.csDetails}"]`);row.hidden=false;}else row.hidden=true;el.setAttribute('aria-expanded',String(!row.hidden));return;}
    if(el.dataset.csSort){filters.direction=filters.sort===el.dataset.csSort?-filters.direction:1;filters.sort=el.dataset.csSort;rerender();return;}
    switch(el.dataset.csAction){
      case 'reset':{const tab=filters.tab;filters={...initial(),branch:'',tab};break;}
      case 'show-all-saved':filters={...initial(),tab:'saved',scope:'all',branch:'',sort:'Priority'};break;
      case 'add-visible':for(const r of visible())if(!selections.has(r['Choice ID']))selections.set(r['Choice ID'],{id:r['Choice ID'],priority:null,notes:''});save();break;
      case 'json':download('my-college-shortlist.json',new Blob([JSON.stringify(backup(),null,2)],{type:'application/json'}));notice='JSON backup exported, including every saved choice and your notes.';break;
      case 'excel':try{exportExcel();}catch(e){notice='Excel export failed: '+e.message;}break;
      default:return;
    }rerender();
  });
  document.addEventListener('change',async event=>{
    const el=event.target;if(!el.closest('#cs-view'))return;
    if(el.dataset.csSelect){const id=el.dataset.csSelect;if(el.checked)selections.set(id,{id,priority:null,notes:''});else selections.delete(id);save();rerender();return;}
    if(el.dataset.csFilter){filters[el.dataset.csFilter]=el.dataset.csFilter==='direction'?Number(el.value):el.value;rerender();return;}
    if(el.id==='cs-import'&&el.files[0]){
      try{
        const file=el.files[0];if(file.size>2000000)throw new Error('Backup is larger than 2 MB.');
        const raw=JSON.parse(await file.text()),choices=normalise(raw);
        for(const c of choices)selections.set(c.id,c);save();notice=`Imported ${choices.length} recognised choices; matching choices were updated, other saved choices retained.${raw.dataset_sha256!==data.input_sha256?' Dataset differs; unrecognised IDs were not imported.':''}`;
      }catch(e){notice='Import failed: '+e.message;}rerender();
    }
  });
  document.addEventListener('input',event=>{
    const el=event.target;if(!el.closest('#cs-view'))return;
    if(el.dataset.csNotes||el.dataset.csPriority){
      const id=el.dataset.csNotes||el.dataset.csPriority,s=selections.get(id);if(!s)return;
      if(el.dataset.csNotes)s.notes=el.value.slice(0,20000);
      else {const n=Number(el.value);if(el.value!==''&&(!Number.isInteger(n)||n<1||n>9999)){el.setCustomValidity('Use a whole-number preference from 1 to 9999.');el.reportValidity();return;}el.setCustomValidity('');s.priority=el.value===''?null:n;}
      save();return;
    }
    if(el.dataset.csFilter&&el.tagName==='INPUT'){filters[el.dataset.csFilter]=el.value;clearTimeout(timer);timer=setTimeout(rerender,220);}
  });
  return view;
};
