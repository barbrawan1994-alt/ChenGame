import { getCombatFamily } from './battleTactics';

// Menu grouping is independent of the combat family used by synergy calculations.
export const getCombatMoveGroup = move => move?.isExtra ? 'equipment' : getCombatFamily(move);

export function getCombatMovePage(moves = [], group = 'all', requestedPage = 0, pageSize = 4) {
  const size = Math.max(1, Math.floor(pageSize) || 4);
  const entries = moves.map((move, index) => ({ move, index })).filter(({ move }) => group === 'all' || getCombatMoveGroup(move) === group);
  const pages = Math.max(1, Math.ceil(entries.length / size));
  const page = Math.max(0, Math.min(pages - 1, Math.floor(requestedPage) || 0));
  return { entries: entries.slice(page * size, (page + 1) * size), total: entries.length, pages, page };
}
