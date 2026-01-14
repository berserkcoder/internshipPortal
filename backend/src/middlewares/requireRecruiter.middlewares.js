import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"

export const requireRecruiter = asyncHandler(async(req,res,next)=>{
    if(!req.user || req.user.role !== "recruiter"){
        throw new ApiError(403,"recruiter access required")
    }
    if(req.user.accountStatus !== "active"){
        throw new ApiError(403,"Your account is not active. Please contact admin.")
    }
    next()
})