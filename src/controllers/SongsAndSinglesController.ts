import { Request, Response } from "express";
import prisma from "../db/dbConnect";

export default class SongAndSinglesController {
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
