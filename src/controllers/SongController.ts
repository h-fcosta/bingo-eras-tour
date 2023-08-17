import { Response, Request } from "express";
import redisClient from "../db/redis";
import { apiDeezer, apiSpotify } from "../api";
import prisma from "../db/dbConnect";
import { cleanTitle } from "../utils/cleanTitle";

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

  static async fetchAndStoreAlbumTracksInfoDeezer(req: Request, res: Response) {
    const albumId = req.params.albumId;
    try {
      const tracks = await SongController.fetchAlbumTracksInfoFromDeezer(
        albumId
      );
      await SongController.storeTracksInfoInDatabase(tracks.data, albumId);

      return res.json(tracks.data);
    } catch (error: any) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchAlbumTracksFromSpotify(albumId: string) {
    try {
      const accessToken = await redisClient.get("accessToken");

      const response = await apiSpotify.get(
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

  static async fetchAlbumTracksInfoFromDeezer(albumId: string) {
    try {
      const response = await apiDeezer.get(`album/${albumId}/tracks?limit=50`);

      return response.data;
    } catch (error: any) {
      console.log("Error:", error);
    }
  }

  static async storeTracksInDatabase(tracks: any[], albumId: string) {
    if (!tracks || tracks.length === 0) {
      console.log("No songs to store");
      return;
    }
    const albumExists = await prisma.albuns_Links.findUnique({
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
      } catch (error: any) {
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

  static async storeTracksInfoInDatabase(tracks: any[], albumId: string) {
    if (!tracks || tracks.length === 0) {
      console.log("No songs to store");
      return;
    }

    const albumExists = await prisma.albuns_Links.findUnique({
      where: { deezer_album_id: albumId }
    });

    if (!albumExists) {
      throw new Error("Album not found!");
    }

    for (const tracksInfo of tracks) {
      try {
        const { id, title, link } = tracksInfo;

        //Erases "(Taylor's Version)" from the song name coming from the API
        const cleanedTitle = cleanTitle(title, /\(Taylor's Version\)/g);

        const verifyTrackDB = await prisma.song.findFirst({
          where: { song_name: cleanedTitle }
        });

        if (verifyTrackDB) {
          const trackInfoDeezer = await prisma.songs_Links.create({
            data: {
              deezer_song_id: id.toString(),
              deezer_link: link,
              songId: verifyTrackDB.id
            }
          });

          console.log("Deezer info stored:", trackInfoDeezer);
        } else {
          console.log("Track not found:", cleanedTitle);
        }
      } catch (error: any) {
        if (
          error.code === "P2002" &&
          error.meta.target.includes("deezer_song_id")
        ) {
          console.log("Duplicate track ignored:", tracksInfo.title);
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
          album: {
            select: {
              release_order: true,
              album_color: true
            }
          }
        },
        orderBy: {
          album: {
            release_order: "asc"
          }
        }
      });

      const singles = await prisma.single.findMany({
        include: {
          album: {
            select: {
              release_order: true,
              album_color: true
            }
          }
        },
        orderBy: {
          album: {
            release_order: "asc"
          }
        }
      });

      const songsAndSingles = [...songs, ...singles].sort(
        (a, b) =>
          Number(a.album?.release_order || 0) -
          Number(b.album?.release_order || 0)
      );

      return res.json(songsAndSingles);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
