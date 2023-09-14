import express from "express";
import SpotifyController from "../controllers/SpotifyController";

const router = express.Router();

router
  .get(
    "/spotify/albums/:artistId",
    SpotifyController.fetchAndStoreAlbumFromSpotify
  )
  .get(
    "/spotify/songs/:albumId",
    SpotifyController.fetchAndStoreAlbumTracksFromSpotify
  )
  .get(
    "/spotify/singles/:artistId",
    SpotifyController.fetchAndStoreSingleFromSpotify
  );

export default router;
