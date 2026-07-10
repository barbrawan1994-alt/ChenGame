using System;
using System.Collections;
using SuperSpirit.Battle;
using SuperSpirit.Data;
using SuperSpirit.Presentation;
using UnityEngine;
using UnityEngine.UI;

namespace SuperSpirit.UI
{
    public sealed class BattleHud : MonoBehaviour
    {
        private Image root;
        private CanvasGroup canvasGroup;
        private Image playerArt;
        private Image enemyArt;
        private Text playerName;
        private Text enemyName;
        private Text playerHpText;
        private Text enemyHpText;
        private Text logText;
        private Image playerHpFill;
        private Image enemyHpFill;
        private readonly Button[] skillButtons = new Button[4];
        private RectTransform playerArtRect;
        private RectTransform enemyArtRect;
        private Action<int> onSkill;
        private Action onFlee;
        private Color playerColor;
        private Color enemyColor;

        public bool IsVisible => root != null && root.gameObject.activeSelf;

        public void Build(Canvas canvas, Action<int> skillAction, Action fleeAction)
        {
            onSkill = skillAction;
            onFlee = fleeAction;
            transform.SetParent(canvas.transform, false);
            root = UiFactory.Panel(transform, "Battle Root", RuntimeArt.Parse("#08111FFF"), Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero);
            canvasGroup = root.gameObject.AddComponent<CanvasGroup>();

            Image sky = UiFactory.Panel(root.transform, "Battle Sky", RuntimeArt.Parse("#263F67"), Vector2.zero, Vector2.one,
                Vector2.zero, Vector2.zero);
            UiFactory.Panel(sky.transform, "Horizon Glow", RuntimeArt.Parse("#9C7BCB"), new Vector2(0, 0.34f), new Vector2(1, 0.7f), Vector2.zero, Vector2.zero);
            UiFactory.Panel(sky.transform, "Arena Ground", RuntimeArt.Parse("#214B46"), new Vector2(0, 0), new Vector2(1, 0.42f), Vector2.zero, Vector2.zero);
            UiFactory.Panel(sky.transform, "Arena Ring", RuntimeArt.Parse("#65CABF55"), new Vector2(0.18f, 0.23f), new Vector2(0.82f, 0.37f), Vector2.zero, Vector2.zero);

            Image titleStrip = UiFactory.Panel(root.transform, "Title Strip", RuntimeArt.Parse("#111A33E8"),
                new Vector2(0, 1), new Vector2(1, 1), new Vector2(28, -102), new Vector2(-28, -24));
            UiFactory.Label(titleStrip.transform, "Title", "野外共鸣  ·  原生回合战斗", 25, UiFactory.Cream, TextAnchor.MiddleLeft,
                Vector2.zero, Vector2.one, new Vector2(24, 8), new Vector2(-24, -8), FontStyle.Bold);
            UiFactory.Label(titleStrip.transform, "Engine", "UNITY 6  ·  URP 2D", 16, UiFactory.Teal, TextAnchor.MiddleRight,
                Vector2.zero, Vector2.one, new Vector2(24, 8), new Vector2(-24, -8), FontStyle.Bold);

            playerArt = UiFactory.Panel(root.transform, "Player Creature", Color.white,
                new Vector2(0.28f, 0.38f), new Vector2(0.28f, 0.38f), new Vector2(-150, -110), new Vector2(150, 130));
            playerArt.preserveAspect = true;
            playerArtRect = playerArt.rectTransform;
            enemyArt = UiFactory.Panel(root.transform, "Enemy Creature", Color.white,
                new Vector2(0.72f, 0.65f), new Vector2(0.72f, 0.65f), new Vector2(-130, -95), new Vector2(130, 115));
            enemyArt.preserveAspect = true;
            enemyArtRect = enemyArt.rectTransform;

            Image playerCard = UiFactory.Panel(root.transform, "Player Status", UiFactory.NavyGlass,
                new Vector2(0, 0), new Vector2(0, 0), new Vector2(34, 292), new Vector2(610, 450));
            playerName = UiFactory.Label(playerCard.transform, "Name", "", 27, UiFactory.Cream, TextAnchor.UpperLeft,
                Vector2.zero, Vector2.one, new Vector2(22, 72), new Vector2(-22, -12), FontStyle.Bold);
            UiFactory.Bar(playerCard.transform, "HP Bar", RuntimeArt.Parse("#070D1B"), UiFactory.Teal,
                Vector2.zero, Vector2.one, new Vector2(22, 28), new Vector2(-22, -82), out playerHpFill);
            playerHpText = UiFactory.Label(playerCard.transform, "HP Text", "", 16, UiFactory.Cream, TextAnchor.LowerRight,
                Vector2.zero, Vector2.one, new Vector2(22, 8), new Vector2(-22, -112), FontStyle.Bold);

            Image enemyCard = UiFactory.Panel(root.transform, "Enemy Status", UiFactory.NavyGlass,
                new Vector2(1, 1), new Vector2(1, 1), new Vector2(-610, -274), new Vector2(-34, -116));
            enemyName = UiFactory.Label(enemyCard.transform, "Name", "", 27, UiFactory.Cream, TextAnchor.UpperLeft,
                Vector2.zero, Vector2.one, new Vector2(22, 72), new Vector2(-22, -12), FontStyle.Bold);
            UiFactory.Bar(enemyCard.transform, "HP Bar", RuntimeArt.Parse("#070D1B"), UiFactory.Coral,
                Vector2.zero, Vector2.one, new Vector2(22, 28), new Vector2(-22, -82), out enemyHpFill);
            enemyHpText = UiFactory.Label(enemyCard.transform, "HP Text", "", 16, UiFactory.Cream, TextAnchor.LowerRight,
                Vector2.zero, Vector2.one, new Vector2(22, 8), new Vector2(-22, -112), FontStyle.Bold);

            Image command = UiFactory.Panel(root.transform, "Command Deck", RuntimeArt.Parse("#111A33F5"),
                new Vector2(0.5f, 0), new Vector2(0.5f, 0), new Vector2(-625, 24), new Vector2(625, 276));
            logText = UiFactory.Label(command.transform, "Battle Log", "选择一个技能。", 21, RuntimeArt.Parse("#C9D6EF"), TextAnchor.MiddleLeft,
                new Vector2(0, 0), new Vector2(0.36f, 1), new Vector2(26, 20), new Vector2(-18, -20), FontStyle.Bold);

            for (int i = 0; i < skillButtons.Length; i++)
            {
                int index = i;
                int row = i / 2;
                int column = i % 2;
                Vector2 min = new(0.38f + column * 0.29f, 0.53f - row * 0.46f);
                Vector2 max = new(0.65f + column * 0.29f, 0.93f - row * 0.46f);
                skillButtons[i] = UiFactory.Button(command.transform, $"Skill {i + 1}", "技能", i % 2 == 0 ? RuntimeArt.Parse("#276C72") : RuntimeArt.Parse("#534B8A"),
                    UiFactory.Cream, min, max, new Vector2(6, 4), new Vector2(-6, -4), () => onSkill?.Invoke(index), 21);
            }

            UiFactory.Button(root.transform, "Flee", "撤离", RuntimeArt.Parse("#6E3A4A"), UiFactory.Cream,
                new Vector2(1, 0), new Vector2(1, 0), new Vector2(-174, 294), new Vector2(-34, 352), () => onFlee?.Invoke(), 18);
            root.gameObject.SetActive(false);
        }

