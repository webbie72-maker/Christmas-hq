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
    loading: false,
    error: '',
    loadedKey: ''
  };

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

  function header(){
    mast.dataset.hqPage='chat';
    mast.innerHTML =
      '<div class="hq-page-brand">'+
        '<div class="hq-page-title">Christmas Chat</div>'+
        '<div class="hq-page-subbrand">Christmas HQ</div>'+
        '<div class="hq-brand-flourish">✦ · ✦</div>'+
      '</div>'+
      '<button class="back-btn hq-page-back" data-action="back">← Back</button>';
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
      '<b>'+(familyOnly?'🔒 Connect your family first':'🔐 Sign in to join the conversation')+'</b>'+
      '<p>'+(familyOnly
        ? 'Family Chat is visible only to people in your connected Christmas HQ family.'
        : 'You can read Community Chat now. Sign in to create folders, start topics and reply.')+'</p>'+
      '<button class="btn" data-hq-chat-settings>Open Settings →</button>'+
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
    const counts={};
    chat.threads.forEach(t=>counts[t.category_id]=(counts[t.category_id]||0)+1);
    return '<div class="hq-chat-list">'+chat.categories.map(c=>
      '<button class="hq-chat-card" data-hq-chat-category="'+x(c.id)+'">'+
        '<span class="hq-chat-icon">'+(chat.mode==='family'?'🔒':c.is_system?'🎄':'💬')+'</span>'+
        '<span class="hq-chat-copy"><strong>'+x(c.name)+'</strong><small>'+x(c.description||'Christmas discussion')+'</small><em>'+
        (counts[c.id]||0)+' '+((counts[c.id]||0)===1?'topic':'topics')+'</em></span>'+
        '<span class="hq-chat-chevron">›</span>'+
      '</button>'
    ).join('')+'</div>';
  }

  function hub(){
    const family=chat.mode==='family';
    return switcher()+
      '<div class="hq-chat-intro '+(family?'private':'')+'">'+
        '<span>'+(family?'🔒':'🌍')+'</span><div><b>'+(family?'Your private Family Chat':'Christmas Community')+'</b>'+
        '<p>'+(family
          ? 'Folders, topics and replies here stay inside your connected family.'
          : 'Christmas-only discussion for the wider Christmas HQ community.')+'</p></div>'+
      '</div>'+
      (family && !familyId() ? settingsCallout(true) :
        '<div class="section-line"><h2>'+(family?'Family folders':'Christmas folders')+'</h2><span class="pill">'+chat.categories.length+'</span></div>'+
        categoryForm()+cards()
      )+
      (!family ? '<div class="hq-chat-rules"><b>🎄 Keep it Christmas</b><span>Public topics are for Christmas subjects only.</span></div>' : '');
  }

  function currentCategory(){
    return chat.categories.find(c=>c.id===chat.categoryId)||null;
  }

  function threadForm(){
    if(!session()) return settingsCallout(false);
    if(chat.mode==='family' && !familyId()) return settingsCallout(true);
    return '<details class="hq-chat-create"><summary>＋ Start a new topic</summary>'+
      '<form data-hq-chat-thread-form>'+
        '<label>Topic title<input class="field" name="title" maxlength="120" required></label>'+
        '<label>First post<textarea class="field" name="body" rows="5" maxlength="5000" required></textarea></label>'+
        '<button class="btn full" type="submit">Post topic</button>'+
      '</form></details>';
  }

  function categoryPage(){
    const c=currentCategory();
    if(!c) return hub();
    const rows=chat.threads.filter(t=>t.category_id===c.id);
    return switcher()+
      '<button class="btn alt hq-chat-back" data-hq-chat-back="hub">← All folders</button>'+
      '<div class="hq-chat-folder-head"><span>'+(chat.mode==='family'?'🔒':'🎄')+'</span><div><h2>'+x(c.name)+'</h2><p>'+x(c.description||'')+'</p></div></div>'+
      threadForm()+
      '<div class="section-line"><h2>Topics</h2><span class="pill">'+rows.length+'</span></div>'+
      '<div class="hq-chat-list">'+(rows.length ? rows.map(t=>
        '<button class="hq-chat-card" data-hq-chat-thread="'+x(t.id)+'">'+
          '<span class="hq-chat-icon">'+(t.is_pinned?'📌':'💬')+'</span>'+
          '<span class="hq-chat-copy"><strong>'+x(t.title)+'</strong><small>'+x(t.author_name||'Christmas HQ member')+' · '+x(when(t.updated_at||t.created_at))+'</small><em>'+x((t.body||'').slice(0,130))+'</em></span>'+
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

  function threadPage(){
    const t=chat.currentThread;
    if(!t) return categoryPage();
    return switcher()+
      '<button class="btn alt hq-chat-back" data-hq-chat-back="category">← Back to topics</button>'+
      '<article class="hq-chat-topic"><span class="pill '+(chat.mode==='family'?'green':'')+'">'+(chat.mode==='family'?'🔒 Family only':'🌍 Community')+'</span>'+
        '<h2>'+x(t.title)+'</h2><div class="hq-chat-meta">'+x(t.author_name||'Christmas HQ member')+' · '+x(when(t.created_at))+'</div>'+
        '<p>'+x(t.body||'').replace(/\n/g,'<br>')+'</p></article>'+
      '<div class="section-line"><h2>Replies</h2><span class="pill">'+chat.messages.length+'</span></div>'+
      '<div class="hq-chat-messages">'+(chat.messages.length ? chat.messages.map(m=>
        '<div class="hq-chat-message"><span class="hq-chat-avatar">'+x((m.author_name||'C').charAt(0).toUpperCase())+'</span>'+
        '<div><div class="hq-chat-meta"><b>'+x(m.author_name||'Christmas HQ member')+'</b> · '+x(when(m.created_at))+'</div>'+
        '<p>'+(m.is_deleted?'<em>Message removed</em>':x(m.body).replace(/\n/g,'<br>'))+'</p></div></div>'
      ).join('') : '<div class="empty"><div class="big">💬</div><b>No replies yet</b><p>Be the first to reply.</p></div>')+'</div>'+
      replyForm();
  }

  function draw(top){
    header();
    ensureNav();
    screen.innerHTML='<div class="hq-chat-shell">'+
      (chat.error?'<div class="callout">'+x(chat.error)+'</div>':'')+
      (chat.loading?'<div class="hq-chat-loading">🎄<b>Loading Christmas Chat…</b></div>':
        chat.threadId?threadPage():chat.categoryId?categoryPage():hub())+
    '</div>';
    if(top) window.scrollTo({top:0,behavior:'instant'});
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
      let tq=client.from('chat_threads').select('id,category_id,title,body,author_name,is_locked,is_pinned,created_at,updated_at').eq('scope',chat.mode).order('updated_at',{ascending:false});
      if(chat.mode==='family'){cq=cq.eq('family_id',familyId());tq=tq.eq('family_id',familyId());}
      const [cr,tr]=await Promise.all([cq,tq]);
      if(cr.error) throw cr.error;
      if(tr.error) throw tr.error;
      chat.categories=cr.data||[];
      chat.threads=tr.data||[];
      chat.loadedKey=key;
    }catch(e){chat.error=e.message||'Could not load Christmas Chat.';}
    finally{chat.loading=false;draw();}
  }

  async function loadThread(id){
    const client=db(); if(!client) return;
    chat.loading=true;chat.error='';draw();
    try{
      const tr=await client.from('chat_threads').select('id,category_id,title,body,author_name,is_locked,is_pinned,created_at,updated_at').eq('id',id).single();
      if(tr.error) throw tr.error;
      const mr=await client.from('chat_messages').select('id,body,author_name,is_deleted,created_at').eq('thread_id',id).order('created_at',{ascending:true});
      if(mr.error) throw mr.error;
      chat.threadId=id;chat.currentThread=tr.data;chat.messages=mr.data||[];
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

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_categories'
      },
      refreshChat
    )

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_threads'
      },
      refreshChat
    )

    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_messages'
      },
      refreshChat
    )

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
    if(b){e.preventDefault();if(b.dataset.hqChatBack==='category'){chat.threadId='';chat.currentThread=null;chat.messages=[];}else{chat.categoryId='';chat.threadId='';chat.currentThread=null;chat.messages=[];}draw(true);return;}
    if(e.target.closest('[data-hq-chat-settings]')){e.preventDefault();go('settings');}
  },true);

  document.addEventListener('submit',async e=>{
    try{
      if(e.target.matches('[data-hq-chat-category-form]')){
        e.preventDefault();
        const d=new FormData(e.target),u=session()?.user;
        if(!u){notice('Sign in through Settings first.');return;}
        const r=await db().from('chat_categories').insert({
          scope:chat.mode,
          family_id:chat.mode==='family'?familyId():null,
          name:String(d.get('name')||'').trim(),
          description:String(d.get('description')||'').trim(),
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
          category_id:chat.categoryId,
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

  const previousRender=render;
  render=function(top=true){
    if(ui.tab==='chat'){
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
    '.hq-chat-reply{position:sticky;bottom:calc(82px + env(safe-area-inset-bottom));display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;padding:11px;border:1px solid #dce4dc;border-radius:17px;background:rgba(255,254,250,.96);backdrop-filter:blur(12px)}.hq-chat-loading{min-height:180px;display:grid;place-items:center;align-content:center;gap:8px;font-size:34px;color:#526658}.hq-chat-loading b{font-size:13px}@media(max-width:430px){.nav button{font-size:9px!important}.nav button i{font-size:20px!important}.hq-chat-reply{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  ensureNav();
  addHomeShortcut();
})();
