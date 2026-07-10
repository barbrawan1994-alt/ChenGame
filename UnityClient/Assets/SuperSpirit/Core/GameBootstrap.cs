using SuperSpirit.Battle;
using SuperSpirit.Data;
using SuperSpirit.Exploration;
using SuperSpirit.Presentation;
using SuperSpirit.UI;
using UnityEngine;

namespace SuperSpirit.Core
{
    [DefaultExecutionOrder(-100)]
    public sealed class GameBootstrap : MonoBehaviour
    {
        private GameStateMachine stateMachine;
        private GameDatabase database;
        private SaveRepository saves;
        private UnitySaveData save;
        private ProceduralMapRenderer map;
        private PlayerController2D player;
        private EncounterDirector encounters;
        private BattleController battle;
        private WorldHud worldHud;
        private PetRecord playerPet;
        private System.Random random;

        private void Awake()
        {
            Application.targetFrameRate = 120;
            QualitySettings.vSyncCount = 1;
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
            random = new System.Random(44021);

            database = GameDatabase.Load();
            saves = new SaveRepository();
            save = saves.LoadOrCreate();
            stateMachine = new GameStateMachine();
            stateMachine.Changed += OnStateChanged;

            BuildNativeWorld();
            stateMachine.TryEnter(GameMode.Exploration);
            worldHud.ShowToast("Unity 6 原生客户端已启动 · 移动一段距离体验遭遇与回合战斗", 4.5f);
        }

        private void BuildNativeWorld()
        {
            MapRecord mapRecord = database.GetMap(save.mapId);
            GameObject mapObject = new("Procedural World · URP 2D");
            map = mapObject.AddComponent<ProceduralMapRenderer>();
            map.Build(mapRecord);

            GameObject playerObject = new("Native Player Controller");
            player = playerObject.AddComponent<PlayerController2D>();
            Vector3 spawn = new(save.playerX, save.playerY, 0);
            if (Mathf.Abs(spawn.x) < 0.01f && Mathf.Abs(spawn.y) < 0.01f)
                spawn = new Vector3(-6.5f, -2.5f, 0);
            player.Initialize(map, spawn);
            player.PositionChanged += HandlePlayerPositionChanged;

            Camera cameraComponent = Camera.main;
            if (cameraComponent == null)
            {
                GameObject cameraObject = new("Main Camera");
                cameraObject.tag = "MainCamera";
                cameraComponent = cameraObject.AddComponent<Camera>();
                cameraObject.AddComponent<AudioListener>();
            }
            CameraFollow2D follow = cameraComponent.GetComponent<CameraFollow2D>();
            if (!follow) follow = cameraComponent.gameObject.AddComponent<CameraFollow2D>();
            follow.Initialize(player.transform, map);

            GameObject environmentObject = new("Native Environment Director");
            EnvironmentDirector environment = environmentObject.AddComponent<EnvironmentDirector>();
            environment.Initialize(player.transform);

            Canvas canvas = UiFactory.CreateCanvas("Super Spirit Native HUD");
            GameObject worldHudObject = new("World HUD");
            worldHud = worldHudObject.AddComponent<WorldHud>();
            worldHud.Build(canvas, mapRecord, save, database.LoadMessage, saves.StatusMessage, map, environment);
            worldHud.UpdatePlayer(player.transform.position);

            GameObject battleHudObject = new("Battle HUD");
            BattleHud battleHud = battleHudObject.AddComponent<BattleHud>();
            GameObject battleObject = new("Battle Controller");
            battle = battleObject.AddComponent<BattleController>();
            battleHud.Build(canvas, battle.SelectSkill, battle.Flee);
            battle.Initialize(database, battleHud, cameraComponent);
            battle.BattleEnded += HandleBattleEnded;

            playerPet = database.GetPet(4) ?? database.Payload.pets[0];
            GameObject encounterObject = new("Encounter Director");
            encounters = encounterObject.AddComponent<EncounterDirector>();
            encounters.Initialize(player);
            encounters.EncounterRequested += BeginEncounter;
            RuntimeValidationDriver validationDriver = gameObject.AddComponent<RuntimeValidationDriver>();
            validationDriver.Initialize(player, battle);
            Debug.Log($"[SuperSpirit][Validation] Native world ready: map={mapRecord.name}, pets={database.Payload.pets.Length}, skills={database.Payload.skills.Length}, spawn={player.transform.position}");
        }

        private void BeginEncounter()
        {
            if (stateMachine.Current != GameMode.Exploration) return;
            if (!stateMachine.TryEnter(GameMode.Battle)) return;

            MapRecord mapRecord = map.CurrentMap;
            PetRecord enemyPet = database.GetRandomEncounter(mapRecord.id, random);
            if (enemyPet.id == playerPet.id && database.Payload.pets.Length > 1)
                enemyPet = database.Payload.pets[(System.Array.IndexOf(database.Payload.pets, enemyPet) + 1) % database.Payload.pets.Length];
            int playerLevel = Mathf.Clamp(mapRecord.minLevel + 7, 5, 100);
            int enemyLevel = Mathf.Clamp(random.Next(mapRecord.minLevel, Mathf.Max(mapRecord.minLevel + 1, mapRecord.maxLevel + 1)), 3, 100);
            battle.Begin(playerPet, enemyPet, playerLevel, enemyLevel);
        }

        private void HandleBattleEnded(bool victory)
        {
            if (victory)
            {
                save.encounterWins++;
                save.gold += 80 + save.encounterWins * 5;
                worldHud.UpdateWins(save.encounterWins);
            }
            SaveCurrentPosition();
            encounters.ResetAfterBattle();
            encounters.Enabled = true;
            stateMachine.TryEnter(GameMode.Exploration);
        }

        private void HandlePlayerPositionChanged(Vector3 position)
        {
            worldHud?.UpdatePlayer(position);
        }

        private void SaveCurrentPosition()
        {
            save.playerX = player.transform.position.x;
            save.playerY = player.transform.position.y;
            save.mapId = map.CurrentMap.id;
            saves.Save(save);
        }

        private void OnStateChanged(GameMode previous, GameMode next)
        {
            player?.SetInputEnabled(next == GameMode.Exploration);
        }

        private void OnApplicationPause(bool paused)
        {
            if (paused && player != null) SaveCurrentPosition();
        }

        private void OnApplicationQuit()
        {
            if (player != null) SaveCurrentPosition();
        }
    }
}
