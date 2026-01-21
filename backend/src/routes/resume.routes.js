import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {applyForJob} from "../controllers/application.controllers.js"
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { getRecruiterJobs, createJob, updateJob, deleteJob, getAllJobs, getJobById } from "../controllers/job.controllers.js";
import { uploadResume,getResume,deleteResume } from "../controllers/resume.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {requireResume} from "../middlewares/requireResume.middlewares.js"

const router = Router()

// Specific routes BEFORE generic :id routes
router.route("/uploadResume").post(verifyJWT,requireCandidate,upload.single("resume"),uploadResume)
router.route("/me").get(verifyJWT,requireCandidate,getResume)

// Generic :id routes AFTER specific routes
// router.route("/:id").patch(verifyJWT,requireCandidate,requireResume,upload.single("updatedResume"),updateResume)
router.route("/:id").delete(verifyJWT,requireCandidate,requireResume,deleteResume)

export default router