        public IEnumerator Show(BattleCreature player, BattleCreature enemy)
        {
            Bind(player, enemy);
            root.gameObject.SetActive(true);
            canvasGroup.alpha = 0;
            playerArtRect.anchoredPosition += new Vector2(-260, 0);
            enemyArtRect.anchoredPosition += new Vector2(260, 0);
            Vector2 playerTarget = playerArtRect.anchoredPosition + new Vector2(260, 0);
            Vector2 enemyTarget = enemyArtRect.anchoredPosition - new Vector2(260, 0);
            float time = 0;
            while (time < 0.38f)
            {
                time += Time.unscaledDeltaTime;
                float t = Mathf.SmoothStep(0, 1, time / 0.38f);
                canvasGroup.alpha = t;
                playerArtRect.anchoredPosition = Vector2.Lerp(playerTarget - new Vector2(260, 0), playerTarget, t);
                enemyArtRect.anchoredPosition = Vector2.Lerp(enemyTarget + new Vector2(260, 0), enemyTarget, t);
                yield return null;
            }
            canvasGroup.alpha = 1;
            SetInputEnabled(true);
        }

        public IEnumerator Hide()
        {
            SetInputEnabled(false);
            float time = 0;
            while (time < 0.3f)
            {
                time += Time.unscaledDeltaTime;
                canvasGroup.alpha = 1f - Mathf.Clamp01(time / 0.3f);
                yield return null;
            }
            root.gameObject.SetActive(false);
        }

