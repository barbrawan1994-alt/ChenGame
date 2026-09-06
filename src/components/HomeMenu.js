import React from 'react';
import { ArrowRight, BookOpen, Compass, RotateCcw, Settings, Shield } from 'lucide-react';
import './HomeMenu.css';

export default function HomeMenu({ hasSave, trainerName, badgeCount, badgeTotal, location, onStart, onNavigate, onReset }) {
  return (
    <main className="home-menu" id="main-content">
      <img className="home-menu-art" src="assets/super-spirit-home-cover-bg.png?v=20260709-visual-fix" alt="训练师与精灵伙伴站在天空之城的竞技场中" fetchPriority="high" />
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
            <span><Compass size={14} aria-hidden="true" />{location}</span>
            <span><Shield size={14} aria-hidden="true" />{badgeCount} / {badgeTotal}</span>
          </div>
        )}
        <button className="home-menu-start" type="button" onClick={onStart}>
          <span>{hasSave ? '继续冒险' : '开始游戏'}</span>
          <ArrowRight size={22} aria-hidden="true" />
        </button>
        <nav className="home-menu-links" aria-label="主菜单">
          <button type="button" onClick={() => onNavigate('pokedex')}><BookOpen size={16} aria-hidden="true" />精灵图鉴</button>
          <button type="button" onClick={() => onNavigate('guide')}><Compass size={16} aria-hidden="true" />冒险指南</button>
          <button type="button" onClick={() => onNavigate('settings')}><Settings size={16} aria-hidden="true" />设置</button>
        </nav>
      </section>

      <footer className="home-menu-footer">
        <span>SUPER SPIRIT <b>v15.0</b></span>
        {hasSave && <button type="button" onClick={onReset} aria-label="重置存档" title="重置存档"><RotateCcw size={16} aria-hidden="true" /></button>}
      </footer>
    </main>
  );
}
