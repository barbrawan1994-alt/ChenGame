/** 生态危机 / 灵灾调查 — 探索、推理、分支、战斗结合 */

export const MORAL_BRANCHES = {
  fight: { id: 'fight', label: '⚔️ 战斗压制', desc: '快速解决，但生态恢复慢', ecology: { pollution: -15, stability: 10 }, bossMult: 1.0 },
  soothe: { id: 'soothe', label: '🤝 安抚救助', desc: '需要条件，高亲密稀有结契', ecology: { stability: 20, diversity: 10 }, bossMult: 0.85, reqTypes: ['FAIRY', 'NORMAL'] },
  heal: { id: 'heal', label: '🌿 生态修复', desc: '最复杂，区域永久收益', ecology: { vegetation: 25, pollution: -25, water: 15 }, bossMult: 0.8, reqTypes: ['GRASS', 'FAIRY'] },
  trade: { id: 'trade', label: '💰 资源交换', desc: '花费资源换取捷径', cost: { gold: 3000 }, ecology: { stability: 5 }, bossMult: 1.1 },
  relocate: { id: 'relocate', label: '🏠 迁移巢穴', desc: '帮它寻找新巢穴，生态恢复最佳', cost: { gold: 1500 }, ecology: { stability: 25, diversity: 15 }, bossMult: 0.9, reqTypes: ['GROUND', 'ROCK'] },
};

