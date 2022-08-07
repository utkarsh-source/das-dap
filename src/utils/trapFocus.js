function preventBlur(e) {
  e.stopPropagation();
}

export function removeFocusTrapListener(element) {
  if (!element) return;
  element.removeEventListener("keydown", preventBlur);
  element.removeEventListener("keypress", preventBlur);
  element.removeEventListener("keyup", preventBlur);
}

export function trapFocus(element) {
  if (!element) return;
  element.addEventListener("keydown", preventBlur);
  element.addEventListener("keypress", preventBlur);
  element.addEventListener("keyup", preventBlur);
}
