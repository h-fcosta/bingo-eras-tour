import express from "express";
import AlbumController from "../controllers/AlbumController";
import SongController from "../controllers/SongController";

const router = express.Router();

router
  .get("/deezer/albums/:artistId", AlbumController.fetchAndStoreAlbumDeezer)
  .get(
    "/deezer/songs/:albumId",
    SongController.fetchAndStoreAlbumTracksInfoDeezer
  );

export default router;
