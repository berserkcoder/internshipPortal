import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { requireAdmin } from "../middlewares/requireAdmin.middlewares.js";
import { requireRecruiter } from "../middlewares/requireRecruiter.middlewares.js";
import { requireCandidate } from "../middlewares/requireCandidate.middlewares.js";
import { getRecruiterJobs, createJob, updateJob, deleteJob, getAllJobs, getJobById } from "../controllers/job.controllers.js";



const router = Router()

router.route("/my").get(verifyJWT,requireRecruiter,getRecruiterJobs)
router.route("/").post(verifyJWT,requireRecruiter,createJob)
router.route("/:id").patch(verifyJWT,requireRecruiter,updateJob)
router.route("/:id").delete(verifyJWT,requireRecruiter,deleteJob)

router.route("/").get(getAllJobs)
router.route("/:id").get(getJobById)

export default router