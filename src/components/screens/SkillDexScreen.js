import React, { useState } from 'react';
import { TYPES } from '../../data/types';

const SKILL_PAGE_SIZE = 60;

export default React.memo(function SkillDexScreen({ allSkills, onBack }) {
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [skillPage, setSkillPage] = useState(0);

  const filteredSkills = allSkills.filter(s => {
    const matchType = skillFilter === 'ALL' || s.t === skillFilter || (skillFilter === 'STATUS' && s.category === 'status');
    const matchSearch = s.name.includes(skillSearchTerm);
    return matchType && matchSearch;
  });

  const getSkillCategory = (s) => {
    if (s.category === 'status') return '\u53D8\u5316';
    return s.category === 'special' ? '\u7279\u6B8A' : s.p > 0 ? '\u7269\u7406' : '\u53D8\u5316';
  };
  const getPowerColor = (p) => {
    if (p >= 120) return '#FF1744';
    if (p >= 80) return '#FF9100';
    if (p >= 40) return '#FFD600';
    if (p > 0) return '#69F0AE';
    return '#616161';
  };
  const getPowerRank = (p) => {
    if (p >= 120) return 'S';
    if (p >= 80) return 'A';
    if (p >= 40) return 'B';
    if (p > 0) return 'C';
    return '-';
  };

  return (
    <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, #0a0a1a 0%, #111133 50%, #0a0a1a 100%)', color:'#fff', overflow:'hidden', display:'flex', flexDirection:'column'}}>
      <div style={{padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0, background:'rgba(0,0,0,0.3)', backdropFilter:'blur(12px)'}}>
        <button onClick={onBack} style={{background:'none', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer', padding:'4px'}}>{'\u2190'}</button>
        <div style={{fontSize:'18px', fontWeight:'800', letterSpacing:'2px', background:'linear-gradient(90deg, #60A5FA, #A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>{'\u6280\u80FD\u5927\u767E\u79D1'}</div>
        <div style={{fontSize:'10px', color:'rgba(255,255,255,0.3)'}}>{filteredSkills.length} {'\u6280\u80FD'}</div>
      </div>

      <div style={{padding:'12px 16px', flexShrink:0}}>
        <div style={{position:'relative', marginBottom:'10px'}}>
          <input type="text" placeholder="\u641C\u7D22\u6280\u80FD\u540D\u79F0..." value={skillSearchTerm} onChange={e => setSkillSearchTerm(e.target.value)}
            style={{width:'100%', padding:'10px 14px 10px 36px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'13px', outline:'none', boxSizing:'border-box'}} />
          <svg style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', opacity:0.3}} width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px'}}>
          <button onClick={()=>{setSkillFilter('ALL');setSkillPage(0);}} style={{padding:'5px 12px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none', flexShrink:0, background: skillFilter==='ALL' ? '#6366f1' : 'rgba(255,255,255,0.06)', color: skillFilter==='ALL' ? '#fff' : 'rgba(255,255,255,0.5)', transition:'all 0.2s'}}>{'\u5168\u90E8'}</button>
          <button onClick={()=>{setSkillFilter('STATUS');setSkillPage(0);}} style={{padding:'5px 12px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none', flexShrink:0, background: skillFilter==='STATUS' ? '#9C27B0' : 'rgba(255,255,255,0.06)', color: skillFilter==='STATUS' ? '#fff' : 'rgba(255,255,255,0.5)', transition:'all 0.2s'}}>{'\u53D8\u5316'}</button>
          {Object.keys(TYPES).map(t => (
            <button key={t} onClick={()=>{setSkillFilter(t);setSkillPage(0);}} style={{padding:'5px 10px', borderRadius:'16px', fontSize:'11px', fontWeight:'700', cursor:'pointer', border:'none', flexShrink:0, background: skillFilter===t ? TYPES[t].color : 'rgba(255,255,255,0.06)', color: skillFilter===t ? '#fff' : 'rgba(255,255,255,0.5)', transition:'all 0.2s'}}>{TYPES[t].name}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'0 16px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px',padding:'0 4px'}}>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.4)'}}>{'\u5171'} {filteredSkills.length} {'\u4E2A\u6280\u80FD'}</span>
          {filteredSkills.length > SKILL_PAGE_SIZE && <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
            <button disabled={skillPage===0} onClick={()=>setSkillPage(p=>p-1)} style={{padding:'4px 10px',borderRadius:'8px',fontSize:'11px',cursor:skillPage===0?'default':'pointer',border:'none',background:skillPage===0?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.3)',color:skillPage===0?'rgba(255,255,255,0.2)':'#fff'}}>{'\u4E0A\u4E00\u9875'}</button>
            <span style={{fontSize:'11px',color:'rgba(255,255,255,0.5)'}}>{skillPage+1}/{Math.ceil(filteredSkills.length/SKILL_PAGE_SIZE)}</span>
            <button disabled={(skillPage+1)*SKILL_PAGE_SIZE>=filteredSkills.length} onClick={()=>setSkillPage(p=>p+1)} style={{padding:'4px 10px',borderRadius:'8px',fontSize:'11px',cursor:(skillPage+1)*SKILL_PAGE_SIZE>=filteredSkills.length?'default':'pointer',border:'none',background:(skillPage+1)*SKILL_PAGE_SIZE>=filteredSkills.length?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.3)',color:(skillPage+1)*SKILL_PAGE_SIZE>=filteredSkills.length?'rgba(255,255,255,0.2)':'#fff'}}>{'\u4E0B\u4E00\u9875'}</button>
          </div>}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'10px'}}>
          {filteredSkills.slice(skillPage * SKILL_PAGE_SIZE, (skillPage + 1) * SKILL_PAGE_SIZE).map((skill, idx) => {
            const typeColor = TYPES[skill.t]?.color || '#666';
            const pwrColor = getPowerColor(skill.p);
            const pwrRank = getPowerRank(skill.p);
            return (
              <div key={skill.id || skill.name + '_' + idx} style={{
                background:'rgba(255,255,255,0.03)', borderRadius:'14px', padding:'14px',
                border:`1px solid ${typeColor}20`, position:'relative', overflow:'hidden',
                transition:'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background=`${typeColor}10`; e.currentTarget.style.borderColor=`${typeColor}40`; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor=`${typeColor}20`; e.currentTarget.style.transform=''; }}
              >
                <div style={{position:'absolute', left:0, top:'12px', bottom:'12px', width:'3px', borderRadius:'0 3px 3px 0', background:typeColor}} />
                {skill.p > 0 && <div style={{position:'absolute', top:'10px', right:'10px', width:'24px', height:'24px', borderRadius:'6px', background:`${pwrColor}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', color:pwrColor, border:`1px solid ${pwrColor}30`}}>{pwrRank}</div>}
                <div style={{paddingLeft:'10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                    <span style={{fontSize:'15px', fontWeight:'800', color:'#fff'}}>{skill.name}</span>
                    <span style={{fontSize:'9px', padding:'2px 8px', borderRadius:'8px', background:typeColor, color:'#fff', fontWeight:'600'}}>{TYPES[skill.t]?.name || '\u53D8\u5316'}</span>
                  </div>
                  <div style={{display:'flex', gap:'12px', fontSize:'11px', marginBottom: skill.desc ? '8px' : '0'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                      <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>{'\u5A01\u529B'}</span>
                      <span style={{fontWeight:'800', color: skill.p > 0 ? pwrColor : 'rgba(255,255,255,0.25)', fontSize:'14px'}}>{skill.p > 0 ? skill.p : '-'}</span>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                      <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>PP</span>
                      <span style={{fontWeight:'700', color:'#42A5F5'}}>{skill.pp}</span>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                      <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>{'\u547D\u4E2D'}</span>
                      <span style={{fontWeight:'700', color:'#66BB6A'}}>{skill.acc || 100}</span>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                      <span style={{color:'rgba(255,255,255,0.35)', fontSize:'10px'}}>{'\u5206\u7C7B'}</span>
                      <span style={{fontWeight:'600', color:'rgba(255,255,255,0.6)'}}>{getSkillCategory(skill)}</span>
                    </div>
                  </div>
                  {skill.desc && <div style={{fontSize:'10px', color:'rgba(255,255,255,0.4)', lineHeight:'1.5', borderTop:'1px solid rgba(255,255,255,0.04)', paddingTop:'6px'}}>{skill.desc}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
