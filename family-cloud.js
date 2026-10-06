/* Christmas HQ Family Cloud
   Shared family sync powered by Supabase.
   Personal gifts, budget/expenses, Santa letter, and Secret Santa assignments stay private.
*/
(() => {
  'use strict';

  const SUPABASE_URL = 'https://onrphnvudtcmhltfbwkk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_uBe-QyM-eAYFpiRQxnsp7w_7v2HQoBl';

  if (!window.supabase || !window.supabase.createClient) {
    console.warn('Christmas HQ Family Cloud: Supabase library not loaded.');
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  const lists = window.HQFamilyData;
  if (!lists) return;
  const CLOUD_KEYS = lists.keys;
  const VIEW_KEY = STORAGE + ':cloud-view-v2';
  let preferredScope = readSaved(VIEW_KEY)?.scope || 'shared';
  let scope = 'personal';
  let personal = null;
  let remoteBase = null;
  let sharedDraft = null;
  let viewSnapshot = null;
  let pushInFlight = null;
  let membershipTimer = null;
  let membershipCheck = null;

  let session = null;
  let activeFamily = null;
  let familyMembers = [];
  let channel = null;
  let syncingRemote = false;
  let pushTimer = null;
  let cloudReady = false;
  let lastCloudUpdatedAt = null;
  let authInFlight = false;
  let authCooldownTimer = null;
  let authCooldownUntil = 0;
  let authCooldownBaseMessage = '';
  let authCooldownKind = ''; // 'confirm' | 'rate'
  let memberSearch = '';
  let selectedMemberId = '';

  window.ChristmasHQFamilyCloud = {
  get client() {
    return db;
  },
  get session() {
    return session;
  },
  get familyId() {
    return activeFamily?.id || '';
  },
  get family() {
    return activeFamily;
  },
  get members() {
    return familyMembers.slice();
  },
  get isOwner() {
    return isFamilyOwner();
  },
  get scope() { return scope; },
  setScope(value) { return changeScope(value); },
  exportPlans() {
    if (!personal) throw new Error('Family lists are still loading. Try your backup again shortly.');
    captureLists();
    const personalPlan = { ...clone(state), ...clone(personal), santa: { ...clone(state.santa), ...clone(personal.santa) } };
    return { personalPlan, sharedPlan: activeFamily && sharedDraft ? clone(sharedDraft) : null,
      family: activeFamily ? { id: activeFamily.id, name: activeFamily.name } : null };
  },
  async refreshMembers() {
    await refreshMembers();
    return familyMembers.slice();
  },
  removeMember(userId) {
    return removeFamilyMember(userId);
  },
  leaveFamily() {
    return leaveActiveFamily();
  }
};

  function isFamilyOwner() {
    const uid = session?.user?.id;
    if (!uid || !activeFamily) return false;
    return activeFamily.ownerUserId === uid;
  }

  async function removeFamilyMember(userId) {
    if (!session?.user || !activeFamily) throw new Error('Connect Family Cloud in Settings first.');
    if (!userId) throw new Error('That family member could not be found.');
    if (userId === session.user.id) return leaveActiveFamily();
    if (!isFamilyOwner()) throw new Error('Only the person who created this family can remove members.');

    if (userId === activeFamily.ownerUserId) throw new Error('The family owner cannot be removed.');
    await pushCloudState();
    const { data, error } = await db.rpc('hq_remove_family_member', {
      p_family_id: activeFamily.id, p_user_id: userId
    });
    if (error) throw error;
    if (data?.data) receiveSnapshot(data.data, data.updated_at);
    familyMembers = familyMembers.filter(m => m.user_id !== userId);
    await refreshMembers();
    render(false);
    return data;
  }

  async function leaveActiveFamily() {
    if (!session?.user || !activeFamily) throw new Error('You are not connected to a family.');

    if (isFamilyOwner()) throw new Error('The family owner cannot leave this family.');
    await pushCloudState();
    const { data, error } = await db.rpc('hq_remove_family_member', {
      p_family_id: activeFamily.id, p_user_id: session.user.id
    });
    if (error) throw error;
    detachFamily();
    notice('You left the family. Your personal lists are kept.');
    return data;
  }

  const clone = value => {
    try {
      return structuredClone(value);
    } catch (e) {
      return JSON.parse(JSON.stringify(value));
    }
  };

  const cloudEsc = value =>
    String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  function cloudStyle() {
    if (document.getElementById('familyCloudStyle')) return;

    const style = document.createElement('style');
    style.id = 'familyCloudStyle';
    style.textContent = `
      .cloud-card{
        background:linear-gradient(135deg,#eef6eb,#fff7e7);
        border:2px solid #bfd5c1;
        border-radius:19px;
        padding:16px;
        margin-bottom:13px
      }
      .cloud-head{display:flex;align-items:center;gap:11px;margin-bottom:10px}
      .cloud-head .em{font-size:28px}
      .cloud-head h3{margin:0;color:var(--forest)}
      .cloud-status{font-size:13px;color:#50665a;line-height:1.5}
      .cloud-status b{color:var(--forest)}
      .cloud-grid{display:grid;gap:9px;margin-top:12px}
      .cloud-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .cloud-row .field{flex:1;min-width:160px}
      .cloud-note{font-size:12.5px;color:#68776d;line-height:1.5;margin:9px 0 0}
      .cloud-good{
        display:inline-block;background:#e2f2e2;color:#235e3d;
        border-radius:99px;padding:5px 9px;font-size:12px;font-weight:850
      }
      .cloud-code{
        font:900 22px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;
        letter-spacing:2px;background:#fff;border:1px dashed #c8d7c7;
        border-radius:12px;padding:10px 12px;text-align:center;color:var(--forest)
      }
      .cloud-members{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
      .cloud-member{
        background:white;border:1px solid #dae6d7;border-radius:99px;
        padding:7px 10px;font-size:12px;font-weight:800
      }
      .cloud-error{font-size:12px;color:#9a3340;margin-top:8px}
      .cloud-member-search{margin:12px 0 16px;position:relative}
      .cloud-member-search label{display:block;margin:0 0 6px;font-size:11px;font-weight:850;color:#355a47}
      .cloud-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
      #screen .cloud-card .cloud-member-search .field{min-width:0;min-height:46px!important;border:2px solid #cfb56c!important;border-radius:12px!important;background:#fffdf6!important;font-size:13px!important;color:#173e30!important}
      #screen .cloud-card .cloud-member-search button[data-cloud-action="removechosenmember"]{
        position:relative!important;display:inline-flex!important;align-items:center!important;
        justify-content:center!important;gap:7px!important;min-height:44px!important;
        padding:10px 13px!important;margin:0 0 4px!important;
        border:2px solid #edc767!important;border-radius:12px!important;
        background:linear-gradient(160deg,#ef4150 0%,#c71931 42%,#890d24 100%)!important;
        color:#fff8e4!important;-webkit-text-fill-color:#fff8e4!important;
        font-size:12px!important;font-weight:900!important;line-height:1.2!important;
        letter-spacing:.1px!important;text-shadow:0 1px 2px #650619!important;
        box-shadow:0 4px 0 #660a1d,0 6px 12px #8d12222e,inset 0 1px 0 #ffffff55!important;
        white-space:nowrap!important;transition:transform .12s,box-shadow .12s!important;
      }
      #screen .cloud-card .cloud-member-search button[data-cloud-action="removechosenmember"]::before{
        content:'🗑'!important;font-size:15px!important;line-height:1!important;margin:0!important;
      }
      #screen .cloud-card .cloud-member-search button[data-cloud-action="removechosenmember"]::after{content:none!important}
      #screen .cloud-card .cloud-member-search button[data-cloud-action="removechosenmember"]:active{
        transform:translateY(3px)!important;box-shadow:0 1px 0 #660a1d,inset 0 1px 0 #ffffff35!important;
      }
      #screen .cloud-card .cloud-member-search button[data-cloud-action="removechosenmember"]:disabled{opacity:.45!important;cursor:not-allowed!important}
      .cloud-search-results{display:grid;gap:4px;padding:6px;margin-top:7px;background:#fffdf6;border:1px solid #d5bd7a;border-radius:12px;max-height:220px;overflow:auto;box-shadow:0 5px 12px #173e3012}
      .cloud-search-results[hidden]{display:none!important}
      #screen .cloud-card .cloud-search-results button{width:100%!important;min-height:40px!important;margin:0!important;padding:10px 12px!important;border:0!important;border-radius:8px!important;background:#edf4e9!important;color:#173e30!important;-webkit-text-fill-color:#173e30!important;font-size:13px!important;font-weight:800!important;text-align:left!important;box-shadow:none!important}
      .cloud-search-empty{padding:8px 10px;font-size:12px;color:#67776b}
    `;
    document.head.appendChild(style);
  }

  function sharedSnapshot() {
    const out = { year: state.year };

    CLOUD_KEYS.forEach(key => {
      out[key] = clone(state[key] ?? []);
    });

    out.santa = {
      budget: Number(state.santa?.budget || 0),
      exchangeDate: state.santa?.exchangeDate || '',
      message: state.santa?.message || '',
      exclusions: Array.isArray(state.santa?.exclusions)
        ? clone(state.santa.exclusions)
        : []
    };

    return out;
  }

  function personalKey(userId = session?.user?.id || 'device') {
    return STORAGE + ':personal-v2:' + userId;
  }

  function readSaved(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch (e) { return null; }
  }

  function savePersonal() {
    // A failed backup must stop us replacing personal lists with shared lists.
    localStorage.setItem(personalKey(), JSON.stringify(personal));
  }

  function preparePersonal() {
    const previousView = readSaved(VIEW_KEY);
    if (previousView?.scope === 'shared') {
      const saved = readSaved(personalKey(previousView.userId));
      if (!saved) throw new Error('Your personal backup could not be loaded. Family sync was paused.');
      applySharedSnapshot(saved);
    }
    const saved = readSaved(personalKey());
    personal = saved || sharedSnapshot();
    savePersonal();
    scope = 'personal';
    applySharedSnapshot(personal);
    markView();
  }

  function markView() {
    localStorage.setItem(VIEW_KEY, JSON.stringify({
      scope, userId: session?.user?.id || 'device', familyId: activeFamily?.id || ''
    }));
  }

  function draftKey() {
    return STORAGE + ':family-draft-v2:' + session.user.id + ':' + activeFamily.id;
  }

  function saveDraft() {
    if (activeFamily && remoteBase && sharedDraft) {
      localStorage.setItem(draftKey(), JSON.stringify({ base: remoteBase, draft: sharedDraft }));
    }
  }

  function captureLists() {
    if (syncingRemote) return;
    const current = sharedSnapshot();
    if (scope === 'personal') {
      personal = current;
      savePersonal();
      return;
    }
    const before = viewSnapshot || sharedDraft;
    if (!before) return;
    personal = lists.rememberOwn(personal, before, current, session.user.id);
    savePersonal();
    current._hq = clone(before._hq || { version: 2, revision: 0, authors: {} });
    CLOUD_KEYS.forEach(key => {
      const ids = new Set((before[key] || []).map(lists.identity));
      current._hq.authors[key] ||= {};
      current[key].forEach(item => {
        if (!ids.has(lists.identity(item))) current._hq.authors[key][lists.identity(item)] = session.user.id;
      });
    });
    sharedDraft = current;
    viewSnapshot = clone(current);
    saveDraft();
  }

  function receiveSnapshot(data, updatedAt) {
    const incomingRevision = Number(data?._hq?.revision || 0);
    if (remoteBase && incomingRevision < Number(remoteBase._hq?.revision || 0)) return;
    if (sharedDraft && remoteBase) sharedDraft = lists.merge(remoteBase, sharedDraft, data);
    else sharedDraft = clone(data);
    remoteBase = clone(data);
    lastCloudUpdatedAt = updatedAt || lastCloudUpdatedAt;
    saveDraft();
    if (scope === 'shared') {
      viewSnapshot = clone(sharedDraft);
      applySharedSnapshot(sharedDraft);
    } else render(false);
  }

  async function changeScope(nextScope) {
    if (!['personal', 'shared'].includes(nextScope) || nextScope === scope) return;
    if (nextScope === 'shared' && (!activeFamily || !cloudReady)) throw new Error('Connect to a family first.');
    captureLists();
    if (nextScope === 'shared') {
      await checkMembership();
      if (!activeFamily) return;
      await pullCloudState(false);
    }
    scope = nextScope;
    preferredScope = nextScope;
    markView();
    viewSnapshot = clone(nextScope === 'shared' ? sharedDraft : personal);
    applySharedSnapshot(viewSnapshot);
  }

  function detachFamily() {
    clearTimeout(pushTimer);
    unsubscribeRealtime();
    // Keep any pending local contribution copies. Never apply the cleaned cloud to personal.
    if (scope === 'shared') captureLists();
    scope = 'personal';
    markView();
    if (personal) applySharedSnapshot(personal);
    activeFamily = null;
    familyMembers = [];
    cloudReady = false;
    remoteBase = sharedDraft = viewSnapshot = null;
    localStorage.removeItem('christmas-hq-family-id');
    markView();
    render(false);
  }

  async function checkMembership() {
    if (!activeFamily || !session?.user) return;
    if (membershipCheck) return membershipCheck;
    const familyId = activeFamily.id;
    membershipCheck = (async () => {
      const { data, error } = await db.from('family_members').select('user_id')
        .eq('family_id', familyId).eq('user_id', session.user.id).maybeSingle();
      if (error) throw error;
      if (!data && activeFamily?.id === familyId) {
        detachFamily();
        notice('You are no longer connected to this family. Your personal lists are kept.');
      }
    })();
    try { await membershipCheck; } finally { membershipCheck = null; }
  }

  function applySharedSnapshot(data) {
    if (!data || typeof data !== 'object') return;

    syncingRemote = true;

    try {
      CLOUD_KEYS.forEach(key => {
        if (Array.isArray(data[key])) state[key] = clone(data[key]);
      });

      if (data.santa && typeof data.santa === 'object') {
        const privateAssignments = Array.isArray(state.santa?.assignments)
          ? state.santa.assignments
          : [];

        const privateDrawnAt = state.santa?.drawnAt || '';

        state.santa = {
          ...state.santa,
          ...data.santa,
          assignments: privateAssignments,
          drawnAt: privateDrawnAt
        };
      }

      try {
        localStorage.setItem(STORAGE, JSON.stringify(state));
      } catch (e) {}

      render(false);
    } finally {
      syncingRemote = false;
    }
  }

  async function loadMemberships() {
    if (!session?.user) return [];

    const { data, error } = await db
      .from('family_members')
      .select('family_id, role, display_name, joined_at, families(id,name,owner_user_id)')
      .eq('user_id', session.user.id);

    if (error) throw error;
    return data || [];
  }

  async function refreshMembers() {
    if (!activeFamily) return;

    const { data, error } = await db
      .from('family_members')
      .select('user_id, role, display_name, joined_at')
      .eq('family_id', activeFamily.id)
      .order('joined_at');

    if (!error) familyMembers = data || [];
  }

  async function selectFamily(familyId, seedFromPersonal = false) {
    clearTimeout(pushTimer);
    unsubscribeRealtime();
    if (activeFamily && scope === 'shared') {
      captureLists();
      scope = 'personal';
      applySharedSnapshot(personal);
    }
    cloudReady = false;
    remoteBase = sharedDraft = viewSnapshot = null;
    const memberships = await loadMemberships();
    const row =
      memberships.find(m => m.family_id === familyId) ||
      memberships[0];

    activeFamily = row
      ? {
          id: row.family_id,
          name: row.families?.name || 'Christmas HQ Family',
          role: row.role,
          ownerUserId: row.families?.owner_user_id || ''
        }
      : null;

    localStorage.setItem('christmas-hq-family-id', activeFamily?.id || '');

    if (!activeFamily) {
      scope = 'personal';
      markView();
      render(false);
      return;
    }

    const cached = readSaved(draftKey());
    remoteBase = cached?.base || null;
    sharedDraft = cached?.draft || null;
    await refreshMembers();
    await pullCloudState(seedFromPersonal);
    subscribeRealtime();
    cloudReady = true;
    scope = preferredScope;
    markView();
    if (scope === 'shared') {
      viewSnapshot = clone(sharedDraft);
      applySharedSnapshot(sharedDraft);
    }
    render(false);
  }

  async function pullCloudState(seedIfMissing = false) {
    if (!activeFamily) return;
    const familyId = activeFamily.id;

    const { data, error } = await db
      .from('shared_items')
      .select('id,data,updated_at')
      .eq('family_id', familyId)
      .eq('section', 'notes')
      .eq('title', '__app_state__')
      .maybeSingle();

    if (error) throw error;
    if (activeFamily?.id !== familyId) return;

    if (data?.data) {
      receiveSnapshot(data.data, data.updated_at);
    } else {
      remoteBase = { year: state.year, santa: sharedSnapshot().santa };
      CLOUD_KEYS.forEach(key => { remoteBase[key] = []; });
      sharedDraft = seedIfMissing ? clone(personal) : clone(remoteBase);
      if (seedIfMissing) await pushCloudState(true);
    }
  }

  async function pushCloudState(force = false) {
    if (!session?.user || !activeFamily) return;
    if (!force && syncingRemote) return;
    if (scope === 'shared') captureLists();
    if (pushInFlight) {
      await pushInFlight;
      return pushCloudState(force);
    }
    if (!sharedDraft || !remoteBase) return;
    if (!force && lists.equal(sharedDraft, remoteBase)) return;
    const familyId = activeFamily.id;
    pushInFlight = (async () => {
      await checkMembership();
      if (activeFamily?.id !== familyId) return;
      for (let attempt = 0; attempt < 3; attempt++) {
        const sent = clone(sharedDraft);
        const { data, error } = await db.rpc('hq_save_family_state', {
          p_family_id: familyId, p_revision: Number(remoteBase._hq?.revision || 0), p_data: sent
        });
        if (activeFamily?.id !== familyId) return;
        if (error?.code === '40001') { await pullCloudState(false); continue; }
        if (error) {
          if (error.code === '42501') await checkMembership();
          throw error;
        }
        // Rebase edits made while this request was in flight onto the accepted snapshot.
        sharedDraft = lists.merge(sent, sharedDraft, data.data);
        remoteBase = clone(data.data);
        lastCloudUpdatedAt = data.updated_at;
        saveDraft();
        if (scope === 'shared') {
          viewSnapshot = clone(sharedDraft);
          applySharedSnapshot(sharedDraft);
        }
        if (!lists.equal(sharedDraft, remoteBase)) schedulePush();
        return;
      }
      throw new Error('Family sync is busy. Your changes are saved on this phone; press Sync now to retry.');
    })();
    try { await pushInFlight; } finally { pushInFlight = null; }
  }

  function schedulePush() {
    if (!cloudReady || syncingRemote || scope !== 'shared') return;

    clearTimeout(pushTimer);

    pushTimer = setTimeout(() => {
      pushCloudState().catch(err => {
        console.warn('Christmas HQ cloud sync failed', err);
        notice(err.message || 'Family sync paused. Your changes are kept on this phone.');
      });
    }, 500);
  }

  function unsubscribeRealtime() {
    clearInterval(membershipTimer);
    membershipTimer = null;
    if (channel) {
      db.removeChannel(channel);
      channel = null;
    }
  }

  function subscribeRealtime() {
    unsubscribeRealtime();
    if (!activeFamily) return;

    const familyId = activeFamily.id;
    membershipTimer = setInterval(() => checkMembership().catch(() => {}), 15000);
    channel = db
      .channel('christmas-hq-' + activeFamily.id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_items',
          filter: 'family_id=eq.' + activeFamily.id
        },
        payload => {
          if (activeFamily?.id === familyId && payload.new?.title === '__app_state__') {
            checkMembership().then(() => {
              if (activeFamily?.id === familyId) receiveSnapshot(payload.new.data, payload.new.updated_at);
            }).catch(() => {});
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'family_members',
          filter: 'family_id=eq.' + activeFamily.id
        },
        () => checkMembership().then(() => refreshMembers()).then(() => render(false)).catch(() => {})
      )
      .subscribe();
  }


  function authCooldownRemaining() {
    return Math.max(0, Math.ceil((authCooldownUntil - Date.now()) / 1000));
  }

  function parseAuthRateLimitSeconds(err) {
    const status = err && (err.status ?? err.statusCode);
    const msg = String((err && err.message) || '');
    const afterMatch = msg.match(/after\s+(\d+)\s+seconds?/i);
    if (status === 429 || /security purposes/i.test(msg) || afterMatch) {
      return afterMatch ? Number(afterMatch[1]) : 60;
    }
    return null;
  }

  function isUserAlreadyExistsError(err) {
    const msg = String((err && err.message) || '').toLowerCase();
    return (
      /already\s+(been\s+)?registered/.test(msg) ||
      /user\s+already\s+exists/.test(msg) ||
      /email.*(already|exists)/.test(msg) ||
      /already\s+exists/.test(msg)
    );
  }

  function getAuthButtons(form) {
    const root = form || document.getElementById('cloudAuthForm');
    if (!root) return { signInBtn: null, signUpBtn: null };
    return {
      signInBtn: root.querySelector('button[value="signin"]'),
      signUpBtn: root.querySelector('button[value="signup"]')
    };
  }

  function setAuthBusy(form, mode) {
    const { signInBtn, signUpBtn } = getAuthButtons(form);
    if (signInBtn) {
      signInBtn.disabled = true;
      if (mode === 'signin') signInBtn.textContent = 'Signing in…';
    }
    if (signUpBtn) {
      signUpBtn.disabled = true;
      if (mode === 'signup') signUpBtn.textContent = 'Creating account…';
    }
  }

  function rateLimitCooldownMessage(secondsLeft) {
    return (
      "We've already sent a link to that email. Check your inbox and junk folder, then press Sign in. You can try again in " +
      secondsLeft +
      ' seconds.'
    );
  }

  function updateAuthCooldownMessage() {
    const errorBox = document.getElementById('cloudError');
    const left = authCooldownRemaining();
    if (!errorBox) return;

    if (authCooldownKind === 'rate') {
      errorBox.textContent = rateLimitCooldownMessage(left);
      return;
    }

    if (authCooldownBaseMessage) {
      errorBox.textContent = authCooldownBaseMessage;
    }
  }

  function applyAuthCooldownUi(form) {
    const { signInBtn, signUpBtn } = getAuthButtons(form);
    const left = authCooldownRemaining();

    if (signInBtn && !authInFlight) {
      signInBtn.disabled = false;
      signInBtn.textContent = 'Sign in';
    }

    if (signUpBtn) {
      if (left > 0) {
        signUpBtn.disabled = true;
        signUpBtn.textContent = 'Create account (' + left + 's)';
      } else if (!authInFlight) {
        signUpBtn.disabled = false;
        signUpBtn.textContent = 'Create account';
      }
    }

    if (left > 0) updateAuthCooldownMessage();
  }

  function clearAuthCooldown() {
    if (authCooldownTimer) {
      clearInterval(authCooldownTimer);
      authCooldownTimer = null;
    }
    authCooldownUntil = 0;
    authCooldownBaseMessage = '';
    authCooldownKind = '';
  }

  function startAuthCooldown(seconds, kind, message) {
    clearAuthCooldown();
    const secs = Math.max(1, Number(seconds) || 60);
    authCooldownUntil = Date.now() + secs * 1000;
    authCooldownKind = kind || 'confirm';
    authCooldownBaseMessage = message || '';

    applyAuthCooldownUi();
    authCooldownTimer = setInterval(() => {
      const left = authCooldownRemaining();
      applyAuthCooldownUi();
      if (left <= 0) {
        clearAuthCooldown();
        applyAuthCooldownUi();
      }
    }, 250);
  }

  function restoreAuthButtonsAfterRequest(form) {
    const { signInBtn, signUpBtn } = getAuthButtons(form);
    if (authCooldownRemaining() > 0) {
      applyAuthCooldownUi(form);
      return;
    }
    if (signInBtn) {
      signInBtn.disabled = false;
      signInBtn.textContent = 'Sign in';
    }
    if (signUpBtn) {
      signUpBtn.disabled = false;
      signUpBtn.textContent = 'Create account';
    }
  }

  function authPanel() {
    return `
      <div class="cloud-card">
        <div class="cloud-head">
          <span class="em">☁️</span>
          <div>
            <h3>Family Cloud</h3>
            <div class="cloud-status">
              Sign in so your family can share plans between phones.
            </div>
          </div>
        </div>

        <form id="cloudAuthForm" class="cloud-grid">
          <input class="field" name="displayName" placeholder="Your name" maxlength="50">
          <input class="field" name="email" type="email" placeholder="Email address" autocomplete="email" required>
          <input class="field" name="password" type="password" placeholder="Password (6+ characters)" minlength="6" autocomplete="current-password" required>

          <div class="cloud-row">
            <button class="btn" type="submit" name="mode" value="signin">Sign in</button>
            <button class="btn alt" type="submit" name="mode" value="signup"${authCooldownRemaining() > 0 ? ' disabled' : ''}>${authCooldownRemaining() > 0 ? 'Create account (' + authCooldownRemaining() + 's)' : 'Create account'}</button>
          </div>
        </form>

        <p class="cloud-note">
          Your personal gifts, spending and Secret Santa assignment are not included in the shared family sync.
        </p>

        <div id="cloudError" class="cloud-error">${authCooldownRemaining() > 0 ? cloudEsc(authCooldownKind === 'rate' ? rateLimitCooldownMessage(authCooldownRemaining()) : (authCooldownBaseMessage || '')) : ''}</div>
      </div>`;
  }

  function familySetupPanel() {
    const joinCode = new URLSearchParams(location.search).get('join') || '';

    return `
      <div class="cloud-card">
        <div class="cloud-head">
          <span class="em">👪</span>
          <div>
            <h3>Connect your family</h3>
            <div class="cloud-status">
              Signed in as <b>${cloudEsc(session.user.email || '')}</b>
            </div>
          </div>
        </div>

        <div class="cloud-grid">
          <form id="cloudCreateFamilyForm" class="cloud-row">
            <input class="field" name="name" value="Our Christmas HQ" maxlength="70" aria-label="Family name">
            <button class="btn" type="submit">Create family</button>
          </form>

          <div style="text-align:center;font-weight:900;color:#829087">OR</div>

          <form id="cloudJoinFamilyForm" class="cloud-row">
            <input class="field" name="code" value="${cloudEsc(joinCode)}" placeholder="Invite code" maxlength="12" required>
            <button class="btn alt" type="submit">Join family</button>
          </form>

          <button class="btn" type="button" data-cloud-action="signout">
            Sign out
          </button>
        </div>

        <div id="cloudError" class="cloud-error"></div>
      </div>`;
  }

  function removableMembers() {
    if (!isFamilyOwner()) return [];
    return familyMembers.filter(member => member.user_id !== activeFamily.ownerUserId && member.user_id !== session.user.id);
  }

  function updateMemberSearch() {
    const input = document.getElementById('cloudMemberSearch');
    const results = document.getElementById('cloudMemberResults');
    const remove = document.getElementById('cloudRemoveChosen');
    if (!input || !results || !remove) return;
    selectedMemberId = '';
    memberSearch = input.value;
    remove.disabled = true;
    remove.setAttribute('aria-label', 'Select a family member to remove');
    const query = memberSearch.trim().toLocaleLowerCase();
    if (!query) { results.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
    const matches = removableMembers().filter(member => String(member.display_name || 'Family member').toLocaleLowerCase().includes(query));
    results.innerHTML = matches.length ? matches.map(member => `<button type="button" data-cloud-action="choosemember" data-user-id="${cloudEsc(member.user_id)}">${cloudEsc(member.display_name || 'Family member')}</button>`).join('') : '<div class="cloud-search-empty">No matching family members</div>';
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  document.addEventListener('input', event => {
    if (event.target.id === 'cloudMemberSearch') updateMemberSearch();
  });
  document.addEventListener('keydown', event => {
    if (event.target.id !== 'cloudMemberSearch') return;
    const results = document.getElementById('cloudMemberResults');
    if (event.key === 'Escape' && results) {
      results.hidden = true;
      event.target.setAttribute('aria-expanded', 'false');
    }
    if (event.key === 'ArrowDown' && results && !results.hidden) {
      event.preventDefault();
      results.querySelector('button')?.focus();
    }
  });

  function connectedPanel() {
    const selectedMember = removableMembers().find(member => member.user_id === selectedMemberId);
    if (!selectedMember) selectedMemberId = '';
    const memberHtml = familyMembers
      .map(
        member =>
          `<span class="cloud-member">${cloudEsc(
            member.display_name || 'Family member'
          )}${member.user_id === activeFamily.ownerUserId ? ' ★' : ''}</span>`
      )
      .join('');

    const when = lastCloudUpdatedAt
      ? new Date(lastCloudUpdatedAt).toLocaleString('en-AU', {
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: '2-digit'
        })
      : 'just now';

    return `
      <div class="cloud-card">
        <div class="cloud-head">
          <span class="em">☁️</span>
          <div>
            <h3>${cloudEsc(activeFamily.name)}</h3>
            <div class="cloud-status">
              <span class="cloud-good">✓ Family sync connected</span>
            </div>
          </div>
        </div>

        ${isFamilyOwner() ? `<div class="cloud-member-search"><label for="cloudMemberSearch">Manage family members</label><div class="cloud-search-row"><input id="cloudMemberSearch" class="field" type="search" placeholder="Search family member…" value="${cloudEsc(selectedMember?.display_name || memberSearch)}" autocomplete="off" aria-label="Search family member" aria-controls="cloudMemberResults" aria-expanded="false"><button id="cloudRemoveChosen" class="btn warn" type="button" data-cloud-action="removechosenmember" ${selectedMember ? '' : 'disabled'} aria-label="${selectedMember ? 'Remove ' + cloudEsc(selectedMember.display_name || 'family member') + ' from HQ' : 'Select a family member to remove'}">Remove</button></div><div id="cloudMemberResults" class="cloud-search-results" hidden></div></div>` : ''}

        <div class="cloud-status">
          Shared family plans update between connected phones.
          Last cloud change: <b>${cloudEsc(when)}</b>.
        </div>

        <div class="cloud-row" style="margin-top:12px" aria-label="Choose which lists to use">
          <button class="btn ${scope === 'personal' ? '' : 'alt'}" type="button" data-cloud-action="personal" aria-pressed="${scope === 'personal'}">🔒 My personal lists</button>
          <button class="btn ${scope === 'shared' ? '' : 'alt'}" type="button" data-cloud-action="shared" aria-pressed="${scope === 'shared'}">👪 Family HQ lists</button>
        </div>
        <p class="cloud-note">${scope === 'personal' ? 'Your personal lists are open. Changes stay on this phone.' : 'Family HQ lists are open. Items you add are also kept in your personal lists.'}</p>

        <div class="cloud-members">
          ${memberHtml || '<span class="cloud-member">You</span>'}
        </div>

        <div class="cloud-row" style="margin-top:12px">
          <button class="btn" type="button" data-cloud-action="invite">Invite family</button>
          <button class="btn alt" type="button" data-cloud-action="syncnow">Sync now</button>
          <button class="btn" type="button" data-cloud-action="signout">Sign out</button>
          ${!isFamilyOwner() ? '<button class="btn warn" type="button" data-cloud-action="leavefamily">Leave family HQ</button>' : ''}
        </div>

        <div id="cloudInviteBox"></div>

        <p class="cloud-note">
          <b>Shared:</b> family list, checklist, events, menu, groceries, guests,
          food requirements, places and family activities.<br>
          <b>Private on your device:</b> gifts, budget/spending, Santa letter and Secret Santa assignment.
          Music and other personal settings stay on your phone.<br>
          Removing a member removes the shared items recorded as theirs. Their personal lists stay intact.
          Older shared entries without a recorded creator are kept.
        </p>

        <div id="cloudError" class="cloud-error"></div>
      </div>`;
  }

  function cloudPanelHtml() {
    if (!session) return authPanel();
    if (!activeFamily) return familySetupPanel();
    return connectedPanel();
  }

  async function createFamily(name) {
    const { data, error } = await db
      .from('families')
      .insert({
        name: name || 'Our Christmas HQ',
        owner_user_id: session.user.id
      })
      .select('id,name')
      .single();

    if (error) throw error;

    await selectFamily(data.id, true);
    notice('Family Cloud created');
  }

  async function joinFamily(code) {
    const { data, error } = await db.rpc('join_family_by_code', {
      p_code: String(code || '').trim()
    });

    if (error) throw error;

    history.replaceState({}, '', location.pathname + location.hash);
    await selectFamily(data);
    notice('Joined the family');
  }

  async function createInvite() {
    if (!activeFamily) return;

    const { data: code, error } = await db.rpc('create_family_invite', {
      p_family_id: activeFamily.id,
      p_days_valid: 14
    });

    if (error) throw error;

    const link =
      location.origin +
      location.pathname +
      '?join=' +
      encodeURIComponent(code);

    const box = document.getElementById('cloudInviteBox');

    if (box) {
      box.innerHTML = `
        <div class="cloud-code" style="margin-top:12px">${cloudEsc(code)}</div>

        <div class="cloud-row" style="margin-top:8px">
          <button class="btn small" type="button"
            data-cloud-action="shareinvite"
            data-link="${cloudEsc(link)}">
            Share invite
          </button>

          <button class="btn small alt" type="button"
            data-cloud-action="copyinvite"
            data-link="${cloudEsc(link)}">
            Copy link
          </button>
        </div>

        <p class="cloud-note">
          This invite works for 14 days. They open the link, create/sign into
          their own account, and join your family.
        </p>`;
    }
  }

  async function shareInvite(link) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join our Christmas HQ',
          text: 'Join our family on Christmas HQ 🎄',
          url: link
        });
        return;
      }
    } catch (e) {
      if (e.name === 'AbortError') return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link);
      notice('Invite link copied');
    }
  }

  async function start() {
    cloudStyle();

    if (typeof settings === 'function' && !window.__christmasCloudSettingsWrapped) {
      window.__christmasCloudSettingsWrapped = true;
      const originalSettings = settings;

      settings = function () {
        const html = originalSettings();
        if (html.startsWith('<div class="gift-intro">')) {
          let depth = 0;
          for (let i = 0; i < html.length; i++) {
            if (html.startsWith('<div', i)) { depth++; i += 3; continue; }
            if (html.startsWith('</div>', i)) {
              depth--;
              if (depth === 0) {
                const end = i + 6;
                return html.slice(0, end) + cloudPanelHtml() + html.slice(end);
              }
              i += 5;
            }
          }
        }
        return cloudPanelHtml() + html;
      };
    }

    if (typeof persist === 'function' && !window.__christmasCloudPersistWrapped) {
      window.__christmasCloudPersistWrapped = true;
      const originalPersist = persist;

      persist = function (msg) {
        try { captureLists(); }
        catch (err) {
          notice('Personal backup could not be saved. Family sync was paused.');
          console.warn(err);
          originalPersist(msg);
          return;
        }
        originalPersist(msg);
        schedulePush();
      };
    }

    const { data } = await db.auth.getSession();
    session = data.session;
    preparePersonal();

    const originalRender = render;
    render = function (...args) {
      originalRender(...args);
      if (activeFamily && ui.tab !== 'settings') {
        const container = document.getElementById('screen');
        if (container && !container.querySelector('[data-hq-list-scope]')) {
          const banner = document.createElement('div');
          banner.dataset.hqListScope = 'true';
          banner.className = 'cloud-row';
          banner.style.cssText = 'margin:0 0 10px;font-size:12px;justify-content:space-between';
          banner.innerHTML = `<b>${scope === 'personal' ? '🔒 My personal lists' : '👪 Family HQ lists'}</b><button class="btn small alt" type="button" data-cloud-action="${scope === 'personal' ? 'shared' : 'personal'}">${scope === 'personal' ? 'Open family lists' : 'Open personal lists'}</button>`;
          container.prepend(banner);
        }
      }
    };
    window.addEventListener('online', () => {
      checkMembership().then(() => pushCloudState()).catch(() => {});
    });
    window.addEventListener('focus', () => {
      checkMembership().then(() => pullCloudState(false)).catch(() => {});
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) checkMembership().then(() => pullCloudState(false)).catch(() => {});
    });

    db.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession && session) {
        detachFamily();
        session = null;
        savePersonal();
        markView();
      } else {
        session = nextSession;
      }
    });

    if (session) {
      const memberships = await loadMemberships();
      const storedFamilyId = localStorage.getItem('christmas-hq-family-id');
      const targetFamilyId =
        memberships.find(m => m.family_id === storedFamilyId)?.family_id ||
        memberships[0]?.family_id;

      if (targetFamilyId) {
        await selectFamily(targetFamilyId);
      } else {
        render(false);
      }
    } else {
      render(false);
    }
  }

  document.addEventListener('submit', async event => {
    if (event.target.id === 'cloudAuthForm') {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);
      const mode = event.submitter?.value || 'signin';
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');
      const displayName = String(formData.get('displayName') || '').trim();
      const errorBox = document.getElementById('cloudError');

      if (authInFlight) return;
      if (mode === 'signup' && authCooldownRemaining() > 0) return;

      authInFlight = true;
      setAuthBusy(form, mode);

      try {
        if (mode === 'signup') {
          const { data, error } = await db.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName || email.split('@')[0]
              }
            }
          });

          if (error) throw error;

          const identities = data?.user?.identities;
          if (Array.isArray(identities) && identities.length === 0) {
            if (errorBox) {
              errorBox.textContent =
                'An account with that email already exists. Press Sign in instead.';
            }
            return;
          }

          if (!data.session) {
            const confirmMsg =
              'Check your email (and junk folder) for a link from Christmas HQ, tap it, then come back and press Sign in.';
            if (errorBox) errorBox.textContent = confirmMsg;
            startAuthCooldown(60, 'confirm', confirmMsg);
            return;
          }
        } else {
          const { error } = await db.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;
        }

        clearAuthCooldown();

        const { data } = await db.auth.getSession();
        session = data.session;
        preparePersonal();

        const memberships = await loadMemberships();

        if (memberships[0]) {
          await selectFamily(memberships[0].family_id);
        } else {
          render(false);
        }
      } catch (err) {
        const rateSeconds = parseAuthRateLimitSeconds(err);
        if (rateSeconds != null) {
          startAuthCooldown(rateSeconds, 'rate', '');
          return;
        }

        if (isUserAlreadyExistsError(err)) {
          if (errorBox) {
            errorBox.textContent =
              'An account with that email already exists. Press Sign in instead.';
          }
          return;
        }

        if (errorBox) {
          errorBox.textContent = err.message || 'Could not sign in.';
        }
      } finally {
        authInFlight = false;
        restoreAuthButtonsAfterRequest(form);
      }

      return;
    }

    if (event.target.id === 'cloudCreateFamilyForm') {
      event.preventDefault();

      const formData = new FormData(event.target);
      const errorBox = document.getElementById('cloudError');

      try {
        await createFamily(String(formData.get('name') || '').trim());
      } catch (err) {
        if (errorBox) {
          errorBox.textContent = err.message || 'Could not create family.';
        }
      }

      return;
    }

    if (event.target.id === 'cloudJoinFamilyForm') {
      event.preventDefault();

      const formData = new FormData(event.target);
      const errorBox = document.getElementById('cloudError');

      try {
        await joinFamily(formData.get('code'));
      } catch (err) {
        if (errorBox) {
          errorBox.textContent = err.message || 'Could not join family.';
        }
      }
    }
  });

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-cloud-action]');
    if (!button) return;

    const action = button.dataset.cloudAction;
    const errorBox = document.getElementById('cloudError');

    try {
      if (action === 'signout') {
        captureLists();
        await pushCloudState();
        detachFamily();
        await db.auth.signOut();
        session = null;
        savePersonal();
        markView();
        render(false);
      }

      if (action === 'invite') {
        await createInvite();
      }

      if (action === 'syncnow') {
        await checkMembership();
        if (!activeFamily) return;
        await pushCloudState(true);
        await pullCloudState(false);
        notice('Family Cloud synced');
      }

      if (action === 'personal' || action === 'shared') await changeScope(action);

      if (action === 'choosemember') {
        const member = removableMembers().find(m => m.user_id === button.dataset.userId);
        if (!member) throw new Error('That family member could not be found.');
        selectedMemberId = member.user_id;
        memberSearch = member.display_name || 'Family member';
        const input = document.getElementById('cloudMemberSearch');
        const results = document.getElementById('cloudMemberResults');
        const remove = document.getElementById('cloudRemoveChosen');
        if (input) { input.value = memberSearch; input.setAttribute('aria-expanded', 'false'); }
        if (results) results.hidden = true;
        if (remove) { remove.disabled = false; remove.setAttribute('aria-label', 'Remove ' + memberSearch + ' from HQ'); remove.focus(); }
      }

      if (action === 'removechosenmember') {
        const member = removableMembers().find(m => m.user_id === selectedMemberId);
        if (!member) throw new Error('That family member could not be found.');
        if (!confirm(`Remove ${member.display_name || 'this person'} from ${activeFamily.name}?\n\nThey will lose access, and their recorded contributions will be removed from the shared family lists. Their personal lists, gifts, budget, menus, music and other phone data will be kept.\n\nOlder shared items without a recorded creator will stay.`)) return;
        button.disabled = true;
        try {
          const result = await removeFamilyMember(member.user_id);
          selectedMemberId = '';
          memberSearch = '';
          render(false);
          notice(`${member.display_name || 'Member'} removed · ${result.removed_items || 0} shared items removed`);
        } finally { button.disabled = false; }
      }

      if (action === 'leavefamily') {
        if (!confirm('Leave this family HQ? Your recorded contributions will be removed from its shared lists. All your personal phone data will be kept. Older unclaimed shared entries will stay.')) return;
        button.disabled = true;
        try { await leaveActiveFamily(); } finally { button.disabled = false; }
      }

      if (action === 'shareinvite') {
        await shareInvite(button.dataset.link || '');
      }

      if (action === 'copyinvite') {
        const link = button.dataset.link || '';

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(link);
          notice('Invite link copied');
        }
      }
    } catch (err) {
      if (errorBox) {
        errorBox.textContent =
          err.message || 'Family Cloud action failed.';
      }
    }
  });

  start().catch(err =>
    console.warn('Christmas HQ Family Cloud could not start', err)
  );
})();
