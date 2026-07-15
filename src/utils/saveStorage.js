const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const messageFor = (error) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  return 'Unknown save storage error';
};

const diagnostics = () => ({ warnings: [], errors: [] });

const warn = (state, code, error) => {
  if (!state.warnings.includes(code)) state.warnings.push(code);
  state.errors.push({ code, message: messageFor(error) });
};

const resultWithDiagnostics = (result, state) => ({
  ...result,
  degraded: state.warnings.length > 0,
  warnings: state.warnings,
  errors: state.errors,
});

const resolveDependency = (options, key, globalKey) => {
  if (hasOwn(options, key)) return { value: options[key], error: null };

  try {
    return { value: globalThis[globalKey] ?? null, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

const resolveDependencies = (options = {}) => {
  const normalized = options && typeof options === 'object' ? options : {};
  return {
    storage: resolveDependency(normalized, 'storage', 'localStorage'),
    bridge: resolveDependency(normalized, 'bridge', 'desktopSave'),
  };
};

const getLocal = (storage, key) => {
  if (!storage || typeof storage.getItem !== 'function') {
    return { ok: false, raw: null, error: new Error('localStorage is unavailable') };
  }

  try {
    const raw = storage.getItem(key);
    if (raw !== null && typeof raw !== 'string') {
      return { ok: false, raw: null, error: new TypeError('localStorage returned non-string save data') };
    }
    return { ok: true, raw };
  } catch (error) {
    return { ok: false, raw: null, error };
  }
};

const setLocal = (storage, key, raw) => {
  if (!storage || typeof storage.setItem !== 'function') {
    return { ok: false, error: new Error('localStorage is unavailable') };
  }

  try {
    storage.setItem(key, raw);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
};

const removeLocal = (storage, key) => {
  if (!storage || typeof storage.removeItem !== 'function') {
    return { ok: false, error: new Error('localStorage is unavailable') };
  }

  try {
    storage.removeItem(key);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
};

const callBridge = (bridge, method, args = []) => {
  if (!bridge || typeof bridge[method] !== 'function') {
    return { ok: false, response: null, error: new Error(`desktopSave.${method} is unavailable`) };
  }

  try {
    const response = bridge[method](...args);
    if (!response || response.ok !== true) {
      return {
        ok: false,
        response: response ?? null,
        error: new Error(response?.error || `desktopSave.${method} failed`),
      };
    }
    return { ok: true, response, error: null };
  } catch (error) {
    return { ok: false, response: null, error };
  }
};

const numericValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const savedAtValue = (value) => {
  if (typeof value === 'number') return numericValue(value);
  if (typeof value !== 'string' || !value.trim()) return 0;

  const numeric = numericValue(value);
  if (numeric > 0) return numeric;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
};

export const inspectSaveCandidate = (raw, source = 'unknown') => {
  if (typeof raw !== 'string') return null;

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Keep corrupt raw data intact so the application can quarantine it.
  }

  const valid = Boolean(parsed && typeof parsed === 'object' && !Array.isArray(parsed));
  return {
    source,
    raw,
    valid,
    savedAt: valid ? savedAtValue(parsed.savedAt) : 0,
    playTimeMs: valid ? numericValue(parsed.playTimeMs) : 0,
  };
};

export const selectSaveCandidate = (localRaw, desktopRaw) => {
  const local = inspectSaveCandidate(localRaw, 'local');
  const desktop = inspectSaveCandidate(desktopRaw, 'desktop');

  if (!local) return desktop;
  if (!desktop) return local;
  if (local.raw === desktop.raw) return desktop;
  if (local.valid !== desktop.valid) return local.valid ? local : desktop;
  if (local.savedAt !== desktop.savedAt) return local.savedAt > desktop.savedAt ? local : desktop;
  if (local.playTimeMs !== desktop.playTimeMs) return local.playTimeMs > desktop.playTimeMs ? local : desktop;
  return desktop;
};

const invalidKeyResult = (state) => {
  warn(state, 'invalid-save-key', new TypeError('Save key must be a non-empty string'));
  return resultWithDiagnostics({ ok: false }, state);
};

export const readGameSave = (key, options = {}) => {
  const state = diagnostics();
  if (typeof key !== 'string' || !key) return invalidKeyResult(state);

  const dependencies = resolveDependencies(options);
  if (dependencies.storage.error) warn(state, 'local-read-failed', dependencies.storage.error);
  if (dependencies.bridge.error) warn(state, 'desktop-read-failed', dependencies.bridge.error);

  const storage = dependencies.storage.value;
  const bridge = dependencies.bridge.value;
  const hasDesktopBridge = bridge !== null && bridge !== undefined;
  const local = getLocal(storage, key);
  if (!local.ok) warn(state, 'local-read-failed', local.error);

  if (!hasDesktopBridge) {
    const candidate = inspectSaveCandidate(local.raw, 'local');
    return resultWithDiagnostics({
      ok: local.ok,
      raw: local.raw,
      source: candidate ? 'local' : 'none',
      recovered: false,
      corrupted: Boolean(candidate && !candidate.valid),
      migrated: false,
      conflict: false,
      mirrored: { local: local.ok, desktop: null },
    }, state);
  }

  const desktop = callBridge(bridge, 'read');
  let desktopRaw = null;
  if (!desktop.ok) {
    warn(state, 'desktop-read-failed', desktop.error);
  } else if (desktop.response.raw !== null && typeof desktop.response.raw !== 'string') {
    desktop.ok = false;
    desktop.error = new TypeError('desktopSave.read returned non-string save data');
    warn(state, 'desktop-read-failed', desktop.error);
  } else {
    desktopRaw = desktop.response.raw;
  }

  if (!desktop.ok) {
    const candidate = inspectSaveCandidate(local.raw, 'local');
    return resultWithDiagnostics({
      ok: local.ok,
      raw: local.raw,
      source: candidate ? 'local' : 'none',
      recovered: false,
      corrupted: Boolean(candidate && !candidate.valid),
      migrated: false,
      conflict: false,
      mirrored: { local: local.ok, desktop: false },
      desktopResult: desktop.response,
    }, state);
  }

  const selected = selectSaveCandidate(local.raw, desktopRaw);
  const conflict = typeof local.raw === 'string'
    && typeof desktopRaw === 'string'
    && local.raw !== desktopRaw;
  let localMirrored = local.ok;
  let desktopMirrored = desktop.ok;
  let migrated = false;

  if (selected?.source === 'desktop' && local.raw !== selected.raw) {
    const mirror = setLocal(storage, key, selected.raw);
    localMirrored = mirror.ok;
    if (!mirror.ok) warn(state, 'local-write-failed', mirror.error);
  }

  if (selected?.source === 'local' && desktopRaw !== selected.raw) {
    const mirror = callBridge(bridge, 'write', [selected.raw]);
    desktopMirrored = mirror.ok;
    migrated = desktopRaw === null && mirror.ok;
    if (!mirror.ok) warn(state, 'desktop-write-failed', mirror.error);
  }

  return resultWithDiagnostics({
    ok: true,
    raw: selected?.raw ?? null,
    source: selected?.source ?? 'none',
    recovered: desktop.response.recovered === true,
    corrupted: desktop.response.corrupted === true || Boolean(selected && !selected.valid),
    migrated,
    conflict,
    mirrored: { local: localMirrored, desktop: desktopMirrored },
    desktopResult: desktop.response,
  }, state);
};

export const writeGameSave = (key, raw, options = {}) => {
  const state = diagnostics();
  if (typeof key !== 'string' || !key) return invalidKeyResult(state);
  if (typeof raw !== 'string') {
    warn(state, 'invalid-save-raw', new TypeError('Save data must be a string'));
    return resultWithDiagnostics({ ok: false }, state);
  }

  const dependencies = resolveDependencies(options);
  if (dependencies.storage.error) warn(state, 'local-write-failed', dependencies.storage.error);
  if (dependencies.bridge.error) warn(state, 'desktop-write-failed', dependencies.bridge.error);

  const local = setLocal(dependencies.storage.value, key, raw);
  if (!local.ok) warn(state, 'local-write-failed', local.error);

  const bridge = dependencies.bridge.value;
  const hasDesktopBridge = bridge !== null && bridge !== undefined;
  const desktop = hasDesktopBridge ? callBridge(bridge, 'write', [raw]) : null;
  if (desktop && !desktop.ok) warn(state, 'desktop-write-failed', desktop.error);

  return resultWithDiagnostics({
    ok: hasDesktopBridge ? local.ok || desktop.ok : local.ok,
    localOk: local.ok,
    desktopOk: desktop ? desktop.ok : null,
    desktopResult: desktop?.response ?? null,
  }, state);
};

const SAFE_BACKUP_KIND = /^[a-z0-9][a-z0-9_-]{0,31}$/;

export const backupGameSave = (key, kind, options = {}) => {
  const state = diagnostics();
  if (typeof key !== 'string' || !key) return invalidKeyResult(state);
  if (typeof kind !== 'string' || !SAFE_BACKUP_KIND.test(kind)) {
    warn(state, 'invalid-backup-kind', new TypeError('Backup kind must be a safe lowercase token'));
    return resultWithDiagnostics({ ok: false }, state);
  }

  const dependencies = resolveDependencies(options);
  if (dependencies.storage.error) warn(state, 'local-backup-failed', dependencies.storage.error);
  if (dependencies.bridge.error) warn(state, 'desktop-backup-failed', dependencies.bridge.error);

  const storage = dependencies.storage.value;
  const current = getLocal(storage, key);
  let localOk = false;
  let localBackupKey = null;
  if (!current.ok) {
    warn(state, 'local-backup-failed', current.error);
  } else if (current.raw === null) {
    warn(state, 'local-save-missing', new Error('No local save data is available to back up'));
  } else {
    localBackupKey = `${key}_${kind.replace(/-/g, '_')}`;
    const local = setLocal(storage, localBackupKey, current.raw);
    localOk = local.ok;
    if (!local.ok) warn(state, 'local-backup-failed', local.error);
  }

  const bridge = dependencies.bridge.value;
  const hasDesktopBridge = bridge !== null && bridge !== undefined;
  const desktop = hasDesktopBridge ? callBridge(bridge, 'backup', [kind]) : null;
  if (desktop && !desktop.ok) warn(state, 'desktop-backup-failed', desktop.error);

  return resultWithDiagnostics({
    ok: hasDesktopBridge ? localOk || desktop.ok : localOk,
    kind,
    localOk,
    localBackupKey,
    desktopOk: desktop ? desktop.ok : null,
    desktopResult: desktop?.response ?? null,
  }, state);
};

export const removeGameSave = (key, options = {}) => {
  const state = diagnostics();
  if (typeof key !== 'string' || !key) return invalidKeyResult(state);

  const dependencies = resolveDependencies(options);
  if (dependencies.storage.error) warn(state, 'local-remove-failed', dependencies.storage.error);
  if (dependencies.bridge.error) warn(state, 'desktop-remove-failed', dependencies.bridge.error);

  const local = removeLocal(dependencies.storage.value, key);
  if (!local.ok) warn(state, 'local-remove-failed', local.error);

  const bridge = dependencies.bridge.value;
  const hasDesktopBridge = bridge !== null && bridge !== undefined;
  const desktop = hasDesktopBridge ? callBridge(bridge, 'remove') : null;
  if (desktop && !desktop.ok) warn(state, 'desktop-remove-failed', desktop.error);

  return resultWithDiagnostics({
    // A failed desktop removal must never be reported as success: otherwise
    // the surviving file would repopulate localStorage after a reload.
    ok: hasDesktopBridge ? local.ok && desktop.ok : local.ok,
    localOk: local.ok,
    desktopOk: desktop ? desktop.ok : null,
    desktopResult: desktop?.response ?? null,
  }, state);
};
