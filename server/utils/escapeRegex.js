export function escapeRegex(string = "") {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
