import { describe, it, expect } from "vitest";
import {
  generateHelmetSVG,
  generateHelmetHTML,
  generatePointsSummary,
} from "./helmet-capture";

describe("Helmet Capture", () => {
  const selectedPoints = ["F3", "F4", "C3", "C4"];

  it("deve gerar SVG válido do capacete", () => {
    const svg = generateHelmetSVG(selectedPoints);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("circle");
  });

  it("deve incluir pontos selecionados no SVG", () => {
    const svg = generateHelmetSVG(selectedPoints);

    selectedPoints.forEach((point) => {
      expect(svg).toContain(`>${point}<`);
    });
  });

  it("deve gerar HTML válido do capacete", () => {
    const html = generateHelmetHTML(selectedPoints);

    expect(html).toContain("<svg");
    expect(html).toContain("Visualização do Capacete");
    expect(html).toContain("Pontos Estimulados");
  });

  it("deve incluir pontos na legenda HTML", () => {
    const html = generateHelmetHTML(selectedPoints);

    selectedPoints.forEach((point) => {
      expect(html).toContain(point);
    });
  });

  it("deve gerar resumo de pontos por região", () => {
    const summary = generatePointsSummary(selectedPoints);

    expect(summary).toContain("Pontos de Estimulação:");
    expect(summary).toContain("Frontal Central");
    expect(summary).toContain("Central / Sensório-Motora");
  });

  it("deve lidar com lista vazia de pontos", () => {
    const svg = generateHelmetSVG([]);
    const html = generateHelmetHTML([]);
    const summary = generatePointsSummary([]);

    expect(svg).toContain("<svg");
    expect(html).toContain("Visualização do Capacete");
    expect(summary).toContain("Pontos de Estimulação:");
  });

  it("deve gerar SVG com dimensões corretas", () => {
    const svg = generateHelmetSVG(selectedPoints);

    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="400"');
  });
});
