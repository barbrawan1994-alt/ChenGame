// ==========================================
// [重构] 全属性技能库 (每系 8-10 个，含威力与PP)
// Total: ~421 skills
// ==========================================
const SKILL_DB = {
  NORMAL: [
    { name: '撞击', p: 40, pp: 35, desc: '用身体猛撞对手的基本攻击' },
    { name: '电光一闪', p: 40, pp: 30, priority: 1, desc: '以极快速度冲击，必定先制' },
    { name: '劈开', p: 70, pp: 20, desc: '用尖锐的爪子劈砍对手' },
    { name: '必杀门牙', p: 80, pp: 15, desc: '用锋利的门牙狠狠咬住对手' },
    { name: '猛撞', p: 90, pp: 20, desc: '拼命猛撞，自身也受到反伤' },
    { name: '巨声', p: 90, pp: 10, desc: '释放巨大声波冲击对手' },
    { name: '舍身冲撞', p: 120, pp: 15, desc: '不顾一切的猛烈冲撞，附带反伤' },
    { name: '破坏死光', p: 150, pp: 5, desc: '释放强烈光束，下回合需蓄力' },
    { name: '终极冲击', p: 150, pp: 5, desc: '全力冲撞，下回合需休息' },
    { name: '大爆炸', p: 200, pp: 1, desc: '引发大爆炸，自身濒死' }
  ],
  FIRE: [
    { name: '火花', p: 40, pp: 25, desc: '喷出小火焰攻击对手' },
    { name: '火焰轮', p: 60, pp: 25, desc: '裹着火焰高速旋转冲撞' },
    { name: '火焰拳', p: 75, pp: 15, desc: '带着火焰的拳击，可能造成灼伤' },
    { name: '喷射火焰', p: 90, pp: 15, desc: '吐出灼热火焰喷射对手' },
    { name: '热风', p: 95, pp: 10, desc: '吐出灼热气息攻击，可能灼伤' },
    { name: '大字爆炎', p: 110, pp: 5, desc: '释放大字形烈焰包围对手' },
    { name: '闪焰冲锋', p: 120, pp: 15, desc: '被火焰包裹猛烈冲锋，附带反伤' },
    { name: '过热', p: 130, pp: 5, desc: '全力释放火焰，之后特攻下降' },
    { name: '爆裂燃烧', p: 150, pp: 5, desc: '超高温爆裂燃烧一切' },
    { name: 'V热焰', p: 150, pp: 5, desc: '以超极温火焰焚尽一切的究极招式，使用后特攻降低' }
  ],
  WATER: [
    { name: '水枪', p: 40, pp: 25, desc: '喷出水柱攻击对手' },
    { name: '泡沫光线', p: 65, pp: 20, desc: '发射泡沫光线，可能降速' },
    { name: '水流裂破', p: 85, pp: 10, desc: '用高压水刀切裂对手' },
    { name: '冲浪', p: 90, pp: 15, desc: '掀起巨浪冲击全场' },
    { name: '浊流', p: 90, pp: 10, desc: '用混浊的水流攻击，降低命中' },
    { name: '水炮', p: 110, pp: 5, desc: '喷射强力水柱猛烈轰击' },
    { name: '高压水泵', p: 110, pp: 5, desc: '高压水流直射贯穿对手' },
    { name: '海啸', p: 120, pp: 5, desc: '掀起滔天巨浪吞没对手' },
    { name: '加农水炮', p: 150, pp: 5, desc: '发射超级水炮，威力极大' },
    { name: '根源波动', p: 110, pp: 10, desc: '海之王者的专属波动攻击' }
  ],
  GRASS: [
    { name: '藤鞭', p: 45, pp: 25, desc: '用细长藤蔓抽打对手' },
    { name: '飞叶快刀', p: 55, pp: 25, desc: '飞射锋利叶片切割对手' },
    { name: '终极吸取', p: 75, pp: 10, desc: '吸取对手体力回复自身HP' },
    { name: '能量球', p: 90, pp: 10, desc: '凝聚自然能量发射球体' },
    { name: '种子炸弹', p: 80, pp: 15, desc: '散射坚硬种子轰击对手' },
    { name: '花瓣舞', p: 120, pp: 10, desc: '撒出花瓣持续攻击，之后混乱' },
    { name: '日光束', p: 120, pp: 10, desc: '汇聚太阳光射出光线，需蓄力' },
    { name: '木槌', p: 120, pp: 15, desc: '用坚硬身体猛击，附带反伤' },
    { name: '飞叶风暴', p: 130, pp: 5, desc: '用锋利树叶卷起风暴攻击' },
    { name: '疯狂植物', p: 150, pp: 5, desc: '召唤巨大树根猛击，需休息' }
  ],
  ELECTRIC: [
    { name: '电击', p: 40, pp: 30, desc: '放出微弱电流攻击对手' },
    { name: '电球', p: 60, pp: 20, desc: '投掷电气球体轰击' },
    { name: '雷电拳', p: 75, pp: 15, desc: '带电的拳击，可能使对手麻痹' },
    { name: '放电', p: 80, pp: 15, desc: '向周围释放强烈电击' },
    { name: '十万伏特', p: 90, pp: 15, desc: '释放强力电击猛烈攻击' },
    { name: '打雷', p: 110, pp: 10, desc: '召唤雷电劈下，可能麻痹' },
    { name: '伏特攻击', p: 120, pp: 15, desc: '裹着电流猛冲，附带反伤' },
    { name: '电磁炮', p: 120, pp: 5, desc: '发射电磁加速炮弹轰击' },
    { name: '雷击', p: 130, pp: 5, desc: '从天空降下雷击打击对手' },
    { name: '千万伏特', p: 160, pp: 1, desc: '皮卡丘的究极电击招式，需蓄力' }
  ],
  ICE: [
    { name: '冰砾', p: 40, pp: 30, desc: '投掷冰块攻击对手' },
    { name: '冰冻牙', p: 65, pp: 15, desc: '用冰冻的牙齿咬击，可能冰冻' },
    { name: '极光束', p: 65, pp: 20, desc: '释放极光束攻击对手' },
    { name: '冰柱坠击', p: 85, pp: 10, desc: '让冰柱从天而降砸击对手' },
    { name: '急冻光线', p: 90, pp: 10, desc: '发射冰冻光线，可能冰冻对手' },
    { name: '冰锤', p: 100, pp: 10, desc: '挥舞巨大冰锤猛砸' },
    { name: '暴风雪', p: 110, pp: 5, desc: '掀起猛烈暴风雪，可能冰冻' },
    { name: '冰封世界', p: 120, pp: 5, desc: '将周围冻结的极寒攻击' },
    { name: '绝对零度', p: 200, pp: 1, acc: 30, desc: '释放绝对零度冷气，命中率极低但一击必杀' }
  ],
  FIGHT: [
    { name: '碎岩', p: 40, pp: 15, desc: '用拳头碎裂岩石般攻击' },
    { name: '发劲', p: 60, pp: 10, desc: '集中气力发出掌击' },
    { name: '劈瓦', p: 75, pp: 15, desc: '用手刀劈碎瓦片般攻击' },
    { name: '波导弹', p: 80, pp: 20, alwaysHit: true, desc: '发射波导力量追踪对手，必中' },
    { name: '流星拳', p: 90, pp: 10, desc: '如流星般高速连续出拳' },
    { name: '爆裂拳', p: 100, pp: 5, desc: '蓄力的重拳，可能混乱对手' },
    { name: '近身战', p: 120, pp: 5, desc: '贴身搏击，自身防御下降' },
    { name: '真气弹', p: 120, pp: 5, acc: 70, desc: '发射气功波攻击，命中率稍低' },
    { name: '真气拳', p: 150, pp: 5, acc: 90, desc: '集中全身气力的致命一拳，命中率稍低' }
  ],
  POISON: [
    { name: '溶解液', p: 40, pp: 30, desc: '喷出腐蚀液体攻击对手' },
    { name: '毒液冲击', p: 65, pp: 10, desc: '用毒液猛烈冲击对手' },
    { name: '十字毒刃', p: 70, pp: 20, desc: '用毒爪交叉切割，高暴击率' },
    { name: '毒击', p: 80, pp: 20, desc: '用含毒的身体撞击对手' },
    { name: '污泥炸弹', p: 90, pp: 10, desc: '投掷毒泥炸弹爆炸攻击' },
    { name: '污泥波', p: 95, pp: 10, desc: '掀起毒泥波浪冲击' },
    { name: '垃圾射击', p: 120, pp: 5, desc: '发射垃圾弹猛击，可能中毒' },
    { name: '无极光束', p: 160, pp: 5, desc: '无极汰那的专属毒属性光线' }
  ],
  GROUND: [
    { name: '泥巴射击', p: 55, pp: 15, desc: '射出泥巴攻击，降低对手速度' },
    { name: '重踏', p: 60, pp: 20, desc: '用力踩踏大地震动攻击' },
    { name: '挖洞', p: 80, pp: 10, desc: '钻入地下后从下方突袭' },
    { name: '大地之力', p: 90, pp: 10, desc: '释放大地之力从地面攻击' },
    { name: '十万马力', p: 95, pp: 10, desc: '用全力践踏对手' },
    { name: '地震', p: 100, pp: 10, desc: '引发地震攻击周围所有目标' },
    { name: '断崖之剑', p: 120, pp: 10, desc: '大地之王的断崖攻击' },
    { name: '地裂', p: 200, pp: 1, acc: 30, desc: '使大地裂开将对手吞噬，命中率极低' }
  ],
  FLYING: [
    { name: '起风', p: 40, pp: 35, desc: '扇动翅膀掀起狂风攻击' },
    { name: '燕返', p: 60, pp: 20, alwaysHit: true, desc: '以迅捷身法斩击，必定命中' },
    { name: '空气斩', p: 75, pp: 15, desc: '用锋利的空气刃切割对手' },
    { name: '钻孔啄', p: 80, pp: 20, desc: '旋转飞行钻击对手' },
    { name: '飞翔', p: 90, pp: 15, desc: '飞上高空后俯冲攻击' },
    { name: '暴风·天空', p: 110, pp: 10, desc: '掀起猛烈暴风攻击，可能混乱' },
    { name: '勇鸟猛攻', p: 120, pp: 15, desc: '勇敢地猛冲，附带反伤' },
    { name: '神鸟特攻', p: 140, pp: 5, desc: '蓄力后发动的究极飞行攻击' },
    { name: '画龙点睛', p: 120, pp: 5, desc: '全力一击后自身能力下降' }
  ],
  PSYCHIC: [
    { name: '念力', p: 50, pp: 25, desc: '用念力攻击对手' },
    { name: '幻象光线', p: 65, pp: 20, desc: '发射幻象光线，可能混乱' },
    { name: '精神利刃', p: 70, pp: 20, desc: '用意念凝聚刀刃切割' },
    { name: '意念头锤', p: 80, pp: 15, desc: '集中精神力量头锤攻击' },
    { name: '精神强念', p: 90, pp: 10, desc: '释放强烈精神力量攻击' },
    { name: '食梦', p: 100, pp: 15, desc: '吃掉睡眠对手的梦回复HP' },
    { name: '精神击破', p: 100, pp: 10, desc: '用精神力量击破对手意志' },
    { name: '预知未来', p: 120, pp: 10, desc: '预见未来的攻击将在稍后命中' },
    { name: '棱镜镭射', p: 160, pp: 10, desc: '发射棱镜光线的究极精神攻击' }
  ],
  BUG: [
    { name: '连斩', p: 40, pp: 20, desc: '连续斩击越打越强' },
    { name: '虫咬', p: 60, pp: 20, desc: '用锐利虫牙咬击对手' },
    { name: '银色旋风', p: 60, pp: 5, desc: '卷起银色旋风，可能全属性提升' },
    { name: '十字剪', p: 80, pp: 15, desc: '用镰刀般的爪交叉切割' },
    { name: '吸血', p: 80, pp: 10, desc: '吸取对手体力回复自身' },
    { name: '虫鸣', p: 90, pp: 10, desc: '发出强烈虫鸣声波攻击' },
    { name: '迎头一击', p: 90, pp: 10, desc: '用坚硬头部迎面撞击' },
    { name: '大角撞击', p: 120, pp: 10, desc: '用巨大角猛烈撞击对手' }
  ],
  ROCK: [
    { name: '落石', p: 50, pp: 15, desc: '让岩石从上方落下攻击' },
    { name: '原始之力', p: 60, pp: 5, desc: '释放原始力量，可能全属性提升' },
    { name: '岩崩', p: 75, pp: 10, desc: '掀起岩石崩塌攻击对手' },
    { name: '力量宝石', p: 80, pp: 20, desc: '发射宝石之力攻击' },
    { name: '尖石攻击', p: 100, pp: 5, desc: '用尖锐岩石猛刺对手' },
    { name: '钻石风暴', p: 100, pp: 5, desc: '掀起钻石风暴攻击' },
    { name: '流星光束', p: 120, pp: 10, desc: '蓄力后发射流星般光束' },
    { name: '岩石炮', p: 150, pp: 5, desc: '发射巨大岩石炮弹轰击' },
    { name: '双刃头锤', p: 150, pp: 5, desc: '用坚硬头部猛撞，附带反伤' }
  ],
  GHOST: [
    { name: '惊吓', p: 30, pp: 15, desc: '突然出现吓唬对手' },
    { name: '影子偷袭', p: 40, pp: 30, priority: 1, desc: '从影子中突然袭击，必定先制' },
    { name: '暗影拳', p: 60, pp: 20, alwaysHit: true, desc: '用幽灵之拳必定命中' },
    { name: '暗影爪', p: 70, pp: 15, desc: '用幽灵利爪抓击，高暴击率' },
    { name: '暗影球', p: 80, pp: 15, desc: '投掷灵魂球体攻击，可能降特防' },
    { name: '潜灵奇袭', p: 90, pp: 10, desc: '潜入灵界后奇袭对手' },
    { name: '暗影潜袭', p: 120, pp: 5, desc: '从暗影中发动致命突袭' },
    { name: '幽冥噩梦', p: 140, pp: 3, desc: '将对手拉入无尽噩梦的灵魂攻击' },
    { name: '冥界之门', p: 160, pp: 3, desc: '打开冥界之门释放幽灵大军' },
    { name: '星碎', p: 120, pp: 5, desc: '粉碎星辰之力的专属幽灵攻击' }
  ],
  DRAGON: [
    { name: '龙息', p: 60, pp: 20, desc: '吐出龙之气息攻击对手' },
    { name: '龙爪', p: 80, pp: 15, desc: '用锋利的龙爪撕裂对手' },
    { name: '龙之波动', p: 85, pp: 10, desc: '释放龙之波动冲击' },
    { name: '龙之俯冲', p: 100, pp: 10, desc: '从天空俯冲以龙之力量攻击' },
    { name: '亚空裂斩', p: 100, pp: 5, desc: '切裂空间的强力斩击' },
    { name: '巨兽斩', p: 100, pp: 5, desc: '传说之剑的强力斩击' },
    { name: '逆鳞', p: 120, pp: 10, desc: '暴怒连续攻击，之后陷入混乱' },
    { name: '流星群', p: 130, pp: 5, desc: '召唤流星群轰击，之后特攻下降' },
    { name: '时光咆哮', p: 150, pp: 5, desc: '扭曲时空的咆哮攻击，需休息' }
  ],
  STEEL: [
    { name: '子弹拳', p: 40, pp: 30, priority: 1, desc: '如子弹般的拳击，必定先制' },
    { name: '金属爪', p: 50, pp: 35, desc: '用钢铁利爪抓击对手' },
    { name: '镜光射击', p: 65, pp: 10, desc: '发射镜面反射光束攻击' },
    { name: '钢翼', p: 70, pp: 25, desc: '用钢铁翅膀切击对手' },
    { name: '铁头', p: 80, pp: 15, desc: '用钢铁头部猛撞对手' },
    { name: '彗星拳', p: 90, pp: 10, desc: '像彗星一样的钢铁拳击' },
    { name: '铁尾', p: 100, pp: 15, desc: '用钢铁尾巴猛击对手' },
    { name: '巨兽弹', p: 100, pp: 5, desc: '传说之盾的强力弹击' },
    { name: '破灭之愿', p: 140, pp: 5, desc: '许下破灭之愿后攻击降临' }
  ],
  FAIRY: [
    { name: '妖精之风', p: 40, pp: 30, desc: '释放妖精之风攻击对手' },
    { name: '魅惑之声', p: 40, pp: 15, desc: '发出魅惑的声音攻击' },
    { name: '吸取之吻', p: 50, pp: 10, desc: '吻击对手并吸收HP' },
    { name: '魔法闪耀', p: 80, pp: 10, desc: '释放魔法光芒照射对手' },
    { name: '嬉闹', p: 90, pp: 10, desc: '扑向对手嬉戏攻击' },
    { name: '月亮之力', p: 95, pp: 15, desc: '借助月亮之力发动攻击' },
    { name: '大地掌控', p: 120, pp: 5, desc: '掌控大地之力的妖精攻击' },
    { name: '星光灭绝', p: 150, pp: 5, desc: '以星光之力歼灭一切' }
  ],
  DARK: [
    { name: '咬碎', p: 80, pp: 15, desc: '用尖牙咬碎对手，可能降防' },
    { name: '暗袭要害', p: 70, pp: 15, desc: '攻击要害部位，暴击率高' },
    { name: '恶之波动', p: 80, pp: 15, desc: '释放充满恶意的波动' },
    { name: '暗黑爆裂', p: 85, pp: 10, desc: '释放浓缩的黑暗能量爆炸' },
    { name: '夜袭', p: 70, pp: 20, priority: 1, desc: '趁黑夜突袭，必定先手' },
    { name: '制裁光砾', p: 100, pp: 5, desc: '以制裁之力发射暗之光' },
    { name: '暗影突袭', p: 90, pp: 15, desc: '从暗影中发动突然袭击' },
    { name: '恶意追击', p: 60, pp: 20, desc: '暗系追击技能，对低HP对手威力翻倍' },
    { name: '暗冥强击', p: 110, pp: 5, desc: '凝聚黑暗之力的致命一击' },
    { name: '无尽暗夜', p: 140, pp: 3, desc: '将对手拖入无尽的黑暗中' },
  ],
  WIND: [
    { name: '微风切割', p: 40, pp: 30, desc: '用微风刃攻击对手' },
    { name: '旋风击', p: 55, pp: 25, desc: '卷起旋风攻击对手' },
    { name: '镰鼬', p: 75, pp: 15, desc: '不可见的风之刃切裂对手' },
    { name: '暴风', p: 90, pp: 10, desc: '掀起猛烈暴风攻击对手' },
    { name: '真空波', p: 70, pp: 20, priority: 1, desc: '制造真空冲击波，必定先手' },
    { name: '疾风连斩', p: 80, pp: 15, desc: '以风之速连续斩击对手' },
    { name: '风刃暴击', p: 100, pp: 10, desc: '凝聚风刃的致命一击' },
    { name: '龙卷天降', p: 110, pp: 5, desc: '召唤巨型龙卷风吞噬对手' },
    { name: '风神之怒', p: 130, pp: 3, desc: '风神降临的毁灭性风暴' },
    { name: '神风突击', p: 150, pp: 3, desc: '化身神风的终极突击' },
  ],
  LIGHT: [
    { name: '圣光弹', p: 40, pp: 30, desc: '发射圣洁的光弹攻击' },
    { name: '光辉冲击', p: 60, pp: 25, desc: '用光芒包裹身体冲击' },
    { name: '棱镜光线', p: 75, pp: 15, desc: '发射七彩棱镜光线' },
    { name: '圣光斩', p: 85, pp: 10, desc: '以圣光化为利刃斩击' },
    { name: '极光幕帘', p: 70, pp: 15, desc: '展开极光护盾反击对手' },
    { name: '审判之光', p: 100, pp: 10, desc: '降下审判的神圣光柱' },
    { name: '光子爆发', p: 110, pp: 5, desc: '释放光子能量的猛烈爆炸' },
    { name: '圣洁光辉', p: 90, pp: 10, desc: '散发圣洁光芒净化一切' },
    { name: '天堂之光', p: 130, pp: 3, desc: '来自天堂的终极光束' },
    { name: '创世光明', p: 160, pp: 3, desc: '开天辟地的创世光明' },
  ],
  GOD: [
    { name: '神之裁决', p: 90, pp: 10, acc: 100, desc: '以神明之力裁决对手' },
    { name: '虚空破碎', p: 110, pp: 5, acc: 95, desc: '粉碎虚空的神圣一击' },
    { name: '创世之光', p: 130, pp: 5, acc: 90, desc: '释放创世时的原初光芒' },
    { name: '维度打击', p: 150, pp: 3, acc: 85, desc: '跨越维度的致命打击' },
    { name: '因果律', p: 160, pp: 1, acc: 75, desc: '改写因果律的神级攻击' },
    { name: '万物归零', p: 170, pp: 1, acc: 70, desc: '将一切归于虚无的毁灭之力' },
    { name: '宇宙大爆炸', p: 180, pp: 1, acc: 55, desc: '引发宇宙级大爆炸的究极招式' },
    { name: '终焉之刻', p: 200, pp: 1, acc: 45, desc: '终结一切的禁忌之力，命中极低' }
  ],
  COSMIC: [
    { name: '星尘', p: 40, pp: 25, desc: '用宇宙星尘攻击对手' },
    { name: '流星冲击', p: 60, pp: 20, desc: '化身流星冲向对手' },
    { name: '星云旋涡', p: 75, pp: 15, desc: '卷起星云漩涡吞噬对手' },
    { name: '黑洞引力', p: 85, pp: 10, desc: '用黑洞引力撕裂对手' },
    { name: '银河射线', p: 100, pp: 8, desc: '发射贯穿银河的高能射线' },
    { name: '超新星爆发', p: 120, pp: 5, desc: '引发超新星级别的大爆炸' },
    { name: '虚空坍缩', p: 135, pp: 3, desc: '令空间坍缩碾压一切' },
    { name: '创世大爆炸', p: 150, pp: 3, desc: '模拟宇宙起源的终极爆炸' },
    { name: '维度崩塌', p: 170, pp: 1, acc: 70, desc: '令整个维度崩塌的禁忌之力' }
  ],
  SOUND: [
    { name: '回声', p: 40, pp: 25, desc: '发出声波回声攻击对手' },
    { name: '超音波击', p: 55, pp: 20, desc: '用超音波冲击波攻击' },
    { name: '共鸣爆破', p: 70, pp: 15, desc: '引发共鸣频率的爆破攻击' },
    { name: '声波炮', p: 85, pp: 10, desc: '发射凝聚的声波能量炮' },
    { name: '死亡咏叹', p: 100, pp: 8, desc: '吟唱死亡之歌的致命攻击' },
    { name: '天籁绝唱', p: 115, pp: 5, desc: '发出天籁般的毁灭音波' },
    { name: '寂灭之音', p: 130, pp: 3, desc: '令一切归于寂灭的终极音波' },
    { name: '万物交响', p: 150, pp: 3, desc: '融合万物之声的交响攻击' },
    { name: '宇宙乐章', p: 180, pp: 1, desc: '演奏宇宙起源的终极乐章' }
  ],
  HEAL: [
    { name: '自我再生', p: 0, pp: 10, val: 0.5, desc: '恢复50%最大HP' },
    { name: '光合作用', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '月光', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '祈愿', p: 0, pp: 10, val: 0.5, desc: '下回合恢复50%最大HP' },
    { name: '生命水滴', p: 0, pp: 15, val: 0.25, desc: '恢复25%最大HP' },
    { name: '晨光', p: 0, pp: 5, val: 0.5, desc: '恢复50%最大HP' },
    { name: '治愈波动', p: 0, pp: 10, val: 0.5, desc: '恢复目标50%最大HP' },
    { name: '羽栖', p: 0, pp: 10, val: 0.5, desc: '恢复50%最大HP' },
    { name: '净化之光', p: 60, pp: 20, desc: '释放净化光芒攻击，有几率解除异常状态' },
    { name: '生命脉冲', p: 80, pp: 10, desc: '将生命力转化为攻击能量' },
    { name: '回春一击', p: 90, pp: 8, desc: '以愈合之力攻击对手，自身回复造成伤害的25%' },
    { name: '圣愈裁决', p: 110, pp: 5, desc: '以愈合神力的终极攻击' }
  ]
};
// ==========================================
// [新增] 50种 战术/状态类技能库 (无伤害，纯策略)
// ==========================================
// ==========================================
// [重构] 变化类技能库 (明确百分比与效果)
// ==========================================
const STATUS_SKILLS_DB = [
  // --- 强化自身 (Buff: +1级=+50%, +2级=+100%) ---
  { name: '剑舞', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 2 }, desc: '跳起战斗之舞，物攻大幅提升(+100%)' },
  { name: '铁壁', t: 'STEEL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 2 }, desc: '皮肤硬化如铁，物防大幅提升(+100%)' },
  { name: '诡计', t: 'DARK', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 2 }, desc: '谋划计策，特攻大幅提升(+100%)' },
  { name: '健美', t: 'FIGHT', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'p_def' }, desc: '绷紧肌肉，物攻和物防同时提升(+50%)' },
  { name: '冥想', t: 'PSYCHIC', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, stat2: 's_def' }, desc: '静心凝神，特攻和特防同时提升(+50%)' },
  { name: '高速移动', t: 'PSYCHIC', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 2 }, desc: '身体放松，速度大幅提升(+100%)' },
  { name: '龙之舞', t: 'DRAGON', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'spd' }, desc: '神秘的舞蹈，物攻和速度同时提升(+50%)' },
  { name: '蝶舞', t: 'BUG', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, stat2: 's_def', stat3: 'spd' }, desc: '特攻、特防、速度全部提升(+50%)' },
  { name: '破壳', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 2, stat2: 's_atk', stat3: 'spd', selfDebuff: { stat: 'p_def', val: 1 } }, desc: '大幅提升双攻和速度(+100%)，但降低防御(-33%)' },
  { name: '聚气', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'crit', val: 2 }, desc: '集中精神，暴击率大幅提升(+2级)' },
  { name: '变硬', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1 }, desc: '全身用力，物防提升(+50%)' },
  { name: '生长', t: 'GRASS', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 's_atk' }, desc: '身体变大，物攻和特攻同时提升(+50%)' },
  { name: '充电', t: 'ELECTRIC', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1 }, desc: '蓄积电力，特防提升(+50%)' },
  { name: '溶化', t: 'POISON', p: 0, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 2 }, desc: '身体液化，物防大幅提升(+100%)' },
  { name: '棉花防守', t: 'GRASS', p: 0, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 3 }, desc: '用绒毛包裹，物防巨幅提升(+150%)' },
  { name: '影分身', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'eva', val: 1 }, desc: '制造残影，闪避率提升(+1级)' },
  { name: '变小', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'eva', val: 2 }, desc: '身体缩小，闪避率大幅提升(+2级)' },

  // --- 削弱对手 (Debuff: -1级=-33%, -2级=-50%) ---
  { name: '叫声', t: 'NORMAL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 1 }, desc: '可爱的叫声，降低对手物攻(-33%)' },
  { name: '瞪眼', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_def', val: 1 }, desc: '犀利的眼神，降低对手物防(-33%)' },
  { name: '刺耳声', t: 'NORMAL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_def', val: 2 }, desc: '刺耳的噪音，大幅降低对手物防(-50%)' },
  { name: '假哭', t: 'DARK', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_def', val: 2 }, desc: '装哭，大幅降低对手特防(-50%)' },
  { name: '金属音', t: 'STEEL', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_def', val: 2 }, desc: '摩擦金属声，大幅降低对手特防(-50%)' },
  { name: '可怕面孔', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'DEBUFF', target: 'enemy', stat: 'spd', val: 2 }, desc: '恐怖的表情，大幅降低对手速度(-50%)' },
  { name: '吐丝', t: 'BUG', p: 0, pp: 40, effect: { type: 'DEBUFF', target: 'enemy', stat: 'spd', val: 1 }, desc: '缠住对手，降低对手速度(-33%)' },
  { name: '撒娇', t: 'FAIRY', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 2 }, desc: '可爱的撒娇，大幅降低对手物攻(-50%)' },
  { name: '泼沙', t: 'GROUND', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '向眼睛泼沙，降低对手命中率(-1级)' },
  { name: '闪光', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '强光致盲，降低对手命中率(-1级)' },
  { name: '烟幕', t: 'FIRE', p: 0, pp: 20, effect: { type: 'DEBUFF', target: 'enemy', stat: 'acc', val: 1 }, desc: '喷出烟雾，降低对手命中率(-1级)' },
  { name: '羽毛舞', t: 'FLYING', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 'p_atk', val: 2 }, desc: '撒落羽毛，大幅降低对手物攻(-50%)' },
  { name: '大声咆哮', t: 'DARK', p: 0, pp: 15, effect: { type: 'DEBUFF', target: 'enemy', stat: 's_atk', val: 1 }, desc: '狂吠，降低对手特攻(-33%)' },

  // --- 施加异常状态 (Status) ---
  { name: '电磁波', t: 'ELECTRIC', p: 0, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 0.9 }, desc: '90%使对手麻痹(速度减半/25%无法行动)' },
  { name: '鬼火', t: 'FIRE', p: 0, pp: 15, effect: { type: 'STATUS', status: 'BRN', chance: 0.85 }, desc: '85%使对手灼伤(物攻减半/每回合扣血)' },
  { name: '剧毒', t: 'POISON', p: 0, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.9 }, desc: '90%使对手中剧毒(伤害随回合增加)' },
  { name: '催眠术', t: 'PSYCHIC', p: 0, pp: 20, effect: { type: 'STATUS', status: 'SLP', chance: 0.6 }, desc: '60%使对手睡眠(2-4回合无法行动)' },
  { name: '唱歌', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.55 }, desc: '55%使对手睡眠(2-4回合无法行动)' },
  { name: '蘑菇孢子', t: 'GRASS', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 1.0 }, desc: '100%使对手睡眠(2-4回合无法行动)' },
  { name: '奇异光线', t: 'GHOST', p: 0, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 1.0 }, desc: '100%使对手混乱(33%概率攻击自己)' },
  { name: '超音波', t: 'NORMAL', p: 0, pp: 20, effect: { type: 'STATUS', status: 'CON', chance: 0.55 }, desc: '55%使对手混乱(33%概率攻击自己)' },
  { name: '虚张声势', t: 'NORMAL', p: 0, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.85, sideEffect: {type:'BUFF', target:'enemy', stat:'p_atk', val:2} }, desc: '使对手混乱但大幅提升其攻击' },
  { name: '天使之吻', t: 'FAIRY', p: 0, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.75 }, desc: '75%使对手混乱' },
  { name: '大蛇瞪眼', t: 'NORMAL', p: 0, pp: 30, effect: { type: 'STATUS', status: 'PAR', chance: 1.0 }, desc: '100%使对手麻痹' },
  { name: '毒粉', t: 'POISON', p: 0, pp: 35, effect: { type: 'STATUS', status: 'PSN', chance: 0.75 }, desc: '75%使对手中毒' },
  { name: '麻痹粉', t: 'GRASS', p: 0, pp: 30, effect: { type: 'STATUS', status: 'PAR', chance: 0.75 }, desc: '75%使对手麻痹' },
  { name: '催眠粉', t: 'GRASS', p: 0, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.75 }, desc: '75%使对手睡眠' },

  // --- 防御与恢复 (Utility) ---
  { name: '守住', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'PROTECT' }, desc: '完全抵挡一回合攻击(连续使用易失败)' },
  { name: '看穿', t: 'FIGHT', p: 0, pp: 5, effect: { type: 'PROTECT' }, desc: '完全抵挡一回合攻击' },
  { name: '光合作用', t: 'GRASS', p: 0, pp: 5, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '自我再生', t: 'NORMAL', p: 0, pp: 10, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '羽栖', t: 'FLYING', p: 0, pp: 10, effect: { type: 'HEAL', val: 0.5 }, desc: '恢复50%最大HP' },
  { name: '黑雾', t: 'ICE', p: 0, pp: 30, effect: { type: 'RESET' }, desc: '重置全场所有能力变化' }
];
// ==========================================
// [新增] 伤害+特效 技能库 (50种)
// 格式: { name, t:属性, p:威力, pp, effect: { type, val/status, chance } }
// ==========================================
const SIDE_EFFECT_SKILLS = [
  // --- 1. 灼伤系列 (火系) ---
  { name: '火焰轮', t: 'FIRE', p: 60, pp: 25, effect: { type: 'STATUS', status: 'BRN', chance: 0.1 }, desc: '10%概率灼伤' },
  { name: '喷射火焰', t: 'FIRE', p: 90, pp: 15, effect: { type: 'STATUS', status: 'BRN', chance: 0.1 }, desc: '10%概率灼伤' },
  { name: '热风', t: 'FIRE', p: 95, pp: 10, effect: { type: 'STATUS', status: 'BRN', chance: 0.2 }, desc: '20%概率灼伤' },
  { name: '炼狱', t: 'FIRE', p: 100, pp: 5, acc: 50, effect: { type: 'STATUS', status: 'BRN', chance: 1.0 }, desc: '100%灼伤，命中率50%' },
  { name: '神圣之火', t: 'FIRE', p: 100, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.5 }, desc: '50%概率灼伤' },

  // --- 2. 麻痹系列 (电/一般) ---
  { name: '电击波', t: 'ELECTRIC', p: 60, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '放电', t: 'ELECTRIC', p: 80, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '泰山压顶', t: 'NORMAL', p: 85, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '30%概率麻痹' },
  { name: '蹭蹭脸颊', t: 'ELECTRIC', p: 40, pp: 20, effect: { type: 'STATUS', status: 'PAR', chance: 1.0 }, desc: '100%麻痹对手' },
  { name: '伏特攻击', t: 'ELECTRIC', p: 120, pp: 5, effect: { type: 'STATUS', status: 'PAR', chance: 0.3 }, desc: '高威力+30%麻痹' },

  // --- 3. 冰冻/减速系列 (冰系) ---
  { name: '冰冻之风', t: 'ICE', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低对手速度' },
  { name: '急冻光线', t: 'ICE', p: 90, pp: 10, effect: { type: 'STATUS', status: 'FRZ', chance: 0.1 }, desc: '10%概率冰冻' },
  { name: '暴风雪', t: 'ICE', p: 110, pp: 5, effect: { type: 'STATUS', status: 'FRZ', chance: 0.3 }, desc: '30%概率冰冻' },
  { name: '冰柱坠击', t: 'ICE', p: 85, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '30%概率畏缩(这里用混乱代替)' },
  { name: '极寒冷焰', t: 'ICE', p: 140, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.3 }, desc: '奇特的冰系技能，30%灼伤' },

  // --- 4. 中毒系列 (毒系) ---
  { name: '毒针', t: 'POISON', p: 30, pp: 35, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '毒击', t: 'POISON', p: 80, pp: 20, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '污泥炸弹', t: 'POISON', p: 90, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '垃圾射击', t: 'POISON', p: 120, pp: 5, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '30%概率中毒' },
  { name: '十字毒刃', t: 'POISON', p: 70, pp: 20, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '50%概率中毒(高暴击)' },

  // --- 5. 降防系列 (降低物防/特防) ---
  { name: '碎岩', t: 'FIGHT', p: 40, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.5 }, desc: '50%降低物防' },
  { name: '铁尾', t: 'STEEL', p: 100, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '30%降低物防' },
  { name: '咬碎', t: 'DARK', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.2 }, desc: '20%降低物防' },
  { name: '暗影球', t: 'GHOST', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.2 }, desc: '20%降低特防' },
  { name: '大地之力', t: 'GROUND', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.1 }, desc: '10%降低特防' },
  { name: '精神强念', t: 'PSYCHIC', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.1 }, desc: '10%降低特防' },
  { name: '酸液炸弹', t: 'POISON', p: 40, pp: 20, effect: { type: 'DEBUFF', stat: 's_def', val: 2, chance: 1.0 }, desc: '100%大幅降低特防' },

  // --- 6. 降攻系列 (降低物攻/特攻) ---
  { name: '嬉闹', t: 'FAIRY', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.1 }, desc: '10%降低物攻' },
  { name: '月亮之力', t: 'FAIRY', p: 95, pp: 15, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.3 }, desc: '30%降低特攻' },
  { name: '暗黑咆哮', t: 'DARK', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 1.0 }, desc: '暗属性冲击波，100%降低特攻' },
  { name: '广域破坏', t: 'DRAGON', p: 60, pp: 15, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 1.0 }, desc: '100%降低物攻' },
  { name: '虫之抵抗', t: 'BUG', p: 50, pp: 20, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 1.0 }, desc: '100%降低特攻' },

  // --- 7. 降速/降命中系列 ---
  { name: '岩石封锁', t: 'ROCK', p: 60, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '泥巴射击', t: 'GROUND', p: 55, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '重踏', t: 'GROUND', p: 60, pp: 20, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%降低速度' },
  { name: '浊流', t: 'WATER', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.3 }, desc: '30%降低命中' },
  { name: '暗黑爆破', t: 'DARK', p: 85, pp: 10, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.4 }, desc: '40%降低命中' },

  // --- 8. 混乱系列 ---
  { name: '水之波动', t: 'WATER', p: 60, pp: 20, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '20%概率混乱' },
  { name: '信号光束', t: 'BUG', p: 75, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.1 }, desc: '10%概率混乱' },
  { name: '暴风·天空', t: 'FLYING', p: 110, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '30%概率混乱' },
  { name: '爆裂拳', t: 'FIGHT', p: 100, pp: 5, acc: 50, effect: { type: 'STATUS', status: 'CON', chance: 1.0 }, desc: '100%混乱，命中率50%' },

  // --- 9. 强化自身系列 (攻击同时提升自己) ---
  { name: '增强拳', t: 'FIGHT', p: 40, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 1.0 }, desc: '100%提升自身物攻' },
  { name: '蓄能焰袭', t: 'FIRE', p: 50, pp: 20, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 1.0 }, desc: '100%提升自身速度' },
  { name: '钢翼', t: 'STEEL', p: 70, pp: 25, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.1 }, desc: '10%提升自身物防' },
  { name: '原始之力', t: 'ROCK', p: 60, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, stat2: 'p_def', chance: 0.1 }, desc: '10%全属性提升(简化)' },
  { name: '流星光束', t: 'ROCK', p: 120, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 1.0 }, desc: '蓄力攻击，提升特攻' }
];

