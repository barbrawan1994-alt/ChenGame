const SPRITE_CDNS = [
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/',
];
const SPRITE_BASE = SPRITE_CDNS[0];
const SPRITE_EXT = '.png';
const DIGIMON_BASE = 'https://digi-api.com/images/digimon/w/';

const ID_TO_DIGIMON = {
  168: 'Elecmon',             // 伦琴猫(ELECTRIC) → 电气兽
  182: 'Coredramon_(Blue)',   // 烈咬陆鲨(DRAGON) → 核龙兽
  183: 'Panjyamon',            // 路卡利欧(FIGHT) → 冰狮子兽
  504: 'Birdramon',            // 风铃鸟(WIND) → 巨鸟兽
  505: 'Piyomon',             // 疾风隼(WIND) → 比丘兽
  506: 'Sinduramon',          // 风暴凤凰(WIND) → 真达罗兽
  507: 'Marin_Devimon',       // 浮空水母(WIND)
  508: 'Gesomon',             // 风暴水母(WIND)
  509: 'Kiwimon',             // 蒲公英精(WIND) → 奇异果兽
  510: 'Lilamon',             // 风花仙子(WIND) → 丁香兽
  512: 'Snimon',              // 风刃螳螂(WIND) → 螳螂兽
  513: 'Lopmon',              // 气旋松鼠(WIND) → 洛普兽
  514: 'Yatagaramon',         // 风行者(WIND) → 八咫鸦兽
  515: 'Darcmon',             // 暴风天使(WIND) → 达尔克兽
  517: 'Flymon',              // 光辉蛾(LIGHT)
  518: 'Butterflamon',         // 圣光帝蛾(LIGHT) → 蝴蝶兽
  519: 'Mikemon',             // 晨光猫(LIGHT) → 三花猫兽
  520: 'Nefertimon',          // 日光猫(LIGHT) → 天马兽
  521: 'Liamon',              // 太阳狮(LIGHT) → 狮子兽
  522: 'Starmon',             // 棱镜水晶(LIGHT) → 星星兽
  523: 'Superstarmon',         // 虹光宝石(LIGHT) → 超级星星兽
  524: 'Guardromon',          // 光子精灵(LIGHT) → 守卫兽
  525: 'Giromon',             // 光束战士(LIGHT) → 手里剑兽
  526: 'Renamon',             // 极光狐(LIGHT) → 妖狐兽
  527: 'Unimon',              // 圣光独角兽(LIGHT) → 独角兽
  529: 'Sorcermon',            // 光之精灵(LIGHT) → 魔术师兽
  531: 'Gazimon',              // 暗影鼠(DARK) → 加兹兽
  532: 'Were_Garurumon_(Black)', // 暗夜狼(DARK)
  534: 'Pico_Devimon',        // 黑雾蝙蝠(DARK) → 小恶魔兽
  535: 'Myotismon',            // 暗翼魔蝠(DARK) → 吸血魔兽
  537: 'Black_Tailmon',       // 幽暗豹(DARK) → 黑迪路兽
  538: 'Sandiramon',           // 诡计蛇(DARK) → 蛇兽
  539: 'Dagomon',             // 深渊鱼(DARK)
  540: 'Dark_Knightmon',      // 暗影武士(DARK) → 暗黑骑士兽
  542: 'Fladramon',            // 烈焰巨蜥(FIRE) → 烈焰兽
  543: 'Tyranomon',            // 火山幼龙(FIRE) → 暴龙兽
  544: 'Megidramon',          // 赤炎飞龙(FIRE) → 默示录兽
  545: 'Blue_Meramon',         // 灼热仙人掌(FIRE) → 蓝焰兽
  548: 'Whamon',              // 深海鲸(WATER) → 鲸鱼兽
  549: 'Shakomon',            // 珊瑚精灵(WATER)
  552: 'Seadramon',           // 海马骑士(WATER) → 海龙兽
  553: 'Tanemon',             // 种子球(GRASS) → 种子兽
  554: 'Vegimon',              // 花丛兽(GRASS) → 蔬菜兽
  559: 'Pulsemon',             // 电火花(ELECTRIC) → 脉冲兽
  560: 'Thunderballmon',       // 雷暴兽(ELECTRIC) → 雷球兽
  562: 'Kokuwamon',            // 闪电鸟(ELECTRIC) → 甲虫兽
  563: 'Blitz_Greymon',       // 电浆兽(ELECTRIC)
  565: 'Mojyamon',            // 冰霜麋鹿(ICE) → 毛人兽
  566: 'Yukidarumon',         // 雪花精灵(ICE) → 雪人兽
  567: 'Mammon',              // 冰川巨人(ICE) → 猛犸兽
  568: 'Frigimon',             // 寒霜狐(ICE) → 冰雪兽
  572: 'Ganimon',             // 铁拳蟹(FIGHT) → 螃蟹兽
  573: 'Etemon',              // 相扑力士(FIGHT) → 猿猴兽
  574: 'Mushmon',             // 毒菇(POISON) → 蘑菇兽
  575: 'Woodmon',             // 瘴气菇王(POISON) → 树木兽
  576: 'Tonosama_Gekomon',    // 剧毒蛙(POISON) → 蛙王兽
  578: 'Drimogemon',          // 钻地鼹(GROUND) → 钻头兽
  579: 'Monochromon',          // 地震犰狳(GROUND) → 角龙兽
  580: 'Kunemon',             // 沙丘虫(GROUND) → 电子虫
  581: 'Hangyomon',           // 大地鲶鱼(GROUND) → 半鱼人兽
  582: 'Falcomon',             // 气球鸟(FLYING) → 鹰兽
  583: 'Hippogriffomon',       // 风暴鹰(FLYING) → 骏鹰兽
  584: 'Airdramon',           // 天空鲸(FLYING) → 飞龙兽
  586: 'Wizarmon',            // 心灵术士(PSYCHIC) → 巫师兽
  588: 'Kuwagamon',            // 宝石甲虫(BUG) → 锹形虫兽
  589: 'Okuwamon',            // 钻石独角仙(BUG) → 锹形虫兽
  591: 'Gottsumon',            // 小石头(ROCK) → 岩石兽
  592: 'Golemon',             // 巨岩兽(ROCK) → 岩浆兽
  593: 'Pteramon',             // 化石翼龙(ROCK) → 翼龙兽
  594: 'Bakemon',             // 蜡烛幽灵(GHOST) → 幽灵兽
  595: 'Deathmon',             // 灯笼鬼(GHOST) → 死亡兽
  597: 'Hackmon',             // 小飞龙(DRAGON) → 黑客兽
  598: 'Coredramon_(Green)',  // 翡翠龙(DRAGON) → 核龙兽绿
  599: 'Breakdramon',          // 星辰龙(DRAGON) → 碎裂龙兽
  600: 'Mugendramon',          // 机械天使(STEEL) → 无限龙兽
  601: 'Valdurmon',           // 岚神·风伯(WIND) → 瓦尔杜兽
  602: 'Zhuqiaomon',          // 苍穹凤凰(WIND) → 朱雀兽
  604: 'Cherubimon',           // 天照大神(LIGHT) → 基路比兽
  607: 'Alphamon',            // 创世之光(LIGHT) → 阿尔法兽
  608: 'Beelzebumon',          // 冥渊魔王(DARK) → 堕天地狱兽
  609: 'Piemon',               // 暗影刺客(DARK) → 小丑皇
  // 56 new Digimon creatures (611-666)
  611: 'Agumon', 612: 'Greymon', 613: 'Metal_Greymon', 614: 'War_Greymon',
  615: 'Gabumon', 616: 'Garurumon', 617: 'Were_Garurumon', 618: 'Metal_Garurumon',
  619: 'Guilmon', 620: 'Growmon', 621: 'Megalo_Growmon', 622: 'Dukemon',
  623: 'Renamon', 624: 'Kyubimon', 625: 'Taomon', 626: 'Sakuyamon',
  627: 'Terriermon', 628: 'Galgomon', 629: 'Rapidmon_Armor', 630: 'Saint_Galgomon',
  631: 'V-mon', 632: 'XV-mon', 633: 'Paildramon', 634: 'Imperialdramon(Fighter_Mode)',
  635: 'Tentomon', 636: 'Kabuterimon', 637: 'Atlur_Kabuterimon_(Blue)', 638: 'Herakle_Kabuterimon',
  639: 'Palmon', 640: 'Togemon', 641: 'Lilimon', 642: 'Rosemon',
  643: 'Gomamon', 644: 'Ikkakumon', 645: 'Zudomon', 646: 'Vikemon',
  647: 'Patamon', 648: 'Angemon', 649: 'Holy_Angemon', 650: 'Seraphimon',
  651: 'Tailmon', 652: 'Angewomon', 653: 'Holydramon', 654: 'Ofanimon',
  655: 'Wormmon', 656: 'Stingmon', 657: 'Dinobeemon', 658: 'Gran_Kuwagamon',
  659: 'Hawkmon', 660: 'Aquilamon', 661: 'Silphymon', 662: 'Valkyrimon',
  663: 'Armadimon', 664: 'Ankylomon', 665: 'Shakkoumon', 666: 'Gankoomon',
  // 34 new creatures (667-700)
  667: 'Bancho_Leomon',   668: 'Saber_Leomon',     669: 'Durandamon',
  670: 'Lucemon_Falldown_Mode', 671: 'Dynasmon', 672: 'Susanoomon',
  673: 'Gaomon',          674: 'Gaogamon',         675: 'Mach_Gaogamon',
  676: 'Skull_Meramon',   677: 'Triceramon',       678: 'Gigadramon',
  679: 'Otamamon',        680: 'Mega_Seadramon',   681: 'Leviamon',
  682: 'Mamemon',         683: 'Magnamon',
  684: 'Parrotmon',       685: 'Karatenmon',
  686: 'Hi_Andromon',     687: 'Neo_Devimon',      688: 'Ryudamon',
  689: 'Monzaemon',       690: 'Sleipmon',
  691: 'Ornithmon',       692: 'Mirage_Gaogamon',  693: 'Shine_Greymon',
  694: 'Apocalymon',      695: 'Craniummon',       696: 'Omegamon',
  697: 'Demon',           698: 'Chaosdramon',      699: 'Barbamon',
  700: 'Imperialdramon',
};

