import { Request } from 'express';

export function getLanguageFromRequest(request: Request): string | null {
  const language = request.query.language as string | undefined;
  return language || null;
}
