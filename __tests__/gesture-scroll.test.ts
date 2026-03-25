import { describe, it, expect } from "vitest";

/**
 * Tests for gesture/scroll interaction logic in PatientDetailScreen.
 * These verify the logic that prevents swipe gestures from blocking vertical scroll.
 */

const TABS = ["info", "plan", "timeline", "effectiveness", "history"] as const;
type Tab = (typeof TABS)[number];
const SWIPE_THRESHOLD = 50;

function getNextTab(activeTab: Tab, direction: "left" | "right"): Tab | null {
  const currentIndex = TABS.indexOf(activeTab);
  if (direction === "left" && currentIndex < TABS.length - 1) {
    return TABS[currentIndex + 1];
  } else if (direction === "right" && currentIndex > 0) {
    return TABS[currentIndex - 1];
  }
  return null;
}

function shouldSwipe(
  translationX: number,
  translationY: number,
  isScrolling: boolean
): boolean {
  // Matches the logic in PatientDetailScreen panGesture.onEnd
  if (isScrolling) return false;
  if (Math.abs(translationX) <= Math.abs(translationY) * 1.5) return false;
  if (Math.abs(translationX) <= SWIPE_THRESHOLD) return false;
  return true;
}

describe("Tab Navigation Logic", () => {
  it("should navigate to next tab on left swipe", () => {
    expect(getNextTab("info", "left")).toBe("plan");
    expect(getNextTab("plan", "left")).toBe("timeline");
    expect(getNextTab("timeline", "left")).toBe("effectiveness");
    expect(getNextTab("effectiveness", "left")).toBe("history");
  });

  it("should navigate to previous tab on right swipe", () => {
    expect(getNextTab("history", "right")).toBe("effectiveness");
    expect(getNextTab("effectiveness", "right")).toBe("timeline");
    expect(getNextTab("timeline", "right")).toBe("plan");
    expect(getNextTab("plan", "right")).toBe("info");
  });

  it("should not navigate past first tab", () => {
    expect(getNextTab("info", "right")).toBeNull();
  });

  it("should not navigate past last tab", () => {
    expect(getNextTab("history", "left")).toBeNull();
  });

  it("should have exactly 5 tabs", () => {
    expect(TABS.length).toBe(5);
  });
});

describe("Swipe vs Scroll Detection", () => {
  it("should allow swipe when horizontal movement is dominant and not scrolling", () => {
    expect(shouldSwipe(-80, 10, false)).toBe(true);
    expect(shouldSwipe(80, 10, false)).toBe(true);
  });

  it("should block swipe when user is scrolling vertically", () => {
    expect(shouldSwipe(-80, 10, true)).toBe(false);
    expect(shouldSwipe(80, 10, true)).toBe(false);
  });

  it("should block swipe when vertical movement is dominant", () => {
    // translationY is large relative to translationX
    expect(shouldSwipe(-30, 60, false)).toBe(false);
    expect(shouldSwipe(30, 60, false)).toBe(false);
  });

  it("should block swipe when horizontal distance is below threshold", () => {
    expect(shouldSwipe(-30, 5, false)).toBe(false);
    expect(shouldSwipe(30, 5, false)).toBe(false);
  });

  it("should block swipe for diagonal movements (ambiguous)", () => {
    // translationX = 60, translationY = 50 → 60 <= 50*1.5 = 75, so blocked
    expect(shouldSwipe(60, 50, false)).toBe(false);
  });

  it("should allow swipe for clearly horizontal movements", () => {
    // translationX = 100, translationY = 20 → 100 > 20*1.5 = 30, so allowed
    expect(shouldSwipe(-100, 20, false)).toBe(true);
  });

  it("should handle zero translationY correctly", () => {
    expect(shouldSwipe(-80, 0, false)).toBe(true);
    expect(shouldSwipe(80, 0, false)).toBe(true);
  });

  it("should handle exactly threshold value", () => {
    // Exactly at threshold should not trigger
    expect(shouldSwipe(50, 0, false)).toBe(false);
    expect(shouldSwipe(-50, 0, false)).toBe(false);
  });

  it("should handle just above threshold", () => {
    expect(shouldSwipe(51, 0, false)).toBe(true);
    expect(shouldSwipe(-51, 0, false)).toBe(true);
  });
});
