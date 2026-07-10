using System;
using System.Collections.Generic;
using SuperSpirit.Data;
using SuperSpirit.Presentation;
using UnityEngine;
using UnityEngine.Rendering;

namespace SuperSpirit.Exploration
{
    public sealed class ProceduralMapRenderer : MonoBehaviour
    {
        public const int Width = 32;
        public const int Height = 22;
        public const float TileSize = 1f;

        private readonly List<GameObject> decorations = new();
        private Mesh mesh;
        private MapRecord currentMap;

        public Bounds WorldBounds => new(Vector3.zero, new Vector3(Width, Height, 1));
        public MapRecord CurrentMap => currentMap;

        public void Build(MapRecord map, int seed = 1701)
        {
            currentMap = map;
            ClearGenerated();
            name = $"Native Map · {map.name}";

            mesh = BuildTerrainMesh(map, seed);
            MeshFilter filter = gameObject.GetComponent<MeshFilter>();
            if (!filter) filter = gameObject.AddComponent<MeshFilter>();
            MeshRenderer renderer = gameObject.GetComponent<MeshRenderer>();
            if (!renderer) renderer = gameObject.AddComponent<MeshRenderer>();
            filter.sharedMesh = mesh;
            renderer.sharedMaterial = RuntimeArt.CreateSpriteMaterial("Runtime Terrain Material");
            renderer.sortingOrder = -20;

            CreateDecorations(map, seed);
            CreateBoundaryGlow();
        }

        public Vector3 ClampPosition(Vector3 position, float padding = 0.65f)
        {
            float halfW = Width * 0.5f;
            float halfH = Height * 0.5f;
            position.x = Mathf.Clamp(position.x, -halfW + padding, halfW - padding);
            position.y = Mathf.Clamp(position.y, -halfH + padding, halfH - padding);
            position.z = 0;
            return position;
        }

        public Vector2Int WorldToGrid(Vector3 position)
        {
            return new Vector2Int(
                Mathf.Clamp(Mathf.FloorToInt(position.x + Width * 0.5f), 0, Width - 1),
                Mathf.Clamp(Mathf.FloorToInt(position.y + Height * 0.5f), 0, Height - 1));
        }

        private Mesh BuildTerrainMesh(MapRecord map, int seed)
        {
            int tileCount = Width * Height;
            Vector3[] vertices = new Vector3[tileCount * 4];
            int[] triangles = new int[tileCount * 6];
            Color[] colors = new Color[tileCount * 4];
            Vector2[] uv = new Vector2[tileCount * 4];
            Color biome = RuntimeArt.Parse(map.color, "#4D9F68");
            System.Random random = new(seed + map.id * 991);

            int tile = 0;
            for (int y = 0; y < Height; y++)
            for (int x = 0; x < Width; x++, tile++)
            {
                float worldX = x - Width * 0.5f;
                float worldY = y - Height * 0.5f;
                int vi = tile * 4;
                int ti = tile * 6;
                vertices[vi] = new Vector3(worldX, worldY, 0.2f);
                vertices[vi + 1] = new Vector3(worldX + 1, worldY, 0.2f);
                vertices[vi + 2] = new Vector3(worldX + 1, worldY + 1, 0.2f);
                vertices[vi + 3] = new Vector3(worldX, worldY + 1, 0.2f);
                triangles[ti] = vi;
                triangles[ti + 1] = vi + 2;
                triangles[ti + 2] = vi + 1;
                triangles[ti + 3] = vi;
                triangles[ti + 4] = vi + 3;
                triangles[ti + 5] = vi + 2;

                Color tileColor = ResolveTileColor(x, y, biome, random);
                for (int corner = 0; corner < 4; corner++) colors[vi + corner] = tileColor;
                uv[vi] = new Vector2(0, 0);
                uv[vi + 1] = new Vector2(1, 0);
                uv[vi + 2] = new Vector2(1, 1);
                uv[vi + 3] = new Vector2(0, 1);
            }

            Mesh terrain = new() { name = $"Terrain Mesh {map.name}", indexFormat = IndexFormat.UInt32 };
            terrain.vertices = vertices;
            terrain.triangles = triangles;
            terrain.colors = colors;
            terrain.uv = uv;
            terrain.RecalculateBounds();
            terrain.UploadMeshData(false);
            return terrain;
        }

