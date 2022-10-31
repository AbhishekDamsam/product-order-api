import * as dotenv from 'dotenv';
dotenv.config();
const { DB_HOST, DB_PORT } = process.env;

export const DB_URI_LOCALHOST = `mongodb://${DB_HOST}:${DB_PORT}/?directConnection=true&serverSelectionTimeoutMS=5000&appName=mongosh+1.3.1`;
//export const DB_URI_DOCKER = 'mongodb://mongo:27017/?directConnection=true&serverSelectionTimeoutMS=5000&appName=mongosh+1.3.1';
export const DB_NAME = 'TransactionDB';
export const ENVIRONMENT = process.env.APP_ENV || 'dev';
export const IS_TEST = ENVIRONMENT === 'test';