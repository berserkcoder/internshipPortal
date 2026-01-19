import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { getRecruiterJobs, createJob, updateJob, deleteJob, getAllJobs, getJobById } from "../controllers/job.controllers.js";



const router = Router()

// Public routes
router.route("/").get(getAllJobs)

// Specific routes before /:id
router.route("/my").get(verifyJWT,requireRecruiter,getRecruiterJobs)

// Generic :id routes must come AFTER specific routes
router.route("/:id").get(verifyJWT,getJobById)
router.route("/:id").patch(verifyJWT,requireRecruiter,updateJob)
router.route("/:id").delete(verifyJWT,requireRecruiter,deleteJob)

// Create route
router.route("/").post(verifyJWT,requireRecruiter,createJob)

export default router