        public void Bind(BattleCreature player, BattleCreature enemy)
        {
            playerColor = TypeColor(player.Type);
            enemyColor = TypeColor(enemy.Type);
            playerArt.sprite = RuntimeArt.CreateCreatureSprite(playerColor, Color.Lerp(playerColor, Color.white, 0.55f), player.Source.id, true);
            enemyArt.sprite = RuntimeArt.CreateCreatureSprite(enemyColor, Color.Lerp(enemyColor, Color.white, 0.55f), enemy.Source.id, false);
            playerArt.color = Color.white;
            enemyArt.color = Color.white;
            UpdateStats(player, enemy, true);
            for (int i = 0; i < skillButtons.Length; i++)
            {
                bool hasSkill = i < player.Skills.Length;
                skillButtons[i].gameObject.SetActive(hasSkill);
                if (!hasSkill) continue;
                SkillRecord skill = player.Skills[i];
                Text label = skillButtons[i].GetComponentInChildren<Text>();
                label.text = $"{skill.name}\n<size=14>{skill.type}  ·  威力 {skill.power}</size>";
            }
            logText.text = $"野生的 {enemy.Name} 出现了！\n选择技能开始战斗。";
        }

        public void UpdateStats(BattleCreature player, BattleCreature enemy, bool immediate = false)
        {
            playerName.text = $"{player.Name}   Lv.{player.Level}   ·   {player.Type}";
            enemyName.text = $"{enemy.Name}   Lv.{enemy.Level}   ·   {enemy.Type}";
            playerHpText.text = $"HP  {player.CurrentHp} / {player.MaxHp}";
            enemyHpText.text = $"HP  {enemy.CurrentHp} / {enemy.MaxHp}";
            if (immediate)
            {
                playerHpFill.fillAmount = player.HpRatio;
                enemyHpFill.fillAmount = enemy.HpRatio;
            }
            else
            {
                StopAllCoroutines();
                StartCoroutine(LerpBar(playerHpFill, player.HpRatio));
                StartCoroutine(LerpBar(enemyHpFill, enemy.HpRatio));
            }
        }

        public IEnumerator PlayAttack(bool playerAttacks, string message)
        {
            SetInputEnabled(false);
            logText.text = message;
            RectTransform attacker = playerAttacks ? playerArtRect : enemyArtRect;
            Image target = playerAttacks ? enemyArt : playerArt;
            Vector2 start = attacker.anchoredPosition;
            Vector2 direction = playerAttacks ? new Vector2(58, 18) : new Vector2(-58, -18);
            float t = 0;
            while (t < 0.16f)
            {
                t += Time.unscaledDeltaTime;
                attacker.anchoredPosition = Vector2.Lerp(start, start + direction, t / 0.16f);
                yield return null;
            }
            target.color = UiFactory.Coral;
            yield return new WaitForSecondsRealtime(0.09f);
            target.color = Color.white;
            t = 0;
            while (t < 0.18f)
            {
                t += Time.unscaledDeltaTime;
                attacker.anchoredPosition = Vector2.Lerp(start + direction, start, t / 0.18f);
                yield return null;
            }
            attacker.anchoredPosition = start;
        }

        public void SetLog(string message) => logText.text = message;

        public void SetInputEnabled(bool enabled)
        {
            foreach (Button button in skillButtons)
                if (button != null) button.interactable = enabled;
        }

        private IEnumerator LerpBar(Image bar, float target)
        {
            float start = bar.fillAmount;
            float time = 0;
            while (time < 0.34f)
            {
                time += Time.unscaledDeltaTime;
                bar.fillAmount = Mathf.Lerp(start, target, Mathf.SmoothStep(0, 1, time / 0.34f));
                yield return null;
            }
            bar.fillAmount = target;
        }

        private static Color TypeColor(string type)
        {
            return type?.ToUpperInvariant() switch
            {
                "FIRE" => RuntimeArt.Parse("#FF7043"),
                "WATER" => RuntimeArt.Parse("#42A5F5"),
                "GRASS" => RuntimeArt.Parse("#66BB6A"),
                "ELECTRIC" => RuntimeArt.Parse("#FFD54F"),
                "ROCK" => RuntimeArt.Parse("#A1887F"),
                "ICE" => RuntimeArt.Parse("#80DEEA"),
                "GHOST" => RuntimeArt.Parse("#7E57C2"),
                "PSYCHIC" => RuntimeArt.Parse("#EC407A"),
                _ => RuntimeArt.Parse("#78909C")
            };
        }
    }
}
