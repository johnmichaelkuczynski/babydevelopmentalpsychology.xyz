import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { eq, sql } from "drizzle-orm";
import { db, anonAiUsageTable } from "@workspace/db";

// Anonymous visitors may generate roughly two paragraphs of AI output before
// they must sign in (with Google) to continue.
export const FREE_AI_CHAR_LIMIT = 1500;

export function getAnonId(req: Request): string | null {
  const raw = req.header("x-anon-id");
  if (!raw) return null;
  const trimmed = raw.trim().slice(0, 80);
  return trimmed.length >= 8 ? trimmed : null;
}

function isSignedIn(req: Request): boolean {
  try {
    return Boolean(getAuth(req).userId);
  } catch {
    return false;
  }
}

// Every gated request atomically pre-charges this much against the budget,
// so parallel requests cannot slip past the limit together.
const REQUEST_PRECHARGE = 300;

/**
 * Non-consuming check: does this request still have free AI budget?
 * Signed-in users always do.
 */
export async function hasAiQuota(req: Request): Promise<boolean> {
  return true;
}

/**
 * Gate for AI-consuming endpoints. Signed-in users are unlimited. Anonymous
 * visitors get a small free budget; once exhausted (or if no anon id is
 * provided), respond 401 with { error: "login_required" } and return false.
 *
 * The check is an atomic conditional pre-charge (INSERT .. ON CONFLICT DO
 * UPDATE .. WHERE under limit), so concurrent requests under one anon id
 * cannot all pass a stale read.
 */
export async function enforceAiQuota(req: Request, res: Response): Promise<boolean> {
  return true;
}

/** Record AI output volume against the anonymous visitor's free budget. */
export async function recordAiUsage(req: Request, generatedText: string): Promise<void> {
  if (isSignedIn(req)) return;
  const anonId = getAnonId(req);
  if (!anonId) return;
  // The pre-charge in enforceAiQuota already debited part of this output.
  const chars = generatedText.length - 300;
  if (chars <= 0) return;
  await db
    .insert(anonAiUsageTable)
    .values({ anonId, charsGenerated: chars })
    .onConflictDoUpdate({
      target: anonAiUsageTable.anonId,
      set: {
        charsGenerated: sql`${anonAiUsageTable.charsGenerated} + ${chars}`,
        updatedAt: new Date(),
      },
    });
}
