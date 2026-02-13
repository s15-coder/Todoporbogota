import { Router } from "express";
import User from "../models/User";

const router = Router();

router.post("/", async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
});

export default router;