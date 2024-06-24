/* eslint-disable no-unused-vars */
import { Collection, Db, DeleteResult, Filter, MongoClient, UpdateResult } from "mongodb";
import { CLIENT_DB, URI } from "./env.ts";

const client: MongoClient = new MongoClient( URI! );

/**
 * Connects to the MongoDB database
 * 
 * @param {boolean} log Whether to log the database connection status
 * @returns void
 * @throws Error if an error occurs
 */
async function connectToDatabase(log?: boolean): Promise<void> {
  try {
    await client.connect();
    if (log) {
      console.log("Connected to MongoDB");
    }
    return;
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error}`);
    throw new Error(error as string);
  }
}

/**
 * Disconnects from the MongoDB database
 * 
 * @param {boolean} log Whether to log the database connection status
 * @returns void
 * @throws Error if an error occurs
 */
async function disconnectFromDatabase(log?: boolean): Promise<void> {
  try {
    await client.close();
    if (log) {
      console.log("Disconnected from MongoDB");
    }
    return;
  } catch (error: any) {
    console.error(`Error disconnecting from MongoDB: ${error}`);
    throw new Error(error as string);
  }
}

/**
 * Write data to the database collection.
 *
 * @param {object} data Data to be written to the database
 * @param {string} collectionName Name of the collection to write to
 * @param {boolean} log Whether to log the database connection status
 * @returns The ID of the inserted document
 * @returns Inserted boolean (T/F)
 * @throws CustomError if an error occurs
 */
async function writeToDatabase(
  data: any,
  collectionName: string,
  log: boolean
): Promise<any> {
  try {
    await connectToDatabase(log);
    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<any> = database.collection(collectionName);

    const result: any = await collection.insertOne(data);

    let boolInsert: boolean;

    if (result.insertedId) {
      console.log("Inserted document with _id:", result.insertedId);
      boolInsert = true;
    } else {
      console.log("No document was inserted");
      boolInsert = false;
    }

    await disconnectFromDatabase(log);

    return [result.insertedId, boolInsert];
  } catch (error: any) {
    console.error(`Error writing to database: ${error}`);
    throw new Error(error);
  }
}
/**
 * @param filter The filter to use when modifying
 * @param {any} update The update object containing the fields to modify
 * @param {string} collectionName The name of the collection to modify
 * @param {boolean} log (optional) Set to true to log modification messages
 * @returns The number of documents modified
 * @throws Error if an error occurs
 */
async function modifyInDatabase(
  filter: Filter<any>,
  update: any, // Change to a more specific type if possible
  collectionName: string,
  log?: boolean
): Promise<number> {
  try {
    await connectToDatabase(log);

    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<any> = database.collection(collectionName);

    const updateData: object = { $set: update };

    const result: UpdateResult = await collection.updateOne(filter, updateData);

    if (log && result.modifiedCount > 0) {
      console.log("\x1b[32m", "Modified", result.modifiedCount, "document(s)");
    } else if (log && result.modifiedCount === 0) {
      console.log("\x1b[32m", "No documents modified");
    }

    await disconnectFromDatabase(log);

    return result.modifiedCount;
  } catch (error: any) {
    console.error("\x1b[31m", `Error modifying document:, ${error}`);
    throw new Error(error as string);
  }
}

/**
 * @param filter The filter to use when deleting
 * @param {string} collectionName The name of the collection to delete from
 * @param {number} type The type of delete to perform (1 = one, 2 = many)
 * @param {boolean} log (optional) Set to true to log deletion messages
 * @returns The number of documents deleted, or undefined if no documents were deleted
 * @throws Error if an error occurs
 */
async function deleteFromDatabase(
  filter: Filter<any>,
  collectionName: string,
  type: 1 | 2 | "one" | "many" = 1,
  log?: boolean
): Promise<number> {
  try {
    await connectToDatabase(log);

    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<Document> = database.collection(collectionName);

    if (type === 1 || type === "one") {
      const result: DeleteResult = await collection.deleteOne(filter);

      if (log && result.deletedCount === 0) {
        console.log("\x1b[32m", "No documents deleted");
      } else if (log && result.deletedCount > 0) {
        console.log("\x1b[32m", "Deleted", result.deletedCount, "document(s)");
      }

      await disconnectFromDatabase(log);

      return result.deletedCount;
    } else if (type === 2 || type === "many") {
      const result: DeleteResult = await collection.deleteMany(filter);

      if (log && result.deletedCount === 0) {
        console.log("\x1b[32m","No documents deleted");
      } else if (log && result.deletedCount > 0) {
        console.log("\x1b[32m", "Deleted", result.deletedCount, "document(s)");
      }

      await disconnectFromDatabase(log);

      return result.deletedCount;
    }

    await disconnectFromDatabase(log);

    // Add a default return value for any other cases
    return 0;
  } catch (error: any) {
    console.error("\x1b[31m", `Error deleting document(s):, ${error}`);
    throw new Error(error as string);
  }
}

/**
 * 
 * @param {string} collectionName The name of the collection to get items from
 * @param {number} dataId The ID of the data to get from the database
 * @returns Returns the items from the database as a JSON string
 * @throws Error if an error occurs
 */
async function getItemsFromDatabase(
  collectionName: string,
  log?: boolean,
  dataId?: any
): Promise<any> {
  try {
    await connectToDatabase(log);

    const database: Db = client.db(CLIENT_DB);
    const collection: Collection<any> = database.collection(collectionName);
    const projection: object = { _id: 0 };

    let items: object;

    if (dataId) {
      items = await collection.findOne( dataId, { projection: projection });
    } else {
      items = await collection.find({}).toArray();
    }

    await disconnectFromDatabase(log);

    return JSON.stringify(items);
  } catch (error: any) {
    console.error("\x1b[31m", `Error getting items from database:, ${error}`);
    throw new Error(error);
  }
}

const mongoDBFuncs = {
  writeToDatabase,
  modifyInDatabase,
  getItemsFromDatabase,
  deleteFromDatabase
};

export default mongoDBFuncs;
export { writeToDatabase, modifyInDatabase, getItemsFromDatabase, deleteFromDatabase }