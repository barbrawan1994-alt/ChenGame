using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace SuperSpirit.Data
{
    public sealed class GameDatabase
    {
        private readonly Dictionary<int, PetRecord> petsById = new();
        private readonly Dictionary<string, List<SkillRecord>> skillsByType = new(StringComparer.OrdinalIgnoreCase);

        public GameDatabasePayload Payload { get; private set; }
        public bool LoadedExternalData { get; private set; }
        public string LoadMessage { get; private set; }

        public static GameDatabase Load()
        {
            GameDatabase database = new();
            database.LoadInternal();
            return database;
        }

        public PetRecord GetPet(int id)
        {
            return petsById.TryGetValue(id, out PetRecord pet) ? pet : null;
        }

        public PetRecord GetRandomEncounter(int mapId, System.Random random)
        {
            MapRecord map = Array.Find(Payload.maps, item => item.id == mapId) ?? Payload.maps[0];
            if (map.pool != null && map.pool.Length > 0)
            {
                for (int attempt = 0; attempt < Math.Min(12, map.pool.Length); attempt++)
                {
                    PetRecord candidate = GetPet(map.pool[random.Next(map.pool.Length)]);
                    if (candidate != null) return candidate;
                }
            }

            return Payload.pets[random.Next(Payload.pets.Length)];
        }

        public SkillRecord[] GetSkillsFor(string type, int count = 4)
        {
            List<SkillRecord> result = new(count);
            AddSkills(type, result, count);
            AddSkills("NORMAL", result, count);

            if (result.Count == 0)
                result.AddRange(CreateFallback().skills);

            while (result.Count > count)
                result.RemoveAt(result.Count - 1);
            return result.ToArray();
        }

        public MapRecord GetMap(int id)
        {
            return Array.Find(Payload.maps, map => map.id == id) ?? Payload.maps[0];
        }

        private void AddSkills(string type, List<SkillRecord> result, int count)
        {
            if (string.IsNullOrWhiteSpace(type) || !skillsByType.TryGetValue(type, out List<SkillRecord> skills)) return;
            for (int i = 0; i < skills.Count && result.Count < count; i++)
            {
                if (skills[i].power <= 0 || result.Exists(existing => existing.name == skills[i].name)) continue;
                result.Add(skills[i]);
            }
        }

        private void LoadInternal()
        {
            string path = Path.Combine(Application.streamingAssetsPath, "SuperSpirit", "game-data.json");
            try
            {
                if (File.Exists(path))
                {
                    string json = File.ReadAllText(path);
                    Payload = JsonUtility.FromJson<GameDatabasePayload>(json);
                    LoadedExternalData = Payload != null && Payload.maps?.Length > 0 && Payload.pets?.Length > 0;
                    LoadMessage = LoadedExternalData
                        ? $"已接入旧版数据：{Payload.maps.Length} 张地图 / {Payload.pets.Length} 只精灵 / {Payload.skills.Length} 个技能"
                        : "旧版数据文件为空，已启用内置垂直切片数据";
                }
            }
            catch (Exception exception)
            {
                Debug.LogWarning($"[SuperSpirit] 旧版数据读取失败，将使用安全回退：{exception.Message}");
                LoadMessage = "旧版数据读取失败，已启用安全回退";
            }

            if (!LoadedExternalData)
                Payload = CreateFallback();

            IndexData();
        }

        private void IndexData()
        {
            petsById.Clear();
            skillsByType.Clear();
            foreach (PetRecord pet in Payload.pets)
                petsById[pet.id] = pet;

            foreach (SkillRecord skill in Payload.skills)
            {
                string key = string.IsNullOrWhiteSpace(skill.type) ? "NORMAL" : skill.type;
                if (!skillsByType.TryGetValue(key, out List<SkillRecord> list))
                {
                    list = new List<SkillRecord>();
                    skillsByType[key] = list;
                }
                list.Add(skill);
            }
        }

        private static GameDatabasePayload CreateFallback()
        {
            return new GameDatabasePayload
            {
                source = "Unity native fallback",
                maps = new[]
                {
                    new MapRecord { id = 1, name = "晨雾原野", biome = "grass", color = "#4D9F68", minLevel = 3, maxLevel = 8, pool = new[] { 4, 15, 31 }, description = "旧版地图体系的 Unity 原生探索样板。" }
                },
                pets = new[]
                {
                    new PetRecord { id = 4, name = "灵火狐", type = "FIRE", emoji = "狐", hp = 58, atk = 64, def = 48 },
                    new PetRecord { id = 15, name = "晶岩兽", type = "ROCK", emoji = "岩", hp = 72, atk = 58, def = 82 },
                    new PetRecord { id = 31, name = "电光貂", type = "ELECTRIC", emoji = "电", hp = 52, atk = 67, def = 45 }
                },
                skills = new[]
                {
                    new SkillRecord { name = "火花突袭", type = "FIRE", power = 40, pp = 25, accuracy = 100, description = "裹挟火花冲向对手。" },
                    new SkillRecord { name = "烈焰爪", type = "FIRE", power = 65, pp = 15, accuracy = 95, description = "近距离撕裂并引燃目标。" },
                    new SkillRecord { name = "碎岩冲击", type = "ROCK", power = 55, pp = 20, accuracy = 100, description = "以岩甲撞击对手。" },
                    new SkillRecord { name = "迅捷撞击", type = "NORMAL", power = 45, pp = 30, accuracy = 100, description = "可靠的快速攻击。" }
                },
                types = new[]
                {
                    new TypeRecord { id = "FIRE", displayName = "火", color = "#FF7043" },
                    new TypeRecord { id = "ROCK", displayName = "岩", color = "#A1887F" }
                }
            };
        }
    }
}
