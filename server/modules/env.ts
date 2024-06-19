import dotenv from "dotenv";

dotenv.config({ path: './credentials.env.local' });

/**
 * The URI for the MongoDB database.
 */
const URI: string = process.env.MONGODB_URI! || 'null';

/**
 * The name of the client database.
 */
const CLIENT_DB: string = process.env.CLIENT_DB! || 'null';

/**
 * The ID of the client.
 */
const CLIENT_ID: string = process.env.CLIENT_ID! || 'null';

/**
 * The hostname of the application.
 */
const APP_HOSTNAME: string = process.env.APP_HOSTNAME! || "localhost";

/**
 * The port number for the server.
 */
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT!) || 3001;

/**
 * The port number for the client.
 */
const CLIENT_PORT: number = parseInt(process.env.CLIENT_PORT!) || 3000;

/**
 * The client secret.
 */
const CLIENT_SECRET: string = process.env.CLIENT_SECRET || 'null';

export {
    URI,
    CLIENT_DB,
    CLIENT_ID,
    APP_HOSTNAME,
    SERVER_PORT,
    CLIENT_PORT,
    CLIENT_SECRET
}