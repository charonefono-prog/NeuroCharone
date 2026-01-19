import { describe, it, expect } from "vitest";
import { getPointFunction, getPointsFunctions, helmetPointFunctions } from "./helmet-point-functions";
import { helmetPoints } from "./helmet-data";

describe("Helmet Point Functions", () => {
  it("should have all helmet points defined in helmet-point-functions", () => {
    const allPointNames = helmetPoints.map(p => p.name);
    const definedPointNames = helmetPointFunctions.map(p => p.point);

    const missingPoints = allPointNames.filter(name => !definedPointNames.includes(name));
    
    expect(missingPoints, `Missing point functions for: ${missingPoints.join(", ")}`).toHaveLength(0);
  });

  it("should return point function for each defined point", () => {
    helmetPointFunctions.forEach(pointFunc => {
      const result = getPointFunction(pointFunc.point);
      expect(result).toBeDefined();
      expect(result?.point).toBe(pointFunc.point);
      expect(result?.function).toBeDefined();
      expect(result?.description).toBeDefined();
    });
  });

  it("should return undefined for non-existent points", () => {
    const result = getPointFunction("NonExistent");
    expect(result).toBeUndefined();
  });

  it("should get multiple point functions", () => {
    const points = ["Fp1", "Fp2", "Fpz"];
    const results = getPointsFunctions(points);
    
    expect(results).toHaveLength(3);
    expect(results.map(r => r.point)).toEqual(points);
  });

  it("should filter out non-existent points in batch query", () => {
    const points = ["Fp1", "NonExistent", "Fp2"];
    const results = getPointsFunctions(points);
    
    expect(results).toHaveLength(2);
    expect(results.map(r => r.point)).toEqual(["Fp1", "Fp2"]);
  });

  it("should have complete information for all points", () => {
    helmetPointFunctions.forEach(pointFunc => {
      expect(pointFunc.point).toBeTruthy();
      expect(pointFunc.function).toBeTruthy();
      expect(pointFunc.description).toBeTruthy();
      
      // Validate that descriptions are not too short
      expect(pointFunc.description.length).toBeGreaterThan(20);
      expect(pointFunc.function.length).toBeGreaterThan(5);
    });
  });

  it("should have 60 points defined", () => {
    expect(helmetPointFunctions).toHaveLength(60);
  });

  it("should have all unique point names", () => {
    const pointNames = helmetPointFunctions.map(p => p.point);
    const uniqueNames = new Set(pointNames);
    
    expect(uniqueNames.size).toBe(pointNames.length);
  });
});
