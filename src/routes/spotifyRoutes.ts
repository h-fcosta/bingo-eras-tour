import express from "express";
import SpotifyController from "../controllers/SpotifyController";
import AlbumController from "../controllers/AlbumController";
import SongController from "../controllers/SongController";
import SingleController from "../controllers/SingleController";

const router = express.Router();

router.get("/token", SpotifyController.getAccessToken);
router.get("/spotify/albums/:artistId", AlbumController.fetchAndStoreAlbum);
router.get("/spotify/songs/:albumId", SongController.fetchAndStoreAlbumTracks);
router.get("/spotify/singles/:artistId", SingleController.fetchAndStoreSingle);

export default router;
