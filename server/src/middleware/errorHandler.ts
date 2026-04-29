import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(
  error: Error & { statusCode?: number; status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const message = error.message || "Internal server error";
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    message,
  });
}
