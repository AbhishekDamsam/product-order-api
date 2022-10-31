import { IOrder, Order } from '../mongoose/model/order-model';
import * as  express from 'express';
import * as httpStatus from 'http-status';
import { validate } from '../middleware-fn';
import { postOrderSchema } from '../joi-schema/order-joi-schema';
import { checkObject_Id } from '../mongoose/util';
import { HttpException } from '../exception-handling';

const router = express.Router();

router.post('/order', validate(postOrderSchema, 'body'), async (req, res, next) => {
    try {
        const order = <IOrder>req.body;
        //Below validation can be skipped if Frontend handles it
        if (!verifyTotalPrice(order)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                code: 0,
                message: 'Failure: Total price is incorrect',
            });
        }

        const collection = new Order<IOrder>(order);
        const result = await collection.save();

        return res.status(httpStatus.CREATED).json({
            code: 1,
            message: 'Success',
            data: { id: result._id }
        });
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error: Creating an order'));
    }
});

router.get('/order', async (req, res, next) => {
    try {
        const orders = await Order.find({});
        return res.status(httpStatus.OK).json({
            code: 1,
            message: 'Success',
            data: orders
        });
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error: Fetching all orders'));
    }
});

router.get('/order/:id', async (req, res, next) => {
    try {
        const { id } = (req.params);
        if (!checkObject_Id(id)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                code: 0,
                message: 'Failure: Id is incorrect'
            });
        }

        const order = await Order.findById(id);
        if (!order) return res.status(httpStatus.NOT_FOUND).json({
            code: 0,
            message: 'Failure: Order not found',
        });

        return res.status(httpStatus.OK).json({
            code: 1,
            message: 'Success',
            data: order
        });
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error: Fetching specific order'));
    }
});

router.delete('/order', async (req, res, next) => {
    try {
        await Order.deleteMany({});
        return res.status(httpStatus.OK).json({
            code: 1,
            message: 'Success',
        });
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error: Deleting all orders'));
    }
});

export default router;

function verifyTotalPrice(order: IOrder): boolean {
    let totalPrice = 0;
    for (const product of order.products) {
        totalPrice += product.price * product.quantity;
    }
    return totalPrice == order.totalPrice;
}