        private static Color ResolveTileColor(int x, int y, Color biome, System.Random random)
        {
            float river = Mathf.Abs((x - Width * 0.54f) + Mathf.Sin(y * 0.45f) * 1.8f);
            if (river < 1.15f)
                return Color.Lerp(RuntimeArt.Parse("#23698A"), RuntimeArt.Parse("#4AC7CE"), (float)random.NextDouble() * 0.35f);

            bool road = Mathf.Abs(y - Height * 0.52f - Mathf.Sin(x * 0.22f) * 1.2f) < 1.25f;
            if (road)
                return Color.Lerp(RuntimeArt.Parse("#C8A96A"), RuntimeArt.Parse("#E6CE91"), (float)random.NextDouble() * 0.42f);

            float noise = Mathf.PerlinNoise(x * 0.23f + 5.2f, y * 0.23f + 2.1f);
            Color dark = Color.Lerp(biome, Color.black, 0.18f);
            Color light = Color.Lerp(biome, RuntimeArt.Parse("#D7F9BC"), 0.22f);
            return Color.Lerp(dark, light, noise);
        }

        private void CreateDecorations(MapRecord map, int seed)
        {
            System.Random random = new(seed + map.id * 811);
            Color biome = RuntimeArt.Parse(map.color, "#4D9F68");
            for (int i = 0; i < 105; i++)
            {
                float x = (float)random.NextDouble() * (Width - 2) - Width * 0.5f + 1;
                float y = (float)random.NextDouble() * (Height - 2) - Height * 0.5f + 1;
                float river = Mathf.Abs((x + Width * 0.5f - Width * 0.54f) + Mathf.Sin((y + Height * 0.5f) * 0.45f) * 1.8f);
                if (river < 2.1f) continue;

                GameObject decoration = new($"Foliage {i}");
                decoration.transform.SetParent(transform, false);
                decoration.transform.localPosition = new Vector3(x, y, -0.05f);
                float scale = Mathf.Lerp(0.22f, 0.62f, (float)random.NextDouble());
                decoration.transform.localScale = new Vector3(scale, scale * Mathf.Lerp(0.7f, 1.35f, (float)random.NextDouble()), 1);
                SpriteRenderer sprite = decoration.AddComponent<SpriteRenderer>();
                Color color = Color.Lerp(biome, i % 5 == 0 ? RuntimeArt.Parse("#FFD166") : RuntimeArt.Parse("#173F35"), i % 5 == 0 ? 0.65f : 0.5f);
                sprite.sprite = RuntimeArt.SolidSprite(color, 6);
                sprite.sortingOrder = Mathf.RoundToInt(-y * 5);
                decorations.Add(decoration);
            }

            // Landmark shrine gives the migrated world a strong visual objective.
            GameObject shrine = new("Resonance Shrine");
            shrine.transform.SetParent(transform, false);
            shrine.transform.localPosition = new Vector3(10.5f, 5.5f, -0.2f);
            SpriteRenderer shrineSprite = shrine.AddComponent<SpriteRenderer>();
            shrineSprite.sprite = RuntimeArt.SolidSprite(RuntimeArt.Parse("#8C73FF"), 12);
            shrineSprite.sortingOrder = 100;
            shrine.transform.localScale = new Vector3(0.95f, 1.5f, 1);
            PulseLandmark pulse = shrine.AddComponent<PulseLandmark>();
            pulse.BaseColor = RuntimeArt.Parse("#8C73FF");
            decorations.Add(shrine);
        }

        private void CreateBoundaryGlow()
        {
            GameObject frame = new("World Boundary");
            frame.transform.SetParent(transform, false);
            LineRenderer line = frame.AddComponent<LineRenderer>();
            line.loop = true;
            line.positionCount = 4;
            line.useWorldSpace = false;
            line.SetPositions(new[]
            {
                new Vector3(-Width * 0.5f, -Height * 0.5f, -0.1f),
                new Vector3(Width * 0.5f, -Height * 0.5f, -0.1f),
                new Vector3(Width * 0.5f, Height * 0.5f, -0.1f),
                new Vector3(-Width * 0.5f, Height * 0.5f, -0.1f)
            });
            line.startWidth = 0.08f;
            line.endWidth = 0.08f;
            line.material = RuntimeArt.CreateSpriteMaterial("Runtime Boundary Material");
            line.startColor = RuntimeArt.Parse("#83FFF0AA");
            line.endColor = RuntimeArt.Parse("#83FFF0AA");
            line.sortingOrder = 200;
            decorations.Add(frame);
        }

        private void ClearGenerated()
        {
            foreach (GameObject item in decorations)
                if (item != null) Destroy(item);
            decorations.Clear();
            if (mesh != null) Destroy(mesh);
        }
    }

    public sealed class PulseLandmark : MonoBehaviour
    {
        public Color BaseColor;
        private SpriteRenderer sprite;
        private Vector3 baseScale;

        private void Awake()
        {
            sprite = GetComponent<SpriteRenderer>();
            baseScale = transform.localScale;
        }

        private void Update()
        {
            float pulse = 1f + Mathf.Sin(Time.time * 2.4f) * 0.09f;
            transform.localScale = baseScale * pulse;
            sprite.color = Color.Lerp(BaseColor, Color.white, (Mathf.Sin(Time.time * 1.8f) + 1f) * 0.12f);
        }
    }
}
