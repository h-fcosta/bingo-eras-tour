import { Request, Response } from "express";
import redisClient from "../db/redis";
import { apiDeezer, apiSpotify } from "../api";
import prisma from "../db/dbConnect";

export default class AlbumController {
  //Get the artist's ID from the URL
  static async fetchAndStoreAlbum(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const albums = await AlbumController.fetchAlbumsFromSpotify(artistId);
      await AlbumController.storeAlbumsInDatabase(albums.items);

      return res.json(albums.items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchAndStoreAlbumDeezer(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const albums = await AlbumController.fetchAlbumsFromDeezer(artistId);
      await AlbumController.storeAlbumsInfoInDatabase(albums.data);

      return res.json(albums.data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Fetching the artist's albums in the API
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

  static async fetchAlbumsFromDeezer(artistId: string) {
    try {
      const response = await apiDeezer.get(`/artist/${artistId}/albums`);

      return response.data;
    } catch (error: any) {
      console.log("Error: erro");
    }
  }

  //Store the albums data to the DB
  static async storeAlbumsInDatabase(albums: any[]) {
    if (!albums || albums.length === 0) {
      console.log("No albums to store");
      return;
    }

    for (const albumInfo of albums) {
      try {
        const album = await prisma.album.create({
          data: {
            spotify_album_id: albumInfo.id,
            album_name: albumInfo.name,
            spotify_link: albumInfo.external_urls.spotify,
            release_date: albumInfo.release_date
          }
        });

        console.log("Album stored", album);
      } catch (error: any) {
        if (
          error.code === "P2002" &&
          error.meta.target.includes("spotify_album_id")
        ) {
          console.log("Duplicate album ignored:", albumInfo.name);
        } else {
          console.error("Error:", error);
        }
      }
    }
  }

  static async storeAlbumsInfoInDatabase(albums: any[]): Promise<void> {
    for (const albumApi of albums) {
      try {
        const { id, title, link } = albumApi;

        const verifyAlbumDB = await prisma.album.findFirst({
          where: { album_name: title }
        });

        if (verifyAlbumDB) {
          try {
            const albumInfoDeezer = await prisma.albuns_Links.create({
              data: {
                deezer_album_id: JSON.stringify(id),
                deezer_link: link,
                albumId: verifyAlbumDB.id
              }
            });
            console.log("Deezer info stored:", albumInfoDeezer);
          } catch (error: any) {
            console.error(error);
          }
        }
      } catch (error: any) {}
    }
  }
}
