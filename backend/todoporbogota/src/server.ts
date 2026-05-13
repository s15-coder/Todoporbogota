import path from "path";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const PORT = process.env.PORT || 5000;

async function start() {
    await connectDB();
    app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});