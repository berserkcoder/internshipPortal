import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Application} from "../models/application.models.js";
import mongoose from "mongoose";
import { Resume } from "../models/resume.models.js";
import { Job } from "../models/job.models.js";

const applyForJob = asyncHandler(async(req,res)=>{
    /*
    -> verify candidate role
    -> verify job exists and open
    -> check resume exists and belongs to candidate
    -> create application
    -> increment jobs applicationCount 
    -> handle duplicate apply error cleanly
    -> return response
    */
   const candidate = req.user._id
   const jobId = req.params.id
   if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid job ID");
    }
   const job = await Job.findById(jobId)
   const recruiter = job.recruiter
   const resume = await Resume.findOne({
           candidate
    })
    
    
    if(!job){
        throw new ApiError(404,"Job not found")
    }
    if(job.status !== "open"){
        throw new ApiError(400,"Cannot apply to closed job")
    }
    if(!resume){
        throw new ApiError(400,"Resume not found for candidate")
    }

    const applied = await Application.create({
        candidate,
        recruiter,
        job : jobId,
        resume : resume._id
    })

    if(!applied){
        throw new ApiError(500,"Internal server error while applying")
    }
    await Job.findByIdAndUpdate(
        job._id,
        { $inc: { applicationCount: 1 } },
        { new: true }
    )
    return res.status(200).json(new ApiResponse(200,applied,"Applied for job successfully"))
})

export {applyForJob}