import { createClient } from "redis";
import dotEnv from "dotenv";

dotEnv.config();

const redisClient = createClient({
  // url: process.env.REDIS_URL
});

redisClient.on("connect", () => {
  console.log("Connected on Redis");
});

redisClient.on("error", (err) => {
  console.error("Error connecting to Redis", err);
});

redisClient.connect();

export default redisClient;
