export type Category =
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "bills"
  | "health"
  | "groceries"
  | "travel"
  | "education"
  | "other";

export type ExpenseExample = {
  text: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  parseTime: number;
};

export const EXPENSE_EXAMPLES: ExpenseExample[] = [
  // Food
  { text: "coffee with sarah $12",               description: "coffee with sarah",              amount: 12,     category: "food",          date: "Today, 9:15 AM",       parseTime: 612 },
  { text: "starbucks $6.50",                     description: "starbucks",                      amount: 6.50,   category: "food",          date: "Today, 8:00 AM",       parseTime: 378 },
  { text: "split dinner 4 ways $160",            description: "dinner (split 4 ways)",          amount: 40,     category: "food",          date: "Yesterday, 7:30 PM",   parseTime: 721 },
  { text: "pizza delivery $32",                  description: "pizza delivery",                 amount: 32,     category: "food",          date: "Yesterday, 8:00 PM",   parseTime: 475 },
  { text: "brunch mimosas $45",                  description: "brunch with mimosas",            amount: 45,     category: "food",          date: "Yesterday, 11:00 AM",  parseTime: 612 },
  { text: "sushi takeout 55",                    description: "sushi takeout",                  amount: 55,     category: "food",          date: "Yesterday, 7:00 PM",   parseTime: 508 },
  { text: "taco bell drive-thru $14",            description: "taco bell",                      amount: 14,     category: "food",          date: "Yesterday, 12:30 PM",  parseTime: 374 },
  { text: "boba tea $7",                         description: "boba tea",                       amount: 7,      category: "food",          date: "Today, 2:30 PM",       parseTime: 361 },
  { text: "ramen split with friend $22",         description: "ramen (split)",                  amount: 11,     category: "food",          date: "Yesterday, 6:30 PM",   parseTime: 584 },
  { text: "wings and beers $38",                 description: "wings and beers",                amount: 38,     category: "food",          date: "Yesterday, 8:30 PM",   parseTime: 497 },
  { text: "brunch with friends $55",             description: "brunch with friends",            amount: 55,     category: "food",          date: "Yesterday, 10:30 AM",  parseTime: 531 },
  { text: "smoothie $8.50",                      description: "smoothie",                       amount: 8.50,   category: "food",          date: "Today, 9:45 AM",       parseTime: 352 },
  { text: "mcdonalds breakfast $9",              description: "mcdonald's breakfast",           amount: 9,      category: "food",          date: "Today, 7:45 AM",       parseTime: 387 },
  { text: "bagel and latte $11",                 description: "bagel and latte",                amount: 11,     category: "food",          date: "Today, 8:30 AM",       parseTime: 369 },
  { text: "happy hour drinks $28",               description: "happy hour drinks",              amount: 28,     category: "food",          date: "Yesterday, 6:00 PM",   parseTime: 489 },
  { text: "dim sum sunday $41",                  description: "dim sum",                        amount: 41,     category: "food",          date: "Yesterday, 11:30 AM",  parseTime: 524 },
  { text: "thai food delivery 36",               description: "thai food delivery",             amount: 36,     category: "food",          date: "Yesterday, 7:30 PM",   parseTime: 463 },
  { text: "chipotle burrito bowl $13",           description: "chipotle",                       amount: 13,     category: "food",          date: "Today, 1:00 PM",       parseTime: 391 },
  { text: "subway footlong $11",                 description: "subway",                         amount: 11,     category: "food",          date: "Today, 12:15 PM",      parseTime: 344 },
  { text: "korean bbq $65",                      description: "korean bbq",                     amount: 65,     category: "food",          date: "Yesterday, 7:00 PM",   parseTime: 543 },
  { text: "lunch at the deli $14",               description: "deli lunch",                     amount: 14,     category: "food",          date: "Today, 12:30 PM",      parseTime: 362 },
  { text: "poke bowl $17",                       description: "poke bowl",                      amount: 17,     category: "food",          date: "Today, 12:00 PM",      parseTime: 378 },
  { text: "birthday cake $42",                   description: "birthday cake",                  amount: 42,     category: "food",          date: "Today",                parseTime: 467 },
  { text: "afternoon cookie $3",                 description: "cookie",                         amount: 3,      category: "food",          date: "Today, 3:00 PM",       parseTime: 298 },
  { text: "iced coffee $5.75",                   description: "iced coffee",                    amount: 5.75,   category: "food",          date: "Today, 10:00 AM",      parseTime: 321 },

  // Groceries
  { text: "whole foods groceries 87.50",         description: "whole foods groceries",          amount: 87.50,  category: "groceries",     date: "Today, 5:00 PM",       parseTime: 489 },
  { text: "trader joes run $54",                 description: "trader joe's run",               amount: 54,     category: "groceries",     date: "Yesterday, 4:00 PM",   parseTime: 441 },
  { text: "costco haul $134",                    description: "costco grocery haul",            amount: 134,    category: "groceries",     date: "Yesterday",            parseTime: 448 },
  { text: "farmers market $28",                  description: "farmers market",                 amount: 28,     category: "groceries",     date: "Yesterday, 9:00 AM",   parseTime: 427 },
  { text: "instacart delivery $92 with tip",     description: "instacart delivery",             amount: 92,     category: "groceries",     date: "Yesterday, 6:00 PM",   parseTime: 518 },
  { text: "target grocery run 67",               description: "target grocery run",             amount: 67,     category: "groceries",     date: "Yesterday, 5:30 PM",   parseTime: 461 },
  { text: "fresh produce $23",                   description: "fresh produce",                  amount: 23,     category: "groceries",     date: "Yesterday, 3:00 PM",   parseTime: 434 },
  { text: "weekly safeway shop $110",            description: "safeway groceries",              amount: 110,    category: "groceries",     date: "Yesterday",            parseTime: 502 },
  { text: "kroger run $48",                      description: "kroger",                         amount: 48,     category: "groceries",     date: "Today, 4:00 PM",       parseTime: 389 },
  { text: "aldi haul $62",                       description: "aldi groceries",                 amount: 62,     category: "groceries",     date: "Yesterday, 1:00 PM",   parseTime: 412 },
  { text: "milk eggs bread $18",                 description: "essentials run",                 amount: 18,     category: "groceries",     date: "Today, 7:00 PM",       parseTime: 334 },
  { text: "h-e-b weekly $95",                    description: "h-e-b groceries",                amount: 95,     category: "groceries",     date: "Yesterday",            parseTime: 456 },
  { text: "publix run $73",                      description: "publix groceries",               amount: 73,     category: "groceries",     date: "Today, 6:00 PM",       parseTime: 423 },
  { text: "wine and cheese $44",                 description: "wine and cheese",                amount: 44,     category: "groceries",     date: "Yesterday, 5:00 PM",   parseTime: 398 },

  // Transport
  { text: "uber to airport ~45",                 description: "uber to airport",                amount: 45,     category: "transport",     date: "Today, 7:30 AM",       parseTime: 543 },
  { text: "lyft home from bar $18",              description: "lyft home",                      amount: 18,     category: "transport",     date: "Yesterday, 11:45 PM",  parseTime: 502 },
  { text: "parking garage downtown $22",         description: "downtown parking",               amount: 22,     category: "transport",     date: "Today, 1:30 PM",       parseTime: 487 },
  { text: "gas station shell $52",               description: "shell gas station",              amount: 52,     category: "transport",     date: "Today, 3:00 PM",       parseTime: 521 },
  { text: "mbta monthly pass $90",               description: "MBTA monthly pass",             amount: 90,     category: "transport",     date: "Today",                parseTime: 447 },
  { text: "zipcar 3 hours $48",                  description: "zipcar rental",                  amount: 48,     category: "transport",     date: "Today, 9:00 AM",       parseTime: 516 },
  { text: "tesla supercharge $15",               description: "tesla supercharge",              amount: 15,     category: "transport",     date: "Today, 4:00 PM",       parseTime: 402 },
  { text: "cab from hotel $34",                  description: "cab from hotel",                 amount: 34,     category: "transport",     date: "Today, 11:00 AM",      parseTime: 468 },
  { text: "car wash $25",                        description: "car wash",                       amount: 25,     category: "transport",     date: "Yesterday, 2:30 PM",   parseTime: 413 },
  { text: "toll road $8",                        description: "toll",                           amount: 8,      category: "transport",     date: "Today, 8:30 AM",       parseTime: 289 },
  { text: "metro card reload $33",               description: "metro card",                     amount: 33,     category: "transport",     date: "Today",                parseTime: 361 },
  { text: "bike share $12",                      description: "bike share",                     amount: 12,     category: "transport",     date: "Today, 9:00 AM",       parseTime: 312 },
  { text: "oil change $75",                      description: "oil change",                     amount: 75,     category: "transport",     date: "Yesterday, 10:00 AM",  parseTime: 489 },
  { text: "uber eats delivery fee $6",           description: "uber eats fee",                  amount: 6,      category: "transport",     date: "Yesterday, 7:00 PM",   parseTime: 301 },
  { text: "airport parking 3 days $72",          description: "airport parking",                amount: 72,     category: "transport",     date: "Today",                parseTime: 534 },

  // Bills
  { text: "netflix subscription $15.99",         description: "netflix subscription",           amount: 15.99,  category: "bills",         date: "Today, 12:00 AM",      parseTime: 398 },
  { text: "electric bill $98",                   description: "electric bill",                  amount: 98,     category: "bills",         date: "Today",                parseTime: 413 },
  { text: "internet comcast $65",                description: "comcast internet",               amount: 65,     category: "bills",         date: "Today",                parseTime: 406 },
  { text: "spotify $9.99",                       description: "spotify",                        amount: 9.99,   category: "bills",         date: "Today",                parseTime: 312 },
  { text: "phone bill $85",                      description: "phone bill",                     amount: 85,     category: "bills",         date: "Today",                parseTime: 378 },
  { text: "rent $2200",                          description: "monthly rent",                   amount: 2200,   category: "bills",         date: "Today",                parseTime: 445 },
  { text: "hulu $17.99",                         description: "hulu",                           amount: 17.99,  category: "bills",         date: "Today",                parseTime: 298 },
  { text: "water bill $45",                      description: "water bill",                     amount: 45,     category: "bills",         date: "Today",                parseTime: 356 },
  { text: "gas bill $38",                        description: "gas bill",                       amount: 38,     category: "bills",         date: "Today",                parseTime: 334 },
  { text: "amazon prime $14.99",                 description: "amazon prime",                   amount: 14.99,  category: "bills",         date: "Today",                parseTime: 312 },
  { text: "apple one $19.95",                    description: "apple one subscription",         amount: 19.95,  category: "bills",         date: "Today",                parseTime: 323 },
  { text: "youtube premium $13.99",              description: "youtube premium",                amount: 13.99,  category: "bills",         date: "Today",                parseTime: 301 },
  { text: "car insurance $178",                  description: "car insurance",                  amount: 178,    category: "bills",         date: "Today",                parseTime: 467 },
  { text: "renters insurance $22",               description: "renters insurance",              amount: 22,     category: "bills",         date: "Today",                parseTime: 334 },
  { text: "discord nitro $9.99",                 description: "discord nitro",                  amount: 9.99,   category: "bills",         date: "Today",                parseTime: 289 },

  // Health
  { text: "gym membership $89/month",            description: "gym membership",                 amount: 89,     category: "health",        date: "Today, 6:00 AM",       parseTime: 554 },
  { text: "dentist copay $50",                   description: "dentist copay",                  amount: 50,     category: "health",        date: "Today, 10:00 AM",      parseTime: 392 },
  { text: "pharmacy cvs $23",                    description: "cvs pharmacy",                   amount: 23,     category: "health",        date: "Today, 11:00 AM",      parseTime: 418 },
  { text: "peloton subscription $44",            description: "peloton subscription",           amount: 44,     category: "health",        date: "Today",                parseTime: 389 },
  { text: "therapy session $150",                description: "therapy",                        amount: 150,    category: "health",        date: "Today, 2:00 PM",       parseTime: 478 },
  { text: "doctor copay $30",                    description: "doctor copay",                   amount: 30,     category: "health",        date: "Today, 9:00 AM",       parseTime: 356 },
  { text: "vitamins $34",                        description: "vitamins",                       amount: 34,     category: "health",        date: "Today",                parseTime: 334 },
  { text: "eye exam $95",                        description: "eye exam",                       amount: 95,     category: "health",        date: "Yesterday, 3:00 PM",   parseTime: 412 },
  { text: "prescription $45",                    description: "prescription",                   amount: 45,     category: "health",        date: "Today",                parseTime: 367 },
  { text: "massage $80",                         description: "massage",                        amount: 80,     category: "health",        date: "Yesterday, 1:00 PM",   parseTime: 445 },
  { text: "yoga class $25",                      description: "yoga class",                     amount: 25,     category: "health",        date: "Today, 8:00 AM",       parseTime: 334 },
  { text: "protein powder $55",                  description: "protein powder",                 amount: 55,     category: "health",        date: "Today",                parseTime: 378 },
  { text: "urgent care visit $100",              description: "urgent care",                    amount: 100,    category: "health",        date: "Yesterday",            parseTime: 456 },

  // Shopping
  { text: "amazon headphones $89",               description: "amazon headphones",              amount: 89,     category: "shopping",      date: "Today, 2:00 PM",       parseTime: 467 },
  { text: "zara jacket on sale $65",             description: "zara jacket",                    amount: 65,     category: "shopping",      date: "Yesterday",            parseTime: 558 },
  { text: "nike shoes $120",                     description: "nike shoes",                     amount: 120,    category: "shopping",      date: "Yesterday, 3:00 PM",   parseTime: 499 },
  { text: "apple airpods case $29",              description: "apple airpods case",             amount: 29,     category: "shopping",      date: "Today",                parseTime: 421 },
  { text: "home depot supplies $47",             description: "home depot supplies",            amount: 47,     category: "shopping",      date: "Yesterday, 1:00 PM",   parseTime: 532 },
  { text: "ikea shelf $35",                      description: "ikea shelf",                     amount: 35,     category: "shopping",      date: "Yesterday",            parseTime: 443 },
  { text: "etsy handmade gift $42",              description: "etsy handmade gift",             amount: 42,     category: "shopping",      date: "Yesterday",            parseTime: 487 },
  { text: "h&m sweater $38",                     description: "h&m sweater",                    amount: 38,     category: "shopping",      date: "Yesterday, 2:00 PM",   parseTime: 423 },
  { text: "uniqlo pants $49",                    description: "uniqlo pants",                   amount: 49,     category: "shopping",      date: "Today",                parseTime: 401 },
  { text: "new desk lamp $32",                   description: "desk lamp",                      amount: 32,     category: "shopping",      date: "Yesterday",            parseTime: 378 },
  { text: "lululemon shorts $68",                description: "lululemon shorts",               amount: 68,     category: "shopping",      date: "Today",                parseTime: 445 },
  { text: "candle $24",                          description: "candle",                         amount: 24,     category: "shopping",      date: "Yesterday, 3:30 PM",   parseTime: 312 },
  { text: "usb-c hub $45",                       description: "usb-c hub",                      amount: 45,     category: "shopping",      date: "Today",                parseTime: 389 },
  { text: "book $18",                            description: "book",                           amount: 18,     category: "shopping",      date: "Today",                parseTime: 289 },
  { text: "office chair $320",                   description: "office chair",                   amount: 320,    category: "shopping",      date: "Yesterday",            parseTime: 534 },

  // Entertainment
  { text: "movie tickets AMC $28",               description: "AMC movie tickets",              amount: 28,     category: "entertainment", date: "Yesterday, 7:00 PM",   parseTime: 519 },
  { text: "concert tickets $180",                description: "concert tickets",                amount: 180,    category: "entertainment", date: "Today",                parseTime: 534 },
  { text: "steam game $24",                      description: "steam game",                     amount: 24,     category: "entertainment", date: "Today",                parseTime: 463 },
  { text: "bowling night $35",                   description: "bowling night",                  amount: 35,     category: "entertainment", date: "Yesterday, 8:00 PM",   parseTime: 479 },
  { text: "museum tickets $18",                  description: "museum tickets",                 amount: 18,     category: "entertainment", date: "Yesterday, 2:00 PM",   parseTime: 456 },
  { text: "comedy club $45",                     description: "comedy club",                    amount: 45,     category: "entertainment", date: "Yesterday, 9:00 PM",   parseTime: 506 },
  { text: "escape room $25 per person",          description: "escape room",                    amount: 25,     category: "entertainment", date: "Yesterday, 7:00 PM",   parseTime: 541 },
  { text: "mini golf $16",                       description: "mini golf",                      amount: 16,     category: "entertainment", date: "Yesterday, 4:00 PM",   parseTime: 389 },
  { text: "axe throwing $30",                    description: "axe throwing",                   amount: 30,     category: "entertainment", date: "Yesterday, 6:00 PM",   parseTime: 423 },
  { text: "ps5 game $69",                        description: "ps5 game",                       amount: 69,     category: "entertainment", date: "Today",                parseTime: 456 },
  { text: "karaoke bar $40",                     description: "karaoke",                        amount: 40,     category: "entertainment", date: "Yesterday, 9:00 PM",   parseTime: 467 },
  { text: "arcade $20",                          description: "arcade",                         amount: 20,     category: "entertainment", date: "Yesterday, 5:00 PM",   parseTime: 334 },
  { text: "art gallery donation $15",            description: "art gallery",                    amount: 15,     category: "entertainment", date: "Yesterday, 3:00 PM",   parseTime: 312 },

  // Travel
  { text: "flight to nyc $280",                  description: "flight to NYC",                  amount: 280,    category: "travel",        date: "Today",                parseTime: 634 },
  { text: "room service hotel $65",              description: "hotel room service",             amount: 65,     category: "travel",        date: "Yesterday, 8:00 AM",   parseTime: 597 },
  { text: "airbnb 3 nights $420",               description: "airbnb",                         amount: 420,    category: "travel",        date: "Today",                parseTime: 678 },
  { text: "checked bag fee $35",                 description: "checked bag",                    amount: 35,     category: "travel",        date: "Today, 6:00 AM",       parseTime: 367 },
  { text: "hotel breakfast $28",                 description: "hotel breakfast",                amount: 28,     category: "travel",        date: "Today, 8:30 AM",       parseTime: 378 },
  { text: "travel insurance $62",                description: "travel insurance",               amount: 62,     category: "travel",        date: "Today",                parseTime: 456 },
  { text: "foreign transaction $8",              description: "foreign transaction fee",        amount: 8,      category: "travel",        date: "Yesterday",            parseTime: 312 },
  { text: "airport lounge $45",                  description: "airport lounge",                 amount: 45,     category: "travel",        date: "Today, 5:00 AM",       parseTime: 423 },
  { text: "train tickets $110",                  description: "train tickets",                  amount: 110,    category: "travel",        date: "Today",                parseTime: 534 },
  { text: "hostel 2 nights $85",                 description: "hostel",                         amount: 85,     category: "travel",        date: "Yesterday",            parseTime: 489 },
  { text: "rental car 4 days $240",              description: "rental car",                     amount: 240,    category: "travel",        date: "Today",                parseTime: 612 },
  { text: "travel adapter $19",                  description: "travel adapter",                 amount: 19,     category: "travel",        date: "Yesterday",            parseTime: 334 },

  // Education
  { text: "udemy course $14.99",                 description: "udemy course",                   amount: 14.99,  category: "education",     date: "Today",                parseTime: 367 },
  { text: "textbook $85",                        description: "textbook",                       amount: 85,     category: "education",     date: "Yesterday",            parseTime: 456 },
  { text: "coursera subscription $49",           description: "coursera",                       amount: 49,     category: "education",     date: "Today",                parseTime: 389 },
  { text: "workshop ticket $120",                description: "workshop",                       amount: 120,    category: "education",     date: "Yesterday",            parseTime: 512 },
  { text: "duolingo plus $6.99",                 description: "duolingo plus",                  amount: 6.99,   category: "education",     date: "Today",                parseTime: 289 },
  { text: "online class $200",                   description: "online class",                   amount: 200,    category: "education",     date: "Today",                parseTime: 534 },
  { text: "notion $16/month",                    description: "notion subscription",            amount: 16,     category: "education",     date: "Today",                parseTime: 334 },
  { text: "kindle unlimited $11.99",             description: "kindle unlimited",               amount: 11.99,  category: "education",     date: "Today",                parseTime: 301 },

  // Other
  { text: "haircut with tip $45",                description: "haircut + tip",                  amount: 45,     category: "other",         date: "Today, 12:00 PM",      parseTime: 511 },
  { text: "laundry $8 in quarters",              description: "laundry",                        amount: 8,      category: "other",         date: "Today, 10:30 AM",      parseTime: 358 },
  { text: "dry cleaning $32",                    description: "dry cleaning",                   amount: 32,     category: "other",         date: "Yesterday",            parseTime: 378 },
  { text: "wedding gift $100",                   description: "wedding gift",                   amount: 100,    category: "other",         date: "Yesterday",            parseTime: 467 },
  { text: "charity donation $50",                description: "charity donation",               amount: 50,     category: "other",         date: "Today",                parseTime: 412 },
  { text: "atm fee $3.50",                       description: "atm fee",                        amount: 3.50,   category: "other",         date: "Today",                parseTime: 267 },
  { text: "birthday present $60",                description: "birthday present",               amount: 60,     category: "other",         date: "Yesterday",            parseTime: 423 },
  { text: "pet food $38",                        description: "pet food",                       amount: 38,     category: "other",         date: "Today",                parseTime: 356 },
  { text: "vet visit $120",                      description: "vet visit",                      amount: 120,    category: "other",         date: "Yesterday, 2:00 PM",   parseTime: 512 },
  { text: "nail salon $55",                      description: "nail salon",                     amount: 55,     category: "other",         date: "Yesterday, 1:00 PM",   parseTime: 445 },
  { text: "housewarming gift $45",               description: "housewarming gift",              amount: 45,     category: "other",         date: "Yesterday",            parseTime: 412 },
  { text: "plant $22",                           description: "plant",                          amount: 22,     category: "other",         date: "Today",                parseTime: 312 },
  { text: "parking ticket $65",                  description: "parking ticket",                 amount: 65,     category: "other",         date: "Yesterday",            parseTime: 467 },
  { text: "post office shipping $14",            description: "shipping",                       amount: 14,     category: "other",         date: "Today, 11:30 AM",      parseTime: 334 },
  { text: "tip for movers $80",                  description: "movers tip",                     amount: 80,     category: "other",         date: "Yesterday",            parseTime: 489 },
];

export const CATEGORY_ICONS: Record<Category, string> = {
  food:          "🍔",
  transport:     "🚗",
  entertainment: "🎬",
  shopping:      "🛍️",
  bills:         "📄",
  health:        "🏥",
  groceries:     "🛒",
  travel:        "✈️",
  education:     "📚",
  other:         "📦",
};
