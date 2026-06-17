import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    indexesSynced: false,
  };
}

async function syncUserIndexes() {
  if (cached.indexesSynced) return;

  try {
    const collection = mongoose.connection.collection("users");
    const indexes = await collection.indexes();

    for (const index of indexes) {
      if (index.key?.clearkId) {
        await collection.dropIndex(index.name);
        console.log(`Dropped stale index: ${index.name}`);
      }
    }

    const User = (await import("@/models/User")).default;
    await User.syncIndexes();
    cached.indexesSynced = true;
  } catch (error) {
    console.warn("User index sync skipped:", error.message);
  }
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    await syncUserIndexes();
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then(async (mongooseInstance) => {
        console.log("MongoDB Connected Successfully");
        await syncUserIndexes();
        return mongooseInstance;
      })
      .catch((error) => {
        console.log("MongoDB Connection Failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
