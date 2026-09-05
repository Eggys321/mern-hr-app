import { describe, it, expect } from "vitest";
import { escapeRegex } from "../utils/escapeRegex.js";

describe("escapeRegex", () => {
  it("leaves plain text untouched", () => {
    expect(escapeRegex("john")).toBe("john");
  });

  it("escapes regex metacharacters so they are treated literally", () => {
    expect(escapeRegex("a.*b")).toBe("a\\.\\*b");
    expect(escapeRegex("(evil)")).toBe("\\(evil\\)");
    expect(escapeRegex("a+b?c^d$e{f}g|h[i]j\\k")).toBe(
      "a\\+b\\?c\\^d\\$e\\{f\\}g\\|h\\[i\\]j\\\\k"
    );
  });

  it("neutralizes a catastrophic-backtracking ReDoS pattern into a literal string", () => {
    const malicious = "(a+)+$";
    const escaped = escapeRegex(malicious);
    expect(() => new RegExp(escaped)).not.toThrow();
    expect(new RegExp(escaped).test(malicious)).toBe(true);
    expect(new RegExp(escaped).test("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!")).toBe(false);
  });

  it("handles undefined/empty input without throwing", () => {
    expect(escapeRegex(undefined)).toBe("");
    expect(escapeRegex("")).toBe("");
  });
});
