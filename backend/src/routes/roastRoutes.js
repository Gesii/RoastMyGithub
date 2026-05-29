import { Router } from "express";
import { roastUser } from "../controllers/roastController.js";

const router = Router();

router.post("/roast", roastUser);

export default router;
