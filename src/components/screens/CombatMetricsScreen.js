import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { summarizeCombatMetrics } from '../../utils/combatMetrics';

export default function CombatMetricsScreen({ metrics, onBack }) {
  const rows = summarizeCombatMetrics(metrics);
  const download = () => {
    const data = { ...metrics, exportedAt: new Date().toISOString(), scope: 'local-save', summary: rows };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'combat-statistics.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const names = { wild: '野外', trainer: '训练家', gym: '道馆', story_task: '剧情', infinity: '无限城', boss_rush: '连战', kingdom_war: '国战', kw_campaign: '国战战役', capital_siege: '都城战', ultra_trial: '光之试炼', arena: '竞技场', naruto_story: '忍界剧情', naruto_exam: '忍者试炼' };
  return <div className="screen combat-metrics-screen">
    <div className="nav-header"><button type="button" onClick={onBack}><ArrowLeft size={16} />返回</button><h2>战斗统计</h2><button type="button" onClick={download} disabled={!rows.length}><Download size={16} />导出</button></div>
    <div className="combat-metrics-body">
      <p>本地最近 {metrics.samples.length} 场 · 有效时长排除后台及手动模式超过一分钟的无操作等待</p>
      {rows.length ? <table><thead><tr>{['战斗', '赛季', '场次', '胜 / 负', '失败率', '平均有效时长', '手动 / 自动指令', '中断'].map(title => <th key={title}>{title}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}><td>{names[row.type] || row.type}{row.double ? ' · 双打' : ''}</td><td>{row.season}</td><td>{row.samples}</td><td>{row.wins} / {row.losses}</td><td>{row.failureRate === null ? '-' : `${Math.round(row.failureRate * 100)}%`}</td><td>{Math.round(row.averageActiveMs / 1000)} 秒</td><td>{row.manualCommands} / {row.autoCommands}</td><td>{row.interrupted}</td></tr>)}</tbody></table>
        : <p className="combat-metrics-empty">暂无战斗样本</p>}
    </div>
  </div>;
}
