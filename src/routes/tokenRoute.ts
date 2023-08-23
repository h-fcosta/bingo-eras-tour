import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();

router.get("/token", AuthController.getAccessToken);

export default router;
