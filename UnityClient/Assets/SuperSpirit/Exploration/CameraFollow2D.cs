using SuperSpirit.Presentation;
using UnityEngine;

namespace SuperSpirit.Exploration
{
    [RequireComponent(typeof(Camera))]
    public sealed class CameraFollow2D : MonoBehaviour
    {
        public Transform Target;
        public float SmoothTime = 0.16f;
        public Vector2 LookAhead = new(0, 0.65f);

        private Vector3 velocity;
        private ProceduralMapRenderer map;
        private Camera cameraComponent;

        public void Initialize(Transform target, ProceduralMapRenderer mapRenderer)
        {
            Target = target;
            map = mapRenderer;
            cameraComponent = GetComponent<Camera>();
            cameraComponent.orthographic = true;
            cameraComponent.orthographicSize = 6.7f;
            cameraComponent.backgroundColor = RuntimeArt.Parse("#08111F");
            transform.position = new Vector3(target.position.x, target.position.y, -10);
            if (GetComponent<ScreenShake>() == null) gameObject.AddComponent<ScreenShake>();
        }

        private void LateUpdate()
        {
            if (Target == null || map == null) return;
            float aspect = Mathf.Max(1f, cameraComponent.aspect);
            float halfHeight = cameraComponent.orthographicSize;
            float halfWidth = halfHeight * aspect;
            float limitX = Mathf.Max(0, ProceduralMapRenderer.Width * 0.5f - halfWidth);
            float limitY = Mathf.Max(0, ProceduralMapRenderer.Height * 0.5f - halfHeight);
            Vector3 desired = Target.position + (Vector3)LookAhead;
            desired.x = Mathf.Clamp(desired.x, -limitX, limitX);
            desired.y = Mathf.Clamp(desired.y, -limitY, limitY);
            desired.z = -10;
            transform.position = Vector3.SmoothDamp(transform.position, desired, ref velocity, SmoothTime);
        }
    }
}
