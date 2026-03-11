/**
 * Demo Seed Script — 6 months of realistic expense history
 *
 * Generates deterministic patterns:
 *   - Rent on the 1st every month
 *   - Fixed bills (internet, phone, streaming, electric) monthly
 *   - Daily coffee with realistic gaps (weekdays ~75%, weekends ~30%)
 *   - Weekly grocery runs
 *   - Weekday lunches, regular dinners
 *   - Sporadic transport, shopping, entertainment, health
 *   - Month-specific extras (December holiday shopping, etc.)
 *
 * Requires dev server running for auth. Expenses are inserted directly into DB.
 *
 * Usage:
 *   bun scripts/seed-demo.ts
 *   bun scripts/seed-demo.ts --reset   # clear existing demo expenses first
 */

import * as dotenv from "dotenv";
import { db } from "../lib/db";
import { expenses, userPreferences } from "../lib/schema";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const DEMO_EMAIL = "demo@kashio.app";
const DEMO_PASSWORD = "demo1234!";
const DEMO_NAME = "Demo User";

// ---------------------------------------------------------------------------
// Deterministic RNG (LCG) — same seed = same expenses every run
// ---------------------------------------------------------------------------

function makeRng(seed: number) {
  let s = seed | 0;
  return {
    next(): number {
      s = (Math.imul(s, 1664525) + 1013904223) | 0;
      return (s >>> 0) / 0x100000000;
    },
    /** integer in [min, max] inclusive */
    int(min: number, max: number): number {
      return min + Math.floor(this.next() * (max - min + 1));
    },
    /** float rounded to 2 decimals in [min, max] */
    money(min: number, max: number): number {
      return +( min + this.next() * (max - min)).toFixed(2);
    },
    pick<T>(arr: T[]): T {
      return arr[Math.floor(this.next() * arr.length)];
    },
    /** true with given probability */
    chance(p: number): boolean {
      return this.next() < p;
    },
  };
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate(); // month is 1-based here
}

/** 0 = Sunday, 6 = Saturday */
function dayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay();
}

function isWeekend(year: number, month: number, day: number): boolean {
  const d = dayOfWeek(year, month, day);
  return d === 0 || d === 6;
}

// ---------------------------------------------------------------------------
// Expense entry builder
// ---------------------------------------------------------------------------

type ExpenseEntry = {
  amount: string;
  description: string;
  category: string;
  date: string;
  rawInput: string;
};

function entry(
  amount: number,
  description: string,
  category: string,
  year: number,
  month: number,
  day: number,
  rawInput?: string,
): ExpenseEntry {
  return {
    amount: amount.toFixed(2),
    description,
    category,
    date: dateStr(year, month, day),
    rawInput: rawInput ?? `${description.toLowerCase()} $${amount.toFixed(2)}`,
  };
}

// ---------------------------------------------------------------------------
// Pattern generators
// ---------------------------------------------------------------------------

const COFFEE_SHOPS = [
  "Blue Bottle Coffee",
  "Sightglass Coffee",
  "Philz Coffee",
  "Starbucks",
  "Peet's Coffee",
  "Verve Coffee",
];

const GROCERY_STORES = [
  { name: "Trader Joe's", min: 45, max: 95 },
  { name: "Whole Foods", min: 60, max: 130 },
  { name: "Safeway", min: 40, max: 85 },
  { name: "Instacart", min: 70, max: 120 },
];

const LUNCH_SPOTS = [
  { name: "Chipotle - Burrito Bowl", min: 12, max: 16, cat: "food" },
  { name: "Sweetgreen - Salad", min: 14, max: 18, cat: "food" },
  { name: "Subway - Sandwich", min: 9, max: 13, cat: "food" },
  { name: "Poke Bar - Poke Bowl", min: 13, max: 17, cat: "food" },
  { name: "Panera Bread - Soup & Sandwich", min: 11, max: 16, cat: "food" },
  { name: "Local Deli - Sandwich", min: 8, max: 13, cat: "food" },
];

const DINNER_SPOTS = [
  { name: "Thai House - Dinner", min: 18, max: 34 },
  { name: "Nobu - Sushi Dinner", min: 55, max: 95 },
  { name: "Shake Shack - Burger", min: 14, max: 22 },
  { name: "Local Pizzeria - Pizza", min: 20, max: 38 },
  { name: "Indian Palace - Dinner", min: 22, max: 42 },
  { name: "Tacos El Gordo - Tacos", min: 11, max: 20 },
  { name: "Ramen Shop - Ramen Bowl", min: 16, max: 26 },
  { name: "Mediterranean Grill - Dinner", min: 24, max: 45 },
];

