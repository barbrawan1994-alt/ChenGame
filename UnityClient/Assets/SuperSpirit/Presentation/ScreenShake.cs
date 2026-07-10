using System.Collections;
using UnityEngine;

namespace SuperSpirit.Presentation
{
    public sealed class ScreenShake : MonoBehaviour
    {
        private Coroutine running;

        public void Play(float duration = 0.18f, float magnitude = 0.18f)
        {
            if (running != null) StopCoroutine(running);
            running = StartCoroutine(Shake(duration, magnitude));
        }

        private IEnumerator Shake(float duration, float magnitude)
        {
            float elapsed = 0f;
            Vector3 basePosition = transform.localPosition;
            while (elapsed < duration)
            {
                float damping = 1f - elapsed / duration;
                transform.localPosition = basePosition + (Vector3)(Random.insideUnitCircle * magnitude * damping);
                elapsed += Time.unscaledDeltaTime;
                yield return null;
            }
            transform.localPosition = basePosition;
            running = null;
        }
    }
}
