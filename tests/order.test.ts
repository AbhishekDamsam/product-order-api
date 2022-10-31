import * as request from 'supertest';
import { setupTestDB, disconnectTestDB } from './util/util';
import app from "../lib/app";
import { IOrder } from '../lib/mongoose/model/order-model'


describe('Order Tests', function () {

    beforeAll(async () => {
        await setupTestDB('orders');
    })

    describe('POST Order', () => {
        const order = {
            totalPrice: 100,
            products: [
                {
                    productId: 1,
                    price: 10,
                    quantity: 10
                }
            ]
        }
        it('should return 201 status', async () => {
            const response = await request(app).post('/order').send(order);
            expect(response.statusCode).toEqual(201);
            expect(response.body.code).toEqual(1);
            expect(response.body.data.id).toBeTruthy();
        });

        it('should return with 1 order', async () => {
            const response = await request(app).get('/order');
            expect(response.statusCode).toEqual(200);
            expect(response.body.code).toEqual(1);
            const orders = <Array<IOrder>>response.body.data ?? [];
            expect(orders).toHaveLength(1);

            const first = orders[0];
            expect(first.totalPrice).toEqual(order.totalPrice);
            expect(first.products[0].productId).toEqual(order.products[0].productId);
            expect(first.products[0].price).toEqual(order.products[0].price);
            expect(first.products[0].quantity).toEqual(order.products[0].quantity);
        });

    })

    describe('POST Order - Negative tests', () => {
        const order = {
            totalPrice: 1000,
            products: [
                {
                    productId: 1,
                    price: 10,
                    quantity: 10
                }
            ]
        }
        const strOrder = {
            totalPrice: 'abc',
            products: [
                {
                    productId: 'abc',
                    price: 'abc',
                    quantity: 'abc'
                }
            ]
        }
        it('should return 400 status on sending incorrect totalPrice', async () => {
            const response = await request(app).post('/order').send(order);
            expect(response.statusCode).toEqual(400);
            expect(response.body.code).toEqual(0);
            expect(response.body.message).toEqual('Failure: Total price is incorrect');
        });
        it('should return 400 status when payload is empty', async () => {
            const response = await request(app).post('/order').send({});
            expect(response.statusCode).toEqual(400);
            expect(response.body.code).toEqual(0);
            expect(response.body.message[0].message).toEqual('"totalPrice" is required')
            expect(response.body.message[1].message).toEqual('"products" is required')
        });
        it('should return 400 status when payload contains all string type', async () => {
            const response = await request(app).post('/order').send(strOrder);
            expect(response.statusCode).toEqual(400);
            expect(response.body.code).toEqual(0);
            expect(response.body.message[0].message).toEqual("\"totalPrice\" must be a number")
            expect(response.body.message[1].message).toEqual('"products[0].productId" must be a number')
            expect(response.body.message[2].message).toEqual('"products[0].price" must be a number')
            expect(response.body.message[3].message).toEqual('"products[0].quantity" must be a number')
        });
    })

    afterAll(async () => {
        await disconnectTestDB();
    })
});