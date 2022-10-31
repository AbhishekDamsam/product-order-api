
import { HttpException } from "../exception-handling";
import * as express from "express";
import * as httpStatus from 'http-status';

const router = express.Router()

router.get('/health', async (req, res, next) => {
  try {
    return res.status(httpStatus.OK).json({
      code: 1,
      message: 'Success'
    });
  }
  catch (e) {
    next(new HttpException(httpStatus.INTERNAL_SERVER_ERROR, 'Error in Health check'));
  }
});

export default router;