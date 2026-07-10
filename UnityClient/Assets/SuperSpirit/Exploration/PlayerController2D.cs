using System;
using SuperSpirit.Presentation;
using UnityEngine;
using UnityEngine.InputSystem;

namespace SuperSpirit.Exploration
{
    public sealed class PlayerController2D : MonoBehaviour
    {
        public float WalkSpeed = 4.8f;
        public float SprintSpeed = 7.2f;
        public event Action<float> DistanceTravelled;
        public event Action<Vector3> PositionChanged;

        private ProceduralMapRenderer map;
        private Transform visual;
        private SpriteRenderer sprite;
        private Vector3 visualBasePosition;
        private bool inputEnabled = true;
        private Vector2 lastInput = Vector2.down;

        public void Initialize(ProceduralMapRenderer mapRenderer, Vector3 spawn)
        {
            map = mapRenderer;
            transform.position = map.ClampPosition(spawn);
            name = "Player · Unity Native Controller";

            GameObject shadow = new("Soft Shadow");
            shadow.transform.SetParent(transform, false);
            shadow.transform.localPosition = new Vector3(0, 0.05f, 0.1f);
            shadow.transform.localScale = new Vector3(0.78f, 0.28f, 1);
            SpriteRenderer shadowRenderer = shadow.AddComponent<SpriteRenderer>();
            shadowRenderer.sprite = RuntimeArt.SolidSprite(new Color(0.03f, 0.05f, 0.08f, 0.35f), 12);
            shadowRenderer.sortingOrder = 480;

            GameObject visualObject = new("Pixel Trainer Visual");
            visualObject.transform.SetParent(transform, false);
            visualObject.transform.localPosition = new Vector3(0, 0.08f, 0);
            visual = visualObject.transform;
            visualBasePosition = visual.localPosition;
            sprite = visualObject.AddComponent<SpriteRenderer>();
            sprite.sprite = RuntimeArt.CreatePlayerSprite();
            sprite.sortingOrder = 500;
        }

        public void SetInputEnabled(bool enabled)
        {
            inputEnabled = enabled;
        }

        public void MoveForValidation(Vector2 delta)
        {
            if (map == null || !inputEnabled || delta.sqrMagnitude <= 0f) return;
            Vector3 before = transform.position;
            transform.position = map.ClampPosition(transform.position + (Vector3)delta);
            float distance = Vector3.Distance(before, transform.position);
            if (distance <= 0f) return;
            DistanceTravelled?.Invoke(distance);
            PositionChanged?.Invoke(transform.position);
        }

        private void Update()
        {
            Vector2 input = ReadInput();
            if (!inputEnabled || input.sqrMagnitude < 0.01f)
            {
                AnimateIdle();
                return;
            }

            input = input.normalized;
            lastInput = input;
            float speed = IsSprintHeld() ? SprintSpeed : WalkSpeed;
            Vector3 before = transform.position;
            transform.position = map.ClampPosition(transform.position + (Vector3)(input * speed * Time.deltaTime));
            float distance = Vector3.Distance(before, transform.position);
            if (distance > 0)
            {
                DistanceTravelled?.Invoke(distance);
                PositionChanged?.Invoke(transform.position);
            }

            if (Mathf.Abs(input.x) > 0.05f) sprite.flipX = input.x < 0;
            float stride = Mathf.Sin(Time.time * speed * 5f);
            visual.localPosition = visualBasePosition + Vector3.up * (Mathf.Abs(stride) * 0.07f);
            visual.localRotation = Quaternion.Euler(0, 0, stride * -2.2f);
        }

        private void AnimateIdle()
        {
            float breath = Mathf.Sin(Time.time * 2.1f) * 0.018f;
            visual.localPosition = visualBasePosition + Vector3.up * breath;
            visual.localRotation = Quaternion.identity;
        }

        private static Vector2 ReadInput()
        {
            Keyboard keyboard = Keyboard.current;
            Gamepad gamepad = Gamepad.current;
            Vector2 input = Vector2.zero;
            if (keyboard != null)
            {
                if (keyboard.aKey.isPressed || keyboard.leftArrowKey.isPressed) input.x -= 1;
                if (keyboard.dKey.isPressed || keyboard.rightArrowKey.isPressed) input.x += 1;
                if (keyboard.sKey.isPressed || keyboard.downArrowKey.isPressed) input.y -= 1;
                if (keyboard.wKey.isPressed || keyboard.upArrowKey.isPressed) input.y += 1;
            }
            if (gamepad != null && gamepad.leftStick.ReadValue().sqrMagnitude > input.sqrMagnitude)
                input = gamepad.leftStick.ReadValue();
            return input;
        }

        private static bool IsSprintHeld()
        {
            Keyboard keyboard = Keyboard.current;
            Gamepad gamepad = Gamepad.current;
            return (keyboard != null && (keyboard.leftShiftKey.isPressed || keyboard.rightShiftKey.isPressed)) ||
                   (gamepad != null && gamepad.leftStickButton.isPressed);
        }
    }
}
