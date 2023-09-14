import express from "express";
import SongAndSinglesController from "../controllers/SongsAndSinglesController";

const router = express.Router();

router
  .get("/songs", SongAndSinglesController.getSongsAndSingles)
  .get("/albums", SongAndSinglesController.getAlbums);

export default router;
