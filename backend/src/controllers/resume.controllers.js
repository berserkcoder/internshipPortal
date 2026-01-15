import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Application} from "../models/application.models.js";
import mongoose from "mongoose";
import { Resume } from "../models/resume.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadResume = asyncHandler(async(req,res)=>{
    /*
    
    */
   const candidate = req.user._id
   const check = await Resume.findOne({candidate})
   if(check){
     throw new ApiError(400,"you can upload only one resume")
   }

   const resumeLocalPath = req.file.path

//    console.log(req.body)
//    console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET)
//    console.log(req.file)

   if(!resumeLocalPath) {
        throw new ApiError(400, "Resume is required")
    }

    const resume = await uploadOnCloudinary(resumeLocalPath)

    if(!resume){
        throw new ApiError(400, "Resume is not uploaded on cloudinary")
    }

   const uploadedResume = await Resume.create({
        candidate,
        fileUrl : resume.secure_url,
        fileName : req.file.originalname,
        fileSize : req.file.size,
        mimeType : req.file.mimetype
   })
   if(!uploadedResume) {
    throw new ApiError(500,"some error occured while uploading resume")
   }
   return res.status(200).json(new ApiResponse(200,uploadedResume,"resume uploaded successfully"))
})

export {uploadResume}