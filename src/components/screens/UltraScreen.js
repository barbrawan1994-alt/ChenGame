import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, Shield, Sparkles, Swords, Check, Lock, ChevronRight, CircleHelp } from 'lucide-react';
import { ULTRA_HEROES, ULTRA_BY_ID, ULTRA_ERAS, ULTRA_ROLES } from '../../data/ultra';
import { getUltraForm, isUltraUnlocked } from '../../utils/ultraRules';
import { getUltraTrial, getUltraTrialBlock } from '../../utils/ultraTrials';
import { KAIJU_STYLES } from '../../data/kaiju';
import { KAIJU_TRIAL_ROUTES } from '../../data/kaijuTrials';
import { getUltraDevice, ULTRA_DEVICES } from '../../data/ultraDevices';
import './UltraScreen.css';

export default function UltraScreen({ state, party, badges = [], onChange, onTrial, onBack, result }) {
  const [tab, setTab] = useState(result ? 'trials' : 'heroes');
  const [era, setEra] = useState(ULTRA_BY_ID[state.heroId]?.era || 'showa');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(state.heroId);
  const [formId, setFormId] = useState(state.formId);
  const [trialHeroId, setTrialHeroId] = useState(result?.heroId || 'zoffy');
  const [trialEra, setTrialEra] = useState(result?.eraId || 'showa');
  const [showRules, setShowRules] = useState(false);
  const [collection,setCollection]=useState('all');
  const [hostUid,setHostUid]=useState(state.hostUid);
  const [trialRoute,setTrialRoute]=useState(result?.route || 0);
  const hero = ULTRA_BY_ID[selected] || ULTRA_HEROES[0];
  const form = getUltraForm(hero.id, formId);
  const device = getUltraDevice(hero.id);
  const role = ULTRA_ROLES[form.role];
  const unlocked = isUltraUnlocked(state, hero.id);
  const host = party.find(pet => pet.uid === hostUid);
  const equippedHost = party.find(pet=>pet.uid===state.hostUid);
  const available = ULTRA_HEROES.filter(item => isUltraUnlocked(state, item.id)).length;
  const heroes = useMemo(() => ULTRA_HEROES.filter(item => (!era || item.era === era) && (collection==='all' || isUltraUnlocked(state,item.id)===(collection==='owned')) && `${item.name} ${item.id} ${item.year} ${getUltraDevice(item.id).name}`.toLowerCase().includes(query.toLowerCase().trim())), [era, query, collection, state]);
  const trial = getUltraTrial(trialHeroId,party,trialRoute);
  const trialBlock = getUltraTrialBlock(trial,state,party,badges.length);
  const trialHeroes = ULTRA_HEROES.filter(item=>item.era===trialEra);
  const selectHero = item => { setSelected(item.id); setFormId(item.id === state.heroId ? state.formId : item.forms[0].id); };
  const contractMatches = state.heroId === hero.id && state.formId === form.id && host && state.hostUid===host.uid;

  return <section className={`screen ultra-screen ${tab==='devices' ? 'ultra-device-view' : ''}`} aria-label="光之羁绊">
    <header className="ultra-header">
      <button type="button" className="ultra-icon-button" onClick={onBack} aria-label="返回游戏" title="返回游戏"><ArrowLeft size={20} /></button>
      <div><span className="ultra-eyebrow">ULTRA CHRONICLE</span><h1>光之羁绊</h1></div>
      <nav aria-label="光之羁绊页签"><button type="button" aria-pressed={tab === 'heroes'} onClick={() => setTab('heroes')}>奥特曼图鉴</button><button type="button" aria-pressed={tab === 'devices'} onClick={() => setTab('devices')}>变身器收藏</button><button type="button" aria-pressed={tab === 'trials'} onClick={() => setTab('trials')}>星际试炼</button></nav>
      <span className="ultra-count">变身器 {available} / {ULTRA_DEVICES.length}</span>
      <button type="button" className="ultra-icon-button" onClick={() => setShowRules(!showRules)} aria-label="查看战斗规则" title="战斗规则" aria-expanded={showRules}><CircleHelp size={19} /></button>
    </header>
    {showRules && <aside className="ultra-rules"><strong>变身器</strong><span>专属试炼每次只授予对应角色的一件变身器，永久持有，不消耗库存。选择宿主并装配后，首回合结束才能在战斗中使用。全队每场一次爆发，持续三回合，换人继续计时。必杀出手后结束，失手也消耗。与果实、尾兽共用爆发机会。竞技场、PvP、捕虫大会禁用。</span></aside>}
    {tab !== 'trials' ? <div className="ultra-workspace">
      <aside className="ultra-era-nav" aria-label="时代筛选">
        <button type="button" aria-pressed={!era} onClick={() => setEra('')}>全部角色<span>{ULTRA_HEROES.length}</span></button>
        {ULTRA_ERAS.map(item => <button type="button" key={item.id} aria-pressed={era === item.id} onClick={() => setEra(item.id)}><span>{item.name}<small>{item.subtitle}</small></span><span>{ULTRA_HEROES.filter(h => h.era === item.id).length}</span></button>)}
        <div className="ultra-active-contract"><Shield size={18} /><span>已装配变身器<strong>{equippedHost && isUltraUnlocked(state,state.heroId) ? getUltraDevice(state.heroId).name : '未装配'}</strong><small>{equippedHost?.nickname || equippedHost?.name || '尚未选择宿主'}</small></span></div>
      </aside>
      <main className="ultra-catalog">
        <div className="ultra-catalog-toolbar"><h2>{ULTRA_ERAS.find(item => item.id === era)?.name || '群星图鉴'} <span>{heroes.length}</span></h2><label className="ultra-search"><Search size={16} /><input aria-label="搜索角色或变身器" placeholder="角色或变身器" value={query} onChange={event => { setQuery(event.target.value); if (event.target.value) setEra(''); }} /></label></div>
        <div className="ultra-collection-filter" aria-label="收藏状态">{[['all','全部'],['owned','已收集'],['missing','未获得']].map(([id,label])=><button key={id} aria-pressed={collection===id} onClick={()=>setCollection(id)}>{label}</button>)}</div>
        <div className="ultra-hero-grid">
          {heroes.map(item => <button key={item.id} type="button" className={`ultra-hero ${selected === item.id ? 'is-selected' : ''}`} aria-pressed={selected === item.id} aria-label={`${item.name}${isUltraUnlocked(state, item.id) ? '，可契约' : '，未解锁'}`} onClick={() => selectHero(item)}>
            <img src={tab === 'devices' ? getUltraDevice(item.id).portrait : item.portrait} alt={tab === 'devices' ? getUltraDevice(item.id).name : item.name} loading="lazy" decoding="async" width="160" height="160" />
            <span className="ultra-hero-year">{item.year}</span>
            <span className="ultra-hero-lock">{isUltraUnlocked(state, item.id) ? state.heroId === item.id && <Check size={14} /> : <Lock size={13} />}</span>
          <strong>{tab === 'devices' ? getUltraDevice(item.id).name : item.name}</strong><small>{tab === 'devices' ? `${item.name} · ${isUltraUnlocked(state,item.id) ? '已收集' : '未获得'}` : `${ULTRA_ROLES[item.role].name}${item.forms.length > 1 ? ` · ${item.forms.length} 形态` : ''}`}</small>{tab==='devices' && <span className={`ultra-device-label ${getUltraDevice(item.id).replica ? 'is-original' : ''}`}>{getUltraDevice(item.id).sourceLabel}</span>}
          </button>)}
          {!heroes.length && <p className="ultra-empty">未找到对应角色</p>}
        </div>
      </main>
      <aside className="ultra-detail" key={hero.id}>
        <div className="ultra-detail-portrait"><img src={tab === 'devices' ? device.portrait : hero.portrait} alt={tab === 'devices' ? device.name : hero.name} width="280" height="280" /><span>{String(ULTRA_HEROES.indexOf(hero) + 1).padStart(3, '0')}</span></div>
        <div className="ultra-detail-copy"><span className="ultra-eyebrow">{ULTRA_ERAS.find(item => item.id === hero.era)?.name} / {hero.year}</span><h2>{hero.name}</h2>
          <div className="ultra-technique"><img src={device.portrait} alt={device.name} width="48" height="48"/><div><small>{device.sourceLabel}</small><strong>{device.name}</strong><span>{unlocked ? '已收集 · 永久持有' : `获取：${hero.name}专属试炼`}</span>{tab === 'devices' && <span>{device.note}</span>}</div></div>
          <label className="ultra-field">战斗形态<select aria-label="战斗形态" value={form.id} onChange={event => setFormId(event.target.value)}>{hero.forms.map(item => <option key={item.id} value={item.id}>{item.name} · {ULTRA_ROLES[item.role].name}</option>)}</select></label>
          <div className="ultra-technique"><Sparkles size={17} /><div><small>专属必杀 / {role.name}</small><strong>{form.finisher}</strong><span>{role.power ? `威力 ${role.power} · 命中 100 · PP 1` : '恢复自身 30% HP · PP 1'}</span></div></div>
          <dl className="ultra-stat-list">{Object.entries(role.stats).map(([key, value]) => <div key={key}><dt>{{ p_atk: '物攻', s_atk: '特攻', p_def: '物防', s_def: '特防', spd: '速度' }[key]}</dt><dd>+{Math.round((value - 1) * 100)}%</dd></div>)}</dl>
          <label className="ultra-field">契约宿主<select aria-label="契约宿主" value={host?.uid ?? ''} onChange={event => setHostUid(party.find(pet=>String(pet.uid)===event.target.value)?.uid ?? null)}><option value="">选择队伍伙伴</option>{party.map(pet => <option key={pet.uid} value={pet.uid}>{pet.nickname || pet.name} · Lv.{pet.level}</option>)}</select></label>
          {unlocked ? <button type="button" className="ultra-primary" disabled={!host || !!contractMatches} onClick={() => onChange({ ...state, heroId: hero.id, formId: form.id, hostUid:host.uid })}>{contractMatches ? <Check size={17} /> : <Shield size={17} />}{contractMatches ? '变身器已装配' : '装配变身器'}</button> : <button type="button" className="ultra-primary" onClick={() => { setTrialHeroId(hero.id); setTrialEra(hero.era); setTab('trials'); }}><Lock size={16} />挑战获取变身器<ChevronRight size={16} /></button>}
          <p className="ultra-detail-note">{unlocked ? '战斗中使用变身器 · 3 回合 · 全队每场 1 次' : `完成「${hero.name}」专属试炼后获得`}</p>
        </div>
      </aside>
    </div> : <div className="ultra-trial-workspace">
      <aside className="ultra-chapter-list">
        <label className="ultra-field">试炼时代<select aria-label="试炼时代" value={trialEra} onChange={event=>{setTrialEra(event.target.value);setTrialHeroId(ULTRA_HEROES.find(item=>item.era===event.target.value).id);}}>{ULTRA_ERAS.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <p className="ultra-trial-progress">已通过 {state.trialWins.length} / {ULTRA_HEROES.length} 位</p>
        {trialHeroes.map(item=>{const details=getUltraTrial(item.id,party);return <button type="button" key={item.id} aria-pressed={trialHeroId===item.id} onClick={()=>setTrialHeroId(item.id)}><img src={item.portrait} width="42" height="42" alt="" loading="lazy"/><div><strong>{item.name}</strong><small>{details.tier.name} · Lv.{details.level}</small></div>{state.trialWins.includes(item.id) ? <Check size={17}/> : <ChevronRight size={17}/>}</button>;})}
      </aside>
      <main className="ultra-chapter">
        <div className="ultra-chapter-art ultra-trial-opponents">{trial.monsters.map(monster=><img key={monster.id} src={monster.portrait} alt={monster.name} width="280" height="280"/>)}<img src={trial.hero.portrait} alt={trial.hero.name} width="280" height="280" /></div>
        <div className="ultra-chapter-copy"><span className="ultra-eyebrow">{trial.era.name} / {trial.tier.name}</span><h2>{trial.hero.name} · 契约试炼</h2>
          <label className="ultra-field">挑战路线<select aria-label="挑战路线" value={trialRoute} onChange={event=>setTrialRoute(Number(event.target.value))}>{KAIJU_TRIAL_ROUTES.map((name,index)=><option value={index} key={name}>{name}</option>)}</select></label>
          <dl>
            <div><dt>唯一解锁奖励</dt><dd>{getUltraDevice(trial.hero.id).name} ×1 · 对应 {trial.hero.name}{isUltraUnlocked(state,trial.hero.id) ? '（已拥有）' : ''}</dd></div>
            <div><dt>敌方等级</dt><dd>Lv.{trial.level} · 最低 Lv.{trial.minLevel}，跟随队伍最高等级 +{trial.tier.levelBonus}，上限100</dd></div>
            <div><dt>出战阵容</dt><dd>队伍中前3名存活伙伴 · 至少2名 · 均需 Lv.{trial.minLevel}</dd></div>
            <div><dt>对手</dt><dd>{trial.monsters.map(monster=>monster.name).join('、')} 与 {trial.hero.name}投影 · {trial.isDouble ? '双打' : '连续单打，不中途恢复'}</dd></div>
            <div><dt>挑战门槛</dt><dd>{trial.tier.badges}枚徽章 · {trial.tier.wins}位不同角色首通{trial.prerequisites.length>0 && ` · 前置：${trial.prerequisites.map(id=>ULTRA_BY_ID[id].name).join('、')}`}</dd></div>
            <div><dt>结算</dt><dd>战后恢复原队伍 · 禁用道具 · 无经验金币 · 重复胜利不增加首通数</dd></div>
            <div className="ultra-trial-tactic"><dt>投影 · {trial.tactic.name}</dt><dd>{trial.tactic.hint}投影第3回合准备必杀，每4回合循环；怪兽各按自身节奏行动，双打错开强攻轮次。</dd><div className="ultra-trial-monsters">{trial.monsters.map(monster=><p key={monster.id}><strong>{monster.name} · {KAIJU_STYLES[monster.style].name}</strong><br/>{KAIJU_STYLES[monster.style].hint}</p>)}</div></div>
          </dl>
          {result?.heroId === trial.hero.id && <p className={`ultra-result ${result.won ? 'is-win' : ''}`} role="status">{result.won ? result.newlyUnlocked ? `获得${getUltraDevice(trial.hero.id).name}。装配后可在战斗中使用。` : `${trial.hero.name}试炼通过，变身器已拥有，不重复发放。` : '挑战未通过，没有获得变身器。调整队伍与行动安排后再来。'}</p>}
          {trialBlock && <p className="ultra-trial-block" role="status">{trialBlock}</p>}
          <button type="button" className="ultra-primary" title={trialBlock} disabled={!!trialBlock} onClick={() => onTrial(trial.hero.id,trialRoute)}><Swords size={18} />{state.trialWins.includes(trial.hero.id) ? '重温试炼' : '开始试炼'}</button>
        </div>
      </main>
    </div>}
  </section>;
}
