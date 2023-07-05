import { Request } from 'express';

export function getUserId(request: Request): number {
  const userId: number = +request['user']['sub'];
  return userId;
}