// Trainer character sprites (Pokemon Showdown - open source)
const TRAINER_BASE = 'https://play.pokemonshowdown.com/sprites/trainers/';
export const TRAINER_SPRITES = [
  { id: 'red', name: '小赤', url: `${TRAINER_BASE}red.png` },
  { id: 'leaf', name: '小叶', url: `${TRAINER_BASE}green.png` },
  { id: 'brendan', name: '小遥', url: `${TRAINER_BASE}brendan.png` },
  { id: 'may', name: '小瑶', url: `${TRAINER_BASE}may.png` },
  { id: 'lucas', name: '小光', url: `${TRAINER_BASE}lucas.png` },
  { id: 'dawn', name: '小晨', url: `${TRAINER_BASE}dawn.png` },
  { id: 'hilbert', name: '希尔伯特', url: `${TRAINER_BASE}hilbert.png` },
  { id: 'hilda', name: '希尔达', url: `${TRAINER_BASE}hilda.png` },
  { id: 'nate', name: '纳特', url: `${TRAINER_BASE}nate.png` },
  { id: 'rosa', name: '罗莎', url: `${TRAINER_BASE}rosa.png` },
  { id: 'calem', name: '卡鲁穆', url: `${TRAINER_BASE}calem.png` },
  { id: 'serena', name: '塞蕾娜', url: `${TRAINER_BASE}serena.png` },
  { id: 'elio', name: '日尧', url: `${TRAINER_BASE}elio.png` },
  { id: 'selene', name: '月见', url: `${TRAINER_BASE}selene.png` },
  { id: 'victor', name: '维克托', url: `${TRAINER_BASE}victor.png` },
  { id: 'gloria', name: '格洛丽亚', url: `${TRAINER_BASE}gloria.png` },
  { id: 'cynthia', name: '竹兰', url: `${TRAINER_BASE}cynthia.png` },
  { id: 'steven', name: '大吾', url: `${TRAINER_BASE}steven.png` },
  { id: 'leon', name: '丹帝', url: `${TRAINER_BASE}leon.png` },
  { id: 'n', name: 'N', url: `${TRAINER_BASE}n.png` },
  { id: 'misty', name: '小霞', url: `${TRAINER_BASE}misty.png` },
  { id: 'brock', name: '小刚', url: `${TRAINER_BASE}brock.png` },
  { id: 'iris', name: '艾莉丝', url: `${TRAINER_BASE}iris.png` },
  { id: 'clair', name: '小椿', url: `${TRAINER_BASE}clair.png` },
];

