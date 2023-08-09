import express from "express";
import dotEnv from "dotenv";
import routes from "./src/routes";
import cors from "cors";
import prisma from "./src/db/dbConnect";

dotEnv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
routes(app);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

prisma
  .$connect()
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("Error connecting to DB:", err));
