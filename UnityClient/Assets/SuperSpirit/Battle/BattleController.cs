using System;
using System.Collections;
using SuperSpirit.Data;
using SuperSpirit.Presentation;
using SuperSpirit.UI;
using UnityEngine;
using UnityEngine.InputSystem;

namespace SuperSpirit.Battle
{
    public sealed class BattleController : MonoBehaviour
    {
        public event Action<bool> BattleEnded;
        public bool IsRunning { get; private set; }

        private GameDatabase database;
        private BattleHud hud;
        private Camera battleCamera;
        private ScreenShake screenShake;
        private BattleCreature player;
        private BattleCreature enemy;
        private System.Random random;
        private bool turnBusy;

        public void Initialize(GameDatabase gameDatabase, BattleHud battleHud, Camera cameraComponent, int seed = 7727)
        {
            database = gameDatabase;
            hud = battleHud;
            battleCamera = cameraComponent;
            screenShake = cameraComponent.GetComponent<ScreenShake>();
            random = new System.Random(seed);
        }

        public void Begin(PetRecord playerRecord, PetRecord enemyRecord, int playerLevel, int enemyLevel)
        {
            if (IsRunning) return;
            player = new BattleCreature(playerRecord, playerLevel, database.GetSkillsFor(playerRecord.type));
            enemy = new BattleCreature(enemyRecord, enemyLevel, database.GetSkillsFor(enemyRecord.type));
            Debug.Log($"[SuperSpirit][Validation] Battle started: {player.Name} Lv.{player.Level} vs {enemy.Name} Lv.{enemy.Level}");
            StartCoroutine(BeginRoutine());
        }

        public void SelectSkill(int index)
        {
            if (!IsRunning || turnBusy || index < 0 || index >= player.Skills.Length) return;
            Debug.Log($"[SuperSpirit][Validation] Skill selected: slot={index + 1}, skill={player.Skills[index].name}");
            StartCoroutine(ResolveTurn(index));
        }

        public void Flee()
        {
            if (!IsRunning || turnBusy) return;
            StartCoroutine(FleeRoutine());
        }

        private void Update()
        {
            if (!IsRunning || turnBusy || Keyboard.current == null) return;
            if (Keyboard.current.digit1Key.wasPressedThisFrame) SelectSkill(0);
            else if (Keyboard.current.digit2Key.wasPressedThisFrame) SelectSkill(1);
            else if (Keyboard.current.digit3Key.wasPressedThisFrame) SelectSkill(2);
            else if (Keyboard.current.digit4Key.wasPressedThisFrame) SelectSkill(3);
            else if (Keyboard.current.escapeKey.wasPressedThisFrame) Flee();
        }

        private IEnumerator BeginRoutine()
        {
            IsRunning = true;
            turnBusy = true;
            yield return hud.Show(player, enemy);
            yield return new WaitForSecondsRealtime(0.4f);
            hud.SetInputEnabled(true);
            turnBusy = false;
        }

        private IEnumerator ResolveTurn(int skillIndex)
        {
            turnBusy = true;
            SkillRecord playerSkill = player.Skills[skillIndex];
            SkillRecord enemySkill = enemy.Skills[random.Next(enemy.Skills.Length)];

            bool playerFirst = player.Attack + random.Next(0, 12) >= enemy.Attack + random.Next(0, 12);
            if (playerFirst)
            {
                yield return PerformAttack(player, enemy, playerSkill, true);
                if (!enemy.IsFainted)
                    yield return PerformAttack(enemy, player, enemySkill, false);
            }
            else
            {
                yield return PerformAttack(enemy, player, enemySkill, false);
                if (!player.IsFainted)
                    yield return PerformAttack(player, enemy, playerSkill, true);
            }

            hud.UpdateStats(player, enemy);
            if (enemy.IsFainted)
            {
                hud.SetLog($"共鸣稳定！{enemy.Name} 失去战斗能力。\n获得原生战斗胜利与探索奖励。 ");
                yield return new WaitForSecondsRealtime(1.25f);
                yield return Finish(true);
                yield break;
            }
            if (player.IsFainted)
            {
                hud.SetLog($"{player.Name} 已无法继续作战。\n本次探索会安全返回，不会影响旧版存档。 ");
                yield return new WaitForSecondsRealtime(1.25f);
                yield return Finish(false);
                yield break;
            }

            hud.SetInputEnabled(true);
            turnBusy = false;
        }

        private IEnumerator PerformAttack(BattleCreature attacker, BattleCreature defender, SkillRecord skill, bool playerAttacks)
        {
            bool hit = random.Next(1, 101) <= Mathf.Clamp(skill.accuracy <= 0 ? 100 : skill.accuracy, 1, 100);
            if (!hit)
            {
                hud.SetLog($"{attacker.Name} 使用 {skill.name}——但攻击落空了！");
                yield return new WaitForSecondsRealtime(0.65f);
                yield break;
            }

            bool critical = random.NextDouble() < 0.08;
            float typeEffect = TypeEffectiveness(skill.type, defender.Type);
            float randomFactor = 0.85f + (float)random.NextDouble() * 0.15f;
            int damage = BattleDamageCalculator.Calculate(skill.power, attacker.Attack, defender.Defense, attacker.Level,
                string.Equals(skill.type, attacker.Type, StringComparison.OrdinalIgnoreCase), typeEffect, critical, randomFactor);
            defender.ApplyDamage(damage);
            Debug.Log($"[SuperSpirit][Validation] Damage resolved: attacker={attacker.Name}, defender={defender.Name}, skill={skill.name}, damage={damage}, remaining={defender.CurrentHp}/{defender.MaxHp}");

            string effect = critical ? "  暴击！" : typeEffect > 1f ? "  效果拔群！" : typeEffect < 1f ? "  效果有限。" : "";
            yield return hud.PlayAttack(playerAttacks, $"{attacker.Name} 使用 {skill.name}！\n造成 {damage} 点伤害。{effect}");
            screenShake?.Play(critical ? 0.28f : 0.16f, critical ? 0.28f : 0.14f);
            hud.UpdateStats(player, enemy);
            yield return new WaitForSecondsRealtime(0.62f);
        }

        private IEnumerator FleeRoutine()
        {
            turnBusy = true;
            hud.SetInputEnabled(false);
            hud.SetLog("你收束了共鸣，安全撤离战斗。\n探索进度会保留。 ");
            yield return new WaitForSecondsRealtime(0.75f);
            yield return Finish(false);
        }

        private IEnumerator Finish(bool victory)
        {
            yield return hud.Hide();
            IsRunning = false;
            turnBusy = false;
            Debug.Log($"[SuperSpirit][Validation] Battle finished: victory={victory}");
            BattleEnded?.Invoke(victory);
        }

        private static float TypeEffectiveness(string attackType, string defenderType)
        {
            string attack = attackType?.ToUpperInvariant() ?? "NORMAL";
            string defense = defenderType?.ToUpperInvariant() ?? "NORMAL";
            if ((attack == "FIRE" && defense == "GRASS") ||
                (attack == "WATER" && defense == "FIRE") ||
                (attack == "GRASS" && defense == "WATER") ||
                (attack == "ELECTRIC" && defense == "WATER") ||
                (attack == "ROCK" && defense == "FIRE") ||
                (attack == "ICE" && defense == "GRASS")) return 2f;
            if ((attack == "FIRE" && defense == "WATER") ||
                (attack == "WATER" && defense == "GRASS") ||
                (attack == "GRASS" && defense == "FIRE") ||
                (attack == "ELECTRIC" && defense == "ROCK")) return 0.5f;
            return 1f;
        }
    }
}
