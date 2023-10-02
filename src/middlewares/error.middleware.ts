import { Request, Response, NextFunction } from 'express';
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

  const defaultException = new HttpException({});
  res.status(defaultException.status).send(defaultException);
}

export const errorMiddleware = { handle };
