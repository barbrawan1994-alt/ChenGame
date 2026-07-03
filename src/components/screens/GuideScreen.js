import React, { useState } from 'react';
import GAME_GUIDE from '../../data/gameGuide';
import { GAME_NAME, GAME_VERSION_LABEL } from '../../data/constants';

function highlightSearch(text, query) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span key={i} style={{background:'rgba(255,193,7,0.3)', color:'#FFD54F', borderRadius:'2px', padding:'0 2px'}}>{part}</span>
      : part
  );
}

export default React.memo(function GuideScreen({ onBack }) {
  const [guideSearch, setGuideSearch] = useState('');
  const [guideExpanded, setGuideExpanded] = useState({});
  const [guideCat, setGuideCat] = useState(null);

  const filtered = guideCat ? GAME_GUIDE.filter(g => g.id === guideCat) : GAME_GUIDE;
  const q = guideSearch.trim().toLowerCase();
  const results = q
    ? filtered.map(cat => ({
        ...cat,
        sections: cat.sections.filter(s => {
          if (s.title.toLowerCase().includes(q)) return true;
          if (s.content && s.content.toLowerCase().includes(q)) return true;
          if (s.sub && s.sub.some(item => (item.t || '').toLowerCase().includes(q) || (item.c || '').toLowerCase().includes(q))) return true;
          return false;
        }),
      })).filter(cat => cat.sections.length > 0)
    : filtered;

  const guideFormatContent = (text) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="gd-spacer" />;
      const isBullet = /^[·•\-①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬]/.test(trimmed);
      const isEmoji = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⚪🟠🟣⚡☠🔥❄😴😵⭐🪲🎣✨]/u.test(trimmed);
      const isHeading = /^(攻击型|防御型|辅助型|恢复类|增伤类|防御类|状态类|超人系|动物系|自然系)/.test(trimmed) && trimmed.length < 30;
      if (isHeading) return <div key={i} className="gd-heading">{trimmed}</div>;
      if (isBullet || isEmoji) return <div key={i} className="gd-bullet">{trimmed}</div>;
      return <div key={i} className="gd-line">{trimmed}</div>;
    });
  };

  const toggleCat = (catId) => {
    setGuideExpanded(prev => {
      const current = prev[catId];
      return { ...prev, [catId]: current === undefined ? false : !current };
    });
  };
  const toggleSec = (secKey) => {
    setGuideExpanded(prev => {
      const current = prev[secKey];
      return { ...prev, [secKey]: current === undefined ? false : !current };
    });
  };
  const isCatOpen = (catId) => guideExpanded[catId] !== false;
  const isSecOpenFn = (secKey) => guideExpanded[secKey] !== false;

  const totalSections = GAME_GUIDE.reduce((a, c) => a + c.sections.length, 0);

  return (
    <div className="gd-root">
      <header className="gd-topbar">
        <button type="button" className="gd-back" onClick={onBack}>
          <span>{'\u2190'}</span> 返回
        </button>
        <h1 className="gd-title">{GAME_NAME} 冒险手册</h1>
        <span className="gd-ver">{GAME_VERSION_LABEL}</span>
      </header>

      <div className="gd-filterbar">
        <div className="gd-search">
          <span style={{opacity:0.5, fontSize:'14px'}}>🔍</span>
          <input type="text" placeholder="搜索关键词..." value={guideSearch} onChange={e => setGuideSearch(e.target.value)} />
          {q && <button type="button" onClick={() => setGuideSearch('')}>✕</button>}
        </div>
        <div className="gd-tabs">
          <button type="button" className={!guideCat ? 'active' : ''} onClick={() => setGuideCat(null)}>
            全部
          </button>
          {GAME_GUIDE.map(g => (
            <button type="button" key={g.id} className={guideCat === g.id ? 'active' : ''} onClick={() => setGuideCat(g.id)}>
              {g.icon} {g.title}
            </button>
          ))}
        </div>
        {!q && <span className="gd-meta">{GAME_GUIDE.length} 章 · {totalSections} 节</span>}
      </div>

      <div className="gd-scroll">
        {results.length === 0 && (
          <div className="gd-empty"><span>🔍</span><p>没有找到匹配的内容，试试其他关键词。</p></div>
        )}
        {results.map((cat) => {
          const catOpen = isCatOpen(cat.id);
          return (
            <div key={cat.id} className="gd-category" style={{ '--accent': cat.color || '#8fd8ff' }}>
              <button type="button" className={`gd-cat-head ${catOpen ? 'is-open' : ''}`} onClick={() => toggleCat(cat.id)}>
                <span className="gd-cat-icon">{cat.icon}</span>
                <span className="gd-cat-label">{cat.title}</span>
                <span className="gd-cat-count">{cat.sections.length} 节</span>
                <span className="gd-arrow">{catOpen ? '▼' : '▶'}</span>
              </button>
              {catOpen && (
                <div className="gd-sections">
                  {cat.sections.map((sec, si) => {
                    const secKey = `${cat.id}_${si}`;
                    const autoOpen = q && sec.sub && sec.sub.some(item => item.t.toLowerCase().includes(q) || item.c.toLowerCase().includes(q));
                    const secOpen = autoOpen || isSecOpenFn(secKey);
                    const hasSub = sec.sub && sec.sub.length > 0;
                    return (
                      <div key={si} className={`gd-sec ${secOpen ? 'is-open' : ''}`}>
                        <button type="button" className="gd-sec-head" onClick={() => hasSub && toggleSec(secKey)}>
                          <span className="gd-sec-dot" />
                          <span className="gd-sec-title">{sec.title}</span>
                          {hasSub && <span className="gd-sec-count">{sec.sub.length} 条</span>}
                          {hasSub && <span className="gd-arrow">{secOpen ? '▼' : '▶'}</span>}
                        </button>
                        {hasSub && secOpen && (
                          <div className="gd-items">
                            {sec.sub.map((item, idx) => (
                              <div key={idx} className="gd-item">
                                <h4>{item.t}</h4>
                                <div className="gd-body">{item.c ? (q ? highlightSearch(item.c, q) : guideFormatContent(item.c)) : null}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {!hasSub && sec.content && secOpen && (
                          <div className="gd-body gd-standalone">{q ? highlightSearch(sec.content, q) : guideFormatContent(sec.content)}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
