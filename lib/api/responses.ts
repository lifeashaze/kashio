
export type ErrorResponse = {
  error: string;
  details?: string[];
};  

export function success<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

export function created<T>(data: T): Response {
  return Response.json(data, { status: 201 });
}

export function noContent(): Response {
  return new Response(null, { status: 204 });
}

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

export function unauthorized(message = "Unauthorized"): Response {
  return Response.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden"): Response {
  return Response.json({ error: message }, { status: 403 });
}

export function notFound(message = "Resource not found"): Response {
  return Response.json({ error: message }, { status: 404 });
}

export function serverError(
  message = "Internal server error",
  error?: unknown
): Response {
  if (error) {
    console.error("Server error:", error);
  }

  return Response.json({ error: message }, { status: 500 });
}

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
