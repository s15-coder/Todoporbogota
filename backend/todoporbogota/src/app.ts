import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.get("/api", (_req, res) => {
    res.send("API Running...");
});

// Serve static files from view folder (built frontend)
app.use(express.static(path.join(__dirname, "../view")));

// SPA fallback - serve index.html for all non-API requests
app.use((req, res) => {
    res.status(404).send('Not found');
});

export default app;