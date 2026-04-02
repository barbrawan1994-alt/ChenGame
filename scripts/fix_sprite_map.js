#!/usr/bin/env node
// Fix SpriteMap: swap NatDex IDs so creature names match their sprites
// Strategy: keep current unique mapping, swap specific entries to fix mismatches

// Current mapping from SpriteMap.js (the one with 0 duplicates)
const CURRENT = {
  1:1, 2:2, 3:3, 4:653, 5:654, 6:655, 7:129, 8:319, 9:321,
  10:114, 11:37, 12:38, 13:59, 14:324, 15:76, 16:255, 17:663, 18:607,
  19:609, 20:668, 21:349, 22:318, 23:130, 24:366, 25:99, 26:72, 27:73,
  28:54, 29:55, 30:393, 31:100, 32:403, 33:405, 34:101, 35:82, 36:587,
  37:642, 38:595, 39:596, 40:462, 41:225, 42:277, 43:628, 44:19, 45:20,
  46:52, 47:53, 48:684, 49:242, 50:143, 51:307, 52:308, 53:65, 54:355,
  55:353, 56:94, 57:96, 58:97, 59:354, 60:175, 61:176, 62:66, 63:68,
  64:74, 65:75, 66:50, 67:51, 68:27, 69:28, 70:447, 71:448, 72:297,
  73:142, 74:208, 75:89, 76:363, 77:364, 78:365, 79:147, 80:148, 81:149,
  82:443, 83:444, 84:445, 85:436, 86:437, 87:374, 88:375, 89:376, 90:478,
  91:144, 92:145, 93:146, 94:150, 95:151, 96:249, 97:250, 98:384, 99:383,
  100:382, 101:252, 102:253, 103:254, 104:390, 105:391, 106:392, 107:258, 108:259,
  109:260, 110:10, 111:11, 112:12, 113:41, 114:42, 115:43, 116:44, 117:45,
  118:4, 119:5, 120:7, 121:128, 122:241, 123:131, 124:132, 125:133, 126:134,
  127:135, 128:136, 129:196, 130:197, 131:137, 132:233, 133:138, 134:139, 135:140,
  136:141, 137:6, 138:117, 139:248, 140:81, 141:380, 142:483, 143:484, 144:487,
  145:488, 146:491, 147:251, 148:385, 149:386, 150:493, 151:26, 152:387, 153:388,
  154:389, 155:58, 156:77, 157:78, 158:8, 159:394, 160:395, 161:396, 162:397,
  163:398, 164:399, 165:400, 166:25, 167:404, 168:125, 169:409, 170:411, 171:416,
  172:417, 173:418, 174:419, 175:421, 176:449, 177:424, 178:429, 179:430, 180:431,
  181:435, 182:329, 183:56, 184:450, 185:452, 186:454, 187:460, 188:461, 189:172,
  190:464, 191:465, 192:466, 193:467, 194:468, 195:469, 196:470, 197:471, 198:472,
  199:473, 200:344, 201:218, 202:219, 203:361, 204:637, 205:304, 206:306, 207:302,
  208:92, 209:84, 210:85, 211:170, 212:171, 213:115, 214:237, 215:334, 216:635,
  217:669, 218:282, 219:88, 220:31, 221:605, 222:606, 223:123, 224:212, 225:557,
  226:703, 227:333, 228:22, 229:336, 230:110, 231:835, 232:832, 233:338, 234:621,
  235:160, 236:781, 237:678, 238:569, 239:168, 240:614, 241:289, 242:126, 243:615,
  244:373, 245:182, 246:224, 247:179, 248:553, 249:521, 250:337, 251:534, 252:632,
  253:379, 254:489, 255:93, 256:155, 257:35, 258:330, 259:95, 260:9, 261:83,
  262:180, 263:87, 264:69, 265:105, 266:63, 267:64, 268:23, 269:227, 270:57,
  271:14, 272:232, 273:36, 274:477, 275:485, 276:641, 277:24, 278:377, 279:79,
  280:15, 281:625, 282:113, 283:490, 284:200, 285:608, 286:156, 287:91, 288:362,
  289:303, 290:181, 291:80, 292:579, 293:46, 294:205, 295:29, 296:104, 297:111,
  298:62, 299:39, 300:335, 301:70, 302:157, 303:124, 304:239, 305:243, 306:305,
  307:30, 308:32, 309:292, 310:112, 311:185, 312:591, 313:215, 314:228, 315:658,
  316:47, 317:169, 318:71, 319:510, 320:33, 321:34, 322:220, 323:40, 324:474,
  325:222, 326:246, 327:48, 328:309, 329:102, 330:49, 331:410, 332:190, 333:122,
  334:310, 335:60, 336:163, 337:194, 338:325, 339:610, 340:152, 342:152, 343:311,
  344:164, 345:247, 346:127, 347:356, 348:121, 349:167, 350:221, 351:61, 352:229,
  353:106, 354:177, 355:166, 356:211, 357:426, 358:86, 359:153, 360:173, 361:476,
  362:244, 363:312, 364:90, 365:299, 366:345, 367:178, 368:238, 369:700, 370:256,
  371:378, 381:98, 382:475, 383:263, 384:187, 385:479, 386:257, 387:459, 388:442,
  389:530, 390:562, 391:193, 392:346, 393:207, 394:118, 395:582, 396:192, 397:154,
  398:188, 399:107, 400:199, 401:108, 402:597, 403:563, 404:592, 405:440, 406:438,
  407:189, 408:270, 409:119, 410:120, 411:598, 412:201, 413:204, 414:174, 415:494,
  416:599, 417:585, 418:586, 419:583, 420:316, 421:434, 422:522, 423:226, 424:524,
  425:513, 426:584, 427:613, 428:343, 429:202, 430:158, 431:492, 432:261, 433:262,
  434:359, 435:236, 436:67, 437:286, 438:165, 439:213, 440:265, 441:16, 442:17,
  443:18, 444:546, 445:547, 446:549, 447:371, 448:372, 449:611, 450:274, 451:275,
  452:332, 453:231, 454:290, 455:291, 456:183, 457:184, 458:214, 459:266, 460:296,
  461:453, 462:198, 463:342, 464:425, 465:267, 466:116, 467:230, 468:531, 469:594,
  470:451, 471:551, 472:13, 473:268, 474:186, 475:869, 476:600, 477:601, 478:590,
  479:543, 480:552, 481:209, 482:203, 483:159, 484:593, 485:328, 486:191, 487:523,
  488:624, 489:646, 490:674, 491:369, 492:525, 493:21, 494:544, 495:712, 496:758,
  497:527, 498:622, 499:526, 500:281,
};

