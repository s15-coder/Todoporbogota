import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (_req, res) => {
    res.json({
        ok: true,
        message: "API Todoporbogota funcionando",
        endpoints: {
            api: "/api/users",
        },
    });
});

export default app;