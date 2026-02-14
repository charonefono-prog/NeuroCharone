import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("EEG 10-20 System Image Integration", () => {
  it("should have the EEG 10-20 system image in assets", () => {
    const imagePath = path.join(__dirname, "..", "assets", "images", "eeg-10-20-system.png");
    expect(fs.existsSync(imagePath)).toBe(true);
  });

  it("should reference the EEG image in helmet-3d-selector component", () => {
    const componentPath = path.join(__dirname, "..", "components", "helmet-3d-selector.tsx");
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("eeg-10-20-system.png");
    expect(content).toContain("Sistema 10-20");
    expect(content).toContain("Image");
  });

  it("should import Image from react-native in helmet-3d-selector", () => {
    const componentPath = path.join(__dirname, "..", "components", "helmet-3d-selector.tsx");
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("Image");
    expect(content).toContain("from \"react-native\"");
  });

  it("should have the caption text for the EEG image", () => {
    const componentPath = path.join(__dirname, "..", "components", "helmet-3d-selector.tsx");
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("Pontos de Estimulação (Apenas áreas coloridas)");
  });
});
