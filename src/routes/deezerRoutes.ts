import express from "express";
import AlbumController from "../controllers/AlbumController";

const router = express.Router();

router.get(
  "/deezer/albums/:artistId",
  AlbumController.fetchAndStoreAlbumDeezer
);

export default router;