export const ECO_CRISES = [
  {
    id: 'crisis_forest_rampage',
    name: '失眠的森林',
    mapId: 1,
    icon: '🌲',
    reqBadges: 2,
    color: '#2E7D32',
    summary: '青藤林精灵连续失眠暴走，需要调查银色粉末与异常回声的真正原因。',
    branches: ['fight', 'heal', 'trade'],
    branchPrompt: '调查后发现商人采走了月眠草。你打算如何解决？',
    steps: [
      { type: 'explore', title: '现场勘查', text: '树上有银色粉末，水源附近有异常回声，夜间传来奇怪铃声。眠菇兽的孢子似乎失效了。' },
      { type: 'puzzle', title: '追踪线索', text: '三条足迹通向不同方向。最浓黑雾的路径通向被采空的月眠草田——真相浮现！', choices: ['调查药田', '追踪黑雾', '询问村民'] },
      { type: 'branch', title: '选择对策' },
      { type: 'battle', title: '驱散暴徒', enemyName: '暴走草系群', pool: [1, 2, 43, 44, 46], lvl: [12, 18], count: 3 },
      { type: 'boss', title: '黑藤鹿王', enemyName: '黑藤鹿王', bossKey: 'black_vine_king', bossId: 117, lvl: 24, drop: 4000 },
    ],
    reward: { gold: 4000, item: 'great', itemCount: 5 },
    ecologyReward: { vegetation: 20, pollution: -20, stability: 15 },
  },
  {
    id: 'crisis_black_lake',
    name: '湖水变黑',
    mapId: 4,
    icon: '🌊',
    reqBadges: 3,
    color: '#0277BD',
    summary: '深蓝海域水质恶化，需要调查污染源并应对镜湖异象。',
    branches: ['fight', 'heal', 'soothe'],
    branchPrompt: '湖水变黑源于管道排污与镜湖巨蚌躁动。你选择？',
    steps: [
      { type: 'explore', title: '取样分析', text: '湖水散发金属腥味，底部有不明管道排放废液。水面倒影似乎在移动…' },
      { type: 'battle', title: '清除污染者', enemyName: '受污精灵', pool: [22, 24, 26, 88, 89], lvl: [30, 38], count: 4 },
      { type: 'puzzle', title: '关闭阀门', text: '按正确顺序关闭三个阀门后，水流恢复清澈，但湖心仍有异象。' },
      { type: 'branch', title: '选择对策' },
      { type: 'boss', title: '镜湖巨蚌', enemyName: '镜湖巨蚌', bossKey: 'mirror_giant_clam', bossId: 148, lvl: 44, drop: 5500 },
    ],
    reward: { gold: 5500, item: 'hyper_potion', itemCount: 8 },
    ecologyReward: { water: 30, pollution: -25, spirit: 10 },
  },
  {
    id: 'crisis_red_aurora',
    name: '雪原红色极光',
    mapId: 9,
    icon: '❄️',
    reqBadges: 7,
    color: '#4FC3F7',
    summary: '极寒冻土上空出现血色极光，冰系精灵行为异常。',
    branches: ['fight', 'soothe'],
    branchPrompt: '极光源于地下巨型生物苏醒。你打算？',
    steps: [
      { type: 'explore', title: '极光观测', text: '极光频率与地下震动同步，冰系精灵集体朝向震源低鸣。' },
      { type: 'battle', title: '冰原遭遇', enemyName: '狂乱冰系群', pool: [86, 87, 91, 124, 144], lvl: [68, 78], count: 4 },
      { type: 'puzzle', title: '破冰仪式', text: '用火系技能融化冰柱，露出通往地下的裂隙。' },
      { type: 'branch', title: '选择对策' },
      { type: 'boss', title: '极光之主', enemyName: '赤极光兽', bossId: 344, lvl: 86, drop: 8000 },
    ],
    reward: { gold: 9000, item: 'ice_stone', itemCount: 1 },
    ecologyReward: { spirit: 15, stability: 10 },
  },
  {
    id: 'crisis_desert_freeze',
    name: '荒漠夜晚结冰',
    mapId: 10,
    icon: '🏜️',
    reqBadges: 8,
    color: '#FF8F00',
    summary: '流沙荒漠夜间气温骤降，与雪原极光同源的寒能脉动。',
    branches: ['fight', 'heal', 'trade'],
    branchPrompt: '寒能来自地下古代祭坛失衡。你打算？',
    steps: [
      { type: 'explore', title: '昼夜调查', text: '沙地下方检测到极寒能量，白天火系精灵焦躁，夜晚地面结冰。' },
      { type: 'puzzle', title: '寻找热源', text: '在沙丘下找到古代火系祭坛，重新点燃后冰层开始融化。' },
      { type: 'branch', title: '选择对策' },
      { type: 'battle', title: '冰封守卫', enemyName: '冰沙傀儡', pool: [27, 50, 74, 95, 104], lvl: [75, 85], count: 5 },
      { type: 'boss', title: '寒沙龙王', enemyName: '寒沙龙王', bossId: 84, lvl: 90, drop: 10000 },
    ],
    reward: { gold: 11000, item: 'fire_stone', itemCount: 1 },
    ecologyReward: { stability: 20, diversity: 10 },
  },
  {
    id: 'crisis_robot_rampage',
    name: '机械精灵失控',
    mapId: 6,
    icon: '🤖',
    reqBadges: 5,
    color: '#546E7A',
    summary: '赛博都市机械精灵大规模失控，中央控制塔被入侵。',
    branches: ['fight', 'trade', 'soothe'],
    branchPrompt: '黑客入侵了控制塔。你打算？',
    steps: [
      { type: 'explore', title: '城市巡查', text: '机械精灵接收错误指令，市民撤离中。控制塔防火墙有漏洞。' },
      { type: 'battle', title: '镇压失控机', enemyName: '失控机械组', pool: [35, 40, 87, 88, 132], lvl: [45, 55], count: 4 },
      { type: 'puzzle', title: '入侵防火墙', text: '成功输入三段密钥，控制塔恢复部分权限。' },
      { type: 'branch', title: '选择对策' },
      { type: 'boss', title: '失控主脑', enemyName: '失控主脑', bossId: 140, lvl: 58, drop: 6500 },
    ],
    reward: { gold: 7000, item: 'thunder_stone', itemCount: 1 },
    ecologyReward: { stability: 25, pollution: -15 },
  },
  {
    id: 'crisis_mist_lake_vanish',
    name: '雾月湖失踪',
    mapId: 4,
    icon: '🌫️',
    reqBadges: 4,
    color: '#1565C0',
    summary: '雾月湖不断有人失踪。村民认为湖里有怪物，需在湖边调查真相并面对沉歌蚌后。',
    branches: ['fight', 'heal', 'soothe'],
    branchPrompt: '水影兽被歌声控制。你打算如何推进？',
    routes: [
      { id: 'violent', name: '直接击败', difficulty: 'easy', ecoDelta: { pollution: 5, stability: 5 } },
      { id: 'soothe', name: '控制后安抚', difficulty: 'medium', ecoDelta: { stability: 15, spirit: 10 }, reqTypes: ['FAIRY', 'PSYCHIC'] },
      { id: 'purify', name: '净化歌声印记', difficulty: 'hard', ecoDelta: { water: 20, pollution: -20, spirit: 15 }, reqTypes: ['FAIRY', 'PSYCHIC'] },
    ],
    bossModifiers: [
      { condition: 'branch:heal', effect: 'bossMult:0.85, skipMechanic:mirror_clones' },
      { condition: 'branch:soothe', effect: 'bossMult:0.9, extraPhase:sleep_weak' },
      { condition: 'route:violent', effect: 'bossMult:1.1, spawnAdds:2' },
    ],
    endings: [
      { id: 'repel', conditions: ['branch:fight'], narrative: '沉歌蚌后被击退，湖区暂时安全但灵气下降。', ecoDelta: { spirit: -10, stability: 10 }, rewards: { gold: 6000 } },
      { id: 'pacify', conditions: ['branch:heal'], narrative: '修复祭坛后沉歌蚌后成为友好守护精灵。', ecoDelta: { water: 25, spirit: 20, stability: 20 }, rewards: { gold: 8000, title: '湖心守护者' } },
      { id: 'dark_tide', conditions: ['route:violent'], narrative: '暗系吞噬过多，黑潮隐藏线开启。', ecoDelta: { pollution: 15, spirit: -5 }, rewards: { gold: 5000 } },
    ],
    steps: [
      { type: 'explore', title: '湖边调查', text: '岸边有拖拽痕迹、碎贝壳，水面倒影比真人慢半拍。夜晚能听到歌声。' },
      { type: 'puzzle', title: '追踪线索', text: '感知精灵发现拖拽像搬运而非攻击。光系照出倒影中的隐藏路线。', choices: ['调查痕迹', '分析倒影', '聆听歌声'] },
      { type: 'battle', title: '误导战斗', enemyName: '被控水影兽', pool: [22, 24, 26, 88], lvl: [32, 40], count: 3, objective: 'capture_alive', objectiveTarget: 3 },
      { type: 'branch', title: '选择对策' },
      { type: 'puzzle', title: '湖底祭坛', text: '水压门需水系控制，倒影桥需光系照亮，歌声石柱需声音类精灵共鸣。' },
      { type: 'battle', title: '沉歌蚌后', enemyName: '沉歌蚌后', bossKey: 'dream_song_queen', bossId: 24, lvl: 46, drop: 7000, objective: 'purify', objectiveTarget: 0 },
    ],
    reward: { gold: 7000, item: 'great', itemCount: 8 },
    ecologyReward: { water: 25, spirit: 15, stability: 15 },
  },
  {
    id: 'crisis_canyon_mine',
    name: '赤砂矿场冲突',
    mapId: 5,
    icon: '⛏️',
    reqBadges: 5,
    color: '#E65100',
    summary: '商会在熔岩火山开矿挖穿岩甲犀巢穴，黑市趁乱偷蛋，矿洞深处砂核巨像正在苏醒。',
    fusionChapter: true,
    fusionSystems: ['jutsu', 'devil_fruit', 'sect', 'general', 'kingdom'],
    routeStep: 6,
    branches: ['fight', 'soothe', 'relocate'],
    branchPrompt: '岩甲犀因巢穴被挖穿而暴走。你选择帮助哪一方？',
    routes: [
      { id: 'help_merchant', name: '保护矿场', difficulty: 'easy', ecoDelta: { stability: 5, pollution: 10 }, varDelta: { mineStability: 15, rhinoTrust: -25, kwArsenal: 10, ecoValue: -10 } },
      { id: 'help_beasts', name: '保护岩甲犀', difficulty: 'medium', ecoDelta: { stability: 20, diversity: 10 }, reqTypes: ['GROUND', 'ROCK'], varDelta: { rhinoTrust: 35, mineStability: -15, kwArsenal: -10, ecoValue: 15 } },
      { id: 'mediate', name: '调停双方', difficulty: 'hard', ecoDelta: { stability: 25, pollution: -10 }, reqTypes: ['GROUND', 'FAIRY'], varDelta: { rhinoTrust: 20, mineStability: 10, ecoValue: 10, blackMarket: -5 } },
    ],
    bossModifiers: [
      { condition: 'branch:relocate', effect: 'bossMult:0.8, skipMechanic:rage' },
      { condition: 'branch:soothe', effect: 'bossMult:0.85, objective:capture_alive' },
      { condition: 'route:help_merchant', effect: 'bossMult:1.0, ecoPenalty:diversity-15' },
      { condition: 'route:mediate', effect: 'bossMult:0.92' },
    ],
    endings: [
      { id: 'merchant_win', conditions: ['route:help_merchant'], narrative: '矿场继续开采，国家军备提升，但岩甲犀族群迁走，沙暴灵灾风险上升。', ecoDelta: { pollution: 15, diversity: -15 }, rewards: { gold: 10000 }, unlocks: ['kw_mine_merchant'] },
      { id: 'beast_win', conditions: ['route:help_beasts'], narrative: '岩甲犀族群留下，矿场停工，生态恢复，土系进化地点开放。', ecoDelta: { stability: 20, diversity: 15 }, rewards: { gold: 6000, title: '岩甲犀之友' }, unlocks: ['bond_rock_rhino'] },
      { id: 'best_end', conditions: ['route:mediate'], narrative: '修复巢穴、矿场改道、击退黑市。地下遗迹开放，岩甲犀结契与国战矿场同步解锁。', ecoDelta: { stability: 30, pollution: -10, diversity: 10 }, rewards: { gold: 12000, title: '生态调停者' }, unlocks: ['bond_rock_rhino', 'kw_reclaim_mine', 'canyon_sanctuary'] },
      { id: 'dark_end', conditions: ['route:help_merchant', 'branch:fight'], narrative: '强行爆破夺取果实残片，砂核暗化。短期战力收益高，但机械灵灾风险大增。', ecoDelta: { pollution: 20, spirit: 10, stability: -10 }, rewards: { gold: 14000, title: '砂核猎手' }, unlocks: ['kw_mine_dark', 'fruit_clue_dark'] },
    ],
    steps: [
      { type: 'explore', title: '沙暴截车', region: 'road', text: '商队在沙暴中遭暴走岩甲犀袭击。可选择击退、安抚或优先保护伤员（赵云将魂线索）。', varDelta: { blackMarket: 5 }, fusionHints: { general: 'zhao_yun' } },
      { type: 'battle', title: '保护商队', region: 'road', enemyName: '暴走岩甲犀', pool: [74, 95, 104], lvl: [40, 48], count: 2, objective: 'protect', objectiveTurns: 6, varDelta: { mineStability: 5, rhinoTrust: -5 } },
      { type: 'explore', title: '烈日驿站', region: 'sun_station', text: '商会管事、御灵谷弟子、玄岩宗修士与国家军需官各执一词。获得赤砂峡谷调查图。', varDelta: { kwArsenal: 5 } },
      { type: 'explore', title: '调查·商会矿场', region: 'mine', text: '矿洞异常坍塌、爆破记录被篡改、矿车有黑市标记。土遁/感知/诸葛亮将魂可发现隐藏爆破点。', varDelta: { mineStability: -5, relicAwakening: 8, blackMarket: 5 }, fusionHints: { jutsu: 'EARTH', general: 'zhuge_liang' } },
      { type: 'explore', title: '调查·岩甲犀旧巢', region: 'nest', text: '巢穴被挖穿，幼体受伤，精灵蛋被盗。温和精灵/医疗忍术/赵云将魂可提升救助效率。', varDelta: { rhinoTrust: 15, ecoValue: 10, blackMarket: 10 }, fusionHints: { jutsu: 'WATER', sectEco: ['heal'], general: 'zhao_yun' } },
      { type: 'explore', title: '调查·流沙洞窟', region: 'sand_cave', text: '流沙方向异常，黑市运输恶魔果实碎片。风遁/水系/小型精灵/星机阁可解读石碑。', varDelta: { relicAwakening: 10, blackMarket: 8, ecoValue: -5 }, fusionHints: { jutsu: 'WIND', sectEco: ['puzzle'] } },
      { type: 'route', title: '路线抉择', region: 'sun_station', text: '三线调查完成。选择保护矿场、保护岩甲犀，或调停双方。' },
      { type: 'branch', title: '派系抉择', region: 'mine', text: '根据所选路线，决定是战斗压制、安抚救助还是迁移修复。' },
      { type: 'puzzle', title: '巢穴修复', region: 'nest', text: '土遁忍术/土系精灵修复裂缝；玄岩宗改建矿道；御灵谷安抚头领。', fusionHints: { jutsu: 'EARTH', sectEco: ['defense', 'heal'], general: 'zhao_yun' }, varDelta: { rhinoTrust: 10, mineStability: 8, ecoValue: 8 } },
      { type: 'battle', title: '被盗的精灵蛋', region: 'black_market', enemyName: '黑市精英', pool: [94, 132, 199], lvl: [44, 52], count: 3, objective: 'capture_alive', varDelta: { blackMarket: -25, rhinoTrust: 10 }, fusionHints: { jutsu: 'DARK', sectEco: ['defense'], general: 'zhao_yun' } },
      { type: 'explore', title: '沙场残魂', region: 'ancient_ruins', text: '古战残垣演武：保护撤退、利用地形阻挡追兵。可获得赵云/诸葛亮将魂碎片线索。', varDelta: { kwArsenal: 8 }, fusionHints: { general: 'zhuge_liang' } },
      { type: 'puzzle', title: '沙化与重力', region: 'fruit_garden', text: '恶魔果实残园三试炼：沙化地形、屏障防守、重力回廊。获得沙化/重力果实线索（非完整果实）。', varDelta: { relicAwakening: 5, ecoValue: 5 }, fusionHints: { fruit: 'eco' } },
      { type: 'battle', title: '矿场头领', region: 'mine', enemyName: '岩甲犀王', bossKey: 'rock_rhino_king', bossId: 190, lvl: 52, drop: 8000, objective: 'protect', objectiveTurns: 8 },
      { type: 'explore', title: '砂核遗迹入口', region: 'relic_core', text: '封印大厅、重力核心与砂核中枢。星机阁/封印忍术可削弱 Boss 蓄力。', varDelta: { relicAwakening: 5 }, fusionHints: { sectEco: ['puzzle'], jutsu: 'LIGHT' } },
      { type: 'boss', title: '砂核巨像', region: 'relic_core', enemyName: '砂核巨像', bossKey: 'sand_core_golem', bossId: 190, lvl: 54, drop: 10000, objective: 'purify', fusionBoss: true },
    ],
    reward: { gold: 8000, item: 'fire_stone', itemCount: 1 },
    ecologyReward: { stability: 20, pollution: -10 },
  },
  {
    id: 'crisis_ghost_mist',
    name: '鬼雾山夜行',
    mapId: 2,
    icon: '🌫️',
    reqBadges: 6,
    color: '#4A148C',
    summary: '雾隐村夜晚精灵失踪。白天调查、黄昏布防、夜晚斩鬼——验证呼吸法、夜战、鬼化净化与门派分歧。',
    fusionChapter: true,
    crossSystemChapter: true,
    fusionSystems: ['breathing', 'jutsu', 'sect', 'kingdom'],
    routeStep: 5,
    branches: ['fight', 'soothe', 'heal'],
    branchPrompt: '发现鬼化精灵原本在保护幼体。你选择击杀、安抚还是净化？',
    routes: [
      { id: 'purify_path', name: '净化路线', difficulty: 'hard', ecoDelta: { spirit: 15, pollution: -15 }, reqTypes: ['FAIRY', 'LIGHT'], varDelta: { ghostPollution: -15, lightCoverage: 15, villagerMorale: 10 } },
      { id: 'soothe_path', name: '安抚路线', difficulty: 'medium', ecoDelta: { stability: 20, diversity: 10 }, reqTypes: ['FAIRY', 'NORMAL'], varDelta: { villagerMorale: 20, sectTension: -10, ghostPollution: -5 } },
      { id: 'shadow_path', name: '影月路线', difficulty: 'medium', ecoDelta: { spirit: 10, stability: -5 }, reqTypes: ['DARK', 'GHOST'], varDelta: { nightIntensity: 15, ghostPollution: 10, sectTension: 15 } },
    ],
    bossModifiers: [
      { condition: 'branch:heal', effect: 'bossMult:0.82, skipMechanic:blood_mist' },
      { condition: 'branch:soothe', effect: 'bossMult:0.88, objective:capture_alive' },
      { condition: 'route:purify_path', effect: 'bossMult:0.9' },
    ],
    endings: [
      { id: 'seal_end', conditions: ['route:purify_path'], narrative: '封印鬼核，村庄恢复平静，但灵气略降。', ecoDelta: { spirit: -5, stability: 15 }, rewards: { gold: 9000 } },
      { id: 'soothe_end', conditions: ['route:soothe_path'], narrative: '安抚鬼化精灵，幼体获救，御灵谷声望上升。', ecoDelta: { stability: 25, diversity: 12 }, rewards: { gold: 7000, title: '雾隐守护者' }, unlocks: ['bond_mist_spirit'] },
      { id: 'best_purify', conditions: ['route:purify_path'], narrative: '完整净化鬼雾山，光源永驻，解锁呼吸法残卷与国战夜巡。', ecoDelta: { spirit: 20, pollution: -20, stability: 20 }, rewards: { gold: 11000, title: '斩鬼行者' }, unlocks: ['kw_night_patrol', 'breathing_unlock', 'bond_mist_spirit'] },
      { id: 'dark_purge', conditions: ['route:shadow_path', 'branch:fight'], narrative: '影月教吞噬鬼血，短期战力提升，但鬼化污染残留。', ecoDelta: { pollution: 12, spirit: 15 }, rewards: { gold: 12000, title: '鬼血猎手' }, unlocks: ['fruit_clue_shadow'] },
    ],
    steps: [
      { type: 'explore', title: '白天调查', region: 'village', text: '村民说夜晚有精灵失踪。找脚印、血迹与破碎鳞片。感知忍术/感知精灵可加速。', varDelta: { villagerMorale: -5, ghostPollution: 5 }, fusionHints: { jutsu: 'WIND', breathing: 'mist' } },
      { type: 'puzzle', title: '线索拼凑', region: 'trail', text: '足迹通向鬼雾山。小型精灵可走隐蔽小径。', varDelta: { ghostPollution: 8 }, fusionHints: { reqTags: ['small'] } },
      { type: 'explore', title: '黄昏布防', region: 'shrine', text: '在神社布置光源与结界。玄岩宗筑阵、沧海阁供水、封印术稳定结界。', varDelta: { lightCoverage: 20, borderSecurity: 10 }, fusionHints: { jutsu: 'LIGHT', sectEco: ['defense', 'heal'] } },
      { type: 'battle', title: '夜袭防守', region: 'village', enemyName: '鬼化精灵', pool: [94, 132, 199], lvl: [44, 52], count: 3, objective: 'protect', objectiveTurns: 8, nightBattle: true, varDelta: { nightIntensity: 15, villagerMorale: 5 }, fusionHints: { breathing: 'water', general: 'hua_tuo' } },
      { type: 'explore', title: '夜晚追踪', region: 'mist_peak', text: '鬼化精灵在保护幼体。霞之呼吸/影月教/暗系精灵各有优势。', varDelta: { ghostPollution: 10, sectTension: 5 }, fusionHints: { breathing: 'mist', sectEco: ['control'] } },
      { type: 'route', title: '路线抉择', region: 'shrine', text: '选择净化、安抚或影月吞噬路线。' },
      { type: 'branch', title: '处理方式', region: 'mist_peak', text: '面对鬼化源头，战斗压制、安抚救助还是净化封印？' },
      { type: 'puzzle', title: '光源大阵', region: 'shrine', text: '光系精灵+封印术+水之呼吸稳定鬼血。提升 lightCoverage 可削弱 Boss。', varDelta: { lightCoverage: 15, ghostPollution: -10 }, fusionHints: { jutsu: 'LIGHT', breathing: 'water' } },
      { type: 'battle', title: '血鬼试炼', region: 'mist_peak', enemyName: '鬼化兽群', pool: [94, 132, 199], lvl: [48, 56], count: 3, objective: 'purify', nightBattle: true, varDelta: { ghostPollution: -8 }, fusionHints: { breathing: 'fire', general: 'guan_yu' } },
      { type: 'explore', title: '真相反转', region: 'mist_peak', text: '鬼化精灵是在保护被黑市污染的幼体。御灵谷与影月教观点冲突升温。', varDelta: { sectTension: 10, villagerMorale: 10 } },
      { type: 'battle', title: '雾隐鬼将', region: 'oni_lair', enemyName: '雾隐鬼将', bossKey: 'mist_oni', bossId: 208, lvl: 58, drop: 9000, objective: 'purify', nightBattle: true },
      { type: 'boss', title: '血鬼术·雾隐', region: 'oni_lair', enemyName: '雾隐之鬼', bossKey: 'mist_oni_final', bossId: 236, lvl: 62, drop: 12000, objective: 'purify', fusionBoss: true, nightBattle: true },
    ],
    reward: { gold: 8000, item: 'hyper_potion', itemCount: 5 },
    ecologyReward: { spirit: 15, stability: 12, pollution: -10 },
  },
  {
    id: 'crisis_stellar_aurora',
    name: '星陨极光异常',
    mapId: 106,
    icon: '🌌',
    reqBadges: 9,
    color: '#7B1FA2',
    summary: '星落平原极光失控，灵脉被破坏，冰系与超能系精灵行为异常。',
    branches: ['fight', 'heal', 'soothe'],
    branchPrompt: '极光源于古代灵脉泄漏。你打算封印、净化还是引导？',
    routes: [
      { id: 'seal', name: '封印源头', difficulty: 'medium', ecoDelta: { spirit: -5, stability: 15 }, reqTypes: ['PSYCHIC', 'DARK'] },
      { id: 'purify_route', name: '净化恢复', difficulty: 'hard', ecoDelta: { spirit: 20, pollution: -15 }, reqTypes: ['FAIRY', 'ICE'] },
      { id: 'guide', name: '引导转化', difficulty: 'hard', ecoDelta: { spirit: 25, diversity: 10 }, reqTypes: ['PSYCHIC', 'FAIRY'] },
    ],
    bossModifiers: [
      { condition: 'branch:heal', effect: 'bossMult:0.85, skipMechanic:gravity_field' },
      { condition: 'route:purify_route', effect: 'bossMult:0.8, ecoBonus:spirit+10' },
    ],
    endings: [
      { id: 'sealed', conditions: ['route:seal'], narrative: '灵脉被封印，极光停止但灵气略降。', ecoDelta: { spirit: -5, stability: 20 }, rewards: { gold: 15000 } },
      { id: 'restored', conditions: ['route:purify_route'], narrative: '灵脉净化恢复，星落平原进入稳定期。', ecoDelta: { spirit: 25, pollution: -20, stability: 15 }, rewards: { gold: 18000, title: '星陨守护者' } },
      { id: 'transformed', conditions: ['route:guide'], narrative: '极光被引导为有益能量，稀有精灵大量出现。', ecoDelta: { spirit: 30, diversity: 20 }, rewards: { gold: 20000, title: '极光引导者' } },
    ],
    steps: [
      { type: 'explore', title: '极光观测', text: '极光频率与地下震动同步，冰系精灵集体朝向震源低鸣。' },
      { type: 'battle', title: '狂乱精灵', enemyName: '极光狂化群', pool: [86, 87, 91, 144, 199], lvl: [88, 96], count: 4 },
      { type: 'puzzle', title: '灵脉追踪', text: '感知型精灵追踪灵脉至古代星核祭坛，需按星轨顺序激活石柱。' },
      { type: 'branch', title: '选择对策' },
      { type: 'battle', title: '陨星巨鲸', enemyName: '陨星巨鲸', bossKey: 'stellar_whale', bossId: 350, lvl: 98, drop: 15000, objective: 'escape', objectiveTurns: 12 },
    ],
    reward: { gold: 15000, item: 'ice_stone', itemCount: 2 },
    ecologyReward: { spirit: 20, stability: 15, diversity: 10 },
  },
  {
    id: 'crisis_seal_war',
    name: '忍界封印战',
    mapId: 3,
    icon: '⛩️',
    reqBadges: 9,
    color: '#1565C0',
    summary: '古代工厂深层封印松动，尾兽级灾厄精灵苏醒。查克拉节点、分身解谜、封印大阵与国家协作。',
    fusionChapter: true,
    crossSystemChapter: true,
    fusionSystems: ['jutsu', 'sect', 'general', 'kingdom'],
    routeStep: 5,
    branches: ['fight', 'soothe', 'heal'],
    branchPrompt: '灾厄核心即将冲破国土结界。你选择全力封印、削弱再封，还是协调国家资源？',
    routes: [
      { id: 'full_seal', name: '全力封印', difficulty: 'hard', ecoDelta: { spirit: 10, stability: 15 }, reqTypes: ['PSYCHIC', 'FAIRY'], varDelta: { sealIntegrity: 20, chakraReserve: -10, calamityPower: -5 } },
      { id: 'weaken_first', name: '削弱再封', difficulty: 'medium', ecoDelta: { stability: 10, pollution: 5 }, reqTypes: ['FIGHT', 'FIRE'], varDelta: { calamityPower: -15, civilianSafety: -5, chakraReserve: 5 } },
      { id: 'nation_coord', name: '国家协调', difficulty: 'medium', ecoDelta: { stability: 20 }, reqTypes: ['STEEL', 'GROUND'], varDelta: { nationCoord: 20, relicDecode: 10, sealIntegrity: 5 } },
    ],
    bossModifiers: [
      { condition: 'branch:heal', effect: 'bossMult:0.82, skipMechanic:tail_flame' },
      { condition: 'branch:soothe', effect: 'bossMult:0.88, objective:capture_alive' },
      { condition: 'route:full_seal', effect: 'bossMult:0.9' },
      { condition: 'route:nation_coord', effect: 'bossMult:0.92' },
    ],
    endings: [
      { id: 'containment', conditions: ['route:full_seal'], narrative: '封印成功，但灵气泄漏，古代工厂区域灵力略降。', ecoDelta: { spirit: -8, stability: 20 }, rewards: { gold: 12000 }, unlocks: ['seal_materials'] },
      { id: 'capture_core', conditions: ['route:weaken_first', 'branch:soothe'], narrative: '削弱灾厄核心后收服幼体，转化为可结契的特殊精灵。', ecoDelta: { stability: 25, diversity: 15 }, rewards: { gold: 10000, title: '灾厄驯服者' }, unlocks: ['bond_calamity_spirit'] },
      { id: 'perfect_seal', conditions: ['route:full_seal'], narrative: '完美封印，灾厄化为国家守护，查克拉节点永固。', ecoDelta: { spirit: 15, pollution: -15, stability: 25 }, rewards: { gold: 15000, title: '封印大师' }, unlocks: ['advanced_jutsu_unlock', 'kw_seal_guardian', 'bond_calamity_spirit'] },
      { id: 'break_free', conditions: ['route:weaken_first', 'branch:fight'], narrative: '灾厄冲破封印，国土灵灾升级，需全国动员。', ecoDelta: { pollution: 15, spirit: 20, stability: -15 }, rewards: { gold: 13000, title: '灾厄见证者' }, unlocks: ['calamity_escalation'] },
    ],
    steps: [
      { type: 'explore', title: '封印异常报告', region: 'outer_gate', text: '古代工厂深层传来查克拉波动，结界出现裂纹。感知忍术/星机阁可定位泄漏点。', varDelta: { calamityPower: 5, civilianSafety: -5 }, fusionHints: { jutsu: 'WIND', sectEco: ['puzzle'] } },
      { type: 'explore', title: '查克拉节点调查', region: 'chakra_well', text: '古井查克拉节点部分失效。水/超能系精灵可激活节点，恢复储备。', varDelta: { chakraReserve: 15, relicDecode: 5 }, fusionHints: { jutsu: 'WATER', general: 'zhuge_liang' } },
      { type: 'puzzle', title: '分身大厅解谜', region: 'clone_hall', text: '古代机关需分身忍术或暗系/小型精灵同时触发多个开关。', varDelta: { relicDecode: 10, sealIntegrity: 5 }, fusionHints: { jutsu: 'DARK', reqTags: ['small'] } },
      { type: 'explore', title: '遗迹研究室', region: 'relic_lab', text: '星机阁解读古代封印文献，发现灾厄曾为国家守护精灵。', varDelta: { relicDecode: 15, nationCoord: 5 }, fusionHints: { sectEco: ['puzzle'], general: 'zhuge_liang' } },
      { type: 'battle', title: '灾厄爪牙', region: 'chakra_well', enemyName: '封印暴走兽', pool: [43, 88, 117], lvl: [72, 80], count: 3, objective: 'purify', varDelta: { calamityPower: 8, chakraReserve: -5 }, fusionHints: { jutsu: 'LIGHT' } },
      { type: 'route', title: '路线抉择', region: 'seal_array', text: '封印大阵即将崩溃。选择全力封印、削弱再封，或协调国家资源。' },
      { type: 'branch', title: '封印策略', region: 'seal_array', text: '面对灾厄核心，战斗压制、安抚收服还是生态修复封印？' },
      { type: 'puzzle', title: '封印柱激活', region: 'seal_array', text: '按火→水→风→土顺序激活四根封印柱。错误顺序会召唤守卫。', varDelta: { sealIntegrity: 15, chakraReserve: -8 }, fusionHints: { jutsu: 'FIRE', sectEco: ['defense'] } },
      { type: 'explore', title: '国家协调', region: 'outer_gate', text: '兵家府布阵、玄岩宗筑城、御灵谷疏散居民。提升国家协调与居民安全。', varDelta: { nationCoord: 15, civilianSafety: 10 }, fusionHints: { general: 'zhuge_liang', sectEco: ['defense', 'heal'] } },
      { type: 'battle', title: '破尾阶段', region: 'core_chamber', enemyName: '灾厄尾兽', pool: [117, 190, 199], lvl: [78, 86], count: 2, objective: 'purify', varDelta: { calamityPower: -10, sealIntegrity: 5 }, fusionHints: { jutsu: 'FIRE', general: 'guan_yu' } },
      { type: 'puzzle', title: '查克拉节点共鸣', region: 'chakra_well', text: '五处查克拉节点需同时激活。分身术/多属性精灵可加速。', varDelta: { chakraReserve: 20, sealIntegrity: 10 }, fusionHints: { jutsu: 'WATER', reqTags: ['spirit'] } },
      { type: 'battle', title: '压制暴走核心', region: 'core_chamber', enemyName: '暴走核心兽', pool: [88, 117, 199], lvl: [82, 90], count: 3, objective: 'purify', varDelta: { calamityPower: -8 }, fusionHints: { jutsu: 'LIGHT', general: 'hua_tuo' } },
      { type: 'explore', title: '真相反转', region: 'core_chamber', text: '灾厄本是古代守护国土的精灵，因黑市注入恶魔果实能量而暴走。', varDelta: { relicDecode: 10, nationCoord: 5 } },
      { type: 'boss', title: '尾兽级灾厄', region: 'core_chamber', enemyName: '尾兽级灾厄', bossKey: 'tailed_calamity', bossId: 149, lvl: 92, drop: 15000, objective: 'purify', fusionBoss: true },
    ],
    reward: { gold: 12000, item: 'hyper_potion', itemCount: 5 },
    ecologyReward: { spirit: 12, stability: 18, pollution: -8 },
  },
];

