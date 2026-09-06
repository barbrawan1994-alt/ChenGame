import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ActivityScreen({ title, status, onBack, children, className = '' }) {
  return (
    <section className={`screen activity-screen ${className}`}>
      <header className="activity-screen-header">
        <button type="button" onClick={onBack} className="activity-back" aria-label="返回游戏" title="返回游戏"><ArrowLeft size={18} /></button>
        <h1>{title}</h1>
        <div className="activity-screen-status">{status}</div>
      </header>
      <div className="activity-screen-body">{children}</div>
    </section>
  );
}
