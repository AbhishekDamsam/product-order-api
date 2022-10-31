import * as mongoose from "mongoose";
import { DB_NAME, DB_URI_LOCALHOST } from '../../lib/config/config';

const dbURI = `${DB_URI_LOCALHOST}/${DB_NAME}-Test`;

export const setupTestDB = async (collectionName: string) => {
    await mongoose.connect(dbURI, {
        autoIndex: true,
        connectTimeoutMS: 10000, // Initial connection timeout
        socketTimeoutMS: 45000, // Close sockets after 45 seconds if app is inactive
    })
    await mongoose.connection.collections[collectionName].deleteMany({});
}

export const disconnectTestDB = async () => {
    await mongoose.disconnect();
}