const TRANSPORT_OPTIONS = [
  { name: "Uber - Ride", min: 12, max: 38 },
  { name: "Lyft - Ride", min: 11, max: 35 },
  { name: "MBTA - Commute", min: 2, max: 6 },
  { name: "MBTA - Commute", min: 2, max: 6 }, // higher weight for MBTA
];

const SHOPPING_ITEMS = [
  { name: "Amazon - Household Supplies", min: 22, max: 75 },
  { name: "Amazon - Electronics Accessory", min: 18, max: 85 },
  { name: "Target - Household Items", min: 35, max: 95 },
  { name: "Amazon - Books", min: 10, max: 28 },
  { name: "H&M - Clothing", min: 30, max: 80 },
  { name: "Walgreens - Personal Care", min: 15, max: 40 },
];

const ENTERTAINMENT_OPTIONS = [
  { name: "AMC - Movie Ticket", min: 14, max: 22 },
  { name: "Local Bar - Drinks", min: 22, max: 60 },
  { name: "Eventbrite - Event Ticket", min: 25, max: 80 },
  { name: "Bowling Alley - Game Night", min: 18, max: 40 },
  { name: "Escape Room - Activity", min: 28, max: 50 },
  { name: "Comedy Club - Ticket", min: 20, max: 45 },
];

const HEALTH_OPTIONS = [
  { name: "CVS - Pharmacy", min: 12, max: 45 },
  { name: "Walgreens - Medicine", min: 8, max: 35 },
  { name: "Doctor - Copay", min: 30, max: 80 },
  { name: "Dentist - Checkup", min: 120, max: 280 },
  { name: "Urgent Care - Visit", min: 75, max: 180 },
];

// ---------------------------------------------------------------------------
// Per-month expense generator
// ---------------------------------------------------------------------------