// DESIRED mapping fixes: gameId -> wanted NatDex
// These are corrections where creature names should match specific Pokemon
const FIXES = {
  // 118: 喵喵 MUST be Meowth (52) - currently shows Charmander (4)
  118: 52,
  // 119: 猫老大 MUST be Persian (53) - currently shows Charmeleon (5)
  119: 53,
  // 120: 可达鸭 MUST be Psyduck (54) - already correct at 28, swap needed
  120: 54,
  // 28: 呆呆鸭 (Silly Duck) -> Golduck (55) - already correct!
  // 29: 念力鸭皇 -> Alakazam (65) - already correct!
  // 137: 卡比兽 = Snorlax (143) - currently 6 (Charizard)
  137: 143,
  // 50: 瞌睡熊 = Snorlax-like -> Slaking (289) - currently 143 (Snorlax)
  // After 137 takes 143, 50 should get Slaking
  50: 289,
  // 138: 快龙 = Dragonite (149) - currently 117 (Seadra)
  138: 149,
  // 81: 守护神龙 -> was 149 (Dragonite), now needs something else. Use Salamence (373)
  81: 373,
  // 155: 小火焰猴 -> Chimchar... but 104 already has 390. Use Torchic (255)
  155: 255,
  // 156: 猛火猴 -> Combusken (256)
  156: 256,
  // 157: 烈焰猴 -> Blaziken (257)
  157: 257,
  // 158: 波加曼 -> Piplup (393) - currently 8 (Wartortle)
  158: 393,
  // 30: 冰晶企鹅 was 393 (Piplup), now needs something else. Eiscue (875)
  30: 875,
  // 109: 忍蛙 -> Greninja (658) - currently 260 (Swampert)
  109: 658,
  // 315: 影流之主 was 658, swap to Toxicroak or similar
  // Game 315 doesn't exist in current map, so no conflict
  // 140: 巨金怪 -> Metagross (376) - currently 81 (Magnemite)
  140: 376,
  // 89: 合金巨蟹 was 376 -> use Scizor (212)
  // But wait, 212 might be used. Let me check... game 224 uses 212. 
  // Use Genesect (649) instead
  89: 649,
  // 34: 插头怪 -> should keep 101 (Electrode) or get Magnemite (81)
  34: 81,
  // 40: 超能电池 was 462 -> Ferroseed (597) .. game 402 has 597. Use Magneton (82)
  // 35 already has 82. Use Probopass (476) for game 40
  // Actually let me not fix every single one. Let me focus on the MOST IMPORTANT ones.
  
  // 166: 小猫怪 = Shinx (403) - currently 25 (Pikachu)!
  166: 403,
  // 32: 闪电猫 was 403 -> use Pikachu (25)
  32: 25,
  // 167: 勒克猫 = Luxio (404) - already correct!
  // 168: 伦琴猫 = Luxray (405) - currently 125 (Electabuzz)
  168: 405,
  // 33: 雷霆狮王 was 405 -> use Electabuzz (125)
  33: 125,
  // 182: 烈咬陆鲨 = Garchomp (445) - currently 329 (Vibrava)
  182: 445,
  // 84: 陆地狂鲨 was 445 -> use Vibrava (329)
  84: 329,
  // 183: 路卡利欧 = Lucario (448) - currently 56 (Mankey)
  183: 448,
  // 71: 波导勇者 was 448 -> Mankey (56) is fine for fighting type
  71: 56,
  // 189: 自爆磁怪 = Magnezone (462) - currently 172 (Pichu)
  189: 462,
  // 40: 超能电池 was 462 -> Pichu (172) 
  40: 172,
  // 151: 梦幻 = Mew (151) - currently 26 (Raichu)
  151: 151,
  // 241: 懒惰王 was 289 -> Raichu... no. Use Snorlax... taken. Use Slaking... 
  // Wait, game 50 now gets 289 (Slaking), and game 241 (懒惰王=Lazy King) was 289 before.
  // After 50 takes 289, game 241 needs something else. Use Regigigas (486)
  241: 486,
  // 200: 大宇怪 -> Beheeyem (606) - currently 344 (Claydol)
  200: 606,
  // 222: 念力王 was 606 -> Claydol (344)
  222: 344,
  // Game 176 海兔兽 -> Gastrodon (423) instead of 449
  176: 423,
  // Game 184 already has 450, fine
  // 132: 多边兽Z -> Porygon-Z (474) - currently 233 (Porygon2, close but not exact)
  132: 474,
  // 324 was 474, needs new value
  324: 233,
  // Fix duplicate: game 340 and 342 both map to 152. Game 342 花神(Grass) -> use Lilligant (549)
  342: 549,
  // Game 446 was 549, needs new value -> Florges (671)
  446: 671,
  // Also fix some swapped-in bad matches:
  // Game 46 幸运猫 got 4 (Charmander) from swap - should be cat: Skitty (300)
  46: 300,
  // Game 47 贵族猫 got 5 (Charmeleon) - should be cat: Delcatty (301)
  47: 301,
  // Game 28 呆呆鸭 got 7 (Squirtle) from swap - should be duck: Ducklett (580)
  28: 580,
  // Game 7 泡泡鱼 was bumped to 129 which is ok (Magikarp)
  // Game 95 幻之基因 got 26 (Raichu) from swap - should be Psychic: Mew (151) is taken, use Deoxys-like: Necrozma (800)
  95: 800,
  // Game 16 小火雀 got 58 (Growlithe) from swap - should be bird: Fletchling (661)
  16: 661,
  // Game 244 妖精龙 got 117 (Seadra) - should be Dragon: use Latios (381)
  244: 381,
};

