/* Decision-oriented reading of authored source themes. No automated sentiment labels. */
window.createBranchView = ({state, esc, time, branchReviews, videoBriefs}) => {
  const stanceTags = {'Pro':['benefit'], 'Con':['tradeoff'], 'Important':['safety','future','verification'], 'College check':['college','training']};
  const matches = (point, subject) => (!state.aspect || (point.aspect_ids || []).includes(state.aspect)) &&
    (!state.stance || (point.decision_tags || []).some(tag => stanceTags[state.stance]?.includes(tag)) || (!point.decision_tags && point.stance === state.stance)) &&
    (!state.query || [subject.name, point.title, point.summary, point.speaker, point.caveat].join(' ').toLocaleLowerCase().includes(state.query.toLocaleLowerCase()));
  function variedSources(points) {
    const queues = new Map();
    for (const point of points) {
      if (!queues.has(point.video_id)) queues.set(point.video_id, []);
      queues.get(point.video_id).push(point);
    }
    const result = [];
    while (result.length < points.length) {
      for (const queue of queues.values()) if (queue.length) result.push(queue.shift());
    }
    return result;
  }
  function sourcePoint(point, index = 0) {
    const full = ['episode_theme', 'shared_training_theme'].includes(point.type);
    return `<details class="branch-source" data-branch-point="${esc(point.video_id)}:${esc(point.theme_id || point.note_id)}">
      <summary><span class="branch-point-number">${index + 1}</span><span><strong>${esc(point.title)}</strong><small><span class="branch-speaker" title="${esc(point.speaker)}">${esc(point.speaker)}</span><span>${time(point.start_seconds)}</span></small></span></summary>
      <div class="branch-source-body"><p>${esc(point.summary)}</p>
        <div class="source"><a href="${esc(point.source_url)}" target="_blank" rel="noopener noreferrer">${time(point.start_seconds)} · Watch this point ↗</a><span>${esc(point.review_scope)}</span></div>
        ${point.caveat ? `<p class="theme-context"><strong>Context:</strong> ${esc(point.caveat)}</p>` : ''}
        ${point.decision_question ? `<p class="question"><strong>Question to investigate · editorial</strong>${esc(point.decision_question)}</p>` : ''}
        <details class="branch-evidence"><summary>Source & caption evidence</summary><p>${esc(point.episode_title || '')}</p><p class="muted">${esc(point.speaker)}</p>${point.anchor ? `<blockquote lang="${esc(point.language)}">${esc(point.anchor)}</blockquote>` : ''}<p class="muted">Discussion: ${time(point.context_start_seconds)}–${time(point.context_end_seconds)}. English paraphrase of saved captions; audio and claims have not been independently verified.</p></details>
        <button type="button" class="small-button" data-video-summary="${esc(point.video_id)}">${full ? 'Read full video summary' : videoBriefs.has(point.video_id) ? 'Read partial video brief' : 'See review status'}</button>
      </div></details>`;
  }
  function pointsList(points, limit = 3) {
    if (!points.length) return '<p class="branch-gap">No source point under the current filters. This is a coverage gap, not a finding about the specialty.</p>';
    points = variedSources(points);
    return points.slice(0, limit).map(sourcePoint).join('') + (points.length > limit ? `<details class="branch-more"><summary>Show ${points.length-limit} more source ${points.length-limit===1?'point':'points'}</summary>${points.slice(limit).map((p,i)=>sourcePoint(p,i+limit)).join('')}</details>` : '');
  }
  const render = subject => {
    const branch = branchReviews.get(subject.id);
    if (!branch) return '';
    const groups = (branch.decision_groups || []).map(g=>({...g,points:g.points.filter(p=>matches(p,subject))}));
    const uniqueCount = new Set(groups.flatMap(g=>g.points.map(p=>p.video_id+':'+p.theme_id))).size;
    const aspects = branch.theme_groups.filter(g=>!state.aspect || g.aspect_id===state.aspect).map(g=>({...g,points:g.points.filter(p=>matches({...p,aspect_ids:p.aspect_ids || [g.aspect_id]},subject))}));
    const shared = (branch.shared_training_points || []).filter(p=>matches(p,subject));
    return `<section class="branch-snapshot" aria-label="Source-backed branch decisions">
      <div class="section-head"><div><p class="eyebrow">Build your shortlist</p><h3>Read the branch from every angle.</h3></div><button type="button" data-branch-videos="${esc(subject.id)}">Browse this topic’s videos</button></div>
      <div class="branch-coverage"><strong>${branch.full_summary_count} / ${branch.primary_episode_count}</strong><span>mapped primary videos fully reviewed${branch.selected_brief_count?` · ${branch.selected_brief_count} partial briefs remain`:''}<br>${branch.related_episode_count} related videos are listed separately.</span></div>
      <p class="branch-reading-note">${uniqueCount} distinct source themes ${state.aspect||state.stance||state.query?'match your filters':'organised below'}. Benefits and challenges are attributed perspectives, not universal outcomes. A point may belong to more than one section. Open a heading to read the reasoning and its context.</p>
      ${branch.primary_episode_count===0?'<p class="empty">No dedicated primary interview is mapped for this topic. Related viewing and editorial questions are starting points; they do not establish specialty-specific evidence.</p>':''}
      <div class="branch-decisions">${groups.map(g=>`<section class="branch-decision-group" data-decision-group="${esc(g.id)}"><div class="decision-group-head"><p class="eyebrow">${esc(g.name)}</p><span>${g.points.length}</span></div><p class="decision-group-question">${esc(g.question)}</p>${pointsList(g.points)}</section>`).join('')}</div>
      ${shared.length?`<details class="branch-shared"><summary>Shared training & wider residency discussion · ${shared.length} themes</summary><p class="muted">These parts of the mapped interviews concern general preparation, finances, resident rights or experiences in other departments. Read them in context; they do not establish a finding about this specialty.</p>${pointsList(shared,4)}</details>`:''}
      <details class="branch-aspect-directory"><summary>Explore all twelve decision aspects · source index</summary><p class="muted">This index includes the same full-review themes and any earlier partial notes. General exam preparation and personal discussions stay in the video summaries.</p>${aspects.map(g=>`<details class="branch-theme"><summary>${esc(g.name)} <span class="muted">· ${g.points.length} source points</span></summary>${pointsList(g.points,5)}</details>`).join('')}</details>
    </section>`;
  };
  return Object.assign(render, {sourcePoint, pointsList, matches});
};
