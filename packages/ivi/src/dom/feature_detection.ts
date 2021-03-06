/**
 * Feature Detection is used to implement polyfills or just disable some features when browser doesn't support them.
 * For example, when browser doesn't support passive events, we can just ignore it and always use active events.
 */

/* istanbul ignore next */
/**
 * Passive event listeners are a new feature in the DOM spec that enable developers to opt-in to better scroll
 * performance by eliminating the need for scrolling to block on touch and wheel event listeners. Developers can
 * annotate touch and wheel listeners with {passive: true} to indicate that they will never invoke preventDefault.
 *
 * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export const PASSIVE_EVENTS = /*#__PURE__*/((TARGET === "electron") ? true :
  (() => {
    let v = false;
    try {
      // Test via a getter in the options object to see if the passive property is accessed
      const opts = Object.defineProperty({}, "passive", {
        get() {
          v = true;
        },
      });
      window.addEventListener("test", null as any as (ev: Event) => void, opts);
    } catch (e) {
      // ignore
    }
    return v;
  })());

/* istanbul ignore next */
/**
 * `key` property is available on KeyboardEvent instances.
 */
export const KEYBOARD_EVENT_KEY = /*#__PURE__*/(
  (TARGET === "electron") ||
  (TARGET === "evergreen") ||
  KeyboardEvent.prototype.hasOwnProperty("key")
);

/* istanbul ignore next */
/**
 * `buttons` property is available on MouseEvent instances.
 */
export const MOUSE_EVENT_BUTTONS = /*#__PURE__*/(
  (TARGET === "electron") ||
  (TARGET === "evergreen") ||
  MouseEvent.prototype.hasOwnProperty("buttons")
);

/* istanbul ignore next */
/**
 * Touch Events support.
 */
export const TOUCH_EVENTS = ("ontouchstart" in window);

/* istanbul ignore next */
/**
 * Pointer Events support.
 */
export const POINTER_EVENTS = ((TARGET === "electron") || ("PointerEvent" in window));

/* istanbul ignore next */
/**
 * InputDeviceCapabilities support.
 *
 * http://wicg.github.io/InputDeviceCapabilities/
 */
export const INPUT_DEVICE_CAPABILITIES = ((TARGET === "electron") || "InputDeviceCapabilities" in window);

/* istanbul ignore next */
/**
 * iOS proprietary GestureEvent.
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/GestureEvent}
 */
export const IOS_GESTURE_EVENT = (TARGET !== "electron") && ("GestureEvent" in window);