// NPC / enemy trainer sprites keyed by role/keyword
export const NPC_SPRITES = {
  default: `${TRAINER_BASE}youngster.png`,
  professor: `${TRAINER_BASE}oak.png`,
  gym_grass: `${TRAINER_BASE}erika.png`,
  gym_water: `${TRAINER_BASE}misty.png`,
  gym_fire: `${TRAINER_BASE}blaine.png`,
  gym_electric: `${TRAINER_BASE}surge.png`,
  gym_fight: `${TRAINER_BASE}brawly.png`,
  gym_default: `${TRAINER_BASE}norman.png`,
  champion: `${TRAINER_BASE}cynthia.png`,
  challenge: `${TRAINER_BASE}grimsley.png`,
  rocket: `${TRAINER_BASE}archer.png`,
  eclipse: `${TRAINER_BASE}cyrus.png`,
  bugcatcher: `${TRAINER_BASE}bugcatcher.png`,
  fighter: `${TRAINER_BASE}blackbelt.png`,
  hiker: `${TRAINER_BASE}hiker.png`,
  fisher: `${TRAINER_BASE}fisherman.png`,
  lass: `${TRAINER_BASE}lass.png`,
  ace: `${TRAINER_BASE}acetrainer-gen4.png`,
  rival: `${TRAINER_BASE}blue.png`,
  beauty: `${TRAINER_BASE}beauty-gen4dp.png`,
  scientist: `${TRAINER_BASE}scientist.png`,
  psychic_m: `${TRAINER_BASE}psychic-gen4.png`,
  ranger: `${TRAINER_BASE}pokemonranger.png`,
  elder: `${TRAINER_BASE}gentleman.png`,
  sailor: `${TRAINER_BASE}sailor.png`,
  youngster: `${TRAINER_BASE}youngster.png`,
  picnicker: `${TRAINER_BASE}picnicker.png`,
  cooltrainer: `${TRAINER_BASE}cooltrainer.png`,
};

