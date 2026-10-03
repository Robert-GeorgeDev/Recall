import { describe, expect, it } from "vitest";
import { addDays, formatDate, toISODate } from "@/lib/dates";

describe("dates", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(toISODate(new Date(2026, 9, 3))).toBe("2026-10-03");
  });

  it("adds days across month and year ends", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("handles leap years", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
  });

  it("adds a week", () => {
    expect(addDays("2026-10-03", 7)).toBe("2026-10-10");
  });

  it("formats a readable date", () => {
    expect(formatDate("2026-10-03", "en-GB")).toContain("2026");
  });
});
