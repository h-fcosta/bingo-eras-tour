import express, { Request, Response } from "express";
import spotify from "./spotifyRoutes";
import deezer from "./deezerRoutes";

const routes = (app: express.Application) => {
  app.route("/").get((req: Request, res: Response) => {
    res
      .status(200)
      .json({ message: "Taylor Swift's The Eras Tour Surprise Song Bingo" });
  });
  app.use(express.json(), spotify, deezer);
};

export default routes;
