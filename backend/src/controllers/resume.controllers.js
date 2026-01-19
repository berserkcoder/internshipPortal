import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Resume } from "../models/resume.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadResume = asyncHandler(async(req,res)=>{
    /*
    
    */
   const candidate = req.user._id
   const check = await Resume.findOne({candidate})
   if(check){
     throw new ApiError(400,"you can upload only one resume")
   }

   if (!req.file) {
        throw new ApiError(400, "Resume file is required");
    }

   const resumeLocalPath = req.file?.path

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
        cloudinaryPublicId : resume.public_id,
        fileUrl : resume.secure_url,
        fileName : req.file.originalname,
        fileSize : req.file.size,
        mimeType : req.file.mimetype
   })
   if(!uploadedResume) {
    throw new ApiError(500,"some error occured while uploading resume")
   }
   return res.status(201).json(new ApiResponse(201,uploadedResume,"resume uploaded successfully"))
})

const getResume = asyncHandler(async(req,res)=>{
    const candidate = req.user._id
    const resume = await Resume.findOne({candidate})
    if(!resume){
        throw new ApiError(404,"Resume not found please upload your resume first")
    }
    res.status(200).json(new ApiResponse(200,resume,"Resume fetched successfully"))
})

const updateResume = asyncHandler(async(req,res)=>{
    const candidate = req.user._id
    const resumeId = req.params.id

    const resume = await Resume.findOne({_id:resumeId,candidate})
    const publicId = resume.cloudinaryPublicId

    if (!req.file) {
        throw new ApiError(400, "Resume file is required");
    }

    const resumeLocalPath = req.file?.path

    if(!resumeLocalPath) {
        throw new ApiError(400, "Resume is required")
    }
    const updatedResume = await uploadOnCloudinary(resumeLocalPath)

    if(!updatedResume){
        throw new ApiError(400, "Resume is not uploaded on cloudinary")
    }

   const currentResume = await Resume.findOneAndUpdate({
        _id : resumeId,candidate
   },
    {
        candidate,
        cloudinaryPublicId : updatedResume.public_id,
        fileUrl : updatedResume.secure_url,
        fileName : req.file.originalname,
        fileSize : req.file.size,
        mimeType : req.file.mimetype
   },{new:true})
   if(!currentResume) {
    throw new ApiError(500,"some error occured while uploading resume")
   }
   await deleteFromCloudinary(publicId)
   return res.status(200).json(new ApiResponse(200,currentResume,"resume updated successfully"))
})

const deleteResume = asyncHandler(async(req,res)=>{
    const resumeId = req.params.id
    const candidate = req.user._id
    console.log('Delete resume called with resumeId:', resumeId, 'candidate:', candidate);
    
    const resume = await Resume.findOne({_id : resumeId,candidate})
    console.log('Found resume:', resume);
    
    if(!resume){
        console.log('Resume not found');
        throw new ApiError(404,"Resume not found")
    }
    
    console.log('Deleting from cloudinary:', resume.cloudinaryPublicId);
    await deleteFromCloudinary(resume.cloudinaryPublicId)
    
    const deletedResume = await Resume.findOneAndDelete({_id : resumeId,candidate})
    console.log('Deleted resume:', deletedResume);
    
    return res.status(200).json(new ApiResponse(200,deletedResume,"resume deleted successfully"))
})


export {uploadResume,getResume,updateResume,deleteResume}