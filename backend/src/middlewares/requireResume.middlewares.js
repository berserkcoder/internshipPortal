import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {Resume} from "../models/resume.models.js"

export const requireResume = asyncHandler(async(req,res,next)=>{
    const candidate = req.user._id
    const resume = await Resume.findOne({
        candidate
    })
    if(!resume){
        throw new ApiError(400,"Upload resume before applying")
    }
    next()
})