function generateMonth(
  year: number,
  month: number,
  startDay: number,
  endDay: number,
): ExpenseEntry[] {
  const rng = makeRng(year * 1000 + month * 7 + 42);
  const result: ExpenseEntry[] = [];

  const isDecember = month === 12;
  const isJanuary = month === 1;

  // ── RENT ────────────────────────────────────────────────────────────────
  if (startDay <= 1) {
    result.push(entry(2200, "Apartment - Monthly Rent", "bills", year, month, 1, "rent $2200"));
  }

  // ── FIXED BILLS ─────────────────────────────────────────────────────────
  if (startDay <= 5 && endDay >= 5) {
    result.push(entry(89.99, "Comcast - Internet", "bills", year, month, 5, "comcast internet $89.99"));
  }
  if (startDay <= 7 && endDay >= 7) {
    result.push(entry(65, "Verizon - Phone Bill", "bills", year, month, 7, "verizon phone bill $65"));
  }
  if (startDay <= 10 && endDay >= 10) {
    result.push(entry(17.99, "Netflix", "bills", year, month, 10, "netflix $17.99"));
  }
  if (startDay <= 12 && endDay >= 12) {
    result.push(entry(11.99, "Spotify", "bills", year, month, 12, "spotify $11.99"));
  }
  if (startDay <= 14 && endDay >= 14) {
    result.push(entry(2.99, "iCloud - Storage Plan", "bills", year, month, 14, "icloud storage $2.99"));
  }

  // Electric: higher in winter (Dec/Jan/Feb) and summer (Jul/Aug), lower otherwise
  if (startDay <= 20 && endDay >= 20) {
    const isWinter = month === 12 || month === 1 || month === 2;
    const base = isWinter ? 145 : 105;
    const electric = rng.money(base, base + 50);
    result.push(entry(electric, "PG&E - Electric Bill", "bills", year, month, 20, `pge electric $${electric}`));
  }

  // ── GYM ─────────────────────────────────────────────────────────────────
  if (startDay <= 15 && endDay >= 15) {
    result.push(entry(85, "Equinox - Gym Membership", "health", year, month, 15, "equinox gym $85"));
  }

  // ── DAILY COFFEE ─────────────────────────────────────────────────────────
  // Weekdays: ~75% chance. Weekends: ~30% chance. Occasional sick/vacation days skipped.
  // Simulate a sick day cluster (~3% chance of 2-3 consecutive misses starting any given day)
  let skipUntil = -1;
  for (let day = startDay; day <= endDay; day++) {
    if (day <= skipUntil) continue;

    const weekend = isWeekend(year, month, day);
    const coffeeChance = weekend ? 0.30 : 0.75;

    // 4% chance of starting a 2-4 day coffee skip (vacation, sick, WFH period)
    if (!weekend && rng.chance(0.04)) {
      skipUntil = day + rng.int(1, 3);
      continue;
    }

    if (rng.chance(coffeeChance)) {
      const shop = rng.pick(COFFEE_SHOPS);
      const amount = rng.money(3.5, 6.75);
      result.push(entry(amount, shop, "food", year, month, day, `${shop.toLowerCase()} coffee $${amount}`));
    }
  }

  // ── GROCERY RUNS ─────────────────────────────────────────────────────────
  // Every 5–8 days
  let lastGrocery = startDay - 10;
  for (let day = startDay; day <= endDay; day++) {
    const gap = 5 + rng.int(0, 3);
    if (day - lastGrocery >= gap) {
      const store = rng.pick(GROCERY_STORES);
      const amount = rng.money(store.min, store.max);
      result.push(entry(amount, store.name, "groceries", year, month, day, `${store.name.toLowerCase()} $${amount}`));
      lastGrocery = day;
    }
  }

  // ── WEEKDAY LUNCHES ──────────────────────────────────────────────────────
  // ~50% of weekdays
  for (let day = startDay; day <= endDay; day++) {
    if (isWeekend(year, month, day)) continue;
    if (rng.chance(0.50)) {
      const spot = rng.pick(LUNCH_SPOTS);
      const amount = rng.money(spot.min, spot.max);
      result.push(entry(amount, spot.name, "food", year, month, day, `${spot.name.toLowerCase()} $${amount}`));
    }
  }

  // ── DINNERS ──────────────────────────────────────────────────────────────
  // 2-4x per week; skip some days, never two in a row (realistic)
  let lastDinner = startDay - 3;
  for (let day = startDay; day <= endDay; day++) {
    const minGap = isWeekend(year, month, day) ? 1 : 2;
    if (day - lastDinner >= minGap && rng.chance(0.35)) {
      const spot = rng.pick(DINNER_SPOTS);
      const amount = rng.money(spot.min, spot.max);
      result.push(entry(amount, spot.name, "food", year, month, day, `dinner ${spot.name.toLowerCase()} $${amount}`));
      lastDinner = day;
    }
  }

  // ── TRANSPORT ────────────────────────────────────────────────────────────
  // ~3 rides/week on average; skip weekends sometimes
  let lastRide = startDay - 2;
  for (let day = startDay; day <= endDay; day++) {
    const chance = isWeekend(year, month, day) ? 0.20 : 0.35;
    if (day - lastRide >= 1 && rng.chance(chance)) {
      const opt = rng.pick(TRANSPORT_OPTIONS);
      const amount = rng.money(opt.min, opt.max);
      result.push(entry(amount, opt.name, "transport", year, month, day, `${opt.name.toLowerCase()} $${amount}`));
      lastRide = day;
    }
  }

  // ── SHOPPING ─────────────────────────────────────────────────────────────
  // 2-5 per month; December gets more (holiday gifts)
  const shoppingCount = isDecember ? rng.int(6, 10) : rng.int(2, 5);
  const usedDays = new Set<number>();
  for (let i = 0; i < shoppingCount; i++) {
    let day = rng.int(startDay, endDay);
    // avoid same day
    while (usedDays.has(day) && usedDays.size < endDay - startDay) {
      day = rng.int(startDay, endDay);
    }
    usedDays.add(day);
    const item = rng.pick(SHOPPING_ITEMS);
    const amount = isDecember ? rng.money(item.min * 1.5, item.max * 2.5) : rng.money(item.min, item.max);
    result.push(entry(amount, item.name, "shopping", year, month, day, `${item.name.toLowerCase()} $${amount}`));
  }

  // December: holiday gift spending burst
  if (isDecember && startDay <= 20) {
    const giftDay = rng.int(18, 23);
    const giftAmount = rng.money(180, 450);
    result.push(entry(giftAmount, "Amazon - Holiday Gifts", "shopping", year, month, giftDay, `amazon holiday gifts $${giftAmount}`));
    result.push(entry(rng.money(80, 180), "Target - Holiday Decorations", "shopping", year, month, rng.int(1, 15), "target holiday decorations"));
  }

  // ── ENTERTAINMENT ────────────────────────────────────────────────────────
  // 1-3 per month; December gets a holiday dinner
  const entertainmentCount = rng.int(1, 3);
  for (let i = 0; i < entertainmentCount; i++) {
    const day = rng.int(startDay, endDay);
    const opt = rng.pick(ENTERTAINMENT_OPTIONS);
    const amount = rng.money(opt.min, opt.max);
    result.push(entry(amount, opt.name, "entertainment", year, month, day, `${opt.name.toLowerCase()} $${amount}`));
  }

  if (isDecember && startDay <= 24) {
    result.push(entry(rng.money(85, 180), "Holiday Dinner - Restaurant", "food", year, month, rng.int(23, Math.min(25, endDay)), "holiday dinner $150"));
  }

  // November: Thanksgiving dinner/grocery surge
  if (month === 11 && startDay <= 27) {
    result.push(entry(rng.money(120, 200), "Whole Foods - Thanksgiving Groceries", "groceries", year, month, rng.int(25, Math.min(27, endDay)), "thanksgiving groceries whole foods"));
    result.push(entry(rng.money(55, 110), "Thanksgiving Dinner - Restaurant", "food", year, month, rng.int(27, Math.min(28, endDay)), "thanksgiving dinner"));
  }

  // January: gym gear / new year motivation
  if (isJanuary && startDay <= 10) {
    result.push(entry(rng.money(60, 140), "Nike - Workout Gear", "shopping", year, month, rng.int(2, 10), "nike workout gear new year"));
    result.push(entry(rng.money(15, 35), "Headspace - Annual Subscription", "health", year, month, 5, "headspace meditation $29.99"));
  }

  // ── HEALTH / PHARMACY ────────────────────────────────────────────────────
  // ~45% chance per month of a health expense
  if (rng.chance(0.45)) {
    const opt = rng.pick(HEALTH_OPTIONS);
    const amount = rng.money(opt.min, opt.max);
    const day = rng.int(startDay, endDay);
    result.push(entry(amount, opt.name, "health", year, month, day, `${opt.name.toLowerCase()} $${amount}`));
  }

  // ── MISC / OTHER ─────────────────────────────────────────────────────────
  const miscOptions = [
    { name: "Haircut - Salon", min: 30, max: 70 },
    { name: "Dry Cleaning - Clothes", min: 18, max: 45 },
    { name: "Car Wash", min: 12, max: 28 },
    { name: "Parking - Downtown", min: 8, max: 30 },
    { name: "Post Office - Shipping", min: 8, max: 25 },
  ];
  if (rng.chance(0.60)) {
    const opt = rng.pick(miscOptions);
    const amount = rng.money(opt.min, opt.max);
    const day = rng.int(startDay, endDay);
    result.push(entry(amount, opt.name, "other", year, month, day, `${opt.name.toLowerCase()} $${amount}`));
  }

  return result;
}

