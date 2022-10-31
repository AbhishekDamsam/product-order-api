import { IProduct, Product } from '../mongoose/model/product-model';
import * as  express from 'express';
import * as httpStatus from 'http-status';
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import { ProductData } from '../../product-data/products';
import { validate } from '../middleware-fn';
import { searchProductSchema } from '../joi-schema/product-joi-schema';
import { HttpException } from '../exception-handling';

const router = express.Router();

router.post('/product', async (req, res, next) => {
    try {
        await Product.deleteMany();
        for (const product of ProductData) {
            product.picture = `${req.protocol}://${req.headers.host}/image?image=${Buffer.from(product.picture, 'utf8').toString('base64')}`;
            const collection = new Product<IProduct>(product);
            await collection.save();
        }
        return res.status(httpStatus.CREATED).json({
            code: 1,
            message: 'Success',
        });
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error: Inserting products'));
    }
});

router.get('/all-products', validate(searchProductSchema, 'query'), async (req, res, next) => {
    try {
        const criteria: Record<string, object> = {};
        const sort: Record<string, number> = {};

        if (req.query.sortBy && (req.query.sortBy).toString().toLowerCase() === 'price') {
            sort.price = req.query.sortByOrder ? (req.query.sortByOrder).toString().toLowerCase() === 'asc' ? 1 : -1 : 0;
        }
        if (req.query.title) {
            criteria['title'] = { $regex: '.*' + <string>req.query.title + '.*', $options: 'i' };
        }
        if (req.query.description) {
            criteria['$text'] = { "$search": <string>req.query.description };
        }

        const products = await Product.find(criteria).sort(sort);
        return res.status(httpStatus.OK).json({
            code: 1,
            message: 'Success',
            data: products
        });
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error: Searching products'));
    }
});

router.get('/image', async (req, res, next) => {
    try {
        const encodedPicture = <string>(req.query.image);
        if (!encodedPicture) {
            return res.status(httpStatus.BAD_REQUEST).json({
                code: 0,
                message: 'Failure',
                data: {
                    message: 'Image name is mandatory'
                }
            });
        }

        const picture = Buffer.from(encodedPicture, 'base64').toString('utf8')
        const ext = path.extname(picture);
        let contentType = 'image/jpeg';

        if (ext === '.png') {
            contentType = 'image/png';
        }

        const imagePath = path.join(__dirname, '..', '..', 'product-data', 'images', picture);
        if (!existsSync(imagePath)) {
            return res.status(httpStatus.NOT_FOUND).json({
                code: 0,
                message: 'Failure',
                data: {
                    message: 'Image not found'
                }
            });
        }
        const file = await fs.readFile(imagePath);
        res.writeHead(httpStatus.OK, { 'Content-type': contentType });
        return res.end(file);
    } catch (e) {
        next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error while fetching image'));
    }
});

export default router;