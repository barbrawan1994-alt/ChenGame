using SuperSpirit.Data;

namespace SuperSpirit.Battle
{
    public sealed class BattleCreature
    {
        public PetRecord Source { get; }
        public string Name => Source.name;
        public string Type => Source.type;
        public int Level { get; }
        public int MaxHp { get; }
        public int CurrentHp { get; private set; }
        public int Attack { get; }
        public int Defense { get; }
        public SkillRecord[] Skills { get; }
        public bool IsFainted => CurrentHp <= 0;
        public float HpRatio => MaxHp <= 0 ? 0 : (float)CurrentHp / MaxHp;

        public BattleCreature(PetRecord source, int level, SkillRecord[] skills)
        {
            Source = source;
            Level = level;
            MaxHp = source.hp + level * 3;
            CurrentHp = MaxHp;
            Attack = source.atk + level * 2;
            Defense = source.def + level * 2;
            Skills = skills;
        }

        public int ApplyDamage(int amount)
        {
            int before = CurrentHp;
            CurrentHp = System.Math.Max(0, CurrentHp - System.Math.Max(0, amount));
            return before - CurrentHp;
        }
    }
}
