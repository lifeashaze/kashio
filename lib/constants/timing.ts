/**
 * Centralized timing constants for UI feedback and transitions
 * All values in milliseconds
 */

/**
 * Duration to show success state before resetting to idle
 * Used after successful expense save
 */
export const SUCCESS_DISPLAY_DURATION = 12000; // 12 seconds

/**
 * Duration to show generic error messages before clearing
 * Used for API failures and unexpected errors
 */
export const ERROR_DISPLAY_DURATION = 12000; // 12 seconds

/**
 * Duration to show validation error messages
 * Used for invalid input or missing required fields
 * Longer than generic errors to ensure user reads the guidance
 */
export const VALIDATION_ERROR_DURATION = 12000; // 12 seconds

/**
 * Debounce delay for input validation
 * Prevents excessive API calls while user is typing
 */
export const INPUT_DEBOUNCE_DELAY = 300; // 300ms

/**
 * Toast notification duration
 * Used for non-critical notifications
 */
export const TOAST_DURATION = 4000; // 4 seconds
