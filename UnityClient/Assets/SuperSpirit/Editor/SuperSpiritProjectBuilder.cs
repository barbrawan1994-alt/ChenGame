using System;
using System.IO;
using SuperSpirit.Core;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering.Universal;
using UnityEngine.SceneManagement;

namespace SuperSpirit.Editor
{
    public static class SuperSpiritProjectBuilder
    {
        public const string ScenePath = "Assets/Scenes/SuperSpirit.unity";

        [MenuItem("Super Spirit/Build Native Project Baseline")]
        public static void BuildProject()
        {
            EnsureDirectories();
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            scene.name = "SuperSpirit";

            GameObject cameraObject = new("Main Camera");
            cameraObject.tag = "MainCamera";
            Camera camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 6.7f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color32(8, 17, 31, 255);
            cameraObject.transform.position = new Vector3(0, 0, -10);
            cameraObject.AddComponent<AudioListener>();

            GameObject lightObject = new("Global 2D Light");
            Light2D light = lightObject.AddComponent<Light2D>();
            light.lightType = Light2D.LightType.Global;
            light.intensity = 0.9f;
            light.color = new Color32(255, 241, 192, 255);

            GameObject bootstrapObject = new("SUPER SPIRIT · UNITY NATIVE BOOTSTRAP");
            bootstrapObject.AddComponent<GameBootstrap>();

            EditorSceneManager.MarkSceneDirty(scene);
            if (!EditorSceneManager.SaveScene(scene, ScenePath))
                throw new InvalidOperationException($"Unable to save scene at {ScenePath}");

            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            ConfigurePlayerSettings();
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Selection.activeGameObject = bootstrapObject;
            Debug.Log("[SuperSpirit] Unity 6 native project baseline generated successfully.");
        }

        [MenuItem("Super Spirit/Build macOS Player")]
        public static void BuildMacPlayer()
        {
            BuildProject();
            string output = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "Builds", "macOS", "SuperSpirit.app"));
            Directory.CreateDirectory(Path.GetDirectoryName(output));
            BuildPlayerOptions options = new()
            {
                scenes = new[] { ScenePath },
                locationPathName = output,
                target = BuildTarget.StandaloneOSX,
                options = BuildOptions.Development
            };
            BuildReport report = BuildPipeline.BuildPlayer(options);
            BuildSummary summary = report.summary;
            if (summary.result != BuildResult.Succeeded)
                throw new InvalidOperationException($"macOS build failed: {summary.result}, errors={summary.totalErrors}");
            Debug.Log($"[SuperSpirit] macOS player built: {output} ({summary.totalSize / 1024f / 1024f:0.0} MiB)");
        }

        [MenuItem("Super Spirit/Capture Game View")]
        public static void CaptureGameView()
        {
            string output = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "Artifacts", "game-view.png"));
            Directory.CreateDirectory(Path.GetDirectoryName(output));
            ScreenCapture.CaptureScreenshot(output, 1);
            Debug.Log($"[SuperSpirit] Game View capture requested: {output}");
        }

        [MenuItem("Super Spirit/Start Play Validation")]
        public static void StartPlayValidation()
        {
            EditorApplication.EnterPlaymode();
        }

        [MenuItem("Super Spirit/Run Automated Validation")]
        public static void RunAutomatedValidation()
        {
            Environment.SetEnvironmentVariable("SUPER_SPIRIT_VALIDATE", "1");
            string validationDirectory = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "Artifacts", "RuntimeValidation"));
            Directory.CreateDirectory(validationDirectory);
            foreach (string file in Directory.GetFiles(validationDirectory)) File.Delete(file);

            // executeMethod can run while the editor is restoring a temporary backup scene.
            // Open the committed game scene explicitly and use a full domain reload so the
            // environment opt-in is observed reliably in both menu and scripted launches.
            if (EditorApplication.isPlaying) EditorApplication.ExitPlaymode();
            EditorSceneManager.OpenScene(ScenePath, OpenSceneMode.Single);
            EditorSettings.enterPlayModeOptionsEnabled = false;
            Debug.Log("[SuperSpirit][Validation] Launching committed native scene for automated validation.");
            EditorApplication.delayCall += EditorApplication.EnterPlaymode;
        }

        [MenuItem("Super Spirit/Run Automated Validation Script")]
        public static void RunAutomatedValidationScript()
        {
            RunAutomatedValidation();
        }

        [MenuItem("Super Spirit/Open Persistent Save Folder")]
        public static void OpenSaveFolder()
        {
            EditorUtility.RevealInFinder(Application.persistentDataPath);
        }

        private static void EnsureDirectories()
        {
            Directory.CreateDirectory(Path.Combine(Application.dataPath, "Scenes"));
            Directory.CreateDirectory(Path.Combine(Application.dataPath, "StreamingAssets", "SuperSpirit"));
        }

        private static void ConfigurePlayerSettings()
        {
            PlayerSettings.companyName = "ChenGame";
            PlayerSettings.productName = "超级精灵 · Unity Native";
            PlayerSettings.bundleVersion = "1.0.0-unity-preview";
            PlayerSettings.defaultScreenWidth = 1600;
            PlayerSettings.defaultScreenHeight = 900;
            PlayerSettings.fullScreenMode = FullScreenMode.Windowed;
            PlayerSettings.resizableWindow = true;
            PlayerSettings.runInBackground = true;
            PlayerSettings.colorSpace = ColorSpace.Linear;
            PlayerSettings.SetApplicationIdentifier(UnityEditor.Build.NamedBuildTarget.Standalone, "com.chengame.superspirit.native");
        }
    }
}
