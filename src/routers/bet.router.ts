import { Router } from 'express';
import { schemaMiddleware } from '@/middlewares';
import { createBetSchema } from '@/dtos';
import { betController } from '@/controllers';

export const betRouter = Router().post(
  '/',
  schemaMiddleware.validateBody(createBetSchema),
  betController.create,
);
