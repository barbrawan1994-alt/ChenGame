using System;

namespace SuperSpirit.Data
{
    [Serializable]
    public sealed class GameDatabasePayload
    {
        public int schemaVersion = 1;
        public string source = "built-in";
        public string generatedAt = "";
        public MapRecord[] maps = Array.Empty<MapRecord>();
        public PetRecord[] pets = Array.Empty<PetRecord>();
        public SkillRecord[] skills = Array.Empty<SkillRecord>();
        public TypeRecord[] types = Array.Empty<TypeRecord>();
    }

    [Serializable]
    public sealed class MapRecord
    {
        public int id;
        public string name;
        public string biome;
        public string color;
        public int minLevel;
        public int maxLevel;
        public int[] pool = Array.Empty<int>();
        public string description;
    }

    [Serializable]
    public sealed class PetRecord
    {
        public int id;
        public string name;
        public string type;
        public string emoji;
        public int hp;
        public int atk;
        public int def;
    }

    [Serializable]
    public sealed class SkillRecord
    {
        public string name;
        public string type;
        public int power;
        public int pp;
        public int accuracy = 100;
        public string description;
    }

    [Serializable]
    public sealed class TypeRecord
    {
        public string id;
        public string displayName;
        public string color;
    }
}
