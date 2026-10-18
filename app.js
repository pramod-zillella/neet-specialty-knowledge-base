/* Local-only notebook. Public knowledge is embedded; no API key or server needed. */
(() => {
  'use strict';
  const data = window.KNOWLEDGE_BASE;
  const $ = id => document.getElementById(id);
  if (!data) { $('content').textContent = 'Knowledge data did not load. Keep knowledge-data.js alongside index.html.'; return; }
  // The public payload stores each branch point once, shared by its decision/aspect groups.
  for (const branch of data.branch_summaries || []) {
    for (const group of [...branch.theme_groups, ...(branch.decision_groups || [])]) {
      if (!group.points) group.points = group.point_ids.map(id => branch.source_points[id]);
    }
    if (!branch.shared_training_points) branch.shared_training_points = (branch.shared_training_point_ids || []).map(id => branch.source_points[id]);
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const subjects = new Map(data.subjects.map(s => [s.id, s]));
  const episodes = new Map(data.episodes.map(e => [e.id, e]));
  const aspects = new Map(data.aspects.map(a => [a.id, a.name]));
  const videoReviews = new Map((data.video_summaries || []).map(r => [r.video_id, r]));
  const videoBriefs = new Map((data.video_briefs || []).map(r => [r.video_id, r]));
  const readingReviews = new Map([...videoBriefs, ...videoReviews]);
  const branchReviews = new Map((data.branch_summaries || []).map(r => [r.subject_id, r]));
  const STORE = 'neet-specialty-notebook-v1';
  const fresh = () => ({version:1, saved:[], notes:{}, compare:['radiology','dermatology'], colleges:[]});
  let personal = fresh(), storageAvailable = true;
  function validate(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.saved) || !Array.isArray(value.compare) || !value.notes || typeof value.notes !== 'object' || Array.isArray(value.notes) || !Array.isArray(value.colleges)) throw new Error('Unsupported notebook format.');
    const result = fresh();
    result.saved = [...new Set(value.saved.filter(id => subjects.has(id)))];
    result.compare = [...new Set(value.compare.filter(id => subjects.has(id)))].slice(0,4);
    result.notes = Object.fromEntries(Object.entries(value.notes).filter(([id, text]) => subjects.has(id) && typeof text === 'string').map(([id,text]) => [id,text.slice(0,20000)]));
    result.colleges = value.colleges.slice(0,300).filter(c => c && typeof c.id === 'string' && typeof c.name === 'string' && subjects.has(c.subject_id)).map(c => ({id:c.id.slice(0,80),name:c.name.slice(0,200),subject_id:c.subject_id,location:String(c.location ?? '').slice(0,200),notes:String(c.notes ?? '').slice(0,20000),updated:String(c.updated ?? '').slice(0,80)}));
    return result;
  }
  try { const raw = localStorage.getItem(STORE); if (raw) personal = validate(JSON.parse(raw)); }
  catch { storageAvailable = false; }
  function message(value) { $('storage-status').textContent = value; }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(personal)); storageAvailable = true; }
    catch { storageAvailable = false; message('Browser storage is unavailable. Your changes work for this session; export a notebook backup before closing.'); }
    $('saved-count').textContent = personal.saved.length;
  }
  const state = {view:'overview', subject:'radiology', video:'cfTz2-e3X-I', summaryAll:false, query:'', group:'', aspect:'', stance:'', savedOnly:false, libraryStatus:'',summaryQuery:'',importantOnly:false};
  const time = second => { const n=Math.floor(second); return n>=3600 ? `${Math.floor(n/3600)}:${String(Math.floor(n%3600/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}` : `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; };
  const match = (value, query) => String(value).toLocaleLowerCase().includes(query.toLocaleLowerCase());
  function noteMatches(n, includeQuery = true) {
    return (!state.aspect || n.aspect===state.aspect) && (!state.stance || n.stance===state.stance) && (!includeQuery || !state.query || match([n.summary,n.decision_question,n.speaker,n.anchor,n.caveat,subjects.get(n.subject_id).name].join(' '),state.query));
  }
  function visibleSubjects() {
      return data.subjects.filter(s => (!state.group || s.group===state.group) && (!state.savedOnly || personal.saved.includes(s.id)) && (!state.query || match(s.name,state.query) || data.notes.some(n => n.subject_id===s.id && noteMatches(n)) || (branchReviews.get(s.id)?.theme_groups || []).some(g => g.points.some(p => match(p.title+' '+p.summary,state.query)))));
  }
  function notesFor(id) {
    const nameMatch = match(subjects.get(id).name,state.query);
    return data.notes.filter(n => n.subject_id===id && noteMatches(n,!nameMatch));
  }
  function sourceCard(note, compact=false) {
    const ep=episodes.get(note.video_id);
    return `<article class="card" data-note-id="${esc(note.id)}"><div class="tags"><span class="pill ${note.stance.toLowerCase().replaceAll(' ','-')}">${esc(note.stance)}</span><span class="pill">${esc(aspects.get(note.aspect))}</span></div><p>${esc(note.summary)}</p>${compact?'':`<p class="question"><strong>Question to investigate · editorial</strong>${esc(note.decision_question)}</p>`}<div class="source"><a href="${esc(note.source_url)}" target="_blank" rel="noopener noreferrer">Watch ${time(note.start_seconds)}–${time(note.end_seconds)} ↗</a><span>${esc(note.speaker)} · ${esc(note.language)} caption track</span></div><details><summary>Evidence & context</summary><p>${esc(ep.title)}</p><blockquote lang="${esc(note.language)}">${esc(note.anchor)}</blockquote><p class="muted">Short exact caption anchor. The summary uses the surrounding ${time(note.start_seconds)}–${time(note.end_seconds)} window. English paraphrase/translation; captions and contextual speaker attribution have not been checked against audio.</p>${note.caveat?`<p>${esc(note.caveat)}</p>`:''}${compact?`<p class="question"><strong>Question to investigate · editorial</strong>${esc(note.decision_question)}</p>`:''}</details></article>`;
  }
  function topicSidebar() {
    const list=visibleSubjects();
    $('filter-count').textContent=`${list.length} of ${data.subjects.length} topics · explore themes and source notes`;
    $('topic-list').innerHTML=list.map(s=>`<button type="button" class="topic ${state.subject===s.id?'active':''}" data-subject="${esc(s.id)}" ${state.subject===s.id?'aria-current="true"':''}><span>${esc(s.name)}</span><small>${branchReviews.get(s.id)?.full_summary_count||0} full${personal.saved.includes(s.id)?' ★':''}</small></button>`).join('') || '<p class="empty">No topics match. Reset filters to show all.</p>';
    $('saved-count').textContent=personal.saved.length;
    $('shortlist-only').setAttribute('aria-pressed',String(state.savedOnly));
  }
  function basicEpisodeCard(episode, related=false) {
    const chapters=episode.chapters.filter(c => !state.aspect || c.aspects.includes(state.aspect));
    return `<article class="card episode"><div class="tags"><span class="pill">${time(episode.duration_seconds)}</span><span class="pill">${esc(episode.transcript_status)}</span><span class="pill">${esc(episode.review_status)}</span>${related?'<span class="pill">Related episode</span>':''}</div><h3><a href="${esc(episode.url)}" target="_blank" rel="noopener noreferrer">${esc(episode.title)} ↗</a></h3><p class="muted">${episode.language?`${esc(episode.language)} caption track · `:''}${episode.curated_note_count} curated notes from selected sections. Episode titles are the channel’s wording.</p><details><summary>${chapters.length} chapter links${state.aspect?' for this aspect':''} · metadata only</summary>${chapters.map(c=>`<a class="chapter" href="https://www.youtube.com/watch?v=${esc(episode.id)}&t=${c.start}s" target="_blank" rel="noopener noreferrer">${time(c.start)} · ${esc(c.title)}</a>`).join('')||'<p>No matching chapter metadata. This does not establish that the topic is absent from the conversation.</p>'}</details></article>`;
  }
  function episodeCard(episode, related=false) {
    let html=basicEpisodeCard(episode,related);
    const complete=videoReviews.has(episode.id);
    if(complete) html=html.replace('curated notes from selected sections.','earlier excerpt notes; a full-caption summary is available.');
    else if(videoBriefs.has(episode.id)) html=html.replace(`${episode.curated_note_count} curated notes from selected sections.`,`${videoBriefs.get(episode.id).themes.length} reviewed highlights from selected captions; full-video review is pending.`);
    return html.replace('<details>',`<div class="actions"><button type="button" data-video-summary="${esc(episode.id)}">${complete?'Read full summary':videoBriefs.has(episode.id)?'Read partial brief':'View review progress'}</button></div><details>`);
  }
  const branchSnapshot = window.createBranchView({state,esc,time,branchReviews,videoBriefs});
  function overview() {
    const html=excerptOverview().replace(' notes · ',' excerpt notes · ').replace('/12 aspects</span>','/12 aspects with sources</span>').replace('Coverage dots show aspects with curated notes.','Coverage dots show aspects with reviewed themes or excerpt notes.');
    if(!visibleSubjects().length)return html;
    return html.replace('<div class="fit">',branchSnapshot(subjects.get(state.subject))+'<div class="fit">');
  }
  const videoSummaries = window.createReadingView({data,state,esc,time,subjects,episodes,aspects,videoReviews,videoBriefs});
  function excerptOverview() {
    const list=visibleSubjects();
    const subject=subjects.get(state.subject);
    if (!list.some(s=>s.id===state.subject)) {
      if (!list.length) return '<h2>No matching topics</h2><p class="empty">Reset the filters or search for a different specialty or idea.</p>';
      state.subject=list[0].id; return excerptOverview();
    }
    const entries=notesFor(subject.id);
    const eps=subject.episode_ids.map(id=>episodes.get(id));
    const related=subject.related_episode_ids.map(id=>episodes.get(id));
    const isSaved=personal.saved.includes(subject.id), inCompare=personal.compare.includes(subject.id);
    return `<div class="section-head"><div><p class="eyebrow">${esc(subject.group)}</p><h2>${esc(subject.name)}</h2><div class="tags"><span class="pill">${esc(subject.coverage_status)}</span><span class="pill">${subject.note_count} notes · ${subject.reviewed_aspects.length}/12 aspects</span></div></div><div class="actions"><button type="button" data-save="${esc(subject.id)}" aria-pressed="${isSaved}" class="${isSaved?'primary':''}">${isSaved?'★ Saved':'☆ Save topic'}</button><button type="button" data-compare="${esc(subject.id)}" aria-pressed="${inCompare}">${inCompare?'✓ In comparison':'+ Compare'}</button></div></div><div class="fit"><p class="eyebrow">Start with fit · editorial prompt</p><p>${esc(subject.fit_question)}</p></div><p class="muted">Coverage dots show aspects with curated notes. A grey dot is a review gap. Select an aspect to focus the branch themes, notes and chapter links.</p><div class="coverage">${data.aspects.map(a=>`<button type="button" data-aspect="${a.id}" class="${subject.reviewed_aspects.includes(a.id)?'covered ':''}${state.aspect===a.id?'active':''}" aria-pressed="${state.aspect===a.id}"><span class="dot" aria-hidden="true"></span><span>${esc(a.name)}${subject.reviewed_aspects.includes(a.id)?' ✓':''}</span></button>`).join('')}</div><details class="earlier-notes"><summary>${entries.length} earlier excerpt notes${state.aspect||state.stance||state.query?' matching filters':''}</summary><p class="muted">Earlier notes cover selected passages. The full-review themes above retain the wider discussion and later qualifications.</p><div class="cards">${entries.map(n=>sourceCard(n)).join('')}</div>${!entries.length?`<div class="empty">${subject.note_count?'No earlier excerpt notes match these filters. Try the full-review themes above or reset the filters.':'No earlier excerpt notes are saved for this topic. Use the full-review themes above, mapped videos and department checklist to assess the available evidence.'}</div>`:''}</details><details open class="section-title"><summary>College and department questions · editorial checklist</summary><ul class="checklist">${subject.college_checks.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><p class="route-note">${esc(subject.route_note)}</p><button type="button" data-open-college="${esc(subject.id)}">Start a college worksheet</button></details><div class="personal-note"><label for="personal-note">My reflections on ${esc(subject.name)}</label><textarea id="personal-note" data-personal-note="${esc(subject.id)}" placeholder="What fits me? What do I still need to verify?">${esc(personal.notes[subject.id]||'')}</textarea><p class="muted" id="note-save-state">Notes save in this browser. Export a backup below.</p></div><h3 class="section-title">${eps.length} mapped ${eps.length===1?'episode':'episodes'}</h3><div class="episode-list">${eps.map(e=>episodeCard(e)).join('')||'<p class="empty">No dedicated episode identified in this channel catalogue.</p>'}</div>${related.length?`<h3 class="section-title">Related viewing · ${related.length}</h3><p class="muted">Related viewing may only mention this field, or describe an adjacent pathway.</p><div class="episode-list">${related.map(e=>episodeCard(e,true)).join('')}</div>`:''}`;
  }
  function compare() {
    const chosen=personal.compare.map(id=>subjects.get(id)).filter(Boolean);
    return `<div class="section-head"><div><p class="eyebrow">Trade-offs side by side</p><h2>Compare specialties</h2><p class="muted">Choose up to four topics. Use aspect and perspective filters to focus. Missing evidence does not imply an advantage or disadvantage.</p></div></div><div class="compare-picker" aria-label="Choose comparison topics">${visibleSubjects().map(s=>`<button type="button" data-compare="${esc(s.id)}" aria-pressed="${personal.compare.includes(s.id)}">${esc(s.name)}</button>`).join('')}</div>${chosen.length?`<div class="compare-grid" style="--cols:${chosen.length}">${chosen.map(s=>`<section class="compare-col"><h3>${esc(s.name)}</h3><p class="muted">${s.note_count} notes · ${s.reviewed_aspects.length}/12 aspects with source material</p><p>${esc(s.fit_question)}</p>${comparisonThemes(s)}${['Pro','Con','Important','College check'].filter(stance=>!state.stance||stance===state.stance).map(stance=>{const notes=notesFor(s.id).filter(n=>n.stance===stance);return `<h4>${stance}</h4>${notes.length?notes.map(n=>sourceCard(n,true)).join(''):'<p class="empty">No reviewed note for this perspective under the current filters.</p>'}`;}).join('')}<details><summary>Department checklist · editorial</summary><ul class="checklist">${s.college_checks.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></details><button type="button" data-subject="${esc(s.id)}">Open specialty</button></section>`).join('')}</div>`:'<div class="empty">Choose a topic above to start your comparison.</div>'}`;
  }
  function comparisonThemes(subject) {
    const groups=(branchReviews.get(subject.id)?.decision_groups||[]).map(g=>({...g,points:g.points.filter(p=>branchSnapshot.matches(p,subject))}));
    if(!groups.some(g=>g.points.length))return '<p class="empty">No full-review decision themes match these filters.</p>';
    return '<h4>Full-review source themes</h4><p class="muted">Attributed benefits and challenges, with their conditions. Counts are source points, not votes.</p>'+groups.map(g=>`<details class="comparison-group" ${['benefits','tradeoffs'].includes(g.id)?'open':''}><summary>${esc(g.name)} (${g.points.length})</summary>${branchSnapshot.pointsList(g.points,2)}</details>`).join('');
  }
  function library() {
    const visible=new Set(visibleSubjects().map(s=>s.id));
    const entries=data.episodes.filter(e=>{
      const ids=[...e.subject_ids,...e.related_subject_ids];
      const relevant=(!state.group&&!state.savedOnly)||ids.some(id=>visible.has(id));
      const query=!state.query||match(e.title,state.query)||ids.some(id=>match(subjects.get(id).name,state.query))||e.chapters.some(c=>match(c.title,state.query))||(readingReviews.get(e.id)?.themes||[]).some(t=>match(t.title+' '+t.summary+' '+t.caveat,state.query));
      const aspect=!state.aspect||e.chapters.some(c=>c.aspects.includes(state.aspect))||data.notes.some(n=>n.video_id===e.id&&n.aspect===state.aspect)||(readingReviews.get(e.id)?.themes||[]).some(t=>t.aspect_ids.includes(state.aspect));
      const stance=!state.stance||data.notes.some(n=>n.video_id===e.id&&n.stance===state.stance)||(videoReviews.get(e.id)?.themes||[]).some(t=>t.kind==='Branch decision'&&t.decision_tags.some(tag=>({Pro:['benefit'],Con:['tradeoff'],Important:['safety','future','verification'],'College check':['college','training']}[state.stance]||[]).includes(tag)));
      return relevant&&query&&aspect&&stance&&(!state.libraryStatus||e.review_status===state.libraryStatus);
    });
    return `<div class="section-head"><div><p class="eyebrow">Videos tab and playlist catalogue</p><h2>Episode library</h2><p class="muted">${entries.length} of ${data.episodes.length} catalogued videos. Includes career interviews, general discussions, preparation episodes and short promotional items. Shorts are not inventoried; the channel header shows about 1K total videos. Chapter links use metadata; titles are not findings.</p><a href="exports/review-queue.csv" download>Download full-summary review queue</a></div></div><div class="inline-filters"><div><label for="library-status">Review status</label><select id="library-status"><option value="">All episodes</option>${['Full caption text reviewed','Selected excerpts reviewed','Not yet reviewed'].map(v=>`<option ${v===state.libraryStatus?'selected':''}>${v}</option>`).join('')}</select></div></div><div class="episode-list">${entries.map(e=>episodeCard(e)).join('')||'<div class="empty">No episodes match these filters.</div>'}</div>`;
  }
  function colleges() {
    const subject=subjects.get(state.subject);
    return `<p class="eyebrow">From interview insights to due diligence</p><h2>College worksheet</h2><p>Evaluate the <strong>department</strong> as well as the university name. Use the branch checklist, gather responses from residents and faculty, and record the source and date of each answer.</p><p class="muted">These worksheets contain your own research. Podcast comments alone do not establish a current university quality ranking, duty policy or placement outcome. Fees, stipends, bonds and recognition need current official documents.</p><form id="college-form" class="worksheet"><div class="form-row"><div><label for="college-name">College / institution</label><input id="college-name" required maxlength="200" placeholder="Enter the college name"></div><div><label for="college-location">City / state (optional)</label><input id="college-location" maxlength="200"></div></div><label for="college-branch">Specialty / pathway</label><select id="college-branch">${data.subjects.map(s=>`<option value="${esc(s.id)}" ${s.id===subject.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select><div id="college-checks">${collegeChecks(subject)}</div><label for="college-notes">Evidence, answers and follow-up</label><textarea id="college-notes" maxlength="20000" placeholder="Example: CT/MRI access — asked a current resident on [date]; still need to verify hands-on rotations."></textarea><button type="submit" class="primary">Add to my college shortlist</button></form><h3>My college shortlist · ${personal.colleges.length}</h3><div id="college-records">${personal.colleges.map(c=>`<article class="worksheet" data-college-id="${esc(c.id)}"><div class="section-head"><div><h3>${esc(c.name)}</h3><p class="muted">${esc(subjects.get(c.subject_id).name)}${c.location?' · '+esc(c.location):''}</p></div><button type="button" class="small-button" data-remove-college="${esc(c.id)}">Remove</button></div><details><summary>Branch checklist · editorial</summary>${collegeChecks(subjects.get(c.subject_id))}</details><label for="record-${esc(c.id)}">My evidence and follow-up</label><textarea id="record-${esc(c.id)}" data-college-note="${esc(c.id)}" maxlength="20000">${esc(c.notes)}</textarea><p class="muted">Your own worksheet · saved locally</p></article>`).join('')||'<div class="empty">No colleges saved yet. Add an institution above to begin.</div>'}</div>`;
  }
  function collegeChecks(s) {return `<ul class="checklist">${s.college_checks.map(q=>`<li>${esc(q)}</li>`).join('')}<li>Verify current tuition, compulsory charges, stipend payment, bond terms, recognition and exit rules using dated official documents.</li><li>Speak independently with residents in different years; verify duty rosters, supervision, grievance support and the time available for learning.</li></ul><p class="route-note">${esc(s.route_note)}</p>`;}
  const conclusions = window.createConclusionsView({data,state,esc,time,subjects,episodes,videoReviews,visibleSubjects,getPersonal:()=>personal});
  const careers = window.createCareerView({data,state,esc,subjects});
  const institutions = window.createInstitutionView({data,state,esc,render,go});
  const bonds = window.createBondView({data,state,esc,render});
  const accreditations = window.createAccreditationView({data,state,esc,render});
  const institutionIds = new Set((data.institutions?.subjects || []).map(s=>s.id));
  const careerIds = new Set((data.careers?.branches || []).map(b=>b.subject_id));
  function render() {
    document.querySelector('.workspace').classList.toggle('institution-workspace',['institutions','bonds','accreditations'].includes(state.view));
    document.querySelectorAll('[data-view]').forEach(button=>{if(button.dataset.view===state.view)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    $('content').innerHTML=({overview,summaries:videoSummaries,compare,library,colleges,conclusions,careers,institutions,bonds,accreditations}[state.view]||overview)();
    topicSidebar();
  }
  function go(view,subject=state.subject) {
    if(view==='accreditations'){state.view=view;state.accFocus='';const hash='#accreditations';if(location.hash===hash)render();else location.hash=hash;return;}
    if(view==='bonds'){state.view=view;state.bondEvidence='';state.bondPriority='';state.bondAiq='';const hash='#bonds';if(location.hash===hash){state.bondState='';render();}else location.hash=hash;return;}
    if(view==='institutions'){const id=institutionIds.has(subject)?subject:(state.shortlistBranch||'radiology');state.shortlistBranch=id;const hash=`#institutions/${id}`;state.view=view;if(location.hash===hash)render();else location.hash=hash;return;}
    if(view==='careers') {subject=careerIds.has(subject)?subject:'radiology';state.careerBranch=subject;}
    if(subjects.has(subject))state.subject=subject;
    state.view=view;
    const suffix=view==='summaries'&&state.video?state.video:view==='conclusions'?(state.conclusionTab||'advice'):view==='careers'?(state.careerTab||'routes'):'';
    const hash=`#${view}/${state.subject}${suffix?'/'+suffix:''}`;
    if(location.hash===hash)render();else location.hash=hash;
  }
  function readHash() {
    const [view,id,vid]=location.hash.slice(1).split('/');
    state.view=['overview','summaries','compare','library','colleges','conclusions','careers','institutions','bonds','accreditations'].includes(view)?view:'overview';
    if(view==='accreditations'){
      state.accFocus=data.accreditations.institutions.some(i=>i.id===id)?id:'';
      if(state.accFocus){for(const key of ['accState','accBody','accCategory','accValidity','accEvidence','accMatrix','accPresence','accManagement','accQuery'])state[key]='';}
    }
    if(view==='bonds')state.bondState=data.state_bonds.rows.some(r=>r.id===id)?id:'';
    if(subjects.has(id))state.subject=id;
    if(view==='institutions'){
      state.shortlistBranch=institutionIds.has(id)?id:'radiology';
      if(vid&&data.institutions.profiles.some(p=>p.id===vid&&p.subject_id===state.shortlistBranch)){
        for(const key of ['shortlistAward','shortlistPriority','shortlistState','shortlistSector','shortlistRoute','shortlistQuery'])state[key]='';
      }
    }
    if(view==='conclusions'&&['advice','ratings','institutions'].includes(vid))state.conclusionTab=vid;
    if(view==='careers') {state.careerBranch=careerIds.has(id)?id:'radiology';state.subject=state.careerBranch;state.careerTab=['routes','seats','salary','shortlist'].includes(vid)?vid:'routes';}
    if(episodes.has(vid)){state.video=vid;const subject=subjects.get(state.subject);if(![...subject.episode_ids,...subject.related_episode_ids].includes(vid))state.summaryAll=true;}
    render();
    if(view==='institutions'&&vid){const target=$('shortlist-'+vid);if(target){target.querySelector('.shortlist-detail').open=true;target.scrollIntoView({block:'start'});}}
  }
  function exportFile(name, value) { const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
  const stats=data.stats;
  if (!stats.episodes_with_selected_caption_briefs) document.querySelector('a[href="exports/video-briefs.md"]')?.remove();
  $('stats').innerHTML=[[stats.episodes_with_full_caption_summaries,'full caption reviews'],[stats.episode_summary_themes,'source-linked main themes'],[stats.subjects,'specialty and career topics'],[stats.hours.toFixed(1)+' h','captioned video collected']].map(([n,label])=>`<div class="stat"><strong>${esc(n)}</strong><span>${esc(label)}</span></div>`).join('');
  $('method-progress').textContent=`Current snapshot: ${stats.subjects} specialty and career topics; ${stats.subjects_with_notes} have excerpt notes. ${stats.catalogued_videos} videos catalogued; Shorts were not inventoried. ${stats.cached_transcripts} transcripts downloaded; ${stats.episodes_with_full_caption_summaries} have detailed summaries after reading the complete cached caption text. ${stats.episodes_with_selected_caption_briefs} additional videos have selected-caption briefs; those still require full-transcript review. Audio and speaker claims have not been independently verified.`;
  $('group-filter').innerHTML+=[...new Set(data.subjects.map(s=>s.group))].map(g=>`<option>${esc(g)}</option>`).join('');
  $('aspect-filter').innerHTML+=data.aspects.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('');
  $('search').addEventListener('input',event=>{state.query=event.target.value.trim();render();});
  for(const [id,key] of [['group-filter','group'],['aspect-filter','aspect'],['stance-filter','stance']]) $(id).addEventListener('change',event=>{state[key]=event.target.value;render();});
  $('reset-filters').addEventListener('click',()=>{Object.assign(state,{query:'',group:'',aspect:'',stance:'',savedOnly:false,libraryStatus:'',summaryQuery:'',importantOnly:false,conclusionProfile:'',conclusionSort:'',institutionQuery:'',institutionSubject:'',institutionSector:'',institutionStance:''});['search','group-filter','aspect-filter','stance-filter'].forEach(id=>{$(id).value='';});render();});
  $('shortlist-only').addEventListener('click',()=>{state.savedOnly=!state.savedOnly;render();});
  $('method-open').addEventListener('click',()=>$('method-dialog').showModal());
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.view){if(b.dataset.view==='summaries'&&!state.summaryAll){const subject=subjects.get(state.subject);if(![...subject.episode_ids,...subject.related_episode_ids].includes(state.video))state.video='';}go(b.dataset.view);}
    if(b.dataset.subject)go(state.view==='careers'&&careerIds.has(b.dataset.subject)?'careers':state.view==='conclusions'&&!b.dataset.openBranch?'conclusions':'overview',b.dataset.subject);
    if(b.dataset.careerTab){state.careerTab=b.dataset.careerTab;go('careers',state.careerBranch);}
    if(b.dataset.conclusionTab){state.conclusionTab=b.dataset.conclusionTab;go('conclusions');}
    if(b.hasAttribute('data-conclusion-profile')){state.conclusionProfile=b.dataset.conclusionProfile;state.conclusionTab='ratings';go('conclusions');}
    if(b.dataset.conclusionTopic){state.conclusionTab='ratings';go('conclusions',b.dataset.conclusionTopic);setTimeout(()=>{const target=document.getElementById(b.dataset.conclusionDimension?'score-'+b.dataset.conclusionDimension:'conclusion-detail');target?.scrollIntoView({behavior:'smooth',block:'start'});},60);}
    if(b.dataset.save){const id=b.dataset.save;personal.saved=personal.saved.includes(id)?personal.saved.filter(x=>x!==id):[...personal.saved,id];save();render();}
    if(b.dataset.compare){const id=b.dataset.compare;if(personal.compare.includes(id))personal.compare=personal.compare.filter(x=>x!==id);else if(personal.compare.length<4)personal.compare.push(id);else{message('Choose up to four comparison topics. Remove a selected topic to add another.');return;}save();render();}
    if(b.dataset.aspect){state.aspect=state.aspect===b.dataset.aspect?'':b.dataset.aspect;$('aspect-filter').value=state.aspect;render();}
    if(b.dataset.openCollege)go('colleges',b.dataset.openCollege);
    if(b.dataset.branchVideos){state.summaryAll=false;state.video='';go('summaries',b.dataset.branchVideos);}
    if(b.dataset.videoSummary){state.video=b.dataset.videoSummary;const s=subjects.get(state.subject);state.summaryAll=![...s.episode_ids,...s.related_episode_ids].includes(state.video);go('summaries');}
    if(b.dataset.jumpTheme){const target=document.getElementById('theme-'+b.dataset.jumpTheme);if(target){target.querySelector('.summary-section')?.setAttribute('open','');target.scrollIntoView({behavior:'smooth',block:'start'});}}
    if(b.dataset.expandSections)document.querySelectorAll('.summary-section').forEach(d=>{d.open=b.dataset.expandSections==='true';});
    if(b.dataset.removeCollege){personal.colleges=personal.colleges.filter(c=>c.id!==b.dataset.removeCollege);save();render();}
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='institution-query'){const pos=event.target.selectionStart;state.institutionQuery=event.target.value;render();const input=$('institution-query');input.focus();input.setSelectionRange(pos,pos);}
    if(event.target.id==='summary-text-search'){const pos=event.target.selectionStart;state.summaryQuery=event.target.value;render();const input=$('summary-text-search');input.focus();input.setSelectionRange(pos,pos);}
    if(event.target.dataset.personalNote){personal.notes[event.target.dataset.personalNote]=event.target.value;save();$('note-save-state').textContent=storageAvailable?'Saved in this browser. Export a backup below.':'Session only — browser storage is unavailable. Export a backup before closing.';}
    if(event.target.dataset.collegeNote){const c=personal.colleges.find(c=>c.id===event.target.dataset.collegeNote);if(c){c.notes=event.target.value;c.updated=new Date().toISOString();save();}}
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='career-branch'){state.careerSector='';state.careerTier='';go('careers',event.target.value);}
    if(event.target.id==='career-sector'){state.careerSector=event.target.value;render();}
    if(event.target.id==='career-tier'){state.careerTier=event.target.value;render();}
    const conclusionControls={'conclusion-sort':'conclusionSort','institution-subject':'institutionSubject','institution-sector':'institutionSector','institution-stance':'institutionStance'};
    if(conclusionControls[event.target.id]){state[conclusionControls[event.target.id]]=event.target.value;render();}
    if(event.target.id==='library-status'){state.libraryStatus=event.target.value;render();}
    if(event.target.id==='college-branch'){$('college-checks').innerHTML=collegeChecks(subjects.get(event.target.value));}
    if(event.target.id==='summary-scope'){state.summaryAll=event.target.value==='all';render();}
    if(event.target.id==='summary-episode'){state.video=event.target.value;state.summaryQuery='';state.importantOnly=false;go('summaries');}
    if(event.target.id==='important-only'){state.importantOnly=event.target.checked;render();}
  });
  document.addEventListener('submit',event=>{
    if(event.target.id!=='college-form')return;event.preventDefault();
    const name=$('college-name').value.trim();if(!name)return;
    personal.colleges.unshift({id:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),name,location:$('college-location').value.trim(),subject_id:$('college-branch').value,notes:$('college-notes').value,updated:new Date().toISOString()});save();render();
  });
  $('export-personal').addEventListener('click',()=>exportFile('my-specialty-notebook.json',personal));
  $('import-personal').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>5000000)throw new Error('Notebook is too large (maximum 5 MB).');const incoming=validate(JSON.parse(await file.text()));personal.saved=[...new Set([...personal.saved,...incoming.saved])];personal.compare=[...new Set([...personal.compare,...incoming.compare])].slice(0,4);personal.notes={...personal.notes,...incoming.notes};const byId=new Map(personal.colleges.map(c=>[c.id,c]));incoming.colleges.forEach(c=>byId.set(c.id,c));personal.colleges=[...byId.values()];save();render();message(storageAvailable?'Notebook imported and merged. Matching notes use the imported version.':'Notebook imported for this session. Export a backup before closing; browser storage is unavailable.');}
    catch(error){message('Import failed: '+error.message);}finally{event.target.value='';}
  });
  if(!storageAvailable)message('Browser storage could not be read. Your changes will stay in this session unless storage becomes available; export a backup.');
  window.addEventListener('hashchange',readHash);readHash();
})();
