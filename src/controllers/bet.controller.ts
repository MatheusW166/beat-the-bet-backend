import { Request, Response } from 'express';
import { CreateBetDTO } from '@/dtos';
import { betService } from '@/services';
import httpStatus from 'http-status-codes';

async function create(req: Request, res: Response) {
  const bet = req.body as CreateBetDTO;
  res.status(httpStatus.CREATED).send(await betService.create(bet));
}

export const betController = { create };
