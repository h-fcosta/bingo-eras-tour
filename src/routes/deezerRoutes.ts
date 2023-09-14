import express from "express";
import DeezerController from "../controllers/DeezerController";

const router = express.Router();

router
  .get(
    "/deezer/albums/:artistId",
    DeezerController.fetchAndStoreAlbumInfoFromDeezer
  )
  .get(
    "/deezer/songs/:albumId",
    DeezerController.fetchAndStoreAlbumTracksInfoDeezer
  )
  .get(
    "/deezer/singles/:artistId",
    DeezerController.fetchAndStoreSingleDeezerInfo
  );

export default router;
