import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { HttpException } from '@/errors';

function handle(
  error: Error | HttpException,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!error) {
    next();
    return;
  }

  if (error instanceof HttpException) {
    res.status(error.status).send(error);
    return;
  }

  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}

export const errorMiddleware = { handle };
