import { Collection, Db, Filter, MongoClient, WithId, Document, OptionalUnlessRequiredId } from "mongodb";
import { CLIENT_DB } from "./env.ts";

class MongoDBClient {
  private client: MongoClient;
  private db: Db | null = null;

  constructor(uri: string) {
    if (!uri) {
      throw new Error('MongoDB URI is not defined');
    }
    this.client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000
    });
  }

  /**
   * Connects to the MongoDB database.
   */
  async connect(): Promise<void> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(CLIENT_DB);
      console.log("Connected to MongoDB");
    }
  }

  /**
   * Disconnects from the MongoDB database.
   */
  async disconnect(): Promise<void> {
    if (this.db) {
      await this.client.close();
      this.db = null;
      console.log("Disconnected from MongoDB");
    }
  }

  /**
   * Writes a document to a specified collection in the database.
   * @param collectionName The name of the collection to write to.
   * @param data The document to be inserted.
   * @returns A tuple containing the inserted document's ID and a boolean indicating success.
   */
  getCollection<T extends Document>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Not connected to database');
    }
    return this.db.collection<T>(name);
  }

  async writeToDatabase<T extends Document>(
    collectionName: string,
    data: OptionalUnlessRequiredId<T>
  ): Promise<[string, boolean]> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.insertOne(data);
    const inserted = !!result.insertedId;
    console.log(inserted ? `Inserted document with _id: ${result.insertedId}` : "No document was inserted");
    return [result.insertedId.toString(), inserted];
  }

  /**
   * Modifies a document in a specified collection in the database.
   * @param filter The filter to identify the document to modify.
   * @param update The update to apply to the document.
   * @param collectionName The name of the collection containing the document.
   * @returns The number of documents modified.
   */
  async modifyInDatabase<T extends Document>(
    filter: Filter<T>,
    update: Partial<T>,
    collectionName: string
  ): Promise<number> {
    const collection = this.getCollection<T>(collectionName);
    const result = await collection.updateOne(filter, { $set: update });
    console.log(`Modified ${result.modifiedCount} document(s)`);
    return result.modifiedCount;
  }

  /**
   * Deletes one or many documents from a specified collection in the database.
   * @param filter The filter to identify the document(s) to delete.
   * @param collectionName The name of the collection containing the document(s).
   * @param deleteMany If true, deletes all matching documents; if false, deletes only the first matching document.
   * @returns The number of documents deleted.
   */
  async deleteFromDatabase<T extends Document>(
    filter: Filter<T>,
    collectionName: string,
    deleteMany: boolean = false
  ): Promise<number> {
    const collection = this.getCollection<T>(collectionName);
    const result = deleteMany
      ? await collection.deleteMany(filter)
      : await collection.deleteOne(filter);
    console.log(`Deleted ${result.deletedCount} document(s)`);
    return result.deletedCount;
  }

  /**
   * Retrieves documents from a specified collection in the database.
   * @param collectionName The name of the collection to query.
   * @param filter The filter to apply to the query.
   * @returns An array of documents matching the filter.
   */
  async getItemsFromDatabase<T extends Document>(
    collectionName: string,
    filter: Filter<T> = {}
  ): Promise<WithId<T>[]> {
    try {
      const collection = this.getCollection<T>(collectionName);
      const items = await collection.find(filter as Filter<T>).toArray();
      console.log(`Found ${items.length} document(s)`);
      return items;
    } catch (error: unknown) {
      console.error("Error getting items from MongoDB:", error as string);
      throw new Error(error as string);
    }
  }
}

// Create a singleton instance of the MongoDB client
const mongoDBClient = new MongoDBClient(process.env.MONGODB_URI!);

/**
 * Connects to the MongoDB database.
 * @param log If true, logs the connection status.
 * @returns A boolean indicating whether the connection was successful.
 */
async function connectToDatabase(log?: boolean): Promise<boolean> {
  try {
    await mongoDBClient.connect();
    if (log) {
      console.log("Connected to MongoDB");
    }
    return true;
  } catch (error: unknown) {
    console.error("Error connecting to MongoDB:", error as string);
    throw new Error(error as string);
  }
}

/**
 * Disconnects from the MongoDB database.
 * @param log If true, logs the disconnection status.
 * @returns A boolean indicating whether the disconnection was successful.
 */
async function disconnectFromDatabase(log?: boolean): Promise<boolean> {
  try {
    await mongoDBClient.disconnect();
    if (log) {
      console.log("Disconnected from MongoDB");
    }
    return true;
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    return false;
  }
}

