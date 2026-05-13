import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import iniciativaRoutes from "./routes/iniciativaRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/iniciativas", iniciativaRoutes);
app.get("/api", (_req, res) => {
    res.json({ ok: true, message: "API Running..." });
});
app.get("/api/health", (_req, res) => {
    res.json({
        ok: true,
        mongo: mongoose.connection.readyState === 1,
    });
});

// Serve static files from view folder (built frontend)
app.use(express.static(path.join(__dirname, "../view")));

// SPA fallback - serve index.html for all non-API requests
app.use((req, res) => {
    res.status(404).send('Not found');
});

export default app;