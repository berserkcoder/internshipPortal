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

const applicantsByJobId = asyncHandler(async (req, res) => {
    const jobId = req.params.id
    const recruiterId = req.user._id

    // 1. Verify job ownership
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId })
    if (!job) {
        throw new ApiError(
            403,
            "You are not authorized to view applications for this job"
        )
    }

    // 2. Fetch applications with required references
    const applications = await Application.find({ job: jobId })
        .populate("candidate", "fullName email")
        .populate("resume", "url")
        .sort({ createdAt: -1 })

    // 3. Shape clean recruiter-safe response
    const formattedApplications = applications.map(app => ({
        applicationId: app._id,
        candidate: {
            id: app.candidate._id,
            name: app.candidate.fullName,
            email: app.candidate.email
        },
        resume: {
            id: app.resume._id,
            url: app.resume.url
        },
        status: app.status,
        appliedAt: app.createdAt
    }))

    // 4. Final response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobId,
                totalApplications: formattedApplications.length,
                applications: formattedApplications
            },
            "Applications fetched successfully"
        )
    )
})

const statusUpdate = asyncHandler(async(req,res)=>{
    const applicationId = req.params.id
    const recruiterId = req.user._id
    const {status} = req.body

    // 1. Verify job ownership
    const application = await Application.findOne({ _id: applicationId, recruiter: recruiterId })
    if (!application) {
        throw new ApiError(
            403,
            "You are not authorized to update this application"
        )
    }

    if(!status){
        throw new ApiError(400,"Status should be updated")
    }

    const updatedApplication = await Application.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true, runValidators: true }
    )
    if(!updatedApplication){
        throw new ApiError(500,"Internal server error while updating application status")
    }
    return res.status(200).json(new ApiResponse(200,updatedApplication,"application status updated successfully"))
})

const applicationByCandidateId = asyncHandler(async(req,res)=>{
    const candidate = req.user._id
    const applications = await Application.find({candidate})
                        .populate("job", "title companyName")
                        .sort({createdAt : -1})

    const formattedApplications = applications.map(app => ({
        applicationId: app._id,
        job : {
            id : app.job._id,
            title : app.job.title,
            companyName : app.job.companyName
        },
        status: app.status,
        appliedAt: app.createdAt
    }))
    return res.status(200)
              .json(new ApiResponse(
                200,
                {
                    totalApplications : formattedApplications.length,
                    applications : formattedApplications
                },
                "All applications of this candidate fetched successfully"
        ))
})

export {applyForJob,applicantsByJobId,statusUpdate,applicationByCandidateId}