// Apply fixes with swapping
const result = {...CURRENT};

for (const [gameIdStr, wantedNatDex] of Object.entries(FIXES)) {
  const gameId = parseInt(gameIdStr);
  const currentNatDex = result[gameId];
  
  if (currentNatDex === wantedNatDex) continue; // Already correct
  
  // Find who currently has the wanted NatDex
  let conflictGameId = null;
  for (const [gid, ndex] of Object.entries(result)) {
    if (ndex === wantedNatDex && parseInt(gid) !== gameId) {
      conflictGameId = parseInt(gid);
      break;
    }
  }
  
  if (conflictGameId !== null) {
    // Check if we have a specific fix for the conflict too
    if (FIXES[conflictGameId] !== undefined) {
      // The conflict will be resolved by its own fix entry
      result[gameId] = wantedNatDex;
      // Only swap if the conflict's desired value hasn't been set yet
    } else {
      // Swap: conflicting game gets our old value
      result[conflictGameId] = currentNatDex;
      result[gameId] = wantedNatDex;
    }
  } else {
    result[gameId] = wantedNatDex;
  }
}

// Verify no duplicates
const allNatDex = Object.values(result);
const dupes = allNatDex.filter((v, i) => allNatDex.indexOf(v) !== i);
if (dupes.length > 0) {
  console.error("DUPLICATES FOUND:", [...new Set(dupes)]);
  // Find which game IDs have duplicates
  for (const d of new Set(dupes)) {
    const ids = Object.entries(result).filter(([,v]) => v === d).map(([k]) => k);
    console.error(`  NatDex ${d} used by game IDs: ${ids.join(', ')}`);
  }
} else {
  console.log("✅ No duplicates! All", Object.keys(result).length, "mappings are unique.");
}

// Format output
const entries = Object.entries(result)
  .sort(([a], [b]) => parseInt(a) - parseInt(b))
  .map(([k, v]) => `${k}:${v}`);

// Group into lines of 9
const lines = [];
for (let i = 0; i < entries.length; i += 9) {
  lines.push('  ' + entries.slice(i, i + 9).join(', ') + ',');
}

console.log('\nconst ID_TO_NATDEX = {');
console.log(lines.join('\n'));
console.log('};');

// Print key fixes applied
console.log('\n// Key fixes applied:');
for (const [gid, ndex] of Object.entries(FIXES)) {
  const old = CURRENT[parseInt(gid)];
  if (old !== ndex) {
    console.log(`// Game#${gid}: ${old} -> ${ndex}`);
  }
}