// ==========================================
// [新增] 50种高级技能 (含复合效果、回血、反伤、天气等)
// ==========================================
const ADVANCED_SKILLS = [
  // --- 火系 (5) ---
  { name: '业火爆炎', t: 'FIRE', p: 130, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.5 }, desc: '释放炼狱之火，130威力+50%灼伤' },
  { name: '灼热践踏', t: 'FIRE', p: 85, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '踩踏烈焰，85威力+50%降速' },
  { name: '阳炎乱舞', t: 'FIRE', p: 75, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 1.0 }, desc: '以热浪为掩护，75威力+提升速度' },
  { name: '火神之怒', t: 'FIRE', p: 110, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '神火焚天，110威力+30%降防' },
  { name: '焰灵咒', t: 'FIRE', p: 95, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '幻焰迷心，95威力+20%混乱' },

  // --- 水系 (5) ---
  { name: '深渊漩涡', t: 'WATER', p: 100, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '深海漩涡卷入，100威力+50%降速' },
  { name: '暴雨洗礼', t: 'WATER', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1, chance: 0.3 }, desc: '雨水滋润，80威力+30%提特防' },
  { name: '水神裁决', t: 'WATER', p: 130, pp: 5, effect: { type: 'STATUS', status: 'FRZ', chance: 0.15 }, desc: '绝对水压，130威力+15%冰冻' },
  { name: '潮汐之力', t: 'WATER', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '潮汐冲刷意志，90威力+30%降物攻' },
  { name: '泡影破灭', t: 'WATER', p: 70, pp: 15, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.5 }, desc: '泡沫爆裂，70威力+50%降特防' },

  // --- 草系 (4) ---
  { name: '藤蔓绞杀', t: 'GRASS', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '藤蔓缠绕，90威力+50%降速' },
  { name: '花粉风暴', t: 'GRASS', p: 80, pp: 15, effect: { type: 'STATUS', status: 'SLP', chance: 0.2 }, desc: '花粉催眠，80威力+20%睡眠' },
  { name: '世界树之怒', t: 'GRASS', p: 140, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.5 }, desc: '世界树之力，140威力+50%提防' },
  { name: '光合冲击', t: 'GRASS', p: 85, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 0.3 }, desc: '汲取阳光攻击，85威力+30%提特攻' },

  // --- 电系 (3) ---
  { name: '雷神降世', t: 'ELECTRIC', p: 140, pp: 5, effect: { type: 'STATUS', status: 'PAR', chance: 0.5 }, desc: '天雷降临，140威力+50%麻痹' },
  { name: '电磁脉冲', t: 'ELECTRIC', p: 85, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.3 }, desc: '电磁波干扰，85威力+30%大幅降速' },
  { name: '闪电链', t: 'ELECTRIC', p: 75, pp: 15, effect: { type: 'STATUS', status: 'PAR', chance: 0.4 }, desc: '连锁闪电，75威力+40%麻痹' },

  // --- 冰系 (3) ---
  { name: '极寒领域', t: 'ICE', p: 100, pp: 8, effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.5 }, desc: '冰域降临，100威力+50%大幅降速' },
  { name: '冰晶穿刺', t: 'ICE', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '冰晶贯穿铠甲，90威力+30%降物防' },
  { name: '钻石星尘', t: 'ICE', p: 120, pp: 5, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 1.0 }, desc: '冰晶防护+攻击，120威力+提物防' },

  // --- 格斗 (3) ---
  { name: '百烈拳', t: 'FIGHT', p: 70, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '连续出拳越打越强，70威力+30%提物攻' },
  { name: '气功波', t: 'FIGHT', p: 95, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '精神攻击，95威力+20%混乱' },
  { name: '天罡拳', t: 'FIGHT', p: 120, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.5 }, desc: '破甲重击，120威力+50%降物防' },

  // --- 毒系 (2) ---
  { name: '瘴气弥漫', t: 'POISON', p: 85, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '毒雾笼罩，85威力+50%中毒' },
  { name: '剧毒之牙', t: 'POISON', p: 110, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '毒牙穿刺，110威力+30%降防' },

  // --- 地面 (2) ---
  { name: '大地裁决', t: 'GROUND', p: 110, pp: 8, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '地裂阻敌，110威力+50%降速' },
  { name: '沙暴冲击', t: 'GROUND', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.5 }, desc: '黄沙遮目，80威力+50%降命中' },

  // --- 飞行 (2) ---
  { name: '天翔龙卷', t: 'FLYING', p: 110, pp: 8, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '龙卷风席卷，110威力+30%混乱' },
  { name: '疾风斩', t: 'FLYING', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 0.5 }, desc: '风之加护，80威力+50%提速' },

  // --- 超能 (3) ---
  { name: '精神崩坏', t: 'PSYCHIC', p: 100, pp: 8, effect: { type: 'STATUS', status: 'CON', chance: 0.4 }, desc: '精神冲击，100威力+40%混乱' },
  { name: '念动力场', t: 'PSYCHIC', p: 85, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1, chance: 0.5 }, desc: '念力护盾，85威力+50%提特防' },
  { name: '次元斩击', t: 'PSYCHIC', p: 130, pp: 5, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.3 }, desc: '切割精神，130威力+30%降特防' },

  // --- 虫系 (2) ---
  { name: '虫群风暴', t: 'BUG', p: 95, pp: 10, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '虫群侵蚀意志，95威力+30%降物攻' },
  { name: '毒鳞粉', t: 'BUG', p: 70, pp: 15, effect: { type: 'STATUS', status: 'PSN', chance: 0.5 }, desc: '有毒鳞粉，70威力+50%中毒' },

  // --- 岩石 (2) ---
  { name: '巨岩压顶', t: 'ROCK', p: 110, pp: 8, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '巨岩压制，110威力+50%降速' },
  { name: '宝石闪光', t: 'ROCK', p: 80, pp: 15, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.3 }, desc: '宝石折射致盲，80威力+30%降命中' },

  // --- 幽灵 (3) ---
  { name: '怨灵缠身', t: 'GHOST', p: 90, pp: 10, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '怨灵攻击精神，90威力+30%混乱' },
  { name: '冥府之门', t: 'GHOST', p: 130, pp: 5, effect: { type: 'DEBUFF', stat: 's_def', val: 2, chance: 0.3 }, desc: '冥界力量，130威力+30%大幅降特防' },
  { name: '诅咒之刃', t: 'GHOST', p: 85, pp: 15, effect: { type: 'STATUS', status: 'PSN', chance: 0.3 }, desc: '被诅咒侵蚀，85威力+30%中毒' },

  // --- 龙系 (2) ---
  { name: '龙神咆哮', t: 'DRAGON', p: 140, pp: 5, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.5 }, desc: '龙之威压，140威力+50%降物攻' },
  { name: '龙鳞守护', t: 'DRAGON', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.5 }, desc: '龙鳞硬化+攻击，80威力+50%提物防' },

  // --- 钢系 (2) ---
  { name: '铁壁突击', t: 'STEEL', p: 100, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.3 }, desc: '钢铁冲锋，100威力+30%提物防' },
  { name: '合金斩', t: 'STEEL', p: 90, pp: 10, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '合金利刃切割铠甲，90威力+30%降物防' },

  // --- 妖精 (3) ---
  { name: '月华光辉', t: 'FAIRY', p: 100, pp: 10, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.3 }, desc: '圣洁月光，100威力+30%降特攻' },
  { name: '精灵之舞', t: 'FAIRY', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 0.5 }, desc: '舞蹈蓄力，80威力+50%提特攻' },
  { name: '梦幻泡影', t: 'FAIRY', p: 110, pp: 8, effect: { type: 'STATUS', status: 'SLP', chance: 0.15 }, desc: '梦幻之力，110威力+15%催眠' },

  // --- 暗系 (6)：暗影吞噬～终焉之影 ---
  { name: '暗影吞噬', t: 'DARK', p: 95, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.3 }, desc: '暗影侵蚀，95威力+30%降特防' },
  { name: '深渊凝视', t: 'DARK', p: 80, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '深渊之眼，80威力+30%混乱' },
  { name: '黑洞吸引', t: 'DARK', p: 130, pp: 5, effect: { type: 'DEBUFF', stat: 'spd', val: 2, chance: 0.5 }, desc: '黑洞引力，130威力+50%大幅降速' },
  { name: '暗夜猎杀', t: 'DARK', p: 95, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '暗夜猎杀，95威力+30%升攻' },
  { name: '黑暗领域', t: 'DARK', p: 105, pp: 8, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.4 }, desc: '黑暗弥漫，105威力+40%降命中' },
  { name: '终焉之影', t: 'DARK', p: 140, pp: 3, effect: { type: 'STATUS', status: 'CON', chance: 0.3 }, desc: '终焉暗影，140威力+30%混乱' },

  // --- 神系 (1) ---
  { name: '天启审判', t: 'GOD', p: 160, pp: 3, effect: { type: 'DEBUFF', stat: 'p_def', val: 2, chance: 0.5 }, desc: '天之审判降临，160威力+50%大幅降防' },

  // --- 风系 (3) ---
  { name: '真空斩月', t: 'WIND', p: 100, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 0.4 }, desc: '月形风刃，100威力+40%加速' },
  { name: '飓风吞噬', t: 'WIND', p: 120, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '飓风撕裂防御，120威力+30%降防' },
  { name: '风暴结界', t: 'WIND', p: 85, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 0.5 }, desc: '风暴护体，85威力+50%加速' },

  // --- 光系 (3) ---
  { name: '圣光审判', t: 'LIGHT', p: 110, pp: 8, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.3 }, desc: '圣光降下审判，110威力+30%降特防' },
  { name: '光之壁垒', t: 'LIGHT', p: 80, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 's_def', val: 1, chance: 0.5 }, desc: '光之壁垒，80威力+50%升特防' },
  { name: '极光冲击', t: 'LIGHT', p: 130, pp: 5, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '极光之力，130威力+20%混乱' },

  // --- 火系新增 (2) ---
  { name: '烈焰星坠', t: 'FIRE', p: 115, pp: 5, effect: { type: 'STATUS', status: 'BRN', chance: 0.4 }, desc: '如流星坠落的烈焰，115威力+40%灼伤' },
  { name: '业火审判', t: 'FIRE', p: 140, pp: 3, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.5 }, desc: '业火焚尽，140威力+50%降特防' },

  // --- 水系新增 (2) ---
  { name: '深海漩涡', t: 'WATER', p: 95, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.4 }, desc: '深海漩涡卷入，95威力+40%降速' },
  { name: '潮汐怒涛', t: 'WATER', p: 125, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '潮汐之怒，125威力+30%降防' },

  // --- 草系新增 (2) ---
  { name: '荆棘缠绕', t: 'GRASS', p: 85, pp: 15, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.5 }, desc: '荆棘纠缠，85威力+50%降速' },
  { name: '世界树之力', t: 'GRASS', p: 130, pp: 3, effect: { type: 'BUFF', target: 'self', stat: 's_atk', val: 1, chance: 0.5 }, desc: '世界树赐予力量，130威力+50%升特攻' },

  // --- 电系新增 (1) ---
  { name: '雷神制裁', t: 'ELECTRIC', p: 135, pp: 5, effect: { type: 'STATUS', status: 'PAR', chance: 0.4 }, desc: '雷神降临，135威力+40%麻痹' },

  // --- 格斗新增 (1) ---
  { name: '一拳超人', t: 'FIGHT', p: 150, pp: 3, effect: { type: 'DEBUFF', stat: 'p_def', val: 2, chance: 0.5 }, desc: '全力一拳，150威力+50%大幅降防' },

  // --- 钢系新增 (1) ---
  { name: '合金重炮', t: 'STEEL', p: 120, pp: 5, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.3 }, desc: '合金炮弹轰击，120威力+30%降防' },

  // --- 龙系新增 (1) ---
  { name: '龙魂爆裂', t: 'DRAGON', p: 140, pp: 3, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 0.4 }, desc: '龙之魂魄爆发，140威力+40%升攻' },

  // --- 冰系新增 (1) ---
  { name: '极冰裁决', t: 'ICE', p: 130, pp: 3, effect: { type: 'STATUS', status: 'FRZ', chance: 0.3 }, desc: '极寒裁决轰击，130威力+30%冻结' },
];