// ---------------------------------------------------------------------------
// Build full 6-month dataset
// ---------------------------------------------------------------------------

function generateAllExpenses(): ExpenseEntry[] {
  // Today: 2026-03-08 (from project context)
  const months: { year: number; month: number; start: number; end: number }[] = [
    { year: 2025, month: 9,  start: 8,  end: 30 }, // Sept 2025 (partial)
    { year: 2025, month: 10, start: 1,  end: 31 }, // Oct 2025
    { year: 2025, month: 11, start: 1,  end: 30 }, // Nov 2025
    { year: 2025, month: 12, start: 1,  end: 31 }, // Dec 2025
    { year: 2026, month: 1,  start: 1,  end: 31 }, // Jan 2026
    { year: 2026, month: 2,  start: 1,  end: 28 }, // Feb 2026
    { year: 2026, month: 3,  start: 1,  end: 7  }, // Mar 2026 (current, partial)
  ];

  const all: ExpenseEntry[] = [];
  for (const { year, month, start, end } of months) {
    all.push(...generateMonth(year, month, start, end));
  }

  return all.sort((a, b) => a.date.localeCompare(b.date));
}

// ---------------------------------------------------------------------------
// Auth helpers (HTTP — needs running server)
// ---------------------------------------------------------------------------

function extractCookie(header: string | null): string {
  if (!header) throw new Error("No Set-Cookie header received");
  const match = header.match(/better-auth\.session_token=([^;,\s]+)/);
  if (!match) throw new Error("Session token not found in Set-Cookie");
  return `better-auth.session_token=${match[1]}`;
}

