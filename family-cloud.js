/* Christmas HQ - Remember Me enhancement */
(() => {
  'use strict';
  const KEY='christmas-hq-remember-me';

  function addStyle(){
    if(document.getElementById('rememberMeStyle')) return;
    const s=document.createElement('style');
    s.id='rememberMeStyle';
    s.textContent=`
      .cloud-remember{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:800;color:#50665a;cursor:pointer;user-select:none;margin:2px 0 3px}
      .cloud-remember input{width:20px;height:20px;accent-color:var(--forest);cursor:pointer}
    `;
    document.head.appendChild(s);
  }

  function enhance(){
    addStyle();
    const form=document.getElementById('cloudAuthForm');
    if(!form || form.querySelector('[name="rememberMe"]')) return;
    const password=form.querySelector('input[name="password"]');
    if(!password) return;
    const label=document.createElement('label');
    label.className='cloud-remember';
    label.innerHTML=`<input name="rememberMe" type="checkbox"><span>Remember me on this device</span>`;
    const box=label.querySelector('input');
    box.checked=localStorage.getItem(KEY)!=='no';
    password.insertAdjacentElement('afterend',label);

    form.addEventListener('submit',()=>{
      localStorage.setItem(KEY,box.checked?'yes':'no');
      if(box.checked) sessionStorage.removeItem('christmas-hq-session-only');
      else sessionStorage.setItem('christmas-hq-session-only','yes');
    });
  }

  async function enforce(){
    if(localStorage.getItem(KEY)==='no' && !sessionStorage.getItem('christmas-hq-session-only')){
      const cloud=window.ChristmasHQFamilyCloud;
      if(cloud?.client){
        try{ await cloud.client.auth.signOut(); }catch(e){}
      }
    }
  }

  const observer=new MutationObserver(enhance);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',async()=>{await enforce();enhance();});
  enhance();
})();
