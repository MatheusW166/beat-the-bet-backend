import { responseSchema } from './response.schema';

export const participantSchema = {
  ...responseSchema,
  name: expect.any(String),
  balance: expect.any(Number),
};
