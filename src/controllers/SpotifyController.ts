import { Request, Response } from "express";
import { getAccessToken } from "../spotify-auth";
import redisClient from "../db/redis";

export default class SpotifyController {
  //Get Access Token from Spotify
  static async getAccessToken(req: Request, res: Response) {
    try {
      const clientId = process.env.SPOTIFY_API_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

      const accessToken = await getAccessToken(clientId, clientSecret);
      redisClient.set("accessToken", accessToken);

      return res.status(200).json(accessToken);
    } catch (error) {
      console.error("Error retrieving access token:", error);

      res.status(500).json({ message: "Error retrieving access token" });
    }
  }
}
