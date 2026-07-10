using System.Collections;
using SuperSpirit.Data;
using SuperSpirit.Exploration;
using SuperSpirit.Presentation;
using UnityEngine;
using UnityEngine.UI;

namespace SuperSpirit.UI
{
    public sealed class WorldHud : MonoBehaviour
    {
        private Text locationText;
        private Text statusText;
        private Text coordinateText;
        private Text phaseText;
        private Text toastText;
        private Image toastPanel;
        private RectTransform miniPlayer;
        private Text performanceText;
        private Coroutine toastRoutine;
        private float smoothedDelta;
        private ProceduralMapRenderer map;
        private EnvironmentDirector environment;

        public void Build(Canvas canvas, MapRecord mapRecord, UnitySaveData save, string databaseStatus, string saveStatus,
            ProceduralMapRenderer mapRenderer, EnvironmentDirector environmentDirector)
        {
            map = mapRenderer;
            environment = environmentDirector;
            transform.SetParent(canvas.transform, false);

            Image header = UiFactory.Panel(transform, "World Header", new Color(0.035f, 0.055f, 0.11f, 0.91f),
                new Vector2(0, 1), new Vector2(1, 1), new Vector2(26, -122), new Vector2(-26, -24));
            UiFactory.Label(header.transform, "Game Mark", "SUPER SPIRIT  ·  UNITY NATIVE", 17, UiFactory.Teal,
                TextAnchor.UpperLeft, Vector2.zero, Vector2.one, new Vector2(26, 52), new Vector2(-26, -14), FontStyle.Bold);
            locationText = UiFactory.Label(header.transform, "Location", mapRecord.name, 34, UiFactory.Cream,
                TextAnchor.LowerLeft, Vector2.zero, Vector2.one, new Vector2(26, 10), new Vector2(-600, -42), FontStyle.Bold);
            phaseText = UiFactory.Label(header.transform, "Environment", "晨曦  ·  微雨", 20, RuntimeArt.Parse("#B8C9E8"),
                TextAnchor.MiddleRight, new Vector2(0.55f, 0), Vector2.one, new Vector2(0, 10), new Vector2(-26, -10), FontStyle.Bold);

            Image trainer = UiFactory.Panel(transform, "Trainer Card", UiFactory.NavyGlass,
                new Vector2(0, 1), new Vector2(0, 1), new Vector2(26, -286), new Vector2(390, -142));
            UiFactory.Label(trainer.transform, "Trainer", $"训练师  {save.trainerName}", 24, UiFactory.Cream,
                TextAnchor.UpperLeft, Vector2.zero, Vector2.one, new Vector2(22, 70), new Vector2(-16, -14), FontStyle.Bold);
            UiFactory.Label(trainer.transform, "Gold", $"晶币  {save.gold:N0}    ·    胜场  {save.encounterWins}", 19, UiFactory.Gold,
                TextAnchor.LowerLeft, Vector2.zero, Vector2.one, new Vector2(22, 16), new Vector2(-16, -62), FontStyle.Bold);

            Image minimap = UiFactory.Panel(transform, "Tactical Minimap", new Color(0.035f, 0.055f, 0.11f, 0.88f),
                new Vector2(1, 1), new Vector2(1, 1), new Vector2(-344, -346), new Vector2(-26, -142));
            UiFactory.Panel(minimap.transform, "Map Field", RuntimeArt.Parse("#396B58"), Vector2.zero, Vector2.one,
                new Vector2(18, 44), new Vector2(-18, -18));
            RectTransform road = UiFactory.Panel(minimap.transform, "Road", RuntimeArt.Parse("#D6BA75"),
                new Vector2(0.08f, 0.42f), new Vector2(0.92f, 0.56f), Vector2.zero, Vector2.zero).rectTransform;
            road.localRotation = Quaternion.Euler(0, 0, -7);
            RectTransform river = UiFactory.Panel(minimap.transform, "River", RuntimeArt.Parse("#3DBAC7"),
                new Vector2(0.48f, 0.08f), new Vector2(0.58f, 0.92f), Vector2.zero, Vector2.zero).rectTransform;
            river.localRotation = Quaternion.Euler(0, 0, 5);
            miniPlayer = UiFactory.Panel(minimap.transform, "Player Marker", UiFactory.Coral,
                new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(-8, -8), new Vector2(8, 8)).rectTransform;
            UiFactory.Label(minimap.transform, "Map Label", "区域扫描", 17, UiFactory.Teal, TextAnchor.MiddleLeft,
                new Vector2(0, 1), Vector2.one, new Vector2(18, -38), new Vector2(-18, -4), FontStyle.Bold);

            coordinateText = UiFactory.Label(transform, "Coordinates", "X 00  ·  Y 00", 16, RuntimeArt.Parse("#C8D3E8"),
                TextAnchor.UpperRight, new Vector2(1, 1), new Vector2(1, 1), new Vector2(-344, -380), new Vector2(-26, -350), FontStyle.Bold);

            Image hint = UiFactory.Panel(transform, "Input Hint", new Color(0.035f, 0.055f, 0.11f, 0.88f),
                new Vector2(0.5f, 0), new Vector2(0.5f, 0), new Vector2(-420, 28), new Vector2(420, 96));
            UiFactory.Label(hint.transform, "Hint", "WASD / 方向键移动    ·    Shift 疾跑    ·    行走触发原生战斗", 20,
                UiFactory.Cream, TextAnchor.MiddleCenter, Vector2.zero, Vector2.one, new Vector2(12, 6), new Vector2(-12, -6), FontStyle.Bold);

            Image status = UiFactory.Panel(transform, "Migration Status", new Color(0.035f, 0.055f, 0.11f, 0.84f),
                new Vector2(0, 0), new Vector2(0, 0), new Vector2(26, 28), new Vector2(560, 132));
            statusText = UiFactory.Label(status.transform, "Status", $"✓ {databaseStatus}\n✓ {saveStatus}", 15,
                RuntimeArt.Parse("#B8C9E8"), TextAnchor.MiddleLeft, Vector2.zero, Vector2.one, new Vector2(18, 10), new Vector2(-12, -10));

            performanceText = UiFactory.Label(transform, "Performance Budget", "", 14, RuntimeArt.Parse("#8CA1C7"),
                TextAnchor.LowerRight, new Vector2(1, 0), new Vector2(1, 0), new Vector2(-460, 28), new Vector2(-26, 92), FontStyle.Bold);

            toastPanel = UiFactory.Panel(transform, "Toast", RuntimeArt.Parse("#111A33F2"),
                new Vector2(0.5f, 0.72f), new Vector2(0.5f, 0.72f), new Vector2(-420, -58), new Vector2(420, 58));
            toastText = UiFactory.Label(toastPanel.transform, "Toast Label", "", 23, UiFactory.Cream, TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, new Vector2(20, 10), new Vector2(-20, -10), FontStyle.Bold);
            toastPanel.gameObject.SetActive(false);
        }

