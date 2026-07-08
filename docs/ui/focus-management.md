# Focus Management for Modal Dialogs

## Why Focus is Reset After Modal Close

When a modal dialog is closed (via Escape key, close button, or overlay), focus is explicitly managed to:

- **Remove focus from the triggering button**: Prevents the persistent 'clicked' underline/focus ring that can remain on buttons after closing a modal, which is visually distracting and can confuse keyboard users.
- **Restore accessibility**: Ensures that keyboard and assistive technology users are not left in an ambiguous focus state. Focus is moved to a safe, neutral element (such as `document.body`) so that tab order resumes naturally.
- **Prevent accidental actions**: If focus remains on the trigger, pressing Space/Enter could re-open the modal or trigger unwanted actions.

## Accessibility Considerations

- **Keyboard Navigation**: After closing the modal, users can continue tabbing through the page without being trapped or losing their place.
- **Screen Readers**: Focus management ensures that screen readers do not remain on a now-hidden element, which would be confusing.
- **Blur on Close**: Calling `.blur()` on the active button removes the focus ring/underline, providing a clean UI and clear focus state.

## Implementation Example

```js
function closeModal() {
  // ...existing modal close logic...
  if (lastFocusedElement instanceof HTMLElement) {
    if (document.activeElement === lastFocusedElement) {
      lastFocusedElement.blur();
    }
  }
  document.body.focus();
}
```

- The modal close logic ensures that any focused button (trigger or close) is blurred.
- Focus is then set to `document.body` (or another safe element) to reset the focus context.

## Best Practices
- Never remove global focus styles.
- Always manage focus explicitly when modals open/close.
- Test with keyboard and screen reader to ensure compliance.

---

**References:**
- [WAI-ARIA Authoring Practices: Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN: Managing Focus](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets#managing_focus)
