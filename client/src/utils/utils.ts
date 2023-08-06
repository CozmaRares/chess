export function removeLocationState() {
  window.history.replaceState({ state: null }, document.title);
}
