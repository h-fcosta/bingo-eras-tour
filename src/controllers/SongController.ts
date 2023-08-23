import { Response, Request } from "express";
import redisClient from "../db/redis";
import { apiDeezer, apiSpotify } from "../api";
import prisma from "../db/dbConnect";

export default class SongController {
  //Get the album's ID from the URL
  static async fetchAndStoreAlbumTracks(req: Request, res: Response) {
    const albumId = req.params.albumId;

    try {
      const tracks = await SongController.fetchAlbumTracksFromSpotify(albumId);
      await SongController.storeTracksInDatabase(tracks.items, albumId);

      return res.json(tracks.items);
    } catch (error) {
      console.log("VAMO GREMIO");
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

  //Fetch the album tracks in the API
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

  //Store the albums tracks and infos to the DB

  static async storeTracksInDatabase(tracks: any[], albumId: string) {
    if (!tracks || tracks.length === 0) {
      console.log("No songs to store");
      return;
    }
    const albumExists = await prisma.albuns_Links.findFirst({
      where: { spotify_album_id: albumId }
    });

    if (!albumExists) {
      throw new Error("Album not found!");
    }

    for (const trackInfo of tracks) {
      try {
        const track = await prisma.song.create({
          data: {
            song_name: trackInfo.name,
            albumId: albumExists.albumId,
            songs_links: {
              create: {
                spotify_song_id: trackInfo.id,
                spotify_link: trackInfo.external_urls.spotify
              }
            }
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

    const albumExists = await prisma.albuns_Links.findFirst({
      where: { deezer_album_id: albumId }
    });

    if (!albumExists) {
      throw new Error("Album not found!");
    }

    for (const tracksInfo of tracks) {
      try {
        const verifyTrackDB = await prisma.song.findFirst({
          where: { song_name: tracksInfo.title_short }
        });

        if (verifyTrackDB) {
          const trackInfoDeezer = await prisma.songs_Links.update({
            where: { songId: verifyTrackDB.id },
            data: {
              deezer_song_id: tracksInfo.id.toString(),
              deezer_link: tracksInfo.link
            }
          });

          console.log("Deezer info stored:", trackInfoDeezer);
        } else {
          console.log("Track not found:", tracksInfo.title);
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
          songs_links: true,
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
          singles_links: true,
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
