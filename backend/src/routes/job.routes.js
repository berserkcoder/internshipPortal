import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { getJobs, createJob } from "../controllers/job.controllers.js";



const router = Router()

router.route("/").get(verifyJWT,requireAdmin,getJobs)
router.route("/my").post(verifyJWT,requireRecruiter,createJob)

export default router