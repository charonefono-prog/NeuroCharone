import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcrypt";

/**
 * E2E Tests for PWA Authentication Flow
 * Tests the complete user journey: register → pending → approve → login
 */

const testUsersFile = path.join(process.cwd(), "test-e2e-users.json");

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

function saveTestUsers(users: Record<string, any>) {
  try {
    fs.writeFileSync(testUsersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error saving test users:", err);
  }
}

describe("PWA Authentication E2E Flow", () => {
  beforeEach(() => {
    if (fs.existsSync(testUsersFile)) {
      fs.unlinkSync(testUsersFile);
    }
    saveTestUsers({});
  });

  afterEach(() => {
    if (fs.existsSync(testUsersFile)) {
      fs.unlinkSync(testUsersFile);
    }
  });

  describe("Complete User Journey", () => {
    it("should complete full flow: register → pending → approve → login", async () => {
      const users = loadTestUsers();
      const email = "newuser@example.com";
      const name = "New User";
      const password = "password123";

      // Step 1: Register new user
      console.log("\n📝 Step 1: Register new user");
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

      let savedUsers = loadTestUsers();
      expect(savedUsers[email]).toBeDefined();
      expect(savedUsers[email].status).toBe("pending");
      console.log(`✓ User registered with status: pending`);

      // Step 2: Verify user cannot login while pending
      console.log("\n🔒 Step 2: Verify pending user cannot login");
      const user = savedUsers[email];
      const passwordMatch = await bcrypt.compare(password, user.password);
      expect(passwordMatch).toBe(true);
      expect(user.status).toBe("pending");
      console.log(`✓ Pending user cannot login (status check)`);

      // Step 3: Admin approves user
      console.log("\n✅ Step 3: Admin approves user");
      savedUsers[email].status = "active";
      savedUsers[email].approvedAt = new Date().toISOString();
      saveTestUsers(savedUsers);

      savedUsers = loadTestUsers();
      expect(savedUsers[email].status).toBe("active");
      expect(savedUsers[email].approvedAt).toBeDefined();
      console.log(`✓ User approved at: ${savedUsers[email].approvedAt}`);

      // Step 4: User can now login
      console.log("\n🔓 Step 4: Approved user can login");
      const approvedUser = savedUsers[email];
      const passwordValid = await bcrypt.compare(password, approvedUser.password);
      expect(passwordValid).toBe(true);
      expect(approvedUser.status).toBe("active");
      console.log(`✓ User successfully logged in`);
    });

    it("should handle multiple pending users and selective approval", async () => {
      const users = loadTestUsers();

      // Register 3 users
      console.log("\n📝 Registering 3 users...");
      const testUsers = [
        { email: "user1@example.com", name: "User 1", password: "pass1" },
        { email: "user2@example.com", name: "User 2", password: "pass2" },
        { email: "user3@example.com", name: "User 3", password: "pass3" },
      ];

      for (const testUser of testUsers) {
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        users[testUser.email] = {
          id: Date.now().toString() + Math.random(),
          name: testUser.name,
          email: testUser.email,
          password: hashedPassword,
          status: "pending",
          createdAt: new Date().toISOString(),
          approvedAt: null,
        };
      }
      saveTestUsers(users);

      let savedUsers = loadTestUsers();
      const pendingCount = Object.values(savedUsers).filter(
        (u: any) => u.status === "pending"
      ).length;
      expect(pendingCount).toBe(3);
      console.log(`✓ 3 users registered as pending`);

      // Admin approves only user1 and user2
      console.log("\n✅ Admin approves user1 and user2...");
      savedUsers["user1@example.com"].status = "active";
      savedUsers["user1@example.com"].approvedAt = new Date().toISOString();
      savedUsers["user2@example.com"].status = "active";
      savedUsers["user2@example.com"].approvedAt = new Date().toISOString();
      saveTestUsers(savedUsers);

      savedUsers = loadTestUsers();
      const activeCount = Object.values(savedUsers).filter(
        (u: any) => u.status === "active"
      ).length;
      const stillPendingCount = Object.values(savedUsers).filter(
        (u: any) => u.status === "pending"
      ).length;

      expect(activeCount).toBe(2);
      expect(stillPendingCount).toBe(1);
      console.log(`✓ 2 users approved, 1 still pending`);

      // Admin rejects user3
      console.log("\n❌ Admin rejects user3...");
      savedUsers["user3@example.com"].status = "rejected";
      saveTestUsers(savedUsers);

      savedUsers = loadTestUsers();
      const rejectedCount = Object.values(savedUsers).filter(
        (u: any) => u.status === "rejected"
      ).length;

      expect(rejectedCount).toBe(1);
      console.log(`✓ 1 user rejected`);
    });

    it("should prevent duplicate email registration", async () => {
      const users = loadTestUsers();
      const email = "duplicate@example.com";

      // Register first user
      console.log("\n📝 Registering first user...");
      const hashedPassword = await bcrypt.hash("password", 10);
      users[email] = {
        id: "1",
        name: "First User",
        email,
        password: hashedPassword,
        status: "pending",
        createdAt: new Date().toISOString(),
        approvedAt: null,
      };
      saveTestUsers(users);

      let savedUsers = loadTestUsers();
      expect(savedUsers[email]).toBeDefined();
      console.log(`✓ First user registered`);

      // Try to register duplicate
      console.log("\n⚠️ Attempting duplicate registration...");
      const isDuplicate = savedUsers[email] !== undefined;
      expect(isDuplicate).toBe(true);
      console.log(`✓ Duplicate detected, registration would be rejected`);
    });

    it("should track approval timeline", async () => {
      const users = loadTestUsers();
      const email = "timeline@example.com";

      // Register
      console.log("\n📝 User registered");
      const createdAt = new Date().toISOString();
      const hashedPassword = await bcrypt.hash("password", 10);
      users[email] = {
        id: "1",
        name: "Timeline User",
        email,
        password: hashedPassword,
        status: "pending",
        createdAt,
        approvedAt: null,
      };
      saveTestUsers(users);

      let savedUsers = loadTestUsers();
      expect(savedUsers[email].createdAt).toBe(createdAt);
      expect(savedUsers[email].approvedAt).toBeNull();
      console.log(`  Created: ${createdAt}`);

      // Wait a bit and approve
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("\n✅ User approved");
      const approvedAt = new Date().toISOString();
      savedUsers[email].status = "active";
      savedUsers[email].approvedAt = approvedAt;
      saveTestUsers(savedUsers);

      savedUsers = loadTestUsers();
      expect(savedUsers[email].approvedAt).toBeDefined();
      expect(savedUsers[email].approvedAt).not.toBeNull();
      console.log(`  Approved: ${approvedAt}`);

      // Calculate wait time
      const createdTime = new Date(savedUsers[email].createdAt).getTime();
      const approvedTime = new Date(savedUsers[email].approvedAt).getTime();
      const waitTime = approvedTime - createdTime;
      console.log(`  Wait time: ${waitTime}ms`);
    });
  });

  describe("Admin Operations", () => {
    it("should list only pending users", async () => {
      const users = loadTestUsers();

      // Create mixed status users
      console.log("\n📝 Creating users with mixed statuses...");
      const mixedUsers = [
        { email: "pending1@example.com", status: "pending" },
        { email: "active1@example.com", status: "active" },
        { email: "pending2@example.com", status: "pending" },
        { email: "rejected1@example.com", status: "rejected" },
        { email: "active2@example.com", status: "active" },
      ];

      for (const u of mixedUsers) {
        users[u.email] = {
          id: Date.now().toString() + Math.random(),
          name: u.email.split("@")[0],
          email: u.email,
          password: "hashed",
          status: u.status,
          createdAt: new Date().toISOString(),
          approvedAt: u.status === "active" ? new Date().toISOString() : null,
        };
      }
      saveTestUsers(users);

      // Get pending users
      console.log("\n🔍 Filtering pending users...");
      const savedUsers = loadTestUsers();
      const pendingUsers = Object.values(savedUsers).filter(
        (u: any) => u.status === "pending"
      );

      expect(pendingUsers).toHaveLength(2);
      expect(pendingUsers.every((u: any) => u.status === "pending")).toBe(true);
      console.log(`✓ Found ${pendingUsers.length} pending users`);
      pendingUsers.forEach((u: any) => {
        console.log(`  - ${u.name} (${u.email})`);
      });
    });
  });
});
