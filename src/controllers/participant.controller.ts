import { Request, Response } from 'express';
import { CreateParticipantDTO } from '@/dtos';
import { participantService } from '@/services';
import httpStatus from 'http-status-codes';

async function create(req: Request, res: Response) {
  const participant = req.body as CreateParticipantDTO;
  res
    .status(httpStatus.CREATED)
    .send(await participantService.create(participant));
}

async function findAll(_req: Request, res: Response) {
  res.send(await participantService.findAll());
}

export const participantController = { create, findAll };
