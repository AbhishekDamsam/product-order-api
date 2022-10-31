import * as express from "express";
import * as mongoSanitize from 'express-mongo-sanitize';
import { errorLogger, responseLogger } from "./middleware-fn";
import router from "./routes";
import { Logger } from './logger';
import { IS_TEST } from "../lib/config/config";

const app = express();

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

//sanitize request data
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      Logger.warning(`This request[${key}] is sanitized`, req);
    },
  }),
);

if (!IS_TEST) {
  app.use(responseLogger);
}

app.use(router);

app.use(errorLogger);

export default app