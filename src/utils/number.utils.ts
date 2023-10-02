import { UnprocessableEntityException } from '@/errors';

export function validateIdOrThrow(id: string | number) {
  const idN = Number(id);
  if (isNaN(idN) || idN < 0) {
    throw new UnprocessableEntityException('ID is invalid');
  }
  return idN;
}
