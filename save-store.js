const fs = require('fs');
const path = require('path');

const MAX_RAW_BYTES = 16 * 1024 * 1024;
const SAVE_FILENAME = 'super-spirit-save.json';
const BACKUP_FILENAME = 'super-spirit-save.backup.json';
const SAFE_BACKUP_KIND = /^[a-z0-9][a-z0-9_-]{0,31}$/;

function createSaveStore(userDataPath) {
  if (typeof userDataPath !== 'string' || userDataPath.trim() === '') {
    throw new TypeError('A userData directory is required');
  }

  const rootPath = path.resolve(userDataPath);
  const savePath = path.join(rootPath, SAVE_FILENAME);
  const backupPath = path.join(rootPath, BACKUP_FILENAME);
  const tempPath = `${savePath}.tmp`;

  const ensureDirectory = () => {
    fs.mkdirSync(rootPath, { recursive: true });
  };

  const validateRaw = (raw) => {
    if (typeof raw !== 'string') {
      throw new TypeError('Save data must be a JSON string');
    }

    const bytes = Buffer.byteLength(raw, 'utf8');
    if (bytes > MAX_RAW_BYTES) {
      throw new RangeError(`Save data exceeds the ${MAX_RAW_BYTES} byte limit`);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new TypeError('Save data must be valid JSON');
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new TypeError('Save data must contain a top-level object');
    }

    return bytes;
  };

  const inspectFile = (filePath) => {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const bytes = validateRaw(raw);
      return { status: 'valid', raw, bytes };
    } catch (error) {
      if (error && error.code === 'ENOENT') return { status: 'missing' };
      return { status: 'invalid', error };
    }
  };

  const syncDirectory = () => {
    let directoryHandle;
    try {
      directoryHandle = fs.openSync(rootPath, 'r');
      fs.fsyncSync(directoryHandle);
    } catch {
      // Some platforms do not support fsync on directories. The file itself
      // has already been synced before the rename in that case.
    } finally {
      if (directoryHandle !== undefined) fs.closeSync(directoryHandle);
    }
  };

  const atomicWrite = (targetPath, raw) => {
    ensureDirectory();
    const targetTempPath = `${targetPath}.tmp`;
    let fileHandle;

    try {
      fileHandle = fs.openSync(targetTempPath, 'w', 0o600);
      fs.writeFileSync(fileHandle, raw, 'utf8');
      fs.fsyncSync(fileHandle);
      fs.closeSync(fileHandle);
      fileHandle = undefined;
      fs.renameSync(targetTempPath, targetPath);
      syncDirectory();
    } catch (error) {
      if (fileHandle !== undefined) {
        try { fs.closeSync(fileHandle); } catch {}
      }
      try { fs.rmSync(targetTempPath, { force: true }); } catch {}
      throw error;
    }
  };

  const backupPathFor = (kind) => {
    if (typeof kind !== 'string' || !SAFE_BACKUP_KIND.test(kind)) {
      throw new TypeError('Backup kind must be a safe lowercase token');
    }
    return path.join(rootPath, `super-spirit-save.${kind}.json`);
  };

  const quarantineMain = () => {
    if (!fs.existsSync(savePath)) return null;

    ensureDirectory();
    const corruptPath = backupPathFor('quarantine');
    try { fs.rmSync(corruptPath, { force: true }); } catch {}
    fs.renameSync(savePath, corruptPath);
    syncDirectory();
    return corruptPath;
  };

  const read = () => {
    const main = inspectFile(savePath);
    if (main.status === 'valid') {
      return { ok: true, raw: main.raw, recovered: false, corrupted: false };
    }

    const backup = inspectFile(backupPath);
    const corrupted = main.status === 'invalid';
    if (corrupted) quarantineMain();

    if (backup.status === 'valid') {
      atomicWrite(savePath, backup.raw);
      return { ok: true, raw: backup.raw, recovered: true, corrupted };
    }

    return { ok: true, raw: null, recovered: false, corrupted };
  };

  const write = (raw) => {
    const bytes = validateRaw(raw);
    const current = inspectFile(savePath);
    let backedUp = false;

    if (current.status === 'valid') {
      atomicWrite(backupPath, current.raw);
      backedUp = true;
    } else if (current.status === 'invalid') {
      quarantineMain();
    }

    atomicWrite(savePath, raw);
    return { ok: true, bytes, backedUp };
  };

  const backup = (kind) => {
    const targetPath = backupPathFor(kind);
    const current = read();
    if (!current.raw) {
      throw new Error('No valid save data is available to back up');
    }

    const bytes = validateRaw(current.raw);
    atomicWrite(targetPath, current.raw);
    return { ok: true, kind, bytes };
  };

  const remove = () => {
    let removed = 0;
    let entries = [];
    try {
      entries = fs.readdirSync(rootPath);
    } catch (error) {
      if (error && error.code === 'ENOENT') return { ok: true, removed };
      throw error;
    }

    const managedFile = /^super-spirit-save(?:\.(?:backup|[a-z0-9][a-z0-9_-]{0,31}))?\.json(?:\.tmp)?$/;
    for (const entry of entries) {
      if (!managedFile.test(entry)) continue;
      fs.rmSync(path.join(rootPath, entry), { force: true });
      removed += 1;
    }

    // Clean the fixed temporary path even if a future filename adjustment
    // makes it fall outside the managed-file pattern above.
    if (fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { force: true });
      removed += 1;
    }

    if (removed > 0) syncDirectory();
    return { ok: true, removed };
  };

  const info = () => {
    const statSize = (filePath) => {
      try { return fs.statSync(filePath).size; } catch { return null; }
    };

    return {
      ok: true,
      path: savePath,
      backupPath,
      exists: fs.existsSync(savePath),
      backupExists: fs.existsSync(backupPath),
      size: statSize(savePath),
      backupSize: statSize(backupPath),
      maxBytes: MAX_RAW_BYTES,
    };
  };

  return { read, write, backup, remove, info };
}

module.exports = {
  BACKUP_FILENAME,
  MAX_RAW_BYTES,
  SAVE_FILENAME,
  createSaveStore,
};
