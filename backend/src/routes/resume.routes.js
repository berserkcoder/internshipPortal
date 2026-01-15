import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {applyForJob} from "../controllers/application.controllers.js"
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { getRecruiterJobs, createJob, updateJob, deleteJob, getAllJobs, getJobById } from "../controllers/job.controllers.js";
import { uploadResume } from "../controllers/resume.controllers.js";

const router = Router()

router.route("/upload").post(verifyJWT,requireCandidate,uploadResume)

export default router