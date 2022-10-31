import * as express from "express";
import health from './health-route';
import product from './product-route';
import order from './order-route';

const router = express.Router();

router.use(health);
router.use(product);
router.use(order);

export default router;