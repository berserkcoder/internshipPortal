import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import {Job} from "../models/job.models.js";

const getJobs = asyncHandler(async(requestAnimationFrame,res)=> {
    /*
    -> fetch jobs from db
    -> return res
    */
    const recruiter = req.user._id
    const jobs =  await Job.find({recruiter})
    return res.status(200).json(new ApiResponse(200,"Jobs fetched successfully",jobs))
})

const createJob = "";

export {getJobs, createJob};