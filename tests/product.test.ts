import * as request from 'supertest';
import { setupTestDB, disconnectTestDB } from './util/util';
import app from "../lib/app";
import { IProduct } from '../lib/mongoose/model/product-model'


describe('Product Tests', function () {

    beforeAll(async () => {
        await setupTestDB('products');
    })

    describe('Product db setup', () => {
        it('should return 201 status ', async () => {
            const response = await request(app).post('/product');
            expect(response.statusCode).toEqual(201);
            expect(response.body.code).toEqual(1);
            expect(response.body.message).toEqual('Success');
        });

        let image: string;

        it('should return with all 10 products', async () => {
            const response = await request(app).get('/all-products');
            expect(response.statusCode).toEqual(200);
            expect(response.body.code).toEqual(1);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(10);

            const first = products[0];
            expect(first.productId).toEqual(1);
            image = new URL(first.picture).searchParams.get('image');
            const second = products[1];
            expect(second.productId).toEqual(4);
            const eighth = products[7];
            expect(eighth.productId).toEqual(10);
            const last = products[9];
            expect(last.productId).toEqual(3);
        });

        it('should return an image', async () => {
            const response = await request(app).get('/image?image=' + image);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeTruthy();
        });

        it('should return image not found', async () => {
            const response = await request(app).get('/image?image=' + image);
            expect(response.statusCode).toEqual(200);
        });

    })

    describe('Product search with sorting', () => {
        it('should return all 10 products in ascending order', async () => {
            const response = await request(app).get('/all-products?sortBy=Price&sortByOrder=asc');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(10);

            const first = products[0];
            expect(first.price).toEqual(10);
            const second = products[1];
            expect(second.price).toEqual(20);
            const eighth = products[7];
            expect(eighth.price).toEqual(80);
            const last = products[9];
            expect(last.price).toEqual(100);
        });

        it('should return all 10 products in descending order', async () => {
            const response = await request(app).get('/all-products?sortBy=Price&sortByOrder=desc');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(10);

            const first = products[0];
            expect(first.price).toEqual(100);
            const second = products[1];
            expect(second.price).toEqual(90);
            const eighth = products[7];
            expect(eighth.price).toEqual(30);
            const last = products[9];
            expect(last.price).toEqual(10);
        });
    })

    describe('Product search with sorting - Negative tests', () => {
        it('should return all 10 products in ascending order when mismatch casing 1', async () => {
            const response = await request(app).get('/all-products?sortBy=price&sortByOrder=ASC');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(10);

            const first = products[0];
            expect(first.price).toEqual(10);
            const second = products[1];
            expect(second.price).toEqual(20);
            const eighth = products[7];
            expect(eighth.price).toEqual(80);
            const last = products[9];
            expect(last.price).toEqual(100);
        });

        it('should return all 10 products in descending order when mismatch casing 2', async () => {
            const response = await request(app).get('/all-products?sortBy=price&sortByOrder=DESC');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(10);

            const first = products[0];
            expect(first.price).toEqual(100);
            const second = products[1];
            expect(second.price).toEqual(90);
            const eighth = products[7];
            expect(eighth.price).toEqual(30);
            const last = products[9];
            expect(last.price).toEqual(10);
        });

        it('should return all 10 products in default ascending order', async () => {
            const response = await request(app).get('/all-products?sortBy=price');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(10);

            const first = products[0];
            expect(first.price).toEqual(10);
            const second = products[1];
            expect(second.price).toEqual(20);
            const eighth = products[7];
            expect(eighth.price).toEqual(80);
            const last = products[9];
            expect(last.price).toEqual(100);
        });
    })

    describe('Product search using text', () => {
        it('should return Papaya when title searched using papaya', async () => {
            const response = await request(app).get('/all-products?title=papaya');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(1);

            const first = products[0];
            expect(first.title.toLowerCase().includes('papaya')).toEqual(true);
        });

        it('should return 4 products containing constter p in title', async () => {
            const response = await request(app).get('/all-products?title=p');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(4);

            const first = products[0];
            expect(first.title).toEqual('Apple');
            const second = products[1];
            expect(second.title).toEqual('Papaya');
            const third = products[2];
            expect(third.title).toEqual('Plum');
            const last = products[3];
            expect(last.title).toEqual('Pomegranate');
        });

        it('should return 3 products containing description as edible frui', async () => {
            const response = await request(app).get('/all-products?description="edible frui"');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(3);

            const first = products[0];
            expect(first.description.includes('edible frui')).toEqual(true);
            const second = products[1];
            expect(second.description.includes('edible frui')).toEqual(true);
            const third = products[2];
            expect(third.description.includes('edible frui')).toEqual(true);
        });
    })

    describe('Product search using text - Negative tests', () => {
        it('should return no product when title text is not found in the db', async () => {
            const response = await request(app).get('/all-products?title=papayatest');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(0);
        });

        it('should return no product when description text is not found in the db', async () => {
            const response = await request(app).get('/all-products?description=edibconstest');
            expect(response.statusCode).toEqual(200);
            const products = <Array<IProduct>>response.body.data ?? [];
            expect(products).toHaveLength(0);
        });
    })

    describe('Image - Negative tests', () => {
        it('should return 400 when image param is missing', async () => {
            const response = await request(app).get('/image?image=');
            expect(response.statusCode).toEqual(400);
        });

        it('should return 404 when image id not found', async () => {
            const response = await request(app).get('/image?image=abc');
            expect(response.statusCode).toEqual(404);
        });
    })

    afterAll(async () => {
        await disconnectTestDB();
    })
});