async function getSessionCookie(): Promise<string> {
  const signUpRes = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD, name: DEMO_NAME }),
    redirect: "manual",
  });

  if (signUpRes.ok) {
    console.log("  ✅ Demo account created");
    return extractCookie(signUpRes.headers.get("set-cookie"));
  }

  if (signUpRes.status !== 422 && signUpRes.status !== 409) {
    throw new Error(`Sign-up failed (${signUpRes.status}): ${await signUpRes.text()}`);
  }

  console.log("  ℹ️  Account already exists — signing in");
  const signInRes = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
    redirect: "manual",
  });

  if (!signInRes.ok) {
    throw new Error(`Sign-in failed (${signInRes.status}): ${await signInRes.text()}`);
  }

  return extractCookie(signInRes.headers.get("set-cookie"));
}

async function getUserId(cookie: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/get-session`, { headers: { Cookie: cookie } });
  if (!res.ok) throw new Error("Could not fetch session");
  const json = (await res.json()) as { user?: { id: string } };
  if (!json.user?.id) throw new Error("No user.id in session");
  return json.user.id;
}

// ---------------------------------------------------------------------------
// DB helpers
// ---------------------------------------------------------------------------

async function clearDemoExpenses(userId: string) {
  await db.delete(expenses).where(eq(expenses.userId, userId));
  console.log("  🗑️  Cleared existing demo expenses");
}

async function insertExpenses(userId: string, rows: ExpenseEntry[]): Promise<number> {
  // Insert in chunks to avoid hitting pg parameter limits
  const CHUNK = 100;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK).map((e) => ({ ...e, userId }));
    await db.insert(expenses).values(chunk);
    inserted += chunk.length;
    process.stdout.write(`  ${"█".repeat(Math.floor((inserted / rows.length) * 30)).padEnd(30, "░")} ${inserted}/${rows.length}\r`);
  }
  process.stdout.write("\n");
  return inserted;
}

async function setupPreferences(userId: string) {
  await db
    .insert(userPreferences)
    .values({
      userId,
      monthlyBudget: "3500",
      currency: "USD",
      timezone: "America/Los_Angeles",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      enabledCategories: ["food", "transport", "entertainment", "shopping", "bills", "health", "groceries", "travel", "education", "other"],
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: { monthlyBudget: "3500", currency: "USD" },
    });
  console.log("  ✅ Preferences set (budget: $3,500/month)");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const shouldReset = process.argv.includes("--reset");

  console.log("🌱 Kashio Demo Seed Script (6 months)");
  console.log(`   Server:  ${BASE_URL}`);
  console.log(`   Account: ${DEMO_EMAIL} / ${DEMO_PASSWORD}\n`);

  try {
    await fetch(`${BASE_URL}/api/auth/get-session`);
  } catch {
    console.error(`❌ Cannot reach ${BASE_URL} — is the dev server running?`);
    console.error("   Run: npm run dev\n");
    process.exit(1);
  }

  console.log("🔐 Auth");
  const cookie = await getSessionCookie();
  const userId = await getUserId(cookie);
  console.log(`  User ID: ${userId}\n`);

  if (shouldReset) {
    console.log("🗑️  Resetting");
    await clearDemoExpenses(userId);
    console.log();
  }

  console.log("⚙️  Preferences");
  await setupPreferences(userId);
  console.log();

  console.log("📊 Generating expenses...");
  const rows = generateAllExpenses();

  // Print per-month summary
  const byMonth: Record<string, { count: number; total: number }> = {};
  for (const r of rows) {
    const key = r.date.slice(0, 7);
    byMonth[key] ??= { count: 0, total: 0 };
    byMonth[key].count++;
    byMonth[key].total += parseFloat(r.amount);
  }
  for (const [month, { count, total }] of Object.entries(byMonth).sort()) {
    console.log(`  ${month}  ${count.toString().padStart(3)} expenses   $${total.toFixed(0).padStart(6)}`);
  }
  console.log(`  ${"─".repeat(38)}`);
  const grandTotal = rows.reduce((s, r) => s + parseFloat(r.amount), 0);
  console.log(`  Total    ${rows.length.toString().padStart(3)} expenses   $${grandTotal.toFixed(0).padStart(6)}\n`);

  console.log("💾 Inserting into database...");
  await insertExpenses(userId, rows);

  console.log(`\n✅ Done! ${rows.length} expenses seeded across 6 months.\n`);
  console.log(`🚀 Login at ${BASE_URL}/login`);
  console.log(`   Email:    ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}\n`);

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
