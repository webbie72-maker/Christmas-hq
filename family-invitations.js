/* Name search, direct invitations, safe organiser exit and the Home chat alert. */
(() => {
 'use strict';
 if(window.ChristmasHQInvites)return;
 const cloud=()=>window.ChristmasHQFamilyCloud;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let inbox=[],matches=[],query='',identity=null,unread=0,userKey='',familyKey='',refreshing=false,searchVersion=0,channel=null;
 let searchNote='',inboxNote='',exitPromise=null;
 const pending=new Set();
 const signedIn=()=>!!cloud()?.session?.user;
 async function action(name,payload={}){
  if(!signedIn())throw new Error('Sign in through Settings first.');
  const {data,error}=await cloud().client.rpc('hq_family_actions',{p_action:name,p_payload:payload});
  if(error)throw error;return data;
 }
 function paintBubble(){
  let button=document.getElementById('hqHomeChatBubble');
  if(!button){
   button=document.createElement('button');button.id='hqHomeChatBubble';button.type='button';button.dataset.hqInboxOpen='';
   button.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 5h20a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H14l-8 5v-5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" fill="#ffe37e" stroke="#79511b" stroke-width="1.6"/><circle cx="10" cy="14" r="1.5"/><circle cx="16" cy="14" r="1.5"/><circle cx="22" cy="14" r="1.5"/></svg><span class="hq-bubble-count"></span>';
   document.body.appendChild(button);
  }
  const count=signedIn()?unread+inbox.length:0;
  button.hidden=ui.tab!=='home';button.classList.toggle('has-unread',count>0);
  button.setAttribute('aria-label',count?`Open Chat: ${count} unread topics or family invitations`:'Open Christmas Chat');
  const badge=button.querySelector('.hq-bubble-count');badge.hidden=!count;badge.textContent=count>99?'99+':String(count);
 }
 function renderInbox(){
  const target=document.getElementById('hqFamilyInviteList');if(!target)return;
  target.innerHTML=inbox.length?inbox.map(i=>`<article class="hq-invite-item"><b>${esc(i.family_name)}</b><p>${esc(i.sender_name)} invited you to join their family HQ.</p><div class="btnrow"><button type="button" class="btn" data-hq-invite-accept="${esc(i.id)}" ${pending.has(i.id)?'disabled':''}>Accept</button><button type="button" class="btn alt" data-hq-invite-decline="${esc(i.id)}" ${pending.has(i.id)?'disabled':''}>Decline</button></div></article>`).join(''):'<p class="muted-note">No pending family invitations.</p>';
  const note=document.getElementById('hqInviteInboxNote');if(note)note.textContent=inboxNote;
 }
 function renderSearch(){
  const target=document.getElementById('hqInviteNameResults');if(!target)return;
  target.innerHTML=matches.map(person=>`<div class="hq-invite-match"><div><b>${esc(person.display_name)}</b><small>${esc(person.user_code)}</small></div><button type="button" class="btn small" data-hq-invite-send="${esc(person.user_id)}">Invite</button></div>`).join('');
  document.getElementById('hqInviteSearchNote').textContent=searchNote;
 }
 function decorateChat(){
  paintBubble();if(ui.tab!=='chat')return;
  const shell=document.querySelector('.hq-chat-shell');if(!shell)return;
  const key=cloud()?.session?.user?.id||'signed-out';
  const old=document.getElementById('hqFamilyInvitations');
  if(old?.dataset.user===key){const label=document.getElementById('hqInviteIdentity');if(label&&identity?.display_name)label.textContent='You are '+identity.display_name+' · '+identity.user_code+'. Accept to join, or decline to keep your current HQ. Your personal lists are kept.';renderInbox();return;}
  old?.remove();
  const card=document.createElement('section');card.id='hqFamilyInvitations';card.className='card';card.dataset.user=key;
  card.innerHTML='<h3>💌 Family invitations</h3>'+(!signedIn()?'<p>Sign in to receive family invitations, even when you are not in an HQ.</p><button class="btn" type="button" data-hq-chat-settings>Sign in →</button>':
   `<p id="hqInviteIdentity" class="muted-note">${identity?.display_name?`You are ${esc(identity.display_name)} · ${esc(identity.user_code)}.`:'Invitations are sent to your signed-in account.'} Accept to join, or decline to keep your current HQ. Your personal lists are kept.</p><div id="hqFamilyInviteList"></div><p id="hqInviteInboxNote" class="muted-note" role="status"></p>`+
   (cloud()?.familyId?`<details><summary>Invite someone by name</summary><form id="hqNameInviteForm"><label>Find a person<input class="field" name="name" minlength="2" maxlength="70" required placeholder="Their name…" value="${esc(query)}"></label><button class="btn" type="submit">Search names</button></form><p class="muted-note">Choose their name and HQ code to identify the right person. Their invite will appear in Chat.</p><div id="hqInviteNameResults"></div><p id="hqInviteSearchNote" class="muted-note" role="status"></p></details>`:'<p class="muted-note">Join or create an HQ in Settings to invite other people.</p>'));
  shell.prepend(card);renderInbox();if(cloud()?.familyId)renderSearch();
 }
 async function refresh(){
  const c=cloud(),uid=c?.session?.user?.id||'',fid=c?.familyId||'';
  if(uid!==userKey||fid!==familyKey){
   userKey=uid;familyKey=fid;inbox=[];matches=[];identity=null;unread=0;searchVersion++;
   if(channel){c?.client?.removeChannel(channel);channel=null;}
   document.getElementById('hqFamilyInvitations')?.remove();
  }
  if(!uid){paintBubble();decorateChat();return;}
  if(refreshing||document.hidden)return;
  refreshing=true;
  try{
   const [ir,nr,pr]=await Promise.allSettled([action('inbox'),c.client.rpc('hq_chat_unread_count'),action('identity')]);
   if(cloud()?.session?.user?.id!==uid||cloud()?.familyId!==fid)return;
   if(ir.status==='fulfilled'){inbox=ir.value||[];inboxNote='';}else inboxNote='Invitations could not refresh. Check your connection.';
   if(nr.status==='fulfilled'&&!nr.value.error)unread=Number(nr.value.data)||0;
   if(pr.status==='fulfilled')identity=pr.value;
   if(!channel){channel=c.client.channel('hq-chat-alerts-'+uid).on('postgres_changes',{event:'*',schema:'public',table:'chat_threads'},()=>refresh()).subscribe();}
   decorateChat();paintBubble();
  }catch(err){console.warn('HQ invitations refresh failed',err);}finally{refreshing=false;}
 }
 async function openLeave(){
  if(exitPromise)return exitPromise;
  const c=cloud();if(!c?.familyId)throw new Error('You are not connected to an HQ.');
  if(!c.isOwner){
   if(!confirm('Leave this family HQ? Your recorded shared contributions will be removed and your shared music will become private. Your personal data is kept.'))return false;
   await c.leaveFamily();await refresh();return true;
  }
  const fid=c.familyId;await c.refreshMembers();
  const others=c.members.filter(m=>m.user_id!==c.session.user.id);
  exitPromise=new Promise(resolve=>{
   const modal=document.createElement('div');modal.id='hqFamilyLeaveModal';
   modal.innerHTML=`<div class="hq-exit-card" role="dialog" aria-modal="true" aria-labelledby="hqExitTitle"><button type="button" class="hq-exit-close" data-hq-exit-close aria-label="Cancel">×</button><h2 id="hqExitTitle">${others.length?'Hand over and leave HQ':'Close and leave HQ'}</h2><p>${others.length?'Choose a current member to become the new organiser. The HQ continues for everyone else.':'You are the only member. Closing this HQ disables its invitations and removes your membership.'}</p><p>Your personal lists, gifts, budget and music are kept. Recorded shared contributions are removed when you hand over and leave; your shared music becomes private.</p><form id="hqExitForm">${others.length?`<label>New organiser<select class="field" name="next_owner" required><option value="">Choose a family member…</option>${others.map(m=>`<option value="${esc(m.user_id)}">${esc(m.display_name||'Family member')}</option>`).join('')}</select></label>`:''}<p id="hqExitError" role="alert"></p><div class="btnrow"><button type="button" class="btn alt" data-hq-exit-close>Cancel</button><button type="submit" class="btn warn">${others.length?'Hand over and leave':'Close HQ and leave'}</button></div></form></div>`;
   let settled=false;const previousFocus=document.activeElement;
   function onKey(e){if(e.key==='Escape'){e.preventDefault();finish(false);}}
   function finish(value){if(settled)return;settled=true;document.removeEventListener('keydown',onKey,true);modal.remove();previousFocus?.focus();exitPromise=null;resolve(value);}
   document.addEventListener('keydown',onKey,true);
   modal.addEventListener('click',e=>{if(e.target.closest('[data-hq-exit-close]'))finish(false);});
   modal.querySelector('form').addEventListener('submit',async e=>{
    e.preventDefault();const submit=modal.querySelector('[type="submit"]');submit.disabled=true;
    const next=modal.querySelector('[name="next_owner"]')?.value||null;
    try{
     if(c.familyId!==fid)throw new Error('Your family connection changed. Please try again.');
     if(others.length&&!next)throw new Error('Choose the new organiser first.');
     await c.leaveFamily(next,!others.length);finish(true);await refresh();
    }catch(err){modal.querySelector('#hqExitError').textContent=err.message||'Could not leave HQ.';submit.disabled=false;}
   });
   document.body.appendChild(modal);modal.querySelector('[name="next_owner"], [type="submit"]').focus();
  });return exitPromise;
 }
 window.ChristmasHQInvites={decorateChat,refresh,openLeave};
 document.addEventListener('submit',async e=>{
  if(e.target.id!=='hqNameInviteForm')return;e.preventDefault();e.stopImmediatePropagation();
  query=String(new FormData(e.target).get('name')||'').trim();const version=++searchVersion,uid=userKey,fid=cloud()?.familyId;
  const button=e.target.querySelector('button');button.disabled=true;searchNote='Searching…';renderSearch();
  try{const result=await action('search',{name:query});if(version!==searchVersion||userKey!==uid||cloud()?.familyId!==fid)return;matches=result||[];searchNote=matches.length?'':'No matching names. Ask them to sign up and check their display name.';}
  catch(err){matches=[];searchNote=err.message||'Could not search names.';}finally{button.disabled=false;renderSearch();}
 },true);
 document.addEventListener('click',async e=>{
  const open=e.target.closest('[data-hq-inbox-open]');if(open){e.preventDefault();go('chat');await refresh();document.getElementById('hqFamilyInvitations')?.scrollIntoView({block:'start'});return;}
  const send=e.target.closest('[data-hq-invite-send]');
  if(send){e.preventDefault();const person=matches.find(p=>p.user_id===send.dataset.hqInviteSend);if(!person)return;
   if(!confirm(`Invite ${person.display_name} (${person.user_code}) to ${cloud()?.family?.name||'your family HQ'}? The invitation will appear in their Chat.`))return;
   send.disabled=true;try{const r=await action('send',{family_id:cloud().familyId,user_id:person.user_id});notice(r.already_pending?'They already have a pending invitation.':'Invitation sent to their Chat.');}catch(err){notice(err.message||'Could not send invitation.');}finally{send.disabled=false;}return;
  }
  const accept=e.target.closest('[data-hq-invite-accept]'),decline=e.target.closest('[data-hq-invite-decline]');if(!accept&&!decline)return;e.preventDefault();
  const id=accept?.dataset.hqInviteAccept||decline.dataset.hqInviteDecline,invitation=inbox.find(i=>i.id===id);if(!invitation||pending.has(id))return;
  pending.add(id);renderInbox();
  try{
   if(accept){
    if(cloud().familyId&&cloud().familyId!==invitation.family_id){
     if(!confirm(`To join ${invitation.family_name}, leave your current HQ first. Your personal data is kept. Continue to the leave options?`))return;
     if(!await openLeave())return;
    }
    const r=await action('accept',{invite_id:id});await cloud().openFamily(r.family_id);notice('Joined '+invitation.family_name);go('chat');
   }else{await action('decline',{invite_id:id});notice('Invitation declined.');}
   await refresh();
  }catch(err){inboxNote=err.message||'Could not respond to invitation.';notice(inboxNote);}finally{pending.delete(id);renderInbox();}
 },true);
 const originalRender=render;render=function(...args){const result=originalRender.apply(this,args);decorateChat();paintBubble();return result;};
 const style=document.createElement('style');style.textContent=`
 #hqHomeChatBubble{position:fixed;top:calc(12px + env(safe-area-inset-top));right:max(12px,calc((100vw - 580px)/2 + 12px));z-index:75;width:49px;height:49px;border:2px solid #b58429;border-radius:17px;background:#fff1ab;box-shadow:0 4px 0 #92661f,0 5px 15px #103b3130;padding:7px;color:#493514}
 #hqHomeChatBubble[hidden]{display:none!important}#hqHomeChatBubble svg{display:block;width:100%;height:100%}.hq-bubble-count{position:absolute;top:-7px;right:-7px;min-width:20px;height:20px;border-radius:12px;background:#a41c2e;color:#fff;font-size:10px;font-weight:900;padding:2px 4px;border:2px solid #fff8d5}.hq-bubble-count[hidden]{display:none}
 #hqHomeChatBubble.has-unread{animation:hqChatWiggle 6s ease-in-out infinite}@keyframes hqChatWiggle{0%,17%,100%{transform:rotate(0)}3%,9%{transform:rotate(-9deg)}6%,12%{transform:rotate(9deg)}15%{transform:rotate(-4deg)}}
 #hqFamilyInvitations{scroll-margin-top:15px}#hqNameInviteForm{display:grid;gap:10px;margin-top:12px}.hq-invite-item{padding:12px;background:#fff8e9;border:1px solid #e5cd94;border-radius:14px;margin:9px 0}.hq-invite-item p{margin:5px 0 10px}.hq-invite-match{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e7e5dd}.hq-invite-match small{display:block;color:#66766c}#hqFamilyLeaveModal{position:fixed;inset:0;z-index:10010;background:#08261dc9;display:flex;align-items:center;justify-content:center;padding:18px}.hq-exit-card{position:relative;background:#fffdf6;padding:24px;border-radius:24px;max-width:500px;max-height:90dvh;overflow:auto}.hq-exit-close{position:absolute;right:10px;top:7px;font-size:27px;border:0;background:transparent;color:#653921}.hq-exit-card form{display:grid;gap:12px}#hqExitError{color:#a41c2e}@media(prefers-reduced-motion:reduce){#hqHomeChatBubble.has-unread{animation:none}}
 `;document.head.appendChild(style);paintBubble();decorateChat();
 setInterval(refresh,15000);setTimeout(refresh,1200);
 window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
