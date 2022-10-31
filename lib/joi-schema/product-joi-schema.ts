import * as Joi from 'joi';

export const searchProductSchema = Joi.object().keys({
    sortBy: Joi.string().optional().max(5),
    sortByOrder: Joi.string().optional().max(4),
    title: Joi.string().optional().max(50),
    description: Joi.string().optional().max(50),
})