import { getDb } from "../server/db";
import { accessControl } from "@/drizzle/schema";
import * as bcrypt from "bcrypt";

async function seedAdmin() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    process.exit(1);
  }

  // Hash the default admin password
  const password = "admin123456";
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert default admin user
  try {
    await db.insert(accessControl).values({
      email: "admin@neurolasermap.com",
      name: "Administrador",
      passwordHash: passwordHash,
      isApproved: true,
      accessLevel: "admin",
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@neurolasermap.com");
    console.log("🔑 Password: admin123456");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
  } catch (error: any) {
    if (error.message?.includes("Duplicate")) {
      console.log("ℹ️  Admin user already exists");
    } else {
      console.error("Error creating admin user:", error);
      process.exit(1);
    }
  }

  process.exit(0);
}

seedAdmin();
