import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Application} from "../models/application.models.js";
import mongoose from "mongoose";
import { Resume } from "../models/resume.models.js";

const uploadResume = asyncHandler(async(req,res)=>{
    /*
    
    */
   const candidate = req.user._id
   const resume = await Resume.create({candidate})
   if(!resume) {
    throw new ApiError(500,"some error occured while uploading resume")
   }
   return res.status(200).json(new ApiResponse(200,{},"resume uploaded successfully"))
})

export {uploadResume}