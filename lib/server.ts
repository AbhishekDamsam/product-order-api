import * as mongoose from "mongoose";
import { Logger } from './logger';
import app from "./app";
import { DB_NAME, DB_URI_LOCALHOST } from "./config/config";

const APP_PORT = process.env.NODE_DOCKER_PORT || 3000
const dbURI = `${DB_URI_LOCALHOST}/${DB_NAME}`;

const options = {
    autoIndex: true,
    connectTimeoutMS: 10000, // Initial connection timeout
    socketTimeoutMS: 45000, // Close sockets after 45 seconds if app is inactive
  }
  
Logger.info('Connecting to database: ' + dbURI);

mongoose
    .connect(dbURI, options)
    .then(() => {
        Logger.info('Database connected');
        app.listen(APP_PORT, () => {
            Logger.info('Server is listening on port http://localhost:' + APP_PORT);
        })
    })
    .catch((e) => {
        Logger.info('MongoDb connection error');
        Logger.error(e);
    })

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
    Logger.debug('MongoDb connection open to ' + dbURI)
});
  
// If the connection throws an error
mongoose.connection.on('error', (err) => {
    Logger.error('MongoDb connection error: ' + err)
});
  
// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    Logger.info('MongoDb connection is disconnected')
});

//If the Node process ends, close the Mongoose connection gracefully
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      Logger.info('MongoDb connection disconnected through server termination')
      process.exit(0)
    })
  })
  
process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception: ' + err)
})