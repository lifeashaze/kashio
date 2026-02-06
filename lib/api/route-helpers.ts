import { z } from "zod";
import { requireAuth, type AuthSession } from "@/lib/api/auth";
import { badRequest, serverError } from "@/lib/api/responses";

type Success<T> = { ok: true; data: T };
type Failure = { ok: false; response: Response };

type Result<T> = Success<T> | Failure;

function formatZodIssues(issues: z.ZodIssue[]): string[] {
  return issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });
}

export async function parseRequestBody<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<Result<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: badRequest("Invalid JSON body"),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: badRequest("Validation failed", formatZodIssues(parsed.error.issues)),
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

export function parseRouteParam<T>(
  value: unknown,
  schema: z.ZodType<T>
): Result<T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return {
      ok: false,
      response: badRequest("Validation failed", formatZodIssues(parsed.error.issues)),
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

export async function requireRouteAuth(): Promise<Result<AuthSession>> {
  const authResult = await requireAuth();

  if (!authResult.success) {
    return {
      ok: false,
      response: authResult.response,
    };
  }

  return {
    ok: true,
    data: authResult.session,
  };
}

export async function withServerErrorBoundary(
  action: string,
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    return serverError(`Failed to ${action}`, error);
  }
}
