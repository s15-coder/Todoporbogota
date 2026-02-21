import app from "../backend/todoporbogota/src/app";
import { connectDB } from "../backend/todoporbogota/src/config/db";

// Initialize database connection
connectDB().catch((error) => {
    console.error("Failed to connect to database:", error);
});

// Export the Express app as a Vercel serverless handler
export default app;
