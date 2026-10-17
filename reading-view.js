/* Source-linked reading pages. Full and selected-caption reviews stay distinct. */
'use strict';
window.createReadingView = function ({data,state,esc,time,subjects,episodes,aspects,videoReviews,videoBriefs}) {
  const allReviews = new Map([...videoBriefs, ...videoReviews]);
  const matches = (text, query) => String(text).toLocaleLowerCase().includes(query.toLocaleLowerCase());
  const themeMatches = theme => (!state.aspect || theme.aspect_ids.includes(state.aspect)) &&
    (!state.summaryQuery || matches([theme.title,theme.summary,theme.caveat,theme.decision_question,theme.anchor].join(' '),state.summaryQuery));
  const jumpButton = theme => `<button type="button" data-jump-theme="${esc(theme.id)}">${time(theme.anchor_seconds)} · ${esc(theme.title)}</button>`;

  function takeaway(theme) {
    return `<article class="takeaway-card">
      <p class="eyebrow">${esc(theme.focus_label)}</p>
      <h4>${esc(theme.title)}</h4><p>${esc(theme.takeaway)}</p>
      ${theme.caveat?`<p class="takeaway-context"><strong>Keep in context.</strong> ${esc(theme.caveat)}</p>`:''}
      <div class="source"><a href="${esc(theme.anchor_url)}" target="_blank" rel="noopener noreferrer">${time(theme.anchor_seconds)} · Watch this point ↗</a></div>
      <button class="small-button" type="button" data-jump-theme="${esc(theme.id)}">Read the supporting section ↓</button>
    </article>`;
  }

  function section(theme,review,index) {
    return `<article class="theme-summary ${theme.is_highlight?'is-highlight':''}" id="theme-${esc(theme.id)}">
      <details class="summary-section" ${index===0?'open':''}>
        <summary><span class="section-time">${time(theme.anchor_seconds)}</span><span class="section-heading"><span class="section-label">${theme.is_highlight?'★ Important section · ':''}${esc(theme.focus_label)}</span><span class="section-name">${esc(theme.title)}</span></span></summary>
        <div class="section-body"><div class="tags"><span class="pill">${esc(theme.kind)}</span>${theme.aspect_ids.map(id=>`<span class="pill">${esc(aspects.get(id))}</span>`).join('')}</div>
          <p class="section-paraphrase">${esc(theme.summary)}</p>
          <div class="source"><a href="${esc(theme.anchor_url)}" target="_blank" rel="noopener noreferrer">${time(theme.anchor_seconds)} · Go to supporting caption ↗</a><a href="${esc(theme.source_url)}" target="_blank" rel="noopener noreferrer">${time(theme.start_seconds)}–${time(theme.end_seconds)} · Discussion context ↗</a><span>${esc(theme.speaker||review.speaker)}</span></div>
          ${theme.caveat?`<p class="theme-context"><strong>Context / verify:</strong> ${esc(theme.caveat)}</p>`:''}
          ${theme.decision_question?`<p class="question"><strong>Question to investigate · editorial</strong>${esc(theme.decision_question)}</p>`:''}
          <details class="caption-evidence"><summary>Short caption evidence</summary><blockquote lang="${esc(review.language)}">${esc(theme.anchor)}</blockquote><p class="muted">Exact saved-caption anchor, with surrounding discussion linked above. English paraphrases and contextual speaker attribution may need checking against audio.</p></details>
        </div>
      </details>
    </article>`;
  }

  return function videoSummaries() {
    const subject=subjects.get(state.subject);
    const mapped=new Set([...subject.episode_ids,...subject.related_episode_ids]);
    const tier=id=>videoReviews.has(id)?2:videoBriefs.has(id)?1:0;
    const eligible=data.episodes.filter(e=>state.summaryAll||mapped.has(e.id)).sort((a,b)=>tier(b.id)-tier(a.id));
    if(!eligible.some(e=>e.id===state.video))state.video=eligible[0]?.id||'';
    const episode=episodes.get(state.video),review=allReviews.get(state.video);
    const full=review?.review_tier==='full';
    const stats=data.stats;
    const heading=`<p class="eyebrow">Read · Reflect · Return to the source</p><h2>Video summaries & highlights</h2>
      <p class="reading-intro">Start with the key points, then open the sections that matter to you. Important sections are highlighted for navigation; every point keeps its source and limitations.</p>
      <div class="reading-progress"><div><strong>${stats.episodes_with_reading_pages}/${stats.cached_transcripts} video reading pages</strong><p>${stats.episodes_with_full_caption_summaries} complete caption reviews · ${stats.episodes_with_selected_caption_briefs} selected-caption briefs</p></div><a href="exports/review-queue.csv" download>Review status ↓</a></div>
      <div class="inline-filters reading-selectors"><div><label for="summary-scope">Video selection</label><select id="summary-scope"><option value="branch" ${!state.summaryAll?'selected':''}>${esc(subject.name)} · primary and related</option><option value="all" ${state.summaryAll?'selected':''}>All catalogued videos</option></select></div><div><label for="summary-episode">Interview</label><select id="summary-episode">${eligible.map(e=>`<option value="${esc(e.id)}" ${e.id===state.video?'selected':''}>${tier(e.id)===2?'Full review':tier(e.id)===1?'Partial brief':'Not collected'} · ${esc(e.title)}</option>`).join('')}</select></div></div>`;
    if(!episode)return heading+'<p class="empty">No dedicated or related video is mapped to this topic. Choose all catalogued videos to browse the collection.</p>';
    if(!review)return heading+`<section class="summary-pending"><h3>Transcript not collected</h3><p>${esc(episode.title)}</p><p>Collection status: ${esc(episode.transcript_status)}. This short item is excluded from the downloaded transcript collection.</p><a href="${esc(episode.url)}" target="_blank" rel="noopener noreferrer">Watch video ↗</a></section>`;
    const matching=review.themes.filter(themeMatches);
    const shown=matching.filter(t=>!state.importantOnly||t.is_highlight);
    const highlights=matching.filter(t=>t.is_highlight);
    const chapters=(episode.chapters||[]);
    const overview=`<section class="video-overview" data-video-id="${esc(review.video_id)}" data-review-tier="${full?'full':'selected'}"><div class="tags"><span class="pill ${full?'pro':'important'}">${full?'Full caption text summarized':'Selected captions reviewed'}</span><span class="pill">${esc(review.language)} caption track · ${time(review.duration_seconds)}</span><span class="pill">About ${review.reading_minutes} min to read</span></div>
      <h3>${esc(review.title)}</h3>${full?`<p class="review-overview">${esc(review.overview)}</p>`:''}
      ${full?`<p class="muted">${esc(review.speaker)} · ${review.caption_segments_reviewed}/${review.caption_segments_total} cached caption segments read. Audio and speaker claims have not been independently verified.</p>`:`<div class="review-scope"><strong>Partial brief · full-video summary still pending</strong><p>These ${review.themes.length} highlights cover selected caption windows. They do not cover every main theme, establish the full interview’s conclusion or replace a complete transcript review. Audio and speaker claims have not been independently verified.</p></div>`}
      <div class="actions"><a href="${esc(review.url)}" target="_blank" rel="noopener noreferrer">Watch full video ↗</a><a href="exports/${full?'video-summaries':'video-briefs'}.md" download>Download ${full?'full summaries':'selected-caption briefs'} ↓</a></div></section>`;
    return heading+overview+`
      <div class="reading-tools"><div><label for="summary-text-search">Search within this video</label><input id="summary-text-search" type="search" placeholder="Try training, income, work, safety…" value="${esc(state.summaryQuery||'')}"></div><label class="important-toggle"><input id="important-only" type="checkbox" ${state.importantOnly?'checked':''}> Important sections only</label></div>
      ${highlights.length?`<section class="key-takeaways" aria-label="Key takeaways"><div class="section-head"><div><p class="eyebrow">At a glance · ${full?'full-caption review':'selected excerpts only'}</p><h3>Points to keep in mind</h3></div></div><div class="takeaway-grid">${highlights.map(takeaway).join('')}</div><p class="muted">Emphasis is editorial, not a quality score or a claim of agreement between doctors. Pros and cons are labelled only where the reviewed evidence supports them.</p></section>`:''}
      <div class="section-head reading-section-head"><div><h3>${full?'Interview sections':'Reviewed excerpt sections'}</h3><p class="muted">${shown.length}/${review.themes.length} sections shown${state.aspect?' · '+esc(aspects.get(state.aspect)):''}. Open a section for the paraphrase, context and timestamp links.</p></div><div class="actions"><button type="button" class="small-button" data-expand-sections="true">Expand shown sections</button><button type="button" class="small-button" data-expand-sections="false">Collapse sections</button></div></div>
      <details class="summary-toc"><summary>Jump to a section · ${shown.length}</summary><nav class="theme-index" aria-label="Jump to a summary theme">${shown.map(jumpButton).join('')}</nav></details>
      <div class="theme-summary-list">${shown.map((t,i)=>section(t,review,i)).join('')||'<p class="empty">No sections match. Clear the video search, turn off “Important sections only”, or reset the decision-aspect filter.</p>'}</div>
      ${chapters.length?`<details class="chapter-navigation"><summary>Full video chapter navigation · ${chapters.length} links</summary><p class="muted">Channel-provided metadata, not reviewed findings. Chapters may be misaligned; use them to explore material not covered by this ${full?'review':'partial brief'}.</p>${chapters.map(c=>`<a class="chapter" href="https://www.youtube.com/watch?v=${esc(episode.id)}&t=${c.start}s" target="_blank" rel="noopener noreferrer">${time(c.start)} · ${esc(c.title)}</a>`).join('')}</details>`:''}`;
  };
};