export function getEcoCrisisByMapId(mapId, clearedCrises = [], badges = 99) {
  const crises = ECO_CRISES.filter(c => c.mapId === mapId && badges >= (c.reqBadges || 0)).sort((a, b) => a.reqBadges - b.reqBadges);
  return crises.find(c => !clearedCrises.includes(c.id)) || null;
}

export function isMapEcoRestored(mapId, clearedCrises = []) {
  const crises = ECO_CRISES.filter(c => c.mapId === mapId);
  return crises.length > 0 && crises.every(c => clearedCrises.includes(c.id));
}

export function parseBossRouteModifiers(crisis, branchId, routeId, branchMult = 1) {
  let bossMult = branchMult;
  const skipMechanics = [];
  let objectiveOverride = null;
  let spawnAdds = 0;
  let ecoPenalty = null;
  (crisis?.bossModifiers || []).forEach(mod => {
    const cond = mod.condition || '';
    const [kind, val] = cond.split(':');
    const matched = (kind === 'branch' && branchId === val) || (kind === 'route' && routeId === val);
    if (!matched) return;
    (mod.effect || '').split(',').forEach(part => {
      const sep = part.indexOf(':');
      const k = sep >= 0 ? part.slice(0, sep).trim() : part.trim();
      const v = sep >= 0 ? part.slice(sep + 1).trim() : '';
      if (k === 'bossMult') bossMult *= parseFloat(v) || 1;
      if (k === 'skipMechanic') skipMechanics.push(v.trim());
      if (k === 'objective') objectiveOverride = v.trim();
      if (k === 'spawnAdds') spawnAdds += parseInt(v, 10) || 0;
      if (k === 'ecoPenalty') ecoPenalty = v;
    });
  });
  bossMult = Math.max(0.75, Math.min(1.3, bossMult));
  return { bossMult, skipMechanics, objectiveOverride, spawnAdds, ecoPenalty };
}

