import mongoose from "mongoose";

// Declare global cached connection for serverless
declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// Initialize global cache
if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
}

const cached = global.mongooseCache;

export const connectDB = async (): Promise<typeof mongoose> => {
    // Return existing connection if available
    if (cached.conn) {
        // Check if connection is still active
        if (mongoose.connection.readyState === 1) {
            return cached.conn;
        }
    }

    // Return existing promise if connection is in progress
    if (cached.promise) {
        cached.conn = await cached.promise;
        return cached.conn;
    }

    // Validate MongoDB URI
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined");
    }

    try {
        // Create new connection promise
        cached.promise = mongoose.connect(MONGO_URI, {
            bufferCommands: false, // Disable buffering for serverless
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);

        return cached.conn;
    } catch (error) {
        // Reset promise on failure
        cached.promise = null;
        console.error("Database connection failed:", error);
        throw error;
    }
};