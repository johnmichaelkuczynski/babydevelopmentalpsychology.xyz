// Anonymous visitor id: generated once, kept in localStorage, and attached to
// every API call via the X-Anon-Id header (drives visitor counting and the
// free AI-usage budget for signed-out users).

const KEY = "bdp-anon-id";

export function getAnonId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
