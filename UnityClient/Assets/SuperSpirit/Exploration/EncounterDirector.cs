using System;
using UnityEngine;

namespace SuperSpirit.Exploration
{
    public sealed class EncounterDirector : MonoBehaviour
    {
        public event Action EncounterRequested;
        public bool Enabled { get; set; } = true;

        private float distanceSinceEncounter;
        private float nextThreshold = 13f;
        private System.Random random;

        public void Initialize(PlayerController2D player, int seed = 90210)
        {
            random = new System.Random(seed);
            player.DistanceTravelled += HandleDistance;
            RollThreshold();
        }

        public void ResetAfterBattle()
        {
            distanceSinceEncounter = 0;
            RollThreshold();
        }

        private void HandleDistance(float distance)
        {
            if (!Enabled) return;
            distanceSinceEncounter += distance;
            if (distanceSinceEncounter < nextThreshold) return;
            Enabled = false;
            EncounterRequested?.Invoke();
        }

        private void RollThreshold()
        {
            nextThreshold = random == null ? 13f : 10f + (float)random.NextDouble() * 8f;
        }
    }
}
