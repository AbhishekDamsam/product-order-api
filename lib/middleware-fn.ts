import { HttpException } from './exception-handling';
import { NextFunction, Request, Response } from 'express';
import { Logger } from './logger';
import * as httpStatus from 'http-status';
import * as Joi from 'joi';

//Middleware functions of Express

//Log before sending the response
export const responseLogger = function (req: Request, res: Response, next: NextFunction) {
    res.on("finish", function () {
        Logger.info(`[${new Date().toISOString()}] ${req.method}:${req.url} ${res.statusCode}`);
    });
    next();
};

//Catch the errors thrown in the application
export const errorLogger = function (err: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = err.httpStatusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';
    Logger.error(`[${new Date().toISOString()}] ${req.method}:${req.url} ${status} ${message}`);
    res.status(status).json({
        code: 0,
        message,
    });
    next();
}

export const validate = function (schema: Joi.ObjectSchema, requestPart: 'body' | 'query') {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[requestPart], { abortEarly: false });
        if (error) {
            res.status(httpStatus.BAD_REQUEST).json({
                code: 0,
                message: error.details.map((item) => {
                    return {
                        message: item.message
                    }
                })
            });
        } else {
            next();
        }
    }
}