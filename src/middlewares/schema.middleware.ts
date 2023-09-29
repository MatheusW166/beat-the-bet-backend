import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { Schema } from "joi";

type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => void;

function validateQuery<T>(schema: Schema<T>): MiddlewareFn {
	return validate(schema, "query");
}

function validateParams<T>(schema: Schema<T>): MiddlewareFn {
	return validate(schema, "params");
}

function validateBody<T>(schema: Schema<T>): MiddlewareFn {
	return validate(schema, "body");
}

function validate<T>(schema: Schema<T>, field: "body" | "params" | "query"): MiddlewareFn {
	return (req, res, next) => {

		const { error, value } = schema.validate(req[field], { abortEarly: false });

		if (error && error.details.length > 0) {
			res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error.details.map((detail) => detail.message));
			return;
		}

		req[field] = value;
		next();
	};
}

export const schemaMiddlewares = {
	validateBody,
	validateParams,
	validateQuery
};
