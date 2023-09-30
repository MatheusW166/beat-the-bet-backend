import { UnprocessableEntityError } from '@/errors';

export function validateIdOrThrow(id: string | number) {
  const idN = Number(id);
  if (isNaN(idN) || idN < 0) {
    throw new UnprocessableEntityError('ID is invalid');
  }
  return idN;
}