export function getNpcSprite(trainerName, battle) {
  if (!trainerName && !battle) return NPC_SPRITES.default;

  if (battle?.isGym) {
    switch (battle.mapId) {
      case 1: return NPC_SPRITES.gym_grass;
      case 2: return NPC_SPRITES.gym_water;
      case 3: return NPC_SPRITES.gym_fire;
      case 4: return NPC_SPRITES.gym_electric;
      case 5: return NPC_SPRITES.gym_fight;
      default: return NPC_SPRITES.gym_default;
    }
  }
  if (battle?.isChallenge) return NPC_SPRITES.challenge;

  const n = trainerName || '';
  if (n.includes('捕虫')) return NPC_SPRITES.bugcatcher;
  if (n.includes('功夫') || n.includes('格斗')) return NPC_SPRITES.fighter;
  if (n.includes('登山')) return NPC_SPRITES.hiker;
  if (n.includes('钓鱼')) return NPC_SPRITES.fisher;
  if (n.includes('火箭') || n.includes('日蚀')) return NPC_SPRITES.rocket;
  if (n.includes('馆主')) return NPC_SPRITES.gym_default;
  if (n.includes('冠军') || n.includes('首领')) return NPC_SPRITES.champion;
  if (n.includes('美女') || n.includes('淑女')) return NPC_SPRITES.beauty;
  if (n.includes('科学家') || n.includes('博士')) return NPC_SPRITES.scientist;
  if (n.includes('超能')) return NPC_SPRITES.psychic_m;
  if (n.includes('巡护')) return NPC_SPRITES.ranger;
  if (n.includes('老人') || n.includes('绅士')) return NPC_SPRITES.elder;
  if (n.includes('水手')) return NPC_SPRITES.sailor;

  // Random but deterministic based on name
  const pool = [NPC_SPRITES.youngster, NPC_SPRITES.lass, NPC_SPRITES.ace,
    NPC_SPRITES.picnicker, NPC_SPRITES.cooltrainer, NPC_SPRITES.ranger];
  let hash = 0;
  for (let i = 0; i < n.length; i++) hash = ((hash << 5) - hash) + n.charCodeAt(i);
  return pool[Math.abs(hash) % pool.length];
}

