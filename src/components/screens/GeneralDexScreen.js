import React from 'react';
import { calcGeneralsTotalBonus } from '../../data/generals';
import { FACTIONS } from '../../data/kingdom';
import { GENERAL_BIOS } from '../../data/generalBios';
import { GENERAL_DRAW_PITY } from '../../data/generals';
import { GENERAL_DRAW_RATES } from '../../data/generals';
import { GENERAL_RARITY_CONFIG } from '../../data/generals';
import { GENERAL_ROSTER_FACTION_IDS } from '../../data/generals';
import { GENERAL_ROSTER_FACTIONS } from '../../data/generals';
import { getGeneralPortrait } from '../../data/generals';
import { SANGUO_GENERALS } from '../../data/generals';

export default function GeneralDexScreen({
  doGeneralDraw,
  formatGeneralBonusChip,
  genDexFilter,
  kingdomWar,
  renderGeneralPortraitFace,
  safeBack,
  setGenDexDetail,
  setGenDexFilter,
  setView
}) {
  const kw = kingdomWar || {};
  const recruited = kw.recruitedGenerals || [];
  const recruitedIds = new Set(recruited.map(g => g.id));
  const myFac = kw.faction ? FACTIONS[kw.faction] : null;
  const themeColor = myFac?.color || '#B71C1C';
  const factionNames = { all:'全部', ...Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(id => [id, GENERAL_ROSTER_FACTIONS[id].shortName])) };
  const factionColors = Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(id => [id, GENERAL_ROSTER_FACTIONS[id].color]));
  const factionLightColors = Object.fromEntries(GENERAL_ROSTER_FACTION_IDS.map(id => [id, GENERAL_ROSTER_FACTIONS[id].lightColor]));
  const rarityNames = { all:'全部', SSR:'SSR 传世', SR:'SR 名将', R:'R 勇将' };
  const bonusLabels = {gold:'金币',exp:'经验',contrib:'贡献',territory:'领地防御',trade:'商队收入',recruit:'招募减免'};
  const filteredGens = SANGUO_GENERALS.filter(g => {
    if (genDexFilter.faction !== 'all' && g.rosterFaction !== genDexFilter.faction) return false;
    if (genDexFilter.rarity !== 'all' && g.rarity !== genDexFilter.rarity) return false;
    if (genDexFilter.search && !g.name.includes(genDexFilter.search) && !g.title.includes(genDexFilter.search) && !g.historicalFaction.includes(genDexFilter.search)) return false;
    return true;
  });
  const totalR = SANGUO_GENERALS.filter(g => recruitedIds.has(g.id)).length;
  const filteredR = filteredGens.filter(g => recruitedIds.has(g.id)).length;
  const fStats = GENERAL_ROSTER_FACTION_IDS.map(f => {
    const all = SANGUO_GENERALS.filter(g => g.rosterFaction === f);
    return { f, total: all.length, got: all.filter(g => recruitedIds.has(g.id)).length };
  });
  const draws = kw.generalDraws || 0;
  const totalBonus = calcGeneralsTotalBonus(recruited);

  return (
    <div className="screen codex-screen is-general">
      <div className="codex-shell">
        <header className="codex-hero">
          <button className="codex-back" onClick={() => setView(safeBack())}>← 返回</button>
          <div className="codex-title-block">
            <span>Chronicle Hall</span>
            <h1>多势力名将图鉴</h1>
            <p>两晋、刘宋、北魏与十六国分册统计；人物当前效忠与地图联军分开结算。</p>
          </div>
          <div className="codex-hero-count"><b>{filteredR}</b><span>/{filteredGens.length} 当前筛选</span></div>
        </header>

        <section className="codex-overview">
          <article className="codex-panel codex-progress-panel">
            <div className="codex-ring" style={{'--progress': `${(totalR / SANGUO_GENERALS.length * 100).toFixed(1)}%`, '--codex-accent': themeColor}}>
              <b>{Math.round(totalR / SANGUO_GENERALS.length * 100)}%</b>
              <span>收集率</span>
            </div>
            <div className="codex-panel-copy">
              <span>General Progress</span>
              <strong>{totalR} / {SANGUO_GENERALS.length}</strong>
              <p>{myFac ? `${myFac.name || '当前阵营'}名册正在扩充。` : '尚未绑定阵营，先从全名册筛选研究。'}</p>
            </div>
          </article>

          <article className="codex-panel codex-stat-panel">
            <div className="codex-panel-head"><span>历史势力分布</span><b>{fStats.reduce((s, item) => s + item.got, 0)} 位</b></div>
            <div className="codex-mini-bars">
              {fStats.map(({f, total, got}) => (
                <div key={f} className="codex-mini-bar" style={{'--bar-color': factionColors[f]}}>
                  <span>{factionNames[f]}</span>
                  <i><em style={{width: `${total ? (got / total) * 100 : 0}%`}} /></i>
                  <b>{got}/{total}</b>
                </div>
              ))}
            </div>
          </article>

          <button type="button" className={`codex-panel codex-draw-panel ${draws > 0 ? 'is-ready' : ''}`} onClick={doGeneralDraw} disabled={draws <= 0}>
            <span>赛季抽将</span>
            <strong>{draws > 0 ? `${draws} 次可用` : '暂无次数'}</strong>
            <p>{draws > 0
              ? `传世 ${Math.round(GENERAL_DRAW_RATES.SSR * 100)}% · 名将 ${Math.round(GENERAL_DRAW_RATES.SR * 100)}% · ${Math.max(1, GENERAL_DRAW_PITY - (kw.generalDrawPity || 0))} 抽内必得传世`
              : '完成赛季目标后可获得招募机会，保底进度会保留。'}</p>
          </button>
        </section>

        {Object.keys(totalBonus).filter(k => totalBonus[k] > 0).length > 0 && (
          <section className="codex-bonus-strip">
            <span>名将总加成</span>
            {Object.entries(totalBonus).filter(([,v]) => v > 0).map(([k,v]) => (
              <b key={k} style={{'--bonus-color': themeColor}}>{bonusLabels[k]||k}{formatGeneralBonusChip(k, v)}</b>
            ))}
          </section>
        )}

        <section className="codex-toolbar">
          <div className="codex-chip-row">
            {['all', ...GENERAL_ROSTER_FACTION_IDS].map(f => (
              <button key={f} className={`codex-chip ${genDexFilter.faction === f ? 'active' : ''}`} style={{'--chip-color': factionColors[f] || themeColor}} onClick={() => setGenDexFilter(p => ({...p, faction: p.faction === f ? 'all' : f}))}>{factionNames[f]}</button>
            ))}
            {['all','SSR','SR','R'].map(r => (
              <button key={r} className={`codex-chip ${genDexFilter.rarity === r ? 'active' : ''}`} style={{'--chip-color': GENERAL_RARITY_CONFIG[r]?.color || themeColor}} onClick={() => setGenDexFilter(p => ({...p, rarity: r}))}>{rarityNames[r]}</button>
            ))}
          </div>
          <label className="codex-search is-compact">
            <span>⌕</span>
            <input type="text" placeholder="搜索名将或称号..." value={genDexFilter.search} onChange={e => setGenDexFilter(p => ({...p, search: e.target.value}))} />
          </label>
        </section>

        <div className="codex-grid codex-general-grid">
          {filteredGens.map(gen => {
            const isR = recruitedIds.has(gen.id);
            const isCollected = (kw.collectedGeneralIds || []).includes(gen.id);
            const rc = GENERAL_RARITY_CONFIG[gen.rarity] || {};
            const pt = getGeneralPortrait(gen);
            const facColor = factionColors[gen.rosterFaction] || '#666';
            const bioData = GENERAL_BIOS[gen.id];
            return (
              <button key={gen.id} type="button" onClick={() => setGenDexDetail(gen)} className={`codex-general-card ${isR ? 'is-recruited' : isCollected ? 'is-collected' : 'is-locked'}`} style={{'--card-color': facColor, '--rarity-color': rc.color || '#888'}}>
                <span className="codex-rarity-badge">{rc.label||gen.rarity}</span>
                <span className="codex-general-status">{isR ? '已招募' : isCollected ? '已收集' : '未遇见'}</span>
                <div className="codex-general-portrait" style={{background: pt.bg, color: pt.textColor, borderColor: isR ? pt.border : isCollected ? pt.border+'80' : 'rgba(255,255,255,0.18)', overflow:'hidden'}}>{renderGeneralPortraitFace(gen, pt, pt.surname, isR || isCollected)}</div>
                <strong>{gen.name}</strong>
                <p>{gen.title}</p>
                <div className="codex-card-meta">
                  <span style={{color: factionLightColors[gen.rosterFaction] || '#9E9E9E', fontWeight: 700}}>{gen.historicalFaction || factionNames[gen.rosterFaction] || '汉末群雄'}</span>
                  <span>史评 {gen.historicalScore}</span>
                  {bioData && <span>{bioData.isHistorical ? '正史' : '虚构'}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

}
