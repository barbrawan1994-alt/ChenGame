using System;

namespace SuperSpirit.Core
{
    public enum GameMode
    {
        Boot,
        Exploration,
        Battle,
        Paused
    }

    public sealed class GameStateMachine
    {
        public GameMode Current { get; private set; } = GameMode.Boot;
        public event Action<GameMode, GameMode> Changed;

        public bool TryEnter(GameMode next)
        {
            if (Current == next) return false;
            if (!CanTransition(Current, next)) return false;

            GameMode previous = Current;
            Current = next;
            Changed?.Invoke(previous, next);
            return true;
        }

        private static bool CanTransition(GameMode from, GameMode to)
        {
            return from switch
            {
                GameMode.Boot => to == GameMode.Exploration,
                GameMode.Exploration => to is GameMode.Battle or GameMode.Paused,
                GameMode.Battle => to is GameMode.Exploration or GameMode.Paused,
                GameMode.Paused => to is GameMode.Exploration or GameMode.Battle,
                _ => false
            };
        }
    }
}
