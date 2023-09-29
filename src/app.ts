import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorMiddlewares } from '@/middlewares';

const app = express();

app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK'))
  .use(errorMiddlewares.handle);

export default app;
