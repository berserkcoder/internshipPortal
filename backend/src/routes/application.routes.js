import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {applyForJob} from "../controllers/application.controllers.js"
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { requireResume } from "../middlewares/requireResume.middlewares.js";

const router = Router()

router.route("/:id").post(verifyJWT,requireCandidate,requireResume,applyForJob)

export default router