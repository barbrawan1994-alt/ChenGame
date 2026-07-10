using SuperSpirit.Presentation;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using UnityEngine.UI;

namespace SuperSpirit.UI
{
    public static class UiFactory
    {
        public static readonly Color Ink = RuntimeArt.Parse("#172038");
        public static readonly Color Cream = RuntimeArt.Parse("#F7F3DF");
        public static readonly Color Teal = RuntimeArt.Parse("#32D7C4");
        public static readonly Color Gold = RuntimeArt.Parse("#FFC857");
        public static readonly Color Coral = RuntimeArt.Parse("#FF6B6B");
        public static readonly Color NavyGlass = RuntimeArt.Parse("#111A33D9");

        public static Canvas CreateCanvas(string name = "Native UI")
        {
            GameObject go = new(name, typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            Canvas canvas = go.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 50;
            CanvasScaler scaler = go.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920, 1080);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            if (Object.FindAnyObjectByType<EventSystem>() == null)
            {
                GameObject eventSystem = new("EventSystem", typeof(EventSystem));
                InputSystemUIInputModule inputModule = eventSystem.AddComponent<InputSystemUIInputModule>();
                inputModule.AssignDefaultActions();
            }
            return canvas;
        }

        public static Image Panel(Transform parent, string name, Color color, Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax)
        {
            GameObject go = new(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Image));
            go.transform.SetParent(parent, false);
            Image image = go.GetComponent<Image>();
            image.sprite = RuntimeArt.SolidSprite(Color.white);
            image.type = Image.Type.Sliced;
            image.color = color;
            RectTransform rect = image.rectTransform;
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.offsetMin = offsetMin;
            rect.offsetMax = offsetMax;
            return image;
        }

        public static Text Label(Transform parent, string name, string text, int size, Color color, TextAnchor alignment,
            Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax, FontStyle style = FontStyle.Normal)
        {
            GameObject go = new(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Text));
            go.transform.SetParent(parent, false);
            Text label = go.GetComponent<Text>();
            label.font = RuntimeArt.ChineseFont;
            label.text = text;
            label.fontSize = size;
            label.color = color;
            label.alignment = alignment;
            label.fontStyle = style;
            label.horizontalOverflow = HorizontalWrapMode.Wrap;
            label.verticalOverflow = VerticalWrapMode.Overflow;
            RectTransform rect = label.rectTransform;
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.offsetMin = offsetMin;
            rect.offsetMax = offsetMax;
            return label;
        }

        public static Button Button(Transform parent, string name, string text, Color background, Color foreground,
            Vector2 anchorMin, Vector2 anchorMax, Vector2 offsetMin, Vector2 offsetMax, UnityAction onClick, int fontSize = 28)
        {
            Image image = Panel(parent, name, background, anchorMin, anchorMax, offsetMin, offsetMax);
            Button button = image.gameObject.AddComponent<Button>();
            ColorBlock colors = button.colors;
            colors.normalColor = background;
            colors.highlightedColor = Color.Lerp(background, Color.white, 0.18f);
            colors.pressedColor = Color.Lerp(background, Color.black, 0.18f);
            colors.selectedColor = colors.highlightedColor;
            button.colors = colors;
            if (onClick != null) button.onClick.AddListener(onClick);
            Label(image.transform, "Label", text, fontSize, foreground, TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, new Vector2(8, 4), new Vector2(-8, -4), FontStyle.Bold);
            return button;
        }

        public static Image Bar(Transform parent, string name, Color background, Color fill, Vector2 anchorMin, Vector2 anchorMax,
            Vector2 offsetMin, Vector2 offsetMax, out Image fillImage)
        {
            Image root = Panel(parent, name, background, anchorMin, anchorMax, offsetMin, offsetMax);
            fillImage = Panel(root.transform, "Fill", fill, Vector2.zero, Vector2.one, new Vector2(4, 4), new Vector2(-4, -4));
            fillImage.type = Image.Type.Filled;
            fillImage.fillMethod = Image.FillMethod.Horizontal;
            fillImage.fillAmount = 1f;
            return root;
        }
    }
}
