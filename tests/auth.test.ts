import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword, generateToken, verifyToken } from "../server/_core/auth";

describe("Authentication Utilities", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should compare password with hash correctly", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it("should not match incorrect password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";
      const hash = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });

    it("should generate different hashes for same password", async () => {
      const password = "testPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("JWT Token", () => {
    it("should generate a valid token", () => {
      const token = generateToken(1, "test@example.com", "user");

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // JWT has 3 parts
    });

    it("should verify a valid token", () => {
      const userId = 1;
      const email = "test@example.com";
      const role = "user" as const;

      const token = generateToken(userId, email, role);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.email).toBe(email);
      expect(decoded?.role).toBe(role);
    });

    it("should return null for invalid token", () => {
      const invalidToken = "invalid.token.here";
      const decoded = verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it("should return null for tampered token", () => {
      const token = generateToken(1, "test@example.com", "user");
      const tamperedToken = token.slice(0, -5) + "xxxxx";
      const decoded = verifyToken(tamperedToken);

      expect(decoded).toBeNull();
    });

    it("should generate different tokens for different users", () => {
      const token1 = generateToken(1, "user1@example.com", "user");
      const token2 = generateToken(2, "user2@example.com", "admin");

      expect(token1).not.toBe(token2);

      const decoded1 = verifyToken(token1);
      const decoded2 = verifyToken(token2);

      expect(decoded1?.userId).toBe(1);
      expect(decoded2?.userId).toBe(2);
      expect(decoded1?.role).toBe("user");
      expect(decoded2?.role).toBe("admin");
    });
  });
});
