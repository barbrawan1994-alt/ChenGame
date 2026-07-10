using System;
using System.Collections.Generic;
using UnityEngine;

namespace SuperSpirit.Presentation
{
    public static class RuntimeArt
    {
        private static readonly Dictionary<string, Sprite> SpriteCache = new();
        private static Font cachedFont;
        private static Material cachedSpriteMaterial;

        public static Font ChineseFont
        {
            get
            {
                if (cachedFont != null) return cachedFont;
                cachedFont = Font.CreateDynamicFontFromOSFont(
                    new[] { "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Arial Unicode MS", "Arial" }, 32);
                if (cachedFont == null)
                    cachedFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                return cachedFont;
            }
        }

        public static Material CreateSpriteMaterial(string name)
        {
            if (cachedSpriteMaterial == null)
            {
                Shader shader = Shader.Find("Universal Render Pipeline/2D/Sprite-Unlit-Default");
                if (!shader) shader = Shader.Find("Sprites/Default");
                if (!shader) shader = Shader.Find("Unlit/Texture");
                if (!shader)
                    throw new InvalidOperationException("No runtime-compatible sprite shader is available.");
                cachedSpriteMaterial = new Material(shader) { name = "Super Spirit Runtime Sprite Material" };
            }
            return new Material(cachedSpriteMaterial) { name = name };
        }

