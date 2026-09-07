export const FISHING_REACTION_MS = 600;
export const FISHING_MAX_RETRIES = 2;

export function getAppealPreview(move, previousMove) {
  const base = move.p === 0 ? 25 : move.p <= 60 ? 15 : 8;
  const elegant = ['FAIRY', 'WATER', 'ICE', 'GRASS', 'LIGHT', 'COSMIC', 'SOUND', 'TIME'].includes(move.t);
  const repeated = previousMove === move.name;
  const score = base + (elegant ? 8 : 0) - (repeated ? 10 : 0);
  return { min: Math.max(0, score - 8), max: score + 10, score, elegant, repeated };
}

export function resolveBeautyAppeal(state, move, random = Math.random) {
  if (!state || state.round < 1 || state.round > 5 || !move) return state;
  const preview = getAppealPreview(move, state.history?.at(-1));
  const reaction = Math.floor(random() * 19) - 8;
  const score = Math.max(0, preview.score + reaction);
  const message = `${move.name}${preview.elegant ? '，华丽加分' : ''}${preview.repeated ? '，重复扣分' : ''}${reaction > 7 ? '，全场喝彩' : reaction < -5 ? '，反响平淡' : ''}`;
  return { round: state.round + 1, appeal: state.appeal + score,
    history: [...(state.history || []), move.name],
    log: [`第 ${state.round} 轮：${message} (+${score})`, ...(state.log || [])] };
}
