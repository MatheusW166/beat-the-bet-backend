import { Request, Response } from 'express';
import { CreateBetDTO } from '@/dtos';
import { betService } from '@/services';

async function create(req: Request, res: Response) {
  const bet = req.body as CreateBetDTO;
  res.status(201).send(await betService.create(bet));
}

export const betController = { create };
