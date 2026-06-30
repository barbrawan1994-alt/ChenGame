import React, { useState } from 'react';
import GAME_GUIDE from '../../data/gameGuide';
import { GAME_NAME, GAME_VERSION_LABEL } from '../../data/constants';

function highlightSearch(text, query) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <span key={i} style={{background:'rgba(255,193,7,0.3)', color:'#FFD54F', borderRadius:'2px', padding:'0 1px'}}>{part}</span>
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
      const isBullet = /^[\u00B7\u2022\-\u2460\u2461\u2462\u2463\u2464\u2465\u2466\u2467\u2468\u2469\u246A\u246B\u246C]/.test(trimmed);
      const isLabel = /^[\uD83D\uDD25\u2620\uFE0F\u26A1\u2744\uFE0F\uD83D\uDE34\uD83D\uDFE2\uD83D\uDD35\uD83D\uDFE3\uD83D\uDFE0\uD83D\uDD34\u2B1C\uD83D\uDFE7\uD83D\uDFEA\u2605\u2B50\uD83C\uDF00]/.test(trimmed);
      const isHeading = /^(\u653B\u51FB\u578B|\u9632\u5FA1\u578B|\u8F85\u52A9\u578B|\u6062\u590D\u7C7B|\u589E\u4F24\u7C7B|\u9632\u5FA1\u7C7B|\u72B6\u6001\u7C7B|\u8D85\u4EBA\u7CFB|\u52A8\u7269\u7CFB|\u81EA\u7136\u7CFB)/.test(trimmed) && trimmed.length < 30;
      if (isHeading) return <div key={i} className="gd-heading">{trimmed}</div>;
      if (isBullet || isLabel) return <div key={i} className="gd-bullet">{trimmed}</div>;
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

  return (
    <div className="gd-root">
      <header className="gd-topbar">
        <button type="button" className="gd-back" onClick={onBack}>
          <span>{'\u2190'}</span> {'\u8FD4\u56DE'}
        </button>
        <h1 className="gd-title">{GAME_NAME} {'\u6E38\u620F\u624B\u518C'}</h1>
        <span className="gd-ver">{GAME_VERSION_LABEL}</span>
      </header>

      <div className="gd-filterbar">
        <div className="gd-search">
          <input type="text" placeholder={'\u641C\u7D22\u5173\u952E\u8BCD...'} value={guideSearch} onChange={e => setGuideSearch(e.target.value)} />
          {q && <button type="button" onClick={() => setGuideSearch('')}>{'\u2715'}</button>}
        </div>
        <div className="gd-tabs">
          <button type="button" className={!guideCat ? 'active' : ''} onClick={() => setGuideCat(null)}>{'\u5168\u90E8'}</button>
          {GAME_GUIDE.map(g => (
            <button type="button" key={g.id} className={guideCat === g.id ? 'active' : ''} onClick={() => setGuideCat(g.id)}>
              {g.icon} {g.title}
            </button>
          ))}
        </div>
      </div>

      <div className="gd-scroll">
        {results.length === 0 && (
          <div className="gd-empty"><span>{'\uD83D\uDD0D'}</span><p>{'\u6CA1\u6709\u627E\u5230\u5339\u914D\u7684\u5185\u5BB9\uFF0C\u8BD5\u8BD5\u5176\u4ED6\u5173\u952E\u8BCD\u3002'}</p></div>
        )}
        {results.map((cat) => {
          const catOpen = isCatOpen(cat.id);
          return (
            <div key={cat.id} className="gd-category" style={{ '--accent': cat.color || '#8fd8ff' }}>
              <button type="button" className={`gd-cat-head ${catOpen ? 'is-open' : ''}`} onClick={() => toggleCat(cat.id)}>
                <span className="gd-cat-icon">{cat.icon}</span>
                <span className="gd-cat-label">{cat.title}</span>
                <span className="gd-cat-count">{cat.sections.length} {'\u8282'}</span>
                <span className="gd-arrow">{catOpen ? '\u25BC' : '\u25B6'}</span>
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
                          {hasSub && <span className="gd-sec-count">{sec.sub.length} {'\u6761'}</span>}
                          {hasSub && <span className="gd-arrow">{secOpen ? '\u25BC' : '\u25B6'}</span>}
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
