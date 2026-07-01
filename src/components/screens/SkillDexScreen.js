import React, { useMemo, useState } from 'react';
import { TYPES } from '../../data/types';

const SKILL_PAGE_SIZE = 60;

export default React.memo(function SkillDexScreen({ allSkills, onBack }) {
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [skillPage, setSkillPage] = useState(0);

  const filteredSkills = allSkills.filter(s => {
    const matchType = skillFilter === 'ALL' || s.t === skillFilter || (skillFilter === 'STATUS' && s.category === 'status');
    const matchSearch = !skillSearchTerm || s.name.includes(skillSearchTerm);
    return matchType && matchSearch;
  });
  const pageCount = Math.max(1, Math.ceil(filteredSkills.length / SKILL_PAGE_SIZE));
  const safePage = Math.min(skillPage, pageCount - 1);
  const visibleSkills = filteredSkills.slice(safePage * SKILL_PAGE_SIZE, (safePage + 1) * SKILL_PAGE_SIZE);

  const skillStats = useMemo(() => {
    const attackSkills = allSkills.filter(s => (s.p || 0) > 0);
    const statusSkills = allSkills.filter(s => s.category === 'status' || !(s.p > 0));
    const maxPower = attackSkills.reduce((max, s) => Math.max(max, s.p || 0), 0);
    return { attack: attackSkills.length, status: statusSkills.length, maxPower };
  }, [allSkills]);

  const getSkillCategory = (s) => {
    if (s.category === 'status') return '变化';
    return s.category === 'special' ? '特殊' : s.p > 0 ? '物理' : '变化';
  };
  const getPowerColor = (p) => {
    if (p >= 120) return '#ff4d6d';
    if (p >= 80) return '#ffb02e';
    if (p >= 40) return '#e4e95d';
    if (p > 0) return '#69f0ae';
    return '#7c849c';
  };
  const getPowerRank = (p) => {
    if (p >= 120) return 'S';
    if (p >= 80) return 'A';
    if (p >= 40) return 'B';
    if (p > 0) return 'C';
    return '辅';
  };
  const setFilter = (filter) => {
    setSkillFilter(filter);
    setSkillPage(0);
  };

  return (
    <div className="screen codex-screen is-skill">
      <div className="codex-shell">
        <header className="codex-hero">
          <button className="codex-back" onClick={onBack}>← 返回</button>
          <div className="codex-title-block">
            <span>Move Encyclopedia</span>
            <h1>技能图鉴</h1>
            <p>按属性、变化技和名称检索技能，快速比较威力、PP、命中与技能分类。</p>
          </div>
          <div className="codex-hero-count"><b>{filteredSkills.length}</b><span>/{allSkills.length} 技能</span></div>
        </header>

        <section className="codex-overview">
          <article className="codex-panel codex-progress-panel">
            <div className="codex-sigil">⚡</div>
            <div className="codex-panel-copy">
              <span>Move Library</span>
              <strong>{allSkills.length} 种技能</strong>
              <p>{skillStats.attack} 个攻击技 · {skillStats.status} 个辅助/变化技，最高威力 {skillStats.maxPower}。</p>
            </div>
          </article>
          <article className="codex-panel codex-stat-panel">
            <div className="codex-panel-head"><span>当前筛选</span><b>{visibleSkills.length} 张</b></div>
            <div className="codex-skill-tags">
              <span>{skillFilter === 'ALL' ? '全部属性' : skillFilter === 'STATUS' ? '变化技能' : TYPES[skillFilter]?.name}</span>
              <span>第 {safePage + 1} / {pageCount} 页</span>
              <span>{skillSearchTerm ? `搜索: ${skillSearchTerm}` : '未输入搜索'}</span>
            </div>
          </article>
          <article className="codex-panel codex-insight-panel">
            <span>阅读提示</span>
            <strong>S/A/B/C 威力分级</strong>
            <p>卡片左侧颜色代表属性，右上角等级用于快速定位高威力技能。</p>
          </article>
        </section>

        <section className="codex-toolbar">
          <label className="codex-search">
            <span>⌕</span>
            <input type="text" placeholder="搜索技能名称..." value={skillSearchTerm} onChange={e => { setSkillSearchTerm(e.target.value); setSkillPage(0); }} />
          </label>
          <div className="codex-chip-row">
            <button className={`codex-chip ${skillFilter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>全部</button>
            <button className={`codex-chip ${skillFilter === 'STATUS' ? 'active' : ''}`} style={{'--chip-color': '#a855f7'}} onClick={() => setFilter('STATUS')}>变化</button>
            {Object.keys(TYPES).map(t => (
              <button key={t} className={`codex-chip ${skillFilter === t ? 'active' : ''}`} style={{'--chip-color': TYPES[t].color}} onClick={() => setFilter(t)}>{TYPES[t].name}</button>
            ))}
          </div>
        </section>

        <div className="codex-grid codex-skill-grid">
          {visibleSkills.map((skill, idx) => {
            const typeColor = TYPES[skill.t]?.color || '#6b7280';
            const pwrColor = getPowerColor(skill.p);
            const pwrRank = getPowerRank(skill.p);
            return (
              <article key={skill.id || skill.name + '_' + idx} className="codex-skill-card" style={{'--card-color': typeColor, '--power-color': pwrColor}}>
                <div className="codex-skill-head">
                  <strong>{skill.name}</strong>
                  <span>{TYPES[skill.t]?.name || '变化'}</span>
                </div>
                <b className="codex-power-rank">{pwrRank}</b>
                <div className="codex-skill-stats">
                  <span>威力 <b>{skill.p > 0 ? skill.p : '-'}</b></span>
                  <span>PP <b>{skill.pp}</b></span>
                  <span>命中 <b>{skill.acc || 100}</b></span>
                  <span>分类 <b>{getSkillCategory(skill)}</b></span>
                </div>
                {skill.desc && <p>{skill.desc}</p>}
              </article>
            );
          })}
          {filteredSkills.length === 0 && (
            <div className="codex-empty">
              <strong>未找到匹配技能</strong>
              <span>请切换属性或修改搜索关键词。</span>
            </div>
          )}
        </div>

        {pageCount > 1 && (
          <div className="codex-pagination">
            <button disabled={safePage === 0} onClick={() => setSkillPage(p => Math.max(0, p - 1))}>← 上页</button>
            <span>{safePage + 1} / {pageCount} · {filteredSkills.length} 技能</span>
            <button disabled={safePage >= pageCount - 1} onClick={() => setSkillPage(p => Math.min(pageCount - 1, p + 1))}>下页 →</button>
          </div>
        )}
      </div>
    </div>
  );
});
