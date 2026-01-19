import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {applyForJob,applicantsByJobId,statusUpdate,applicationByCandidateId} from "../controllers/application.controllers.js"
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { requireResume } from "../middlewares/requireResume.middlewares.js";

const router = Router()

// Specific routes BEFORE generic :id routes
router.route("/me").get(verifyJWT,requireCandidate,applicationByCandidateId)
router.route("/job/:id").get(verifyJWT,requireRecruiter,applicantsByJobId)

// Generic :id routes AFTER specific routes
router.route("/:id").post(verifyJWT,requireCandidate,requireResume,applyForJob)
router.route("/:id/status").patch(verifyJWT,requireRecruiter,statusUpdate)

export default router