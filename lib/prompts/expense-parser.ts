interface ExpenseParserPromptParams {
  currentDate: string;
}

export function getExpenseParserPrompt({
  currentDate,
}: ExpenseParserPromptParams): string {
  return `Parse expense to JSON with validation. Current date: ${currentDate} (YYYY-MM-DD).

VALIDATION RULES:
1. Set isValidExpense=false if input is:
   - A greeting ("hello", "hi", "hey")
   - A question ("how are you?", "what's the weather?")
   - Random text/gibberish
   - Not related to expenses at all

2. Set confidence level:
   - "high": Amount, description clearly stated, minimal inference
   - "medium": Some inference needed (e.g., guessing meal type, category)
   - "low": Missing amount OR description is very vague/unclear

3. Missing fields tracking:
   - Add "amount" to missingFields if no amount found
   - Add "description" to missingFields if what was purchased is unclear
   - Add "category" to missingFields if impossible to categorize (should be rare)

4. Handle null values:
   - Set amount=null if not found in input
   - Set description=null if what was purchased is unclear

EXAMPLES:
- "hello" → isValidExpense=false, reasoning="This is a greeting, not an expense"
- "spent money" → isValidExpense=true, confidence="low", amount=null, description=null, missingFields=["amount","description"]
- "$50" → isValidExpense=true, confidence="low", amount=50, description=null, missingFields=["description"]
- "$15 chipotle" → isValidExpense=true, confidence="high", amount=15, description="chipotle", missingFields=[]

DATE HANDLING (YYYY-MM-DD format only):
- Always return date only (no time)
- DEFAULT: If no date is mentioned, use ${currentDate}
- If relative date is mentioned, resolve to the correct date:
  - "yesterday" -> one day before ${currentDate}
  - "today" -> ${currentDate}
  - "last Friday" -> the most recent Friday before or on ${currentDate}
- Ignore time-of-day phrases ("morning", "lunch", "dinner") since this app tracks date only

Categories: food, transport, entertainment, shopping, bills, health, groceries, travel, education, other.`;
}

export const CONFIDENCE_MESSAGES = {
  high: "I'm confident about this expense",
  medium: "I made some assumptions about this expense",
  low: "I need more information to understand this expense",
} as const;


export function getConfirmationMessage(
  confidence: "high" | "medium" | "low",
  missingFields: string[],
  reasoning: string
): string {
  if (missingFields.length > 0) {
    const fields = missingFields.join(" and ");
    return `I couldn't determine the ${fields}. Please review and fill in the missing information.`;
  }

  if (confidence === "medium") {
    return `I made some guesses about this expense. Please verify the details are correct.`;
  }

  if (confidence === "low") {
    return `I'm not very confident about this expense. Please check the details carefully.`;
  }

  return reasoning;
}
