import { Response, Request } from "express";
import redisClient from "../db/redis";
import api from "../api";
import prisma from "../db/dbConnect";

export default class SongController {
  static async fetchAndStoreAlbumTracks(req: Request, res: Response) {
    const albumId = req.params.albumId;

    try {
      const tracks = await SongController.fetchAlbumTracksFromSpotify(albumId);
      await SongController.storeTracksInDatabase(tracks.items, albumId);

      return res.json(tracks.items);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchAlbumTracksFromSpotify(albumId: string) {
    try {
      const accessToken = await redisClient.get("accessToken");

      const response = await api.get(
        `/albums/${albumId}/tracks?market=BR&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  static async storeTracksInDatabase(tracks: any[], albumId: string) {
    if (!tracks || tracks.length === 0) {
      console.log("No songs to store");
      return;
    }
    const albumExists = await prisma.album.findUnique({
      where: { spotify_album_id: albumId }
    });

    if (!albumExists) {
      throw new Error("Album not found!");
    }

    for (const trackInfo of tracks) {
      try {
        const track = await prisma.song.create({
          data: {
            spotify_song_id: trackInfo.id,
            song_name: trackInfo.name,
            spotify_link: trackInfo.external_urls.spotify,
            albumId: albumId
          }
        });

        console.log("Track stored:", track);
      } catch (error) {
        if (
          error.code === "P2002" &&
          error.meta.target.includes("spotify_album_id")
        ) {
          console.log("Duplicate album ignored:", trackInfo.name);
        } else {
          console.error("Error:", error);
        }
      }
    }
  }

  static async getSongsAndSingles(req: Request, res: Response) {
    try {
      const songs = await prisma.song.findMany({
        include: {
          album: true
        },
        orderBy: {
          album: {
            release_order: "asc"
          }
        }
      });

      const singles = await prisma.single.findMany({
        include: {
          album: true
        },
        orderBy: {
          album: {
            release_order: "asc"
          }
        }
      });

      const songsAndSingles = [...songs, ...singles].sort(
        (a, b) => (a.album?.release_order || 0) - (b.album?.release_order || 0)
      );

      return res.json(songsAndSingles);
      // const songsAndSingles =
      //   await prisma.$queryRaw`SELECT * FROM song UNION SELECT * FROM single ORDER BY albumId;`;

      // return res.json(songsAndSingles);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
