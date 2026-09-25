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

  const CLOUD_KEYS = [
    'family',
    'tasks',
    'events',
    'menu',
    'shopping',
    'places',
    'guests',
    'foodNeeds',
    'activitiesDone',
    'advent'
  ];

  let session = null;
  let activeFamily = null;
  let familyMembers = [];
  let channel = null;
  let syncingRemote = false;
  let pushTimer = null;
  let cloudReady = false;
  let lastCloudUpdatedAt = null;

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
      setTimeout(() => {
        syncingRemote = false;
      }, 80);
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

  async function selectFamily(familyId) {
    const memberships = await loadMemberships();
    const row =
      memberships.find(m => m.family_id === familyId) ||
      memberships[0];

    activeFamily = row
      ? {
          id: row.family_id,
          name: row.families?.name || 'Christmas HQ Family',
          role: row.role
        }
      : null;

    localStorage.setItem('christmas-hq-family-id', activeFamily?.id || '');

    if (!activeFamily) {
      cloudReady = false;
      unsubscribeRealtime();
      render(false);
      return;
    }

    await refreshMembers();
    await pullCloudState(true);
    subscribeRealtime();
    cloudReady = true;
    render(false);
  }

  async function pullCloudState(seedIfMissing = false) {
    if (!activeFamily) return;

    const { data, error } = await db
      .from('shared_items')
      .select('id,data,updated_at')
      .eq('family_id', activeFamily.id)
      .eq('section', 'notes')
      .eq('title', '__app_state__')
      .maybeSingle();

    if (error) throw error;

    if (data?.data) {
      lastCloudUpdatedAt = data.updated_at;
      applySharedSnapshot(data.data);
    } else if (seedIfMissing) {
      await pushCloudState(true);
    }
  }

  async function pushCloudState(force = false) {
    if (!session?.user || !activeFamily) return;
    if (!force && syncingRemote) return;

    const snapshot = sharedSnapshot();

    const { data: existing, error: findError } = await db
      .from('shared_items')
      .select('id')
      .eq('family_id', activeFamily.id)
      .eq('section', 'notes')
      .eq('title', '__app_state__')
      .maybeSingle();

    if (findError) throw findError;

    let result;

    if (existing?.id) {
      result = await db
        .from('shared_items')
        .update({
          data: snapshot,
          owner_user_id: session.user.id
        })
        .eq('id', existing.id)
        .select('updated_at')
        .single();
    } else {
      result = await db
        .from('shared_items')
        .insert({
          family_id: activeFamily.id,
          section: 'notes',
          title: '__app_state__',
          data: snapshot,
          created_by: session.user.id,
          owner_user_id: session.user.id
        })
        .select('updated_at')
        .single();
    }

    if (result.error) throw result.error;
    lastCloudUpdatedAt = result.data?.updated_at || new Date().toISOString();
  }

  function schedulePush() {
    if (!cloudReady || syncingRemote) return;

    clearTimeout(pushTimer);

    pushTimer = setTimeout(() => {
      pushCloudState().catch(err =>
        console.warn('Christmas HQ cloud sync failed', err)
      );
    }, 500);
  }

  function unsubscribeRealtime() {
    if (channel) {
      db.removeChannel(channel);
      channel = null;
    }
  }

  function subscribeRealtime() {
    unsubscribeRealtime();
    if (!activeFamily) return;

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
          if (payload.new?.title === '__app_state__') {
            lastCloudUpdatedAt = payload.new.updated_at || null;
            applySharedSnapshot(payload.new.data);
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
        () => refreshMembers().then(() => render(false))
      )
      .subscribe();
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
            <button class="btn alt" type="submit" name="mode" value="signup">Create account</button>
          </div>
        </form>

        <p class="cloud-note">
          Your personal gifts, spending and Secret Santa assignment are not included in the shared family sync.
        </p>

        <div id="cloudError" class="cloud-error"></div>
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

          <button class="btn warn" type="button" data-cloud-action="signout">
            Sign out
          </button>
        </div>

        <div id="cloudError" class="cloud-error"></div>
      </div>`;
  }

  function connectedPanel() {
    const memberHtml = familyMembers
      .map(
        member =>
          `<span class="cloud-member">${cloudEsc(
            member.display_name || 'Family member'
          )}${member.role === 'owner' ? ' ★' : ''}</span>`
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

        <div class="cloud-status">
          Shared family plans update between connected phones.
          Last cloud change: <b>${cloudEsc(when)}</b>.
        </div>

        <div class="cloud-members">
          ${memberHtml || '<span class="cloud-member">You</span>'}
        </div>

        <div class="cloud-row" style="margin-top:12px">
          <button class="btn" type="button" data-cloud-action="invite">Invite family</button>
          <button class="btn alt" type="button" data-cloud-action="syncnow">Sync now</button>
          <button class="btn warn" type="button" data-cloud-action="signout">Sign out</button>
        </div>

        <div id="cloudInviteBox"></div>

        <p class="cloud-note">
          <b>Shared:</b> family list, checklist, events, menu, groceries, guests,
          food requirements, places and family activities.<br>
          <b>Private on your device:</b> gifts, budget/spending, Santa letter and Secret Santa assignment.
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

    await selectFamily(data.id);
    await pushCloudState(true);
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
        return cloudPanelHtml() + originalSettings();
      };
    }

    if (typeof persist === 'function' && !window.__christmasCloudPersistWrapped) {
      window.__christmasCloudPersistWrapped = true;
      const originalPersist = persist;

      persist = function (msg) {
        originalPersist(msg);
        schedulePush();
      };
    }

    const { data } = await db.auth.getSession();
    session = data.session;

    db.auth.onAuthStateChange((_event, nextSession) => {
      session = nextSession;

      if (!session) {
        activeFamily = null;
        familyMembers = [];
        cloudReady = false;
        unsubscribeRealtime();
        render(false);
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

      const formData = new FormData(event.target);
      const mode = event.submitter?.value || 'signin';
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');
      const displayName = String(formData.get('displayName') || '').trim();
      const errorBox = document.getElementById('cloudError');

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

          if (!data.session) {
            if (errorBox) {
              errorBox.textContent =
                'Account created. Check your email to confirm it, then come back and sign in.';
            }
            return;
          }
        } else {
          const { error } = await db.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;
        }

        const { data } = await db.auth.getSession();
        session = data.session;

        const memberships = await loadMemberships();

        if (memberships[0]) {
          await selectFamily(memberships[0].family_id);
        } else {
          render(false);
        }
      } catch (err) {
        if (errorBox) {
          errorBox.textContent = err.message || 'Could not sign in.';
        }
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
        await db.auth.signOut();

        session = null;
        activeFamily = null;
        familyMembers = [];
        cloudReady = false;

        unsubscribeRealtime();
        render(false);
      }

      if (action === 'invite') {
        await createInvite();
      }

      if (action === 'syncnow') {
        await pushCloudState(true);
        await pullCloudState(false);
        notice('Family Cloud synced');
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
