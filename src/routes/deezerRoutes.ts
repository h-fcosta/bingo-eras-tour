import express from "express";
import AlbumController from "../controllers/AlbumController";
import SongController from "../controllers/SongController";
import SingleController from "../controllers/SingleController";

const router = express.Router();

router
  .get("/deezer/albums/:artistId", AlbumController.fetchAndStoreAlbumDeezer)
  .get(
    "/deezer/songs/:albumId",
    SongController.fetchAndStoreAlbumTracksInfoDeezer
  )
  .get(
    "/deezer/singles/:artistId",
    SingleController.fetchAndStoreSingleDeezerInfo
  );

export default router;
