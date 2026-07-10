#!/usr/bin/env node
/*
 * Converts the existing Electron/React data modules into a Unity JsonUtility-friendly payload.
 * No gameplay source is duplicated: this adapter evaluates the authoritative data modules through Babel.
 */
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const root = path.resolve(__dirname, '..');
const originalJsLoader = require.extensions['.js'];
require.extensions['.js'] = (module, filename) => {
  if (!filename.startsWith(path.join(root, 'src'))) return originalJsLoader(module, filename);
  const result = babel.transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    sourceType: 'unambiguous',
    presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }]],
  });
  module._compile(result.code, filename);
};

const mapsModule = require(path.join(root, 'src/data/maps.js'));
const petsModule = require(path.join(root, 'src/data/pets.js'));
const skillsModule = require(path.join(root, 'src/data/skills.js'));
const typesModule = require(path.join(root, 'src/data/types.js'));

const typeColors = {
  NORMAL:'#90A4AE', FIRE:'#FF7043', WATER:'#42A5F5', GRASS:'#66BB6A', ELECTRIC:'#FFD54F',
  ICE:'#80DEEA', FIGHT:'#EF5350', POISON:'#AB47BC', GROUND:'#C9A66B', FLYING:'#7E9DE7',
  PSYCHIC:'#EC407A', BUG:'#9CCC65', ROCK:'#A1887F', GHOST:'#7E57C2', DRAGON:'#5C6BC0',
  DARK:'#5D536B', STEEL:'#78909C', FAIRY:'#F48FB1', WIND:'#4DD0E1', LIGHT:'#FFF176',
  HEAL:'#26A69A', COSMIC:'#7C4DFF', SOUND:'#26C6DA', GOD:'#FFC857', TIME:'#8C9EFF', CHAOS:'#8D6E63'
};
const typeNames = {
  NORMAL:'普通', FIRE:'火', WATER:'水', GRASS:'草', ELECTRIC:'电', ICE:'冰', FIGHT:'格斗',
  POISON:'毒', GROUND:'地面', FLYING:'飞行', PSYCHIC:'超能', BUG:'虫', ROCK:'岩石', GHOST:'幽灵',
  DRAGON:'龙', DARK:'暗', STEEL:'钢', FAIRY:'妖精', WIND:'风', LIGHT:'光', HEAL:'治愈',
  COSMIC:'宇宙', SOUND:'音', GOD:'神', TIME:'时间', CHAOS:'混沌'
};

const rawMaps = Array.isArray(mapsModule.MAPS) ? mapsModule.MAPS : [];
const rawPets = Array.isArray(petsModule.POKEDEX)
  ? petsModule.POKEDEX
  : Object.values(petsModule).filter(Array.isArray).flat();
const rawSkills = skillsModule.SKILL_DB || {};
const rawTypes = Array.isArray(typesModule.TYPES) ? typesModule.TYPES : Object.keys(rawSkills);

const maps = rawMaps
  .filter(map => map && Number.isFinite(Number(map.id)))
  .map(map => ({
    id: Number(map.id),
    name: String(map.name || `区域 ${map.id}`),
    biome: String(map.type || 'grass'),
    color: String(map.color || '#4D9F68'),
    minLevel: Number(Array.isArray(map.lvl) ? map.lvl[0] : 1) || 1,
    maxLevel: Number(Array.isArray(map.lvl) ? map.lvl[1] : 10) || 10,
    pool: [...new Set([...(map.pool || []), ...(map.exclusivePool || [])])].map(Number).filter(Number.isFinite),
    description: String(map.desc || map.description || ''),
  }));

const petsById = new Map();
for (const pet of rawPets) {
  if (!pet || !Number.isFinite(Number(pet.id))) continue;
  petsById.set(Number(pet.id), {
    id: Number(pet.id),
    name: String(pet.name || `精灵 ${pet.id}`),
    type: String(pet.type || 'NORMAL').toUpperCase(),
    emoji: String(pet.emoji || '灵'),
    hp: Number(pet.hp) || 50,
    atk: Number(pet.atk) || 50,
    def: Number(pet.def) || 50,
  });
}
const pets = [...petsById.values()].sort((a, b) => a.id - b.id);

const skills = [];
for (const [type, entries] of Object.entries(rawSkills)) {
  if (!Array.isArray(entries)) continue;
  for (const skill of entries) {
    if (!skill || !skill.name) continue;
    skills.push({
      name: String(skill.name),
      type: String(skill.t || type || 'NORMAL').toUpperCase(),
      power: Number(skill.p) || 0,
      pp: Number(skill.pp) || 10,
      accuracy: Number(skill.acc) || 100,
      description: String(skill.desc || ''),
    });
  }
}

const typeIds = [...new Set([
  ...rawTypes.map(value => typeof value === 'string' ? value : value?.id).filter(Boolean),
  ...Object.keys(rawSkills),
  ...pets.map(pet => pet.type),
])].map(String).map(id => id.toUpperCase()).sort();
const types = typeIds.map(id => ({ id, displayName: typeNames[id] || id, color: typeColors[id] || '#90A4AE' }));

const payload = {
  schemaVersion: 1,
  source: 'ChenGame Electron authoritative data modules',
  generatedAt: new Date().toISOString(),
  maps,
  pets,
  skills,
  types,
};

const output = path.join(root, 'UnityClient/Assets/StreamingAssets/SuperSpirit/game-data.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`[Unity export] ${maps.length} maps, ${pets.length} pets, ${skills.length} skills, ${types.length} types`);
console.log(`[Unity export] wrote ${path.relative(root, output)} (${(fs.statSync(output).size / 1024).toFixed(1)} KiB)`);
