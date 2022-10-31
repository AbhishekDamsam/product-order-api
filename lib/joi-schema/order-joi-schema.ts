import * as Joi from 'joi';

const postOrderProductSchema = Joi.object().keys({
    productId: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
    quantity: Joi.number().integer().required(),
})

export const postOrderSchema = Joi.object().keys({
    totalPrice: Joi.number().integer().required(),
    products: Joi.array().items(postOrderProductSchema).required()
})