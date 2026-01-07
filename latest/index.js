// approvals@1.0.0 — human-in-the-loop lightweight approvals
// Stores approval state in module storage under approvals/<id>.json
// API:
// - request({ id, text, channels?, metadata? }) -> { ok, data }
// - status({ id }) -> { ok, data: { state, at, id, text, channels, metadata, note? } }
// - complete({ id, decision: 'approved'|'rejected', note? }) -> { ok, data }

(function(){
  const b64 = require('b64@1.0.0');
  const j = require('json@1.0.0');
  const log = require('log@1.0.0').create('approvals');

  function pathFor(id){ return 'approvals/' + encodeURIComponent(String(id||'')) + '.json'; }

  async function read(id, opts){
    try {
      const storage = sys.storage.get('approvals', opts);
      const r = await storage.read({ path: pathFor(id) });
      const s = b64.decodeAscii(r && r.dataBase64 || '');
      return j.parseSafe(s, null);
    } catch { return null; }
  }

  async function write(id, obj, opts){
    const s = JSON.stringify(obj || {});
    const dataBase64 = b64.encodeAscii(s);
    const storage = sys.storage.get('approvals', opts);
    await storage.save({ path: pathFor(id), dataBase64 });
  }

  async function request({ id, text, channels, metadata, workflow }){
    try {
      if (!id) return { ok:false, error:'id required' };
      const now = new Date().toISOString();
      const rec = { id: String(id), text: String(text||''), channels: Array.isArray(channels)?channels:[], metadata: (metadata||null), state: 'pending', at: now };
      await write(id, rec, { workflow });
      log.info('request', { id: rec.id, state: rec.state });
      return { ok:true, data: rec };
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  async function status({ id, workflow }){
    try {
      if (!id) return { ok:false, error:'id required' };
      const rec = await read(id, { workflow });
      if (!rec) return { ok:true, data: { id: String(id), state: 'pending' } };
      return { ok:true, data: rec };
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  async function complete({ id, decision, note, workflow }){
    try {
      if (!id) return { ok:false, error:'id required' };
      const rec = await read(id, { workflow }) || { id: String(id), text: '', channels: [], metadata: null };
      const d = ('' + (decision||'')).toLowerCase();
      if (d !== 'approved' && d !== 'rejected') return { ok:false, error:'decision must be approved|rejected' };
      rec.state = d; rec.note = note || null; rec.at = new Date().toISOString();
      await write(id, rec, { workflow });
      log.info('complete', { id: rec.id, state: rec.state });
      return { ok:true, data: rec };
    } catch (e){ return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  module.exports = { request, status, complete };
})();
