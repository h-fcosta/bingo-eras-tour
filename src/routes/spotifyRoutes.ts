import express from "express";
import SongController from "../controllers/SongController";

const router = express.Router();

router.get("/songs", SongController.getSongsAndSingles);

export default router;
