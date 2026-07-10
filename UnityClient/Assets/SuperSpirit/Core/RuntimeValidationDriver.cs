using System.Collections;
using System.IO;
using SuperSpirit.Battle;
using SuperSpirit.Exploration;
using UnityEngine;

namespace SuperSpirit.Core
{
    /// <summary>
    /// Opt-in runtime smoke driver. It is inactive for normal players and only runs when
    /// SUPER_SPIRIT_VALIDATE=1 is present or --validate-super-spirit is passed to the player.
    /// </summary>
    public sealed class RuntimeValidationDriver : MonoBehaviour
    {
        private PlayerController2D player;
        private BattleController battle;
        private bool enabledForValidation;
        private bool battleFinished;
        private bool battleVictory;

        public void Initialize(PlayerController2D playerController, BattleController battleController)
        {
            player = playerController;
            battle = battleController;
            enabledForValidation = IsValidationRequested();
            if (!enabledForValidation) return;

            battle.BattleEnded += HandleBattleEnded;
            StartCoroutine(RunValidation());
        }

        private IEnumerator RunValidation()
        {
            Debug.Log("[SuperSpirit][Validation] Automated runtime validation requested.");
            yield return new WaitForSecondsRealtime(1.0f);
            Capture("exploration");

            // Sweep both directions so validation remains deterministic even when an existing
            // native save starts at either horizontal map boundary.
            float elapsed = 0;
            while (!battle.IsRunning && elapsed < 8f)
            {
                elapsed += Time.unscaledDeltaTime;
                Vector2 direction = elapsed < 3f ? Vector2.left : Vector2.right;
                player.MoveForValidation(direction * (8f * Time.unscaledDeltaTime));
                yield return null;
            }

            float encounterDeadline = Time.realtimeSinceStartup + 4f;
            while (!battle.IsRunning && Time.realtimeSinceStartup < encounterDeadline) yield return null;
            if (!battle.IsRunning)
            {
                Fail("Encounter did not start after validation movement.");
                yield break;
            }

            yield return new WaitForSecondsRealtime(1.0f);
            Capture("battle");

            float battleDeadline = Time.realtimeSinceStartup + 35f;
            while (battle.IsRunning && Time.realtimeSinceStartup < battleDeadline)
            {
                battle.SelectSkill(0);
                yield return new WaitForSecondsRealtime(1.65f);
            }

            if (battle.IsRunning || !battleFinished)
            {
                Fail("Battle did not finish during automated validation.");
                yield break;
            }

            yield return new WaitForSecondsRealtime(0.8f);
            Capture("returned-to-exploration");
            WriteResult(true, $"World, encounter and battle loop passed. victory={battleVictory}");
            Debug.Log($"[SuperSpirit][Validation] PASS: exploration -> encounter -> battle -> exploration. victory={battleVictory}");
        }

        private void HandleBattleEnded(bool victory)
        {
            battleFinished = true;
            battleVictory = victory;
        }

        private static bool IsValidationRequested()
        {
            if (System.Environment.GetEnvironmentVariable("SUPER_SPIRIT_VALIDATE") == "1") return true;
            foreach (string argument in System.Environment.GetCommandLineArgs())
                if (argument == "--validate-super-spirit") return true;
            return false;
        }

        private static string ArtifactDirectory
        {
            get
            {
#if UNITY_EDITOR
                return Path.GetFullPath(Path.Combine(Application.dataPath, "..", "Artifacts", "RuntimeValidation"));
#else
                return Path.Combine(Application.persistentDataPath, "RuntimeValidation");
#endif
            }
        }

        private static void Capture(string name)
        {
            Directory.CreateDirectory(ArtifactDirectory);
            string path = Path.Combine(ArtifactDirectory, name + ".png");
            ScreenCapture.CaptureScreenshot(path, 1);
            Debug.Log($"[SuperSpirit][Validation] Capture requested: {path}");
        }

        private static void WriteResult(bool passed, string message)
        {
            Directory.CreateDirectory(ArtifactDirectory);
            File.WriteAllText(Path.Combine(ArtifactDirectory, passed ? "PASS.txt" : "FAIL.txt"), message);
        }

        private static void Fail(string message)
        {
            WriteResult(false, message);
            Debug.LogError($"[SuperSpirit][Validation] FAIL: {message}");
        }
    }
}