        public void UpdatePlayer(Vector3 worldPosition)
        {
            if (map == null) return;
            Vector2Int grid = map.WorldToGrid(worldPosition);
            coordinateText.text = $"X {grid.x:00}  ·  Y {grid.y:00}";
            Vector2 normalized = new(
                Mathf.InverseLerp(-ProceduralMapRenderer.Width * 0.5f, ProceduralMapRenderer.Width * 0.5f, worldPosition.x),
                Mathf.InverseLerp(-ProceduralMapRenderer.Height * 0.5f, ProceduralMapRenderer.Height * 0.5f, worldPosition.y));
            miniPlayer.anchorMin = normalized;
            miniPlayer.anchorMax = normalized;
        }

        public void UpdateWins(int wins)
        {
            ShowToast($"胜利记录已更新：{wins} 场  ·  Unity 原生存档已写入", 2.5f);
        }

        public void ShowToast(string message, float duration = 3f)
        {
            if (toastRoutine != null) StopCoroutine(toastRoutine);
            toastRoutine = StartCoroutine(ToastRoutine(message, duration));
        }

        private IEnumerator ToastRoutine(string message, float duration)
        {
            toastText.text = message;
            toastPanel.gameObject.SetActive(true);
            CanvasGroup group = toastPanel.GetComponent<CanvasGroup>();
            if (!group) group = toastPanel.gameObject.AddComponent<CanvasGroup>();
            group.alpha = 0;
            float t = 0;
            while (t < 0.2f)
            {
                t += Time.unscaledDeltaTime;
                group.alpha = Mathf.Clamp01(t / 0.2f);
                yield return null;
            }
            yield return new WaitForSecondsRealtime(duration);
            t = 0;
            while (t < 0.25f)
            {
                t += Time.unscaledDeltaTime;
                group.alpha = 1f - Mathf.Clamp01(t / 0.25f);
                yield return null;
            }
            toastPanel.gameObject.SetActive(false);
            toastRoutine = null;
        }

        private void Update()
        {
            smoothedDelta = Mathf.Lerp(smoothedDelta, Time.unscaledDeltaTime, 0.08f);
            float fps = 1f / Mathf.Max(0.0001f, smoothedDelta);
            performanceText.text = $"{fps:0} FPS  ·  {Screen.width}×{Screen.height}  ·  URP 2D";
            if (environment != null)
                phaseText.text = $"{environment.PhaseName}  ·  {environment.WeatherName}";
        }
    }
}
