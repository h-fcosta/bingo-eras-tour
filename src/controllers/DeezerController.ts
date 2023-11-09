import { Request, Response } from "express";
import { apiDeezer } from "../api";
import prisma from "../db/dbConnect";

export default class DeezerController {
  //ALBUMS METHODS
  static async fetchAndStoreAlbumInfoFromDeezer(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const albums = await DeezerController.fetchAlbumsFromDeezer(artistId);
      await DeezerController.storeAlbumsInfoDeezerInDatabase(albums.data);

      return res.json(albums.data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchAlbumsFromDeezer(artistId: string) {
    try {
      const response = await apiDeezer.get(
        `/artist/${artistId}/albums?index=0&limit=110`
      );

      return response.data;
    } catch (error: any) {
      console.log("Error:", error);
    }
  }

  static async storeAlbumsInfoDeezerInDatabase(albums: any[]): Promise<void> {
    for (const albumInfo of albums) {
      try {
        const existingAlbum = await prisma.album.findFirst({
          where: { album_name: albumInfo.title }
        });

        console.log("ALBUM", existingAlbum);

        if (existingAlbum) {
          const album = await prisma.links.update({
            where: { albumId: existingAlbum.id },
            data: {
              deezer_id: albumInfo.id.toString(),
              deezer_link: albumInfo.link
            }
          });

          console.log("Deezer info stored:", album);
        }
      } catch (error: any) {
        console.error("Error", error);
      }
    }
  }

  //ALBUMS TRACKS METHODS
  static async fetchAndStoreAlbumTracksInfoDeezer(req: Request, res: Response) {
    const albumId = req.params.albumId;
    try {
      const tracks = await DeezerController.fetchAlbumTracksInfoFromDeezer(
        albumId
      );
      await DeezerController.storeTracksInfoInDatabase(tracks.data, albumId);

      return res.json(tracks.data);
    } catch (error: any) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
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

  static async storeTracksInfoInDatabase(tracks: any[], albumId: string) {
    if (!tracks || tracks.length === 0) {
      console.log("No songs to store");
      return;
    }

    const albumExists = await prisma.links.findFirst({
      where: { deezer_id: albumId }
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
          const track = await prisma.links.update({
            where: { songId: verifyTrackDB.id },
            data: {
              deezer_id: tracksInfo.id.toString(),
              deezer_link: tracksInfo.link
            }
          });

          console.log("Deezer info stored:", track);
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

  //SINGLES METHODS
  static async fetchAndStoreSingleDeezerInfo(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const singles = await DeezerController.fetchSinglesInfoDeezer(artistId);
      await DeezerController.storeSinglesInfoInDatabase(singles.data);

      return res.json(singles.data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchSinglesInfoDeezer(artistId: string) {
    try {
      const response = await apiDeezer.get(
        `/artist/${artistId}/albums?index=0&limit=110`
      );

      return response.data;
    } catch (error: any) {
      console.error("Erro: ", error);
    }
  }

  static async storeSinglesInfoInDatabase(singles: any[]) {
    if (!singles || singles.length == 0) {
      console.log("No singles to store");
      return;
    }

    const filteredSingles = singles.filter(
      (singles) => singles.record_type === "single"
    );

    for (const singleInfo of filteredSingles) {
      try {
        const verifySingleDb = await prisma.single.findFirst({
          where: { single_name: singleInfo.title }
        });

        if (verifySingleDb) {
          const single = await prisma.links.update({
            where: { singleId: verifySingleDb.id },
            data: {
              deezer_id: singleInfo.id.toString(),
              deezer_link: singleInfo.link
            }
          });

          console.log("Deezer info stored:", single);
        }
      } catch (error: any) {
        if (
          error.code === "P2002" &&
          error.meta.target.includes("deezer_single_id")
        ) {
          console.log("Duplicate track ignored:", singleInfo.title);
        } else {
          console.error("Error:", error);
        }
      }
    }
  }
}
