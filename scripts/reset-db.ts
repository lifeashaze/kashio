import { db } from "../lib/db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import * as readline from "readline";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function confirmReset(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "⚠️  This will DELETE ALL DATA from the database. Are you sure? (yes/no): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      }
    );
  });
}

async function resetDatabase() {
  try {
    console.log("🗑️  Database Reset Utility");
    console.log("📋 Tables to be cleared:");
    console.log("   - user (and related sessions, accounts)");
    console.log("   - session");
    console.log("   - account");
    console.log("   - verification");
    console.log("   - changelog");
    console.log("   - expenses\n");

    const confirmed = await confirmReset();

    if (!confirmed) {
      console.log("❌ Reset cancelled.");
      process.exit(0);
    }

    console.log("\n🗑️  Clearing database...");

    // Truncate all tables with CASCADE to handle foreign key constraints
    // This is faster than DELETE and resets auto-increment counters
    await db.execute(sql`TRUNCATE TABLE "user" CASCADE`);
    await db.execute(sql`TRUNCATE TABLE "session" CASCADE`);
    await db.execute(sql`TRUNCATE TABLE "account" CASCADE`);
    await db.execute(sql`TRUNCATE TABLE "verification" CASCADE`);
    await db.execute(sql`TRUNCATE TABLE "changelog" CASCADE`);
    await db.execute(sql`TRUNCATE TABLE "expenses" CASCADE`);

    console.log("✅ Database reset successfully!");
    console.log("📊 All data has been cleared from all tables.");
    console.log("\n⚠️  IMPORTANT: Clear your browser cookies to avoid redirect loops!");
    console.log("   1. Open DevTools (F12)");
    console.log("   2. Go to Application/Storage tab");
    console.log("   3. Cookies → localhost:3000");
    console.log("   4. Delete 'better-auth.session_token' cookie");
    console.log("   5. Refresh the page\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
