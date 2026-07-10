using SuperSpirit.Exploration;
using UnityEngine;
using UnityEngine.Rendering.Universal;

namespace SuperSpirit.Presentation
{
    public sealed class EnvironmentDirector : MonoBehaviour
    {
        private Light2D globalLight;
        private ParticleSystem rain;
        private ParticleSystem motes;
        private Transform player;
        private float cycle;

        public string PhaseName { get; private set; } = "晨曦";
        public string WeatherName { get; private set; } = "微雨";

        public void Initialize(Transform playerTransform)
        {
            player = playerTransform;
            globalLight = FindAnyObjectByType<Light2D>();
            if (globalLight == null)
            {
                GameObject lightObject = new("Global 2D Light");
                globalLight = lightObject.AddComponent<Light2D>();
                globalLight.lightType = Light2D.LightType.Global;
                globalLight.intensity = 0.85f;
            }
            rain = CreateRain();
            motes = CreateMotes();
        }

        private void Update()
        {
            if (player != null)
                transform.position = new Vector3(player.position.x, player.position.y, -1);

            cycle = Mathf.Repeat(Time.time / 95f, 1f);
            float daylight = Mathf.Clamp01(Mathf.Sin(cycle * Mathf.PI));
            PhaseName = cycle < 0.18f ? "晨曦" : cycle < 0.56f ? "晴昼" : cycle < 0.78f ? "暮色" : "星夜";
            if (globalLight != null)
            {
                globalLight.intensity = Mathf.Lerp(0.48f, 0.93f, daylight);
                globalLight.color = Color.Lerp(RuntimeArt.Parse("#6A78B8"), RuntimeArt.Parse("#FFF1C0"), daylight);
            }

            ParticleSystem.EmissionModule rainEmission = rain.emission;
            rainEmission.rateOverTime = Mathf.Lerp(35, 75, (Mathf.Sin(Time.time * 0.17f) + 1f) * 0.5f);
        }

        private ParticleSystem CreateRain()
        {
            GameObject go = new("Layered Rain VFX");
            go.transform.SetParent(transform, false);
            go.transform.localPosition = new Vector3(0, 6, 0);
            ParticleSystem particles = go.AddComponent<ParticleSystem>();
            ParticleSystem.MainModule main = particles.main;
            main.loop = true;
            main.startLifetime = 1.25f;
            main.startSpeed = 12f;
            main.startSize = 0.055f;
            main.startColor = RuntimeArt.Parse("#8DEBFFB8");
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.maxParticles = 260;

            ParticleSystem.EmissionModule emission = particles.emission;
            emission.rateOverTime = 55;
            ParticleSystem.ShapeModule shape = particles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(24, 1, 1);
            shape.rotation = new Vector3(0, 0, -7);

            ParticleSystem.VelocityOverLifetimeModule velocity = particles.velocityOverLifetime;
            velocity.enabled = true;
            velocity.space = ParticleSystemSimulationSpace.World;
            velocity.x = -1.4f;
            velocity.y = -11.5f;

            ParticleSystemRenderer renderer = go.GetComponent<ParticleSystemRenderer>();
            renderer.renderMode = ParticleSystemRenderMode.Stretch;
            renderer.lengthScale = 0.42f;
            renderer.velocityScale = 0.08f;
            renderer.material = RuntimeArt.CreateSpriteMaterial("Runtime Rain Material");
            renderer.sortingOrder = 850;
            particles.Play();
            return particles;
        }

        private ParticleSystem CreateMotes()
        {
            GameObject go = new("Firefly Motes VFX");
            go.transform.SetParent(transform, false);
            ParticleSystem particles = go.AddComponent<ParticleSystem>();
            ParticleSystem.MainModule main = particles.main;
            main.loop = true;
            main.startLifetime = 5f;
            main.startSpeed = 0.28f;
            main.startSize = new ParticleSystem.MinMaxCurve(0.035f, 0.09f);
            main.startColor = new ParticleSystem.MinMaxGradient(RuntimeArt.Parse("#72FFD5"), RuntimeArt.Parse("#FFE67D"));
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.maxParticles = 90;

            ParticleSystem.EmissionModule emission = particles.emission;
            emission.rateOverTime = 11;
            ParticleSystem.ShapeModule shape = particles.shape;
            shape.shapeType = ParticleSystemShapeType.Box;
            shape.scale = new Vector3(20, 11, 1);
            ParticleSystem.NoiseModule noise = particles.noise;
            noise.enabled = true;
            noise.strength = 0.55f;
            noise.frequency = 0.28f;
            noise.scrollSpeed = 0.2f;
            ParticleSystemRenderer renderer = go.GetComponent<ParticleSystemRenderer>();
            renderer.material = RuntimeArt.CreateSpriteMaterial("Runtime Motes Material");
            renderer.sortingOrder = 840;
            particles.Play();
            return particles;
        }
    }
}
