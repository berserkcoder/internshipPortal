import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Job} from "../models/job.models.js";
import { Application } from "../models/application.models.js";
import mongoose from "mongoose";

const getAllJobs = asyncHandler(async(req,res)=>{
    const status = "open"
    const jobs = await Job.find({status,expiresAt: { $gt: new Date() }}).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200,jobs,"All jobs fetched successfully"))
})

const getJobById = asyncHandler(async(req,res) => {
    const _id = req.params.id
    const candidate = req.user?._id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new ApiError(400, "Invalid job ID");
    }
    const job = await Job.findOne({
        _id,
        status: "open",
        expiresAt: { $gt: new Date() }
    });
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    const applicant = await Application.findOne({candidate,job : _id})

    let applied = false
    if(candidate) {
        const applicant = await Application.findOne({candidate,job : _id})
        if(applicant) applied = true
    }

    return res.status(200).json(new ApiResponse(200,{...job.toObject(),alreadyApplied:applied},"job fetched successfully"))
})

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
    
    console.log('Creating job with data:', {title,description,requiredSkills,jobType,location,isRemote,experienceLevel,companyName,salaryRange,expiresAt});
    
    if(!title || !description || !jobType || !location || !companyName) {
        throw new ApiError(400,"All required fields must be provided")
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
        throw new ApiError(400, "At least one skill is required");
    }
    if (!["draft", "open"].includes(status)) {
        throw new ApiError(400, "Invalid job status");
    }

    try {
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
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            throw new ApiError(400, messages.join(', '));
        }
        throw error;
    }
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
    console.log('Delete job called with ID:', _id, 'Recruiter:', recruiter);
    
    if(!mongoose.Types.ObjectId.isValid(_id)){
        console.log('Invalid job ID:', _id);
        throw new ApiError(400, "job not exist")
    }
    
    const job = await Job.findOne({_id, recruiter})
    console.log('Found job for deletion:', job);
    
    if(!job){
        console.log('Job not found or no permission');
        throw new ApiError(400,"Job not found or you dont have permission to delete it")
    }

    job.status = "closed"
    await job.save()
    
    // const deletedJob = await Job.findByIdAndDelete(_id)
    // console.log('Deleted job:', deletedJob);
    
    return res.status(200)
    .json(new ApiResponse(
        200,
        {},
        "Job deleted successfully"
    ))
}) 

export {getRecruiterJobs, createJob, updateJob, deleteJob, getAllJobs, getJobById};