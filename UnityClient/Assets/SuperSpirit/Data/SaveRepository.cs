using System;
using System.IO;
using UnityEngine;

namespace SuperSpirit.Data
{
    [Serializable]
    public sealed class UnitySaveData
    {
        public int schemaVersion = 1;
        public string importedLegacySaveVersion = "";
        public string trainerName = "训练师";
        public int gold = 1200;
        public int mapId = 1;
        public float playerX;
        public float playerY;
        public int encounterWins;
        public string lastSavedAt;
    }

    [Serializable]
    internal sealed class LegacySaveProbe
    {
        public int saveVersion;
        public string trainerName;
        public int gold;
        public int savedMapId;
        public LegacyPosition savedPlayerPos;
    }

    [Serializable]
    internal sealed class LegacyPosition
    {
        public float x;
        public float y;
    }

    public sealed class SaveRepository
    {
        public const string NativeFileName = "super-spirit-unity-save.json";
        public const string LegacyImportFileName = "super-spirit-legacy-save.json";
        public const string PreservedLegacyFileName = "super-spirit-legacy-save.preserved.json";

        public string SaveDirectory => Application.persistentDataPath;
        public string NativePath => Path.Combine(SaveDirectory, NativeFileName);
        public UnitySaveData Current { get; private set; }
        public string StatusMessage { get; private set; }

        public UnitySaveData LoadOrCreate()
        {
            Directory.CreateDirectory(SaveDirectory);
            if (TryLoadNative(out UnitySaveData native))
            {
                Current = native;
                StatusMessage = "Unity 原生存档已载入";
                return Current;
            }

            Current = new UnitySaveData();
            TryImportLegacy();
            Save(Current);
            return Current;
        }

        public bool TryImportLegacy()
        {
            string[] candidates =
            {
                Path.Combine(SaveDirectory, LegacyImportFileName),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), LegacyImportFileName),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), LegacyImportFileName),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads", LegacyImportFileName)
            };

            foreach (string candidate in candidates)
            {
                if (!File.Exists(candidate)) continue;
                try
                {
                    string raw = File.ReadAllText(candidate);
                    LegacySaveProbe legacy = JsonUtility.FromJson<LegacySaveProbe>(raw);
                    if (legacy == null) continue;

                    File.WriteAllText(Path.Combine(SaveDirectory, PreservedLegacyFileName), raw);
                    Current.trainerName = string.IsNullOrWhiteSpace(legacy.trainerName) ? Current.trainerName : legacy.trainerName;
                    Current.gold = legacy.gold > 0 ? legacy.gold : Current.gold;
                    Current.mapId = legacy.savedMapId > 0 ? legacy.savedMapId : Current.mapId;
                    if (legacy.savedPlayerPos != null)
                    {
                        // Legacy stores 32×22 grid coordinates; Unity stores centered world coordinates.
                        Current.playerX = legacy.savedPlayerPos.x - 15.5f;
                        Current.playerY = legacy.savedPlayerPos.y - 10.5f;
                    }
                    Current.importedLegacySaveVersion = legacy.saveVersion.ToString();
                    StatusMessage = $"已导入旧版存档 v{legacy.saveVersion}；原文件完整保留";
                    return true;
                }
                catch (Exception exception)
                {
                    Debug.LogWarning($"[SuperSpirit] 无法导入 {candidate}: {exception.Message}");
                }
            }

            StatusMessage = $"新 Unity 存档已建立。旧版存档可命名为 {LegacyImportFileName} 后放入下载目录。";
            return false;
        }

        public void Save(UnitySaveData data)
        {
            Directory.CreateDirectory(SaveDirectory);
            data.lastSavedAt = DateTimeOffset.Now.ToString("O");
            string tempPath = NativePath + ".tmp";
            File.WriteAllText(tempPath, JsonUtility.ToJson(data, true));
            if (File.Exists(NativePath)) File.Delete(NativePath);
            File.Move(tempPath, NativePath);
            Current = data;
        }

        private bool TryLoadNative(out UnitySaveData data)
        {
            data = null;
            if (!File.Exists(NativePath)) return false;
            try
            {
                data = JsonUtility.FromJson<UnitySaveData>(File.ReadAllText(NativePath));
                return data != null;
            }
            catch (Exception exception)
            {
                Debug.LogWarning($"[SuperSpirit] 原生存档损坏，保留原文件并新建：{exception.Message}");
                File.Copy(NativePath, NativePath + ".broken", true);
                return false;
            }
        }
    }
}