// ==========================================
// V17 新增技能（60）
// ==========================================
const NEW_SKILLS_V17 = [
  // 合计 60；格斗/地面/虫/妖各 4，治愈 3、神 2，其余系补足中威力带
  { name: '和风推手', t: 'NORMAL', p: 55, pp: 25, desc: '以柔劲推开对手，讲究中线与呼吸' },
  { name: '居合切', t: 'NORMAL', p: 68, pp: 20, desc: '拔刀般的迅猛横斩，干净利落' },
  { name: '师范流·踏切', t: 'NORMAL', p: 88, pp: 12, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.25 }, desc: '踏地夺位的一击，25%扰乱对手视线' },
  { name: '红莲碎焰', t: 'FIRE', p: 58, pp: 22, desc: '散落的细碎火点如红莲绽放' },
  { name: '炎狱突', t: 'FIRE', p: 72, pp: 18, effect: { type: 'STATUS', status: 'BRN', chance: 0.15 }, desc: '短距爆发突刺，15%灼伤' },
  { name: '急流破', t: 'WATER', p: 58, pp: 22, desc: '以一线急流切开对手架势' },
  { name: '瀑布掌', t: 'WATER', p: 74, pp: 16, desc: '自上而下如瀑布坠落的掌压' },
  { name: '青竹鞭影', t: 'GRASS', p: 52, pp: 24, desc: '竹影般的鞭击，轻灵连绵' },
  { name: '万象森罗', t: 'GRASS', p: 92, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.25 }, desc: '森罗幻象缠绕，25%降特防' },
  { name: '雷纹指', t: 'ELECTRIC', p: 58, pp: 23, desc: '指尖雷纹游走，点穴般精准' },
  { name: '紫电贯虹', t: 'ELECTRIC', p: 88, pp: 12, desc: '紫色电光如长虹贯日' },
  { name: '霜刃回旋', t: 'ICE', p: 58, pp: 22, desc: '霜刃绕身回旋斩出' },
  { name: '雪女叹息', t: 'ICE', p: 86, pp: 12, desc: '如传说雪女轻叹的极寒吐息' },
  { name: '黄泉雾', t: 'POISON', p: 58, pp: 21, desc: '黄泉色泽的毒雾扑面' },
  { name: '蛊毒穿心', t: 'POISON', p: 92, pp: 11, desc: '蛊毒随劲力透体而入' },
  { name: '燕双线', t: 'FLYING', p: 62, pp: 22, desc: '燕子抄水般的双线掠击' },
  { name: '鸢月闪', t: 'FLYING', p: 90, pp: 12, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '月下鸢影一闪，20%混乱' },
  { name: '心象镜', t: 'PSYCHIC', p: 62, pp: 20, desc: '将心象映于镜中再击碎' },
  { name: '阿赖耶识刃', t: 'PSYCHIC', p: 94, pp: 10, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.25 }, desc: '触及藏识之刃，25%降特防' },
  { name: '碑裂击', t: 'ROCK', p: 62, pp: 18, desc: '如古碑龟裂的沉重一击' },
  { name: '不动尊·岩肘', t: 'ROCK', p: 76, pp: 14, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.25 }, desc: '岩肘顶击，25%降物防' },
  { name: '纸扎替身击', t: 'GHOST', p: 62, pp: 18, desc: '纸人替身迷惑后真身突袭' },
  { name: '忘川涟漪', t: 'GHOST', p: 78, pp: 14, effect: { type: 'STATUS', status: 'CON', chance: 0.25 }, desc: '忘川水纹荡开，25%混乱' },
  { name: '蛟翻身', t: 'DRAGON', p: 62, pp: 20, desc: '如蛟龙卷浪翻身而起' },
  { name: '苍角钻', t: 'DRAGON', p: 77, pp: 15, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.2 }, desc: '苍龙之角螺旋钻刺，20%挫其锐气' },
  { name: '锻刀雨', t: 'STEEL', p: 62, pp: 20, desc: '锻锤火花与碎钢如雨洒落' },
  { name: '铁后劲', t: 'STEEL', p: 76, pp: 15, effect: { type: 'BUFF', target: 'self', stat: 'p_def', val: 1, chance: 0.25 }, desc: '后发先至的寸劲，25%自升物防' },
  { name: '鍔鸣千返', t: 'STEEL', p: 88, pp: 11, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.2 }, desc: '刀鍔连鸣如千次返刃，20%削甲' },
  { name: '极真崩拳', t: 'FIGHT', p: 62, pp: 18, effect: { type: 'DEBUFF', stat: 'p_def', val: 1, chance: 0.25 }, desc: '极真空手崩拳，25%降物防' },
  { name: '八极·野马分鬃', t: 'FIGHT', p: 78, pp: 15, desc: '八极拳架，开胯分鬃顶肘' },
  { name: '明镜止水·贯手', t: 'FIGHT', p: 96, pp: 10, effect: { type: 'BUFF', target: 'self', stat: 'p_atk', val: 1, chance: 0.2 }, desc: '心如明镜，20%自升物攻' },
  { name: '一闪崩捶', t: 'FIGHT', p: 108, pp: 8, effect: { type: 'STATUS', status: 'CON', chance: 0.15 }, desc: '瞬步贴近后的崩捶，15%震乱神识' },
  { name: '砂岚拳', t: 'GROUND', p: 58, pp: 20, desc: '砂尘旋风裹拳轰出' },
  { name: '地脉涌', t: 'GROUND', p: 76, pp: 14, desc: '引地脉之气自下而上喷涌' },
  { name: '泰山印', t: 'GROUND', p: 94, pp: 10, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.3 }, desc: '如泰山压顶之印，30%降速' },
  { name: '龙门震踏', t: 'GROUND', p: 82, pp: 12, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.25 }, desc: '踏如龙门开阖，25%扬尘迷眼' },
  { name: '丝笼缚', t: 'BUG', p: 58, pp: 20, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.3 }, desc: '蚕丝成笼束缚，30%降速' },
  { name: '玉茧剑', t: 'BUG', p: 76, pp: 15, desc: '玉色虫茧硬化为剑形斩击' },
  { name: '绯想天蛾', t: 'BUG', p: 98, pp: 10, effect: { type: 'STATUS', status: 'PSN', chance: 0.2 }, desc: '磷粉如蛾翼飘散，20%中毒' },
  { name: '槐蚕刺', t: 'BUG', p: 66, pp: 17, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.25 }, desc: '如槐蚕吐丝贯刺，25%挫其念力' },
  { name: '樱吹雪刃', t: 'FAIRY', p: 62, pp: 20, desc: '樱花如雪，刃藏于花瓣之间' },
  { name: '神乐铃音', t: 'FAIRY', p: 76, pp: 15, desc: '神乐铃响，音刃齐发' },
  { name: '天狐燐火', t: 'FAIRY', p: 94, pp: 10, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.2 }, desc: '天狐磷火惑心，20%降特攻' },
  { name: '结缘红绳', t: 'FAIRY', p: 70, pp: 16, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.3 }, desc: '红线缠足绊心，30%降速' },
  { name: '影缝', t: 'DARK', p: 68, pp: 17, desc: '将对手钉在影子的缝隙之间' },
  { name: '罗城门', t: 'DARK', p: 84, pp: 13, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.25 }, desc: '罗生门般的压迫，25%降命中' },
  { name: '百鬼夜行切', t: 'DARK', p: 102, pp: 9, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.2 }, desc: '百鬼过境的一斩，20%裂其心神之防' },
  { name: '岚步斩', t: 'WIND', p: 82, pp: 14, effect: { type: 'BUFF', target: 'self', stat: 'spd', val: 1, chance: 0.35 }, desc: '踏岚而行，35%自提速' },
  { name: '穿林风', t: 'WIND', p: 64, pp: 18, desc: '林隙间穿行的细碎风刃' },
  { name: '破魔矢', t: 'LIGHT', p: 84, pp: 13, effect: { type: 'DEBUFF', stat: 's_def', val: 1, chance: 0.25 }, desc: '破魔一矢，25%降特防' },
  { name: '净玻璃明镜', t: 'LIGHT', p: 72, pp: 14, effect: { type: 'STATUS', status: 'CON', chance: 0.15 }, desc: '镜光映心，15%惑乱' },
  { name: '星屑螺旋', t: 'COSMIC', p: 86, pp: 12, effect: { type: 'DEBUFF', stat: 'spd', val: 1, chance: 0.25 }, desc: '星屑成螺旋卷入，25%降速' },
  { name: '黄道坍缩', t: 'COSMIC', p: 92, pp: 10, desc: '黄道之力向内坍缩的一击' },
  { name: '太鼓雷', t: 'SOUND', p: 79, pp: 15, effect: { type: 'STATUS', status: 'CON', chance: 0.2 }, desc: '太鼓雷鸣共振，20%混乱' },
  { name: '琴心三叠', t: 'SOUND', p: 64, pp: 18, effect: { type: 'DEBUFF', stat: 'acc', val: 1, chance: 0.2 }, desc: '琴音三折扰神，20%降命中' },
  { name: '伏兔针打', t: 'HEAL', p: 74, pp: 12, effect: { type: 'DEBUFF', stat: 'p_atk', val: 1, chance: 0.3 }, desc: '如针灸取穴的打击要害，30%降物攻' },
  { name: '药气化劲', t: 'HEAL', p: 82, pp: 11, effect: { type: 'DEBUFF', stat: 's_atk', val: 1, chance: 0.2 }, desc: '药力化内劲轰出，20%降特攻' },
  { name: '回灵拍', t: 'HEAL', p: 66, pp: 14, desc: '以推拿之理拍击要穴，刚柔并济' },
  { name: '神阶·微尘', t: 'GOD', p: 100, pp: 12, acc: 95, desc: '神祇随手一抹，却如山海倾覆前的微尘预警' },
  { name: '神阶·雨师', t: 'GOD', p: 115, pp: 8, acc: 92, desc: '司雨之神权能的中位轰击，雨露亦可穿石' },
];

