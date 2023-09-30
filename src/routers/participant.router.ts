import { Router } from 'express';
import { schemaMiddleware } from '@/middlewares';
import { createParticipantSchema } from '@/dtos';
import { participantController } from '@/controllers';

export const participantRouter = Router()
  .post(
    '/',
    schemaMiddleware.validateBody(createParticipantSchema),
    participantController.create,
  )
  .get('/', participantController.findAll);
