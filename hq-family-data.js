/* Shared-list helpers. Private fields never enter these snapshots. */
(function (root) {
  'use strict';
  const keys = ['family', 'tasks', 'events', 'menu', 'shopping', 'places',
    'guests', 'foodNeeds', 'activitiesDone', 'advent'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const identity = item => item && typeof item === 'object'
    ? 'id:' + String(item.id) : 'value:' + String(item);
  const canonical = value => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object' ? Object.fromEntries(
      Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
  const equal = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

  function merge(base, local, remote) {
    const result = clone(remote);
    keys.forEach(key => {
      const old = new Map((base[key] || []).map(v => [identity(v), v]));
      const next = new Map((local[key] || []).map(v => [identity(v), v]));
      const live = new Map((remote[key] || []).map(v => [identity(v), v]));
      old.forEach((v, id) => {
        if (!next.has(id)) live.delete(id);
        else if (!equal(v, next.get(id)) && live.has(id)) {
          // Remote deletion wins. Different field edits can coexist.
          const changed = next.get(id);
          if (changed && typeof changed === 'object') {
            const item = { ...live.get(id) };
            new Set([...Object.keys(v), ...Object.keys(changed)]).forEach(field => {
              if (!equal(v[field], changed[field])) {
                if (field in changed) item[field] = clone(changed[field]);
                else delete item[field];
              }
            });
            live.set(id, item);
          }
        }
      });
      next.forEach((v, id) => { if (!old.has(id) && !live.has(id)) live.set(id, clone(v)); });
      result[key] = Array.from(live.values());
      if (local._hq?.authors?.[key]) {
        result._hq ||= { version: 2, revision: 0, authors: {} };
        result._hq.authors ||= {};
        result._hq.authors[key] ||= {};
        next.forEach((v, id) => {
          if (!old.has(id) && live.has(id) && local._hq.authors[key][id]) {
            result._hq.authors[key][id] = local._hq.authors[key][id];
          }
        });
      }
    });
    for (const field of ['year', 'santa']) {
      if (!equal(base[field], local[field])) result[field] = clone(local[field]);
    }
    return result;
  }

  function rememberOwn(personal, before, after, userId) {
    const result = clone(personal);
    keys.forEach(key => {
      const previous = new Map((before[key] || []).map(v => [identity(v), v]));
      const saved = new Map((result[key] || []).map(v => [identity(v), v]));
      const next = new Map((after[key] || []).map(v => [identity(v), v]));
      next.forEach((v, id) => {
        const owner = before._hq?.authors?.[key]?.[id];
        if (!previous.has(id) || owner === userId) saved.set(id, clone(v));
      });
      previous.forEach((v, id) => {
        if (!next.has(id) && before._hq?.authors?.[key]?.[id] === userId) saved.delete(id);
      });
      result[key] = Array.from(saved.values());
    });
    return result;
  }
  const api = { keys, clone, identity, merge, rememberOwn, equal };
  root.HQFamilyData = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'object' ? window : globalThis);
