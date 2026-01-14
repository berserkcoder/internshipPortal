import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Job} from "../models/job.models.js";
import mongoose from "mongoose";

const getRecruiterJobs = asyncHandler(async(req,res)=> {
    /*
    -> fetch jobs from db
    -> return res
    */
    const recruiter = req.user._id
    const jobs =  await Job.find({recruiter}).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200,jobs,"Jobs fetched successfully"))
})

const createJob = asyncHandler(async(req,res)=> {
    /*
    -> get job details from req body
    -> validate job details
    -> save job to db
    -> return res
    */
    const recruiter = req.user._id
    const {title,description,requiredSkills,jobType,location,isRemote,experienceLevel,companyName,salaryRange,expiresAt} = req.body
    const { status = "draft" } = req.body
    if(!title || !description || !jobType || !location || !companyName) {
        throw new ApiError(400,"All required fields must be provided")
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
        throw new ApiError(400, "At least one skill is required");
    }
    if (!["draft", "open"].includes(status)) {
        throw new ApiError(400, "Invalid job status");
    }

    const job = await Job.create({
        title,
        description,
        requiredSkills,
        jobType,
        location,
        isRemote,
        experienceLevel,
        companyName,
        salaryRange,
        expiresAt,
        recruiter,
        status
    })
    return res.status(201).json(new ApiResponse(201,job,"Job created successfully"))
})

const updateJob = asyncHandler(async(req,res)=> {
    /*
    -> get job id from req params and job details from req body
    -> validate job details
    -> check if job exists and belongs to recruiter
    -> update job in db
    -> return res
    */
    const _id = req.params.id
    const recruiter = req.user._id
    const {title,description,requiredSkills,jobType,location,isRemote,experienceLevel,companyName,salaryRange,expiresAt,status} = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new ApiError(400, "Invalid job ID");
    }
    
    const currentJob = await Job.findOne({_id,recruiter})

    if (!currentJob) {
        throw new ApiError(404, "Job not found or access denied");
    }

    if (currentJob.status === "closed") {
        throw new ApiError(400, "Closed jobs cannot be modified");
    }



    if (
        title === undefined &&
        description === undefined &&
        requiredSkills === undefined &&
        jobType === undefined &&
        location === undefined &&
        isRemote === undefined &&
        experienceLevel === undefined &&
        companyName === undefined &&
        salaryRange === undefined &&
        expiresAt === undefined &&
        status === undefined
    ) {
        throw new ApiError(400, "At least one field is required to update");
    }

    const updateFields = {}
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (requiredSkills !== undefined) {
        if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
            throw new ApiError(400, "At least one skill is required");
        }
        updateFields.requiredSkills = requiredSkills;
    }
    if (jobType !== undefined) updateFields.jobType = jobType;
    if (location !== undefined) updateFields.location = location
    if (isRemote !== undefined) updateFields.isRemote = isRemote;
    if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;
    if (companyName !== undefined) updateFields.companyName = companyName;
    if (salaryRange !== undefined) updateFields.salaryRange = salaryRange;
    if (expiresAt !== undefined) updateFields.expiresAt = expiresAt;
    if (status !== undefined) updateFields.status = status;


    const job = await Job.findByIdAndUpdate(
        { _id, recruiter},
        { $set: updateFields },
        { new: true, runValidators: true }
    )

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res.status(200).json(
        new ApiResponse(200, job, "Job updated successfully")
    );
})

const deleteJob = asyncHandler(async(req,res) => {
    const _id = req.params.id
    const recruiter = req.user._id
    if(!mongoose.Types.ObjectId.isValid(_id)){
        throw new ApiError(400, "job not exist")
    }
    const deletedJob = await Job.findByIdAndDelete({_id,recruiter})
    if(!deletedJob){
        throw new ApiError(400,"Job not found or you dont have permission to delete it")
    }
    return res.status(200)
    .json(new ApiResponse(
        200,
        deletedJob,
        "Job deleted successfully"
    ))
}) 

export {getRecruiterJobs, createJob, updateJob, deleteJob};