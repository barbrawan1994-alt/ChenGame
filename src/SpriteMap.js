const SPRITE_CDNS = [
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/',
];
const SPRITE_BASE = SPRITE_CDNS[0];
const SPRITE_EXT = '.png';

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
  28:580, 29:55, 30:875, 31:100, 32:25, 33:125, 34:81, 35:82, 36:587,
  37:642, 38:595, 39:596, 40:172, 41:225, 42:277, 43:628, 44:19, 45:20,
  46:300, 47:301, 48:684, 49:242, 50:289, 51:307, 52:308, 53:65, 54:355,
  55:353, 56:94, 57:96, 58:97, 59:354, 60:175, 61:176, 62:66, 63:68,
  64:74, 65:75, 66:50, 67:51, 68:27, 69:28, 70:447, 71:56, 72:297,
  73:142, 74:208, 75:89, 76:363, 77:364, 78:365, 79:147, 80:148, 81:373,
  82:443, 83:444, 84:329, 85:436, 86:437, 87:374, 88:375, 89:649, 90:478,
  91:144, 92:145, 93:146, 94:150, 95:800, 96:249, 97:250, 98:384, 99:383,
  100:382, 101:252, 102:253, 103:254, 104:390, 105:391, 106:392, 107:258, 108:259,
  109:658, 110:10, 111:11, 112:12, 113:41, 114:42, 115:43, 116:44, 117:45,
  118:52, 119:53, 120:54, 121:128, 122:241, 123:131, 124:132, 125:133, 126:134,
  127:135, 128:136, 129:196, 130:197, 131:137, 132:474, 133:138, 134:139, 135:140,
  136:141, 137:143, 138:149, 139:248, 140:376, 141:380, 142:483, 143:484, 144:487,
  145:488, 146:491, 147:251, 148:385, 149:386, 150:493, 151:151, 152:387, 153:388,
  154:389, 155:255, 156:256, 157:257, 158:393, 159:394, 160:395, 161:396, 162:397,
  163:398, 164:399, 165:400, 166:403, 167:404, 168:405, 169:409, 170:411, 171:416,
  172:417, 173:418, 174:419, 175:421, 176:423, 177:424, 178:429, 179:430, 180:431,
  181:435, 182:445, 183:448, 184:450, 185:452, 186:454, 187:460, 188:461, 189:462,
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
};

export function getSpriteUrl(pet) {
  if (!pet) return null;
  const natdex = ID_TO_NATDEX[pet.id];
  if (natdex) return `${SPRITE_BASE}${natdex}${SPRITE_EXT}`;

  const fallbacks = TYPE_FALLBACK[pet.type] || TYPE_FALLBACK.NORMAL;
  const idx = pet.id % fallbacks.length;
  return `${SPRITE_BASE}${fallbacks[idx]}${SPRITE_EXT}`;
}

export function getSpriteFallbackUrls(pet) {
  if (!pet) return [];
  const natdex = ID_TO_NATDEX[pet.id];
  const id = natdex || ((TYPE_FALLBACK[pet.type] || TYPE_FALLBACK.NORMAL)[pet.id % (TYPE_FALLBACK[pet.type] || TYPE_FALLBACK.NORMAL).length]);
  return SPRITE_CDNS.map(cdn => `${cdn}${id}${SPRITE_EXT}`);
}
