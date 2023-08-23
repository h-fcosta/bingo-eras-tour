import { Request, Response } from "express";
import redisClient from "../db/redis";
import { apiDeezer, apiSpotify } from "../api";
import prisma from "../db/dbConnect";

export default class SingleController {
  static async fetchAndStoreSingle(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const singles = await SingleController.fetchSinglesFromSpotify(artistId);
      await SingleController.storeSinglesInDatabase(singles.items);

      return res.json(singles.items);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchAndStoreSingleDeezerInfo(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const singles = await SingleController.fetchSinglesInfoDeezer(artistId);
      await SingleController.storeSinglesInfoInDatabase(singles.data);

      return res.json(singles.data);
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
          const single = await prisma.singles_Links.update({
            where: { singleId: verifySingleDb.id },
            data: {
              deezer_single_id: singleInfo.id.toString(),
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
