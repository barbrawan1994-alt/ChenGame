import React, { useMemo, useState } from 'react';
import { Search, Eye, Swords, MapPin, Radar, Shield } from 'lucide-react';
import { KAIJU, KAIJU_HABITATS, KAIJU_RANKS, KAIJU_STYLES } from '../../data/kaiju';
import { TYPES } from '../../data/types';
import { normalizeKaijuProgress } from '../../utils/kaijuRules';
import './KaijuDex.css';

const ERAS={showa:'昭和',heisei:'平成',newgen:'新生代',reiwa:'令和'};
export default function KaijuDex({progress}) {
  const [era,setEra]=useState('');
  const [query,setQuery]=useState('');
  const [habitat,setHabitat]=useState('');
  const [status,setStatus]=useState('all');
  const [rank,setRank]=useState('');
  const [selected,setSelected]=useState('gomora');
  const dex=useMemo(()=>normalizeKaijuProgress(progress),[progress]);
  const entries=useMemo(()=>KAIJU.filter(item=>(!era || item.era===era) && (!habitat || item.habitats.includes(habitat))
    && (rank==='' || item.rank===Number(rank)) && (status==='all' || (status==='seen' ? dex.seenIds.includes(item.id) : status==='defeated' ? dex.defeatedIds.includes(item.id) : !dex.seenIds.includes(item.id)))
    && `${item.name} ${item.wiki} ${item.series} ${item.signature}`.toLowerCase().includes(query.toLowerCase().trim())),[era,habitat,rank,status,query,dex]);
  const monster=entries.find(item=>item.id===selected) || entries[0];
  const style=monster && KAIJU_STYLES[monster.style];
  const tier=monster && KAIJU_RANKS[monster.rank];
  return <div className="ultra-workspace kaiju-workspace">
    <aside className="ultra-era-nav kaiju-filters" aria-label="怪兽筛选">
      <button type="button" aria-pressed={!era} onClick={()=>setEra('')}>全部怪兽<span>{KAIJU.length}</span></button>
      {Object.entries(ERAS).map(([id,name])=><button key={id} type="button" aria-pressed={era===id} onClick={()=>setEra(id)}>{name}<span>{KAIJU.filter(item=>item.era===id).length}</span></button>)}
      <label className="ultra-field">出没环境<select aria-label="怪兽出没环境" value={habitat} onChange={event=>setHabitat(event.target.value)}><option value="">全部环境</option>{Object.entries(KAIJU_HABITATS).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
      <label className="ultra-field">危险等级<select aria-label="怪兽危险等级" value={rank} onChange={event=>setRank(event.target.value)}><option value="">全部等级</option>{KAIJU_RANKS.map((item,index)=><option key={index} value={index}>{item.name}</option>)}</select></label>
      <div className="kaiju-progress"><Eye size={15}/><span>已遭遇<strong>{dex.seenIds.length} / {KAIJU.length}</strong></span><Swords size={15}/><span>已讨伐<strong>{dex.defeatedIds.length} / {KAIJU.length}</strong></span></div>
    </aside>
    <main className="ultra-catalog kaiju-catalog">
      <div className="ultra-catalog-toolbar"><h2>怪兽图鉴 <span>{entries.length}</span></h2><label className="ultra-search"><Search size={16}/><input aria-label="搜索怪兽" placeholder="名称、作品、招式" value={query} onChange={event=>setQuery(event.target.value)}/></label></div>
      <div className="kaiju-status" role="group" aria-label="怪兽收录状态">{[['all','全部'],['unseen','未发现'],['seen','已遭遇'],['defeated','已讨伐']].map(([id,name])=><button key={id} type="button" aria-pressed={status===id} onClick={()=>setStatus(id)}>{name}</button>)}</div>
      <div className="ultra-hero-grid kaiju-grid">
        {entries.map(item=><button type="button" className={`ultra-hero ${monster?.id===item.id ? 'is-selected' : ''}`} key={item.id} aria-pressed={monster?.id===item.id} aria-label={`${item.name}，${KAIJU_RANKS[item.rank].name}`} onClick={()=>setSelected(item.id)}>
          <img src={item.portrait} alt={item.name} width="160" height="160" loading="lazy" decoding="async"/>
          <span className="ultra-hero-year">{String(item.number).padStart(3,'0')}</span>
          {dex.seenIds.includes(item.id) && <span className="ultra-hero-lock" title={dex.defeatedIds.includes(item.id) ? '已讨伐' : '已遭遇'}>{dex.defeatedIds.includes(item.id) ? <Swords size={12}/> : <Eye size={12}/>}</span>}
          <strong>{item.name}</strong><small>{KAIJU_RANKS[item.rank].name} · {TYPES[item.type]?.name}</small>
        </button>)}
        {!entries.length && <p className="ultra-empty">没有符合条件的怪兽</p>}
      </div>
    </main>
    <aside className="ultra-detail kaiju-detail" aria-label="怪兽档案">
      {monster && <><div className="ultra-detail-portrait"><img src={monster.portrait} alt={monster.name} width="300" height="300"/><span>NO. {String(monster.number).padStart(3,'0')}</span></div>
      <div className="ultra-detail-copy"><span className="ultra-eyebrow">{ERAS[monster.era]} / {monster.series}</span><h2>{monster.name}</h2>
        <div className="kaiju-labels"><span>{tier.name}</span><span>{TYPES[monster.type]?.name}属性</span><span>{dex.defeatedIds.includes(monster.id) ? '已讨伐' : dex.seenIds.includes(monster.id) ? '已遭遇' : '未发现'}</span></div>
        <div className="ultra-technique"><Swords size={17}/><div><small>招牌攻击</small><strong>{monster.signature}</strong><span>{style.name}</span></div></div>
        <section><h3><Shield size={14}/>应对要点</h3><p>{style.hint}</p></section>
        <section><h3><MapPin size={14}/>出没情报</h3><p>{monster.habitats.map(id=>KAIJU_HABITATS[id]).join('、')}</p><p>野外 Lv.{tier.minLevel} 起 · {tier.badges} 枚徽章<br/>异星裂隙可能出现在其他环境</p></section>
        <section><h3><Radar size={14}/>讨伐收益</h3><p>基础金币 ×{tier.gold} · 经验 ×{tier.exp}<br/>{['橙橙果','文柚果','木子果'][monster.rank]} ×{tier.berries}{monster.rank>0 && <><br/>增强剂 {monster.rank===2 ? '45%' : '25%'}</>}{monster.rank===2 && <><br/>暗之石 18%</>}</p></section>
      </div></>}
    </aside>
  </div>;
}
