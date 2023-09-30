import Joi from 'joi';

export type UpdateParticipantDTO = Partial<CreateParticipantDTO>;

export type CreateParticipantDTO = {
  name: string;
  balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
};

export const createParticipantSchema = Joi.object<CreateParticipantDTO>({
  balance: Joi.number().integer().positive().required(),
  name: Joi.string().trim().required(),
});
