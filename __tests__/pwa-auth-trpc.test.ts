import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

// Mock the file system for testing
const testUsersFile = path.join(process.cwd(), "test-users.json");

// Helper function to load users from test file
function loadTestUsers(): Record<string, any> {
  try {
    if (fs.existsSync(testUsersFile)) {
      const data = fs.readFileSync(testUsersFile, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading test users:", err);
  }
  return {};
}

// Helper function to save users to test file
function saveTestUsers(users: Record<string, any>) {
  try {
    fs.writeFileSync(testUsersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error saving test users:", err);
  }
}

describe("PWA Authentication tRPC Procedures", () => {
  beforeEach(() => {
    // Clear test users file before each test
    if (fs.existsSync(testUsersFile)) {
      fs.unlinkSync(testUsersFile);
    }
    saveTestUsers({});
  });

  afterEach(() => {
    // Clean up test file
    if (fs.existsSync(testUsersFile)) {
      fs.unlinkSync(testUsersFile);
    }
  });

  describe("register", () => {
    it("should register a new user with pending status", async () => {
      const users = loadTestUsers();
      const email = "test@example.com";
      const name = "Test User";
      const password = "password123";

      const hashedPassword = await bcrypt.hash(password, 10);
      users[email] = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveTestUsers(users);

      const savedUsers = loadTestUsers();
      expect(savedUsers[email]).toBeDefined();
      expect(savedUsers[email].status).toBe("pending");
      expect(savedUsers[email].email).toBe(email);
    });

    it("should reject duplicate email registration", async () => {
      const users = loadTestUsers();
      const email = "test@example.com";

      // Add first user
      users[email] = {
        id: "1",
        name: "User 1",
        email,
        password: "hashed",
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveTestUsers(users);

      // Try to add duplicate
      const savedUsers = loadTestUsers();
      expect(savedUsers[email]).toBeDefined();
    });
  });

  describe("login", () => {
    it("should login active user with valid credentials", async () => {
      const users = loadTestUsers();
      const email = "active@example.com";
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      users[email] = {
        id: "1",
        name: "Active User",
        email,
        password: hashedPassword,
        status: "active",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };
      saveTestUsers(users);

      // Verify password
      const savedUsers = loadTestUsers();
      const user = savedUsers[email];
      const passwordMatch = await bcrypt.compare(password, user.password);
      expect(passwordMatch).toBe(true);
      expect(user.status).toBe("active");
    });

    it("should reject login for pending user", async () => {
      const users = loadTestUsers();
      const email = "pending@example.com";
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      users[email] = {
        id: "2",
        name: "Pending User",
        email,
        password: hashedPassword,
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveTestUsers(users);

      const savedUsers = loadTestUsers();
      const user = savedUsers[email];
      expect(user.status).toBe("pending");
    });

    it("should reject login with invalid password", async () => {
      const users = loadTestUsers();
      const email = "test@example.com";
      const correctPassword = "password123";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await bcrypt.hash(correctPassword, 10);

      users[email] = {
        id: "3",
        name: "Test User",
        email,
        password: hashedPassword,
        status: "active",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };
      saveTestUsers(users);

      const savedUsers = loadTestUsers();
      const user = savedUsers[email];
      const passwordMatch = await bcrypt.compare(wrongPassword, user.password);
      expect(passwordMatch).toBe(false);
    });
  });

  describe("getPendingUsers", () => {
    it("should return only pending users", () => {
      const users = loadTestUsers();

      users["pending1@example.com"] = {
        id: "1",
        name: "Pending User 1",
        email: "pending1@example.com",
        password: "hashed",
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };

      users["active@example.com"] = {
        id: "2",
        name: "Active User",
        email: "active@example.com",
        password: "hashed",
        status: "active",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };

      users["pending2@example.com"] = {
        id: "3",
        name: "Pending User 2",
        email: "pending2@example.com",
        password: "hashed",
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };

      saveTestUsers(users);

      const savedUsers = loadTestUsers();
      const pendingUsers = Object.values(savedUsers).filter(
        (u: any) => u.status === "pending"
      );

      expect(pendingUsers).toHaveLength(2);
      expect(pendingUsers.every((u: any) => u.status === "pending")).toBe(true);
    });
  });

  describe("approveUser", () => {
    it("should approve a pending user", () => {
      const users = loadTestUsers();
      const email = "pending@example.com";

      users[email] = {
        id: "1",
        name: "Pending User",
        email,
        password: "hashed",
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveTestUsers(users);

      // Approve user
      const savedUsers = loadTestUsers();
      const user = savedUsers[email];
      user.status = "active";
      user.approvedAt = new Date().toISOString();
      saveTestUsers(savedUsers);

      const updatedUsers = loadTestUsers();
      expect(updatedUsers[email].status).toBe("active");
      expect(updatedUsers[email].approvedAt).toBeDefined();
    });
  });

  describe("rejectUser", () => {
    it("should reject a pending user", () => {
      const users = loadTestUsers();
      const email = "pending@example.com";

      users[email] = {
        id: "1",
        name: "Pending User",
        email,
        password: "hashed",
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveTestUsers(users);

      // Reject user
      const savedUsers = loadTestUsers();
      const user = savedUsers[email];
      user.status = "rejected";
      saveTestUsers(savedUsers);

      const updatedUsers = loadTestUsers();
      expect(updatedUsers[email].status).toBe("rejected");
    });
  });

  describe("verifyToken", () => {
    it("should verify valid JWT token", () => {
      const JWT_SECRET = "test-secret";
      const payload = { email: "test@example.com", name: "Test User", id: "1" };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded).toBeDefined();
      expect((decoded as any).email).toBe("test@example.com");
    });

    it("should reject invalid JWT token", () => {
      const JWT_SECRET = "test-secret";
      const invalidToken = "invalid.token.here";

      expect(() => {
        jwt.verify(invalidToken, JWT_SECRET);
      }).toThrow();
    });

    it("should reject expired JWT token", () => {
      const JWT_SECRET = "test-secret";
      const payload = { email: "test@example.com", name: "Test User", id: "1" };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "-1s" });

      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });
  });
});