// [自动注入] 将新技能合并到 SKILL_DB
const injectStatusSkills = () => {
  STATUS_SKILLS_DB.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    // 避免重复添加
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
        SKILL_DB[skill.t].push(skill);
    }
  });
};
// 立即执行注入
injectStatusSkills();
// [自动注入] 将伤害+特效技能合并到 SKILL_DB
const injectSideEffectSkills = () => {
  SIDE_EFFECT_SKILLS.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    // 避免重复
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
        // 插入到列表末尾，作为强力技能
        SKILL_DB[skill.t].push(skill);
    }
  });
};
// 立即执行
injectSideEffectSkills();

// [自动注入] 50种高级技能
const injectAdvancedSkills = () => {
  ADVANCED_SKILLS.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
      SKILL_DB[skill.t].push(skill);
    }
  });
};
injectAdvancedSkills();

// [自动注入] V17 新增技能
const injectNewSkillsV17 = () => {
  NEW_SKILLS_V17.forEach(skill => {
    if (!SKILL_DB[skill.t]) SKILL_DB[skill.t] = [];
    if (!SKILL_DB[skill.t].find(s => s.name === skill.name)) {
      SKILL_DB[skill.t].push(skill);
    }
  });
};
injectNewSkillsV17();

export { SKILL_DB, STATUS_SKILLS_DB, SIDE_EFFECT_SKILLS, ADVANCED_SKILLS, NEW_SKILLS_V17 };