/**
 * Writes a document to a specified collection in the database.
 * @param collectionName The name of the collection to write to.
 * @param data The document to be inserted, excluding the _id field.
 * @param log If true, logs the operation status.
 * @returns A tuple containing the inserted document's ID and a boolean indicating success.
 * @throws Error if the operation fails.
 * @example writeToDatabase("users", { name: "John Doe" }, true);
 */
async function writeToDatabase<T extends Document>(
  collectionName: string,
  data: OptionalUnlessRequiredId<T>,
  log?: boolean
): Promise<[string, boolean]> {
  try {
    const connected: boolean = await connectToDatabase(log);
    if (!connected) {
      throw new Error("Failed to connect to database");
    }

    if (data._id) {
      delete data._id;
    }

    const result = await mongoDBClient.writeToDatabase(collectionName, data);
    const disconnected: boolean = await disconnectFromDatabase(log);
    if (!disconnected) {
      throw new Error("Failed to disconnect from database");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error writing to MongoDB:", error as string);
    throw new Error(error as string);
  }
}

/**
 * Modifies a document in a specified collection in the database.
 * @param filter The filter to identify the document to modify, should be an object with the fields to match along with their values.
 * @param update The update to apply to the document, should be an object with the fields to update along with their new values.
 * @param collectionName The name of the collection containing the document.
 * @param log If true, logs the operation status.
 * @returns The number of documents modified.
 * @throws Error if the operation fails.
 * @example modifyInDatabase({ _id: "123" }, { name: "John Doe" }, "users", true);
 */
async function modifyInDatabase<T extends Document>(
  filter: Filter<T>,
  update: Partial<T>,
  collectionName: string,
  log?: boolean
): Promise<number> {
  try {
    const connected: boolean = await connectToDatabase(log);
    if (!connected) {
      throw new Error("Failed to connect to database");
    }
    const result = await mongoDBClient.modifyInDatabase(filter, update, collectionName);
    const disconnected: boolean = await disconnectFromDatabase(log);
    if (!disconnected) {
      throw new Error("Failed to disconnect from database");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error modifying document:", error as string);
    throw new Error(error as string);
  }
}

/**
 * Deletes one or many documents from a specified collection in the database.
 * @param filter The filter to identify the document(s) to delete.
 * @param collectionName The name of the collection containing the document(s).
 * @param type Specifies whether to delete one or many documents (1 or "one" for single, 2 or "many" for multiple).
 * @param log If true, logs the operation status.
 * @returns The number of documents deleted.
 * @throws Error if the operation fails.
 * @example deleteFromDatabase({ _id: "123" }, "users", 1, true);
 */
async function deleteFromDatabase<T extends Document>(
  filter: Filter<T>,
  collectionName: string,
  type: 1 | 2 | "one" | "many",
  log?: boolean
): Promise<number> {
  try {
    const connected: boolean = await connectToDatabase(log);
    if (!connected) {
      throw new Error("Failed to connect to database");
    }
    const deleteMany = type === 2 || type === "many";
    const result = await mongoDBClient.deleteFromDatabase(filter, collectionName, deleteMany);
    const disconnected: boolean = await disconnectFromDatabase(log);
    if (!disconnected) {
      throw new Error("Failed to disconnect from database");
    }
    return result;
  } catch (error: unknown) {
    console.error("Error deleting from MongoDB:", error as string);
    throw new Error(error as string);
  }
}

/**
 * Retrieves documents from a specified collection in the database.
 * @param collectionName The name of the collection to query.
 * @param filter The filter to apply to the query.
 * @returns A JSON string representation of the matching documents.
 * @throws Error if the operation fails.
 * @example getItemsFromDatabase("users", { name: "John Doe" });
 */
async function getItemsFromDatabase<T extends Document>(
  collectionName: string,
  filter: Filter<T> = {}
): Promise<string> {
  try {
    const connected: boolean = await connectToDatabase();

    if (!connected) {
      throw new Error("Failed to connect to database");
    }

    const items = await mongoDBClient.getItemsFromDatabase(collectionName, filter);

    if (!items) {
      throw new Error("Failed to retrieve items from database");
    }

    return JSON.stringify(items);
  } catch (error) {
    console.error("Error getting items from database:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error(error as string);
  }
}

async function startServer() {
  try {
    await mongoDBClient.connect();
    // Start your Express server here
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  await mongoDBClient.disconnect();
  process.exit(0);
});

const mongoDBFuncs = {
  writeToDatabase,
  modifyInDatabase,
  getItemsFromDatabase,
  deleteFromDatabase,
};

export default mongoDBFuncs;
export { writeToDatabase, modifyInDatabase, getItemsFromDatabase, deleteFromDatabase };