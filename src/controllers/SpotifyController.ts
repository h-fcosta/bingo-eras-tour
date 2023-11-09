import { Request, Response } from "express";
import redisClient from "../db/redis";
import { apiSpotify } from "../api";
import prisma from "../db/dbConnect";

export default class SpotifyController {
  //ALBUNS METHODS
  static async fetchAndStoreAlbumFromSpotify(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const albums = await SpotifyController.fetchAlbumsFromSpotify(artistId);
      await SpotifyController.storeAlbumsInDatabase(albums.items);

      return res.json(albums.items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchAlbumsFromSpotify(artistId: string) {
    try {
      const accessToken = await redisClient.get("accessToken");

      const response = await apiSpotify.get(
        `/artists/${artistId}/albums?market=BR&include_groups=album&limit=30`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro: ", error);
    }
  }

  static async storeAlbumsInDatabase(albums: any[]) {
    if (!albums || albums.length === 0) {
      console.log("No albums to store");
      return;
    }

    console.log(albums);

    for (const albumInfo of albums) {
      try {
        const album = await prisma.album.create({
          data: {
            album_name: albumInfo.name,
            release_date: albumInfo.release_date,
            links: {
              create: {
                spotify_id: albumInfo.id,
                spotify_link: albumInfo.external_urls.spotify
              }
            }
          }
        });

        console.log("Album Stored:", album);
      } catch (error: any) {
        if (
          error.code === "P2002" &&
          error.meta.target.includes("album_name")
        ) {
          console.log("Duplicate album ignored:", albumInfo.name);
        } else {
          console.error("Error:", error);
        }
      }
    }
  }

  //ALBUM TRACKS METHODS
  static async fetchAndStoreAlbumTracksFromSpotify(
    req: Request,
    res: Response
  ) {
    const albumId = req.params.albumId;

    try {
      const tracks = await SpotifyController.fetchAlbumTracksFromSpotify(
        albumId
      );
      await SpotifyController.storeTracksInDatabase(tracks.items, albumId);

      return res.json(tracks.items);
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

  static async storeTracksInDatabase(tracks: any[], albumId: string) {
    if (!tracks || tracks.length === 0) {
      console.log("No songs to store");
      return;
    }
    const albumExists = await prisma.links.findFirst({
      where: { spotify_id: albumId }
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
            links: {
              create: {
                spotify_id: trackInfo.id,
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

  //SINGLES METHODS
  static async fetchAndStoreSingleFromSpotify(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const singles = await SpotifyController.fetchSinglesFromSpotify(artistId);
      await SpotifyController.storeSinglesInDatabase(singles.items);

      return res.json(singles.items);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchSinglesFromSpotify(artistId: string) {
    try {
      const accessToken = await redisClient.get("accessToken");

      const response = await apiSpotify.get(
        `/artists/${artistId}/albums?market=BR&include_groups=single&offset=25&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Erro: ", error);
    }
  }

  static async storeSinglesInDatabase(singles: any[]) {
    if (!singles || singles.length === 0) {
      console.log("No songs to store");
      return;
    }

    for (const singleInfo of singles) {
      try {
        const single = await prisma.single.create({
          data: {
            single_name: singleInfo.name,
            singles_links: {
              create: {
                spotify_single_id: singleInfo.id,
                spotify_link: singleInfo.external_urls.spotify
              }
            }
          }
        });

        console.log("Single stored", single);
      } catch (error: any) {
        if (
          error.code === "P2002" &&
          error.meta.target.includes("spotify_single_id")
        ) {
          console.log("Duplicate single ignored:", singleInfo.name);
        } else {
          console.error("Error:", error);
        }
      }
    }
  }
}
