/* Participant-only family messages. */
(() => {
 'use strict';
 if(window.ChristmasHQDirectChat)return;
 const cloud=()=>window.ChristmasHQFamilyCloud;
 const me=()=>cloud()?.session?.user?.id||'';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let members=[],person=null,generation=0,loading=false,context='',unreadByPerson={};
 const modal=()=>document.getElementById('hqDirectChatModal');
 function close(){generation++;modal()?.remove();person=null;loading=false;}
 function list(){
  const target=document.getElementById('hqDmPeople');if(!target)return;
  const q=(document.getElementById('hqDmSearch')?.value||'').trim().toLowerCase();
  target.innerHTML=members.filter(m=>String(m.display_name||'').toLowerCase().includes(q)).map(m=>`<button class="btn full" data-hq-dm-person="${esc(m.user_id)}">💬 ${esc(m.display_name||'Family member')} <span>${unreadByPerson[m.user_id]?esc(unreadByPerson[m.user_id])+' new · ':''}›</span></button>`).join('')||'<p>No matching family members.</p>';
 }
 async function open(){
  if(!me()){notice('Sign in through Settings to use private messages.');return;}
  if(!cloud()?.familyId){notice('Join a family HQ to message its members.');return;}
  close();const version=generation;context=me()+'|'+cloud().familyId;
  const box=document.createElement('div');box.id='hqDirectChatModal';
  box.innerHTML='<section class="hq-dm-card" role="dialog" aria-modal="true" aria-labelledby="hqDmTitle"><div class="hq-dm-head"><h2 id="hqDmTitle">🔒 Private messages</h2><button data-hq-dm-close aria-label="Close private messages">×</button></div><p class="muted-note">Choose a family member. Only you and that person can read your messages.</p><div id="hqDmContent"><label>Find a family member<input id="hqDmSearch" class="field" type="search" placeholder="Search by name…"></label><div id="hqDmPeople">Loading family members…</div></div></section>';
  document.body.appendChild(box);document.getElementById('hqDmSearch')?.focus();window.ChristmasHQPhoneBack?.record();
  try{const [result,unread]=await Promise.all([cloud().client.from('family_members').select('user_id,display_name').eq('family_id',cloud().familyId).order('display_name'),cloud().client.from('hq_direct_messages').select('sender_id').eq('receiver_id',me()).is('read_at',null)]);if(result.error)throw result.error;if(unread.error)throw unread.error;if(version!==generation||!modal())return;members=(result.data||[]).filter(m=>m.user_id!==me());unreadByPerson={};(unread.data||[]).forEach(m=>unreadByPerson[m.sender_id]=(unreadByPerson[m.sender_id]||0)+1);list();}
  catch(e){if(version===generation&&modal())document.getElementById('hqDmPeople').textContent=e.message||'Could not load family members.';}
 }
 async function readMessages(){
  if(!person||!modal()||loading||document.hidden)return;
  if(context!==me()+'|'+cloud()?.familyId){close();return;}
  loading=true;const version=generation,other=person.user_id,uid=me();
  try{
   const r=await cloud().client.from('hq_direct_messages').select('id,sender_id,body,created_at,read_at').or(`and(sender_id.eq.${uid},receiver_id.eq.${other}),and(sender_id.eq.${other},receiver_id.eq.${uid})`).order('created_at',{ascending:false}).limit(100);
   if(r.error)throw r.error;if(version!==generation||!modal())return;
   const target=document.getElementById('hqDmMessages');const nearBottom=target.scrollHeight-target.scrollTop-target.clientHeight<70;
   const messages=(r.data||[]).slice().reverse();
   target.innerHTML=messages.map(m=>`<article class="hq-dm-message ${m.sender_id===uid?'mine':''}"><b>${m.sender_id===uid?'You':esc(person.display_name)}</b><p>${esc(m.body)}</p><small>${esc(new Date(m.created_at).toLocaleString())}</small></article>`).join('')||'<p>Start your private conversation below.</p>';
   if(nearBottom)target.scrollTop=target.scrollHeight;
   const unseen=messages.filter(m=>m.sender_id!==uid&&!m.read_at).map(m=>m.id);
   if(unseen.length){const marked=await cloud().client.from('hq_direct_messages').update({read_at:new Date().toISOString()}).in('id',unseen).eq('receiver_id',uid);if(marked.error)throw marked.error;window.ChristmasHQInvites?.refresh();}
   document.getElementById('hqDmError').textContent='';
  }catch(e){if(version===generation&&modal())document.getElementById('hqDmError').textContent=e.message||'Could not load messages.';}
  finally{if(version===generation)loading=false;}
 }
 function conversation(id){
  const chosen=members.find(m=>m.user_id===id);if(!chosen)return;
  generation++;loading=false;person=chosen;
  document.getElementById('hqDmTitle').textContent='🔒 '+chosen.display_name;
  document.getElementById('hqDmContent').innerHTML='<button class="btn small alt" data-hq-dm-list>← Family members</button><div id="hqDmMessages" aria-live="polite">Loading messages…</div><p id="hqDmError" role="alert"></p><form id="hqDmSend"><label>Your message<textarea name="body" class="field" rows="3" maxlength="4000" required placeholder="Write a private message…"></textarea></label><button class="btn" type="submit">Send 💬</button></form>';
  readMessages();
 }
 function decorate(){
  if(typeof ui==='undefined'||ui.tab!=='chat'){if(modal())close();return;}
  if(modal()&&context!==me()+'|'+cloud()?.familyId)close();
  const shell=document.querySelector('.hq-chat-shell');if(!shell||document.getElementById('hqPrivateMessagesButton'))return;
  const button=document.createElement('button');button.id='hqPrivateMessagesButton';button.className='btn full';button.dataset.hqDmOpen='';button.textContent='🔒 Private messages · Find a family member';
  const invites=document.getElementById('hqFamilyInvitations');if(invites)invites.after(button);else shell.prepend(button);
 }
 document.addEventListener('input',e=>{if(e.target.id==='hqDmSearch')list();});
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-hq-dm-open]')){e.preventDefault();open();}
  if(e.target.closest('[data-hq-dm-close]')||e.target.id==='hqDirectChatModal'){e.preventDefault();close();}
  if(e.target.closest('[data-hq-dm-list]')){e.preventDefault();open();}
  const p=e.target.closest('[data-hq-dm-person]');if(p){e.preventDefault();conversation(p.dataset.hqDmPerson);}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal())close();});
 document.addEventListener('submit',async e=>{
  if(e.target.id!=='hqDmSend')return;e.preventDefault();
  const form=e.target,button=form.querySelector('button'),body=String(new FormData(form).get('body')||'').trim();
  if(!body||button.disabled||!person)return;
  const version=generation;button.disabled=true;
  try{const r=await cloud().client.from('hq_direct_messages').insert({family_id:cloud().familyId,sender_id:me(),receiver_id:person.user_id,body});if(r.error)throw r.error;
   if(version!==generation||!modal())return;form.reset();await readMessages();document.getElementById('hqDmMessages').scrollTop=document.getElementById('hqDmMessages').scrollHeight;
  }catch(err){if(version===generation&&modal())document.getElementById('hqDmError').textContent=err.message||'Could not send message.';}finally{button.disabled=false;}
 });
 const style=document.createElement('style');style.textContent=`#hqDirectChatModal{position:fixed;inset:0;z-index:10020;padding:18px 12px;background:#08261ddd;display:grid;place-items:center}.hq-dm-card{width:min(100%,540px);max-height:90dvh;overflow:auto;padding:18px;border-radius:22px;background:#fffdf6;color:#103b31}.hq-dm-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.hq-dm-head h2{font-size:20px;margin:0}.hq-dm-head>button{border:0;background:transparent;font-size:30px;color:#103b31}#hqDmPeople{display:grid;gap:10px;margin-top:14px}#hqDmPeople button{display:flex;justify-content:space-between}#hqDmMessages{height:35dvh;overflow:auto;display:flex;flex-direction:column;gap:10px;margin:12px 0}.hq-dm-message{align-self:flex-start;max-width:90%;padding:10px 12px;background:#eee8d6;border-radius:14px}.hq-dm-message.mine{align-self:flex-end;background:#dceee1}.hq-dm-message p{white-space:pre-wrap;overflow-wrap:anywhere;margin:5px 0}.hq-dm-message small{font-size:10px;color:#526658}#hqDmSend{display:grid;gap:9px}#hqDmError{color:#a41c2e}`;document.head.appendChild(style);
 window.ChristmasHQDirectChat={open,decorate,close};
 const previous=render;render=function(...args){const result=previous.apply(this,args);decorate();return result;};
 decorate();setInterval(readMessages,5000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)readMessages();});
})();
