const hasUsableUid = uid => uid !== undefined && uid !== null && uid !== '';

const createLegacyPetUid = (pet, index, attempt = 0) => {
  const species = String(pet?.id ?? 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');
  const suffix = Math.random().toString(36).slice(2, 10);
  return `legacy_${species}_${index}_${Date.now()}_${suffix}${attempt ? `_${attempt}` : ''}`;
};

/**
 * 为旧存档中缺失或重复 uid 的精灵补齐唯一身份。
 * 已有且唯一的 uid 保持原值，避免破坏训练、家园等系统的引用。
 */
export const ensureUniquePetUids = (pets, uidFactory = createLegacyPetUid) => {
  if (!Array.isArray(pets)) return [];
  const seen = new Set();
  return pets.map((pet, index) => {
    if (!pet || typeof pet !== 'object') return pet;
    if (hasUsableUid(pet.uid) && !seen.has(pet.uid)) {
      seen.add(pet.uid);
      return pet;
    }

    let attempt = 0;
    let uid = uidFactory(pet, index, attempt);
    while (!hasUsableUid(uid) || seen.has(uid)) {
      attempt += 1;
      uid = uidFactory(pet, index, attempt);
    }
    seen.add(uid);
    return { ...pet, uid };
  });
};

/**
 * 按 uid 只移除第一只匹配精灵，避免旧存档重复身份时 filter 误删多只。
 */
export const removeSinglePetByUid = (pets, uid) => {
  if (!Array.isArray(pets) || !hasUsableUid(uid)) return { pets: Array.isArray(pets) ? pets : [], removed: null };
  const index = pets.findIndex(pet => pet?.uid === uid);
  if (index < 0) return { pets, removed: null };
  return {
    pets: [...pets.slice(0, index), ...pets.slice(index + 1)],
    removed: pets[index],
  };
};
