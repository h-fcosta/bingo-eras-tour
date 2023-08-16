import axios from "axios";
import dotEnv from "dotenv";

dotEnv.config();

export const apiSpotify = axios.create({
  baseURL: process.env.SPOTIFY_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const apiDeezer = axios.create({
  baseURL: process.env.DEEZER_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});
