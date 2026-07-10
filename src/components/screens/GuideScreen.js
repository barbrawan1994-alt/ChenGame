import React, { useMemo, useRef, useState } from 'react';
import GAME_GUIDE, {
  GUIDE_QUICK_FIXES,
  GUIDE_STARTER_PATH,
  GUIDE_STATS,
  GUIDE_UNLOCKS,
} from '../../data/gameGuide';
import { GAME_NAME, GAME_VERSION_LABEL } from '../../data/constants';

const arrayText = value => (Array.isArray(value) ? value.join(' ') : value || '');

function sectionSearchText(section) {
  return [
    section.title,
    section.summary,
    section.path,
    arrayText(section.steps),
    arrayText(section.bullets),
    arrayText(section.tips),
    arrayText(section.warnings),
  ].join(' ').toLowerCase();
}

function markText(text, query) {
  if (!query || typeof text !== 'string') return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, index) => (
    part.toLowerCase() === query.toLowerCase()
      ? <mark className="gd-mark" key={`${part}-${index}`}>{part}</mark>
      : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  ));
}

function GuideSection({ category, section, index, query, open, onToggle }) {
  const sectionKey = `${category.id}-${section.id}`;
  const panelId = `guide-panel-${sectionKey}`;
  const sectionId = `guide-section-${sectionKey}`;
  const headingId = `guide-heading-${sectionKey}`;

  return (
    <section className={`gd-article-section ${open ? 'is-open' : ''}`} id={sectionId}>
      <button
        type="button"
        className="gd-section-toggle"
        id={headingId}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="gd-section-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="gd-section-heading">
          <strong>{markText(section.title, query)}</strong>
          <small>{markText(section.summary, query)}</small>
        </span>
        <span className="gd-section-chevron" aria-hidden="true">⌄</span>
      </button>

      {open && (
        <div className="gd-section-content" id={panelId} role="region" aria-labelledby={headingId}>
          {section.path && (
            <div className="gd-path">
              <span>入口</span>
              <strong>{markText(section.path, query)}</strong>
            </div>
          )}

          {section.steps?.length > 0 && (
            <ol className="gd-step-list">
              {section.steps.map((step, stepIndex) => (
                <li key={`${sectionKey}-step-${stepIndex}`}>
                  <span>{stepIndex + 1}</span>
                  <p>{markText(step, query)}</p>
                </li>
              ))}
            </ol>
          )}

          {section.bullets?.length > 0 && (
            <ul className="gd-bullet-list">
              {section.bullets.map((bullet, bulletIndex) => (
                <li key={`${sectionKey}-bullet-${bulletIndex}`}>{markText(bullet, query)}</li>
              ))}
            </ul>
          )}

          {section.tips?.map((tip, tipIndex) => (
            <div className="gd-callout gd-callout-tip" key={`${sectionKey}-tip-${tipIndex}`}>
              <span aria-hidden="true">💡</span>
              <div><strong>实用提示</strong><p>{markText(tip, query)}</p></div>
            </div>
          ))}

          {section.warnings?.map((warning, warningIndex) => (
            <div className="gd-callout gd-callout-warning" key={`${sectionKey}-warning-${warningIndex}`}>
              <span aria-hidden="true">⚠</span>
              <div><strong>注意</strong><p>{markText(warning, query)}</p></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default React.memo(function GuideScreen({ onBack }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('overview');
  const [expanded, setExpanded] = useState({});
  const mainRef = useRef(null);
  const normalizedQuery = query.trim().toLowerCase();
  const totalSections = GAME_GUIDE.reduce((sum, category) => sum + category.sections.length, 0);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return GAME_GUIDE.map(category => {
      const categoryText = [category.title, category.summary, arrayText(category.keywords)].join(' ').toLowerCase();
      const categoryMatches = categoryText.includes(normalizedQuery);
      return {
        ...category,
        sections: categoryMatches
          ? category.sections
          : category.sections.filter(section => sectionSearchText(section).includes(normalizedQuery)),
      };
    }).filter(category => category.sections.length > 0);
  }, [normalizedQuery]);

  const visibleCategories = normalizedQuery
    ? searchResults
    : GAME_GUIDE.filter(category => category.id === activeCategory);

  const chooseCategory = categoryId => {
    setQuery('');
    setActiveCategory(categoryId);
    if (categoryId !== 'overview') {
      const category = GAME_GUIDE.find(item => item.id === categoryId);
      if (category?.sections[0]) {
        const firstKey = `${category.id}-${category.sections[0].id}`;
        setExpanded(previous => ({ ...previous, [firstKey]: true }));
      }
    }
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSection = (categoryId, sectionId) => {
    const sectionKey = `${categoryId}-${sectionId}`;
    setQuery('');
    setActiveCategory(categoryId);
    setExpanded(previous => ({ ...previous, [sectionKey]: true }));
    window.setTimeout(() => {
      document.getElementById(`guide-section-${sectionKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const toggleSection = (categoryId, sectionId, defaultOpen) => {
    const sectionKey = `${categoryId}-${sectionId}`;
    setExpanded(previous => ({ ...previous, [sectionKey]: !(previous[sectionKey] ?? defaultOpen) }));
  };

  return (
    <div className="gd-root">
      <header className="gd-topbar">
        <button type="button" className="gd-back" onClick={onBack} aria-label="返回游戏">
          <span aria-hidden="true">←</span>
          <span>返回游戏</span>
        </button>
        <div className="gd-brand">
          <span className="gd-brand-kicker">PLAYER HANDBOOK</span>
          <h1>{GAME_NAME} · 冒险手册</h1>
        </div>
        <div className="gd-version" title={GAME_VERSION_LABEL}>{GAME_VERSION_LABEL}</div>
        <label className="gd-search" role="search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="搜索进化、捕虫、存档……"
            aria-label="搜索游戏说明"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="清除搜索">×</button>
          )}
        </label>
      </header>

      <div className="gd-layout">
        <aside className="gd-sidebar" aria-label="说明分类">
          <div className="gd-sidebar-heading">
            <span>目录</span>
            <small>{GAME_GUIDE.length} 章 · {totalSections} 节</small>
          </div>
          <nav className="gd-nav">
            <button
              type="button"
              className={activeCategory === 'overview' && !normalizedQuery ? 'is-active' : ''}
              onClick={() => chooseCategory('overview')}
              aria-current={activeCategory === 'overview' && !normalizedQuery ? 'page' : undefined}
            >
              <span className="gd-nav-icon">⌂</span>
              <span><strong>快速上手</strong><small>首小时路线与排障</small></span>
            </button>
            {GAME_GUIDE.map(category => (
              <button
                type="button"
                key={category.id}
                className={activeCategory === category.id && !normalizedQuery ? 'is-active' : ''}
                onClick={() => chooseCategory(category.id)}
                aria-current={activeCategory === category.id && !normalizedQuery ? 'page' : undefined}
                style={{ '--gd-accent': category.color }}
              >
                <span className="gd-nav-icon">{category.icon}</span>
                <span><strong>{category.title}</strong><small>{category.sections.length} 个主题</small></span>
              </button>
            ))}
          </nav>
          <div className="gd-sidebar-note">
            <span>数据说明</span>
            <p>数量、门槛与规则来自当前游戏配置；奖励与掉落以实际结算为准。</p>
          </div>
        </aside>

        <main className="gd-main" ref={mainRef}>
          {!normalizedQuery && activeCategory === 'overview' && (
            <>
              <section className="gd-hero">
                <div className="gd-hero-copy">
                  <span className="gd-eyebrow">第一次玩？从这里开始</span>
                  <h2>先追感叹号，再养一支能互相补位的队伍。</h2>
                  <p>主线目标、捕捉、技能、进化、活动和存档都整理成了可执行步骤。遇到问题时，直接使用顶部搜索或下方快速排障。</p>
                  <button type="button" onClick={() => goToSection('start', 'core-loop')}>阅读核心玩法 <span>→</span></button>
                </div>
                <div className="gd-hero-emblem" aria-hidden="true">
                  <span>SUPER</span>
                  <strong>SPIRIT</strong>
                  <i>GUIDE</i>
                </div>
              </section>

              <section className="gd-stat-grid" aria-label="当前游戏内容统计">
                {GUIDE_STATS.map(stat => (
                  <div className="gd-stat-card" key={stat.id}>
                    <span>{stat.icon}</span>
                    <strong>{stat.value}<small>{stat.suffix}</small></strong>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </section>

              <section className="gd-overview-block">
                <div className="gd-block-heading">
                  <div><span>START HERE</span><h2>首小时行动路线</h2></div>
                  <p>照着 7 步走，完成从初始伙伴到第一轮道馆推进。</p>
                </div>
                <ol className="gd-starter-grid">
                  {GUIDE_STARTER_PATH.map(step => (
                    <li key={step.id}>
                      <span>{step.icon}</span>
                      <div><h3>{step.title}</h3><p>{step.text}</p></div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="gd-overview-block">
                <div className="gd-block-heading">
                  <div><span>UNLOCK ROADMAP</span><h2>徽章解锁路线</h2></div>
                  <p>先看下一阶段需要几枚徽章，再决定当前最值得投入的系统。</p>
                </div>
                <div className="gd-unlock-table" role="table" aria-label="徽章解锁路线">
                  {GUIDE_UNLOCKS.map(unlock => (
                    <div className="gd-unlock-row" role="row" key={unlock.badges}>
                      <div className="gd-unlock-badge" role="cell"><strong>{unlock.badges}</strong><span>徽章</span></div>
                      <div className="gd-unlock-title" role="cell"><strong>{unlock.title}</strong></div>
                      <div className="gd-unlock-systems" role="cell">
                        {unlock.systems.map(system => <span key={system}>{system}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="gd-overview-block gd-fixes-block">
                <div className="gd-block-heading">
                  <div><span>QUICK FIX</span><h2>卡住了？快速排障</h2></div>
                  <p>点击问题直接跳到对应规则和处理步骤。</p>
                </div>
                <div className="gd-fix-grid">
                  {GUIDE_QUICK_FIXES.map(fix => (
                    <button type="button" key={fix.id} onClick={() => goToSection(fix.categoryId, fix.sectionId)}>
                      <span>{fix.icon}</span>
                      <div><strong>{fix.title}</strong><p>{fix.answer}</p></div>
                      <i aria-hidden="true">→</i>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {normalizedQuery && (
            <div className="gd-search-summary" aria-live="polite">
              <span>搜索结果</span>
              <h2>“{query.trim()}”</h2>
              <p>找到 {searchResults.reduce((sum, category) => sum + category.sections.length, 0)} 个相关主题</p>
            </div>
          )}

          {normalizedQuery && searchResults.length === 0 && (
            <div className="gd-empty">
              <span aria-hidden="true">⌕</span>
              <h2>没有找到相关说明</h2>
              <p>试试“进化”“感叹号”“捕虫”“存档”或更短的关键词。</p>
              <button type="button" onClick={() => setQuery('')}>清除搜索</button>
            </div>
          )}

          {visibleCategories.map(category => (
            <article className="gd-article" key={category.id} style={{ '--gd-accent': category.color }}>
              <header className="gd-article-header">
                <span className="gd-article-icon">{category.icon}</span>
                <div>
                  <span className="gd-eyebrow">GAME SYSTEM · {category.sections.length} TOPICS</span>
                  <h2>{markText(category.title, normalizedQuery)}</h2>
                  <p>{markText(category.summary, normalizedQuery)}</p>
                </div>
              </header>
              <div className="gd-article-sections">
                {category.sections.map((section, index) => {
                  const sectionKey = `${category.id}-${section.id}`;
                  const defaultOpen = normalizedQuery ? true : index === 0;
                  const open = normalizedQuery || (expanded[sectionKey] ?? defaultOpen);
                  return (
                    <GuideSection
                      key={section.id}
                      category={category}
                      section={section}
                      index={index}
                      query={normalizedQuery}
                      open={open}
                      onToggle={() => toggleSection(category.id, section.id, defaultOpen)}
                    />
                  );
                })}
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
});
