import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export const REQUEST_ID_HEADER = 'X-Request-Id';

/**
 * Gives every response an `X-Request-Id`. Always generated here (a client-sent id is ignored,
 * so nobody can inject text into logs through it).
 */
export const requestId: RequestHandler = (_req, res, next) => {
  const id = randomUUID();
  res.locals.requestId = id;
  res.setHeader(REQUEST_ID_HEADER, id);
  next();
};
