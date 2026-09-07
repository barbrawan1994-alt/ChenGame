import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Compass, RotateCcw, Settings, Shield } from 'lucide-react';
import './HomeMenu.css';

export default function HomeMenu({ hasSave, trainerName, badgeCount, location, onStart, onNavigate, onReset, loading = false, error = false, onRetry }) {
  const isFile = window.location.protocol === 'file:';
  const [cover, setCover] = useState(isFile ? 'assets/super-spirit-home-cover-bg.webp' : null);
  const coverUrl = useRef(null);
  useEffect(() => {
    if (loading || cover) return;
    const controller = new AbortController();
    fetch('assets/super-spirit-home-cover-bg.webp', { signal: controller.signal, priority: 'low' })
      .then(response => { if (!response.ok) throw new Error('Cover unavailable'); return response.blob(); })
      .then(blob => {
        if (controller.signal.aborted) return;
        coverUrl.current = URL.createObjectURL(blob);
        setCover(coverUrl.current);
      }).catch(() => {});
    return () => controller.abort();
  }, [loading, cover]);
  useEffect(() => () => { if (coverUrl.current) URL.revokeObjectURL(coverUrl.current); }, []);
  return (
    <main className="home-menu" id="main-content">
      <img className="home-menu-art" src={cover || 'assets/super-spirit-home-preview.webp'} alt="训练师与精灵伙伴站在天空之城的竞技场中" decoding="async" fetchPriority="low" />
      <div className="home-menu-shade" aria-hidden="true" />
      <header className="home-menu-brand">
        <p>SUPER SPIRIT</p>
        <h1>超级精灵</h1>
        <div className="home-menu-title-rule" aria-hidden="true"><span /></div>
      </header>

      <section className="home-menu-play" aria-label="冒险存档">
        {hasSave && (
          <div className="home-menu-save">
            <strong>{trainerName || '训练师'}</strong>
            {location && <span><Compass size={14} aria-hidden="true" />{location}</span>}
            <span><Shield size={14} aria-hidden="true" />{badgeCount} 枚徽章</span>
          </div>
        )}
        <button className="home-menu-start" type="button" onClick={error ? onRetry : onStart} disabled={loading} aria-busy={loading}>
          <span>{loading ? '正在进入游戏...' : error ? '重新加载' : hasSave ? '继续冒险' : '开始游戏'}</span>
          <ArrowRight size={22} aria-hidden="true" />
        </button>
        {error && <p className="home-menu-load-error" role="alert">下载中断，请重试。存档已保留。</p>}
        <nav className="home-menu-links" aria-label="主菜单">
          <button type="button" disabled={loading} onClick={() => onNavigate('pokedex')}><BookOpen size={16} aria-hidden="true" />精灵图鉴</button>
          <button type="button" disabled={loading} onClick={() => onNavigate('guide')}><Compass size={16} aria-hidden="true" />冒险指南</button>
          <button type="button" disabled={loading} onClick={() => onNavigate('settings')}><Settings size={16} aria-hidden="true" />设置</button>
        </nav>
      </section>

      <footer className="home-menu-footer">
        <span>SUPER SPIRIT <b>v15.0</b></span>
        {hasSave && <button type="button" disabled={loading} onClick={onReset} aria-label="重置存档" title="重置存档"><RotateCcw size={16} aria-hidden="true" /></button>}
      </footer>
    </main>
  );
}
