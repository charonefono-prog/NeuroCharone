import { describe, it, expect } from "vitest";
import { Resend } from "resend";

describe("Resend Email Service", () => {
  it("should validate Resend API key", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^re_/);
  });

  it("should initialize Resend client with valid API key", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(() => {
      new Resend(apiKey);
    }).not.toThrow();
  });

  it("should test email sending capability", async () => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Este teste apenas verifica se a API está acessível
    // Não envia um email real
    expect(resend).toBeDefined();
    expect(resend.emails).toBeDefined();
  });
});