// 490 game IDs -> 490 unique National Dex IDs
// Verified: key Pokemon-named creatures match their correct sprites
const ID_TO_NATDEX = {
  1:1, 2:2, 3:3, 4:653, 5:654, 6:655, 7:129, 8:319, 9:321,
  10:114, 11:37, 12:38, 13:59, 14:324, 15:76, 16:661, 17:663, 18:607,
  19:609, 20:668, 21:349, 22:318, 23:130, 24:366, 25:99, 26:72, 27:73,
  28:580, 29:55, 30:875, 31:100, 32:807, 33:405, 34:81, 35:82, 36:587,
  37:642, 38:595, 39:596, 40:101, 41:225, 42:277, 43:628, 44:19, 45:20,
  46:300, 47:301, 48:684, 49:242, 50:217, 51:307, 52:308, 53:65, 54:355,
  55:353, 56:94, 57:96, 58:97, 59:354, 60:175, 61:176, 62:66, 63:68,
  64:74, 65:75, 66:50, 67:51, 68:27, 69:28, 70:447, 71:448, 72:297,
  73:142, 74:208, 75:89, 76:363, 77:364, 78:365, 79:147, 80:148, 81:373,
  82:443, 83:444, 84:445, 85:436, 86:437, 87:374, 88:375, 89:768, 90:478,
  91:144, 92:145, 93:146, 94:150, 95:800, 96:249, 97:250, 98:384, 99:383,
  100:382, 101:252, 102:253, 103:254, 104:390, 105:391, 106:392, 107:258, 108:259,
  109:658, 110:10, 111:11, 112:12, 113:41, 114:42, 115:43, 116:44, 117:45,
  118:52, 119:53, 120:54, 121:128, 122:241, 123:131, 124:132, 125:133, 126:134,
  127:135, 128:136, 129:196, 130:197, 131:137, 132:474, 133:138, 134:139, 135:140,
  136:141, 137:143, 138:149, 139:248, 140:376, 141:380, 142:483, 143:484, 144:487,
  145:488, 146:491, 147:251, 148:385, 149:386, 150:493, 151:151, 152:387, 153:388,
  154:389, 155:255, 156:256, 157:257, 158:393, 159:394, 160:395, 161:396, 162:397,
  163:398, 164:399, 165:400, 166:403, 167:404, 168:320, 169:409, 170:411, 171:416,
  172:417, 173:418, 174:419, 175:421, 176:423, 177:424, 178:429, 179:430, 180:431,
  181:435, 182:327, 183:329, 184:450, 185:452, 186:454, 187:460, 188:461, 189:462,
  190:464, 191:465, 192:466, 193:467, 194:468, 195:469, 196:470, 197:471, 198:472,
  199:473, 200:606, 201:218, 202:219, 203:361, 204:637, 205:304, 206:306, 207:302,
  208:92, 209:84, 210:85, 211:170, 212:171, 213:115, 214:237, 215:334, 216:635,
  217:669, 218:282, 219:88, 220:31, 221:605, 222:344, 223:123, 224:212, 225:557,
  226:703, 227:333, 228:22, 229:336, 230:110, 231:835, 232:832, 233:338, 234:621,
  235:160, 236:781, 237:678, 238:569, 239:168, 240:614, 241:486, 242:126, 243:615,
  244:381, 245:182, 246:224, 247:179, 248:553, 249:521, 250:337, 251:534, 252:632,
  253:379, 254:489, 255:93, 256:155, 257:35, 258:330, 259:95, 260:9, 261:83,
  262:180, 263:87, 264:69, 265:105, 266:63, 267:64, 268:23, 269:227, 270:57,
  271:14, 272:232, 273:36, 274:477, 275:485, 276:641, 277:24, 278:377, 279:79,
  280:15, 281:625, 282:113, 283:490, 284:200, 285:608, 286:156, 287:91, 288:362,
  289:303, 290:181, 291:80, 292:579, 293:46, 294:205, 295:29, 296:104, 297:111,
  298:62, 299:39, 300:335, 301:70, 302:157, 303:124, 304:239, 305:243, 306:305,
  307:30, 308:32, 309:292, 310:112, 311:185, 312:591, 313:215, 314:228, 315:260,
  316:47, 317:169, 318:71, 319:510, 320:33, 321:34, 322:220, 323:40, 324:233,
  325:222, 326:246, 327:48, 328:309, 329:102, 330:49, 331:410, 332:190, 333:122,
  334:310, 335:60, 336:163, 337:194, 338:325, 339:610, 340:152, 341:720, 342:549, 343:311,
  344:164, 345:247, 346:127, 347:356, 348:121, 349:167, 350:221, 351:61, 352:229,
  353:106, 354:177, 355:166, 356:211, 357:426, 358:86, 359:153, 360:173, 361:476,
  362:244, 363:312, 364:90, 365:299, 366:345, 367:178, 368:238, 369:700, 370:77,
  371:378, 372:719, 373:323, 374:340, 375:602, 376:455, 377:713, 378:711, 379:576, 380:545, 381:98, 382:475, 383:263, 384:187, 385:479, 386:78, 387:459, 388:442,
  389:530, 390:562, 391:193, 392:346, 393:207, 394:118, 395:582, 396:192, 397:154,
  398:188, 399:107, 400:199, 401:108, 402:597, 403:563, 404:592, 405:440, 406:438,
  407:189, 408:270, 409:119, 410:120, 411:598, 412:201, 413:204, 414:174, 415:494,
  416:599, 417:585, 418:586, 419:583, 420:316, 421:434, 422:522, 423:226, 424:524,
  425:513, 426:584, 427:613, 428:343, 429:202, 430:158, 431:492, 432:261, 433:262,
  434:359, 435:236, 436:67, 437:286, 438:165, 439:213, 440:265, 441:16, 442:17,
  443:18, 444:546, 445:547, 446:671, 447:371, 448:372, 449:611, 450:274, 451:275,
  452:332, 453:231, 454:290, 455:291, 456:183, 457:184, 458:214, 459:266, 460:296,
  461:453, 462:198, 463:342, 464:425, 465:267, 466:116, 467:230, 468:531, 469:594,
  470:451, 471:551, 472:13, 473:268, 474:186, 475:869, 476:600, 477:601, 478:590,
  479:543, 480:552, 481:209, 482:203, 483:159, 484:593, 485:328, 486:191, 487:523,
  488:624, 489:646, 490:674, 491:369, 492:525, 493:21, 494:544, 495:712, 496:758,
  497:527, 498:622, 499:526, 500:281,
  // 风系 501-515: 微风兔→Buneary, 旋风兔→Lopunny, 暴风王兔→Cinderace, 风铃鸟→Swablu, 疾风隼→Staraptor
  501:427, 502:428, 503:815, 504:287, 505:317, 506:441, 507:412, 508:413, 509:368, 510:401,
  // 风系续: 龙卷蛇→Serperior, 风刃螳螂→Scyther, 气旋松鼠→Emolga, 风行者→Absol, 暴风天使→Togekiss
  511:497, 512:117, 513:406, 514:289, 515:341,
  // 光系 516-530: 萤火虫→Volbeat, 光辉蛾→Beautifly, 圣光帝蛾→Volcarona, 晨光猫→Glameow, 日光猫→Espeon
  516:313, 517:264, 518:439, 519:326, 520:216,
  // 光系续: 太阳狮→Pyroar, 棱镜水晶→Carbink, 虹光宝石→Diancie, 光子→Porygon, 光束战士→Porygon-Z
  521:449, 522:456, 523:458, 524:161, 525:348,
  // 光系续: 极光狐→Ninetales, 圣光独角兽→Rapidash, 日轮鸟→Fletchinder, 光之精灵→Jirachi, 天照使者→Solgaleo
  526:7, 527:103, 528:662, 529:314, 530:791,
  // 恶系 531-540: 暗影鼠→Rattata, 暗夜狼→Mightyena, 冥王狼→Zoroark, 黑雾蝙蝠→Zubat, 暗翼魔蝠→Crobat
  531:4, 532:245, 533:571, 534:8, 535:195,
  // 恶系续: 暗影猫→Purrloin, 幽暗豹→Liepard, 诡计蛇→Arbok, 深渊鱼→Carvanha, 暗影武士→Bisharp
  536:509, 537:367, 538:5, 539:276, 540:432,
  // 火系 541-546: 火焰蜥→Salandit, 烈焰巨蜥→Salazzle, 火山幼龙→Bagon, 赤炎飞龙→Salamence, 仙人掌→Camerupt, 舞者→Oricorio
  541:757, 542:463, 543:293, 544:294, 545:280, 546:741,
  // 水系 547-552: 泡泡鱼→Luvdisc, 深海鲸→Wailord, 珊瑚→Corsola, 海礁兽→Barbaracle, 雨滴精→Castform, 海马骑士→Kingdra
  547:370, 548:278, 549:234, 550:689, 551:351, 552:235,
  // 草系 553-558: 种子球→Sunkern, 花丛兽→Grotle, 森之守护→Trevenant, 蘑菇→Shroomish, 仙人球→Cacnea, 莲叶蛙→Lombre
  553:210, 554:315, 555:709, 556:285, 557:331, 558:271,
  // 电系 559-563: 电火花→Mareep, 雷暴兽→Manectric, 电磁章鱼→Eelektross, 闪电鸟→Zapdos, 电浆兽→Galvantula
  559:206, 560:273, 561:604, 562:172, 563:414,
  // 冰系 564-568: 冰晶兔→Bunnelby, 冰霜麋鹿→Sawsbuck, 雪花精灵→Froslass, 冰川巨人→Avalugg, 寒霜狐→Glaceon
  564:659, 565:402, 566:350, 567:457, 568:347,
  // 格斗 569-573: 拳击猴→Mankey, 格斗猩猩→Passimian, 武道家→Sawk, 铁拳蟹→Kingler, 相扑力士→Hariyama
  569:56, 570:766, 571:539, 572:109, 573:272,
  // 毒系 574-577: 毒菇→Foongus, 瘴气菇王→Amoonguss, 剧毒蛙→Toxicroak, 毒刺海胆→Toxapex
  574:407, 575:408, 576:339, 577:748,
  // 地面 578-581: 钻地鼹→Diglett, 地震犰狳→Sandshrew, 沙丘虫→Trapinch, 大地鲶鱼→Whiscash
  578:25, 579:6, 580:283, 581:288,
  // 飞行 582-584: 气球鸟→Drifloon, 风暴鹰→Braviary, 天空鲸→Wailord
  582:322, 583:433, 584:279,
  // 超能力 585-587: 念力球→Solosis, 心灵术士→Alakazam, 星象师→Sigilyph
  585:577, 586:26, 587:561,
  // 虫系 588-590: 宝石甲虫→Heracross, 钻石独角仙→Pinsir, 丝绸蛾→Dustox
  588:223, 589:125, 590:269,
  // 岩石 591-593: 小石头→Geodude, 巨岩兽→Regirock, 化石翼龙→Aerodactyl
  591:58, 592:298, 593:162,
  // 幽灵 594-596: 蜡烛幽灵→Litwick, 灯笼鬼→Chandelure, 幽灵骑士→Aegislash
  594:415, 595:420, 596:681,
  // 龙系 597-599: 小飞龙→Axew, 翡翠龙→Flygon, 星辰龙→Palkia
  597:422, 598:284, 599:352,
  // 钢系 600: 机械天使→Metagross
  600:295,
  // 神兽 601-610: 岚神→Tornadus, 苍穹凤凰→Ho-Oh, 真空之主→Landorus, 天照→Solgaleo, 极光天使→Xerneas
  601:446, 602:240, 603:645, 604:480, 605:716,
  // 神兽续: 棱镜圣兽→Silvally, 创世之光→Arceus, 冥渊魔王→Giratina, 暗影刺客→Darkrai, 永夜之主→Yveltal
  606:773, 607:360, 608:357, 609:358, 610:717,
  // 新精灵 667-700 (PokeAPI fallback)
  667:403, 668:448, 669:475, 670:344, 671:376, 672:373,
  673:453, 674:452, 675:454, 676:58, 677:464, 678:445,
  679:349, 680:350, 681:130, 682:299, 683:719, 684:587,
  685:628, 686:376, 687:571, 688:362, 689:530, 690:637,
  691:250, 692:491, 693:257, 694:487, 695:638, 696:384,
  697:452, 698:483, 699:482, 700:493,
};

