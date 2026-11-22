import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import { errorBody } from '../errors.js';

/**
 * Per-IP limiter that answers in the API's JSON error shape (fixes finding S2).
 * The store is in process memory: with more than one API instance each counts separately.
 */
export function limiter(windowMs: number, limit: number): RateLimitRequestHandler {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json(errorBody('rate_limited', 'Too many requests, try again later'));
    },
  });
}
