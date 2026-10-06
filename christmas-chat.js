/* Christmas HQ — Community + Family Chat */
(() => {
  'use strict';
  if (window.__hqChatLoaded) return;
  window.__hqChatLoaded = true;

  const cloud = () => window.ChristmasHQFamilyCloud || null;
  const db = () => cloud()?.client || null;
  const session = () => cloud()?.session || null;
  const familyId = () => cloud()?.familyId || '';

  const chat = {
    mode: 'community',
    categoryId: '',
    threadId: '',
    categories: [],
    threads: [],
    messages: [],
    currentThread: null,
    reads: {},
    loading: false,
    error: '',
    loadedKey: '',
    members: [],
    membersError: '',
    panelOpen: {family:true, community:false}
  };

  /* Device-only chat preferences: community you've left, people you've hidden,
     family chat hidden here when the server won't let you leave. */
  const PREFS_KEY='christmas-hq-chat-prefs';
  function readPrefs(){
    try{
      const v=JSON.parse(localStorage.getItem(PREFS_KEY)||'{}')||{};
      return {communityLeft:!!v.communityLeft,hidden:(v.hidden&&typeof v.hidden==='object')?v.hidden:{},familyHidden:(v.familyHidden&&typeof v.familyHidden==='object')?v.familyHidden:{}};
    }catch(e){return {communityLeft:false,hidden:{},familyHidden:{}};}
  }
  let prefs=readPrefs();
  function savePrefs(){try{localStorage.setItem(PREFS_KEY,JSON.stringify(prefs));}catch(e){}}
  const isHiddenUser=id=>!!(id && prefs.hidden[id] && id!==session()?.user?.id);
  const familyChatHidden=()=>!!(familyId() && prefs.familyHidden[familyId()]);
  const visibleThreads=()=>chat.mode==='community'?chat.threads.filter(t=>!isHiddenUser(t.created_by)):chat.threads;

  const x = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  function when(v){
    if(!v) return '';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('en-AU',{
      day:'numeric',month:'short',hour:'numeric',minute:'2-digit'
    });
  }


  function isUnread(thread){
    if(!session()?.user || !thread?.id) return false;
    const seen = chat.reads[thread.id];
    if(!seen) return true;
    return new Date(thread.updated_at || thread.created_at || 0) > new Date(seen);
  }

  function christmasCategoryOkay(name, description){
    const value=(String(name||'')+' '+String(description||'')).toLowerCase();
    return /(christmas|xmas|gift|present|santa|reindeer|tree|ornament|decor|light|recipe|food|ham|prawn|turkey|dessert|baking|tradition|carol|advent|wreath|stocking|elf|festive|boxing|holiday|party|secret santa)/i.test(value);
  }

  function updateNavBadge(){
    if(!nav) return;
    const button=nav.querySelector('[data-nav="chat"]');
    if(!button) return;
    button.querySelector('.hq-chat-nav-badge')?.remove();
    if(!session()?.user) return;
    const total=chat.threads.filter(isUnread).length;
    if(!total) return;
    const badge=document.createElement('span');
    badge.className='hq-chat-nav-badge';
    badge.textContent=total>9?'9+':String(total);
    button.appendChild(badge);
  }

  function closeChatModal(){
    document.getElementById('hqChatModal')?.remove();
  }

  function openChatModal(title, bodyHtml, onSubmit){
    closeChatModal();
    const modal=document.createElement('div');
    modal.id='hqChatModal';
    modal.innerHTML=
      '<div class="hq-chat-modal-card">'+
        '<div class="hq-chat-modal-head"><b>'+x(title)+'</b><button type="button" data-hq-chat-modal-close>×</button></div>'+
        '<form id="hqChatModalForm">'+bodyHtml+
          '<div class="hq-chat-modal-actions"><button class="btn alt" type="button" data-hq-chat-modal-close>Cancel</button><button class="btn" type="submit">Save</button></div>'+
        '</form>'+
      '</div>';
    document.body.appendChild(modal);
    modal.querySelector('#hqChatModalForm').addEventListener('submit', async event=>{
      event.preventDefault();
      try{
        await onSubmit(new FormData(event.target));
        closeChatModal();
      }catch(err){
        notice(err.message || 'Could not save that change.');
      }
    });
  }

  function openEditThread(thread){
    openChatModal(
      'Edit topic',
      '<label>Topic title<input class="field" name="title" maxlength="120" required value="'+x(thread.title)+'"></label>'+
      '<label>Post<textarea class="field" name="body" rows="7" maxlength="5000" required>'+x(thread.body||'')+'</textarea></label>',
      async data=>{
        const title=String(data.get('title')||'').trim();
        const body=String(data.get('body')||'').trim();
        const now=new Date().toISOString();
        const r=await db().from('chat_threads').update({title,body,edited_at:now,updated_at:now}).eq('id',thread.id);
        if(r.error) throw r.error;
        await loadThread(thread.id);
        notice('Topic updated');
      }
    );
  }

  function openEditMessage(message){
    openChatModal(
      'Edit reply',
      '<label>Reply<textarea class="field" name="body" rows="6" maxlength="5000" required>'+x(message.body||'')+'</textarea></label>',
      async data=>{
        const body=String(data.get('body')||'').trim();
        const now=new Date().toISOString();
        const r=await db().from('chat_messages').update({body,edited_at:now,updated_at:now}).eq('id',message.id);
        if(r.error) throw r.error;
        await loadThread(chat.threadId);
        notice('Reply updated');
      }
    );
  }

  function openReport(targetType, targetId){
    if(!session()?.user){notice('Sign in through Settings to report a post.');return;}
    openChatModal(
      'Report post',
      '<label>Reason<select class="field" name="reason" required>'+
        '<option value="off_topic">Off-topic / not Christmas</option>'+
        '<option value="spam">Spam</option>'+
        '<option value="abuse">Abusive or harassing</option>'+
        '<option value="unsafe">Unsafe content</option>'+
        '<option value="other">Other</option>'+
      '</select></label>'+
      '<label>Extra details<textarea class="field" name="details" rows="4" maxlength="1000" placeholder="Optional"></textarea></label>',
      async data=>{
        const row={
          reporter_user_id:session().user.id,
          reason:String(data.get('reason')||'other'),
          details:String(data.get('details')||'').trim()
        };
        row[targetType==='thread'?'thread_id':'message_id']=targetId;
        const r=await db().from('chat_reports').insert(row);
        if(r.error){
          if(String(r.error.code||'')==='23505') throw new Error('You already reported this post.');
          throw r.error;
        }
        notice('Report sent for review');
      }
    );
  }

  function header(){
    mast.dataset.hqPage='chat';
    mast.innerHTML =
      '<div class="hq-page-brand">'+
        '<div class="hq-page-title">Christmas Chat</div>'+
        '<div class="hq-page-subbrand">Christmas HQ</div>'+
        '<div class="hq-brand-flourish">✦ · ✦</div>'+
      '</div>';
  }

  function ensureNav(){
    if(!nav) return;
    let b = nav.querySelector('[data-nav="chat"]');
    if(!b){
      b=document.createElement('button');
      b.dataset.nav='chat';
      b.innerHTML='<i>💬</i><span>Chat</span>';
      const explore=nav.querySelector('[data-nav="explore"]');
      explore ? nav.insertBefore(b,explore) : nav.appendChild(b);
    }
    const count=nav.querySelectorAll('button[data-nav]').length;
    nav.style.gridTemplateColumns='repeat('+count+',minmax(0,1fr))';
    nav.querySelectorAll('button[data-nav]').forEach(btn=>{
      const current=btn.dataset.nav===ui.tab;
      btn.classList.toggle('current',current);
      current ? btn.setAttribute('aria-current','page') : btn.removeAttribute('aria-current');
    });
    updateNavBadge();
  }

  function addHomeShortcut(){
    if(ui.tab!=='home') return;
    const grid=screen.querySelector('.quick-grid');
    if(!grid || grid.querySelector('[data-target="chat"]')) return;
    const b=document.createElement('button');
    b.className='tap-card';
    b.dataset.action='shortcut';
    b.dataset.target='chat';
    b.innerHTML='<span class="big">💬</span><strong>Christmas chat</strong><small>Community topics & private family threads</small>';
    grid.appendChild(b);
  }

  function switcher(){
    return '<div class="hq-chat-switch">'+
      '<button data-hq-chat-mode="community" class="'+(chat.mode==='community'?'selected':'')+'">🌍 Community<small>Christmas HQ world</small></button>'+
      '<button data-hq-chat-mode="family" class="'+(chat.mode==='family'?'selected':'')+'">🔒 Family<small>Private to your family</small></button>'+
    '</div>';
  }

  function settingsCallout(familyOnly){
    return '<div class="hq-chat-callout">'+
      '<b>'+(familyOnly?'🔒 Connect your family first':'🔐 Sign in to post in the Community')+'</b>'+
      '<p>'+(familyOnly
        ? 'Family Chat is visible only to people in your connected Christmas HQ family.'
        : 'Anyone can read Community topics. To start a topic or reply, sign in (or create a free account) with Family Cloud — it only takes a minute.')+'</p>'+
      '<button class="btn" type="button" data-hq-chat-settings aria-label="Sign in with Family Cloud in Settings">'+(familyOnly?'Open Family Cloud →':'Sign in →')+'</button>'+
    '</div>';
  }

  function categoryForm(){
    if(!session()) return chat.mode==='community' ? settingsCallout(false) : '';
    if(chat.mode==='family' && !familyId()) return settingsCallout(true);
    return '<details class="hq-chat-create"><summary>＋ New folder</summary>'+
      '<form data-hq-chat-category-form>'+
        '<label>Folder name<input class="field" name="name" maxlength="80" placeholder="e.g. Christmas lights" required></label>'+
        '<label>Short description<input class="field" name="description" maxlength="240" placeholder="What belongs in this folder?"></label>'+
        '<button class="btn full" type="submit">Create folder</button>'+
      '</form></details>';
  }

  function cards(){
    if(!chat.categories.length){
      return '<div class="empty"><div class="big">💬</div><b>No folders yet</b><p>Start the first Christmas conversation.</p></div>';
    }
    const counts={}, unread={};
    visibleThreads().forEach(t=>{
      counts[t.category_id]=(counts[t.category_id]||0)+1;
      if(isUnread(t)) unread[t.category_id]=(unread[t.category_id]||0)+1;
    });
    return '<div class="hq-chat-list">'+chat.categories.map(c=>
      '<button class="hq-chat-card" data-hq-chat-category="'+x(c.id)+'">'+
        '<span class="hq-chat-icon">'+(chat.mode==='family'?'🔒':c.is_system?'🎄':'💬')+'</span>'+
        '<span class="hq-chat-copy"><strong>'+x(c.name)+(unread[c.id]?'<span class="hq-chat-new">'+unread[c.id]+' NEW</span>':'')+'</strong><small>'+x(c.description||'Christmas discussion')+'</small><em>'+
        (counts[c.id]||0)+' '+((counts[c.id]||0)===1?'topic':'topics')+'</em></span>'+
        '<span class="hq-chat-chevron">›</span>'+
      '</button>'
    ).join('')+'</div>';
  }

  function hub(){
    const family=chat.mode==='family';
    if(!family && prefs.communityLeft) return switcher()+leftCommunityCallout();
    if(family && familyId() && familyChatHidden()) return switcher()+hiddenFamilyCallout();
    const topicCount=visibleThreads().length;
    return switcher()+
      (family
        ? '<button type="button" class="hq-chat-intro private hq-chat-intro-btn" data-hq-dm-open><span>🔒</span><div><b>Your private Family Chat</b>'+
            '<p>Tap to find a family member and start a private one-to-one chat.</p></div><span class="hq-chat-chevron">›</span></button>'
        : '<button type="button" class="hq-chat-intro hq-chat-intro-btn" data-hq-chat-open-community aria-label="Open Christmas Community topics">'+
            '<span>🌍</span><div><b>Christmas Community</b>'+
            '<p>Christmas-only discussion for the wider Christmas HQ community.</p>'+
            '<em>'+topicCount+' '+(topicCount===1?'topic':'topics')+' · '+chat.categories.length+' '+(chat.categories.length===1?'folder':'folders')+' · Tap to open</em></div>'+
            '<span class="hq-chat-chevron" aria-hidden="true">›</span></button>')+(!family?'<a class="btn full" href="https://www.facebook.com/share/196KiUncX6/" target="_blank" rel="noopener noreferrer" style="display:flex;justify-content:center;text-decoration:none;margin:16px 0">🌍 Join our Facebook community ↗</a>':'')+      (family && !familyId() ? settingsCallout(true) :
        '<div class="section-line"><h2>'+(family?'Family folders':'Christmas folders')+'</h2><span class="pill">'+chat.categories.length+'</span></div>'+
        categoryForm()+cards()+
        (family ? familyMembersPanel() : communityMembersPanel())
      )+
      (!family ? '<div class="hq-chat-rules"><b>🎄 Keep it Christmas</b><span>Public topics are for Christmas subjects only.</span></div>' : '');
  }

  /* Community "open" view: every topic across folders + post box / sign-in prompt */
  function allTopicsPage(){
    const rows=visibleThreads();
    const folderName=id=>(chat.categories.find(c=>c.id===id)||{}).name||'Community';
    return switcher()+
      '<button class="btn alt hq-chat-back" data-hq-chat-back="hub">← Community home</button>'+
      '<div class="hq-chat-folder-head"><span>🌍</span><div><h2>Christmas Community</h2><p>Latest topics from every Christmas folder.</p></div></div>'+
      threadForm(true)+
      '<div class="section-line"><h2>Latest topics</h2><span class="pill">'+rows.length+'</span></div>'+
      '<div class="hq-chat-list">'+(rows.length ? rows.map(t=>
        '<button class="hq-chat-card" data-hq-chat-thread="'+x(t.id)+'">'+
          '<span class="hq-chat-icon">'+(t.is_pinned?'📌':'💬')+'</span>'+
          '<span class="hq-chat-copy"><strong>'+x(t.title)+(isUnread(t)?'<span class="hq-chat-new">NEW</span>':'')+'</strong><small>'+x(folderName(t.category_id))+' · '+x(t.author_name||'Christmas HQ member')+' · '+x(when(t.updated_at||t.created_at))+'</small><em>'+x((t.body||'').slice(0,130))+'</em></span>'+
          '<span class="hq-chat-chevron">›</span>'+
        '</button>'
      ).join('') : '<div class="empty"><div class="big">🎄</div><b>No community topics yet</b><p>'+(session()?'Be the first — start a topic above.':'Sign in above to start the very first one.')+'</p></div>')+'</div>'+
      '<div class="section-line"><h2>Browse folders</h2><span class="pill">'+chat.categories.length+'</span></div>'+
      cards();
  }

  function currentCategory(){
    return chat.categories.find(c=>c.id===chat.categoryId)||null;
  }

  function threadForm(pickFolder){
    if(!session()) return settingsCallout(false);
    if(chat.mode==='family' && !familyId()) return settingsCallout(true);
    const picker=pickFolder && chat.categories.length
      ? '<label>Folder<select class="field" name="category_id" required>'+chat.categories.map(c=>'<option value="'+x(c.id)+'">'+x(c.name)+'</option>').join('')+'</select></label>'
      : '';
    return '<details class="hq-chat-create"'+(pickFolder?' open':'')+'><summary>＋ Start a new topic</summary>'+
      '<form data-hq-chat-thread-form>'+picker+
        '<label>Topic title<input class="field" name="title" maxlength="120" required></label>'+
        '<label>First post<textarea class="field" name="body" rows="5" maxlength="5000" required></textarea></label>'+
        '<button class="btn full" type="submit">Post topic</button>'+
      '</form></details>';
  }

  function categoryPage(){
    const c=currentCategory();
    if(!c) return hub();
    const rows=visibleThreads().filter(t=>t.category_id===c.id);
    return switcher()+
      '<button class="btn alt hq-chat-back" data-hq-chat-back="hub">← All folders</button>'+
      '<div class="hq-chat-folder-head"><span>'+(chat.mode==='family'?'🔒':'🎄')+'</span><div><h2>'+x(c.name)+'</h2><p>'+x(c.description||'')+'</p></div></div>'+
      threadForm()+
      '<div class="section-line"><h2>Topics</h2><span class="pill">'+rows.length+'</span></div>'+
      '<div class="hq-chat-list">'+(rows.length ? rows.map(t=>
        '<button class="hq-chat-card" data-hq-chat-thread="'+x(t.id)+'">'+
          '<span class="hq-chat-icon">'+(t.is_pinned?'📌':'💬')+'</span>'+
          '<span class="hq-chat-copy"><strong>'+x(t.title)+(isUnread(t)?'<span class="hq-chat-new">NEW</span>':'')+'</strong><small>'+x(t.author_name||'Christmas HQ member')+' · '+x(when(t.updated_at||t.created_at))+(t.edited_at?' · edited':'')+'</small><em>'+x((t.body||'').slice(0,130))+'</em></span>'+
          '<span class="hq-chat-chevron">›</span>'+
        '</button>'
      ).join('') : '<div class="empty"><div class="big">🎄</div><b>No topics yet</b><p>Start the first conversation.</p></div>')+'</div>';
  }

  function replyForm(){
    if(!session()) return settingsCallout(false);
    if(chat.currentThread?.is_locked) return '<div class="callout">🔒 This topic is locked.</div>';
    return '<form class="hq-chat-reply" data-hq-chat-reply-form>'+
      '<textarea class="field" name="body" rows="3" maxlength="5000" placeholder="Write a reply..." required></textarea>'+
      '<button class="btn" type="submit">Send reply</button>'+
    '</form>';
  }

  function shownMessages(){
    return chat.mode==='community'?chat.messages.filter(m=>!isHiddenUser(m.created_by)):chat.messages;
  }
  function hiddenReplyCount(){
    return chat.messages.length-shownMessages().length;
  }

  /* ---- Chat members: remove (organiser) / leave (yourself) ---- */
  function initial(name){
    return x(String(name||'?').trim().charAt(0).toUpperCase()||'?');
  }

  function memberRow(name, tags, actions){
    return '<li class="hq-chat-member"><span class="hq-chat-avatar">'+initial(name)+'</span>'+
      '<span class="hq-chat-member-name"><b>'+x(name)+'</b>'+(tags?'<small>'+tags+'</small>':'')+'</span>'+
      '<span class="hq-chat-member-actions">'+actions+'</span></li>';
  }

  function familyMembersPanel(){
    const me=session()?.user?.id||'';
    const owner=!!cloud()?.isOwner;
    const list=chat.members||[];
    const rows=list.map(m=>{
      const name=m.display_name||'Family member';
      const self=m.user_id===me;
      const tags=[m.role==='owner'?'★ Organiser':'',self?'You':''].filter(Boolean).join(' · ');
      let act='';
      if(self) act='<button type="button" class="btn small warn" data-hq-chat-leave="family" aria-label="Leave Family HQ">🚪 Leave HQ</button>';
      else if(owner && !self) act='<button type="button" class="btn small warn" data-hq-chat-remove-member="'+x(m.user_id)+'" data-name="'+x(name)+'" aria-label="Remove '+x(name)+' from Family HQ">✕ Remove from HQ</button>';
      return memberRow(name,tags,act);
    }).join('');
    const note=owner
      ? 'Removing someone from HQ removes their family access and recorded shared list contributions. Their personal data is kept; their shared music becomes private to them. Older items without a recorded creator stay. The organiser can hand over this HQ to another member, or close it when alone, before leaving.'
      : 'Only the family organiser (★) can remove people. Leaving HQ also removes your recorded shared list contributions. Your personal data is kept.';
    return '<details class="hq-chat-members" data-hq-chat-panel="family"'+(chat.panelOpen.family?' open':'')+'><summary>👥 Family Chat members <span class="pill green">'+list.length+'</span></summary>'+
      (chat.membersError?'<p class="hq-chat-members-error">'+x(chat.membersError)+'</p>':'')+
      (rows?'<ul class="hq-chat-member-list">'+rows+'</ul>':'<p class="hq-chat-members-note">Loading family members…</p>')+
      '<p class="hq-chat-members-note">'+note+'</p>'+
      (rows && !list.some(m=>m.user_id===me)?'<button type="button" class="btn small warn" data-hq-chat-leave="family" aria-label="Leave Family Chat">🚪 Leave Family Chat</button>':'')+
    '</details>';
  }

  function communityMembersPanel(){
    const me=session()?.user?.id||'';
    const seen={};
    chat.threads.forEach(t=>{if(t.created_by && t.created_by!==me && !seen[t.created_by]) seen[t.created_by]=t.author_name||'Christmas HQ member';});
    const people=Object.keys(seen).filter(id=>!prefs.hidden[id]).slice(0,12);
    const hidden=Object.keys(prefs.hidden);
    const rows=people.map(id=>memberRow(seen[id],'Posts in Community',
      '<button type="button" class="btn small warn" data-hq-chat-hide-user="'+x(id)+'" data-name="'+x(seen[id])+'" aria-label="Remove '+x(seen[id])+' from my Community Chat">✕ Remove</button>')).join('');
    const hiddenRows=hidden.map(id=>memberRow(prefs.hidden[id]||'Christmas HQ member','Removed from your chat',
      '<button type="button" class="btn small alt" data-hq-chat-unhide-user="'+x(id)+'" aria-label="Show '+x(prefs.hidden[id]||'this person')+' again">↺ Show again</button>')).join('');
    return '<details class="hq-chat-members" data-hq-chat-panel="community"'+(chat.panelOpen.community?' open':'')+'><summary>👥 Community people <span class="pill">'+people.length+'</span></summary>'+
      (rows?'<ul class="hq-chat-member-list">'+rows+'</ul>':'<p class="hq-chat-members-note">No other people have posted in the folders loaded here yet.</p>')+
      (hiddenRows?'<div class="hq-chat-members-sub">Removed from your chat</div><ul class="hq-chat-member-list">'+hiddenRows+'</ul>':'')+
      '<p class="hq-chat-members-note">Community Chat is open to every Christmas HQ user, so nobody can be kicked out of it. “Remove” hides that person’s topics and replies on this phone. Use ⚑ Report on a post for anything that breaks the rules.</p>'+
      '<button type="button" class="btn small warn" data-hq-chat-leave="community" aria-label="Leave Community Chat on this phone">🚪 Leave Community Chat</button>'+
    '</details>';
  }

  function leftCommunityCallout(){
    return '<div class="hq-chat-callout"><b>🚪 You left Community Chat</b>'+
      '<p>Community topics are hidden on this phone. Your Family Chat still works.</p>'+
      '<button type="button" class="btn" data-hq-chat-rejoin="community">Rejoin Community Chat</button></div>';
  }

  function hiddenFamilyCallout(){
    return '<div class="hq-chat-callout"><b>🙈 Family Chat is hidden on this phone</b>'+
      '<p>You are still a member of this family on the server. Ask the family organiser to remove you if you want to leave completely.</p>'+
      '<button type="button" class="btn" data-hq-chat-rejoin="family">Show Family Chat again</button></div>';
  }

  async function loadMembers(){
    chat.membersError='';
    const c=cloud();
    if(!c || !familyId()){chat.members=[];return;}
    try{
      chat.members=typeof c.refreshMembers==='function' ? await c.refreshMembers() : (c.members||[]);
    }catch(e){
      chat.members=c.members||[];
      chat.membersError='Could not load the member list right now.';
    }
  }

  async function removeChatMember(userId, name){
    const c=cloud();
    if(!c || typeof c.removeMember!=='function'){notice('Family Cloud is still connecting.');return;}
    if(!confirm('Remove '+name+' from Family HQ?\n\nThey will lose access to Family Chat and shared family plans. Their recorded contributions will be removed from shared family lists, and their shared music will become private to them.\n\nTheir personal lists, gifts, budget, music and other phone data will be kept. Older shared items without a recorded creator will stay. They will need a new invite to rejoin.')) return;
    try{
      await c.removeMember(userId);
      chat.members=(c.members||[]).filter(m=>m.user_id!==userId);
      notice(name+' removed from Family HQ');
    }catch(err){
      notice(err.message||'Could not remove that member.');
    }
    chat.loadedKey='';
    await loadHub(true);
  }

  async function leaveChat(kind){
    if(kind==='community'){
      if(!confirm('Leave Community Chat?\n\nCommunity topics will be hidden on this phone. You can rejoin any time, and your Family Chat isn’t affected.')) return;
      prefs.communityLeft=true;savePrefs();
      chat.categoryId='';chat.threadId='';chat.currentThread=null;chat.messages=[];
      draw(true);notice('You left Community Chat');
      return;
    }
    const c=cloud();
    if(!c || !familyId() || typeof c.leaveFamily!=='function'){notice('You are not connected to a family.');return;}
    const familyName=c.family?.name||'your family';
    if(c.isOwner){if(window.ChristmasHQInvites)await window.ChristmasHQInvites.openLeave();else notice('Family handover is still loading.');return;}
    if(!confirm('Leave Family HQ?\n\nYou will lose access to Family Chat and shared plans in “'+familyName+'”. Your recorded shared list contributions will be removed, and your shared music will become private to you.\n\nYour personal lists, gifts, budget, music and other phone data will be kept. Older shared items without a recorded creator will stay. You will need a new invite to rejoin.')) return;
    const fid=familyId();
    try{
      await c.leaveFamily();
      chat.members=[];chat.categoryId='';chat.threadId='';chat.currentThread=null;chat.messages=[];chat.loadedKey='';
      notice('You left '+familyName);
    }catch(err){
      if(err && err.code==='HQ_NOT_ALLOWED'){
        if(confirm('The family server didn’t let you leave (it may only allow the organiser to change members).\n\nHide Family Chat on this phone instead?')){
          prefs.familyHidden[fid]=true;savePrefs();
          chat.categoryId='';chat.threadId='';chat.currentThread=null;chat.messages=[];
          notice('Family Chat hidden on this phone');
        }
      }else{
        notice((err && err.message)||'Could not leave the family.');
      }
    }
    await loadHub(true);
  }

  function threadPage(){
    const t=chat.currentThread;
    if(!t) return categoryPage();
    const mine=session()?.user?.id && t.created_by===session().user.id;
    return switcher()+
      '<button class="btn alt hq-chat-back" data-hq-chat-back="category">← Back to topics</button>'+
      '<article class="hq-chat-topic"><span class="pill '+(chat.mode==='family'?'green':'')+'">'+(chat.mode==='family'?'🔒 Family only':'🌍 Community')+'</span>'+
        '<h2>'+x(t.title)+'</h2><div class="hq-chat-meta">'+x(t.author_name||'Christmas HQ member')+' · '+x(when(t.created_at))+(t.edited_at?' · edited':'')+'</div>'+
        '<p>'+x(t.body||'').replace(/\n/g,'<br>')+'</p>'+
        '<div class="hq-chat-actions">'+
          (mine?'<button class="btn small alt" data-hq-chat-edit-thread="'+x(t.id)+'">✎ Edit</button><button class="btn small warn" data-hq-chat-delete-thread="'+x(t.id)+'">🗑 Delete</button>':'')+
          (!mine && chat.mode==='community'?'<button class="btn small alt" data-hq-chat-report-thread="'+x(t.id)+'">⚑ Report</button>':'')+
        '</div>'+
      '</article>'+
      '<div class="section-line"><h2>Replies</h2><span class="pill">'+shownMessages().length+'</span></div>'+
      (hiddenReplyCount()?'<p class="hq-chat-hidden-note">'+hiddenReplyCount()+' '+(hiddenReplyCount()===1?'reply':'replies')+' from people you hid aren\'t shown.</p>':'')+
      '<div class="hq-chat-messages">'+(shownMessages().length ? shownMessages().map(m=>{
        const myReply=session()?.user?.id && m.created_by===session().user.id;
        return '<div class="hq-chat-message"><span class="hq-chat-avatar">'+x((m.author_name||'C').charAt(0).toUpperCase())+'</span>'+
          '<div class="hq-chat-message-body"><div class="hq-chat-meta"><b>'+x(m.author_name||'Christmas HQ member')+'</b> · '+x(when(m.created_at))+(m.edited_at?' · edited':'')+'</div>'+
          '<p>'+(m.is_deleted?'<em>Message removed</em>':x(m.body).replace(/\n/g,'<br>'))+'</p>'+
          (!m.is_deleted?'<div class="hq-chat-actions">'+
            (myReply?'<button class="hq-chat-text-btn" data-hq-chat-edit-message="'+x(m.id)+'">Edit</button><button class="hq-chat-text-btn danger" data-hq-chat-delete-message="'+x(m.id)+'">Delete</button>':'')+
            (!myReply && chat.mode==='community'?'<button class="hq-chat-text-btn" data-hq-chat-report-message="'+x(m.id)+'">Report</button>':'')+
          '</div>':'')+
          '</div></div>';
      }).join('') : '<div class="empty"><div class="big">💬</div><b>No replies yet</b><p>Be the first to reply.</p></div>')+'</div>'+
      replyForm();
  }

  function draw(top){
    header();
    ensureNav();
    const intro = (!chat.threadId && !chat.categoryId)
      ? '<div class="gift-intro"><div class="eyebrow">CHRISTMAS CHAT</div><h2>Gather round and talk Christmas</h2><p class="lead">Community topics, plus a private space just for your family.</p></div>'
      : '';
    screen.innerHTML='<div class="hq-chat-shell">'+
      intro+
      (chat.error?'<div class="callout">'+x(chat.error)+'</div>':'')+
      (chat.loading?'<div class="hq-chat-loading">🎄<b>Loading Christmas Chat…</b></div>':
        ((chat.mode==='community'&&prefs.communityLeft)||(chat.mode==='family'&&familyChatHidden()))?hub():
        chat.threadId?threadPage():chat.categoryId==='__all__'?allTopicsPage():chat.categoryId?categoryPage():hub())+
    '</div>';
    if(top) window.scrollTo({top:0,behavior:'instant'});
    window.ChristmasHQInvites?.decorateChat();
    window.ChristmasHQDirectChat?.decorate();
    window.ChristmasHQPhoneBack?.record();
  }

  async function loadHub(force){
    const client=db();
    if(!client){chat.error='Christmas Chat is still connecting.';draw();return;}
    const key=chat.mode+':'+(familyId()||'none');
    if(!force && chat.loadedKey===key){draw();return;}
    chat.loading=true;chat.error='';draw();
    try{
      if(chat.mode==='family' && !familyId()){
        chat.categories=[];chat.threads=[];chat.loadedKey=key;return;
      }
      let cq=client.from('chat_categories').select('id,scope,family_id,name,description,is_system,created_at').eq('scope',chat.mode).order('is_system',{ascending:false}).order('created_at',{ascending:true});
      let tq=client.from('chat_threads').select('id,category_id,title,body,author_name,created_by,is_locked,is_pinned,created_at,updated_at,edited_at').eq('scope',chat.mode).order('updated_at',{ascending:false});
      if(chat.mode==='family'){cq=cq.eq('family_id',familyId());tq=tq.eq('family_id',familyId());}
      const readPromise=session()?.user
        ? client.from('chat_reads').select('thread_id,last_read_at').eq('user_id',session().user.id)
        : Promise.resolve({data:[],error:null});
      const [cr,tr,rr]=await Promise.all([cq,tq,readPromise]);
      if(cr.error) throw cr.error;
      if(tr.error) throw tr.error;
      if(rr.error) console.warn('Christmas Chat: unread markers unavailable',rr.error);
      chat.categories=cr.data||[];
      chat.threads=tr.data||[];
      chat.reads=Object.fromEntries((rr.error?[]:(rr.data||[])).map(r=>[r.thread_id,r.last_read_at]));
      if(chat.mode==='family') await loadMembers();
      chat.loadedKey=key;
      updateNavBadge();
    }catch(e){chat.error=e.message||'Could not load Christmas Chat.';}
    finally{chat.loading=false;draw();}
  }

  async function loadThread(id){
    const client=db(); if(!client) return;
    chat.loading=true;chat.error='';draw();
    try{
      const tr=await client.from('chat_threads').select('id,category_id,title,body,author_name,created_by,is_locked,is_pinned,created_at,updated_at,edited_at').eq('id',id).single();
      if(tr.error) throw tr.error;
      const mr=await client.from('chat_messages').select('id,body,author_name,created_by,is_deleted,created_at,updated_at,edited_at').eq('thread_id',id).order('created_at',{ascending:true});
      if(mr.error) throw mr.error;
      chat.threadId=id;chat.currentThread=tr.data;chat.messages=mr.data||[];
      if(session()?.user){
        const stamp=new Date().toISOString();
        const rr=await client.from('chat_reads').upsert({
          user_id:session().user.id,
          thread_id:id,
          last_read_at:stamp
        },{onConflict:'user_id,thread_id'});
        if(!rr.error) chat.reads[id]=stamp;
      }
      updateNavBadge();
    }catch(e){chat.error=e.message||'Could not load this topic.';}
    finally{chat.loading=false;draw(true);}
  }

  /* LIVE CHRISTMAS CHAT */
  let hqChatLiveChannel = null;

  function startLiveChat() {
    const client = db();
    if (!client || hqChatLiveChannel) return;

    const refreshChat = async () => {
      if (ui.tab !== 'chat') return;
      if (chat.threadId) {
        await loadThread(chat.threadId);
      } else {
        chat.loadedKey = '';
        await loadHub(true);
      }
    };

    hqChatLiveChannel = client
      .channel('christmas-hq-chat-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'chat_categories'},refreshChat)
      .on('postgres_changes',{event:'*',schema:'public',table:'chat_threads'},refreshChat)
      .on('postgres_changes',{event:'*',schema:'public',table:'chat_messages'},refreshChat)
      .subscribe();
  }

  startLiveChat();

  document.addEventListener('click',async e=>{
    const mode=e.target.closest('[data-hq-chat-mode]');
    if(mode){e.preventDefault();chat.mode=mode.dataset.hqChatMode;chat.categoryId='';chat.threadId='';chat.currentThread=null;chat.loadedKey='';await loadHub(true);return;}
    const c=e.target.closest('[data-hq-chat-category]');
    if(c){e.preventDefault();chat.categoryId=c.dataset.hqChatCategory;chat.threadId='';chat.currentThread=null;draw(true);return;}
    const t=e.target.closest('[data-hq-chat-thread]');
    if(t){e.preventDefault();await loadThread(t.dataset.hqChatThread);return;}
    const b=e.target.closest('[data-hq-chat-back]');
    if(b){e.preventDefault();if(window.ChristmasHQPhoneBack?.canBack){back();return;}if(b.dataset.hqChatBack==='category'){chat.threadId='';chat.currentThread=null;chat.messages=[];}else{chat.categoryId='';chat.threadId='';chat.currentThread=null;chat.messages=[];}draw(true);return;}
    if(e.target.closest('[data-hq-chat-settings]')){
      e.preventDefault();go('settings');
      setTimeout(()=>{
        const target=document.getElementById('cloudAuthForm')||document.getElementById('cloudCreateFamilyForm')||document.querySelector('.cloud-card');
        if(target){target.scrollIntoView({block:'center',behavior:'smooth'});target.querySelector('input[name="email"]')?.focus({preventScroll:true});}
      },150);
      return;
    }
    const openCommunity=e.target.closest('[data-hq-chat-open-community]');
    if(openCommunity){e.preventDefault();chat.mode='community';chat.categoryId='__all__';chat.threadId='';chat.currentThread=null;chat.messages=[];draw(true);return;}

    if(e.target.closest('[data-hq-chat-modal-close]') || e.target.id==='hqChatModal'){
      e.preventDefault(); closeChatModal(); return;
    }

    const editThread=e.target.closest('[data-hq-chat-edit-thread]');
    if(editThread){e.preventDefault();openEditThread(chat.currentThread);return;}

    const deleteThread=e.target.closest('[data-hq-chat-delete-thread]');
    if(deleteThread){
      e.preventDefault();
      if(confirm('Delete this whole topic and all its replies?')){
        const r=await db().from('chat_threads').delete().eq('id',deleteThread.dataset.hqChatDeleteThread);
        if(r.error){notice(r.error.message||'Could not delete topic');return;}
        chat.threadId='';chat.currentThread=null;chat.messages=[];chat.loadedKey='';
        await loadHub(true);notice('Topic deleted');
      }
      return;
    }

    const editMessage=e.target.closest('[data-hq-chat-edit-message]');
    if(editMessage){
      e.preventDefault();
      const message=chat.messages.find(m=>m.id===editMessage.dataset.hqChatEditMessage);
      if(message) openEditMessage(message);
      return;
    }

    const deleteMessage=e.target.closest('[data-hq-chat-delete-message]');
    if(deleteMessage){
      e.preventDefault();
      if(confirm('Delete this reply?')){
        const now=new Date().toISOString();
        const r=await db().from('chat_messages').update({is_deleted:true,body:'',edited_at:now,updated_at:now}).eq('id',deleteMessage.dataset.hqChatDeleteMessage);
        if(r.error){notice(r.error.message||'Could not delete reply');return;}
        await loadThread(chat.threadId);notice('Reply deleted');
      }
      return;
    }

    const removeMember=e.target.closest('[data-hq-chat-remove-member]');
    if(removeMember){e.preventDefault();await removeChatMember(removeMember.dataset.hqChatRemoveMember,removeMember.dataset.name||'this member');return;}

    const leave=e.target.closest('[data-hq-chat-leave]');
    if(leave){e.preventDefault();await leaveChat(leave.dataset.hqChatLeave);return;}

    const rejoin=e.target.closest('[data-hq-chat-rejoin]');
    if(rejoin){
      e.preventDefault();
      if(rejoin.dataset.hqChatRejoin==='community') prefs.communityLeft=false;
      else if(familyId()) delete prefs.familyHidden[familyId()];
      savePrefs();chat.loadedKey='';await loadHub(true);notice('Welcome back to Christmas Chat');
      return;
    }

    const hideUser=e.target.closest('[data-hq-chat-hide-user]');
    if(hideUser){
      e.preventDefault();
      const name=hideUser.dataset.name||'this person';
      if(confirm('Remove '+name+' from your Community Chat?\n\nTheir topics and replies will be hidden on this phone. Community Chat is open to everyone, so this doesn’t delete their account or posts for other people.')){
        prefs.hidden[hideUser.dataset.hqChatHideUser]=name;savePrefs();draw();notice(name+' removed from your chat');
      }
      return;
    }

    const unhideUser=e.target.closest('[data-hq-chat-unhide-user]');
    if(unhideUser){e.preventDefault();delete prefs.hidden[unhideUser.dataset.hqChatUnhideUser];savePrefs();draw();notice('Showing their posts again');return;}

    const reportThread=e.target.closest('[data-hq-chat-report-thread]');
    if(reportThread){e.preventDefault();openReport('thread',reportThread.dataset.hqChatReportThread);return;}

    const reportMessage=e.target.closest('[data-hq-chat-report-message]');
    if(reportMessage){e.preventDefault();openReport('message',reportMessage.dataset.hqChatReportMessage);return;}
  },true);

  document.addEventListener('toggle',e=>{
    const panel=e.target;
    if(panel && panel.matches && panel.matches('[data-hq-chat-panel]')) chat.panelOpen[panel.dataset.hqChatPanel]=panel.open;
  },true);

  document.addEventListener('submit',async e=>{
    try{
      if(e.target.matches('[data-hq-chat-category-form]')){
        e.preventDefault();
        const d=new FormData(e.target),u=session()?.user;
        if(!u){notice('Sign in through Settings first.');return;}
        const name=String(d.get('name')||'').trim();
        const description=String(d.get('description')||'').trim();
        if(chat.mode==='community' && !christmasCategoryOkay(name,description)){
          notice('Public folders must be Christmas-related. Add a festive subject or description.');
          return;
        }
        const r=await db().from('chat_categories').insert({
          scope:chat.mode,
          family_id:chat.mode==='family'?familyId():null,
          name,
          description,
          created_by:u.id
        });
        if(r.error) throw r.error;
        e.target.reset();chat.loadedKey='';await loadHub(true);notice('Chat folder created');return;
      }

      if(e.target.matches('[data-hq-chat-thread-form]')){
        e.preventDefault();
        if(!session()?.user){notice('Sign in through Settings first.');return;}
        const d=new FormData(e.target);
        const r=await db().from('chat_threads').insert({
          category_id:String(d.get('category_id')||'')||chat.categoryId,
          title:String(d.get('title')||'').trim(),
          body:String(d.get('body')||'').trim()
        }).select('id').single();
        if(r.error) throw r.error;
        chat.loadedKey='';await loadHub(true);await loadThread(r.data.id);notice('Topic posted');return;
      }

      if(e.target.matches('[data-hq-chat-reply-form]')){
        e.preventDefault();
        if(!session()?.user){notice('Sign in through Settings first.');return;}
        const d=new FormData(e.target);
        const r=await db().from('chat_messages').insert({
          thread_id:chat.threadId,
          body:String(d.get('body')||'').trim()
        });
        if(r.error) throw r.error;
        e.target.reset();
        await loadThread(chat.threadId);
        notice('Reply posted');
      }
    }catch(err){console.warn('Christmas Chat action failed',err);notice(err.message||'Christmas Chat action failed');}
  });

  window.ChristmasHQChatNavigation = {
    snapshot(){return {mode:chat.mode,categoryId:chat.categoryId,threadId:chat.threadId};},
    restore(saved){
      chat.mode=saved.mode==='family'?'family':'community';
      chat.categoryId=String(saved.categoryId||'');chat.threadId=String(saved.threadId||'');
      chat.currentThread=null;chat.messages=[];chat.loadedKey='';
      const target=chat.threadId,mode=chat.mode;
      loadHub(true).then(()=>{
        if(target && ui.tab==='chat' && chat.mode===mode && chat.threadId===target)return loadThread(target);
      }).catch(err=>{notice(err.message||'Could not reopen this chat page.');});
    }
  };

  const previousRender=render;
  render=function(top=true){
    if(ui.tab==='chat'){
      document.getElementById('bottomNav')?.classList.remove('nav-open');
      document.getElementById('navToggle')?.setAttribute('aria-expanded','false');
      draw(top);
      const key=chat.mode+':'+(familyId()||'none');
      if(!chat.loading && chat.loadedKey!==key) loadHub().catch(()=>{});
      return;
    }
    previousRender(top);
    ensureNav();
    addHomeShortcut();
  };

  const style=document.createElement('style');
  style.textContent=
    '.hq-chat-shell{display:grid;gap:14px}.hq-chat-switch{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px;border:1px solid #dce5dc;border-radius:18px;background:#eef3ed}.hq-chat-switch button{min-height:62px;border:0;border-radius:14px;background:transparent;color:#526658;font-weight:900;padding:9px}.hq-chat-switch button small{display:block;margin-top:3px;font-size:10px}.hq-chat-switch button.selected{background:#fff;color:#103b31;box-shadow:0 5px 16px rgba(16,59,49,.09)}'+
    '.hq-chat-intro,.hq-chat-folder-head{display:flex;gap:12px;align-items:flex-start;padding:16px;border-radius:18px;background:linear-gradient(135deg,#eff6ed,#fff8e9);border:1px solid #dce7d8}.hq-chat-intro.private{background:linear-gradient(135deg,#edf5f0,#f4f2fb)}.hq-chat-intro>span,.hq-chat-folder-head>span{font-size:30px}.hq-chat-intro b{display:block;color:#103b31;font-size:16px}.hq-chat-intro p,.hq-chat-folder-head p{margin:4px 0 0;color:#68776d;font-size:12px;line-height:1.5}'+
    '.hq-chat-create{border:1px solid #dce5dc;border-radius:16px;background:#fff;overflow:hidden}.hq-chat-create summary{list-style:none;padding:14px 15px;color:#195342;font-size:13px;font-weight:900}.hq-chat-create form{display:grid;gap:11px;padding:13px 14px 14px;border-top:1px solid #edf0e9}.hq-chat-create label{font-size:12px;font-weight:850;color:#526658}'+
    '.hq-chat-list,.hq-chat-messages{display:grid;gap:9px}.hq-chat-card{width:100%;display:flex;align-items:center;gap:11px;text-align:left;border:1px solid #e0e6de;border-radius:17px;background:#fff;padding:13px;box-shadow:0 7px 20px rgba(18,61,47,.045);color:#25372e}.hq-chat-icon{width:43px;height:43px;min-width:43px;display:grid;place-items:center;border-radius:13px;background:#f1f5ed;font-size:22px}.hq-chat-copy{flex:1;min-width:0}.hq-chat-copy strong{display:block;color:#103b31;font-size:14px}.hq-chat-copy small,.hq-chat-copy em{display:block;margin-top:3px;color:#728077;font-size:11px;line-height:1.4}.hq-chat-copy em{color:#9b783c;font-size:10px;font-style:normal;font-weight:850}.hq-chat-chevron{color:#3d765d;font-size:28px}'+
    '.hq-chat-callout{border:1px solid #e6dcc5;border-radius:17px;background:#fff9ed;padding:15px}.hq-chat-callout b{color:#103b31}.hq-chat-callout p{margin:6px 0 12px;color:#68776d;font-size:12px}.hq-chat-rules{display:flex;gap:8px;padding:12px;border-radius:14px;background:#f8f4e8;color:#715f3c;font-size:11px}.hq-chat-folder-head h2{margin:0;color:#103b31}.hq-chat-back{width:max-content}'+
    '.hq-chat-topic{padding:18px;border-radius:20px;background:#fff;border:1px solid #e0e6de;box-shadow:0 8px 24px rgba(18,61,47,.05)}.hq-chat-topic h2{margin:10px 0 6px;color:#103b31}.hq-chat-topic>p{margin:14px 0 0;line-height:1.65}.hq-chat-meta{color:#8a958d;font-size:11px}.hq-chat-message{display:flex;gap:10px;padding:13px;border:1px solid #e2e7df;border-radius:16px;background:#fff}.hq-chat-avatar{width:38px;height:38px;min-width:38px;display:grid;place-items:center;border-radius:50%;background:#eaf3e8;color:#1d6045;font-weight:900}.hq-chat-message p{margin:5px 0 0;line-height:1.55;overflow-wrap:anywhere}'+
    '.hq-chat-reply{position:sticky;bottom:calc(82px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;padding:11px;border:1px solid #dce4dc;border-radius:17px;background:rgba(255,254,250,.96);backdrop-filter:blur(12px)}.hq-chat-loading{min-height:180px;display:grid;place-items:center;align-content:center;gap:8px;font-size:34px;color:#526658}.hq-chat-loading b{font-size:13px}.hq-chat-new{display:inline-block;margin-left:7px;padding:2px 6px;border-radius:999px;background:#ba3446;color:#fff;font-size:8px;letter-spacing:.4px;vertical-align:2px}.hq-chat-nav-badge{position:absolute;top:3px;right:5px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:#ba3446;color:#fff;display:grid;place-items:center;font-size:8px;font-weight:900}.nav button{position:relative}.hq-chat-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.hq-chat-text-btn{border:0;background:transparent;color:#2c7554;font-size:10px;font-weight:900;padding:3px 0}.hq-chat-text-btn.danger{color:#a43c46}.hq-chat-message-body{flex:1;min-width:0}#hqChatModal{position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-end;justify-content:center;padding:18px 12px calc(18px + env(safe-area-inset-bottom));background:rgba(2,20,16,.72);backdrop-filter:blur(8px)}.hq-chat-modal-card{width:min(100%,540px);max-height:88dvh;overflow:auto;border-radius:23px;background:#fffefa;padding:15px;box-shadow:0 24px 70px rgba(0,0,0,.35)}.hq-chat-modal-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;color:#103b31;font-size:17px}.hq-chat-modal-head button{width:34px;height:34px;border:0;border-radius:10px;background:#f4eeee;color:#9a3340;font-size:22px}.hq-chat-modal-card form{display:grid;gap:11px}.hq-chat-modal-card label{font-size:12px;font-weight:850;color:#526658}.hq-chat-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}.hq-chat-intro-btn{width:100%;text-align:left;font:inherit;color:inherit;cursor:pointer;align-items:center}.hq-chat-intro-btn>div{flex:1;min-width:0}.hq-chat-intro-btn em{display:block;margin-top:6px;color:#9b783c;font-size:11px;font-style:normal;font-weight:900}.hq-chat-intro-btn:active{transform:scale(.99)}.hq-chat-members{border:1px solid #dce5dc;border-radius:17px;background:#fff;padding:0 14px 14px;box-shadow:0 7px 20px rgba(18,61,47,.045)}.hq-chat-members summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 0 10px;color:#195342;font-size:13px;font-weight:900;cursor:pointer}.hq-chat-member-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}.hq-chat-member{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid #edf0e9;border-radius:14px;background:#fbfcf9}.hq-chat-member-name{flex:1;min-width:0}.hq-chat-member-name b{display:block;color:#103b31;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hq-chat-member-name small{display:block;color:#7b887f;font-size:10.5px;font-weight:800;margin-top:2px}.hq-chat-member-actions{display:flex;gap:6px;flex-shrink:0}.hq-chat-member-actions .btn.small,.hq-chat-members>.btn.small{min-height:34px;font-size:11.5px;padding:6px 10px;width:auto}.hq-chat-members>.btn.small{margin-top:10px}.hq-chat-members-note,.hq-chat-hidden-note{margin:10px 0 0;color:#6d7b72;font-size:11px;line-height:1.5}.hq-chat-members-error{margin:0 0 8px;color:#9a3340;font-size:11.5px}.hq-chat-members-sub{margin:12px 0 6px;color:#8a6a33;font-size:10.5px;font-weight:900;letter-spacing:.4px;text-transform:uppercase}@media(max-width:430px){.nav button{font-size:9px!important}.nav button i{font-size:20px!important}.hq-chat-reply{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  ensureNav();
  addHomeShortcut();
})();