export function checkRouteRequirements(route, party) {
  if (!route?.reqTypes) return { ok: true };
  const hasType = (party || []).some(p => {
    const types = [p.type, p.secondaryType, p.type2].filter(Boolean);
    return route.reqTypes.some(t => types.includes(t));
  });
  return { ok: hasType, reqTypes: route.reqTypes };
}

export function getEcoCrisisById(id) {
  return ECO_CRISES.find(c => c.id === id);
}

export function getMoralBranch(branchId) {
  return MORAL_BRANCHES[branchId] || null;
}

export function checkBranchRequirements(branchId, party) {
  const br = MORAL_BRANCHES[branchId];
  if (!br?.reqTypes) return { ok: true };
  const hasType = (party || []).some(p => {
    const types = [p.type, p.secondaryType, p.type2].filter(Boolean);
    return br.reqTypes.some(t => types.includes(t));
  });
  return { ok: hasType, reqTypes: br.reqTypes };
}

export function getEcoFeedbackMessage(crisis, ecoDelta) {
  if (!crisis || !ecoDelta) return null;
  const msgs = [];
  if (ecoDelta.vegetation > 10) msgs.push(`${crisis.name}区域植被开始恢复，新的嫩芽正在生长。`);
  if (ecoDelta.vegetation < -5) msgs.push(`${crisis.name}区域植被受损，部分植物枯萎。`);
  if (ecoDelta.pollution < -10) msgs.push(`${crisis.name}区域污染大幅降低，空气变得清新。`);
  if (ecoDelta.pollution > 10) msgs.push(`${crisis.name}区域污染加剧，部分精灵开始不安。`);
  if (ecoDelta.stability > 15) msgs.push(`${crisis.name}区域安定度提升，NPC们恢复了日常。`);
  if (ecoDelta.stability < -10) msgs.push(`${crisis.name}区域局势不稳，居民们感到不安。`);
  if (ecoDelta.spirit > 10) msgs.push(`${crisis.name}区域灵气浓度上升，隐约可见新的精灵影踪。`);
  if (ecoDelta.water > 10) msgs.push(`${crisis.name}区域水源恢复，水系精灵重新出没。`);
  if (ecoDelta.diversity > 10) msgs.push(`${crisis.name}区域生物多样性增加，新物种出现。`);
  return msgs.length ? msgs : null;
}