        public static Sprite SolidSprite(Color color, int size = 8)
        {
            string key = $"solid-{ColorUtility.ToHtmlStringRGBA(color)}-{size}";
            if (SpriteCache.TryGetValue(key, out Sprite sprite)) return sprite;

            Texture2D texture = new(size, size, TextureFormat.RGBA32, false)
            {
                name = key,
                filterMode = FilterMode.Point,
                wrapMode = TextureWrapMode.Clamp
            };
            Color[] pixels = new Color[size * size];
            Array.Fill(pixels, color);
            texture.SetPixels(pixels);
            texture.Apply();
            sprite = Sprite.Create(texture, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
            sprite.name = key;
            SpriteCache[key] = sprite;
            return sprite;
        }

        public static Sprite CreatePlayerSprite()
        {
            const string key = "native-player-v2";
            if (SpriteCache.TryGetValue(key, out Sprite cached)) return cached;

            Color clear = Color.clear;
            Color outline = Parse("#17223B");
            Color hair = Parse("#3A2347");
            Color skin = Parse("#FFD0A8");
            Color coat = Parse("#35D0BA");
            Color scarf = Parse("#FFCB69");
            Color boot = Parse("#5B3A29");
            Texture2D texture = PixelTexture(20, 26, clear);

            Fill(texture, 7, 19, 6, 5, outline);
            Fill(texture, 8, 20, 4, 4, skin);
            Fill(texture, 7, 23, 6, 3, hair);
            Set(texture, 7, 22, hair); Set(texture, 12, 22, hair);
            Set(texture, 9, 21, outline); Set(texture, 11, 21, outline);
            Fill(texture, 6, 10, 8, 10, outline);
            Fill(texture, 7, 11, 6, 8, coat);
            Fill(texture, 6, 16, 8, 2, scarf);
            Fill(texture, 4, 11, 3, 7, outline);
            Fill(texture, 13, 11, 3, 7, outline);
            Fill(texture, 5, 12, 2, 5, skin);
            Fill(texture, 13, 12, 2, 5, skin);
            Fill(texture, 7, 4, 3, 7, outline);
            Fill(texture, 10, 4, 3, 7, outline);
            Fill(texture, 7, 5, 2, 6, coat);
            Fill(texture, 11, 5, 2, 6, coat);
            Fill(texture, 6, 2, 4, 3, boot);
            Fill(texture, 10, 2, 4, 3, boot);
            texture.Apply();

            Sprite sprite = Sprite.Create(texture, new Rect(0, 0, 20, 26), new Vector2(0.5f, 0.12f), 18);
            sprite.name = key;
            SpriteCache[key] = sprite;
            return sprite;
        }

        public static Sprite CreateCreatureSprite(Color primary, Color accent, int seed, bool faceRight)
        {
            string key = $"creature-{ColorUtility.ToHtmlStringRGB(primary)}-{ColorUtility.ToHtmlStringRGB(accent)}-{seed}-{faceRight}";
            if (SpriteCache.TryGetValue(key, out Sprite cached)) return cached;

            const int width = 42;
            const int height = 34;
            Color outline = Parse("#172038");
            Color shadow = Color.Lerp(primary, Color.black, 0.32f);
            Color highlight = Color.Lerp(primary, Color.white, 0.32f);
            Texture2D texture = PixelTexture(width, height, Color.clear);
            System.Random random = new(seed);

            // Tail, legs and body form a readable, deliberately chunky pixel silhouette.
            Fill(texture, faceRight ? 3 : 31, 14, 9, 7, outline);
            Fill(texture, faceRight ? 4 : 32, 15, 8, 5, accent);
            Fill(texture, 10, 7, 23, 18, outline);
            Fill(texture, 11, 8, 21, 16, primary);
            Fill(texture, 14, 5, 6, 5, outline);
            Fill(texture, 24, 5, 6, 5, outline);
            Fill(texture, 15, 6, 4, 4, shadow);
            Fill(texture, 25, 6, 4, 4, shadow);

            int headX = faceRight ? 25 : 6;
            Fill(texture, headX, 17, 12, 12, outline);
            Fill(texture, headX + 1, 18, 10, 10, primary);
            Fill(texture, faceRight ? headX + 8 : headX + 1, 23, 3, 3, Color.white);
            Set(texture, faceRight ? headX + 9 : headX + 2, 24, outline);
            Fill(texture, faceRight ? headX + 8 : headX, 17, 5, 3, accent);

            // Ears / elemental crest.
            Fill(texture, headX + 1, 27, 4, 6, outline);
            Fill(texture, headX + 7, 27, 4, 6, outline);
            Fill(texture, headX + 2, 28, 2, 4, accent);
            Fill(texture, headX + 8, 28, 2, 4, accent);

            for (int i = 0; i < 9; i++)
            {
                int x = random.Next(13, 30);
                int y = random.Next(11, 22);
                Fill(texture, x, y, 2, 2, i % 2 == 0 ? accent : highlight);
            }
            texture.Apply();

            Sprite sprite = Sprite.Create(texture, new Rect(0, 0, width, height), new Vector2(0.5f, 0.15f), 22);
            sprite.name = key;
            SpriteCache[key] = sprite;
            return sprite;
        }

        public static Color Parse(string html, string fallback = "#FFFFFF")
        {
            return ColorUtility.TryParseHtmlString(html, out Color color)
                ? color
                : (ColorUtility.TryParseHtmlString(fallback, out Color fallbackColor) ? fallbackColor : Color.white);
        }

        private static Texture2D PixelTexture(int width, int height, Color color)
        {
            Texture2D texture = new(width, height, TextureFormat.RGBA32, false)
            {
                filterMode = FilterMode.Point,
                wrapMode = TextureWrapMode.Clamp
            };
            Color[] pixels = new Color[width * height];
            Array.Fill(pixels, color);
            texture.SetPixels(pixels);
            return texture;
        }

        private static void Fill(Texture2D texture, int x, int y, int width, int height, Color color)
        {
            for (int iy = Math.Max(0, y); iy < Math.Min(texture.height, y + height); iy++)
            for (int ix = Math.Max(0, x); ix < Math.Min(texture.width, x + width); ix++)
                texture.SetPixel(ix, iy, color);
        }

        private static void Set(Texture2D texture, int x, int y, Color color)
        {
            if (x >= 0 && x < texture.width && y >= 0 && y < texture.height)
                texture.SetPixel(x, y, color);
        }
    }
}
