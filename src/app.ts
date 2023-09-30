import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares';
import { betRouter, gameRouter, participantRouter } from './routers';

const app = express();

app
  .use(cors())
  .use(express.json())
  .use('/participants', participantRouter)
  .use('/games', gameRouter)
  .use('/bets', betRouter)
  .get('/health', (_req, res) => res.send('OK'))
  .use(errorMiddleware.handle);

export default app;
