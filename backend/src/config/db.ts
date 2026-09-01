import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PetSpot";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Global variable to cache the connection across Vercel serverless warm starts
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000, // Fail fast if connection drops
      bufferCommands: false,
    };

    console.log(`Attempting connection to: ${MONGODB_URI}`);
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error; // Throw instead of process.exit(1) so the individual request fails gracefully without killing the serverless container
  }

  return cached.conn;
};