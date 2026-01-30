/**
 * Standardized API response helpers
 * Provides consistent response formatting across all API routes
 */

/**
 * Standard error response structure
 */
export type ErrorResponse = {
  error: string;
  details?: string[];
};

/**
 * Success response with JSON data
 */
export function success<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

/**
 * Created response (201) for successful resource creation
 */
export function created<T>(data: T): Response {
  return Response.json(data, { status: 201 });
}

/**
 * No content response (204) for successful deletion
 */
export function noContent(): Response {
  return new Response(null, { status: 204 });
}

/**
 * Bad request error (400) - client sent invalid data
 */
export function badRequest(
  message: string,
  details?: string[]
): Response {
  const body: ErrorResponse = { error: message };
  if (details) {
    body.details = details;
  }
  return Response.json(body, { status: 400 });
}

/**
 * Unauthorized error (401) - authentication required
 */
export function unauthorized(message = "Unauthorized"): Response {
  return Response.json({ error: message }, { status: 401 });
}

/**
 * Forbidden error (403) - authenticated but not authorized
 */
export function forbidden(message = "Forbidden"): Response {
  return Response.json({ error: message }, { status: 403 });
}

/**
 * Not found error (404)
 */
export function notFound(message = "Resource not found"): Response {
  return Response.json({ error: message }, { status: 404 });
}

/**
 * Internal server error (500)
 */
export function serverError(
  message = "Internal server error",
  error?: unknown
): Response {
  // Log the actual error for debugging
  if (error) {
    console.error("Server error:", error);
  }

  return Response.json({ error: message }, { status: 500 });
}

/**
 * Method not allowed error (405)
 */
export function methodNotAllowed(allowedMethods: string[]): Response {
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(", "),
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Validation error helper - maps field errors to bad request
 */
export function validationError(
  fieldErrors: Record<string, string>
): Response {
  const details = Object.entries(fieldErrors).map(
    ([field, error]) => `${field}: ${error}`
  );

  return badRequest("Validation failed", details);
}
