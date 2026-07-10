using NUnit.Framework;
using SuperSpirit.Battle;
using SuperSpirit.Core;

namespace SuperSpirit.Tests
{
    public sealed class BattleDamageCalculatorTests
    {
        [Test]
        public void DamageMatchesLegacyJavascriptFormula()
        {
            // JS: floor(((((2*20)/5+2)*65*70)/(50*55))+2) * 1.5 * 2 * 1 * 0.9)
            int damage = BattleDamageCalculator.Calculate(65, 70, 55, 20, true, 2f, false, 0.9f);
            Assert.AreEqual(48, damage);
        }

        [Test]
        public void DamageNeverFallsBelowOneForAttackMoves()
        {
            Assert.AreEqual(1, BattleDamageCalculator.Calculate(1, 1, 9999, 1, false, 0.5f, false, 0.85f));
        }

        [Test]
        public void StateMachineRejectsInvalidBootToBattleTransition()
        {
            GameStateMachine machine = new();
            Assert.IsFalse(machine.TryEnter(GameMode.Battle));
            Assert.IsTrue(machine.TryEnter(GameMode.Exploration));
            Assert.IsTrue(machine.TryEnter(GameMode.Battle));
        }
    }
}
