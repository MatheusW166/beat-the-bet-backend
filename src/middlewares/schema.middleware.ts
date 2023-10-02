import { NextFunction, Request, Response } from 'express';
import { UnprocessableEntityException } from '@/errors';
import { Schema } from 'joi';

type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

function validateQuery<T>(schema: Schema<T>): MiddlewareFn {
  return validate(schema, 'query');
}

function validateParams<T>(schema: Schema<T>): MiddlewareFn {
  return validate(schema, 'params');
}

function validateBody<T>(schema: Schema<T>): MiddlewareFn {
  return validate(schema, 'body');
}

function validate<T>(
  schema: Schema<T>,
  field: 'body' | 'params' | 'query',
): MiddlewareFn {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[field], { abortEarly: false });

    if (error && error.details.length > 0) {
      const details = error.details.map((detail) => detail.message);
      throw new UnprocessableEntityException(details);
    }

    req[field] = value;
    next();
  };
}

export const schemaMiddleware = {
  validateBody,
  validateParams,
  validateQuery,
};