const TYPE_FALLBACK = {
  NORMAL: [133, 143, 242, 289, 474],
  FIRE: [4, 37, 77, 255, 257],
  WATER: [7, 54, 131, 134, 245],
  GRASS: [1, 152, 182, 252, 470],
  ELECTRIC: [25, 135, 310, 403, 587],
  ICE: [131, 144, 361, 471, 478],
  FIGHT: [66, 237, 297, 447, 448],
  POISON: [23, 73, 89, 169, 452],
  GROUND: [27, 50, 232, 383, 450],
  FLYING: [18, 142, 249, 277, 628],
  PSYCHIC: [65, 151, 196, 282, 376],
  BUG: [10, 12, 123, 212, 637],
  ROCK: [74, 76, 142, 248, 377],
  GHOST: [92, 94, 354, 355, 478],
  DRAGON: [147, 149, 334, 384, 445],
  DARK: [197, 248, 359, 430, 491],
  STEEL: [208, 376, 379, 437, 462],
  FAIRY: [35, 175, 282, 468, 700],
  HEAL: [242, 113, 440, 468, 282],
  GOD: [150, 249, 382, 384, 493],
  WIND: [333, 398, 468, 547, 641],
  LIGHT: [196, 313, 668, 703, 791],
};

export function getSpriteUrl(pet) {
  if (!pet) return null;
  const digiName = ID_TO_DIGIMON[pet.id];
  if (digiName) return `${DIGIMON_BASE}${digiName}.png`;
  const natdex = ID_TO_NATDEX[pet.id];
  if (natdex) return `${SPRITE_BASE}${natdex}${SPRITE_EXT}`;

  const fallbacks = TYPE_FALLBACK[pet.type] || TYPE_FALLBACK.NORMAL;
  const idx = pet.id % fallbacks.length;
  return `${SPRITE_BASE}${fallbacks[idx]}${SPRITE_EXT}`;
}

export function getSpriteFallbackUrls(pet) {
  if (!pet) return [];
  const digiName = ID_TO_DIGIMON[pet.id];
  if (digiName) return [`${DIGIMON_BASE}${digiName}.png`];
  const natdex = ID_TO_NATDEX[pet.id];
  const id = natdex || ((TYPE_FALLBACK[pet.type] || TYPE_FALLBACK.NORMAL)[pet.id % (TYPE_FALLBACK[pet.type] || TYPE_FALLBACK.NORMAL).length]);
  return SPRITE_CDNS.map(cdn => `${cdn}${id}${SPRITE_EXT}`);
}
