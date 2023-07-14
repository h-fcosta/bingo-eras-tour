import { Request, Response } from "express";
import redisClient from "../db/redis";
import api from "../api";
import prisma from "../db/dbConnect";

export default class SingleController {
  static async fetchAndStoreSingle(req: Request, res: Response) {
    const artistId = req.params.artistId;

    try {
      const singles = await SingleController.fetchSinglesFromSpotify(artistId);
      await SingleController.storeSinglesInDatabase(singles.items);

      return res.json(singles.items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async fetchSinglesFromSpotify(artistId: string) {
    try {
      const accessToken = await redisClient.get("accessToken");

      const response = await api.get(
        `/artists/${artistId}/albums?market=BR&include_groups=single&limit=50`,
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

  static async storeSinglesInDatabase(singles: any[]) {
    if (!singles || singles.length === 0) {
      console.log("No songs to store");
      return;
    }

    for (const singleInfo of singles) {
      try {
        const single = await prisma.single.create({
          data: {
            spotify_single_id: singleInfo.id,
            single_name: singleInfo.name,
            spotify_link: singleInfo.external_urls.spotify
          }
        });

        console.log("Single stored", single);
      } catch (error) {
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
