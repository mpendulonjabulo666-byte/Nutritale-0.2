import type { ErrorRequestHandler, RequestHandler } from 'express';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly publicMessage: string,
  ) {
    super(publicMessage);
    this.name = 'HttpError';
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'not_found', message: 'Route not found' } });
};

function statusOf(err: unknown): number {
  if (err instanceof HttpError) return err.status;
  if (typeof err === 'object' && err !== null) {
    const candidate = (err as { status?: unknown; statusCode?: unknown }).status ?? (err as { statusCode?: unknown }).statusCode;
    if (typeof candidate === 'number' && candidate >= 400 && candidate < 600) return candidate;
  }
  return 500;
}

/**
 * Final error handler. Never sends stack traces, error messages from libraries or internal details.
 * Only HttpError messages (written by us) and generic 4xx text reach the client.
 */
export function createErrorHandler(log: (err: unknown) => void = (err) => console.error(err)): ErrorRequestHandler {
  return (err, _req, res, _next) => {
    const status = statusOf(err);
    if (status >= 500) log(err);
    let message: string;
    if (err instanceof HttpError) message = err.publicMessage;
    else if (status === 413) message = 'Request body too large';
    else if (status === 400) message = 'Bad request';
    else if (status >= 500) message = 'Internal server error';
    else message = 'Request failed';
    if (res.headersSent) return;
    res.status(status).json({ error: { code: status >= 500 ? 'internal_error' : 'request_error', message } });
  };
}
