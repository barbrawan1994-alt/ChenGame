using UnityEngine;

namespace SuperSpirit.Battle
{
    public static class BattleDamageCalculator
    {
        // Kept intentionally compatible with src/utils/battleLogic.js calcDamage.
        public static int Calculate(int power, int attack, int defense, int level, bool stab, float typeEffectiveness,
            bool critical, float randomFactor)
        {
            if (power <= 0) return 0;
            int safeLevel = Mathf.Max(1, level);
            int safeDefense = Mathf.Max(1, defense);
            int safeAttack = Mathf.Max(1, attack);
            float levelFactor = (2f * safeLevel) / 5f + 2f;
            int baseDamage = Mathf.FloorToInt(levelFactor * power * safeAttack / (50f * safeDefense)) + 2;
            float stabMultiplier = stab ? 1.5f : 1f;
            float criticalMultiplier = critical ? 1.5f : 1f;
            float random = Mathf.Clamp(randomFactor, 0.85f, 1f);
            return Mathf.Max(1, Mathf.FloorToInt(baseDamage * stabMultiplier * typeEffectiveness * criticalMultiplier * random));
        }
    }
}
